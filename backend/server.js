const mongoose = require("mongoose");
const { Property } = require("./models/Property");
const express = require("express");
const app = express();
const { User } = require("./models/User");
const crypto = require("crypto");
const { Otp } = require("./models/Otp");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const nodemailer = require("nodemailer");
const path = require("path");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { requireAuth } = require("./middleware/auth");


require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "propview2026@gmail.com",
    pass: process.env.GOOGLE_APP_PASSWORD, // The 16-character App Password
  },
});

app.use(express.json());
app.use(cookieParser());
app.use("/api", require("./routes/session"));
app.use("/api/properties", require("./routes/properties"));

mongoose
  .connect("mongodb://127.0.0.1:27017/propview")
  .then((res) => {
    console.log("Database Connected: ");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, () => {
  console.log("server started: ");
});

app.post("/api/generateotp", async (req, res, next) => {
  const { email } = req.body;

  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      message: "Please enter a valid email address.",
    });
  }

  const result = await User.findOne({
    email,
  });

  if (result) {
    return res.status(409).json({
      message: "user already exists, please sign in",
    });
  }

  // generate otp
  const otp = crypto.randomInt(100000, 1000000).toString();
  // add data to collection

  const otphash = await bcrypt.hash(otp, 10);

  await Otp.updateOne(
    { email: email },
    {
      $set: {
        otpHash: otphash,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        isVerified: false,
      },
    },
    { upsert: true, runValidators: true },
  );

  // sent otp to email

  try {
    const info = await transporter.sendMail({
      from: "propview2026@gmail.com", // sender address
      to: email, // list of recipients
      subject: "Verify your email address — PropView", // subject line
      text: `Hello,

              Thank you for signing up for PropView.

              Your email verification code is:

              ${otp}

              This code expires in 5 minutes. Enter it on the PropView registration page to verify your email address.

              For your security, do not share this code with anyone. PropView will never ask you to share your verification code by email, phone, or chat.

              If you did not request this code, you can safely ignore this email.

              Regards,
              The PropView Team`,
      html: `
  <div style="background-color:#faf8f3;padding:32px 16px;font-family:Arial,sans-serif;color:#1b3025;">
    <div style="max-width:480px;margin:0 auto;background-color:#ffffff;border:1px solid #d9e0d8;border-radius:12px;padding:32px;">
      <h1 style="margin:0 0 24px;font-size:24px;color:#164b38;">
        PropView
      </h1>

      <h2 style="margin:0 0 16px;font-size:20px;">
        Verify your email address
      </h2>

      <p style="font-size:15px;line-height:1.6;color:#59695f;">
        Thank you for signing up for PropView. Enter the following
        code on the registration page to verify your email address.
      </p>

      <div style="margin:24px 0;padding:20px;background-color:#f0f5f1;border-radius:8px;text-align:center;">
        <span style="font-size:32px;font-weight:bold;letter-spacing:6px;color:#164b38;">
          ${otp}
        </span>
      </div>

      <p style="font-size:14px;line-height:1.6;">
        This code expires in <strong>5 minutes</strong>.
      </p>

      <p style="font-size:14px;line-height:1.6;color:#59695f;">
        Do not share this code with anyone. PropView will never
        ask you to share your verification code by email, phone, or chat.
      </p>

      <hr style="border:0;border-top:1px solid #d9e0d8;margin:24px 0;">

      <p style="font-size:13px;line-height:1.6;color:#59695f;">
        If you did not request this code, you can safely ignore this email.
      </p>

      <p style="margin-bottom:0;font-size:14px;color:#164b38;">
        Regards,<br>
        <strong>The PropView Team</strong>
      </p>
    </div>
  </div>
`,
    });

    console.log("Message sent: %s", info.messageId);
    // Preview URL is only available when using an Ethereal test account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    return next(err);
  }

  res.status(200).json({
    message: "otp sent: ",
  });

  // send response
});

app.post("/api/verifyotp", async (req, res, next) => {
  const { otp, email } = req.body;

  const result = await Otp.findOne({
    email,
  });

  if (!result) {
    return res.status(400).json({
      message: "Please request an OTP first.",
    });
  }

  if (
    result.expiresAt >= Date.now() &&
    (await bcrypt.compare(otp, result.otpHash))
  ) {
    await Otp.updateOne({ email }, { $set: { isVerified: true } });
    return res.status(200).json({
      message: "email verification is complete: \n",
    });
  } else {
    return res.status(400).json({
      message: "The OTP is incorrect or has expired.",
    });
  }
});

app.post("/api/register", async (req, res, next) => {
  const { email, name, phone, password } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);

  const document = await Otp.findOne({
    email,
  });

  if (!document || !document.isVerified) {
    return res.status(409).json({
      message: "Please verify your email first.",
    });
  }

  const user = new User({
    email: email,
    name: name,
    phone: phone,
    password: hashPassword,
    status: "active",
  });

  try {
    await user.save();
    res.status(201).json({
      message: "Account creates sucessfully, please signned in",
    });
  } catch (err) {
    return next(err);
  }
});

app.post("/api/signin", async (req, res) => {
  const { email, password } = req.body;

  if (
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    password.length === 0
  ) {
    return res.status(400).json({
      message: "Please enter your email and password.",
    });
  }

  const document = await User.findOne({ email });
  if (!document || document.status !== "active") {
    return res.status(401).json({
      message: "Invalid email or password.",
    });
  }

  if (await bcrypt.compare(password, document.password)) {
    const token = jwt.sign(
      { userId: document._id.toString() },
      process.env.JWT_SECRET,
      { algorithm: "HS256", expiresIn: "24h" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24* 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({
      message: "Signed in successfully.",
      user: { _id: document._id, name: document.name, email: document.email, phone: document.phone },
    });
  } else {
    return res.status(401).json({
      message: "Invalid email or password.",
    });
  }
});

app.get("/api/isloggedin", requireAuth, (req, res) => {
  res.set("Cache-Control", "no-store");
  res.json({ message: "You are signed in." });
});



app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack
  res.status(500).json({
    message: "something went wrong: ",
  }); // Send a response
});
