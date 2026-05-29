"use client";

import { useState } from "react";
import { api, ApiError } from "@/lib/api";
import { Button, Card, Input, Textarea } from "@/components/ui";

export function SaleInquiryForm({ carSaleId }: { carSaleId: number }) {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.post(`v1/car-sales/${carSaleId}/inquiries`, form);
      setSent(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? (err.errors ? Object.values(err.errors)[0][0] : err.message)
          : "Could not send inquiry.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <Card className="p-6 text-center">
        <p className="text-3xl">✅</p>
        <h3 className="mt-2 font-display font-bold text-xl">Inquiry sent</h3>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Our sales team will contact you shortly.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 lg:sticky lg:top-24">
      <h3 className="font-display font-bold text-lg mb-4">Interested? Send an inquiry</h3>
      <form className="space-y-3" onSubmit={submit}>
        <Input label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input label="Phone" type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <Textarea label="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Is this still available? Can I inspect it?" />
        {error && <p className="text-sm text-[var(--color-sylarm-red)]">{error}</p>}
        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? "Sending…" : "Send inquiry"}
        </Button>
      </form>
    </Card>
  );
}
