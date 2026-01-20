import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Authentication required"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret);

    req.user = {
      id: decoded.sub,
      role: decoded.role,
    };

    next();
  } catch (err) {
    next(new ApiError(401, "Invalid or expired token"));
  }
};
