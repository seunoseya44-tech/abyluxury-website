"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { Badge, Button, Card, Input, Select } from "@/components/ui";
import { formatNaira } from "@/lib/format";
import type { FleetPayout, FleetSummary, FleetVehicle } from "@/lib/types";

export default function FleetDashboardPage() {
  const [summary, setSummary] = useState<FleetSummary | null>(null);
  const [vehicles, setVehicles] = useState<FleetVehicle[]>([]);
  const [payouts, setPayouts] = useState<FleetPayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, v, p] = await Promise.all([
        api.get<FleetSummary>("v1/fleet/summary"),
        api.get<{ data: FleetVehicle[] }>("v1/fleet/vehicles"),
        api.get<{ data: FleetPayout[] }>("v1/fleet/payouts"),
      ]);
      setSummary(s);
      setVehicles(v.data);
      setPayouts(p.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return <p className="text-center py-12 text-[var(--color-text-muted)]">Loading your fleet…</p>;
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-4">
        <Stat label="Vehicles" value={String(summary?.total_vehicles ?? 0)} />
        <Stat label="Active" value={String(summary?.active_vehicles ?? 0)} />
        <Stat label="Total earned" value={formatNaira(summary?.total_earnings ?? 0)} />
        <Stat label="Pending payout" value={formatNaira(summary?.pending_earnings ?? 0)} />
      </div>

      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-xl">Your vehicles</h2>
        <Button size="sm" onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Close" : "+ List a vehicle"}
        </Button>
      </div>

      {showForm && <RegisterVehicleForm onDone={() => { setShowForm(false); load(); }} />}

      {vehicles.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-[var(--color-text-muted)]">
            You haven&apos;t listed any vehicles yet. Tap &ldquo;List a vehicle&rdquo; to start earning.
          </p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {vehicles.map((v) => (
            <Card key={v.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-display font-bold text-lg">{v.car?.name ?? "Vehicle"}</h3>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    {v.car?.plate_number} · {v.car?.total_bookings ?? 0} bookings · You keep {v.owner_percentage}%
                  </p>
                </div>
                <StatusBadge status={v.status} />
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border)] pt-3">
                <span className="text-sm text-[var(--color-text-muted)]">Earned to date</span>
                <span className="font-display font-bold">{formatNaira(v.total_earnings)}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div>
        <h2 className="font-display font-bold text-xl mb-3">Payouts</h2>
        {payouts.length === 0 ? (
          <Card className="p-6 text-center text-sm text-[var(--color-text-muted)]">
            No payouts yet. You&apos;ll see periodic payments here once your cars start earning.
          </Card>
        ) : (
          <div className="grid gap-2">
            {payouts.map((p) => (
              <Card key={p.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{p.vehicle?.car_name ?? "Vehicle"}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {p.period_start} → {p.period_end}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold">{formatNaira(p.owner_share)}</p>
                  <StatusBadge status={p.status} />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-5">
      <p className="text-xs uppercase tracking-wider text-[var(--color-text-faint)]">{label}</p>
      <p className="mt-2 font-display font-extrabold text-xl">{value}</p>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "active" || status === "paid"
      ? "green"
      : status === "pending_approval" || status === "pending" || status === "processing"
        ? "gold"
        : "neutral";
  return <Badge tone={tone as "green" | "gold" | "neutral"}>{status.replace(/_/g, " ")}</Badge>;
}

function RegisterVehicleForm({ onDone }: { onDone: () => void }) {
  const [form, setForm] = useState({
    name: "", brand: "", model: "", year: "", type: "sedan",
    seats: "5", transmission: "automatic", fuel_type: "petrol",
    color: "", plate_number: "", daily_rate: "", description: "",
    insurance_provider: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.post("v1/fleet/vehicles", {
        ...form,
        year: Number(form.year),
        seats: Number(form.seats),
        daily_rate: Number(form.daily_rate),
      });
      onDone();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? (err.errors ? Object.values(err.errors)[0][0] : err.message)
          : "Could not submit vehicle.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="p-6">
      <h3 className="font-display font-bold text-lg mb-4">List a vehicle</h3>
      <form className="grid gap-3 sm:grid-cols-2" onSubmit={submit}>
        <div className="sm:col-span-2">
          <Input label="Listing name" placeholder="2021 Toyota Camry" value={form.name} onChange={(e) => set("name", e.target.value)} required />
        </div>
        <Input label="Brand" value={form.brand} onChange={(e) => set("brand", e.target.value)} required />
        <Input label="Model" value={form.model} onChange={(e) => set("model", e.target.value)} required />
        <Input label="Year" type="number" value={form.year} onChange={(e) => set("year", e.target.value)} required />
        <Input label="Plate number" value={form.plate_number} onChange={(e) => set("plate_number", e.target.value)} required />
        <Select label="Type" value={form.type} onChange={(e) => set("type", e.target.value)}>
          <option value="sedan">Sedan</option>
          <option value="suv">SUV</option>
          <option value="luxury">Luxury</option>
          <option value="pickup">Pickup</option>
          <option value="van">Van</option>
          <option value="minivan">Minivan</option>
        </Select>
        <Input label="Seats" type="number" value={form.seats} onChange={(e) => set("seats", e.target.value)} required />
        <Select label="Transmission" value={form.transmission} onChange={(e) => set("transmission", e.target.value)}>
          <option value="automatic">Automatic</option>
          <option value="manual">Manual</option>
        </Select>
        <Select label="Fuel" value={form.fuel_type} onChange={(e) => set("fuel_type", e.target.value)}>
          <option value="petrol">Petrol</option>
          <option value="diesel">Diesel</option>
          <option value="hybrid">Hybrid</option>
          <option value="electric">Electric</option>
        </Select>
        <Input label="Colour" value={form.color} onChange={(e) => set("color", e.target.value)} />
        <Input label="Desired daily rate (₦)" type="number" value={form.daily_rate} onChange={(e) => set("daily_rate", e.target.value)} required />
        <div className="sm:col-span-2">
          <Input label="Insurance provider (optional)" value={form.insurance_provider} onChange={(e) => set("insurance_provider", e.target.value)} />
        </div>
        {error && <p className="sm:col-span-2 text-sm text-[var(--color-sylarm-red)]">{error}</p>}
        <div className="sm:col-span-2">
          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit for review"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
