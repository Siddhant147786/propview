const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subject: { type: String, required: true, maxlength: 150 },
  message: { type: String, required: true, maxlength: 3000 },
  status: { type: String, default: "new", enum: ["new", "resolved"] },
  response: { type: String, maxlength: 3000, default: "" },
  respondedAt: Date,
}, { timestamps: true });
schema.index({ user: 1, createdAt: -1 });
schema.index({ status: 1, createdAt: -1 });
module.exports = { ContactMessage: mongoose.model("ContactMessage", schema) };
