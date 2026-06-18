import type { Metadata } from "next";
import { DM_Sans, Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { getSiteSettings } from "@/lib/settings";

const inter = Inter({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/** Make a possibly-relative asset path absolute against the site URL. */
function absUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  const brand = s.brand_name || "Aby Luxury Car Rentals";
  const title = s.seo.title || `${brand} — Premium Car Rental in Abuja`;
  const description =
    s.seo.description ||
    "Premium car rentals, verified chauffeurs, airport transfers and corporate hire across Abuja.";
  const keywords = s.seo.keywords
    ? s.seo.keywords.split(",").map((k) => k.trim()).filter(Boolean)
    : undefined;
  const ogImage = absUrl(s.seo.og_image) || absUrl(s.logos.landscape);

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s · ${brand}` },
    description,
    applicationName: brand,
    authors: [{ name: brand }],
    keywords,
    icons: { icon: s.logos.square || "/brand/logo-square.png" },
    robots: s.seo.indexable
      ? { index: true, follow: true }
      : { index: false, follow: false },
    alternates: { canonical: SITE_URL },
    openGraph: {
      type: "website",
      title,
      description,
      siteName: brand,
      locale: "en_NG",
      url: SITE_URL,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: s.seo.twitter_handle ? `@${s.seo.twitter_handle.replace(/^@/, "")}` : undefined,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();
  const brand = settings.brand_color || "#c3a537";
  const secondary = settings.secondary_color || "#000000";
  const brandName = settings.brand_name || "Aby Luxury Car Rentals";
  const ga = settings.seo.google_analytics_id;

  // Override theme tokens with the admin-chosen brand colours. The "light"
  // variant is darkened (not lightened) so gold stays legible as text on white.
  const brandStyle = `:root{--color-sylarm-red:${brand};--color-sylarm-red-light:color-mix(in srgb, ${brand} 76%, black);--color-secondary:${secondary};}`;

  // Organization structured data for rich search results.
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brandName,
    url: SITE_URL,
    logo: absUrl(settings.logos.landscape),
    description: settings.about_text || undefined,
    email: settings.contact_email || undefined,
    telephone: settings.contact_phone || undefined,
    address: settings.address
      ? {
          "@type": "PostalAddress",
          streetAddress: settings.address,
          addressLocality: "Abuja",
          addressCountry: "NG",
        }
      : undefined,
    sameAs: [
      settings.socials.facebook,
      settings.socials.instagram,
      settings.socials.x,
      settings.socials.tiktok,
    ].filter(Boolean),
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${dmSans.variable} ${jetbrains.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <style dangerouslySetInnerHTML={{ __html: brandStyle }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        {ga && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga}');`}
            </Script>
          </>
        )}
        <AuthProvider>
          <SiteHeader logo={settings.logos.landscape} brandName={brandName} />
          <main className="flex-1">{children}</main>
          <SiteFooter settings={settings} />
          <WhatsAppFloat number={settings.socials.whatsapp} />
        </AuthProvider>
      </body>
    </html>
  );
}
