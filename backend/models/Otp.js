const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    purpose: { type: String, enum: ["register", "reset"], default: "register" },
    attempts: { type: Number, default: 0 },
    verificationId: String,
  },
  {
    timestamps: true,
  },
);

OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const Otp = mongoose.model("Otp", OtpSchema);

module.exports = { Otp };
