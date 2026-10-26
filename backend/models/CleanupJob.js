const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  publicId: { type: String, required: true, unique: true },
  attempts: { type: Number, default: 0 },
  nextAttemptAt: { type: Date, default: Date.now, index: true },
}, { timestamps: true });
module.exports = { CleanupJob: mongoose.model("CleanupJob", schema) };
