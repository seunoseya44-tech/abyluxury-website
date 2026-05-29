import Link from "next/link";
import { ButtonLink, SectionLabel } from "@/components/ui";

export const metadata = {
  title: "Services",
  description:
    "Car rental, fleet management, tourism guides, airport pickup & drop-off, interstate travel, security services and hotel & apartment reservations — all with Aby Luxury Car Rentals.",
};

const services = [
  {
    href: "/cars",
    icon: "🚗",
    title: "Car Rental Services",
    body: "Self-drive or chauffeured — sedans, SUVs and luxury cars by the hour, day, week or month. Insured, fuelled and ready.",
  },
  {
    href: "/fleet",
    icon: "🚐",
    title: "Fleet Management",
    body: "List your vehicle and earn. We handle customers, drivers, payments, insurance and upkeep — you keep 70% of every rental.",
  },
  {
    href: "/services/tourism",
    icon: "🗺️",
    title: "Tourism Guides",
    body: "Curated multi-day tours with experienced driver-guides who know Nigeria's best routes, food spots and stops.",
  },
  {
    href: "/services/airport-transfer",
    icon: "✈️",
    title: "Airport Pickup & Drop-off",
    body: "On-time airport transfers with flight tracking and meet-and-greet. Sedan, SUV or VIP options, 24/7.",
  },
  {
    href: "/services/interstate",
    icon: "🛣️",
    title: "Interstate Service",
    body: "Comfortable, safe long-distance travel between Nigerian cities with vetted professional drivers.",
  },
  {
    href: "/services/security",
    icon: "🛡️",
    title: "Security Services (On Request)",
    body: "Trained security personnel and escort vehicles available on request for high-profile or sensitive trips.",
  },
  {
    href: "/services/hotels",
    icon: "🏨",
    title: "Hotels & Apartments Reservations",
    body: "We arrange vetted hotels and serviced apartments to complement your trip — booked and confirmed for you.",
  },
];

export default function ServicesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <SectionLabel>Services</SectionLabel>
      <h1 className="font-display font-extrabold text-4xl sm:text-6xl max-w-3xl leading-tight">
        Every kind of ride, in one place.
      </h1>
      <p className="mt-4 text-lg text-[var(--color-text-muted)] max-w-2xl">
        From a quick airport pickup to a six-month corporate contract — Aby Luxury Car Rentals
        runs the platform, the cars and the drivers, so you don&apos;t have to
        coordinate any of it yourself.
      </p>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <Link
            key={s.title}
            href={s.href}
            className="group p-7 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl hover:border-[var(--color-sylarm-red)]/40 transition-all"
          >
            <div className="text-4xl mb-5">{s.icon}</div>
            <h3 className="font-display font-bold text-xl">{s.title}</h3>
            <p className="mt-3 text-sm text-[var(--color-text-muted)] leading-relaxed">
              {s.body}
            </p>
            <span className="mt-5 inline-block text-xs font-semibold text-[var(--color-sylarm-red-light)] group-hover:translate-x-1 transition-transform">
              Explore →
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-16 p-8 sm:p-12 rounded-3xl border border-[var(--color-sylarm-red)]/30 bg-gradient-to-br from-[var(--color-card)] to-[var(--color-sylarm-red)]/10">
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl max-w-xl">
          Need something we haven&apos;t listed?
        </h2>
        <p className="mt-3 text-[var(--color-text-muted)] max-w-xl">
          Tell us what you&apos;re organising and we&apos;ll build a custom package.
        </p>
        <div className="mt-6">
          <ButtonLink href="/contact" size="lg">
            Get in touch
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
