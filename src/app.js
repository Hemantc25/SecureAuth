import express from "express";
import { healthRouter } from "./routes/health.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { requestLogger } from "./middlewares/requestLogger.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { ApiError } from "./utils/ApiError.js";

export const app = express();

app.use(express.json());
app.use(requestLogger);

app.use("/health", healthRouter);
app.use("/auth", authRouter);

// 404 handler
app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// error handler — LAST
app.use(errorHandler);
