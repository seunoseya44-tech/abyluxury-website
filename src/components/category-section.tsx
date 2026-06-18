import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { CarCard } from "@/components/car-card";
import { SectionLabel } from "@/components/ui";
import type { CarCategory } from "@/lib/categories";
import type { CarSummary, Paginated } from "@/lib/types";

async function getCategoryCars(slug: string): Promise<CarSummary[]> {
  try {
    const res = await apiFetch<Paginated<CarSummary>>("v1/cars", {
      query: { category: slug, per_page: 3 },
    });
    return res.data;
  } catch {
    return [];
  }
}

/**
 * Renders one homepage section for a car category. Returns null when the
 * category has no cars so empty sections never appear.
 */
export async function CategorySection({
  category,
}: {
  category: CarCategory;
}) {
  const cars = await getCategoryCars(category.slug);
  if (cars.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-end justify-between mb-8 gap-4">
        <div>
          <SectionLabel>{category.label}</SectionLabel>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl">
            {category.label}
          </h2>
          <p className="mt-2 text-[var(--color-text-muted)] max-w-xl">
            {category.tagline}
          </p>
        </div>
        <Link
          href={`/categories/${category.slug}`}
          className="hidden sm:inline-flex text-sm font-semibold text-[var(--color-sylarm-red-light)] hover:text-[var(--color-sylarm-red)] transition whitespace-nowrap"
        >
          View all {category.label} →
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
      <Link
        href={`/categories/${category.slug}`}
        className="mt-6 inline-flex text-sm font-semibold text-[var(--color-sylarm-red-light)] hover:text-[var(--color-sylarm-red)] transition sm:hidden"
      >
        View all {category.label} →
      </Link>
    </section>
  );
}
