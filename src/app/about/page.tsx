import { ButtonLink, SectionLabel } from "@/components/ui";
import { getSiteSettings } from "@/lib/settings";

export const metadata = {
  title: "About Aby Luxury Car Rentals",
  description:
    "Aby Luxury Car Rentals is Abuja's premium car rental platform — verified vehicles, professional drivers, transparent pricing.",
};

const values = [
  {
    title: "Trust first",
    body: "Every vehicle is verified and insured. Every driver is vetted and tracked. No surprises.",
  },
  {
    title: "Transparent pricing",
    body: "What you see is what you pay. No hidden fees, no airport markups, no fuel scams.",
  },
  {
    title: "Built for Nigeria",
    body: "Naira-native pricing, Paystack and Flutterwave first, USSD friendly. We understand the market because we live it.",
  },
  {
    title: "Premium experience",
    body: "From the booking flow to the in-cabin experience, we hold ourselves to a high standard.",
  },
];

export default async function AboutPage() {
  const settings = await getSiteSettings();
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <SectionLabel>About Aby Luxury Car Rentals</SectionLabel>
      <h1 className="font-display font-extrabold text-4xl sm:text-6xl leading-tight">
        Mobility, the way Abuja deserves.
      </h1>
      <p className="mt-6 text-lg text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">
        {settings.about_text}
      </p>

      <div className="mt-14 grid gap-5 sm:grid-cols-2">
        {values.map((v) => (
          <div
            key={v.title}
            className="p-6 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl"
          >
            <h3 className="font-display font-bold text-xl">{v.title}</h3>
            <p className="mt-2 text-sm text-[var(--color-text-muted)] leading-relaxed">
              {v.body}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-16 p-8 rounded-2xl border border-[var(--color-sylarm-red)]/30 bg-[var(--color-sylarm-red)]/5">
        <h2 className="font-display font-bold text-2xl">
          Want to list your car with us?
        </h2>
        <p className="mt-2 text-[var(--color-text-muted)]">
          Fleet owners earn 70% of every rental on their vehicle — we handle the
          customers, drivers, payments and insurance.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <ButtonLink href="/sell-car">Sell your car</ButtonLink>
          <ButtonLink href="/contact" variant="secondary">
            Talk to us
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
