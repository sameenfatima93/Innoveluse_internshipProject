// app.js - Main application setup for the backend server
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const usersRoutes = require("./routes/users.routes");
const ordersRoutes = require("./routes/orders.routes");
const productsRoutes = require("./routes/products.routes");
const couponsRoutes = require("./routes/coupons.routes");
const notificationsRoutes = require("./routes/notifications.routes");

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_USER_ORIGIN || "http://localhost:3000",
  process.env.FRONTEND_ADMIN_ORIGIN || "http://localhost:5173",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS not allowed for this origin"));
    },
    credentials: true,
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Backend is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/coupons", couponsRoutes);
app.use("/api/notifications", notificationsRoutes);

module.exports = app;
