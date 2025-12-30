import { Router } from "express";
import { healthCheck } from "../controllers/health.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { exampleSchema } from "../schemas/example.schema.js";

const router = Router();

router.get("/", healthCheck);

// example validation test
router.post("/test", validate(exampleSchema), (req, res) => {
  res.json({ message: "Validation passed" });
});

export const healthRouter = router;
