import express from "express";
import { healthRouter } from "./routes/health.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { requestLogger } from "./middlewares/requestLogger.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { ApiError } from "./utils/ApiError.js";
import { protectedRouter } from "./routes/protected.routes.js";
import { adminRouter } from "./routes/admin.routes.js";
import { userRouter } from "./routes/user.routes.js";
import { requestId } from "./middlewares/requestId.middleware.js";

export const app = express();

// Global middlewares
app.use(requestId);
app.use(express.json());
app.use(requestLogger);

// middlewares
app.use(express.json());
app.use(requestLogger);

// protected routes
app.use("/health", healthRouter);
app.use("/auth", authRouter);

// Example of a protected route
app.use("/protected", protectedRouter);

// Example of an admin-only route
app.use("/admin", adminRouter);

// User routes with ownership check
app.use("/users", userRouter);

// 404 handler
app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// error handler — LAST
app.use(errorHandler);
 
