require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const app = require("./app");
const { connectDatabase } = require("./config/database");
const mongoose = require("mongoose");
const { startCleanupWorker } = require("./services/cleanupService");

async function start() {
  if (!process.env.JWT_SECRET) throw new Error("Set JWT_SECRET in backend/.env before starting.");
  await connectDatabase();
  const stopWorker = startCleanupWorker();
  const server = app.listen(process.env.PORT || 3000, () => console.log("PropView API is ready."));
  server.on("error", (error) => { console.error(error.message); stopWorker(); void mongoose.disconnect(); process.exitCode = 1; });
  let stopping = false;
  const stop = () => {
    if (stopping) return;
    stopping = true;
    stopWorker();
    const deadline = setTimeout(() => process.exit(1), 10000);
    deadline.unref();
    server.close(async () => { await mongoose.disconnect(); clearTimeout(deadline); });
  };
  process.on("SIGTERM", stop);
  process.on("SIGINT", stop);
}
start().catch((error) => { console.error(error.message); process.exitCode = 1; });
