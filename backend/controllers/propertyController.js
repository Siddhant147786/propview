const mongoose = require("mongoose");
const { Property } = require("../models/Property");
const { cleanupFiles } = require("../middleware/uploads");
const cloud = require("../services/cloudinaryService");
const { parseProperty } = require("../services/propertyData");
const { buildSearch } = require("../services/propertySearch");
const { fail } = require("../utils/validation");

exports.mine = async (req, res) => {
  res.set("Cache-Control", "no-store");
  const properties = await Property.find({ ownerId: req.user._id, deletedAt: null }).select("title listingType price address images createdAt").sort({ createdAt: -1 });
  res.json({ properties });
};
exports.list = async (req, res) => {
  const { filter, page, limit, sort } = buildSearch(req.query);
  const [properties, total] = await Promise.all([
    Property.find(filter).select("title listingType propertyType price bedrooms bathrooms builtUpArea address.city address.locality address.latitude address.longitude images createdAt").sort(sort).skip((page - 1) * limit).limit(limit),
    Property.countDocuments(filter),
  ]);
  res.json({ properties, page, total, pages: Math.max(1, Math.ceil(total / limit)) });
};
exports.neighbourhoods = async (req, res) => {
  const areas = await Property.aggregate([
    { $match: { deletedAt: null } },
    { $group: { _id: { city: "$address.city", locality: "$address.locality", listingType: "$listingType" }, count: { $sum: 1 }, minPrice: { $min: "$price" }, maxPrice: { $max: "$price" } } },
    { $sort: { count: -1, "_id.city": 1 } }, { $limit: 20 },
  ]);
  res.json({ areas });
};
exports.detail = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) fail("Property not found.", 404);
  const property = await Property.findOne({ _id: req.params.id, deletedAt: null }).select("-address.unitNumber -__v");
  if (!property) fail("Property not found.", 404);
  res.json({ property });
};
exports.loadOwned = async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) fail("Property not found.", 404);
  const property = await Property.findOne({ _id: req.params.id, ownerId: req.user._id, deletedAt: null });
  if (!property) fail("Property not found or you do not own it.", 404);
  req.property = property; next();
};
exports.editData = (req, res) => res.json({ property: req.property });

async function saveProperty(req, res, next) {
  const uploaded = [];
  let saved = false;
  let stage = "validation";
  const existing = req.property;
  const oldImages = existing ? existing.images.map((image) => ({ publicId: image.publicId })) : [];
  try {
    const data = parseProperty(req.body);
    const property = existing || new Property({ ownerId: req.user._id });
    property.set(data);
    await property.validate();
    stage = "upload";
    for (const file of req.files || []) uploaded.push(await cloud.upload(file));
    if (uploaded.length) property.images = uploaded;
    stage = "save";
    await property.save();
    saved = true;
    if (existing && uploaded.length) await cloud.remove(oldImages);
    res.status(existing ? 200 : 201).json({ message: existing ? "Property updated." : "Property published successfully.", property });
  } catch (error) {
    if (!saved) await cloud.remove(uploaded);
    if (stage === "upload") return res.status(502).json({ message: "Could not upload the photos. Check the image files and try again." });
    if (error.name === "ValidationError") return res.status(400).json({ message: Object.values(error.errors).map((item) => item.message).join(" ") });
    if (error.status) return res.status(error.status).json({ message: error.message });
    next(error);
  } finally { await cleanupFiles(req.files); }
}
exports.create = saveProperty;
exports.update = saveProperty;
exports.remove = async (req, res) => {
  // Archive first so a provider outage cannot keep a deleted listing public.
  req.property.deletedAt = new Date();
  await req.property.save();
  await cloud.remove(req.property.images);
  res.json({ message: "Property removed from listings." });
};
