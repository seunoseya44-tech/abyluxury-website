import Link from "next/link";
import { Badge } from "@/components/ui";
import { CarImage } from "@/components/car-image";
import { formatNaira } from "@/lib/format";
import type { CarSale } from "@/lib/types";

const conditionLabel: Record<string, string> = {
  brand_new: "Brand New",
  foreign_used: "Foreign Used",
  nigerian_used: "Nigerian Used",
};

export function SaleCard({ sale }: { sale: CarSale }) {
  return (
    <Link
      href={`/car-sales/${sale.id}`}
      className="group block bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden hover:border-[var(--color-sylarm-red)]/40 transition-all hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] bg-[var(--color-bg-3)] overflow-hidden">
        <CarImage src={sale.primary_image} alt={sale.title} brand={sale.brand} />
        <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5">
          {sale.is_featured && <Badge tone="red" overlay>Featured</Badge>}
          <Badge tone="neutral" overlay>{conditionLabel[sale.condition] ?? sale.condition}</Badge>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-display font-bold text-lg leading-tight truncate">{sale.title}</h3>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          {sale.year} · {sale.mileage ? `${sale.mileage.toLocaleString()} km` : "—"} ·{" "}
          {sale.transmission}
        </p>
        <div className="mt-4 flex items-end justify-between">
          <p className="font-display font-extrabold text-xl">{formatNaira(sale.price)}</p>
          <span className="text-xs font-semibold text-[var(--color-sylarm-red)] group-hover:translate-x-1 transition-transform">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}
