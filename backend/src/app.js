// app.js - Main application setup for the backend server
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");

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

module.exports = app;
