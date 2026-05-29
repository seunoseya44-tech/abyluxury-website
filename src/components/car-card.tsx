import Link from "next/link";
import { Badge } from "@/components/ui";
import { CarImage } from "@/components/car-image";
import { formatNaira } from "@/lib/format";
import type { CarSummary } from "@/lib/types";

export function CarCard({ car }: { car: CarSummary }) {
  return (
    <Link
      href={`/cars/${car.id}`}
      className="group block bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden hover:border-[var(--color-sylarm-red)]/40 transition-all hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] bg-[var(--color-bg-3)] overflow-hidden">
        <CarImage
          src={car.primary_image}
          alt={car.name}
          brand={car.brand}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {car.is_vip && <Badge tone="red" overlay>VIP</Badge>}
          {car.is_featured && !car.is_vip && <Badge tone="red" overlay>Featured</Badge>}
          <Badge tone="neutral" overlay>{car.type}</Badge>
        </div>
        <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur text-xs font-semibold flex items-center gap-1.5 text-[var(--color-warning)]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          {car.rating.toFixed(1)}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display font-bold text-lg leading-tight truncate">
              {car.name}
            </h3>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              {car.transmission} · {car.fuel_type} · {car.seats} seats
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-xs text-[var(--color-text-faint)] uppercase tracking-wider">
              From
            </p>
            <p className="font-display font-extrabold text-xl text-[var(--color-text)]">
              {formatNaira(car.daily_rate)}
              <span className="text-xs font-medium text-[var(--color-text-muted)] ml-1">
                / day
              </span>
            </p>
          </div>
          <span className="text-xs font-semibold text-[var(--color-sylarm-red-light)] group-hover:translate-x-1 transition-transform">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}
