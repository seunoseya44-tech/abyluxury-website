import Image from "next/image";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { CarCard } from "@/components/car-card";
import { HeroBookingWidget } from "@/components/hero-booking-widget";
import { MarketplaceCta } from "@/components/marketplace-cta";
import { DownloadCta } from "@/components/download-cta";
import { ButtonLink, SectionLabel } from "@/components/ui";
import { SaleCard } from "@/components/sale-card";
import { getSiteSettings } from "@/lib/settings";
import type { CarSale, CarSummary, Paginated } from "@/lib/types";

async function getFeaturedCars(): Promise<CarSummary[]> {
  try {
    const res = await apiFetch<Paginated<CarSummary>>("v1/cars", {
      query: { featured_only: true, per_page: 6 },
    });
    return res.data;
  } catch {
    return [];
  }
}

async function getFeaturedSales(): Promise<CarSale[]> {
  try {
    const res = await apiFetch<Paginated<CarSale>>("v1/car-sales", {
      query: { featured_only: true, per_page: 3 },
    });
    if (res.data.length > 0) return res.data;
    // Fall back to the latest listings if none are explicitly featured.
    const latest = await apiFetch<Paginated<CarSale>>("v1/car-sales", {
      query: { per_page: 3 },
    });
    return latest.data;
  } catch {
    return [];
  }
}

const services = [
  {
    title: "Self-drive Rental",
    description:
      "Pick a verified car. Drive it yourself. Pay by the hour, day, week or month.",
    icon: "🚗",
    href: "/cars",
  },
  {
    title: "Chauffeur Service",
    description:
      "Professional, vetted drivers. Sit back, relax, and let us handle Abuja traffic.",
    icon: "👔",
    href: "/cars?with_driver=1",
  },
  {
    title: "Airport Transfers",
    description: "On-time NAIA pickup and drop-off. Flight tracking included.",
    icon: "✈️",
    href: "/services/airport-transfer",
  },
  {
    title: "VIP & Luxury",
    description:
      "Range Rover, S-Class, GLE. For weddings, executives, and special occasions.",
    icon: "💎",
    href: "/cars?vip_only=1",
  },
  {
    title: "Corporate Hire",
    description:
      "Monthly fleet packages with consolidated billing for organisations.",
    icon: "🏢",
    href: "/services/corporate",
  },
  {
    title: "Tourism Tours",
    description:
      "Multi-day Abuja and Nigeria tours with a driver who knows every route.",
    icon: "🗺️",
    href: "/services/tourism",
  },
];

const steps = [
  {
    n: "01",
    title: "Browse & choose",
    desc: "Filter by type, brand, price, and date. Every car is verified and insured.",
  },
  {
    n: "02",
    title: "Book & pay securely",
    desc: "Get a transparent quote. Pay with Paystack, Flutterwave, or wallet — no hidden fees.",
  },
  {
    n: "03",
    title: "Drive or ride",
    desc: "Self-drive or get a professional chauffeur. Track everything from the app.",
  },
];

export default async function HomePage() {
  const [featured, featuredSales, settings] = await Promise.all([
    getFeaturedCars(),
    getFeaturedSales(),
    getSiteSettings(),
  ]);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-noise opacity-60" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--color-sylarm-red)]/10 blur-[120px] rounded-full" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-28 sm:pt-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
            <div className="max-w-xl">
              <h1 className="font-display font-extrabold text-5xl sm:text-7xl leading-[1.05] tracking-tight">
                Drive Abuja
                <br />
                in <span className="text-[var(--color-sylarm-red)]">style.</span>
              </h1>
              <p className="mt-6 text-lg text-[var(--color-text-muted)] max-w-lg leading-relaxed">
                Premium car rentals, verified chauffeurs, airport transfers and
                corporate hire — all on one transparent platform. Built for the
                Nigerian market.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/cars" size="lg">
                  Browse cars
                </ButtonLink>
                <ButtonLink href="/services" size="lg" variant="secondary">
                  Our services
                </ButtonLink>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 -z-10 bg-[var(--color-sylarm-red)]/10 blur-[90px] rounded-full" />
              <Image
                src="/car.png"
                alt="Premium Toyota Camry available to rent on Aby Luxury Car Rentals"
                width={1536}
                height={1024}
                priority
                sizes="(max-width: 1024px) 90vw, 640px"
                className="w-full h-auto object-contain drop-shadow-[0_30px_60px_rgba(16,19,28,0.18)]"
              />
            </div>
          </div>

          <div className="mt-12">
            <HeroBookingWidget />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10 gap-4">
          <div>
            <SectionLabel>Hand-picked</SectionLabel>
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl">
              Featured fleet
            </h2>
          </div>
          <Link
            href="/cars"
            className="hidden sm:inline-flex text-sm font-semibold text-[var(--color-sylarm-red-light)] hover:text-[var(--color-sylarm-red)] transition"
          >
            View all cars →
          </Link>
        </div>
        {featured.length === 0 ? (
          <div className="border border-dashed border-[var(--color-border-strong)] rounded-2xl p-12 text-center">
            <p className="text-[var(--color-text-muted)]">
              We&apos;re lining up our featured fleet. Check back shortly.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </section>

      {featuredSales.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="flex items-end justify-between mb-10 gap-4">
            <div>
              <SectionLabel>For sale</SectionLabel>
              <h2 className="font-display font-extrabold text-4xl sm:text-5xl">
                Cars on the market
              </h2>
            </div>
            <Link
              href="/car-sales"
              className="hidden sm:inline-flex text-sm font-semibold text-[var(--color-sylarm-red-light)] hover:text-[var(--color-sylarm-red)] transition"
            >
              View all for sale →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredSales.map((sale) => (
              <SaleCard key={sale.id} sale={sale} />
            ))}
          </div>
        </section>
      )}

      <section className="section-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <SectionLabel>What we do</SectionLabel>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl max-w-2xl">
            Every kind of ride, one trusted platform.
          </h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <Link
                key={s.title}
                href={s.href}
                className="group p-6 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl hover:border-[var(--color-sylarm-red)]/40 transition-all"
              >
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3 className="font-display font-bold text-xl mb-2">{s.title}</h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  {s.description}
                </p>
                <span className="mt-5 inline-block text-xs font-semibold text-[var(--color-sylarm-red-light)] group-hover:translate-x-1 transition-transform">
                  Learn more →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-20">
        <MarketplaceCta
          image="/car-sales-cta.jpg"
          eyebrow="Marketplace"
          title="Looking to buy? Find your next car."
          body="Browse hand-inspected foreign-used, Nigerian-used and brand-new vehicles for sale. Send an inquiry and our sales team handles the rest — paperwork, inspection and handover included."
          ctaLabel="Browse cars for sale"
          ctaHref="/car-sales"
        />
        <MarketplaceCta
          image="/sell-car-cta.jpg"
          eyebrow="Sell your car"
          title="Selling? Get a fair offer in 48 hours."
          body="Skip the dealership runaround and endless callbacks. Tell us about your vehicle, and Aby Luxury Car Rentals comes back with a transparent offer within two days — no obligation."
          ctaLabel="Sell your car"
          ctaHref="/sell-car"
          reverse
        />
      </section>

      {/* Fleet / Asset Management CTA — text only */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="section-dark relative overflow-hidden rounded-3xl p-10 sm:p-14">
          <div className="absolute inset-0 grid-noise opacity-30" />
          <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <SectionLabel>Aby Luxury Fleet</SectionLabel>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight">
                Own a car? Put it to work and earn.
              </h2>
              <p className="mt-4 text-lg text-[var(--color-text-muted)] max-w-xl">
                List your vehicle with Aby Luxury Car Rentals and earn passive income while we handle the
                customers, drivers, payments and insurance. Owners keep 70% of every rental.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <ButtonLink href="/fleet" variant="white" size="lg">
                  List your car
                </ButtonLink>
                <ButtonLink href="/dashboard/fleet" variant="onColor" size="lg">
                  Owner dashboard
                </ButtonLink>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { v: "70%", l: "You keep" },
                { v: "100%", l: "Insured" },
                { v: "Monthly", l: "Payouts" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="font-display font-extrabold text-3xl text-[var(--color-sylarm-red-light)]">
                    {s.v}
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
                    {s.l}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <SectionLabel>How it works</SectionLabel>
        <h2 className="font-display font-extrabold text-4xl sm:text-5xl max-w-2xl">
          Three steps from search to seat.
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.n}
              className="p-7 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl relative overflow-hidden"
            >
              <span className="absolute -top-2 -right-2 font-display text-[6rem] leading-none font-extrabold text-[var(--color-subtle)]">
                {step.n}
              </span>
              <div className="relative">
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-sylarm-red-light)]">
                  Step {step.n}
                </span>
                <h3 className="mt-2 font-display font-bold text-2xl">{step.title}</h3>
                <p className="mt-3 text-sm text-[var(--color-text-muted)] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { v: "50+", l: "Verified vehicles" },
            { v: "100%", l: "Insured trips" },
            { v: "24/7", l: "Support" },
            { v: "Abuja", l: "Live coverage" },
          ].map((s) => (
            <div key={s.l}>
              <p className="font-display font-extrabold text-5xl text-[var(--color-sylarm-red)]">
                {s.v}
              </p>
              <p className="mt-1 text-sm text-[var(--color-text-muted)] uppercase tracking-wider">
                {s.l}
              </p>
            </div>
          ))}
        </div>
      </section>

      <DownloadCta settings={settings} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid items-center gap-8 lg:gap-12 lg:grid-cols-2">
          <div className="relative lg:order-2">
            <div className="absolute -inset-3 -z-10 bg-[var(--color-sylarm-red)]/10 blur-3xl rounded-full" />
            <div className="relative aspect-[3/2] rounded-3xl overflow-hidden border border-[var(--color-border)] shadow-[0_30px_60px_-20px_rgba(16,19,28,0.25)]">
              <Image
                src="/signup-woman.jpg"
                alt="Sign up with Aby Luxury Car Rentals"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="lg:order-1">
            <SectionLabel>Get started</SectionLabel>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight">
              Ready when you are.
            </h2>
            <p className="mt-4 text-lg text-[var(--color-text-muted)] leading-relaxed">
              Sign up in seconds, browse the fleet, and book your first ride
              today. Welcome to Aby Luxury Car Rentals.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="/register" size="lg">
                Create free account
              </ButtonLink>
              <ButtonLink href="/cars" variant="secondary" size="lg">
                Browse without signing up
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
