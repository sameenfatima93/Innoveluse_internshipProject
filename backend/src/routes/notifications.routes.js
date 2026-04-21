const express = require("express");
const { readDb, updateDb } = require("../utils/store");

const router = express.Router();

router.get("/", async (req, res) => {
  const db = await readDb();
  res.json({ success: true, data: db.notifications });
});

router.post("/mark-all-read", async (req, res) => {
  const db = await updateDb((state) => {
    state.notifications = state.notifications.map((n) => ({ ...n, read: true }));
    return state;
  });

  res.json({ success: true, data: db.notifications });
});

module.exports = router;
