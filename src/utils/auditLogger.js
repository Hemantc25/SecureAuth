import { logger } from "../config/logger.js";

export const auditLog = (action, context) => {
  logger.info("AUDIT", {
    action,
    ...context,
    timestamp: new Date().toISOString(),
  });
};