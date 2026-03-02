import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authenticateJWT = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  try {
    // Handle local tokens (for offline/fallback logins)
    if (token.startsWith('local-token-')) {
      // For local tokens, we skip JWT verification
      // In production, you would validate against a local database
      console.log('Using local token for development:', token);
      const userId = token.replace('local-token-', '');
      req.user = { _id: userId };
      return next();
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password"); // attach user
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

export const requireTeacher = (req, res, next) => {
  if (req.user && req.user.role === 'teacher') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied: Teacher only' });
};
