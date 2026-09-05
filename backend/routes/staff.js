import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

// GET /staff or GET /staff?role=Chef
router.get("/", async (req, res) => {
  try {
    const { role } = req.query;
    const staff = await prisma.staff.findMany({
      where: role ? { role } : undefined,
    });
    res.json(staff);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch staff" });
  }
});

export default router;