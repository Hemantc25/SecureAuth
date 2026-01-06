import { User } from "../models/User.model.js";
import { hashPassword } from "../services/auth.service.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { comparePassword } from "../services/auth.service.js";
import { signToken } from "../utils/jwt.js";

export const register = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if user already exists
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
  });

  res.status(201).json({
    id: user._id,
    email: user.email,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

   // Find user
  const user = await User.findOne({ email });
  if (!user || !user.isActive) {
    throw new ApiError(401, "Invalid credentials");
  }
    // Verify password
  const isValid = await comparePassword(password, user.passwordHash);
  if (!isValid) {
    throw new ApiError(401, "Invalid credentials");
  }

    // Sign JWT
  const token = signToken({
    sub: user._id.toString(),
    role: user.role,
  });

  res.json({
    token,
  });
});