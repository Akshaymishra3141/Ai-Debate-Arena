const express = require("express");
const router = express.Router();
const aiController = require("../controller/aiController");
const verifyToken = require("./verifyToken");

router.post("/ask", verifyToken, aiController.askAi);
router.post("/debate", verifyToken, aiController.debateWithAi);

module.exports = router;
