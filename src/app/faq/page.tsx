import { apiFetch } from "@/lib/api";
import { SectionLabel } from "@/components/ui";
import type { Faq } from "@/lib/types";

async function getFaqs(): Promise<Faq[]> {
  try {
    const res = await apiFetch<{ data: Faq[] }>("v1/faqs");
    return res.data;
  } catch {
    return [];
  }
}

export const metadata = {
  title: "Frequently Asked Questions",
  description:
    "Find answers to common questions about renting a car with Aby Luxury Car Rentals — deposits, documents, fuel, age requirements, and more.",
};

export default async function FaqPage() {
  const faqs = await getFaqs();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <SectionLabel>Help centre</SectionLabel>
      <h1 className="font-display font-extrabold text-4xl sm:text-5xl mt-2 mb-4">
        Frequently asked questions
      </h1>
      <p className="text-[var(--color-text-muted)] text-lg mb-14">
        Everything you need to know before you drive. Can&apos;t find what
        you&apos;re looking for?{" "}
        <a
          href="/contact"
          className="text-[var(--color-sylarm-red-light)] hover:underline"
        >
          Contact us
        </a>
        .
      </p>

      {faqs.length === 0 ? (
        <p className="text-[var(--color-text-muted)]">
          No FAQs are available right now. Please check back shortly.
        </p>
      ) : (
        <div className="divide-y divide-[var(--color-border)]">
          {faqs.map((faq) => (
            <FaqItem key={faq.id} faq={faq} />
          ))}
        </div>
      )}
    </div>
  );
}

function FaqItem({ faq }: { faq: Faq }) {
  return (
    <details className="group py-6">
      <summary className="flex cursor-pointer items-start justify-between gap-4 list-none">
        <span className="font-display font-semibold text-lg leading-snug group-open:text-[var(--color-sylarm-red-light)]">
          {faq.question}
        </span>
        <span className="mt-1 shrink-0 text-[var(--color-text-faint)] transition group-open:rotate-180">
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </summary>
      <p className="mt-4 text-[var(--color-text-muted)] leading-relaxed">
        {faq.answer}
      </p>
    </details>
  );
}
