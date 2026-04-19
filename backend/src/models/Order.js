const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    customer: { type: String, default: "" },
    email: { type: String, default: "" },
    userId: { type: String, default: null },
    product: { type: String, default: "" },
    items: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    status: { type: String, default: "pending" },
    date: { type: String, default: () => new Date().toISOString().slice(0, 10) },
    avatar: { type: String, default: "US" },
    shippingAddress: { type: String, default: "" },
    city: { type: String, default: "" },
    phone: { type: String, default: "" },
    paymentMethod: { type: String, default: "cod" },
    lineItems: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Order", orderSchema);
