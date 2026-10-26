const { test } = require("node:test");
const assert = require("node:assert/strict");
const { buildSearch } = require("../services/propertySearch");
test("natural language search extracts bedrooms, rent and rupee budgets", () => {
  const { filter } = buildSearch({ q: "2 bhk flats for rent in Pune under 30k" });
  assert.equal(filter.bedrooms, 2); assert.equal(filter.listingType, "Rent");
  assert.equal(filter.propertyType, "Flat"); assert.deepEqual(filter.price, { $lte: 30000 });
  assert.equal(filter.$and.length, 1);
});
test("explicit filters override natural language and regex input is escaped", () => {
  const { filter } = buildSearch({ q: "3 bhk under 2 crore", bedrooms: "1", budget: "100000", city: "Pune.*" });
  assert.equal(filter.bedrooms, 1); assert.deepEqual(filter.price, { $lte: 100000 });
  assert.equal(filter.$and[0].$or[0]["address.city"].test("Pune City"), false);
});
test("rejects object injection, invalid enums and excessive pagination", () => {
  for (const query of [{ city: { $ne: "" } }, { sort: "__proto__" }, { page: "0" }, { limit: "100" }, { bedrooms: "1.2" }, { budget: "NaN" }, { listingType: "Other" }]) assert.throws(() => buildSearch(query));
});
