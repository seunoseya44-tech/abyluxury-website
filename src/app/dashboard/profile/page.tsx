"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Button, Card, Input } from "@/components/ui";

export default function ProfilePage() {
  const { user, refresh } = useAuth();
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user)
      setForm({
        name: user.name ?? "",
        phone: user.phone ?? "",
        address: user.address ?? "",
      });
  }, [user]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setError(null);
    try {
      await api.put("v1/profile", form);
      await refresh();
      setStatus("Profile updated.");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not save profile.");
    }
  }

  return (
    <div className="max-w-xl">
      <Card className="p-6 sm:p-8">
        <h2 className="font-display font-bold text-xl mb-6">Your profile</h2>
        <form className="space-y-4" onSubmit={save}>
          <Input
            label="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Input
            label="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          {error && (
            <p className="text-sm text-[var(--color-sylarm-red-light)]">
              {error}
            </p>
          )}
          {status && (
            <p className="text-sm text-[var(--color-success)]">{status}</p>
          )}
          <Button type="submit">Save changes</Button>
        </form>
      </Card>
    </div>
  );
}
