import express from "express";
import helmet from "helmet";

import { healthRouter } from "./routes/health.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { protectedRouter } from "./routes/protected.routes.js";
import { adminRouter } from "./routes/admin.routes.js";
import { userRouter } from "./routes/user.routes.js";

import { requestLogger } from "./middlewares/requestLogger.middleware.js";
import { requestId } from "./middlewares/requestId.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";

import { globalLimiter } from "./config/rateLimit.js";
import { ApiError } from "./utils/ApiError.js";

export const app = express();

/* ---------------- SECURITY ---------------- */

app.disable("x-powered-by");
app.use(helmet());

/* ---------------- GLOBAL MIDDLEWARE ---------------- */

app.use(requestId);
app.use(globalLimiter);
app.use(express.json({ limit: "10kb" }));
app.use(requestLogger);

/* ---------------- ROUTES ---------------- */

app.use("/health", healthRouter);
app.use("/auth", authRouter);
app.use("/protected", protectedRouter);
app.use("/admin", adminRouter);
app.use("/users", userRouter);

/* ---------------- 404 HANDLER ---------------- */

app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

/* ---------------- ERROR HANDLER ---------------- */

app.use(errorHandler);