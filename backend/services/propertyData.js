const { fail } = require("../utils/validation");
const propertyFields = ["title", "description", "listingType", "propertyType", "bedrooms", "bathrooms", "balconies", "builtUpArea", "floorNumber", "totalFloors", "propertyAge", "facing", "furnishings", "amenities", "parking", "price", "maintenance"];
const addressFields = ["googlePlaceId", "formattedAddress", "countryCode", "state", "city", "locality", "pincode", "buildingName", "addressLine", "unitNumber", "landmark", "latitude", "longitude"];
const pick = (source, keys) => Object.fromEntries(keys.filter((key) => Object.hasOwn(source, key)).map((key) => [key, source[key]]));
function parseProperty(body) {
  let data;
  try { data = JSON.parse(body?.propertyData); } catch { fail("Property details must be valid JSON."); }
  if (!data || typeof data !== "object" || Array.isArray(data) || !data.address || typeof data.address !== "object" || Array.isArray(data.address)) fail("Please enter the property and address details.");
  for (const field of ["bedrooms", "bathrooms", "balconies", "floorNumber", "totalFloors"]) {
    if (!Number.isInteger(data[field]) || data[field] < 0) fail(`${field} must be a nonnegative whole number.`);
  }
  if (data.floorNumber > data.totalFloors) fail("Floor number cannot exceed total floors.");
  for (const field of ["price", "builtUpArea"]) if (typeof data[field] !== "number" || !Number.isFinite(data[field]) || data[field] <= 0) fail(`${field} must be greater than zero.`);
  for (const field of ["furnishings", "amenities"]) {
    if (data[field] !== undefined && (!Array.isArray(data[field]) || data[field].length > 30 || data[field].some((v) => typeof v !== "string" || v.length > 100))) fail(`Invalid ${field}.`);
  }
  return { ...pick(data, propertyFields), address: pick(data.address, addressFields) };
}
module.exports = { parseProperty };
