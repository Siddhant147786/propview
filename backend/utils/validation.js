function fail(message, status = 400) {
  const error = new Error(message); error.status = status; throw error;
}
function emailAddress(value) {
  if (typeof value !== "string" || value.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) fail("Enter a valid email address.");
  return value.trim().toLowerCase();
}
function passwordValue(value) {
  if (typeof value !== "string" || value.length < 8 || Buffer.byteLength(value) > 72) fail("Use a password of at least 8 characters and at most 72 bytes.");
  return value;
}
function textValue(value, label, min = 1, max = 200) {
  if (typeof value !== "string" || value.trim().length < min || value.trim().length > max) fail(`${label} must contain ${min}–${max} characters.`);
  return value.trim();
}
function phoneValue(value) {
  if (value === undefined || value === "") return "";
  if (typeof value !== "string" || !/^\+?[0-9 ()-]{7,20}$/.test(value)) fail("Enter a valid phone number.");
  return value.trim();
}
module.exports = { fail, emailAddress, passwordValue, textValue, phoneValue };
