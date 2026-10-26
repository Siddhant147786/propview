const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
  requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["open", "closed"], default: "open" },
  ownerReadCount: { type: Number, default: 0 },
  requesterReadCount: { type: Number, default: 0 },
  messages: [{ sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, body: { type: String, required: true, maxlength: 2000 }, createdAt: { type: Date, default: Date.now } }],
}, { timestamps: true });
schema.index({ property: 1, requester: 1 }, { unique: true });
schema.index({ owner: 1, updatedAt: -1 });
schema.index({ requester: 1, updatedAt: -1 });
module.exports = { Conversation: mongoose.model("Conversation", schema) };
