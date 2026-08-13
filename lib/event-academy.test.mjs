import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { inheritAcademySocials } from "./event-academy.ts";

const baseEvent = {
  academy: "Unity",
  city: "Kraków",
  facebook_url: null,
  instagram_url: null,
};

const academies = [
  {
    name: "Unity Jiu Jitsu Kraków",
    city: "Kraków",
    facebook_url: "https://facebook.com/unity",
    instagram_url: "https://instagram.com/unity",
  },
];

describe("academy social inheritance", () => {
  it("inherits links for legacy events with shortened academy names", () => {
    const event = inheritAcademySocials(baseEvent, academies);
    assert.equal(event.facebook_url, "https://facebook.com/unity");
    assert.equal(event.instagram_url, "https://instagram.com/unity");
  });

  it("keeps links explicitly configured on an event", () => {
    const event = inheritAcademySocials(
      { ...baseEvent, facebook_url: "https://facebook.com/event" },
      academies,
    );
    assert.equal(event.facebook_url, "https://facebook.com/event");
    assert.equal(event.instagram_url, "https://instagram.com/unity");
  });
});
