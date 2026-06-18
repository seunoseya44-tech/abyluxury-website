import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { CarCard } from "@/components/car-card";
import { CarFilters } from "@/components/car-filters";
import { SectionLabel } from "@/components/ui";
import type { CarSummary, Paginated } from "@/lib/types";

type SearchParams = Promise<{ [k: string]: string | string[] | undefined }>;

export const metadata = {
  title: "Premium cars for rent in Abuja",
  description:
    "Browse Aby Luxury Car Rentals' verified fleet of cars for self-drive or chauffeured rental in Abuja.",
};

function single(sp: { [k: string]: string | string[] | undefined }, key: string) {
  const v = sp[key];
  return Array.isArray(v) ? v[0] : v;
}

async function getCars(query: Record<string, string | undefined>) {
  try {
    return await apiFetch<Paginated<CarSummary>>("v1/cars", {
      query: { per_page: 12, ...query },
    });
  } catch {
    return null;
  }
}

export default async function CarsListingPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;

  const query = {
    type: single(sp, "type"),
    category: single(sp, "category"),
    min_seats: single(sp, "min_seats"),
    min_price: single(sp, "min_price"),
    vip_only: single(sp, "vip_only"),
    featured_only: single(sp, "featured_only"),
    search: single(sp, "q"),
    page: single(sp, "page"),
  };

  const result = await getCars(query);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="mb-10">
        <SectionLabel>Fleet</SectionLabel>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl">
          Cars available in Abuja
        </h1>
        <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl">
          Every car is verified, insured and ready to drive. Filter by type,
          capacity or price.
        </p>
      </div>

      <div className="mb-10">
        <CarFilters />
      </div>

      {!result || result.data.length === 0 ? (
        <div className="border border-dashed border-[var(--color-border-strong)] rounded-2xl p-12 text-center">
          <p className="text-[var(--color-text-muted)]">
            {result === null
              ? "Couldn't reach the catalogue right now. Please refresh in a moment."
              : "No cars match your filters yet. Try widening your search."}
          </p>
        </div>
      ) : (
        <>
          <p className="mb-6 text-sm text-[var(--color-text-muted)]">
            Showing <strong className="text-[var(--color-text)]">{result.meta.from}-{result.meta.to}</strong>{" "}
            of <strong className="text-[var(--color-text)]">{result.meta.total}</strong> cars
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {result.data.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>

          {result.meta.last_page > 1 && (
            <Pagination
              current={result.meta.current_page}
              last={result.meta.last_page}
              query={query}
            />
          )}
        </>
      )}
    </div>
  );
}

function Pagination({
  current,
  last,
  query,
}: {
  current: number;
  last: number;
  query: Record<string, string | undefined>;
}) {
  function pageHref(p: number) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) {
      if (v) params.set(k, v);
    }
    params.set("page", String(p));
    return `/cars?${params.toString()}`;
  }

  return (
    <nav className="mt-12 flex items-center justify-center gap-1">
      {current > 1 && (
        <Link
          href={pageHref(current - 1)}
          className="px-4 h-10 inline-flex items-center rounded-lg text-sm font-medium bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-sylarm-red)]/40"
        >
          ← Prev
        </Link>
      )}
      <span className="px-4 text-sm text-[var(--color-text-muted)]">
        Page {current} of {last}
      </span>
      {current < last && (
        <Link
          href={pageHref(current + 1)}
          className="px-4 h-10 inline-flex items-center rounded-lg text-sm font-medium bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-sylarm-red)]/40"
        >
          Next →
        </Link>
      )}
    </nav>
  );
}
