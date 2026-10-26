function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  if (error.code === 11000) return res.status(409).json({ message: "This record already exists. Please sign in or try again." });
  if (error.name === "ValidationError") return res.status(400).json({ message: Object.values(error.errors).map((item) => item.message).join(" ") });
  if (error.name === "CastError") return res.status(400).json({ message: "Invalid value or record ID." });
  const status = error.status || 500;
  if (status >= 500) console.error(error.message);
  res.status(status).json({ message: status === 500 ? "Something went wrong. Please try again." : error.message });
}
module.exports = { errorHandler };
