const express = require("express");
const router = express.Router();
const { register, login } = require("../controller/authController");
const verifyToken = require("./verifyToken");


router.post("/register", register);
router.post("/login", login);

router.get("/my-profile", verifyToken, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Profile fetched successfully",
    user: req.user,
  });
});

module.exports = router;
