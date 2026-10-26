const router = require("express").Router();
const { v2: cloudinary } = require("cloudinary");
const { Property } = require("../models/Property");
const { requireAuth } = require("../middleware/auth");
const { receiveImages, cleanupFiles } = require("./uploads");

const propertyFields = ["title", "description", "listingType", "propertyType", "bedrooms", "bathrooms", "balconies", "builtUpArea", "floorNumber", "totalFloors", "propertyAge", "facing", "furnishings", "amenities", "parking", "price", "maintenance"];
const addressFields = ["googlePlaceId", "formattedAddress", "countryCode", "state", "city", "locality", "pincode", "buildingName", "addressLine", "unitNumber", "landmark", "latitude", "longitude"];
function pick(source, keys) {
  return Object.fromEntries(keys.filter((key) => Object.hasOwn(source, key)).map((key) => [key, source[key]]));
}

router.get("/mine", requireAuth, async (req, res) => {
  res.set("Cache-Control", "no-store");
  const properties = await Property.find({ ownerId: req.user._id })
    .select("title listingType price address images createdAt").sort({ createdAt: -1 });
  res.json({ properties });
});

router.post("/", requireAuth, (req, res, next) => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return res.status(503).json({ message: "Photo uploads are temporarily unavailable. Please try again later." });
  }
  cloudinary.config({ cloud_name: CLOUDINARY_CLOUD_NAME, api_key: CLOUDINARY_API_KEY, api_secret: CLOUDINARY_API_SECRET, secure: true });
  next();
}, receiveImages, async (req, res, next) => {
  const uploaded = [];
  let saved = false;
  let stage = "validation";
  try {
    let data;
    try { data = JSON.parse(req.body.propertyData); }
    catch { return res.status(400).json({ message: "Property details must be valid JSON." }); }
    if (!data || typeof data !== "object" || Array.isArray(data) || !data.address || typeof data.address !== "object" || Array.isArray(data.address)) {
      return res.status(400).json({ message: "Please enter the property and address details." });
    }
    const property = new Property({
      ...pick(data, propertyFields),
      address: pick(data.address, addressFields),
      ownerId: req.user._id,
    });
    await property.validate();
    stage = "upload";
    // Sequential uploads let us track and remove every successful upload on failure.
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "propview/properties",
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        timeout: 60000,
      });
      uploaded.push({ url: result.secure_url, publicId: result.public_id });
    }
    property.images = uploaded;
    stage = "save";
    await property.save();
    saved = true;
    res.status(201).json({ message: "Property published successfully.", property });
  } catch (error) {
    if (!saved) {
      const cleanup = await Promise.allSettled(uploaded.map((image) => cloudinary.uploader.destroy(image.publicId)));
      cleanup.forEach((result, index) => {
        if (result.status === "rejected" || result.value?.result === "error") {
          console.error("Cloudinary cleanup failed for", uploaded[index].publicId);
        }
      });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: Object.values(error.errors).map((item) => item.message).join(" ") });
    }
    if (stage === "upload") {
      return res.status(502).json({ message: "Could not upload the photos. Check that they are valid JPG, PNG or WebP images and try again." });
    }
    next(error);
  } finally {
    await cleanupFiles(req.files);
  }
});

module.exports = router;
