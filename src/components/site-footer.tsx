import Link from "next/link";
import { SylarmLogo } from "@/components/sylarm-logo";
import { AppStoreBadge, GooglePlayBadge } from "@/components/store-badges";
import { whatsappUrl } from "@/lib/settings";
import type { SiteSettings } from "@/lib/types";

const sections = [
  {
    title: "Services",
    links: [
      { href: "/cars?type=luxury", label: "Luxury & VIP" },
      { href: "/services/airport-transfer", label: "Airport Transfers" },
      { href: "/services/corporate", label: "Corporate Hire" },
      { href: "/services/tourism", label: "Tourism Packages" },
    ],
  },
  {
    title: "Marketplace",
    links: [
      { href: "/cars", label: "Rent a Car" },
      { href: "/car-sales", label: "Buy a Car" },
      { href: "/sell-car", label: "Sell Your Car" },
      { href: "/fleet", label: "List Your Car" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/privacy", label: "Privacy Policy" },
    ],
  },
];

type Social = { href: string; label: string; icon: React.ReactNode };

function socialLinks(s: SiteSettings): Social[] {
  const out: Social[] = [];
  const I = (d: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d={d} />
    </svg>
  );
  if (s.socials.facebook)
    out.push({ href: s.socials.facebook, label: "Facebook", icon: I("M13 22v-9h3l1-4h-4V7c0-1.1.3-2 2-2h2V1.1C18.6 1 17.4 1 16 1c-3 0-5 1.8-5 5.2V9H8v4h3v9h2z") });
  if (s.socials.instagram)
    out.push({ href: s.socials.instagram, label: "Instagram", icon: I("M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.1.4.3 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.1-1 .3-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.1-.4-.3-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.1 1-.3 2.2-.4C8.4 2.2 8.8 2.2 12 2.2m0 5.3a4.5 4.5 0 100 9 4.5 4.5 0 000-9m5.8-.4a1.05 1.05 0 11-2.1 0 1.05 1.05 0 012.1 0M12 9.3a2.7 2.7 0 110 5.4 2.7 2.7 0 010-5.4") });
  if (s.socials.x)
    out.push({ href: s.socials.x, label: "X", icon: I("M18.9 1.2h3.7l-8 9.2 9.5 12.4h-7.4l-5.8-7.6-6.7 7.6H.5l8.6-9.8L0 1.2h7.6l5.2 6.9 6.1-6.9m-1.3 19.5h2L6.5 3.2H4.4l13.2 17.5z") });
  if (s.socials.tiktok)
    out.push({ href: s.socials.tiktok, label: "TikTok", icon: I("M16.6 5.8a4.3 4.3 0 01-1-2.8h-3.3v13.2a2.6 2.6 0 11-2.6-2.6c.3 0 .5 0 .8.1V10a5.9 5.9 0 00-.8-.1 5.9 5.9 0 105.9 5.9V8.7a7.5 7.5 0 004.4 1.4V6.8a4.3 4.3 0 01-3.4-1z") });
  const wa = whatsappUrl(s.socials.whatsapp);
  if (wa)
    out.push({ href: wa, label: "WhatsApp", icon: I("M.1 24l1.7-6.2A11.8 11.8 0 1112 23.9 11.9 11.9 0 016.2 22.4L.1 24zM6.5 20l.4.2a9.8 9.8 0 005 1.4 9.9 9.9 0 10-9.9-9.9c0 1.8.5 3.5 1.4 5l.2.4-1 3.6 3.5-1zm11.4-5.6c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1a8 8 0 01-2.4-1.5 9 9 0 01-1.6-2c-.2-.3 0-.4.1-.6l.4-.5.3-.4v-.4c0-.1-.6-1.5-.8-2-.2-.5-.4-.5-.6-.5h-.5a1 1 0 00-.7.3c-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.2.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.5-.3z") });
  return out;
}

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();
  const socials = socialLinks(settings);

  return (
    <footer className="section-darker border-t border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <SylarmLogo
              src={settings.logos?.white}
              alt={settings.brand_name ?? "Aby Luxury Car Rentals"}
              variant="white"
              height={44}
            />
            <p className="mt-4 text-sm text-[var(--color-text-muted)] leading-relaxed max-w-sm">
              {settings.about_text}
            </p>

            {settings.address && (
              <p className="mt-4 text-sm text-[var(--color-text-muted)]">📍 {settings.address}</p>
            )}
            {settings.contact_phone && (
              <a href={`tel:${settings.contact_phone}`} className="block text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                📞 {settings.contact_phone}
              </a>
            )}
            {settings.contact_email && (
              <a href={`mailto:${settings.contact_email}`} className="block text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                ✉ {settings.contact_email}
              </a>
            )}

            {socials.length > 0 && (
              <div className="mt-5 flex gap-2">
                {socials.map((soc) => (
                  <a
                    key={soc.label}
                    href={soc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={soc.label}
                    className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-[var(--color-border-strong)] text-[var(--color-text-muted)] hover:text-[var(--color-sylarm-red-light)] hover:border-[var(--color-sylarm-red)]/50 transition"
                  >
                    {soc.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {sections.map((s) => (
            <div key={s.title}>
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-4">
                {s.title}
              </h3>
              <ul className="space-y-2.5">
                {s.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-[var(--color-text)]/90 hover:text-[var(--color-sylarm-red-light)] transition"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <GooglePlayBadge href={settings.apps.android ?? "#"} />
          <AppStoreBadge href={settings.apps.ios ?? "#"} />
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between text-xs text-[var(--color-text-faint)]">
          <p>© {year} {settings.brand_name ?? "Aby Luxury Car Rentals"}. All rights reserved.</p>
          <p>Premium car rental & mobility · Abuja, Nigeria</p>
        </div>
      </div>
    </footer>
  );
}
