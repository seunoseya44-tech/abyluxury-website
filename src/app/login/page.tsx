"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Button, Card, Input } from "@/components/ui";

function LoginPageContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useAuth();
  const next = params.get("next") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login({ email, password });
      router.push(next);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not sign you in.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <h1 className="font-display font-extrabold text-4xl text-center">
        Welcome back
      </h1>

      <p className="mt-3 text-center text-[var(--color-text-muted)]">
        Sign in to manage your bookings.
      </p>

      <Card className="mt-8 p-6 sm:p-8">
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
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
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </Card>

      <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
        No account yet?{" "}
        <Link
          href={`/register${
            next !== "/dashboard" ? `?next=${encodeURIComponent(next)}` : ""
          }`}
          className="text-[var(--color-sylarm-red-light)] font-semibold hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}