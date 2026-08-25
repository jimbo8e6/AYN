"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  src: string;
  alt: string;
};

/**
 * Anything at or near the SNES framebuffer width is raw pixel art and must be
 * scaled with hard edges. Anything wider has already been resampled by whoever
 * captured it — an aspect-corrected 640x480 grab, or a box scan — and smoothing
 * is right for those.
 *
 * Measured width decides it, because the file extension only describes what the
 * capture was saved as, not what it contains. Until the image loads, the
 * extension is a reasonable guess.
 */
const NATIVE_MAX_WIDTH = 320;

function looksLikePixelArt(src: string, naturalWidth?: number) {
  if (naturalWidth) return naturalWidth <= NATIVE_MAX_WIDTH;
  return /\.png$/i.test(src);
}

/**
 * An article image that opens full size when clicked.
 *
 * The trigger is the <img> itself rather than a wrapping button, so the markup
 * inside the article stays <p><img></p> and the stylesheet's layout rules —
 * single images centred, several in a block becoming a grid — keep working.
 *
 * Pixel art is enlarged to a whole-number multiple of its native size. SNES
 * output is 256x224, and scaling by 3.7 with image-rendering: pixelated makes
 * some source pixels three screen pixels wide and others four, which looks
 * visibly wrong on sprite work. Photographs just fit to the viewport.
 */
export default function ZoomableImage({ src, alt }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [viewport, setViewport] = useState<{ w: number; h: number } | null>(null);
  const triggerRef = useRef<HTMLImageElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const pixelArt = looksLikePixelArt(src, natural?.w);

  useEffect(() => {
    setMounted(true);

    // onLoad does not fire for an image the browser already had decoded by the
    // time React attached the handler — a cached file, or one that finished
    // during hydration. Without this the measurement never happens and the
    // extension guess stands, which would draw a 600px logo with hard pixel
    // edges purely because it is a .png.
    const img = triggerRef.current;
    if (img?.complete && img.naturalWidth) {
      setNatural({ w: img.naturalWidth, h: img.naturalHeight });
    }
  }, []);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }

    function onResize() {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    }

    onResize();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  /**
   * Explicit width for pixel art, since max-width alone only ever constrains —
   * a 256px capture would sit at 256px however much room it had.
   *
   * Whole-number multiples wherever there is room for at least 2x. Below that
   * (a phone, mostly) an integer scale would snap down to 1x and end up smaller
   * than the image already appears inline, so fill the space instead and accept
   * the uneven pixels.
   */
  function pixelWidth(): number | undefined {
    if (!pixelArt || !natural || !viewport) return undefined;

    const fit = Math.min(
      (viewport.w * 0.92) / natural.w,
      (viewport.h * 0.82) / natural.h,
    );

    return Math.round(natural.w * (fit >= 2 ? Math.floor(fit) : fit));
  }

  const width = pixelWidth();

  return (
    <>
      <img
        ref={triggerRef}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        role="button"
        tabIndex={0}
        aria-label={`Enlarge: ${alt}`}
        className="cursor-zoom-in"
        style={{ imageRendering: pixelArt ? "pixelated" : undefined }}
        onLoad={(event) => {
          const img = event.currentTarget;
          if (img.naturalWidth) {
            setNatural({ w: img.naturalWidth, h: img.naturalHeight });
          }
        }}
        onClick={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen(true);
          }
        }}
      />

      {mounted &&
        open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={alt}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-5 bg-ink/95 p-5"
            onClick={(event) => {
              if (event.target === event.currentTarget) close();
            }}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute top-4 right-5 text-3xl leading-none font-light text-shell transition-opacity hover:opacity-60"
            >
              &times;
            </button>

            <img
              src={src}
              alt={alt}
              style={{
                imageRendering: pixelArt ? "pixelated" : "auto",
                width: width ? `${width}px` : undefined,
                maxWidth: width ? undefined : "92vw",
                maxHeight: width ? undefined : "82vh",
              }}
              className="border border-line-soft/30"
            />

            <p className="max-w-2xl text-center text-sm text-shell/70">{alt}</p>
          </div>,
          document.body,
        )}
    </>
  );
}
