import { closeDatabase, initailizeDatabase } from "#config/database.js";
import app, { activeConnections } from "./index.js";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.APP_PORT || 8000;

const startServer = async () => {
  try {
    //initailize database
    await initailizeDatabase();
    app.listen(PORT, () => {
      console.log(`server started on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server");
  }
};



// SHUTTING DOWN GRACEFULLY


process.on("SIGINT", async () => {
  console.log(" Shutdown signal received...");

  if (activeConnections > 0) {
    console.log(
      `⏳ Waiting for ${activeConnections} active requests to finish...`,
    );
    await new Promise<void>((resolve) => {
      const checkInterval = setInterval(() => {
        if (activeConnections === 0) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
    });
  }
  await closeDatabase();
  console.log(" Graceful shutdown complete");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("shutting down gracefully");
  await closeDatabase();
  process.exit(0);
});
startServer();
