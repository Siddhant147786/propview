const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const { Otp } = require("../models/Otp");
const mail = require("../services/mailService");
const { publicUser, setSession, cookieOptions } = require("../services/sessionService");
const { fail, emailAddress, passwordValue, textValue, phoneValue } = require("../utils/validation");

async function issueCode(email, purpose) {
  const code = crypto.randomInt(100000, 1000000).toString();
  const otpHash = await bcrypt.hash(code, 10);
  const cutoff = new Date(Date.now() - 60000);
  let record;
  try {
    record = await Otp.findOneAndUpdate({ email, $or: [{ updatedAt: { $lte: cutoff } }, { updatedAt: { $exists: false } }] }, {
      $set: { otpHash, purpose, expiresAt: new Date(Date.now() + 5 * 60000), attempts: 0, isVerified: false },
      $unset: { verificationId: 1 },
    }, { upsert: true, returnDocument: "after", runValidators: true });
  } catch (error) {
    if (error.code === 11000) fail("Wait a minute before requesting another code.", 429);
    throw error;
  }
  try { await mail.sendCode(email, code, purpose); }
  catch (error) {
    await Otp.deleteOne({ _id: record._id, otpHash });
    if (error.status) throw error;
    fail("Could not send the email. Please try again later.", 503);
  }
}
async function checkCode(email, code, purpose) {
  if (typeof code !== "string" || !/^\d{6}$/.test(code)) fail("Enter the six-digit code.");
  const record = await Otp.findOneAndUpdate({ email, purpose, expiresAt: { $gt: new Date() }, attempts: { $lt: 5 } }, { $inc: { attempts: 1 } });
  if (!record || !await bcrypt.compare(code, record.otpHash)) fail("The code is incorrect, expired, or has reached its attempt limit.");
  return record;
}
exports.generateOtp = async (req, res) => {
  const email = emailAddress(req.body.email);
  if (await User.exists({ email })) fail("An account already exists. Please sign in.", 409);
  await issueCode(email, "register");
  res.json({ message: "Verification code sent. It expires in 5 minutes." });
};
exports.verifyOtp = async (req, res) => {
  const email = emailAddress(req.body.email);
  const record = await checkCode(email, req.body.otp, "register");
  const verificationId = crypto.randomUUID();
  const result = await Otp.updateOne({ _id: record._id, otpHash: record.otpHash, purpose: "register", expiresAt: { $gt: new Date() } }, { $set: { isVerified: true, verificationId } });
  if (!result.modifiedCount) fail("Request a new verification code.");
  const verificationToken = jwt.sign({ email, verificationId, purpose: "register" }, process.env.JWT_SECRET, { algorithm: "HS256", expiresIn: "5m" });
  res.json({ message: "Email verified. You can create your account.", verificationToken });
};
exports.register = async (req, res) => {
  const email = emailAddress(req.body.email);
  const name = textValue(req.body.name, "Name", 2, 100);
  const password = passwordValue(req.body.password);
  const phone = phoneValue(req.body.phone);
  let proof;
  try { proof = jwt.verify(req.body.verificationToken, process.env.JWT_SECRET, { algorithms: ["HS256"] }); }
  catch { fail("Please verify your email first."); }
  if (proof.email !== email || proof.purpose !== "register" || !proof.verificationId) fail("Please verify your email first.");
  if (await User.exists({ email })) fail("An account already exists. Please sign in.", 409);
  const hash = await bcrypt.hash(password, 10);
  const record = await Otp.findOneAndDelete({ email, purpose: "register", isVerified: true, verificationId: proof.verificationId, expiresAt: { $gt: new Date() } });
  if (!record) fail("Verification expired. Request a new code.");
  await User.create({ email, name, phone, password: hash, status: "active" });
  res.status(201).json({ message: "Account created. Please sign in." });
};
exports.signin = async (req, res) => {
  const email = emailAddress(req.body.email);
  if (typeof req.body.password !== "string" || !req.body.password) fail("Enter your password.");
  const user = await User.findOne({ email });
  if (!user || user.status !== "active" || !await bcrypt.compare(req.body.password, user.password)) fail("Invalid email or password.", 401);
  setSession(res, user);
  res.json({ message: "Signed in successfully.", user: publicUser(user) });
};
exports.requestReset = async (req, res) => {
  const email = emailAddress(req.body.email);
  const user = await User.findOne({ email, status: "active" });
  if (user) await issueCode(email, "reset");
  res.json({ message: "If an active account exists, a reset code has been sent." });
};
exports.resetPassword = async (req, res) => {
  const email = emailAddress(req.body.email);
  const password = passwordValue(req.body.password);
  const record = await checkCode(email, req.body.otp, "reset");
  const hash = await bcrypt.hash(password, 10);
  const consumed = await Otp.findOneAndDelete({ _id: record._id, otpHash: record.otpHash, purpose: "reset", expiresAt: { $gt: new Date() } });
  if (!consumed) fail("Request a new reset code.");
  const user = await User.findOneAndUpdate({ email, status: "active" }, { $set: { password: hash }, $inc: { tokenVersion: 1 } });
  if (!user) fail("Unable to reset this account.");
  res.clearCookie("token", cookieOptions());
  res.json({ message: "Password changed. Please sign in again." });
};
