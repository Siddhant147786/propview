// Use a shared store when hosting multiple server instances.
function rateLimit(max = 20, windowMs = 15 * 60 * 1000) {
  const requests = new Map();
  return (req, res, next) => {
    const now = Date.now();
    for (const [key, value] of requests) if (value.until <= now) requests.delete(key);
    const key = req.ip;
    const value = requests.get(key) || { count: 0, until: now + windowMs };
    if (value.count >= max || (!requests.has(key) && requests.size >= 10000)) {
      res.set("Retry-After", String(Math.max(1, Math.ceil((value.until - now) / 1000))));
      return res.status(429).json({ message: "Too many requests. Please try again later." });
    }
    value.count++; requests.set(key, value); next();
  };
}
module.exports = { rateLimit };
