const { fail } = require("../utils/validation");
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function stringParam(value, name) {
  if (value === undefined || value === "") return "";
  if (typeof value !== "string" || value.length > 200) fail(`Invalid ${name}.`);
  return value.trim();
}
function positiveNumber(value, name, fallback) {
  if (value === undefined || value === "") return fallback;
  if (typeof value !== "string" || !Number.isFinite(Number(value)) || Number(value) < 0) fail(`Invalid ${name}.`);
  return Number(value);
}
function buildSearch(query) {
  const filter = { deletedAt: null };
  const city = stringParam(query.city, "city");
  const listingType = stringParam(query.listingType, "listing type");
  const propertyType = stringParam(query.propertyType, "property type");
  if (listingType && !["Buy", "Rent"].includes(listingType)) fail("Invalid listing type.");
  if (propertyType && !["Flat", "Villa", "Plot", "FarmHouse", "Other"].includes(propertyType)) fail("Invalid property type.");
  if (listingType) filter.listingType = listingType;
  if (propertyType) filter.propertyType = propertyType;
  const budget = positiveNumber(query.budget, "budget", undefined);
  if (budget) filter.price = { $lte: budget };
  const bedrooms = positiveNumber(query.bedrooms, "bedrooms", undefined);
  if (bedrooms !== undefined) {
    if (!Number.isInteger(bedrooms)) fail("Bedrooms must be a whole number.");
    filter.bedrooms = bedrooms;
  }
  const clauses = [];
  if (city) clauses.push({ $or: ["address.city", "address.locality"].map((field) => ({ [field]: new RegExp(escapeRegex(city), "i") })) });
  let q = stringParam(query.q, "search");
  const bhk = q.match(/\b(\d+)\s*(?:bhk|bedrooms?|beds?)\b/i);
  if (bhk) { if (filter.bedrooms === undefined) filter.bedrooms = Number(bhk[1]); q = q.replace(bhk[0], " "); }
  const price = q.match(/\b(?:under|below|upto|up to)\s*(?:rs\.?\s*|₹\s*)?(\d+(?:\.\d+)?)\s*(crores?|cr|lakhs?|lacs?|l|k)?\b/i);
  if (price) {
    const unit = (price[2] || "").toLowerCase();
    const amount = Number(price[1]) * (/^(crore|cr)/.test(unit) ? 10000000 : /^(lakh|lac|l)/.test(unit) ? 100000 : unit === "k" ? 1000 : 1);
    if (!filter.price) filter.price = { $lte: amount };
    q = q.replace(price[0], " ");
  }
  if (!filter.listingType && /\brent(?:al)?\b/i.test(q)) filter.listingType = "Rent";
  if (!filter.listingType && /\b(?:buy|sale)\b/i.test(q)) filter.listingType = "Buy";
  if (!filter.propertyType && /\b(?:flats?|apartments?)\b/i.test(q)) filter.propertyType = "Flat";
  if (!filter.propertyType && /\bvillas?\b/i.test(q)) filter.propertyType = "Villa";
  q = q.replace(/\b(?:find|show|me|a|an|the|in|for|near|buy|sale|rent|rental|flats?|apartments?|villas?|homes?|properties)\b/gi, " ");
  const tokens = q.split(/\s+/).filter(Boolean).slice(0, 12);
  for (const token of tokens) clauses.push({ $or: ["title", "description", "address.city", "address.locality"].map((field) => ({ [field]: new RegExp(escapeRegex(token), "i") })) });
  if (clauses.length) filter.$and = clauses;
  const page = positiveNumber(query.page, "page", 1);
  const limit = positiveNumber(query.limit, "limit", 12);
  if (!Number.isInteger(page) || page < 1 || page > 10000 || !Number.isInteger(limit) || limit < 1 || limit > 50) fail("Invalid page or limit.");
  const sortKey = stringParam(query.sort, "sort") || "newest";
  const sorts = { newest: { createdAt: -1, _id: -1 }, priceAsc: { price: 1, _id: 1 }, priceDesc: { price: -1, _id: 1 } };
  if (!Object.hasOwn(sorts, sortKey)) fail("Invalid sorting option.");
  return { filter, page, limit, sort: sorts[sortKey] };
}
module.exports = { buildSearch };
