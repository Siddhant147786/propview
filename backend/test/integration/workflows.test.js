const { test } = require("node:test");
const assert = require("node:assert/strict");
const { randomUUID } = require("node:crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { v2: cloudinary } = require("cloudinary");
const { User } = require("../../models/User");
const { Otp } = require("../../models/Otp");
const { Property } = require("../../models/Property");
const { Conversation } = require("../../models/Conversation");
const { ContactMessage } = require("../../models/ContactMessage");
const { CleanupJob } = require("../../models/CleanupJob");
const mail = require("../../services/mailService");

test("complete API workflows with isolated MongoDB persistence", { timeout: 60000 }, async (t) => {
  process.env.JWT_SECRET = "integration-test-secret-with-at-least-32-characters";
  process.env.ADMIN_EMAILS = "admin@example.com";
  process.env.CLOUDINARY_CLOUD_NAME = "test";
  process.env.CLOUDINARY_API_KEY = "test";
  process.env.CLOUDINARY_API_SECRET = "test";
  const database = `propview_test_${randomUUID().replaceAll("-", "")}`;
  await mongoose.connect(process.env.TEST_MONGODB_URI || "mongodb://127.0.0.1:27017", { dbName: database, serverSelectionTimeoutMS: 5000 });
  t.after(async () => {
    assert.equal(mongoose.connection.name, database);
    assert.match(database, /^propview_test_[a-f0-9]{32}$/);
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });
  await Promise.all([User, Otp, Property, Conversation, ContactMessage, CleanupJob].map((model) => model.init()));
  const codes = new Map();
  t.mock.method(mail, "sendCode", async (email, code) => { codes.set(email, code); });
  t.mock.method(cloudinary.uploader, "upload", async () => ({ secure_url: "https://res.cloudinary.com/test/photo.png", public_id: `test/${randomUUID()}` }));
  let deletionFails = false;
  t.mock.method(cloudinary.uploader, "destroy", async () => { if (deletionFails) throw new Error("Provider unavailable"); return { result: "ok" }; });
  const server = require("../../app").listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const root = `http://127.0.0.1:${server.address().port}`;
  async function request(path, { method = "GET", body, cookie, origin } = {}) {
    const headers = {};
    if (cookie) headers.Cookie = cookie;
    if (origin) headers.Origin = origin;
    if (body && !(body instanceof FormData)) { headers["Content-Type"] = "application/json"; body = JSON.stringify(body); }
    const response = await fetch(`${root}/api${path}`, { method, headers, body });
    const data = await response.json();
    return { status: response.status, data, cookie: response.headers.get("set-cookie")?.split(";")[0] };
  }
  async function signin(email, password = "password123") {
    const result = await request("/signin", { method: "POST", body: { email, password } });
    assert.equal(result.status, 200, JSON.stringify(result.data));
    return result.cookie;
  }
  let ownerCookie, buyerCookie, adminCookie, propertyId, conversationId, contactId;
  const details = { title: "Bright two bedroom apartment", description: "A peaceful home in Baner.", listingType: "Buy", propertyType: "Flat", bedrooms: 2, bathrooms: 2, balconies: 1, builtUpArea: 900, floorNumber: 1, totalFloors: 5, parking: "none", price: 5000000, address: { city: "Pune", locality: "Baner", state: "Maharashtra", unitNumber: "Private 101", latitude: 18.56, longitude: 73.78 } };
  function propertyForm(data = details, photo = true) {
    const form = new FormData(); form.append("propertyData", JSON.stringify(data));
    if (photo) form.append("images", new Blob([new Uint8Array([137, 80, 78, 71])], { type: "image/png" }), "photo.png");
    return form;
  }
  await t.test("health, unknown routes, malformed JSON and origin protection", async () => {
    assert.equal((await request("/health")).status, 200);
    assert.equal((await request("/unknown")).status, 404);
    assert.equal((await request("/signin", { method: "POST" })).status, 400);
    assert.equal((await request("/signout", { method: "POST", origin: "https://untrusted.example" })).status, 403);
    const bad = await fetch(`${root}/api/signin`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" });
    assert.equal(bad.status, 400);
  });
  await t.test("email verification, registration and proof replay prevention", async () => {
    assert.equal((await request("/register", { method: "POST", body: { email: "owner@example.com", name: "Owner", password: "password123" } })).status, 400);
    assert.equal((await request("/generateotp", { method: "POST", body: { email: "owner@example.com" } })).status, 200);
    assert.equal((await request("/generateotp", { method: "POST", body: { email: "owner@example.com" } })).status, 429);
    const wrong = codes.get("owner@example.com") === "000000" ? "000001" : "000000";
    assert.equal((await request("/verifyotp", { method: "POST", body: { email: "owner@example.com", otp: wrong } })).status, 400);
    const verified = await request("/verifyotp", { method: "POST", body: { email: "owner@example.com", otp: codes.get("owner@example.com") } });
    assert.equal(verified.status, 200);
    const body = { email: "owner@example.com", name: "Owner", password: "password123", verificationToken: verified.data.verificationToken, isAdmin: true };
    assert.equal((await request("/register", { method: "POST", body })).status, 201);
    assert.equal((await request("/register", { method: "POST", body })).status, 409);
    ownerCookie = await signin("owner@example.com");
    const profile = await request("/me", { cookie: ownerCookie });
    assert.equal(profile.data.user.isAdmin, false);
    assert.equal(profile.data.user.password, undefined);
    const hash = await bcrypt.hash("password123", 10);
    await User.create([{ name: "Buyer", email: "buyer@example.com", password: hash, status: "active" }, { name: "Admin", email: "admin@example.com", password: hash, status: "active" }]);
    buyerCookie = await signin("buyer@example.com"); adminCookie = await signin("admin@example.com");
  });
  await t.test("profile updates ignore role and email escalation", async () => {
    const result = await request("/me", { method: "PATCH", cookie: buyerCookie, body: { name: "New Buyer", phone: "1234567890", email: "admin@example.com", isAdmin: true } });
    assert.equal(result.status, 200); assert.equal(result.data.user.email, "buyer@example.com"); assert.equal(result.data.user.isAdmin, false);
  });
  await t.test("create, search, detail, owner authorization and image-preserving edit", async () => {
    const created = await request("/properties", { method: "POST", cookie: ownerCookie, body: propertyForm() });
    assert.equal(created.status, 201, JSON.stringify(created.data)); propertyId = created.data.property._id;
    const search = await request("/properties?q=2%20bhk%20flats%20in%20Pune%20under%2060%20lakh");
    assert.equal(search.status, 200); assert.equal(search.data.total, 1); assert.equal(search.data.properties[0].address.latitude, 18.56);
    assert.equal(search.data.properties[0].address.unitNumber, undefined);
    assert.equal((await request("/properties?budget=100")).data.total, 0);
    assert.equal((await request("/properties?page=-1")).status, 400);
    assert.equal((await request(`/properties/${propertyId}`)).data.property.address.unitNumber, undefined);
    assert.equal((await request(`/properties/${propertyId}/edit`, { cookie: buyerCookie })).status, 404);
    assert.equal((await request(`/properties/${propertyId}`, { method: "PATCH", cookie: buyerCookie, body: propertyForm(details, false) })).status, 404);
    const edit = await request(`/properties/${propertyId}`, { method: "PATCH", cookie: ownerCookie, body: propertyForm({ ...details, price: 5500000 }, false) });
    assert.equal(edit.status, 200); assert.equal(edit.data.property.images.length, 1);
    assert.equal((await request("/properties/neighbourhoods")).data.areas[0].minPrice, 5500000);
  });
  await t.test("private conversations, unread state, closing and reopening", async () => {
    assert.equal((await request("/messages", { method: "POST", cookie: ownerCookie, body: { propertyId, message: "My own listing" } })).status, 400);
    const created = await request("/messages", { method: "POST", cookie: buyerCookie, body: { propertyId, message: "Is this home available?" } });
    assert.equal(created.status, 201); conversationId = created.data.conversation._id;
    assert.equal((await request("/messages", { cookie: adminCookie })).data.conversations.length, 0);
    assert.equal((await request("/messages", { cookie: ownerCookie })).data.conversations[0].unreadCount, 1);
    assert.equal((await request(`/messages/${conversationId}`, { method: "PATCH", cookie: adminCookie, body: { readCount: 1 } })).status, 404);
    assert.equal((await request(`/messages/${conversationId}`, { method: "PATCH", cookie: ownerCookie, body: { readCount: 1 } })).status, 200);
    assert.equal((await request("/messages", { cookie: ownerCookie })).data.conversations[0].unreadCount, 0);
    assert.equal((await request(`/messages/${conversationId}/replies`, { method: "POST", cookie: ownerCookie, body: { message: "Yes, it is available." } })).status, 200);
    assert.equal((await request("/messages", { cookie: buyerCookie })).data.conversations[0].unreadCount, 1);
    await request(`/messages/${conversationId}`, { method: "PATCH", cookie: buyerCookie, body: { status: "closed" } });
    assert.equal((await request(`/messages/${conversationId}/replies`, { method: "POST", cookie: ownerCookie, body: { message: "More details" } })).status, 409);
    await request(`/messages/${conversationId}`, { method: "PATCH", cookie: ownerCookie, body: { status: "open" } });
    assert.equal((await request(`/messages/${conversationId}/replies`, { method: "POST", cookie: ownerCookie, body: { message: "More details" } })).status, 200);
  });
  await t.test("support enquiries remain private and administrators can respond", async () => {
    const created = await request("/contact", { method: "POST", cookie: buyerCookie, body: { subject: "Listing question", message: "Please help me with my listing." } });
    assert.equal(created.status, 201); contactId = created.data.reference;
    assert.equal((await request("/contact", { cookie: ownerCookie })).data.total, 0);
    assert.equal((await request("/admin/enquiries", { cookie: buyerCookie })).status, 403);
    assert.equal((await request("/admin/enquiries", { cookie: adminCookie })).data.total, 1);
    const response = await request(`/admin/enquiries/${contactId}`, { method: "PATCH", cookie: adminCookie, body: { status: "resolved", response: "You can edit it from your profile." } });
    assert.equal(response.status, 200);
    const own = await request("/contact?status=resolved", { cookie: buyerCookie });
    assert.equal(own.data.enquiries[0].response, "You can edit it from your profile.");
  });
  await t.test("password reset revokes existing sessions and consumes the code", async () => {
    await request("/forgot-password", { method: "POST", body: { email: "buyer@example.com" } });
    const body = { email: "buyer@example.com", otp: codes.get("buyer@example.com"), password: "newpassword123" };
    assert.equal((await request("/reset-password", { method: "POST", body })).status, 200);
    assert.equal((await request("/me", { cookie: buyerCookie })).status, 401);
    assert.equal((await request("/reset-password", { method: "POST", body })).status, 400);
    buyerCookie = await signin("buyer@example.com", "newpassword123");
    assert.equal((await request("/signin", { method: "POST", body: { email: "buyer@example.com", password: "password123" } })).status, 401);
  });
  await t.test("deletion archives a property and persists failed image cleanup", async () => {
    assert.equal((await request(`/properties/${propertyId}`, { method: "DELETE", cookie: buyerCookie })).status, 404);
    deletionFails = true;
    assert.equal((await request(`/properties/${propertyId}`, { method: "DELETE", cookie: ownerCookie })).status, 200);
    assert.equal((await request(`/properties/${propertyId}`)).status, 404);
    assert.equal((await request("/properties")).data.total, 0);
    assert.equal(await CleanupJob.countDocuments(), 1);
    deletionFails = false;
    const stopWorker = require("../../services/cleanupService").startCleanupWorker();
    try {
      for (let attempt = 0; attempt < 50 && await CleanupJob.countDocuments(); attempt++) await new Promise((resolve) => setTimeout(resolve, 20));
      assert.equal(await CleanupJob.countDocuments(), 0, "retry worker removes successful cleanup jobs");
    } finally { stopWorker(); }
    assert.equal((await request("/signout", { method: "POST", cookie: ownerCookie })).cookie, "token=");
  });
});
