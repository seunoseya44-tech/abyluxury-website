// Marketing categories for rental cars. Must stay in sync with the backend
// Car::CATEGORIES constant (app/Models/Car.php).

export type CarCategory = {
  slug: string;
  label: string;
  /** Short tagline shown under the section heading. */
  tagline: string;
};

export const CAR_CATEGORIES: CarCategory[] = [
  {
    slug: "economy",
    label: "Economy",
    tagline: "Affordable, fuel-efficient rides for everyday trips.",
  },
  {
    slug: "executive",
    label: "Executive",
    tagline: "Sharp, comfortable sedans for business and city moves.",
  },
  {
    slug: "suv",
    label: "SUVs",
    tagline: "Space, power and presence for any road in Abuja.",
  },
  {
    slug: "luxury",
    label: "Luxury",
    tagline: "Premium marques for those who travel in style.",
  },
  {
    slug: "wedding",
    label: "Wedding Cars",
    tagline: "Make the big day unforgettable with the perfect car.",
  },
  {
    slug: "corporate",
    label: "Corporate Fleet",
    tagline: "Reliable fleet packages for organisations and events.",
  },
];

export function getCategory(slug: string): CarCategory | undefined {
  return CAR_CATEGORIES.find((c) => c.slug === slug);
}
