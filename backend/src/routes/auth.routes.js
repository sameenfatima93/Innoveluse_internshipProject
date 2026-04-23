const express = require("express");
const router = express.Router();
const crypto = require("crypto");

const bcrypt = require("bcrypt");
const { readDb, updateDb } = require("../utils/store");

const ADMIN_TOKEN_TTL_SECONDS = Number(process.env.ADMIN_TOKEN_TTL_SECONDS || 60 * 60 * 24);
const ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || "chronostore-admin-secret-change-me";

function toBase64Url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(input) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padding = (4 - (normalized.length % 4)) % 4;
  return Buffer.from(`${normalized}${"=".repeat(padding)}`, "base64").toString("utf8");
}

function signValue(value) {
  return crypto
    .createHmac("sha256", ADMIN_TOKEN_SECRET)
    .update(value)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function createAdminToken() {
  const payload = {
    role: "admin",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + ADMIN_TOKEN_TTL_SECONDS,
  };

  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = signValue(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

function verifyAdminToken(token) {
  if (!token || typeof token !== "string") {
    return false;
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return false;
  }

  const [encodedPayload, signature] = parts;
  const expectedSignature = signValue(encodedPayload);

  const providedSignatureBuffer = Buffer.from(signature);
  const expectedSignatureBuffer = Buffer.from(expectedSignature);
  if (providedSignatureBuffer.length !== expectedSignatureBuffer.length) {
    return false;
  }

  if (!crypto.timingSafeEqual(providedSignatureBuffer, expectedSignatureBuffer)) {
    return false;
  }

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload));
    const now = Math.floor(Date.now() / 1000);
    return payload.role === "admin" && Number(payload.exp) > now;
  } catch {
    return false;
  }
}

function toAvatar(name = "U") {
  return name.slice(0, 2).toUpperCase();
}

// =====================
// REGISTER
// =====================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const db = readDb();
    const exists = db.users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let createdUser = null;
    updateDb((state) => {
      const newUser = {
        id: `U${String(state.users.length + 1).padStart(3, "0")}`,
        name,
        email,
        password: hashedPassword,
        role: "user",
        status: "active",
        phone: "",
        orders: 0,
        totalSpent: 0,
        joinDate: new Date().toISOString().slice(0, 10),
        avatar: toAvatar(name),
      };

      state.users.unshift(newUser);
      state.notifications.unshift({
        id: Date.now(),
        type: "user",
        message: `New user registered: ${name}`,
        time: "just now",
        read: false,
      });

      createdUser = newUser;
      return state;
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================
// LOGIN
// =====================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    const db = readDb();
    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || "user",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post("/logout", (req, res) => {
  const role = req.body?.role || "user";

  return res.status(200).json({
    success: true,
    message: `${role} logged out successfully`,
  });
});

router.post("/admin-login", (req, res) => {
  const { id, password } = req.body;
  const adminId = process.env.ADMIN_ID || "admin123";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (id !== adminId || password !== adminPassword) {
    return res.status(401).json({ success: false, message: "Invalid admin credentials" });
  }

  const token = createAdminToken();

  return res.json({
    success: true,
    message: "Admin login successful",
    data: {
      token,
      admin: {
        id: "ADMIN",
        name: "Admin",
        role: "admin",
      },
    },
  });
});

router.get("/admin-verify", (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!verifyAdminToken(token)) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  return res.json({
    success: true,
    data: {
      id: "ADMIN",
      name: "Admin",
      role: "admin",
    },
  });
});

module.exports = router;