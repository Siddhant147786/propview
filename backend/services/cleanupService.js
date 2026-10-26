const { CleanupJob } = require("../models/CleanupJob");
async function enqueue(publicIds) {
  if (!publicIds.length) return;
  try {
    await CleanupJob.bulkWrite(publicIds.map((publicId) => ({ updateOne: {
      filter: { publicId }, update: { $setOnInsert: { publicId, attempts: 0, nextAttemptAt: new Date() } }, upsert: true,
    } })));
  } catch (error) {
    console.error("Could not persist image cleanup; manual retry required for:", publicIds, error.message);
  }
}
function startCleanupWorker() {
  let busy = false;
  async function run() {
    if (busy) return;
    busy = true;
    try {
      const jobs = await CleanupJob.find({ nextAttemptAt: { $lte: new Date() } }).limit(20);
      const { destroyImage } = require("./cloudinaryService");
      for (const job of jobs) {
        try {
          await destroyImage(job.publicId);
          await CleanupJob.deleteOne({ _id: job._id });
        } catch {
          await CleanupJob.updateOne({ _id: job._id }, { $inc: { attempts: 1 }, $set: {
            nextAttemptAt: new Date(Date.now() + Math.min(86400000, 60000 * 2 ** Math.min(job.attempts, 10))),
          } });
        }
      }
    } catch (error) { console.error("Image cleanup worker:", error.message); }
    finally { busy = false; }
  }
  const timer = setInterval(run, 60000);
  timer.unref();
  void run();
  return () => clearInterval(timer);
}
module.exports = { enqueue, startCleanupWorker };
