import { test, expect } from "@playwright/test";
import { Buffer } from "node:buffer";

async function signin(page, email) {
  await page.goto("/signin");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill("password123");
  await page.getByRole("button", { name: /^sign in$/i }).click();
  await expect(page.getByRole("link", { name: "Profile", exact: true })).toBeVisible();
}
test.beforeEach(async ({ page }) => {
  await page.route("https://maps.googleapis.com/**", (route) => route.abort());
  await page.route("https://example.com/test-property.png", (route) => route.fulfill({ contentType: "image/svg+xml", body: '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="#eaf0e6"/></svg>' }));
});
test("browse, filter, property detail, map fallback and protected pages", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/PropView/);
  await page.getByLabel("What are you looking for?").fill("2 bhk flats in Pune under 60 lakh");
  await page.getByRole("button", { name: "Search listings" }).click();
  await expect(page.getByText("1 properties found")).toBeVisible();
  await page.getByRole("button", { name: "Show map" }).click();
  await expect(page.getByText(/map is unavailable|Map view is currently unavailable/)).toBeVisible();
  await page.getByRole("link", { name: "Sunny Baner apartment" }).click();
  await expect(page.getByRole("heading", { name: "Sunny Baner apartment" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Contact the owner" })).toBeVisible();
  await page.goto("/profile");
  await expect(page).toHaveURL(/\/signin$/);
  await page.goto("/does-not-exist");
  await expect(page.getByRole("heading", { name: /not found/i })).toBeVisible();
});
test("buyer sends message, owner replies, unread state and conversation controls", async ({ page }) => {
  await signin(page, "buyer@example.com");
  await page.goto("/searchhomes");
  await page.getByRole("link", { name: "Sunny Baner apartment" }).click();
  await page.getByLabel("Your message").fill("Is the apartment available for a viewing?");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("status")).toContainText("Message sent");
  await signin(page, "owner@example.com");
  await page.goto("/profile");
  await expect(page.getByRole("button", { name: /1 unread/ })).toBeVisible();
  await page.getByRole("button", { name: /Mark read/ }).click();
  await expect(page.getByRole("button", { name: /Mark read/ })).toHaveCount(0);
  await page.getByLabel("Reply", { exact: true }).fill("Yes, a viewing is available tomorrow.");
  await page.getByRole("button", { name: "Reply", exact: true }).click();
  await expect(page.getByText("Yes, a viewing is available tomorrow.")).toBeVisible();
  await page.getByRole("button", { name: "Close conversation" }).click();
  await expect(page.getByText("This conversation is closed.")).toBeVisible();
  await page.getByRole("button", { name: "Reopen conversation" }).click();
  await expect(page.getByLabel("Reply", { exact: true })).toBeVisible();
});
test("support enquiry, admin response, and sender sees resolution", async ({ page }) => {
  await signin(page, "buyer@example.com");
  await page.goto("/contact");
  await page.getByLabel("Subject", { exact: true }).fill("Help with viewing");
  await page.getByLabel("Message", { exact: true }).fill("How do I arrange a viewing with the owner?");
  await page.getByRole("button", { name: "Submit enquiry" }).click();
  await expect(page.getByRole("heading", { name: "Help with viewing" })).toBeVisible();
  await page.goto("/admin");
  await expect(page.getByRole("alert")).toContainText("Administrator access is required");
  await signin(page, "admin@example.com");
  await page.getByRole("link", { name: "Support admin", exact: true }).click();
  await page.getByLabel("Response", { exact: true }).fill("Send the owner a message from the property page.");
  await page.getByRole("combobox", { name: "Status", exact: true }).selectOption("resolved");
  await page.getByRole("button", { name: "Save response" }).click();
  await expect(page.getByRole("status")).toContainText("Enquiry updated");
  await signin(page, "buyer@example.com");
  await page.goto("/contact");
  await expect(page.getByText("Send the owner a message from the property page.")).toBeVisible();
});
test("owner edits and removes a listing", async ({ page }) => {
  await signin(page, "owner@example.com");
  await page.goto("/profile");
  await page.getByRole("link", { name: "Edit", exact: true }).click();
  await page.locator('[name="title"]').fill("Updated Sunny Baner apartment");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page).toHaveURL(/\/profile$/);
  await expect(page.getByRole("link", { name: "Updated Sunny Baner apartment" }).first()).toBeVisible();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Remove", exact: true }).click();
  await expect(page.getByText("You have not listed any properties yet.")).toBeVisible();
});
test("owner publishes a property with a photo and manual address", async ({ page }) => {
  await signin(page, "owner@example.com");
  await page.goto("/listproperty");
  const values = { title: "Newly published Pune home", description: "A sunny apartment near the local park.", bedrooms: "2", bathrooms: "2", balconies: "1", builtUpArea: "950", floorNumber: "1", totalFloors: "4", price: "6500000", "address.city": "Pune", "address.state": "Maharashtra", "address.pincode": "411045", "address.buildingName": "Garden Homes", "address.unitNumber": "101", "address.addressLine": "12 Park Road", "address.locality": "Baner" };
  for (const [name, value] of Object.entries(values)) await page.locator(`form [name="${name}"]`).fill(value);
  await page.locator('[name="listingType"]').selectOption("Buy");
  await page.locator('[name="propertyType"]').selectOption("Flat");
  await page.locator('[name="parking"]').selectOption("none");
  await page.locator('#images').setInputFiles({ name: "photo.png", mimeType: "image/png", buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a9WQAAAAASUVORK5CYII=", "base64") });
  await page.getByRole("button", { name: /Publish property/ }).click();
  await expect(page).toHaveURL(/\/profile$/);
  await expect(page.getByRole("link", { name: "Newly published Pune home" })).toBeVisible();
});
test("informational pages fit a mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ["/", "/about", "/help", "/privacy", "/terms", "/searchhomes", "/register", "/resetpassword"]) {
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    if (path === "/") await page.screenshot({ path: test.info().outputPath("home-mobile.png"), fullPage: true });
  }
});
