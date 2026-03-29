import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDB = async () => {
  try {
    console.log("MONGO_URI:", env.mongoUri)

    await mongoose.connect(env.mongoUri)

    console.log("✅ MongoDB connected")
  } catch (error) {
    console.error("❌ MongoDB connection failed")
    console.error(error.message)
    process.exit(1)
  }
}