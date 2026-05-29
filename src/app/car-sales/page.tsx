import { apiFetch } from "@/lib/api";
import { SaleCard } from "@/components/sale-card";
import { SectionLabel } from "@/components/ui";
import type { CarSale, Paginated } from "@/lib/types";

export const metadata = {
  title: "Cars for sale in Abuja",
  description: "Browse quality foreign-used, Nigerian-used and brand-new cars for sale on Aby Luxury Car Rentals.",
};

async function getSales(): Promise<CarSale[]> {
  try {
    const res = await apiFetch<Paginated<CarSale>>("v1/car-sales", { query: { per_page: 24 } });
    return res.data;
  } catch {
    return [];
  }
}

export default async function CarSalesPage() {
  const sales = await getSales();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <SectionLabel>Marketplace</SectionLabel>
      <h1 className="font-display font-extrabold text-4xl sm:text-5xl">Cars for sale</h1>
      <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl">
        Hand-inspected vehicles from Aby Luxury Car Rentals and trusted partners. Found one you like? Send an
        inquiry and our sales team will reach out.
      </p>

      {sales.length === 0 ? (
        <div className="mt-10 border border-dashed border-[var(--color-border-strong)] rounded-2xl p-12 text-center">
          <p className="text-[var(--color-text-muted)]">No cars listed for sale right now. Check back soon.</p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sales.map((sale) => (
            <SaleCard key={sale.id} sale={sale} />
          ))}
        </div>
      )}
    </div>
  );
}
