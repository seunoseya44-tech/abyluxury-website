"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui";

const tabs = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/bookings", label: "Bookings" },
  { href: "/dashboard/fleet", label: "My Fleet" },
  { href: "/dashboard/profile", label: "Profile" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login?next=/dashboard");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-[var(--color-text-muted)]">
        Loading your dashboard…
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-8">
        <div>
          <p className="text-xs uppercase tracking-wider text-[var(--color-sylarm-red-light)] font-semibold">
            Account
          </p>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl">
            Hi {user.name.split(" ")[0]} 👋
          </h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={async () => {
            await logout();
            router.push("/");
          }}
        >
          Sign out
        </Button>
      </div>

      <nav className="flex gap-2 border-b border-[var(--color-border)] mb-8 overflow-x-auto">
        {tabs.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="px-4 py-3 text-sm font-semibold border-b-2 border-transparent hover:text-[var(--color-text)] text-[var(--color-text-muted)] whitespace-nowrap hover:border-[var(--color-sylarm-red)]/40"
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {children}
    </div>
  );
}
