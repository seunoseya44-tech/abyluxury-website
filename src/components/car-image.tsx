"use client";

import Image from "next/image";
import { useState } from "react";
import { classNames } from "@/lib/format";

type CarImageProps = {
  src: string | null | undefined;
  alt: string;
  brand?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
  rounded?: boolean;
};

/**
 * Renders a car photo when one is available, otherwise a branded gradient
 * placeholder. Also falls back to the placeholder if the remote image fails
 * to load (e.g. an unreachable host), so cards never show a broken-image icon.
 */
export function CarImage({
  src,
  alt,
  brand,
  fill = true,
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
  className,
}: CarImageProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  if (showImage) {
    return (
      <Image
        src={src as string}
        alt={alt}
        fill={fill}
        sizes={sizes}
        priority={priority}
        onError={() => setFailed(true)}
        className={classNames("object-cover", className)}
      />
    );
  }

  const initial = (brand ?? alt ?? "S").trim().charAt(0).toUpperCase();

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none bg-gradient-to-br from-[var(--color-bg-3)] via-[var(--color-card)] to-[var(--color-sylarm-red)]/25">
      <div className="grid-noise absolute inset-0 opacity-40" />
      <div className="relative flex flex-col items-center">
        <span
          className="flex items-center justify-center rounded-2xl font-display font-extrabold text-3xl text-white shadow-[0_0_30px_rgba(232,58,74,0.45)]"
          style={{
            width: 64,
            height: 64,
            background:
              "linear-gradient(135deg, var(--color-sylarm-red), var(--color-sylarm-red-light))",
          }}
        >
          {initial}
        </span>
        <svg
          className="mt-3 opacity-30"
          width="44"
          height="44"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M3 13l2-5a2 2 0 012-1.4h10a2 2 0 012 1.4l2 5v5a1 1 0 01-1 1h-2a1 1 0 01-1-1v-1H7v1a1 1 0 01-1 1H4a1 1 0 01-1-1v-5z"
            stroke="white"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[var(--color-text-faint)]">
          Photo coming soon
        </span>
      </div>
    </div>
  );
}
