"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button, Card, Input, SectionLabel, Textarea } from "@/components/ui";
import type { SiteSettings } from "@/lib/types";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    api.get<SiteSettings>("v1/settings").then(setSettings).catch(() => {});
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire to a /api/v1/contact endpoint once it exists.
    setSent(true);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <SectionLabel>Contact</SectionLabel>
      <h1 className="font-display font-extrabold text-4xl sm:text-5xl">
        Let&apos;s talk.
      </h1>
      <p className="mt-3 text-[var(--color-text-muted)] max-w-xl">
        Customer support, corporate hire, fleet partnerships, or press — we
        usually reply within an hour during business hours.
      </p>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-6 sm:p-8">
          {sent ? (
            <div className="text-center py-10">
              <p className="text-3xl">✅</p>
              <h2 className="mt-3 font-display font-bold text-2xl">
                Message sent
              </h2>
              <p className="mt-2 text-[var(--color-text-muted)]">
                We&apos;ll be in touch shortly at {form.email}.
              </p>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={submit}>
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
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <Textarea
                label="Message"
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              <Button type="submit" size="lg">
                Send message
              </Button>
            </form>
          )}
        </Card>

        <div className="space-y-6">
          {settings?.contact_email && (
            <ContactItem label="Email" value={settings.contact_email} href={`mailto:${settings.contact_email}`} />
          )}
          {settings?.contact_phone && (
            <ContactItem label="Phone" value={settings.contact_phone} href={`tel:${settings.contact_phone}`} />
          )}
          {settings?.address && <ContactItem label="Office" value={settings.address} />}
          <ContactItem label="Support hours" value="Mon–Sun · 7am – 11pm" />

          {settings && (() => {
            const links = [
              ["Facebook", settings.socials.facebook],
              ["Instagram", settings.socials.instagram],
              ["X", settings.socials.x],
              ["TikTok", settings.socials.tiktok],
              ["WhatsApp", settings.socials.whatsapp],
            ].filter(([, v]) => v) as [string, string][];
            if (links.length === 0) return null;
            return (
              <div className="p-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl">
                <p className="text-[11px] uppercase tracking-wider text-[var(--color-text-faint)] mb-2">Follow us</p>
                <div className="flex flex-wrap gap-2">
                  {links.map(([label, href]) => (
                    <a key={label} href={href.startsWith("http") ? href : `https://${href}`} target="_blank" rel="noopener noreferrer"
                      className="text-sm font-semibold text-[var(--color-sylarm-red)] hover:underline">
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

function ContactItem({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <p className="text-[11px] uppercase tracking-wider text-[var(--color-text-faint)]">
        {label}
      </p>
      <p className="mt-1 font-semibold">{value}</p>
    </>
  );
  return href ? (
    <a
      href={href}
      className="block p-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-sylarm-red)]/40 transition"
    >
      {content}
    </a>
  ) : (
    <div className="p-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl">
      {content}
    </div>
  );
}
