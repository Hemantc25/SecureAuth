const isProduction = process.env.NODE_ENV === "production";

export const requestLogger = (req, res, next) => {
  if (!isProduction) {
    console.log("Incoming request", {
      method: req.method,
      path: req.originalUrl,
      userId: req.user?.id,
      requestId: req.requestId,
    });
  }

  next();
};