"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Button, Card, Input } from "@/components/ui";

function RegisterPageContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { register } = useAuth();
  const next = params.get("next") ?? "/dashboard";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setSubmitting(true);

    try {
      await register(form);
      router.push(next);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        if (err.errors) setFieldErrors(err.errors);
      } else {
        setError("Could not create your account.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  function err(field: string): string | undefined {
    return fieldErrors[field]?.[0];
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <h1 className="font-display font-extrabold text-4xl text-center">
        Create your Aby Luxury Car Rentals account
      </h1>

      <p className="mt-3 text-center text-[var(--color-text-muted)]">
        Free to join. Book your first ride in under a minute.
      </p>

      <Card className="mt-8 p-6 sm:p-8">
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input
            label="Full name"
            autoComplete="name"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            error={err("name")}
          />

          <Input
            label="Email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            error={err("email")}
          />

          <Input
            label="Phone"
            type="tel"
            autoComplete="tel"
            placeholder="+234 800 000 0000"
            required
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            error={err("phone")}
          />

          <Input
            label="Password"
            type="password"
            autoComplete="new-password"
            required
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            hint="At least 8 chars with a letter and a number."
            error={err("password")}
          />

          <Input
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            required
            value={form.password_confirmation}
            onChange={(e) => update("password_confirmation", e.target.value)}
          />

          {error && !Object.keys(fieldErrors).length && (
            <p className="text-sm text-[var(--color-sylarm-red-light)]">
              {error}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={submitting}
          >
            {submitting ? "Creating account…" : "Create account"}
          </Button>
        </form>
      </Card>

      <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
        Already on Aby Luxury Car Rentals?{" "}
        <Link
          href={`/login${
            next !== "/dashboard" ? `?next=${encodeURIComponent(next)}` : ""
          }`}
          className="text-[var(--color-sylarm-red-light)] font-semibold hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center">Loading...</div>}>
      <RegisterPageContent />
    </Suspense>
  );
}