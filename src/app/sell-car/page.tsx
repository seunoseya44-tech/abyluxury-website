"use client";

import { useState } from "react";
import { api, ApiError } from "@/lib/api";
import { Button, Card, Input, SectionLabel, Select, Textarea } from "@/components/ui";

export default function SellCarPage() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    brand: "",
    model: "",
    year: "",
    condition: "foreign_used",
    asking_price: "",
    description: "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.post("v1/sell-car-requests", {
        full_name: form.name,
        email: form.email,
        phone: form.phone,
        brand: form.brand,
        model: form.model,
        year: Number(form.year),
        condition: form.condition,
        asking_price: Number(form.asking_price),
        description: form.description || null,
      });
      setSent(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? (err.errors ? Object.values(err.errors)[0][0] : err.message)
          : "Could not submit. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-5xl">✅</p>
        <h1 className="mt-4 font-display font-extrabold text-4xl">
          We received your submission
        </h1>
        <p className="mt-3 text-[var(--color-text-muted)]">
          Our team will review your car and reach out within 48 hours with an
          inspection slot or offer.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <SectionLabel>Sell your car</SectionLabel>
      <h1 className="font-display font-extrabold text-4xl sm:text-5xl">
        Sell directly to Aby Luxury Car Rentals.
      </h1>
      <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl">
        Skip the dealership runaround. Tell us about your vehicle and we&apos;ll
        come back with a fair offer within 48 hours.
      </p>

      <Card className="mt-10 p-6 sm:p-8">
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={submit}>
          <Input
            label="Your name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label="Phone"
            type="tel"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Input
            label="Asking price (NGN)"
            type="number"
            min="100000"
            required
            value={form.asking_price}
            onChange={(e) => setForm({ ...form, asking_price: e.target.value })}
          />
          <Input
            label="Brand"
            placeholder="e.g. Toyota"
            required
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
          />
          <Input
            label="Model"
            placeholder="e.g. Camry"
            required
            value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value })}
          />
          <Input
            label="Year"
            type="number"
            min="1990"
            max={new Date().getFullYear()}
            required
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
          />
          <Select
            label="Condition"
            value={form.condition}
            onChange={(e) => setForm({ ...form, condition: e.target.value })}
          >
            <option value="brand_new">Brand new</option>
            <option value="foreign_used">Foreign used (Tokunbo)</option>
            <option value="nigerian_used">Nigerian used</option>
          </Select>

          <div className="sm:col-span-2">
            <Textarea
              label="Anything we should know?"
              placeholder="Service history, accident record, recent upgrades…"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div className="sm:col-span-2">
            {error && (
              <p className="mb-3 text-sm text-[var(--color-sylarm-red)]">{error}</p>
            )}
            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit for review"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
