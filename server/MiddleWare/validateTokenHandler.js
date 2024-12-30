const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { constants } = require("../Utils/constants");

const validateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        console.error("Token verification failed:", err);
        return res
          .status(constants.INVALID_TOKEN)
          .json({ message: "Invalid Auth token | Token Expired" });
      }

      req.user = decoded.user;
    });
  }
  next();
};

// Generic role validation middleware
const validateRole = (allowedRoles) => {
  return asyncHandler((req, res, next) => {
    validateToken(req, res, () => {
      if (allowedRoles.includes(req.user.role)) {
        next();
      } else {
        res.status(403);
        throw new Error("Forbidden: You do not have access to this resource");
      }
    });
  });
};

const validateAdmin = validateRole(["admin"]);

module.exports = {
  validateToken,
  validateAdmin,
};
