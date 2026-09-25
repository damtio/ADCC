import assert from "node:assert/strict";
import { test } from "node:test";
import { warsawToday, upcomingEventsCondition } from "./event-date.ts";

test("uses Warsaw calendar date across summer midnight", () => {
  assert.equal(warsawToday(new Date("2026-09-24T21:59:59Z")), "2026-09-24");
  assert.equal(warsawToday(new Date("2026-09-24T22:00:00Z")), "2026-09-25");
});

test("uses Warsaw winter offset and rolls over year", () => {
  assert.equal(warsawToday(new Date("2026-12-31T23:00:00Z")), "2027-01-01");
});

test("includes today, future events and ongoing multi-day events", () => {
  assert.equal(
    upcomingEventsCondition("2026-09-25"),
    "date.gte.2026-09-25,end_date.gte.2026-09-25",
  );
});
