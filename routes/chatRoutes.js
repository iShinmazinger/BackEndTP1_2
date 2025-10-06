const express = require("express");
const router = express.Router();
const { sendMessage } = require("../controllers/chatController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/send", authMiddleware, sendMessage);

module.exports = router;
