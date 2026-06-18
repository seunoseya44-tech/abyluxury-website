import { apiFetch } from "@/lib/api";
import type { SiteSettings } from "@/lib/types";

const FALLBACK: SiteSettings = {
  brand_name: "Aby Luxury Car Rentals",
  brand_color: "#c3a537",
  secondary_color: "#000000",
  logos: {
    landscape: "/brand/logo-landscape.png",
    square: "/brand/logo-square.png",
    white: "/brand/logo-white.png",
  },
  about_text:
    "Aby Luxury Car Rentals is Abuja's premium car rental and mobility platform — verified vehicles, professional chauffeurs, and transparent pricing, all in one place.",
  address: "Wuse 2, Abuja, FCT, Nigeria",
  contact_phone: "+234 800 000 0000",
  contact_email: "hello@abyluxurycars.ng",
  socials: { facebook: null, x: null, tiktok: null, instagram: null, whatsapp: null },
  apps: { ios: null, android: null },
  bank: { name: null, account_number: null, account_name: null },
  seo: {
    title: "Aby Luxury Car Rentals — Premium Car Rental & Chauffeurs in Abuja",
    description:
      "Rent premium and luxury cars in Abuja with verified vehicles, professional chauffeurs, airport transfers and transparent pricing.",
    keywords:
      "car rental Abuja, luxury car hire Nigeria, chauffeur Abuja, airport pickup Abuja, buy car Abuja, sell car Nigeria",
    og_image: "/brand/logo-landscape.png",
    twitter_handle: null,
    google_analytics_id: null,
    indexable: true,
  },
};

/** Server-side fetch of public site settings (revalidated every 60s). */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const s = await apiFetch<SiteSettings>("v1/settings", {
      cache: "no-store",
    });
    return {
      ...FALLBACK,
      ...s,
      logos: { ...FALLBACK.logos, ...s.logos },
      socials: { ...FALLBACK.socials, ...s.socials },
      apps: { ...FALLBACK.apps, ...s.apps },
      bank: { ...FALLBACK.bank, ...s.bank },
      seo: { ...FALLBACK.seo, ...s.seo },
    };
  } catch {
    return FALLBACK;
  }
}

/** Normalise a WhatsApp value (number or link) into a wa.me URL. */
export function whatsappUrl(value: string | null): string | null {
  if (!value) return null;
  if (value.startsWith("http")) return value;
  const digits = value.replace(/[^0-9]/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}
