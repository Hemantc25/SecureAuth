import { app } from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";

const startServer = async () => {
  await connectDB();

  app.listen(env.port, () => {
    console.log(
      `🚀 SecureAuth running in ${env.nodeEnv} mode on port ${env.port}`
    );
  });
};

startServer();
