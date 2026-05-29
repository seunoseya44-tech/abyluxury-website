import { notFound } from "next/navigation";
import { ButtonLink, SectionLabel } from "@/components/ui";

type Params = Promise<{ slug: string }>;

type Service = {
  title: string;
  intro: string;
  bullets: string[];
  primaryCta: { href: string; label: string };
};

const services: Record<string, Service> = {
  "airport-transfer": {
    title: "Airport Transfers in Abuja",
    intro:
      "On-time pickup and drop-off at Nnamdi Azikiwe International Airport. We track your flight, meet you at arrivals, and get you anywhere in the FCT in comfort.",
    bullets: [
      "Flight number tracking — we adjust for delays automatically",
      "Meet-and-greet at arrivals with a name placard",
      "Sedan, SUV, and VIP vehicle classes available",
      "Fixed transparent pricing — no surge, no haggling",
      "Available 24/7, year-round",
    ],
    primaryCta: { href: "/cars?type_intent=airport_pickup", label: "Book a transfer" },
  },
  corporate: {
    title: "Corporate Car Hire",
    intro:
      "Dedicated executive vehicles, monthly retainers, and consolidated invoicing for companies, embassies, and NGOs operating in Abuja.",
    bullets: [
      "Dedicated cars and drivers for executives and visiting partners",
      "Monthly billing in NGN or USD with proper VAT receipts",
      "Background-checked, uniformed chauffeurs",
      "Backup vehicle SLA in case of breakdown",
      "Roll-up reports of every trip, every month",
    ],
    primaryCta: { href: "/contact", label: "Request a corporate plan" },
  },
  tourism: {
    title: "Tourism & City Tours",
    intro:
      "Half-day, full-day, and multi-day curated tours around Abuja and across Nigeria — with driver-guides who know the history, the food spots, and the best stops along the way.",
    bullets: [
      "Curated routes for Abuja, Kano, Jos, Lagos, Calabar",
      "Hotel pickup and drop-off included",
      "Bilingual driver-guides on request",
      "Custom multi-day itineraries built around your interests",
      "Family-friendly vehicles with child seats available",
    ],
    primaryCta: { href: "/contact", label: "Plan a trip" },
  },
  interstate: {
    title: "Interstate Travel Service",
    intro:
      "Safe, comfortable long-distance travel between Nigerian cities. Vetted professional drivers, well-maintained vehicles and transparent fixed pricing — door to door.",
    bullets: [
      "City-to-city trips across Nigeria (Abuja, Lagos, Kano, Jos, Enugu and more)",
      "Professional, background-checked drivers for long routes",
      "Sedans, SUVs and buses for individuals or groups",
      "Fixed, transparent pricing — agreed before you travel",
      "Door-to-door pickup and drop-off",
    ],
    primaryCta: { href: "/contact", label: "Plan your trip" },
  },
  security: {
    title: "Security Services (On Request)",
    intro:
      "Added peace of mind for high-profile guests, executives and sensitive movements. Trained security personnel and escort vehicles, arranged on request alongside your booking.",
    bullets: [
      "Trained, professional security personnel",
      "Escort/convoy vehicles available",
      "Discreet protection for VIPs, executives and events",
      "Coordinated with your rental or chauffeur booking",
      "Available on request — tell us your requirements",
    ],
    primaryCta: { href: "/contact", label: "Request security" },
  },
  hotels: {
    title: "Hotel & Apartment Reservations",
    intro:
      "We handle your stay as well as your ride. Vetted hotels and serviced apartments across Abuja and beyond, booked and confirmed so you arrive to everything ready.",
    bullets: [
      "Vetted hotels and serviced apartments",
      "Options for short stays, long stays and corporate trips",
      "Bundled with your car rental or airport transfer",
      "We handle the booking and confirmation for you",
      "Locations across Abuja and major Nigerian cities",
    ],
    primaryCta: { href: "/contact", label: "Request a reservation" },
  },
};

export function generateStaticParams() {
  return Object.keys(services).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const service = services[slug];
  return service
    ? { title: service.title, description: service.intro }
    : { title: "Service" };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const service = services[slug];
  if (!service) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <SectionLabel>Service</SectionLabel>
      <h1 className="font-display font-extrabold text-4xl sm:text-6xl leading-tight">
        {service.title}
      </h1>
      <p className="mt-5 text-lg text-[var(--color-text-muted)] max-w-2xl leading-relaxed">
        {service.intro}
      </p>

      <ul className="mt-10 space-y-3">
        {service.bullets.map((b) => (
          <li key={b} className="flex items-start gap-3">
            <span className="mt-1 text-[var(--color-sylarm-red-light)]">✓</span>
            <span className="text-[var(--color-text)]/90">{b}</span>
          </li>
        ))}
      </ul>

      <div className="mt-12 flex flex-wrap gap-3">
        <ButtonLink href={service.primaryCta.href} size="lg">
          {service.primaryCta.label}
        </ButtonLink>
        <ButtonLink href="/contact" variant="secondary" size="lg">
          Talk to sales
        </ButtonLink>
      </div>
    </div>
  );
}
