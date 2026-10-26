const { v2: cloudinary } = require("cloudinary");
const { fail } = require("../utils/validation");
const cleanup = require("./cleanupService");

function configure() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) fail("Photo uploads are temporarily unavailable. Please try again later.", 503);
  cloudinary.config({ cloud_name: CLOUDINARY_CLOUD_NAME, api_key: CLOUDINARY_API_KEY, api_secret: CLOUDINARY_API_SECRET, secure: true });
}
function requireCloudinary(req, res, next) { configure(); next(); }
async function upload(file) {
  configure();
  const result = await cloudinary.uploader.upload(file.path, {
    folder: "propview/properties", resource_type: "image", allowed_formats: ["jpg", "jpeg", "png", "webp"], timeout: 60000,
  });
  return { url: result.secure_url, publicId: result.public_id };
}
async function remove(images = []) {
  if (!images.length) return;
  const results = await Promise.allSettled(images.map((image) => destroyImage(image.publicId)));
  await cleanup.enqueue(images.filter((image, index) => results[index].status === "rejected").map((image) => image.publicId));
}
async function destroyImage(publicId) {
  configure();
  const result = await cloudinary.uploader.destroy(publicId);
  if (!["ok", "not found"].includes(result?.result)) throw new Error("Image deletion was not confirmed.");
}
module.exports = { upload, remove, requireCloudinary, destroyImage };
