import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

// GET /orders - most recent first, with items + menu item details attached
router.get("/", async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: { include: { menuItem: true } } },
    });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// POST /orders
// body: { items: [{ menuItemId: 1, quantity: 2 }, ...] }
router.post("/", async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Order must include at least one item" });
    }

    const menuItemIds = items.map((i) => i.menuItemId);
    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds } },
    });

    if (menuItems.length !== items.length) {
      return res.status(400).json({ error: "One or more menu items not found" });
    }

    let total = 0;
    let waitingTime = 0;

    const orderItemsData = items.map((item) => {
      const menuItem = menuItems.find((m) => m.id === item.menuItemId);
      total += menuItem.price * item.quantity;
      waitingTime = Math.max(waitingTime, menuItem.prepTime);
      return {
        menuItemId: menuItem.id,
        quantity: item.quantity,
        price: menuItem.price,
      };
    });

    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
        total,
        waitingTime,
        status: "Pending",
        items: { create: orderItemsData },
      },
      include: { items: { include: { menuItem: true } } },
    });

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to place order" });
  }
});

// PATCH /orders/:id — used for assigning chef/bartender, status changes,
// ratings/complaints, and marking paid
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.update({
      where: { id },
      data: req.body,
      include: { items: { include: { menuItem: true } } },
    });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update order" });
  }
});

export default router;