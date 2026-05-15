import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

export const verifyToken = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      // ✅ get token from cookies
      let token = req.cookies.token;

      if (!token) {
        return res.status(401).json({
          message: "unathorized req,plz login"
        });
      }

      // ✅ verify token
      let decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ role check (ONLY if roles are passed)
      if (allowedRoles.length > 0 && !allowedRoles.includes(decodedToken.role)) {
        return res.status(403).json({
          message: "Forbidden.you dont have access"
        });
      }

      // ✅ attach user
      req.user = decodedToken;

      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Session expired.plz login"
        });
      }

      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
          message: "Invalid Token.plz login again"
        });
      }

      return res.status(500).json({
        message: "Server error"
      });
    }
  };
};
