import { test } from "node:test";
import assert from "node:assert/strict";
import { addressFromPlace } from "./googlePlaces.js";

test("maps Indian address components and coordinates to property fields", () => {
  const component = (type, text, shortText = text) => ({ types: [type], longText: text, shortText });
  const address = addressFromPlace({
    id: "place-123", formattedAddress: "Baner, Pune, Maharashtra, India",
    location: { lat: () => 18.56, lng: () => 73.78 },
    addressComponents: [
      component("country", "India", "IN"),
      component("administrative_area_level_1", "Maharashtra", "MH"),
      component("locality", "Pune"), component("sublocality_level_1", "Baner"),
      component("postal_code", "411045"), component("premise", "Garden Towers"),
      component("street_number", "12"), component("route", "Baner Road"),
    ],
  });
  assert.equal(address.countryCode, "IN");
  assert.equal(address.state, "Maharashtra");
  assert.equal(address.city, "Pune");
  assert.equal(address.locality, "Baner");
  assert.equal(address.addressLine, "12 Baner Road");
  assert.equal(address.latitude, 18.56);
  assert.equal(address.googlePlaceId, "place-123");
});

test("missing components clear old values and postal towns can supply the city", () => {
  const address = addressFromPlace({ addressComponents: [{ types: ["postal_town"], longText: "London" }] });
  assert.equal(address.city, "London");
  assert.equal(address.pincode, "");
  assert.equal(address.buildingName, "");
  assert.equal(address.locality, "");
  assert.equal(address.googlePlaceId, "");
  assert.equal(address.latitude, null);
  assert.equal(address.longitude, null);
});
