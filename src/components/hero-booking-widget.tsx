"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Select } from "@/components/ui";

function todayPlusDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function HeroBookingWidget() {
  const router = useRouter();
  const [bookingType, setBookingType] = useState("self_drive");
  const [pickup, setPickup] = useState(todayPlusDays(2));
  const [ret, setRet] = useState(todayPlusDays(5));
  const [location, setLocation] = useState("Abuja");

  function search(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("pickup", pickup);
    params.set("return", ret);
    params.set("type_intent", bookingType);
    params.set("location", location);
    router.push(`/cars?${params.toString()}`);
  }

  return (
    <form
      onSubmit={search}
      className="bg-[var(--color-card)]/90 backdrop-blur border border-[var(--color-border-strong)] rounded-2xl p-4 sm:p-5 shadow-2xl grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1fr_1fr_auto]"
    >
      <Select
        label="What do you need"
        value={bookingType}
        onChange={(e) => setBookingType(e.target.value)}
      >
        <option value="self_drive">Self-drive rental</option>
        <option value="with_chauffeur">With chauffeur</option>
        <option value="airport_pickup">Airport pickup</option>
        <option value="airport_dropoff">Airport drop-off</option>
        <option value="event">Event / wedding</option>
        <option value="corporate">Corporate hire</option>
      </Select>

      <Select
        label="City"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      >
        <option value="Abuja">Abuja</option>
        <option value="Lagos" disabled>
          Lagos (coming soon)
        </option>
      </Select>

      <Select
        label="Pickup date"
        value={pickup}
        onChange={(e) => setPickup(e.target.value)}
      >
        {Array.from({ length: 14 }).map((_, i) => {
          const v = todayPlusDays(i + 1);
          return (
            <option key={v} value={v}>
              {new Date(v).toLocaleDateString("en-NG", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </option>
          );
        })}
      </Select>

      <Select
        label="Return date"
        value={ret}
        onChange={(e) => setRet(e.target.value)}
      >
        {Array.from({ length: 30 }).map((_, i) => {
          const v = todayPlusDays(i + 2);
          return (
            <option key={v} value={v}>
              {new Date(v).toLocaleDateString("en-NG", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </option>
          );
        })}
      </Select>

      <div className="flex items-end">
        <Button type="submit" size="lg" className="w-full lg:w-auto h-11">
          Find cars
        </Button>
      </div>
    </form>
  );
}
