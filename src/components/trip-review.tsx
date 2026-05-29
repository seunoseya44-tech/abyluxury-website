"use client";

import { useState } from "react";
import { api, ApiError } from "@/lib/api";
import { Button, Card, Textarea } from "@/components/ui";

function Stars({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
        {label}
      </p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            className="text-2xl leading-none transition-transform hover:scale-110"
            style={{ color: n <= value ? "var(--color-warning)" : "var(--color-border-strong)" }}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}

export function TripReview({
  bookingId,
  hasDriver,
  onDone,
}: {
  bookingId: number;
  hasDriver: boolean;
  onDone: () => void;
}) {
  const [carRating, setCarRating] = useState(0);
  const [driverRating, setDriverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (carRating < 1) {
      setError("Please rate the car.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await api.post(`v1/bookings/${bookingId}/review`, {
        car_rating: carRating,
        driver_rating: hasDriver && driverRating > 0 ? driverRating : null,
        comment: comment || null,
      });
      setDone(true);
      onDone();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not submit your rating.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <Card className="p-6 text-center">
        <p className="text-3xl">⭐</p>
        <p className="mt-2 font-display font-bold text-lg">Thanks for your feedback!</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="font-display font-bold text-lg mb-4">Rate your trip</h2>
      <form className="space-y-4" onSubmit={submit}>
        <Stars value={carRating} onChange={setCarRating} label="The car" />
        {hasDriver && <Stars value={driverRating} onChange={setDriverRating} label="The driver" />}
        <Textarea
          label="Comment (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="How was the experience?"
        />
        {error && <p className="text-sm text-[var(--color-sylarm-red)]">{error}</p>}
        <Button type="submit" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit rating"}
        </Button>
      </form>
    </Card>
  );
}
