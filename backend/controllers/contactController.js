const { ContactMessage } = require("../models/ContactMessage");
const mongoose = require("mongoose");
const { textValue, fail } = require("../utils/validation");
const { pagination } = require("../utils/pagination");
exports.create = async (req, res) => {
  const subject = textValue(req.body.subject, "Subject", 3, 150);
  const message = textValue(req.body.message, "Message", 10, 3000);
  const record = await ContactMessage.create({ user: req.user._id, subject, message });
  res.status(201).json({ message: "Your enquiry has been saved.", reference: record._id });
};
exports.list = async (req, res) => {
  const { page, limit, skip } = pagination(req.query);
  const filter = req.isSupportAdmin ? {} : { user: req.user._id };
  if (req.query.status) {
    if (!["new", "resolved"].includes(req.query.status)) fail("Invalid enquiry status.");
    filter.status = req.query.status;
  }
  const [enquiries, total] = await Promise.all([
    ContactMessage.find(filter).populate("user", "name email").sort({ createdAt: -1, _id: -1 }).skip(skip).limit(limit),
    ContactMessage.countDocuments(filter),
  ]);
  res.set("Cache-Control", "no-store");
  res.json({ enquiries, page, pages: Math.max(1, Math.ceil(total / limit)), total });
};
exports.update = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) fail("Enquiry not found.", 404);
  if (!["new", "resolved"].includes(req.body.status)) fail("Choose a valid status.");
  const response = req.body.response ? textValue(req.body.response, "Response", 1, 3000) : "";
  const enquiry = await ContactMessage.findByIdAndUpdate(req.params.id, {
    $set: { status: req.body.status, response, respondedAt: response ? new Date() : null },
  }, { returnDocument: "after", runValidators: true });
  if (!enquiry) fail("Enquiry not found.", 404);
  res.json({ message: "Enquiry updated. The response is visible to the sender.", enquiry });
};
