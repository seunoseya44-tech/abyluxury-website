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

        <aside className="space-y-4">
          <CarBookingWidget car={car} />
          <CarContactButtons car={car} />
        </aside>
      </div>
    </div>
  );
}

function CarContactButtons({ car }: { car: CarDetail }) {
  if (!car.phone_number && !car.whatsapp_number) return null;

  const waHref = car.whatsapp_number
    ? car.whatsapp_number.startsWith("http")
      ? car.whatsapp_number
      : `https://wa.me/${car.whatsapp_number.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi, I'm interested in renting the ${car.name}.`)}`
    : null;

  return (
    <div className="grid grid-cols-2 gap-3">
      {car.phone_number && (
        <a
          href={`tel:${car.phone_number}`}
          className="flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 text-sm font-semibold transition hover:border-[var(--color-sylarm-red)]/40 hover:bg-[var(--color-sylarm-red)]/5"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 shrink-0 text-[var(--color-sylarm-red)]" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25z" />
          </svg>
          Call Now
        </a>
      )}
      {waHref && (
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl border border-[#25D366]/40 bg-[#25D366]/8 px-4 py-3 text-sm font-semibold text-[#1a9e4d] transition hover:bg-[#25D366]/15"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.845L.057 23.617a.75.75 0 0 0 .924.924l5.82-1.471A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75A9.734 9.734 0 0 1 6.59 20.17l-.36-.214-3.733.944.96-3.648-.235-.376A9.718 9.718 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
          </svg>
          Chat on WhatsApp
        </a>
      )}
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
