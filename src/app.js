import express from "express";
import { healthRouter } from "./routes/health.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { ApiError } from "./utils/ApiError.js";

const app = express();

// Built-in middleware to parse JSON
app.use(express.json());

// Routes
app.use("/health", healthRouter);

// Centralized error handler (ALWAYS last)
app.use(errorHandler);

// Handle 404 errors for undefined routes
app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

export { app };

