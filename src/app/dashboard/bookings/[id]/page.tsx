"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { Button, Card } from "@/components/ui";
import { TripReview } from "@/components/trip-review";
import { formatNaira, formatDate } from "@/lib/format";
import type { Booking } from "@/lib/types";

type InitResponse = {
  payment: { reference: string };
  checkout_url: string;
};

export default function BookingDetailPage() {
  const params = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [payGateway, setPayGateway] = useState<
    "paystack" | "flutterwave" | "wallet"
  >("paystack");
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  function refetch() {
    return api
      .get<{ data: Booking }>(`v1/bookings/${params.id}`)
      .then((r) => setBooking(r.data))
      .catch(() => {});
  }

  useEffect(() => {
    api
      .get<{ data: Booking }>(`v1/bookings/${params.id}`)
      .then((r) => setBooking(r.data))
      .catch((e) =>
        setError(e instanceof ApiError ? e.message : "Booking not found."),
      )
      .finally(() => setLoading(false));
  }, [params.id]);

  async function pay() {
    if (!booking) return;
    setPayError(null);
    setPaying(true);
    try {
      const res = await api.post<InitResponse>("v1/payments/initialize", {
        booking_id: booking.id,
        gateway: payGateway,
        callback_url: `${window.location.origin}/dashboard/bookings/${booking.id}?paid=1`,
      });

      if (payGateway === "wallet") {
        // Wallet succeeds immediately; refetch booking.
        const refreshed = await api.get<{ data: Booking }>(
          `v1/bookings/${booking.id}`,
        );
        setBooking(refreshed.data);
      } else if (res.checkout_url) {
        window.location.href = res.checkout_url;
      }
    } catch (e) {
      setPayError(
        e instanceof ApiError ? e.message : "Could not start payment.",
      );
    } finally {
      setPaying(false);
    }
  }

  async function cancel() {
    if (!booking) return;
    if (!confirm("Cancel this booking?")) return;
    try {
      const r = await api.post<{ data: Booking }>(
        `v1/bookings/${booking.id}/cancel`,
        { reason: "Customer request" },
      );
      setBooking(r.data);
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "Could not cancel booking.");
    }
  }

  if (loading) {
    return <p className="text-center text-[var(--color-text-muted)]">Loading…</p>;
  }
  if (error || !booking) {
    return (
      <Card className="p-8 text-center">
        <p className="text-[var(--color-text-muted)]">{error}</p>
      </Card>
    );
  }

  const canPay =
    booking.payment_status !== "paid" &&
    !["cancelled", "completed", "no_show"].includes(booking.status);

  const canCancel = !["completed", "cancelled", "no_show", "in_progress"].includes(
    booking.status,
  );

  return (
    <div className="space-y-6">
      {booking.can_review && !booking.reviewed && (
        <TripReview
          bookingId={booking.id}
          hasDriver={!!booking.driver}
          onDone={refetch}
        />
      )}
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card className="p-6 sm:p-8">
        <p className="text-xs font-mono text-[var(--color-text-faint)] mb-2">
          {booking.booking_ref}
        </p>
        <h1 className="font-display font-extrabold text-3xl">
          {booking.car?.name ?? "Booking"}
        </h1>
        <p className="mt-2 text-[var(--color-text-muted)] text-sm capitalize">
          {booking.booking_type.replace(/_/g, " ")} ·{" "}
          {booking.rate_period} rate
        </p>

        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-[var(--color-text-faint)]">
              Pickup
            </p>
            <p className="mt-1 font-semibold">{formatDate(booking.pickup_at)}</p>
            <p className="text-sm text-[var(--color-text-muted)]">
              📍 {booking.pickup_location}
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-[var(--color-text-faint)]">
              Return
            </p>
            <p className="mt-1 font-semibold">{formatDate(booking.return_at)}</p>
            {booking.dropoff_location && (
              <p className="text-sm text-[var(--color-text-muted)]">
                📍 {booking.dropoff_location}
              </p>
            )}
          </div>
        </div>

        {booking.customer_notes && (
          <div className="mt-6 p-4 rounded-lg bg-[var(--color-bg-3)] border border-[var(--color-border)]">
            <p className="text-[11px] uppercase tracking-wider text-[var(--color-text-faint)] mb-1">
              Your notes
            </p>
            <p className="text-sm">{booking.customer_notes}</p>
          </div>
        )}

        {booking.driver && (
          <div className="mt-6 p-4 rounded-lg bg-[var(--color-bg-3)] border border-[var(--color-border)]">
            <p className="text-[11px] uppercase tracking-wider text-[var(--color-text-faint)] mb-1">
              Driver
            </p>
            <p className="font-semibold">{booking.driver.name}</p>
            <p className="text-sm text-[var(--color-text-muted)]">
              {booking.driver.phone} · ★ {booking.driver.rating.toFixed(1)}
            </p>
          </div>
        )}

        {canCancel && (
          <Button variant="ghost" size="sm" className="mt-8" onClick={cancel}>
            Cancel booking
          </Button>
        )}
      </Card>

      <Card className="p-6 lg:sticky lg:top-24">
        <h2 className="font-display font-bold text-lg mb-4">Payment</h2>
        <div className="space-y-2 text-sm">
          <Row label="Base" value={formatNaira(booking.pricing.base_amount)} />
          {booking.pricing.driver_fee > 0 && (
            <Row label="Driver" value={formatNaira(booking.pricing.driver_fee)} />
          )}
          {booking.pricing.discount_amount > 0 && (
            <Row
              label="Discount"
              value={`− ${formatNaira(booking.pricing.discount_amount)}`}
            />
          )}
          <div className="flex justify-between pt-3 border-t border-[var(--color-border)]">
            <span className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
              Total
            </span>
            <span className="font-display font-extrabold text-xl">
              {formatNaira(booking.pricing.total_amount)}
            </span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
          <p className="text-[11px] uppercase tracking-wider text-[var(--color-text-faint)] mb-1">
            Status
          </p>
          <p className="font-semibold capitalize">
            {booking.payment_status} · {booking.status.replace(/_/g, " ")}
          </p>
        </div>

        {canPay && (
          <div className="mt-6 space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {(["paystack", "flutterwave", "wallet"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setPayGateway(g)}
                  className={`px-2 py-2 rounded-lg text-xs font-semibold border capitalize transition ${
                    payGateway === g
                      ? "border-[var(--color-sylarm-red)] text-[var(--color-sylarm-red-light)] bg-[var(--color-sylarm-red)]/8"
                      : "border-[var(--color-border-strong)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
            {payError && (
              <p className="text-sm text-[var(--color-sylarm-red-light)]">
                {payError}
              </p>
            )}
            <Button
              onClick={pay}
              disabled={paying}
              size="lg"
              className="w-full"
            >
              {paying
                ? "Starting payment…"
                : `Pay ${formatNaira(booking.pricing.total_amount)}`}
            </Button>
          </div>
        )}
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline">
      <span className="text-[var(--color-text-muted)]">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
