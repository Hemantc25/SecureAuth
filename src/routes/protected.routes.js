import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authenticate, (req, res) => {
  res.json({
    message: "You are authenticated",
    user: req.user,
  });
});

export const protectedRouter = router;
