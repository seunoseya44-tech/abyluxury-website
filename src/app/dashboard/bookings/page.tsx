"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/ui";
import { formatNaira, formatDate } from "@/lib/format";
import type { Booking, Paginated } from "@/lib/types";

export default function BookingsListPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Paginated<Booking>>("v1/bookings", { per_page: 25 })
      .then((r) => setBookings(r.data))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <p className="text-center py-12 text-[var(--color-text-muted)]">
        Loading bookings…
      </p>
    );
  }
  if (bookings.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-[var(--color-text-muted)]">No bookings yet.</p>
        <Link
          href="/cars"
          className="mt-3 inline-block text-sm font-semibold text-[var(--color-sylarm-red-light)] hover:underline"
        >
          Find a car →
        </Link>
      </Card>
    );
  }

  return (
    <div className="grid gap-3">
      {bookings.map((b) => (
        <Link
          key={b.id}
          href={`/dashboard/bookings/${b.id}`}
          className="block p-5 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl hover:border-[var(--color-sylarm-red)]/40 transition"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-mono text-[var(--color-text-faint)]">
                {b.booking_ref}
              </p>
              <h3 className="mt-1 font-display font-bold text-lg">
                {b.car?.name ?? "Car"}
              </h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                {formatDate(b.pickup_at)} →{" "}
                {formatDate(b.return_at)}
              </p>
              <p className="text-sm text-[var(--color-text-muted)]">
                📍 {b.pickup_location}
              </p>
            </div>
            <div className="text-right">
              <p className="font-display font-extrabold text-xl">
                {formatNaira(b.pricing.total_amount)}
              </p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[var(--color-subtle)] text-[var(--color-text-muted)]">
                {b.status.replace(/_/g, " ")}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
