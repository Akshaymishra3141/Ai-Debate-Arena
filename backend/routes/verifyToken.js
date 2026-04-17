const jwt = require("jsonwebtoken");


const verifyToken = (req, res, next) => {

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;



  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  try {
    
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedUser;   
    next();
  } catch (err) {
    // TokenExpiredError vs JsonWebTokenError
    const message =
      err.name === "TokenExpiredError"
        ? "Session expired. Please log in again."
        : "Invalid token. Please log in again.";

    return res.status(403).json({ success: false, message });
  }
};

module.exports = verifyToken;