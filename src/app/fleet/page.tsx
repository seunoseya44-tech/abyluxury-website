import { ButtonLink, SectionLabel } from "@/components/ui";

export const metadata = {
  title: "List your car & earn — Aby Luxury Fleet",
  description:
    "Hand your vehicle to Aby Luxury Car Rentals and earn passive income. We handle customers, drivers, payments and insurance. Owners keep 70% of every rental.",
};

const benefits = [
  { icon: "💰", title: "Earn 70%", body: "Keep 70% of every rental on your vehicle, paid out monthly." },
  { icon: "🛡️", title: "Fully managed", body: "We handle bookings, vetted drivers, payments and maintenance coordination." },
  { icon: "📊", title: "Full transparency", body: "Track rental history, earnings and payouts from your dashboard, anytime." },
  { icon: "🔑", title: "You stay in control", body: "Pause or withdraw your vehicle whenever you want. No lock-in." },
];

const steps = [
  { n: "01", t: "Submit your car", d: "Register your vehicle's details in minutes from your dashboard." },
  { n: "02", t: "We verify & list", d: "Our team inspects, insures and lists it for rental across Abuja." },
  { n: "03", t: "Earn & get paid", d: "Your car earns while you relax. Receive periodic payouts to your account." },
];

export default function FleetLandingPage() {
  return (
    <>
      <section className="section-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-2xl">
            <SectionLabel>Aby Luxury Fleet</SectionLabel>
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl leading-[1.05]">
              Turn your idle car into <span className="text-[var(--color-sylarm-red)]">income.</span>
            </h1>
            <p className="mt-6 text-lg text-[var(--color-text-muted)]">
              List your vehicle with Aby Luxury Car Rentals and let it earn while you focus on other things. We
              manage the customers, drivers, payments and insurance — you keep 70%.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/dashboard/fleet" size="lg">List my car</ButtonLink>
              <ButtonLink href="/contact" variant="onColor" size="lg">Talk to the team</ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <SectionLabel>Why Aby Luxury Fleet</SectionLabel>
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl max-w-2xl">
          The easiest way to earn from a car you already own.
        </h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div key={b.title} className="p-6 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl">
              <div className="text-3xl mb-4">{b.icon}</div>
              <h3 className="font-display font-bold text-lg mb-2">{b.title}</h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-2)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <SectionLabel>How it works</SectionLabel>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="p-7 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl">
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-sylarm-red)]">Step {s.n}</span>
                <h3 className="mt-2 font-display font-bold text-2xl">{s.t}</h3>
                <p className="mt-3 text-sm text-[var(--color-text-muted)] leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <ButtonLink href="/dashboard/fleet" size="lg">Get started — list your car</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
