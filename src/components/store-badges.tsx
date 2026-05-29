import Link from "next/link";

/** Black pill "Get it on Google Play" badge (self-contained, no image asset). */
export function GooglePlayBadge({ href }: { href: string }) {
  return (
    <Link
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      className="inline-flex items-center gap-3 h-[52px] px-4 rounded-xl bg-black text-white border border-white/15 hover:bg-black/85 transition"
      aria-label="Get it on Google Play"
    >
      <svg width="24" height="26" viewBox="0 0 512 512" aria-hidden>
        <path fill="#00D3FF" d="M47 24 296 256 47 488c-9 5-21 1-21-12V36c0-13 12-17 21-12z" />
        <path fill="#00F076" d="M47 24c4-2 9-2 14 1l276 160-58 54L47 24z" />
        <path fill="#FF3A44" d="M47 488c4 2 9 2 14-1l276-160-58-54L47 488z" transform="translate(0 0)" />
        <path fill="#FFC900" d="M337 185 411 228c18 10 18 46 0 56l-74 43-62-71 62-71z" />
      </svg>
      <span className="flex flex-col leading-tight">
        <span className="text-[10px] uppercase tracking-wide opacity-80">Get it on</span>
        <span className="text-lg font-semibold -mt-0.5">Google Play</span>
      </span>
    </Link>
  );
}

/** Black pill "Download on the App Store" badge. */
export function AppStoreBadge({ href }: { href: string }) {
  return (
    <Link
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      className="inline-flex items-center gap-3 h-[52px] px-4 rounded-xl bg-black text-white border border-white/15 hover:bg-black/85 transition"
      aria-label="Download on the App Store"
    >
      <svg width="22" height="26" viewBox="0 0 384 512" fill="white" aria-hidden>
        <path d="M318 268c-1-58 47-86 49-87-27-39-68-44-83-45-35-4-69 21-87 21-18 0-46-20-75-20-39 1-74 22-94 57-40 69-10 171 29 227 19 27 42 58 72 57 29-1 40-19 75-19 35 0 45 19 75 18 31-1 51-28 70-55 22-32 31-63 31-65-1-1-60-23-61-91zM262 84c16-19 27-46 24-73-23 1-51 15-67 34-15 17-28 44-25 70 26 2 52-13 68-31z" />
      </svg>
      <span className="flex flex-col leading-tight">
        <span className="text-[10px] uppercase tracking-wide opacity-80">Download on the</span>
        <span className="text-lg font-semibold -mt-0.5">App Store</span>
      </span>
    </Link>
  );
}
