// Test-only entrypoint. Uses a disposable database and never sends email or uploads.
const { randomUUID } = require("node:crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
process.env.JWT_SECRET = "browser-test-secret-not-used-in-production";
process.env.ADMIN_EMAILS = "admin@example.com";
process.env.SERVE_FRONTEND = "true";
process.env.NODE_ENV = "test";
process.env.APP_ORIGIN = "http://127.0.0.1:3101";
process.env.CLOUDINARY_CLOUD_NAME = "test";
process.env.CLOUDINARY_API_KEY = "test";
process.env.CLOUDINARY_API_SECRET = "test";
const { v2: cloudinary } = require("cloudinary");
cloudinary.uploader.upload = async () => ({ secure_url: "https://example.com/test-property.png", public_id: `test/${randomUUID()}` });
cloudinary.uploader.destroy = async () => ({ result: "ok" });
require("../../services/mailService").sendCode = async () => {};
const { User } = require("../../models/User");
const { Property } = require("../../models/Property");
const database = `propview_test_${randomUUID().replaceAll("-", "")}`;
let server;
async function stop() {
  if (server) await new Promise((resolve) => server.close(resolve));
  if (mongoose.connection.name === database && /^propview_test_[a-f0-9]{32}$/.test(database)) await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
}
async function start() {
  await mongoose.connect(process.env.TEST_MONGODB_URI || "mongodb://127.0.0.1:27017", { dbName: database });
  const password = await bcrypt.hash("password123", 10);
  const [owner] = await User.create([
    { name: "Test Owner", email: "owner@example.com", password, status: "active" },
    { name: "Test Buyer", email: "buyer@example.com", password, status: "active" },
    { name: "Support Admin", email: "admin@example.com", password, status: "active" },
  ]);
  await Property.create({ ownerId: owner._id, title: "Sunny Baner apartment", description: "A quiet two bedroom home with a balcony.", listingType: "Buy", propertyType: "Flat", bedrooms: 2, bathrooms: 2, balconies: 1, builtUpArea: 900, floorNumber: 2, totalFloors: 5, parking: "none", price: 5000000, address: { city: "Pune", state: "Maharashtra", locality: "Baner", latitude: 18.56, longitude: 73.78 }, images: [{ url: "https://example.com/test-property.png", publicId: "test/seed" }] });
  const app = express();
  app.post("/__test_cleanup", async (req, res) => {
    if (req.get("X-Test-Cleanup") !== "browser-tests" || mongoose.connection.name !== database || !/^propview_test_[a-f0-9]{32}$/.test(database)) return res.sendStatus(403);
    await mongoose.connection.dropDatabase();
    res.sendStatus(200);
  });
  app.use(require("../../app"));
  server = app.listen(3101, "127.0.0.1", () => console.log("Browser test server ready"));
  server.on("error", async (error) => { console.error(error.message); await stop(); process.exitCode = 1; });
  process.on("SIGTERM", () => { void stop(); });
  process.on("SIGINT", () => { void stop(); });
}
start().catch(async (error) => { console.error(error); await stop(); process.exitCode = 1; });
