const express = require("express");
const { readDb, updateDb } = require("../utils/store");

const router = express.Router();

router.get("/", async (req, res) => {
  const db = await readDb();
  const users = db.users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone || "-",
    orders: u.orders || 0,
    totalSpent: u.totalSpent || 0,
    joinDate: u.joinDate,
    status: u.status || "active",
    avatar: u.avatar || (u.name || "U").slice(0, 2).toUpperCase(),
    role: u.role || "user",
  }));

  res.json({ success: true, data: users });
});

router.patch("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowed = ["active", "inactive", "blocked"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  let updated = null;
  await updateDb((db) => {
    db.users = db.users.map((u) => {
      if (u.id === id) {
        updated = { ...u, status };
        return updated;
      }
      return u;
    });
    return db;
  });

  if (!updated) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  return res.json({ success: true, data: updated });
});

module.exports = router;
