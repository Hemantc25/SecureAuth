import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = Router();

router.get(
  "/dashboard",
  authenticate,
  authorize("admin"),
  (req, res) => {
    res.json({
      message: "Welcome, admin",
      user: req.user,
    });
  }
);

export const adminRouter = router;
