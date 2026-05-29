"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui";
import { formatNaira } from "@/lib/format";
import type { Booking, Paginated } from "@/lib/types";

export default function DashboardOverview() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Paginated<Booking>>("v1/bookings", { per_page: 5 })
      .then((r) => setBookings(r.data))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  const totalSpent = bookings
    .filter((b) => b.payment_status === "paid")
    .reduce((sum, b) => sum + b.pricing.total_amount, 0);

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Wallet balance" value={formatNaira(user?.wallet_balance ?? 0)} />
        <Stat label="Bookings" value={String(bookings.length)} />
        <Stat label="Spent (visible)" value={formatNaira(totalSpent)} />
      </div>

      <Card className="p-6">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display font-bold text-xl">Recent bookings</h2>
          <Link
            href="/dashboard/bookings"
            className="text-sm font-semibold text-[var(--color-sylarm-red-light)] hover:underline"
          >
            View all →
          </Link>
        </div>

        {loading ? (
          <p className="text-sm text-[var(--color-text-muted)]">Loading…</p>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--color-text-muted)]">
              You haven&apos;t booked any cars yet.
            </p>
            <Link
              href="/cars"
              className="mt-3 inline-block text-sm font-semibold text-[var(--color-sylarm-red-light)] hover:underline"
            >
              Browse the fleet →
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-[var(--color-border)]">
            {bookings.map((b) => (
              <li key={b.id}>
                <Link
                  href={`/dashboard/bookings/${b.id}`}
                  className="flex items-center justify-between py-4 hover:bg-[var(--color-subtle)] -mx-3 px-3 rounded-lg"
                >
                  <div>
                    <p className="font-semibold">
                      {b.car?.name ?? "Booking " + b.booking_ref}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                      {b.booking_ref} ·{" "}
                      {new Date(b.pickup_at).toLocaleDateString("en-NG", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatNaira(b.pricing.total_amount)}
                    </p>
                    <StatusPill status={b.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-5">
      <p className="text-xs uppercase tracking-wider text-[var(--color-text-faint)]">
        {label}
      </p>
      <p className="mt-2 font-display font-extrabold text-2xl">{value}</p>
    </Card>
  );
}

function StatusPill({ status }: { status: Booking["status"] }) {
  const tone =
    status === "completed"
      ? "text-[var(--color-success)] bg-[var(--color-success)]/12"
      : status === "cancelled" || status === "no_show"
        ? "text-[var(--color-text-muted)] bg-[var(--color-subtle)]"
        : status === "pending_payment"
          ? "text-[var(--color-warning)] bg-[var(--color-warning)]/12"
          : "text-[var(--color-sylarm-red)] bg-[var(--color-sylarm-red)]/12";
  return (
    <span
      className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${tone}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
