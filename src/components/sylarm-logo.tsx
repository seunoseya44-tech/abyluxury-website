import Link from "next/link";

const BRAND = "Aby Luxury Car Rentals";

/**
 * Brand logo. Renders the landscape (or white) logo image, falling back to the
 * bundled asset in /public/brand when no settings-driven URL is supplied.
 * Plain <img> is used intentionally so admin-uploaded logos on any host work
 * without next/image remote-host configuration.
 */
export function SylarmLogo({
  src,
  alt = BRAND,
  height = 38,
  variant = "landscape",
  className = "",
}: {
  src?: string | null;
  alt?: string;
  height?: number;
  variant?: "landscape" | "white";
  className?: string;
}) {
  const fallback =
    variant === "white" ? "/brand/logo-white.png" : "/brand/logo-landscape.png";

  return (
    <Link
      href="/"
      aria-label={`${alt} — home`}
      className={`inline-flex items-center hover:opacity-90 transition ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src || fallback}
        alt={alt}
        style={{ height }}
        className="w-auto object-contain"
      />
    </Link>
  );
}
