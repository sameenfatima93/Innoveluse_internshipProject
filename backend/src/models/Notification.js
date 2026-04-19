const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    type: { type: String, default: "info" },
    message: { type: String, default: "" },
    time: { type: String, default: "just now" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Notification", notificationSchema);
