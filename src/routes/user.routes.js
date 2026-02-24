import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { requireOwnership } from "../middlewares/ownership.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { getPagination } from "../utils/pagination.js";
import { getSort } from "../utils/sort.js";
import { auditLog } from "../utils/auditLogger.js";
import { asyncHandler } from "../utils/asyncHandler.js";   // ✅ ADD THIS
import { ApiError } from "../utils/ApiError.js";           // ✅ ADD THIS
import { User } from "../models/User.model.js";

const router = Router();

// Admin-only route to list all users with pagination and sorting
router.get(
  "/",
  authenticate,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req.query);
    const sort = getSort(req.query, ["createdAt", "email"]);
    
    // Only return non-sensitive fields
    const users = await User.find()
      .select("-passwordHash")
      .skip(skip)
      .limit(limit)
      .sort(sort);

    const total = await User.countDocuments();

    // Audit log for admin listing users
    auditLog("ADMIN_LIST_USERS", {
      adminId: req.user.id,
      page,
      limit,
      requestId: req.requestId,
    });

    res.json({
      page,
      limit,
      total,
      results: users.length,
      data: users,
    });
  })
);

// Route to get user details with ownership check
router.get(
  "/:id",
  authenticate,
  requireOwnership((req) => req.params.id),
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-passwordHash");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    res.json(user);
  })
);

export const userRouter = router;