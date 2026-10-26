const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs/promises");

const extensions = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

// A string destination lets Multer create this folder if it is missing.
const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "uploads"),
  filename(req, file, callback) {
    callback(null, crypto.randomUUID() + extensions[file.mimetype]);
  },
});

const upload = multer({
  storage,
  limits: { files: 10, fileSize: 5 * 1024 * 1024, fields: 50 },
  fileFilter(req, file, callback) {
    if (!Object.hasOwn(extensions, file.mimetype)) {
      return callback(new Error("Choose JPG, PNG or WebP images."));
    }
    callback(null, true);
  },
});

function receiveImages(req, res, next) {
  upload.array("images", 10)(req, res, (error) => {
    if (error) {
      if (error instanceof multer.MulterError) {
        return res.status(400).json({
          message: "Upload up to 10 images, no larger than 5 MB each.",
        });
      }
      if (error.message === "Choose JPG, PNG or WebP images.") {
        return res.status(400).json({ message: error.message });
      }
      return next(error);
    }

    if (!req.files?.length) {
      return res.status(400).json({ message: "Please select at least one image." });
    }

    next();
  });
}

async function cleanupFiles(files = []) {
  await Promise.all(files.map(async (file) => {
    try { await fs.unlink(file.path); }
    catch (error) {
      if (error.code !== "ENOENT") console.error("Temporary upload cleanup failed:", error.message);
    }
  }));
}

module.exports = { receiveImages, cleanupFiles };
