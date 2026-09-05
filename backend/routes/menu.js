import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const menuItems = await prisma.menuItem.findMany({
      orderBy: { id: "asc" },
    });
    res.json(menuItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
});

export default router;