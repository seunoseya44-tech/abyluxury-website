"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { SylarmLogo } from "@/components/sylarm-logo";
import { ButtonLink } from "@/components/ui";
import { classNames } from "@/lib/format";

const nav = [
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/cars", label: "Rent" },
  { href: "/car-sales", label: "Buy a Car" },
  { href: "/sell-car", label: "Sell Your Car" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({
  logo,
  brandName = "Aby Luxury Car Rentals",
}: {
  logo?: string | null;
  brandName?: string;
} = {}) {
  const [open, setOpen] = useState(false);
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[var(--color-bg)]/85 border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <SylarmLogo src={logo} alt={brandName} height={36} />
          <nav className="hidden lg:flex items-center gap-6">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden lg:flex items-center gap-3">
          {!loading && user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition"
              >
                Hi, {user.name.split(" ")[0]}
              </Link>
              <ButtonLink href="/dashboard" size="sm" variant="primary">
                Dashboard
              </ButtonLink>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition"
              >
                Sign in
              </Link>
              <ButtonLink href="/register" size="sm" variant="primary">
                Get started
              </ButtonLink>
            </>
          )}
        </div>

        <button
          className="lg:hidden p-2 -m-2 text-[var(--color-text)]"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            {open ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      <div
        className={classNames(
          "lg:hidden border-t border-[var(--color-border)] overflow-hidden transition-[max-height] duration-300",
          open ? "max-h-[480px]" : "max-h-0",
        )}
      >
        <div className="px-4 py-4 flex flex-col gap-1 bg-[var(--color-bg-2)]">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-subtle)]"
            >
              {item.label}
            </Link>
          ))}
          <div className="border-t border-[var(--color-border)] my-2" />
          {!loading && user ? (
            <ButtonLink href="/dashboard" onClick={() => setOpen(false)} size="md">
              Dashboard
            </ButtonLink>
          ) : (
            <div className="flex gap-2">
              <ButtonLink
                href="/login"
                onClick={() => setOpen(false)}
                size="md"
                variant="secondary"
                className="flex-1"
              >
                Sign in
              </ButtonLink>
              <ButtonLink
                href="/register"
                onClick={() => setOpen(false)}
                size="md"
                className="flex-1"
              >
                Get started
              </ButtonLink>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
