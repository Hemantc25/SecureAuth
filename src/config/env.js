import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

// Define the schema for environment variables
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  PORT: z.coerce.number().int().positive(),
  JWT_SECRET: z.string().min(20),
  JWT_EXPIRES_IN: z.string(),
});

// Parse and validate the environment variables
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration");
  console.error(parsed.error.format());
  process.exit(1);
}

// Export the validated environment variables
export const env = {
  nodeEnv: parsed.data.NODE_ENV,
  port: parsed.data.PORT,
  jwtSecret: parsed.data.JWT_SECRET,
  jwtExpiresIn: parsed.data.JWT_EXPIRES_IN,
};

