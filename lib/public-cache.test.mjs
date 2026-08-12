import assert from "node:assert/strict";
import { describe, it } from "node:test";

const locales = ["pl", "en"];

function publicLocalePaths(path) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") {
    return locales.map((locale) => `/${locale}`);
  }
  return locales.map((locale) => `/${locale}${normalized}`);
}

const EVENT_LIST_COLUMNS = [
  "id",
  "slug",
  "title",
  "category",
  "instructor",
  "organizer",
  "academy",
  "city",
  "address",
  "date",
  "end_date",
  "start_time",
  "end_time",
  "price",
  "currency",
  "registration_url",
  "facebook_url",
  "instagram_url",
  "image_url",
  "published",
].join(",");

const EVENT_DETAIL_COLUMNS = [
  EVENT_LIST_COLUMNS,
  "description",
  "latitude",
  "longitude",
  "updated_at",
].join(",");

describe("publicLocalePaths", () => {
  it("maps root to both locales", () => {
    assert.deepEqual(publicLocalePaths("/"), ["/pl", "/en"]);
  });

  it("prefixes nested paths for both locales", () => {
    assert.deepEqual(publicLocalePaths("/academies"), [
      "/pl/academies",
      "/en/academies",
    ]);
    assert.deepEqual(publicLocalePaths("event/unity-open-mat"), [
      "/pl/event/unity-open-mat",
      "/en/event/unity-open-mat",
    ]);
  });
});

describe("column projections", () => {
  it("list columns exclude description; detail includes it", () => {
    assert.equal(EVENT_LIST_COLUMNS.includes("description"), false);
    assert.equal(EVENT_LIST_COLUMNS.includes("slug"), true);
    assert.equal(EVENT_DETAIL_COLUMNS.includes("description"), true);
  });
});
