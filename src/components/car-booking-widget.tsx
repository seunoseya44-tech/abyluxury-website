"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Button, Input, Select } from "@/components/ui";
import { formatNaira } from "@/lib/format";
import type {
  BookingType,
  CarDetail,
  Quote,
  RatePeriod,
} from "@/lib/types";

function localIso(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function defaultPickup(): string {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  d.setHours(10, 0, 0, 0);
  return localIso(d);
}
function defaultReturn(): string {
  const d = new Date();
  d.setDate(d.getDate() + 5);
  d.setHours(18, 0, 0, 0);
  return localIso(d);
}

type QuoteResponse = {
  car: { id: number; name: string; daily_rate: number };
  quote: Quote;
  available: boolean;
};

type CreateBookingResponse = {
  data: {
    id: number;
    booking_ref: string;
    status: string;
    payment_status: string;
  };
};

export function CarBookingWidget({ car }: { car: CarDetail }) {
  const router = useRouter();
  const { user } = useAuth();

  const [bookingType, setBookingType] = useState<BookingType>(
    car.available_for_self_drive ? "self_drive" : "with_chauffeur",
  );
  const [ratePeriod, setRatePeriod] = useState<RatePeriod>("daily");
  const [pickup, setPickup] = useState<string>(defaultPickup());
  const [ret, setRet] = useState<string>(defaultReturn());
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [promo, setPromo] = useState("");

  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const [creating, setCreating] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setQuoteError(null);
    setQuote(null);

    if (!pickup || !ret) return;
    if (new Date(ret) <= new Date(pickup)) {
      setQuoteError("Return time must be after pickup.");
      return;
    }

    setQuoteLoading(true);
    api
      .post<QuoteResponse>("v1/bookings/estimate", {
        car_id: car.id,
        pickup_at: pickup.replace("T", " ") + ":00",
        return_at: ret.replace("T", " ") + ":00",
        booking_type: bookingType,
        rate_period: ratePeriod,
        promo_code: promo || undefined,
      })
      .then((res) => {
        if (!cancelled) setQuote(res);
      })
      .catch((e) => {
        if (cancelled) return;
        setQuoteError(
          e instanceof ApiError ? e.message : "Could not fetch quote.",
        );
      })
      .finally(() => !cancelled && setQuoteLoading(false));

    return () => {
      cancelled = true;
    };
  }, [car.id, pickup, ret, bookingType, ratePeriod, promo]);

  async function handleBook(e: React.FormEvent) {
    e.preventDefault();
    setBookingError(null);

    if (!user) {
      const next = `/cars/${car.id}`;
      router.push(`/login?next=${encodeURIComponent(next)}`);
      return;
    }

    if (!pickupLocation.trim()) {
      setBookingError("Please enter a pickup location.");
      return;
    }

    setCreating(true);
    try {
      const booking = await api.post<CreateBookingResponse>("v1/bookings", {
        car_id: car.id,
        booking_type: bookingType,
        rate_period: ratePeriod,
        pickup_at: pickup.replace("T", " ") + ":00",
        return_at: ret.replace("T", " ") + ":00",
        pickup_location: pickupLocation,
        dropoff_location: dropoffLocation || null,
        promo_code: promo || null,
      });

      router.push(`/dashboard/bookings/${booking.data.id}`);
    } catch (e) {
      setBookingError(
        e instanceof ApiError ? e.message : "Could not create booking.",
      );
    } finally {
      setCreating(false);
    }
  }

  const driverTypes: { v: BookingType; l: string }[] = [
    { v: "self_drive", l: "Self drive" },
    { v: "with_chauffeur", l: "With chauffeur" },
    { v: "airport_pickup", l: "Airport pickup" },
    { v: "airport_dropoff", l: "Airport dropoff" },
    { v: "event", l: "Event / wedding" },
    { v: "corporate", l: "Corporate" },
  ];

  return (
    <form
      onSubmit={handleBook}
      className="bg-[var(--color-card)] border border-[var(--color-border-strong)] rounded-2xl p-6 lg:sticky lg:top-24 space-y-4"
    >
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-[var(--color-text-faint)]">
            From
          </p>
          <p className="font-display font-extrabold text-3xl">
            {formatNaira(car.daily_rate)}
            <span className="text-sm font-medium text-[var(--color-text-muted)] ml-1">
              / day
            </span>
          </p>
        </div>
        <div className="text-right text-xs text-[var(--color-text-muted)]">
          <p>★ {car.rating.toFixed(1)}</p>
          <p>{car.total_bookings} trips</p>
        </div>
      </div>

      <Select
        label="Booking type"
        value={bookingType}
        onChange={(e) => setBookingType(e.target.value as BookingType)}
      >
        {driverTypes.map((t) => (
          <option key={t.v} value={t.v}>
            {t.l}
          </option>
        ))}
      </Select>

      <Select
        label="Rate"
        value={ratePeriod}
        onChange={(e) => setRatePeriod(e.target.value as RatePeriod)}
      >
        <option value="hourly">Hourly</option>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </Select>

      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          label="Pickup"
          type="datetime-local"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
        />
        <Input
          label="Return"
          type="datetime-local"
          value={ret}
          onChange={(e) => setRet(e.target.value)}
        />
      </div>

      <Input
        label="Pickup location"
        placeholder="e.g. Nnamdi Azikiwe Airport"
        value={pickupLocation}
        onChange={(e) => setPickupLocation(e.target.value)}
      />

      <Input
        label="Dropoff location (optional)"
        placeholder="e.g. Transcorp Hilton, Maitama"
        value={dropoffLocation}
        onChange={(e) => setDropoffLocation(e.target.value)}
      />

      <Input
        label="Promo code"
        placeholder="Optional"
        value={promo}
        onChange={(e) => setPromo(e.target.value.toUpperCase())}
      />

      <div className="pt-3 border-t border-[var(--color-border)] space-y-2 text-sm">
        {quoteLoading && (
          <p className="text-[var(--color-text-muted)]">Calculating…</p>
        )}
        {quoteError && (
          <p className="text-[var(--color-sylarm-red-light)]">{quoteError}</p>
        )}
        {quote && (
          <>
            <Row label="Base" value={formatNaira(quote.quote.base_amount)} />
            {quote.quote.driver_fee > 0 && (
              <Row
                label="Driver fee"
                value={formatNaira(quote.quote.driver_fee)}
              />
            )}
            {quote.quote.discount_amount > 0 && (
              <Row
                label="Discount"
                value={`− ${formatNaira(quote.quote.discount_amount)}`}
              />
            )}
            <div className="flex justify-between items-baseline pt-2 border-t border-[var(--color-border)]">
              <span className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
                Total
              </span>
              <span className="font-display font-extrabold text-2xl">
                {formatNaira(quote.quote.total_amount)}
              </span>
            </div>
            {!quote.available && (
              <p className="text-xs text-[var(--color-sylarm-red-light)] mt-1">
                Car is not available for the selected dates.
              </p>
            )}
          </>
        )}
      </div>

      {bookingError && (
        <p className="text-sm text-[var(--color-sylarm-red-light)]">
          {bookingError}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={creating || !quote?.available}
      >
        {creating
          ? "Booking…"
          : user
            ? "Continue to booking"
            : "Sign in to book"}
      </Button>

      <p className="text-[11px] text-[var(--color-text-faint)] text-center">
        You won&apos;t be charged until you confirm payment.
      </p>
    </form>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline">
      <span className="text-[var(--color-text-muted)]">{label}</span>
      <span className="text-[var(--color-text)] font-medium">{value}</span>
    </div>
  );
}
