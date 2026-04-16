const express = require("express");
const { readDb, updateDb } = require("../utils/store");

const router = express.Router();

function formatDate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function generateOrderId(existingOrders) {
  const last = existingOrders.length;
  return `ORD-${String(1000 + last + 1)}`;
}

router.get("/", (req, res) => {
  const db = readDb();
  res.json({ success: true, data: db.orders });
});

router.post("/", (req, res) => {
  const { user, items, amount, shippingAddress, city, phone, paymentMethod } = req.body;

  if (!user?.email || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: "Invalid order payload" });
  }

  const db = updateDb((state) => {
    const order = {
      id: generateOrderId(state.orders),
      customer: user.name,
      email: user.email,
      userId: user.id || null,
      product: items.map((i) => i.name).join(", "),
      items: items.reduce((sum, i) => sum + Number(i.qty || 0), 0),
      amount: Number(amount || 0),
      status: "pending",
      date: formatDate(),
      avatar: (user.name || "US").slice(0, 2).toUpperCase(),
      shippingAddress: shippingAddress || "",
      city: city || "",
      phone: phone || "",
      paymentMethod: paymentMethod || "cod",
      lineItems: items,
    };

    state.orders.unshift(order);

    state.users = state.users.map((u) => {
      if (u.email.toLowerCase() === user.email.toLowerCase()) {
        return {
          ...u,
          orders: (u.orders || 0) + 1,
          totalSpent: (u.totalSpent || 0) + Number(amount || 0),
        };
      }
      return u;
    });

    state.notifications.unshift({
      id: Date.now(),
      type: "order",
      message: `New order ${order.id} received`,
      time: "just now",
      read: false,
    });

    return state;
  });

  const created = db.orders[0];
  return res.status(201).json({ success: true, data: created });
});

router.patch("/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const allowed = ["delivered", "shipped", "processing", "pending", "cancelled"];

  if (!allowed.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  let updated = null;
  updateDb((db) => {
    db.orders = db.orders.map((o) => {
      if (o.id === id) {
        updated = { ...o, status };
        return updated;
      }
      return o;
    });
    return db;
  });

  if (!updated) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  return res.json({ success: true, data: updated });
});

module.exports = router;
