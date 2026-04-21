const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    code: { type: String, required: true },
    type: { type: String, default: "percentage" },
    value: { type: Number, default: 0 },
    minOrder: { type: Number, default: 0 },
    usageLimit: { type: Number, default: 0 },
    usedCount: { type: Number, default: 0 },
    expiry: { type: String, default: "" },
    status: { type: String, default: "active" },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Coupon", couponSchema);
