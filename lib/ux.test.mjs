import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  parseEventFilterParams,
  serializeEventFilterParams,
} from "./event-filter-params.ts";
import {
  isWhatsAppPopupCoolingDown,
  isWhatsAppPopupExcludedPath,
  reachedWhatsAppScrollThreshold,
  WHATSAPP_POPUP_COOLDOWN_MS,
} from "./whatsapp-community.ts";

const options = {
  categories: ["Open Mat", "Camp"],
  cities: ["Kraków", "Warszawa"],
  dates: ["2026-09-07", "2026-09-08"],
};

describe("event filter URL params", () => {
  it("reads valid filters and drops invalid values", () => {
    assert.deepEqual(
      parseEventFilterParams(
        "?q=unity&category=Open+Mat&city=Krak%C3%B3w&date=bad",
        options,
      ),
      {
        search: "unity",
        category: "Open Mat",
        city: "Kraków",
        date: "",
      },
    );
  });

  it("writes filters while preserving unrelated params", () => {
    assert.equal(
      serializeEventFilterParams(
        {
          search: "open mat",
          category: "Open Mat",
          city: "",
          date: "2026-09-07",
        },
        "?ref=share",
      ),
      "?ref=share&q=open+mat&category=Open+Mat&date=2026-09-07",
    );
  });
});

describe("WhatsApp popup rules", () => {
  it("excludes auth, admin and user-management routes", () => {
    assert.equal(isWhatsAppPopupExcludedPath("/pl/login"), true);
    assert.equal(isWhatsAppPopupExcludedPath("/en/my-events/edit/1"), true);
    assert.equal(isWhatsAppPopupExcludedPath("/admin"), true);
    assert.equal(isWhatsAppPopupExcludedPath("/pl/event/example"), false);
  });

  it("uses a 14-day cooldown and supports the legacy marker", () => {
    const now = 2_000_000_000_000;
    assert.equal(isWhatsAppPopupCoolingDown("1", now), true);
    assert.equal(
      isWhatsAppPopupCoolingDown(
        String(now - WHATSAPP_POPUP_COOLDOWN_MS + 1),
        now,
      ),
      true,
    );
    assert.equal(
      isWhatsAppPopupCoolingDown(String(now - WHATSAPP_POPUP_COOLDOWN_MS), now),
      false,
    );
  });

  it("opens after the visitor reaches half of the document", () => {
    assert.equal(reachedWhatsAppScrollThreshold(0, 800, 2400), false);
    assert.equal(reachedWhatsAppScrollThreshold(400, 800, 2400), true);
  });
});
