const mongoose = require("mongoose");
const { Conversation } = require("../models/Conversation");
const { Property } = require("../models/Property");
const { fail, textValue } = require("../utils/validation");
const { pagination } = require("../utils/pagination");

exports.list = async (req, res) => {
  const { page, limit, skip } = pagination(req.query, 10);
  const filter = { $or: [{ owner: req.user._id }, { requester: req.user._id }] };
  const [conversations, total] = await Promise.all([
    Conversation.find(filter).populate("property", "title deletedAt").populate("owner requester", "name").sort({ updatedAt: -1, _id: -1 }).skip(skip).limit(limit).lean(),
    Conversation.countDocuments(filter),
  ]);
  for (const conversation of conversations) {
    const count = String(conversation.owner?._id) === String(req.user._id) ? conversation.ownerReadCount : conversation.requesterReadCount;
    conversation.unreadCount = conversation.messages.slice(count || 0).filter((message) => String(message.sender) !== String(req.user._id)).length;
  }
  res.set("Cache-Control", "no-store");
  res.json({ conversations, page, pages: Math.max(1, Math.ceil(total / limit)) });
};
exports.create = async (req, res) => {
  const body = textValue(req.body.message, "Message", 5, 2000);
  if (!mongoose.isValidObjectId(req.body.propertyId)) fail("Property not found.", 404);
  const property = await Property.findOne({ _id: req.body.propertyId, deletedAt: null });
  if (!property) fail("Property not found.", 404);
  if (String(property.ownerId) === String(req.user._id)) fail("This is your own listing.");
  const existing = await Conversation.findOne({ property: property._id, requester: req.user._id });
  if (existing) return res.json({ message: "You already have a conversation for this property. Continue it in your profile.", conversation: existing });
  const conversation = await Conversation.create({ property: property._id, requester: req.user._id, owner: property.ownerId, requesterReadCount: 1, messages: [{ sender: req.user._id, body }] });
  res.status(201).json({ message: "Message sent. You can find replies in your profile.", conversation });
};
exports.reply = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) fail("Conversation not found.", 404);
  const body = textValue(req.body.message, "Message", 1, 2000);
  const conversation = await Conversation.findOneAndUpdate({ _id: req.params.id, status: { $ne: "closed" }, $or: [{ owner: req.user._id }, { requester: req.user._id }], "messages.99": { $exists: false } }, {
    $push: { messages: { sender: req.user._id, body, createdAt: new Date() } },
  }, { returnDocument: "after", runValidators: true });
  if (!conversation) fail("Conversation unavailable, closed, or its 100-message limit has been reached.", 409);
  res.json({ message: "Reply sent." });
};
exports.update = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) fail("Conversation not found.", 404);
  const conversation = await Conversation.findOne({ _id: req.params.id, $or: [{ owner: req.user._id }, { requester: req.user._id }] });
  if (!conversation) fail("Conversation not found.", 404);
  const update = {};
  if (req.body.status !== undefined) {
    if (!["open", "closed"].includes(req.body.status)) fail("Invalid conversation status.");
    update.$set = { status: req.body.status };
  }
  if (req.body.readCount !== undefined) {
    if (!Number.isInteger(req.body.readCount) || req.body.readCount < 0 || req.body.readCount > conversation.messages.length) fail("Invalid read count.");
    const field = String(conversation.owner) === String(req.user._id) ? "ownerReadCount" : "requesterReadCount";
    update.$max = { [field]: req.body.readCount };
  }
  if (!Object.keys(update).length) fail("No changes supplied.");
  await Conversation.updateOne({ _id: conversation._id }, update, { timestamps: Boolean(update.$set) });
  res.json({ message: "Conversation updated." });
};
