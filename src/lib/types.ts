export type Role = "customer" | "driver" | "fleet_owner" | "manager" | "admin";

export type SiteSettings = {
  brand_name: string;
  brand_color: string;
  secondary_color: string;
  logos: {
    landscape: string | null;
    square: string | null;
    white: string | null;
  };
  about_text: string | null;
  address: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  socials: {
    facebook: string | null;
    x: string | null;
    tiktok: string | null;
    instagram: string | null;
    whatsapp: string | null;
  };
  apps: { ios: string | null; android: string | null };
  bank: {
    name: string | null;
    account_number: string | null;
    account_name: string | null;
  };
  seo: {
    title: string | null;
    description: string | null;
    keywords: string | null;
    og_image: string | null;
    twitter_handle: string | null;
    google_analytics_id: string | null;
    indexable: boolean;
  };
};

export type FleetSummary = {
  total_vehicles: number;
  active_vehicles: number;
  pending_vehicles: number;
  total_earnings: number;
  pending_earnings: number;
};

export type FleetVehicle = {
  id: number;
  status: string;
  owner_percentage: number;
  agreed_daily_rate: number | null;
  contract_start_date: string | null;
  insurance_provider: string | null;
  total_earnings: number;
  car?: {
    id: number;
    name: string;
    plate_number: string;
    status: string;
    daily_rate: number;
    total_bookings: number;
    primary_image: string | null;
  };
  created_at: string;
};

export type FleetPayout = {
  id: number;
  period_start: string | null;
  period_end: string | null;
  gross_revenue: number;
  owner_share: number;
  platform_share: number;
  status: string;
  paid_at: string | null;
  vehicle?: { id: number; car_name: string | null };
};

export type CarSale = {
  id: number;
  title: string;
  slug: string;
  brand: string;
  model: string;
  year: number;
  condition: "brand_new" | "foreign_used" | "nigerian_used";
  mileage: number | null;
  color: string | null;
  transmission: string;
  fuel_type: string;
  price: number;
  negotiable: boolean;
  description: string | null;
  features: string[];
  images: string[];
  primary_image: string | null;
  location: string;
  status: string;
  is_featured: boolean;
  created_at: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  avatar: string | null;
  address: string | null;
  wallet_balance: number;
  referral_code: string | null;
  is_active: boolean;
  email_verified: boolean;
  phone_verified: boolean;
  created_at: string;
};

export type CarSummary = {
  id: number;
  name: string;
  slug: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  transmission: string;
  fuel_type: string;
  seats: number;
  color: string | null;
  daily_rate: number;
  with_driver_rate: number | null;
  is_vip: boolean;
  is_featured: boolean;
  status: string;
  rating: number;
  total_bookings: number;
  current_location: string;
  primary_image: string | null;
};

export type CarImage = {
  id: number;
  url: string;
  is_primary: boolean;
  display_order: number;
};

export type Faq = {
  id: number;
  question: string;
  answer: string;
  sort_order: number;
};

export type CarDetail = CarSummary & {
  plate_number?: string;
  description: string | null;
  phone_number: string | null;
  whatsapp_number: string | null;
  rates: {
    hourly: number | null;
    daily: number;
    weekly: number | null;
    monthly: number | null;
    with_driver_daily: number | null;
  };
  available_for_self_drive: boolean;
  available_for_chauffeur: boolean;
  features: string[];
  images: CarImage[];
  reviews_count?: number;
};

export type BookingType =
  | "self_drive"
  | "with_chauffeur"
  | "airport_pickup"
  | "airport_dropoff"
  | "tourism"
  | "event"
  | "corporate";

export type RatePeriod = "hourly" | "daily" | "weekly" | "monthly";

export type BookingStatus =
  | "pending_payment"
  | "confirmed"
  | "driver_assigned"
  | "driver_en_route"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show";

export type Quote = {
  base_amount: number;
  driver_fee: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  duration: number;
  duration_unit: RatePeriod;
  promo_code_id: number | null;
};

export type Booking = {
  id: number;
  booking_ref: string;
  status: BookingStatus;
  payment_status: "pending" | "paid" | "partial" | "refunded" | "failed";
  booking_type: BookingType;
  rate_period: RatePeriod;
  pickup_at: string;
  return_at: string;
  pickup_location: string;
  dropoff_location: string | null;
  pricing: {
    base_amount: number;
    driver_fee: number;
    discount_amount: number;
    tax_amount: number;
    total_amount: number;
  };
  customer_notes: string | null;
  cancellation_reason: string | null;
  can_review?: boolean;
  reviewed?: boolean | null;
  car?: CarSummary;
  driver?: {
    id: number;
    name: string;
    phone: string | null;
    avatar: string | null;
    rating: number;
  } | null;
  created_at: string;
};

export type Paginated<T> = {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
};
