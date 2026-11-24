"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type PointerEvent,
  type WheelEvent,
} from "react";
import {
  Check,
  Crop,
  ImagePlus,
  RotateCcw,
  Trash2,
  Upload,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { publicUrl } from "@/lib/supabase/storage";
import { cn } from "@/lib/utils";
import { adminFocusRing } from "@/features/admin/ui/form/controls";
import {
  clampCropOffset,
  computeCoverSize,
  computeCropSourceRect,
  computeTargetDimensions,
  formatFileSize,
} from "@/features/admin/ui/image-utils";

export interface ImageUploadProps {
  name: string;
  currentPath?: string | null;
  required?: boolean;
  hint?: string;
  aspectClass?: string;
  /** Maximum width or height in pixels before WebP compression (default 1200). */
  maxDimension?: number;
  /** WebP quality between 0 and 1 (default 0.84). */
  quality?: number;
  /**
   * Enable interactive crop mode with fixed aspect ratio (e.g., 4 / 5) + zoom + pan
   * and a unified full-frame click/drag-and-drop preview area.
   */
  cropAspect?: number;
  /** Optional readable label for the crop ratio, e.g. "4:5". */
  cropAspectLabel?: string;
}

const ALLOWED_TYPES = new Set(["image/webp", "image/png", "image/jpeg"]);
const MAX_SOURCE_BYTES = 15 * 1024 * 1024;
const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.15;

function loadImageElement(
  url: string,
  crossOrigin?: "anonymous",
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (crossOrigin) img.crossOrigin = crossOrigin;
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Gagal membaca gambar."));
    img.src = url;
  });
}

function canvasToWebpBlob(
  canvas: HTMLCanvasElement,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/webp", quality);
  });
}

async function compressToWebp(
  file: File,
  maxDimension: number,
  quality: number,
): Promise<File> {
  const sourceUrl = URL.createObjectURL(file);
  try {
    const img = await loadImageElement(sourceUrl);
    const { width, height } = computeTargetDimensions(
      img.naturalWidth,
      img.naturalHeight,
      maxDimension,
    );

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    ctx.drawImage(img, 0, 0, width, height);

    let blob = await canvasToWebpBlob(canvas, quality);
    if (blob && blob.size > MAX_UPLOAD_BYTES && quality > 0.72) {
      blob = await canvasToWebpBlob(canvas, 0.72);
    }

    if (!blob || blob.type !== "image/webp") {
      return file;
    }

    const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
    return new File([blob], `${baseName}.webp`, {
      type: "image/webp",
      lastModified: Date.now(),
    });
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
}

async function renderCroppedWebp(params: {
  sourceUrl: string;
  fileName: string;
  isRemote: boolean;
  cropAspect: number;
  viewportWidth: number;
  viewportHeight: number;
  zoom: number;
  offsetX: number;
  offsetY: number;
  maxDimension: number;
  quality: number;
}): Promise<File> {
  const img = await loadImageElement(
    params.sourceUrl,
    params.isRemote ? "anonymous" : undefined,
  );
  const { sx, sy, sw, sh } = computeCropSourceRect({
    naturalWidth: img.naturalWidth,
    naturalHeight: img.naturalHeight,
    viewportWidth: params.viewportWidth,
    viewportHeight: params.viewportHeight,
    zoom: params.zoom,
    offsetX: params.offsetX,
    offsetY: params.offsetY,
  });

  // Compute output dimensions preserving exact cropAspect without upscaling
  let outW: number;
  let outH: number;
  if (params.cropAspect >= 1) {
    outW = Math.min(Math.max(1, Math.round(sw)), params.maxDimension);
    outH = Math.max(1, Math.round(outW / params.cropAspect));
  } else {
    outH = Math.min(Math.max(1, Math.round(sh)), params.maxDimension);
    outW = Math.max(1, Math.round(outH * params.cropAspect));
  }

  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context tidak tersedia.");

  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, outW, outH);

  let blob = await canvasToWebpBlob(canvas, params.quality);
  if (blob && blob.size > MAX_UPLOAD_BYTES && params.quality > 0.72) {
    blob = await canvasToWebpBlob(canvas, 0.72);
  }
  if (!blob) {
    throw new Error("Gagal membuat berkas WebP.");
  }

  const baseName = params.fileName.replace(/\.[^.]+$/, "") || "photo";
  return new File([blob], `${baseName}.webp`, {
    type: "image/webp",
    lastModified: Date.now(),
  });
}

export function ImageUpload({
  name,
  currentPath,
  required,
  hint = "WebP, PNG, atau JPEG · otomatis dioptimalkan ke WebP (maks. 2 MB).",
  aspectClass = "aspect-square w-36",
  maxDimension = 1200,
  quality = 0.84,
  cropAspect,
  cropAspectLabel = "4:5",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const originalSourceRef = useRef<{
    sourceUrl: string;
    fileName: string;
    isRemote: boolean;
    naturalWidth: number;
    naturalHeight: number;
  } | null>(null);
  const pendingCropUrlRef = useRef<string | null>(null);
  const lastCropRef = useRef<{ zoom: number; offset: { x: number; y: number } }>(
    { zoom: 1, offset: { x: 0, y: 0 } },
  );
  const cropViewportRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{
    pointerX: number;
    pointerY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(() =>
    currentPath ? publicUrl(currentPath) : null,
  );
  const [optimizing, setOptimizing] = useState(false);
  const [metaNote, setMetaNote] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  // Interactive crop state (used when cropAspect is set)
  const [cropSession, setCropSession] = useState<{
    sourceUrl: string;
    fileName: string;
    isRemote: boolean;
    naturalWidth: number;
    naturalHeight: number;
  } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [viewportSize, setViewportSize] = useState({ width: 280, height: 350 });

  function revokeActiveObjectUrl() {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }

  function revokePendingCropUrl() {
    if (pendingCropUrlRef.current) {
      URL.revokeObjectURL(pendingCropUrlRef.current);
      pendingCropUrlRef.current = null;
    }
  }

  function revokeOriginalSource() {
    const prev = originalSourceRef.current;
    if (prev && !prev.isRemote && prev.sourceUrl.startsWith("blob:")) {
      URL.revokeObjectURL(prev.sourceUrl);
    }
    originalSourceRef.current = null;
  }

  useEffect(() => {
    return () => {
      revokeActiveObjectUrl();
      revokePendingCropUrl();
      revokeOriginalSource();
    };
  }, []);

  useEffect(() => {
    if (!cropSession || !cropViewportRef.current) return;
    const el = cropViewportRef.current;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setViewportSize({ width: rect.width, height: rect.height });
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [cropSession]);

  function assignFileToInput(file: File) {
    if (inputRef.current && typeof DataTransfer !== "undefined") {
      const dt = new DataTransfer();
      dt.items.add(file);
      inputRef.current.files = dt.files;
    }
  }

  function handleClear() {
    revokeActiveObjectUrl();
    revokePendingCropUrl();
    revokeOriginalSource();
    lastCropRef.current = { zoom: 1, offset: { x: 0, y: 0 } };
    setCropSession(null);
    setPreviewUrl(null);
    setMetaNote(null);
    setLocalError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function updateZoom(nextZoom: number) {
    const clampedZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number(nextZoom.toFixed(2))));
    setZoom(clampedZoom);
    if (!cropSession) return;
    const displayed = computeCoverSize(
      cropSession.naturalWidth,
      cropSession.naturalHeight,
      viewportSize.width,
      viewportSize.height,
      clampedZoom,
    );
    setOffset((prev) => clampCropOffset(prev, displayed, viewportSize));
  }

  async function openCropForFile(file: File) {
    revokePendingCropUrl();
    const url = URL.createObjectURL(file);
    pendingCropUrlRef.current = url;
    try {
      const img = await loadImageElement(url);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
      setCropSession({
        sourceUrl: url,
        fileName: file.name,
        isRemote: false,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      });
    } catch {
      revokePendingCropUrl();
      setLocalError("Gagal membaca gambar. Coba pilih berkas lain.");
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function openCropForCurrentPreview() {
    setLocalError(null);

    // Re-open from preserved uncropped original so admin can zoom back out freely
    if (originalSourceRef.current) {
      setZoom(lastCropRef.current.zoom);
      setOffset(lastCropRef.current.offset);
      setCropSession(originalSourceRef.current);
      return;
    }

    if (!previewUrl) return;
    const isBlob = previewUrl.startsWith("blob:");
    try {
      const img = await loadImageElement(
        previewUrl,
        isBlob ? undefined : "anonymous",
      );
      const source = {
        sourceUrl: previewUrl,
        fileName: "photo.webp",
        isRemote: !isBlob,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      };
      originalSourceRef.current = source;
      setZoom(1);
      setOffset({ x: 0, y: 0 });
      setCropSession(source);
    } catch {
      setLocalError(
        "Foto lama tidak bisa di-crop langsung. Klik atau seret foto baru untuk mengganti & crop.",
      );
    }
  }

  async function handleApplyCrop() {
    if (!cropSession || !cropAspect) return;
    setLocalError(null);
    setOptimizing(true);
    try {
      const optimized = await renderCroppedWebp({
        sourceUrl: cropSession.sourceUrl,
        fileName: cropSession.fileName,
        isRemote: cropSession.isRemote,
        cropAspect,
        viewportWidth: viewportSize.width,
        viewportHeight: viewportSize.height,
        zoom,
        offsetX: offset.x,
        offsetY: offset.y,
        maxDimension,
        quality,
      });

      if (optimized.size > MAX_UPLOAD_BYTES) {
        setLocalError(
          "Ukuran setelah crop & kompresi masih melebihi 2 MB. Pilih gambar lebih kecil.",
        );
        return;
      }

      assignFileToInput(optimized);
      revokeActiveObjectUrl();
      const nextPreview = URL.createObjectURL(optimized);
      objectUrlRef.current = nextPreview;
      setPreviewUrl(nextPreview);
      setMetaNote(
        `Siap unggah (WebP · ${cropAspectLabel} · ${formatFileSize(optimized.size)})`,
      );

      // Preserve the uncropped source in memory so subsequent re-crops can zoom back out
      if (originalSourceRef.current?.sourceUrl !== cropSession.sourceUrl) {
        revokeOriginalSource();
        originalSourceRef.current = cropSession;
      }
      if (pendingCropUrlRef.current === cropSession.sourceUrl) {
        pendingCropUrlRef.current = null;
      }
      lastCropRef.current = { zoom, offset };
      setCropSession(null);
    } catch {
      setLocalError(
        "Gagal memproses crop gambar. Coba pilih ulang berkas gambar dari perangkatmu.",
      );
    } finally {
      setOptimizing(false);
    }
  }

  function handleCancelCrop() {
    revokePendingCropUrl();
    setCropSession(null);
    // If no cropped file was previously committed, clear raw input value
    if (!objectUrlRef.current && inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function processSelectedFile(file: File) {
    setLocalError(null);
    setMetaNote(null);

    if (!ALLOWED_TYPES.has(file.type)) {
      setLocalError("Format harus WebP, PNG, atau JPEG.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    if (file.size > MAX_SOURCE_BYTES) {
      setLocalError("Ukuran gambar mentah maksimal 15 MB.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    if (cropAspect) {
      await openCropForFile(file);
      return;
    }

    setOptimizing(true);
    try {
      const optimized = await compressToWebp(file, maxDimension, quality);
      if (optimized.size > MAX_UPLOAD_BYTES) {
        setLocalError(
          "Ukuran setelah kompresi masih melebihi 2 MB. Pilih gambar lebih kecil.",
        );
        if (inputRef.current) inputRef.current.value = "";
        return;
      }

      assignFileToInput(optimized);
      revokeActiveObjectUrl();
      const nextUrl = URL.createObjectURL(optimized);
      objectUrlRef.current = nextUrl;
      setPreviewUrl(nextUrl);
      setMetaNote(
        optimized.type === "image/webp"
          ? `Siap unggah (WebP · ${formatFileSize(optimized.size)})`
          : `Siap unggah (${formatFileSize(optimized.size)})`,
      );
    } catch {
      setLocalError("Gagal memproses gambar. Coba pilih berkas lain.");
      if (inputRef.current) inputRef.current.value = "";
    } finally {
      setOptimizing(false);
    }
  }

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    await processSelectedFile(file);
  }

  function handleDragOver(e: DragEvent<HTMLElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(true);
  }

  function handleDragLeave(e: DragEvent<HTMLElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);
  }

  async function handleDrop(e: DragEvent<HTMLElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await processSelectedFile(file);
  }

  function handleCropPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (!cropSession) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      originX: offset.x,
      originY: offset.y,
    };
  }

  function handleCropPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!dragStartRef.current || !cropSession) return;
    const dx = e.clientX - dragStartRef.current.pointerX;
    const dy = e.clientY - dragStartRef.current.pointerY;
    const displayed = computeCoverSize(
      cropSession.naturalWidth,
      cropSession.naturalHeight,
      viewportSize.width,
      viewportSize.height,
      zoom,
    );
    setOffset(
      clampCropOffset(
        {
          x: dragStartRef.current.originX + dx,
          y: dragStartRef.current.originY + dy,
        },
        displayed,
        viewportSize,
      ),
    );
  }

  function handleCropPointerUp(e: PointerEvent<HTMLDivElement>) {
    if (dragStartRef.current) {
      e.currentTarget.releasePointerCapture(e.pointerId);
      dragStartRef.current = null;
    }
  }

  function handleCropWheel(e: WheelEvent<HTMLDivElement>) {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    updateZoom(zoom + delta);
  }

  // Unified full-frame dropzone + 4:5 cropper mode
  if (cropAspect) {
    const displayed = cropSession
      ? computeCoverSize(
          cropSession.naturalWidth,
          cropSession.naturalHeight,
          viewportSize.width,
          viewportSize.height,
          zoom,
        )
      : null;

    return (
      <div className="space-y-3">
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept="image/webp,image/png,image/jpeg"
          required={required && !currentPath}
          onChange={handleChange}
          className="sr-only"
        />

        {cropSession && displayed ? (
          <div className="space-y-3 rounded-admin-inner border border-admin-line bg-admin-surface/60 p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 admin-text-label text-admin-ink">
                <Crop className="h-4 w-4" aria-hidden="true" />
                Atur posisi &amp; zoom ({cropAspectLabel})
              </span>
              <span className="admin-text-chip text-admin-text-secondary">
                Seret foto untuk menggeser
              </span>
            </div>

            <div
              ref={cropViewportRef}
              onPointerDown={handleCropPointerDown}
              onPointerMove={handleCropPointerMove}
              onPointerUp={handleCropPointerUp}
              onPointerCancel={handleCropPointerUp}
              onWheel={handleCropWheel}
              style={{ aspectRatio: String(cropAspect) }}
              className="relative mx-auto w-full max-w-68 cursor-grab touch-none overflow-hidden rounded-admin-textarea border border-admin-line-strong bg-admin-canvas select-none active:cursor-grabbing"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cropSession.sourceUrl}
                alt="Area crop foto"
                draggable={false}
                style={{
                  width: `${displayed.width}px`,
                  height: `${displayed.height}px`,
                  transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
                }}
                className="pointer-events-none absolute top-1/2 left-1/2 max-w-none select-none"
              />

              {/* Subtle 3x3 rule-of-thirds guide */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3"
              >
                <span className="border-r border-b border-white/25" />
                <span className="border-r border-b border-white/25" />
                <span className="border-b border-white/25" />
                <span className="border-r border-b border-white/25" />
                <span className="border-r border-b border-white/25" />
                <span className="border-b border-white/25" />
                <span className="border-r border-white/25" />
                <span className="border-r border-white/25" />
                <span />
              </div>
            </div>

            <div className="mx-auto flex w-full max-w-72 items-center gap-2">
              <button
                type="button"
                aria-label="Perkecil zoom"
                disabled={zoom <= MIN_ZOOM}
                onClick={() => updateZoom(zoom - ZOOM_STEP)}
                className={cn(
                  "inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-admin-line bg-admin-canvas text-admin-ink transition-colors hover:bg-admin-surface disabled:cursor-not-allowed disabled:opacity-40",
                  adminFocusRing,
                )}
              >
                <ZoomOut className="h-4 w-4" aria-hidden="true" />
              </button>

              <input
                type="range"
                aria-label="Zoom gambar"
                min={MIN_ZOOM}
                max={MAX_ZOOM}
                step={0.05}
                value={zoom}
                onChange={(e) => updateZoom(Number(e.target.value))}
                className="h-1.5 flex-1 cursor-pointer accent-admin-ink"
              />

              <button
                type="button"
                aria-label="Perbesar zoom"
                disabled={zoom >= MAX_ZOOM}
                onClick={() => updateZoom(zoom + ZOOM_STEP)}
                className={cn(
                  "inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-admin-line bg-admin-canvas text-admin-ink transition-colors hover:bg-admin-surface disabled:cursor-not-allowed disabled:opacity-40",
                  adminFocusRing,
                )}
              >
                <ZoomIn className="h-4 w-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                aria-label="Reset posisi dan zoom"
                title="Reset posisi & zoom"
                onClick={() => {
                  setZoom(1);
                  setOffset({ x: 0, y: 0 });
                }}
                className={cn(
                  "inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-admin-line bg-admin-canvas text-admin-text-secondary transition-colors hover:text-admin-ink",
                  adminFocusRing,
                )}
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <span className="admin-text-chip text-admin-text-secondary">
                Zoom {Math.round(zoom * 100)}%
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancelCrop}
                  disabled={optimizing}
                  className={cn(
                    "inline-flex h-9 cursor-pointer items-center rounded-full border border-admin-line bg-admin-canvas px-4 admin-text-label text-admin-ink transition-colors hover:bg-admin-surface",
                    adminFocusRing,
                  )}
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleApplyCrop}
                  disabled={optimizing}
                  className={cn(
                    "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-admin-ink px-4 admin-text-label text-admin-on-ink transition-colors hover:bg-admin-ink-soft disabled:opacity-50",
                    adminFocusRing,
                  )}
                >
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{optimizing ? "Memproses…" : "Terapkan Crop"}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div
              role="button"
              tabIndex={0}
              aria-label={
                previewUrl
                  ? "Ganti gambar — klik atau seret gambar ke sini"
                  : "Unggah gambar — klik atau seret gambar ke sini"
              }
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  inputRef.current?.click();
                }
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{ aspectRatio: String(cropAspect) }}
              className={cn(
                "group relative mx-auto flex w-full max-w-68 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-admin-inner border transition-colors",
                adminFocusRing,
                isDraggingFile
                  ? "border-admin-ink bg-admin-ink/10"
                  : previewUrl
                    ? "border-admin-line bg-admin-surface"
                    : "border-dashed border-admin-line-strong bg-admin-surface/60 hover:bg-admin-surface",
              )}
            >
              {previewUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Pratinjau foto"
                    className="h-full w-full object-cover"
                  />
                  <div
                    className={cn(
                      "absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/55 px-4 text-center text-white transition-opacity",
                      isDraggingFile
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100",
                    )}
                  >
                    <Upload className="h-6 w-6" aria-hidden="true" />
                    <span className="admin-text-label text-white">
                      {isDraggingFile
                        ? "Lepaskan foto di sini"
                        : "Klik atau seret foto untuk mengganti"}
                    </span>
                    <span className="admin-text-chip font-normal text-white/80">
                      Rasio {cropAspectLabel} · otomatis WebP
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 px-5 text-center">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-admin-canvas text-admin-text-secondary shadow-xs">
                    <ImagePlus className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="admin-text-label text-admin-ink">
                    {isDraggingFile
                      ? "Lepaskan foto di sini"
                      : "Klik atau seret foto ke sini"}
                  </span>
                  <span className="admin-text-chip font-normal text-admin-text-secondary">
                    Rasio {cropAspectLabel} · {hint}
                  </span>
                </div>
              )}
            </div>

            {previewUrl && (
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={openCropForCurrentPreview}
                  className={cn(
                    "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-admin-line bg-admin-canvas px-3.5 admin-text-label text-admin-ink transition-colors hover:bg-admin-surface",
                    adminFocusRing,
                  )}
                >
                  <Crop className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Atur Crop ({cropAspectLabel})</span>
                </button>
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className={cn(
                    "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-admin-line bg-admin-canvas px-3.5 admin-text-label text-admin-ink transition-colors hover:bg-admin-surface",
                    adminFocusRing,
                  )}
                >
                  <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Ganti Foto</span>
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className={cn(
                    "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-admin-line bg-admin-canvas px-3.5 admin-text-label text-admin-danger transition-colors hover:bg-admin-rose-soft",
                    adminFocusRing,
                  )}
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Hapus</span>
                </button>
              </div>
            )}

            {metaNote && (
              <p className="text-center admin-text-chip font-normal text-admin-text-secondary">
                {metaNote}
              </p>
            )}
          </div>
        )}

        {localError && (
          <p
            role="alert"
            className="text-center admin-text-chip font-normal text-admin-danger"
          >
            {localError}
          </p>
        )}
      </div>
    );
  }

  // Standard compact uploader mode (used by Hero, Groups, Events)
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-4">
        {previewUrl && (
          <div
            className={`relative overflow-hidden rounded-admin-textarea border border-admin-line bg-admin-surface ${aspectClass}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Pratinjau gambar"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              aria-label="Hapus pratinjau"
              onClick={handleClear}
              className={cn(
                "absolute top-2 right-2 inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-admin-ink/80 text-admin-on-ink transition-opacity hover:bg-admin-ink active:scale-95",
                adminFocusRing,
              )}
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        )}

        <label
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "inline-flex h-28 min-w-50 flex-1 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-admin-inner border border-dashed px-4 text-center transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-admin-ink",
            isDraggingFile
              ? "border-admin-ink bg-admin-ink/10"
              : "border-admin-line-strong bg-admin-surface/60 hover:bg-admin-surface",
          )}
        >
          <ImagePlus
            className="h-5 w-5 text-admin-text-secondary"
            aria-hidden="true"
          />
          <span className="admin-text-label text-admin-ink">
            {optimizing
              ? "Mengoptimalkan gambar…"
              : previewUrl
                ? "Ganti gambar"
                : "Pilih gambar"}
          </span>
          <span className="admin-text-chip font-normal text-admin-text-secondary">
            {metaNote ?? hint}
          </span>
          <input
            ref={inputRef}
            type="file"
            name={name}
            accept="image/webp,image/png,image/jpeg"
            required={required && !currentPath}
            onChange={handleChange}
            className="sr-only"
          />
        </label>
      </div>

      {localError && (
        <p role="alert" className="admin-text-chip font-normal text-admin-danger">
          {localError}
        </p>
      )}
    </div>
  );
}
