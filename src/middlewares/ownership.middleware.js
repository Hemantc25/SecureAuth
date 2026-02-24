import { ApiError } from "../utils/ApiError.js";

export const requireOwnership = (getResourceOwnerId) => {
  return (req, res, next) => {
    const ownerId = getResourceOwnerId(req);

    // Admins bypass ownership
    if (req.user.role === "admin") {
      return next();
    }

    if (!ownerId || ownerId.toString() !== req.user.id) {
      return next(new ApiError(403, "Forbidden"));
    }

    next();
  };
};
