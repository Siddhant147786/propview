const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const path = require("path");
const { errorHandler } = require("./middleware/errorHandler");
const app = express();
app.disable("x-powered-by");
if (process.env.TRUST_PROXY_HOPS) app.set("trust proxy", Number(process.env.TRUST_PROXY_HOPS));
app.use((req, res, next) => {
  res.set({ "X-Content-Type-Options": "nosniff", "X-Frame-Options": "SAMEORIGIN", "Referrer-Policy": "strict-origin-when-cross-origin" });
  if (process.env.NODE_ENV === "production") res.set("Strict-Transport-Security", "max-age=31536000");
  if (!["GET", "HEAD", "OPTIONS"].includes(req.method) && req.headers.origin) {
    const expected = process.env.APP_ORIGIN || `${req.protocol}://${req.get("host")}`;
    if (req.headers.origin !== expected) return res.status(403).json({ message: "Request origin is not allowed." });
  }
  next();
});
app.use(express.json({ limit: "100kb" }));
app.use((req, res, next) => { req.body ??= {}; next(); });
app.use(cookieParser());
app.get("/api/health", (req, res) => {
  const ready = mongoose.connection.readyState === 1;
  res.status(ready ? 200 : 503).json({ status: ready ? "ready" : "unavailable" });
});
app.use("/api", require("./routes/auth"));
app.use("/api", require("./routes/session"));
app.use("/api/properties", require("./routes/properties"));
app.use("/api/messages", require("./routes/messages"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api", (req, res) => res.status(404).json({ message: "Endpoint not found." }));
if (process.env.NODE_ENV === "production" || process.env.SERVE_FRONTEND === "true") {
  const directory = path.join(__dirname, "../frontend/dist");
  app.use(express.static(directory, { index: false }));
  app.get("/{*path}", (req, res, next) => {
    if (path.extname(req.path) || !req.accepts("html")) return next();
    res.sendFile(path.join(directory, "index.html"));
  });
}
app.use(errorHandler);
module.exports = app;
