const express = require("express");
const { readDb, updateDb } = require("../utils/store");

const router = express.Router();

router.get("/", (req, res) => {
  const db = readDb();
  res.json({ success: true, data: db.products });
});

router.post("/", (req, res) => {
  const payload = req.body;
  if (!payload?.name) {
    return res.status(400).json({ success: false, message: "Name is required" });
  }

  const db = updateDb((state) => {
    const id = `P${String(state.products.length + 1).padStart(3, "0")}`;
    const newProduct = {
      id,
      name: payload.name,
      category: payload.category || "mens",
      brand: payload.brand || "",
      price: Number(payload.price || 0),
      oldPrice: Number(payload.oldPrice || payload.price || 0),
      stock: Number(payload.stock || 0),
      sold: Number(payload.sold || 0),
      rating: Number(payload.rating || 0),
      status: payload.status || "active",
      image: payload.image || "",
      description: payload.description || "",
      features: payload.features || [],
      color: payload.color || "#1a1a2e",
      accent: payload.accent || "#4f8ef7",
      badge: payload.badge || "",
      isBestSeller: Boolean(payload.isBestSeller),
    };
    state.products.unshift(newProduct);
    return state;
  });

  return res.status(201).json({ success: true, data: db.products[0] });
});

router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const payload = req.body || {};
  let updated = null;

  updateDb((db) => {
    db.products = db.products.map((p) => {
      if (p.id !== id) return p;

      updated = {
        ...p,
        ...payload,
        price: payload.price !== undefined ? Number(payload.price) : p.price,
        oldPrice: payload.oldPrice !== undefined ? Number(payload.oldPrice) : p.oldPrice,
        stock: payload.stock !== undefined ? Number(payload.stock) : p.stock,
        sold: payload.sold !== undefined ? Number(payload.sold) : p.sold,
        rating: payload.rating !== undefined ? Number(payload.rating) : p.rating,
      };

      return updated;
    });

    return db;
  });

  if (!updated) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  return res.json({ success: true, data: updated });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  let deleted = false;

  updateDb((db) => {
    const before = db.products.length;
    db.products = db.products.filter((p) => p.id !== id);
    deleted = db.products.length < before;
    return db;
  });

  if (!deleted) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  return res.json({ success: true, message: "Product deleted" });
});

module.exports = router;
