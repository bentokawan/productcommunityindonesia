import { describe, expect, it } from "vitest";
import {
  clampCropOffset,
  computeCoverSize,
  computeCropSourceRect,
  computeTargetDimensions,
  detectImageMimeFromBytes,
  formatFileSize,
  isRemovableStoragePath,
} from "@/features/admin/ui/image-utils";

describe("image-utils", () => {
  it("scales down oversized dimensions proportionally without upscaling", () => {
    expect(computeTargetDimensions(3840, 2160, 1920)).toEqual({
      width: 1920,
      height: 1080,
    });
    expect(computeTargetDimensions(1000, 2000, 1200)).toEqual({
      width: 600,
      height: 1200,
    });
    expect(computeTargetDimensions(400, 300, 512)).toEqual({
      width: 400,
      height: 300,
    });
  });

  it("guards static, placeholder, and external paths from storage deletion", () => {
    expect(isRemovableStoragePath("hero/uuid-123.webp")).toBe(true);
    expect(isRemovableStoragePath("events/poster.webp")).toBe(true);
    expect(isRemovableStoragePath("placeholders/slide-1.svg")).toBe(false);
    expect(isRemovableStoragePath("/images/hero/slide-01.png")).toBe(false);
    expect(isRemovableStoragePath("images/team/a.png")).toBe(false);
    expect(isRemovableStoragePath("https://example.com/a.webp")).toBe(false);
    expect(isRemovableStoragePath("")).toBe(false);
    expect(isRemovableStoragePath(null)).toBe(false);
  });

  it("detects WebP, PNG, and JPEG from magic bytes and rejects SVG/text", () => {
    const webp = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50,
    ]);
    const png = new Uint8Array([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
    ]);
    const jpg = new Uint8Array([
      0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
    ]);
    const svg = new TextEncoder().encode("<svg xmlns='http://www.w3.org/2000/svg'></svg>");

    expect(detectImageMimeFromBytes(webp)).toBe("image/webp");
    expect(detectImageMimeFromBytes(png)).toBe("image/png");
    expect(detectImageMimeFromBytes(jpg)).toBe("image/jpeg");
    expect(detectImageMimeFromBytes(svg)).toBeNull();
  });

  it("formats file sizes clearly", () => {
    expect(formatFileSize(512)).toBe("512 B");
    expect(formatFileSize(145 * 1024)).toBe("145 KB");
    expect(formatFileSize(1.5 * 1024 * 1024)).toBe("1.5 MB");
  });

  it("computes 4:5 cover size, clamps pan offset, and maps crop rect accurately", () => {
    // 1000x1000 square image in 280x350 (4:5) viewport at 1x zoom
    const cover = computeCoverSize(1000, 1000, 280, 350, 1);
    expect(cover).toEqual({ width: 350, height: 350 });

    // Clamping pan offset stays within (350-280)/2 = 35px horizontally, 0px vertically
    expect(
      clampCropOffset({ x: 100, y: -50 }, cover, { width: 280, height: 350 }),
    ).toEqual({ x: 35, y: 0 });

    // Centered 4:5 crop of 1000x1000 yields 800x1000 starting at x=100, y=0
    const rect = computeCropSourceRect({
      naturalWidth: 1000,
      naturalHeight: 1000,
      viewportWidth: 280,
      viewportHeight: 350,
      zoom: 1,
      offsetX: 0,
      offsetY: 0,
    });
    expect(Math.round(rect.sx)).toBe(100);
    expect(Math.round(rect.sy)).toBe(0);
    expect(Math.round(rect.sw)).toBe(800);
    expect(Math.round(rect.sh)).toBe(1000);

    // At 2x zoom centered, crop window halves to 400x500
    const zoomed = computeCropSourceRect({
      naturalWidth: 1000,
      naturalHeight: 1000,
      viewportWidth: 280,
      viewportHeight: 350,
      zoom: 2,
      offsetX: 0,
      offsetY: 0,
    });
    expect(Math.round(zoomed.sw)).toBe(400);
    expect(Math.round(zoomed.sh)).toBe(500);
  });
});
