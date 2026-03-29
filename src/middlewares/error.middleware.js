export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const isProduction = process.env.NODE_ENV === "production";

  // Log full error always (server-side)
  console.error(err);

  res.status(statusCode).json({
    status: "error",
    message: isProduction
      ? "Something went wrong"
      : err.message || "Internal Server Error",
  });
};