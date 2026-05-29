"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Select } from "@/components/ui";

const types = [
  { v: "", l: "All types" },
  { v: "sedan", l: "Sedan" },
  { v: "suv", l: "SUV" },
  { v: "luxury", l: "Luxury" },
  { v: "pickup", l: "Pickup" },
  { v: "van", l: "Van" },
  { v: "minivan", l: "Minivan" },
  { v: "sports", l: "Sports" },
];

const seats = [
  { v: "", l: "Any" },
  { v: "2", l: "2+" },
  { v: "4", l: "4+" },
  { v: "5", l: "5+" },
  { v: "7", l: "7+" },
];

const prices = [
  { v: "", l: "Any price" },
  { v: "25000", l: "From ₦25k/day" },
  { v: "50000", l: "From ₦50k/day" },
  { v: "100000", l: "From ₦100k/day" },
];

export function CarFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      next.delete("page");
      router.push(`/cars?${next.toString()}`);
    },
    [params, router],
  );

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Select
        label="Type"
        value={params.get("type") ?? ""}
        onChange={(e) => updateParam("type", e.target.value)}
      >
        {types.map((t) => (
          <option key={t.v} value={t.v}>
            {t.l}
          </option>
        ))}
      </Select>
      <Select
        label="Seats"
        value={params.get("min_seats") ?? ""}
        onChange={(e) => updateParam("min_seats", e.target.value)}
      >
        {seats.map((t) => (
          <option key={t.v} value={t.v}>
            {t.l}
          </option>
        ))}
      </Select>
      <Select
        label="Price"
        value={params.get("min_price") ?? ""}
        onChange={(e) => updateParam("min_price", e.target.value)}
      >
        {prices.map((t) => (
          <option key={t.v} value={t.v}>
            {t.l}
          </option>
        ))}
      </Select>
      <Select
        label="Tier"
        value={
          params.get("vip_only")
            ? "vip"
            : params.get("featured_only")
              ? "featured"
              : ""
        }
        onChange={(e) => {
          const next = new URLSearchParams(params.toString());
          next.delete("vip_only");
          next.delete("featured_only");
          next.delete("page");
          if (e.target.value === "vip") next.set("vip_only", "1");
          if (e.target.value === "featured") next.set("featured_only", "1");
          router.push(`/cars?${next.toString()}`);
        }}
      >
        <option value="">All cars</option>
        <option value="featured">Featured</option>
        <option value="vip">VIP / Luxury</option>
      </Select>
    </div>
  );
}
