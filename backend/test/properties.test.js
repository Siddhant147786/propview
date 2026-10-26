const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { v2: cloudinary } = require("cloudinary");
const { User } = require("../models/User");
const { Property } = require("../models/Property");
const { errorHandler } = require("../middleware/errorHandler");

test("property submission, sessions and cleanup", async (t) => {
  process.env.JWT_SECRET = "test-only-not-a-production-secret";
  process.env.CLOUDINARY_CLOUD_NAME = "test";
  process.env.CLOUDINARY_API_KEY = "test";
  process.env.CLOUDINARY_API_SECRET = "test";
  const owner = "507f1f77bcf86cd799439011";
  const account = { _id: owner, name: "Test Owner", email: "owner@example.com", status: "active" };
  t.mock.method(User, "findById", () => ({ select: async () => account }));
  let saved;
  let failSave = false;
  let uploads = 0;
  let failUpload = 0;
  const destroyed = [];
  t.mock.method(Property.prototype, "save", async function () {
    if (failSave) throw new Error("Simulated database failure");
    saved = this.toObject();
    return this;
  });
  t.mock.method(cloudinary.uploader, "upload", async (file, options) => {
    assert.equal(options.resource_type, "image");
    assert.ok((await fs.readFile(file)).length > 0);
    uploads += 1;
    if (uploads === failUpload) throw new Error("Simulated provider failure");
    return { secure_url: `https://res.cloudinary.com/test/${uploads}.png`, public_id: `test/${uploads}` };
  });
  t.mock.method(cloudinary.uploader, "destroy", async (id) => { destroyed.push(id); return { result: "ok" }; });
  const app = express();
  app.use(cookieParser());
  app.use("/api", require("../routes/session"));
  app.use("/api/properties", require("../routes/properties"));
  app.use(errorHandler);
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const root = `http://127.0.0.1:${server.address().port}`;
  const headers = { Cookie: `token=${jwt.sign({ userId: owner }, process.env.JWT_SECRET)}` };
  const folder = path.join(__dirname, "../uploads");
  const initialFiles = await fs.readdir(folder);
  const data = {
    title: "Bright two bedroom apartment", listingType: "Buy", propertyType: "Flat",
    bedrooms: 2, bathrooms: 2, balconies: 1, builtUpArea: 900, floorNumber: 1,
    totalFloors: 5, parking: "none", price: 5000000,
    address: { city: "Pune", state: "Maharashtra" },
  };
  function form(details = data, count = 1, type = "image/png", size = 4) {
    const body = new FormData();
    body.append("propertyData", typeof details === "string" ? details : JSON.stringify(details));
    for (let i = 0; i < count; i++) body.append("images", new Blob([new Uint8Array(size)], { type }), "photo.png");
    return body;
  }
  async function post(body, auth = headers) {
    return fetch(`${root}/api/properties`, { method: "POST", headers: auth, body });
  }
  async function clean() {
    for (let attempt = 0; attempt < 50; attempt++) {
      const current = await fs.readdir(folder);
      if (JSON.stringify(current.sort()) === JSON.stringify(initialFiles.sort())) return;
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
    assert.deepEqual(await fs.readdir(folder), initialFiles, "temporary files should be removed");
  }

  await t.test("rejects unauthenticated, expired and inactive sessions", async () => {
    assert.equal((await post(form(), {})).status, 401);
    const expired = { Cookie: `token=${jwt.sign({ userId: owner }, process.env.JWT_SECRET, { expiresIn: -1 })}` };
    assert.equal((await post(form(), expired)).status, 401);
    account.status = "suspended";
    assert.equal((await post(form())).status, 401);
    account.status = "active";
    assert.equal(uploads, 0);
  });
  await t.test("returns safe profile data and clears cookie on signout", async () => {
    const response = await fetch(`${root}/api/me`, { headers });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal((await response.json()).user.email, account.email);
    const logout = await fetch(`${root}/api/signout`, { method: "POST", headers });
    assert.equal(logout.status, 200);
    assert.match(logout.headers.get("set-cookie"), /token=;/);
  });
  await t.test("requires provider configuration before receiving images", async () => {
    delete process.env.CLOUDINARY_API_SECRET;
    assert.equal((await post(form())).status, 503);
    process.env.CLOUDINARY_API_SECRET = "test";
    await clean();
  });
  await t.test("validates JSON and model before uploading", async () => {
    assert.equal((await post(form("{"))).status, 400);
    assert.equal((await post(form({ ...data, price: -1 }))).status, 400);
    assert.equal((await post(form({ ...data, title: "tiny" }))).status, 400);
    assert.equal(uploads, 0);
    await clean();
  });
  await t.test("rejects missing, excessive, oversized and unsupported files", async () => {
    assert.equal((await post(form(data, 0))).status, 400);
    assert.equal((await post(form(data, 11))).status, 400);
    assert.equal((await post(form(data, 1, "text/plain"))).status, 400);
    assert.equal((await post(form(data, 1, "image/png", 5 * 1024 * 1024 + 1))).status, 400);
    await clean();
  });
  await t.test("saves provider URLs and authenticated owner, ignoring client ownership", async () => {
    const response = await post(form({ ...data, ownerId: "507f191e810c19729de860ea", images: [{ url: "fake" }], admin: true }, 2));
    assert.equal(response.status, 201);
    assert.equal(saved.ownerId.toString(), owner);
    assert.equal(saved.images.length, 2);
    assert.match(saved.images[0].url, /^https:\/\/res.cloudinary.com\//);
    assert.equal(saved.images[0].publicId, "test/1");
    assert.equal(saved.admin, undefined);
    await clean();
  });
  await t.test("removes uploaded assets and disk files after database failure", async () => {
    failSave = true;
    assert.equal((await post(form())).status, 500);
    assert.ok(destroyed.includes("test/3"));
    failSave = false;
    await clean();
  });
  await t.test("removes earlier successful uploads after partial provider failure", async () => {
    failUpload = uploads + 2;
    assert.equal((await post(form(data, 2))).status, 502);
    assert.ok(destroyed.includes("test/4"));
    await clean();
  });
  await t.test("lists only properties belonging to the signed-in user", async () => {
    t.mock.method(Property, "find", (filter) => {
      assert.equal(filter.ownerId, owner);
      return { select: () => ({ sort: async () => [saved] }) };
    });
    const response = await fetch(`${root}/api/properties/mine`, { headers });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).properties.length, 1);
  });
});
