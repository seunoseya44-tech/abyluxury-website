import Link from "next/link";
import { notFound } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { CarCard } from "@/components/car-card";
import { SectionLabel } from "@/components/ui";
import { CAR_CATEGORIES, getCategory } from "@/lib/categories";
import type { CarSummary, Paginated } from "@/lib/types";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [k: string]: string | string[] | undefined }>;

// Pre-render a route for each known category.
export function generateStaticParams() {
  return CAR_CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return { title: "Category not found" };
  return {
    title: `${category.label} cars for rent in Abuja`,
    description: category.tagline,
  };
}

function single(sp: { [k: string]: string | string[] | undefined }, key: string) {
  const v = sp[key];
  return Array.isArray(v) ? v[0] : v;
}

async function getCars(slug: string, page: string | undefined) {
  try {
    return await apiFetch<Paginated<CarSummary>>("v1/cars", {
      query: { category: slug, per_page: 12, page },
    });
  } catch {
    return null;
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const sp = await searchParams;
  const page = single(sp, "page");
  const result = await getCars(slug, page);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="mb-6 text-sm text-[var(--color-text-muted)]">
        <Link href="/cars" className="hover:text-[var(--color-text)]">
          ← All cars
        </Link>
      </div>

      <div className="mb-10">
        <SectionLabel>Category</SectionLabel>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl">
          {category.label}
        </h1>
        <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl">
          {category.tagline}
        </p>
      </div>

      {/* Quick switch between categories */}
      <div className="mb-10 flex flex-wrap gap-2">
        {CAR_CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/categories/${c.slug}`}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
              c.slug === slug
                ? "border-[var(--color-sylarm-red)] bg-[var(--color-sylarm-red)]/10 text-[var(--color-sylarm-red-light)]"
                : "border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-sylarm-red)]/40"
            }`}
          >
            {c.label}
          </Link>
        ))}
      </div>

      {!result || result.data.length === 0 ? (
        <div className="border border-dashed border-[var(--color-border-strong)] rounded-2xl p-12 text-center">
          <p className="text-[var(--color-text-muted)]">
            {result === null
              ? "Couldn't reach the catalogue right now. Please refresh in a moment."
              : `No ${category.label} cars are listed yet. Check back soon or browse all cars.`}
          </p>
        </div>
      ) : (
        <>
          <p className="mb-6 text-sm text-[var(--color-text-muted)]">
            Showing{" "}
            <strong className="text-[var(--color-text)]">
              {result.meta.from}-{result.meta.to}
            </strong>{" "}
            of{" "}
            <strong className="text-[var(--color-text)]">
              {result.meta.total}
            </strong>{" "}
            cars
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {result.data.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>

          {result.meta.last_page > 1 && (
            <nav className="mt-12 flex items-center justify-center gap-1">
              {result.meta.current_page > 1 && (
                <Link
                  href={`/categories/${slug}?page=${result.meta.current_page - 1}`}
                  className="px-4 h-10 inline-flex items-center rounded-lg text-sm font-medium bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-sylarm-red)]/40"
                >
                  ← Prev
                </Link>
              )}
              <span className="px-4 text-sm text-[var(--color-text-muted)]">
                Page {result.meta.current_page} of {result.meta.last_page}
              </span>
              {result.meta.current_page < result.meta.last_page && (
                <Link
                  href={`/categories/${slug}?page=${result.meta.current_page + 1}`}
                  className="px-4 h-10 inline-flex items-center rounded-lg text-sm font-medium bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-sylarm-red)]/40"
                >
                  Next →
                </Link>
              )}
            </nav>
          )}
        </>
      )}
    </div>
  );
}
