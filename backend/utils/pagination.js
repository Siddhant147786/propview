const { fail } = require("./validation");
function pagination(query, limit = 20) {
  const page = query.page === undefined ? 1 : Number(query.page);
  if (Array.isArray(query.page) || !Number.isInteger(page) || page < 1 || page > 10000) fail("Invalid page.");
  return { page, limit, skip: (page - 1) * limit };
}
module.exports = { pagination };
