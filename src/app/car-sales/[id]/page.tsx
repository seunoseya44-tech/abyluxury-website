import Link from "next/link";
import { notFound } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { CarImage } from "@/components/car-image";
import { SaleInquiryForm } from "@/components/sale-inquiry-form";
import { Badge, SectionLabel } from "@/components/ui";
import { formatNaira } from "@/lib/format";
import type { CarSale } from "@/lib/types";

type Params = Promise<{ id: string }>;

const conditionLabel: Record<string, string> = {
  brand_new: "Brand New",
  foreign_used: "Foreign Used",
  nigerian_used: "Nigerian Used",
};

async function getSale(id: string): Promise<CarSale | null> {
  try {
    const res = await apiFetch<{ data: CarSale }>(`v1/car-sales/${id}`);
    return res.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Params }) {
  const { id } = await params;
  const sale = await getSale(id);
  if (!sale) return { title: "Listing not found" };
  return { title: `${sale.title} — ${formatNaira(sale.price)}`, description: sale.description ?? sale.title };
}

export default async function CarSaleDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const sale = await getSale(id);
  if (!sale) notFound();

  const images = sale.images.length > 0 ? sale.images : [null];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="mb-6 text-sm text-[var(--color-text-muted)]">
        <Link href="/car-sales" className="hover:text-[var(--color-text)]">← Back to marketplace</Link>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[var(--color-card)] border border-[var(--color-border)]">
            <CarImage src={images[0]} alt={sale.title} brand={sale.brand} />
          </div>
          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {images.slice(1, 5).map((img, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-[var(--color-card)] border border-[var(--color-border)]">
                  <CarImage src={img} alt={sale.title} brand={sale.brand} />
                </div>
              ))}
            </div>
          )}

          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {sale.is_featured && <Badge tone="red">Featured</Badge>}
              <Badge tone="neutral">{conditionLabel[sale.condition] ?? sale.condition}</Badge>
              {sale.negotiable && <Badge tone="green">Negotiable</Badge>}
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl">{sale.title}</h1>
            <p className="mt-3 font-display font-extrabold text-3xl text-[var(--color-sylarm-red)]">
              {formatNaira(sale.price)}
            </p>
            {sale.description && (
              <p className="mt-4 text-[var(--color-text-muted)] leading-relaxed">{sale.description}</p>
            )}
          </div>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Spec label="Year" value={String(sale.year)} />
            <Spec label="Mileage" value={sale.mileage ? `${sale.mileage.toLocaleString()} km` : "—"} />
            <Spec label="Transmission" value={sale.transmission} />
            <Spec label="Fuel" value={sale.fuel_type} />
            <Spec label="Colour" value={sale.color ?? "—"} />
            <Spec label="Location" value={sale.location} />
          </div>

          {sale.features.length > 0 && (
            <div className="mt-8">
              <SectionLabel>Features</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {sale.features.map((f) => (
                  <Badge key={f} tone="neutral">{f}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside>
          <SaleInquiryForm carSaleId={sale.id} />
        </aside>
      </div>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4">
      <p className="text-[11px] uppercase tracking-wider text-[var(--color-text-faint)]">{label}</p>
      <p className="mt-1 font-semibold capitalize">{value}</p>
    </div>
  );
}
