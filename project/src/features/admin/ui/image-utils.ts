export function computeTargetDimensions(
  width: number,
  height: number,
  maxDimension: number,
): { width: number; height: number } {
  if (width <= 0 || height <= 0 || maxDimension <= 0) {
    return { width: Math.max(1, width), height: Math.max(1, height) };
  }
  const longest = Math.max(width, height);
  if (longest <= maxDimension) {
    return { width, height };
  }
  const scale = maxDimension / longest;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

export function isRemovableStoragePath(
  path: string | null | undefined,
): path is string {
  if (!path) return false;
  const trimmed = path.trim();
  if (!trimmed) return false;
  if (
    trimmed.startsWith("placeholders/") ||
    trimmed.startsWith("/placeholders/") ||
    trimmed.startsWith("images/") ||
    trimmed.startsWith("/images/") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://")
  ) {
    return false;
  }
  return true;
}

export type SupportedImageMime = "image/webp" | "image/png" | "image/jpeg";

export function detectImageMimeFromBytes(
  bytes: Uint8Array,
): SupportedImageMime | null {
  if (bytes.length < 12) return null;

  // WebP: "RIFF" .... "WEBP"
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "image/png";
  }

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }

  return null;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export function computeCoverSize(
  naturalWidth: number,
  naturalHeight: number,
  viewportWidth: number,
  viewportHeight: number,
  zoom: number,
): { width: number; height: number } {
  const safeZoom = Math.max(1, zoom);
  const imgRatio = naturalWidth / naturalHeight;
  const vpRatio = viewportWidth / viewportHeight;
  const baseWidth =
    imgRatio > vpRatio ? viewportHeight * imgRatio : viewportWidth;
  const baseHeight =
    imgRatio > vpRatio ? viewportHeight : viewportWidth / imgRatio;
  return {
    width: baseWidth * safeZoom,
    height: baseHeight * safeZoom,
  };
}

export function clampCropOffset(
  offset: { x: number; y: number },
  displayed: { width: number; height: number },
  viewport: { width: number; height: number },
): { x: number; y: number } {
  const maxX = Math.max(0, (displayed.width - viewport.width) / 2);
  const maxY = Math.max(0, (displayed.height - viewport.height) / 2);
  return {
    x: Math.min(maxX, Math.max(-maxX, offset.x)) || 0,
    y: Math.min(maxY, Math.max(-maxY, offset.y)) || 0,
  };
}

export function computeCropSourceRect(params: {
  naturalWidth: number;
  naturalHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  zoom: number;
  offsetX: number;
  offsetY: number;
}): { sx: number; sy: number; sw: number; sh: number } {
  const displayed = computeCoverSize(
    params.naturalWidth,
    params.naturalHeight,
    params.viewportWidth,
    params.viewportHeight,
    params.zoom,
  );
  const clamped = clampCropOffset(
    { x: params.offsetX, y: params.offsetY },
    displayed,
    { width: params.viewportWidth, height: params.viewportHeight },
  );
  const scaleToSource = params.naturalWidth / displayed.width;
  const leftDisp = (displayed.width - params.viewportWidth) / 2 - clamped.x;
  const topDisp = (displayed.height - params.viewportHeight) / 2 - clamped.y;

  return {
    sx: Math.max(0, leftDisp * scaleToSource),
    sy: Math.max(0, topDisp * scaleToSource),
    sw: Math.min(params.naturalWidth, params.viewportWidth * scaleToSource),
    sh: Math.min(params.naturalHeight, params.viewportHeight * scaleToSource),
  };
}
