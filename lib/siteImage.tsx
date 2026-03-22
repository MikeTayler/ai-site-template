"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import "./siteImage.css";

/**
 * Image payload for JSON content and registry components (see PROJECT.md).
 * `alt` is required for accessibility.
 */
export interface ImageConfig {
  src: string;
  alt: string;
  focalPoint?: { x: number; y: number };
  width?: number;
  height?: number;
}

/** Presets map to responsive `sizes` for Next/Image (layout context). */
export type SiteImageSizeContext =
  | "hero"
  | "card"
  | "gallery"
  | "thumbnail"
  | "full"
  | "cta"
  | "avatar";

const SIZE_PRESETS: Record<SiteImageSizeContext, string> = {
  hero: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw",
  card: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  gallery: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  thumbnail: "120px",
  full: "100vw",
  cta: "(max-width: 768px) 100vw, min(480px, 45vw)",
  avatar: "96px",
};

export interface SiteImageProps extends ImageConfig {
  className?: string;
  /** Used when `sizes` is not passed — picks a responsive srcset hint for the layout. */
  sizeContext?: SiteImageSizeContext;
  /** Overrides `sizeContext` / defaults when set. */
  sizes?: string;
  fill?: boolean;
  priority?: boolean;
  /** Optional hook for visual editor paths */
  contentPathPrefix?: string;
  objectFit?: "cover" | "contain";
}

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0.5;
  return Math.min(1, Math.max(0, n));
}

function Placeholder({
  alt,
  className,
}: {
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={["siteImage_placeholder", className].filter(Boolean).join(" ")}
      role="img"
      aria-label={alt}
    >
      <span className="siteImage_placeholderInner">Image unavailable</span>
    </div>
  );
}

/**
 * Next.js `Image` with focal point, responsive `sizes`, and theme-based fallbacks
 * when `src` is missing or loading fails. Never use raw `<img>` for content images.
 */
export function SiteImage({
  src,
  alt,
  focalPoint,
  width,
  height,
  className,
  sizeContext = "card",
  sizes,
  fill = false,
  priority,
  objectFit = "cover",
}: SiteImageProps) {
  const [failed, setFailed] = useState(false);

  const onError = useCallback(() => {
    setFailed(true);
  }, []);

  const trimmed = typeof src === "string" ? src.trim() : "";
  const showPlaceholder = !trimmed || failed;
  /** Next/Image's default optimizer often fails for SVGs; load them as static assets instead. */
  const unoptimized = /\.svg(\?|#|$)/i.test(trimmed);

  const objectPosition =
    focalPoint != null
      ? `${clamp01(focalPoint.x) * 100}% ${clamp01(focalPoint.y) * 100}%`
      : "50% 50%";

  const resolvedSizes = sizes ?? SIZE_PRESETS[sizeContext] ?? SIZE_PRESETS.card;
  const w = width ?? 800;
  const h = height ?? 600;

  if (showPlaceholder) {
    return <Placeholder alt={alt} className={className} />;
  }

  const imgClass = ["siteImage_img", className].filter(Boolean).join(" ");

  /** SVG: use a plain img so static files in /public always load the same in dev and on Vercel. */
  if (unoptimized) {
    if (fill) {
      return (
        <div className="siteImage siteImage_fillWrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={trimmed}
            alt={alt}
            className={imgClass}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit,
              objectPosition,
            }}
            onError={onError}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : undefined}
          />
        </div>
      );
    }

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={trimmed}
        alt={alt}
        width={w}
        height={h}
        className={["siteImage", imgClass].filter(Boolean).join(" ")}
        style={{ objectFit, objectPosition }}
        onError={onError}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
      />
    );
  }

  if (fill) {
    return (
      <div className="siteImage siteImage_fillWrap">
        <Image
          src={trimmed}
          alt={alt}
          fill
          sizes={resolvedSizes}
          className={imgClass}
          style={{ objectFit, objectPosition }}
          onError={onError}
          priority={priority}
        />
      </div>
    );
  }

  return (
    <Image
      src={trimmed}
      alt={alt}
      width={w}
      height={h}
      sizes={resolvedSizes}
      className={["siteImage", imgClass].filter(Boolean).join(" ")}
      style={{ objectFit, objectPosition }}
      onError={onError}
      priority={priority}
    />
  );
}
