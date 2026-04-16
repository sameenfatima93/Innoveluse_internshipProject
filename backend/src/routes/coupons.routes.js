const express = require("express");
const { readDb, updateDb } = require("../utils/store");

const router = express.Router();

router.get("/", (req, res) => {
  const db = readDb();
  res.json({ success: true, data: db.coupons });
});

router.post("/", (req, res) => {
  const payload = req.body;
  if (!payload?.code) {
    return res.status(400).json({ success: false, message: "Coupon code required" });
  }

  const db = updateDb((state) => {
    const id = `C${String(state.coupons.length + 1).padStart(3, "0")}`;
    state.coupons.unshift({
      id,
      code: payload.code,
      type: payload.type || "percentage",
      value: Number(payload.value || 0),
      minOrder: Number(payload.minOrder || 0),
      usageLimit: Number(payload.usageLimit || 0),
      usedCount: Number(payload.usedCount || 0),
      expiry: payload.expiry,
      status: payload.status || "active",
    });
    return state;
  });

  return res.status(201).json({ success: true, data: db.coupons[0] });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  let deleted = false;

  updateDb((db) => {
    const before = db.coupons.length;
    db.coupons = db.coupons.filter((c) => c.id !== id);
    deleted = db.coupons.length < before;
    return db;
  });

  if (!deleted) {
    return res.status(404).json({ success: false, message: "Coupon not found" });
  }

  return res.json({ success: true, message: "Coupon deleted" });
});

module.exports = router;
