const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    brand: { type: String, default: "" },
    category: { type: String, default: "mens" },
    price: { type: Number, default: 0 },
    oldPrice: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    badge: { type: String, default: "" },
    color: { type: String, default: "#1a1a2e" },
    accent: { type: String, default: "#4f8ef7" },
    image: { type: String, default: "" },
    description: { type: String, default: "" },
    features: { type: [String], default: [] },
    status: { type: String, default: "active" },
    stock: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    isBestSeller: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Product", productSchema);
