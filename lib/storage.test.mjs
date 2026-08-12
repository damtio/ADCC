import assert from "node:assert/strict";
import { describe, it } from "node:test";

function hasSupportedImageSignature(buffer) {
  const isJpeg =
    buffer.length >= 3 &&
    buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]));
  const isPng =
    buffer.length >= 8 &&
    buffer
      .subarray(0, 8)
      .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const isWebp =
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP";
  return isJpeg || isPng || isWebp;
}

describe("event image signatures", () => {
  it("accepts JPEG, PNG and WebP magic bytes", () => {
    assert.equal(
      hasSupportedImageSignature(Buffer.from([0xff, 0xd8, 0xff, 0x00])),
      true,
    );
    assert.equal(
      hasSupportedImageSignature(
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      ),
      true,
    );
    assert.equal(
      hasSupportedImageSignature(Buffer.from("RIFF0000WEBP", "ascii")),
      true,
    );
  });

  it("rejects GIF and arbitrary bytes", () => {
    assert.equal(
      hasSupportedImageSignature(Buffer.from("GIF89a", "ascii")),
      false,
    );
    assert.equal(
      hasSupportedImageSignature(Buffer.from("not-an-image")),
      false,
    );
  });
});
