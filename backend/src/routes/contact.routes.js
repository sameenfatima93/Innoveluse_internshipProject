const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

function getTransportConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return {
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  };
}

router.post("/", async (req, res) => {
  const { name, email, phone, subject, message } = req.body || {};

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: "Name, email, subject and message are required" });
  }

  const recipient = process.env.CONTACT_RECEIVER_EMAIL || "kaffan2015@gmail.com";
  const sender = process.env.CONTACT_SENDER_EMAIL || process.env.SMTP_USER;
  const transportConfig = getTransportConfig();

  if (!transportConfig || !sender) {
    return res.status(503).json({
      success: false,
      message: "Email service is not configured. Add SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS and CONTACT_SENDER_EMAIL in backend .env",
    });
  }

  try {
    const transporter = nodemailer.createTransport(transportConfig);

    await transporter.sendMail({
      from: sender,
      to: recipient,
      replyTo: email,
      subject: `[Contact Form] ${subject}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || "N/A"}`,
        "",
        "Message:",
        message,
      ].join("\n"),
    });

    return res.status(200).json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to send email", error: error.message });
  }
});

module.exports = router;
