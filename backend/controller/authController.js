const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    // 1. Validate inputs FIRST (before any DB call)
    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required (userName, email, password)",
      });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // 2. Check for duplicate email
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({   // 409 Conflict — not 200!
        success: false,
        message: "This email is already registered",
      });
    }

    // 3. Hash password and save — use field name "hashedPassword" matching schema
    const hashedPassword = await bcrypt.hash(password, 12); // saltRounds=12 (10 is OK too)
    const newUser = await User.create({ userName, email, hashedPassword });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { id: newUser._id, userName: newUser.userName, email: newUser.email },
    });

  } catch (error) {
    console.error("[register] Error:", error);


    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Input validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // 2. Find user (normalise email)
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",  // generic — don't reveal which field is wrong
      });
    }

    // 3. Compare password with stored hash
    const isPasswordCorrect = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 4. Sign JWT
    const token = jwt.sign(
      {
        id: user._id,
        username: user.userName,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    

    return res.status(200).json({
      success: true,
      message: "Login successful",   // fixed typo: "Successfull" → "successful"
      token,
      user: { id: user._id, username: user.userName, email: user.email },
    });

  } catch (error) {
    console.error("[login] Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { register, login };