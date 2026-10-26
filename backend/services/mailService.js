const nodemailer = require("nodemailer");
const { fail } = require("../utils/validation");
async function sendCode(email, code, purpose) {
  if (!process.env.GOOGLE_APP_PASSWORD) fail("Email delivery is not configured yet. Please try again later.", 503);
  const sender = process.env.MAIL_USER || "propview2026@gmail.com";
  const transport = nodemailer.createTransport({ service: "gmail", auth: { user: sender, pass: process.env.GOOGLE_APP_PASSWORD } });
  await transport.sendMail({ from: sender, to: email,
    subject: purpose === "reset" ? "Reset your PropView password" : "Verify your PropView email",
    text: `Your PropView verification code is ${code}. It expires in 5 minutes. Do not share it. If you did not request this code, ignore this email.`,
  });
}
module.exports = { sendCode };
