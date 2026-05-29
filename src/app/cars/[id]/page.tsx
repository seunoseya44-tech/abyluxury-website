import Link from "next/link";
import { notFound } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { CarBookingWidget } from "@/components/car-booking-widget";
import { CarImage } from "@/components/car-image";
import { Badge, SectionLabel } from "@/components/ui";
import { formatNaira } from "@/lib/format";
import type { CarDetail } from "@/lib/types";

type Params = Promise<{ id: string }>;

async function getCar(id: string): Promise<CarDetail | null> {
  try {
    const res = await apiFetch<{ data: CarDetail }>(`v1/cars/${id}`);
    return res.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Params }) {
  const { id } = await params;
  const car = await getCar(id);
  if (!car) return { title: "Car not found" };
  return {
    title: `${car.name} · Rent from ${formatNaira(car.daily_rate)}/day`,
    description:
      car.description ??
      `Rent the ${car.name} in Abuja with Aby Luxury Car Rentals. Verified, insured and ready to drive.`,
  };
}

export default async function CarDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const car = await getCar(id);
  if (!car) notFound();

  const images =
    car.images && car.images.length > 0
      ? car.images
      : [{ id: 0, url: null, is_primary: true, display_order: 0 }];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="mb-6 text-sm text-[var(--color-text-muted)]">
        <Link href="/cars" className="hover:text-[var(--color-text)]">
          ← Back to cars
        </Link>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[var(--color-card)] border border-[var(--color-border)]">
            <CarImage
              src={images[0].url}
              alt={car.name}
              brand={car.brand}
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </div>

          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {images.slice(1, 5).map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-square rounded-xl overflow-hidden bg-[var(--color-card)] border border-[var(--color-border)]"
                >
                  <CarImage
                    src={img.url}
                    alt={car.name}
                    brand={car.brand}
                    sizes="200px"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="mt-10">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {car.is_vip && <Badge tone="purple">VIP</Badge>}
              {car.is_featured && <Badge tone="red">Featured</Badge>}
              <Badge tone="neutral">{car.type}</Badge>
              <Badge tone="green">Available</Badge>
            </div>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl">
              {car.name}
            </h1>
            <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl">
              {car.description ??
                "A premium addition to the Aby Luxury Car Rentals fleet, verified and ready for your next trip across Abuja."}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Spec label="Transmission" value={car.transmission} />
            <Spec label="Fuel" value={car.fuel_type} />
            <Spec label="Seats" value={`${car.seats} people`} />
            <Spec label="Year" value={String(car.year)} />
          </div>

          {car.features.length > 0 && (
            <div className="mt-10">
              <SectionLabel>Features</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {car.features.map((f) => (
                  <Badge key={f} tone="neutral">
                    {f}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10">
            <SectionLabel>Rates</SectionLabel>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {car.rates.hourly && (
                <Rate label="Hourly" value={formatNaira(car.rates.hourly)} />
              )}
              <Rate
                label="Daily"
                value={formatNaira(car.rates.daily)}
                highlight
              />
              {car.rates.weekly && (
                <Rate label="Weekly" value={formatNaira(car.rates.weekly)} />
              )}
              {car.rates.monthly && (
                <Rate label="Monthly" value={formatNaira(car.rates.monthly)} />
              )}
              {car.rates.with_driver_daily && (
                <Rate
                  label="With driver"
                  value={`${formatNaira(car.rates.with_driver_daily)}/day`}
                />
              )}
            </div>
          </div>
        </div>

        <aside>
          <CarBookingWidget car={car} />
        </aside>
      </div>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4">
      <p className="text-[11px] uppercase tracking-wider text-[var(--color-text-faint)]">
        {label}
      </p>
      <p className="mt-1 font-semibold capitalize">{value}</p>
    </div>
  );
}

function Rate({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-4 border ${highlight ? "border-[var(--color-sylarm-red)]/40 bg-[var(--color-sylarm-red)]/8" : "border-[var(--color-border)] bg-[var(--color-card)]"}`}
    >
      <p className="text-[11px] uppercase tracking-wider text-[var(--color-text-faint)]">
        {label}
      </p>
      <p className="mt-1 font-display font-bold text-lg">{value}</p>
    </div>
  );
}
