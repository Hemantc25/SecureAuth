import { User } from "../models/User.model.js";
import { hashPassword, comparePassword } from "../services/auth.service.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signToken } from "../utils/jwt.js";
import { auditLog } from "../utils/auditLogger.js";

// REGISTER
export const register = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const user = await User.create({
    email,
    passwordHash,
    role: "user",      // explicit default
    isActive: true,    // explicit default
  });

  auditLog("USER_REGISTER", {
    userId: user._id.toString(),
    email: user.email,
    requestId: req.requestId,
  });

  res.status(201).json({
    id: user._id,
    email: user.email,
  });
});

// LOGIN
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // Find user
  const user = await User.findOne({ email });

  if (!user || !user.isActive) {
    auditLog("USER_LOGIN_FAILED", {
      email,
      reason: "USER_NOT_FOUND_OR_INACTIVE",
      requestId: req.requestId,
    });
    throw new ApiError(401, "Invalid credentials");
  }

  // Verify password
  const isValid = await comparePassword(password, user.passwordHash);

  if (!isValid) {
    auditLog("USER_LOGIN_FAILED", {
      userId: user._id.toString(),
      email: user.email,
      reason: "INVALID_PASSWORD",
      requestId: req.requestId,
    });
    throw new ApiError(401, "Invalid credentials");
  }

  // Sign JWT
  const token = signToken({
    sub: user._id.toString(),
    role: user.role,
  });

  // Success audit
  auditLog("USER_LOGIN_SUCCESS", {
    userId: user._id.toString(),
    email: user.email,
    requestId: req.requestId,
  });

  res.json({
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  });
});