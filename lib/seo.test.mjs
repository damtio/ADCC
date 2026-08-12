import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  localizedAlternates,
  safeHttpsUrl,
  safeJsonLd,
  warsawDateTime,
} from "./seo.ts";

describe("localized SEO", () => {
  it("builds self-canonical and PL/EN hreflang URLs", () => {
    assert.deepEqual(localizedAlternates("pl", "/academies"), {
      canonical: "https://wolnamata.pl/pl/academies",
      languages: {
        pl: "https://wolnamata.pl/pl/academies",
        en: "https://wolnamata.pl/en/academies",
        "x-default": "https://wolnamata.pl/pl/academies",
      },
    });
  });
});

describe("structured data safety", () => {
  it("escapes script-breaking JSON-LD characters", () => {
    const output = safeJsonLd({ value: "</script><script>alert(1)</script>" });
    assert.equal(output.includes("</script>"), false);
    assert.equal(output.includes("\\u003c/script\\u003e"), true);
  });

  it("allows only HTTPS URLs", () => {
    assert.equal(safeHttpsUrl("https://example.com/path"), "https://example.com/path");
    assert.equal(safeHttpsUrl("javascript:alert(1)"), null);
    assert.equal(safeHttpsUrl("http://example.com"), null);
  });

  it("adds Europe/Warsaw DST offsets", () => {
    assert.equal(warsawDateTime("2026-09-12", "13:00"), "2026-09-12T13:00:00+02:00");
    assert.equal(warsawDateTime("2026-01-12", "13:00"), "2026-01-12T13:00:00+01:00");
  });
});
