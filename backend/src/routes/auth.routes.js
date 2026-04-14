const express = require("express");

const router = express.Router();

router.post("/logout", (req, res) => {
  const role = req.body?.role || "user";
  const sessionId = req.body?.sessionId || null;

  return res.status(200).json({
    success: true,
    message: `${role} logged out successfully`,
    data: {
      role,
      sessionId,
      loggedOutAt: new Date().toISOString(),
    },
  });
});

module.exports = router;
