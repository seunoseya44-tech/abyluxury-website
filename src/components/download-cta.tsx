import { GooglePlayBadge } from "@/components/store-badges";
import { SectionLabel } from "@/components/ui";
import { whatsappUrl } from "@/lib/settings";
import type { SiteSettings } from "@/lib/types";

export function DownloadCta({ settings }: { settings: SiteSettings }) {
  const { android, ios } = settings.apps;
  const notifyMessage =
    "Hi! Please notify me when the iOS (iPhone) Aby Luxury app is available on the App Store.";
  const wa = whatsappUrl(settings.socials.whatsapp);
  // Prefer WhatsApp if configured, otherwise fall back to email.
  const notifyHref = wa
    ? `${wa}?text=${encodeURIComponent(notifyMessage)}`
    : settings.contact_email
      ? `mailto:${settings.contact_email}?subject=${encodeURIComponent("Notify me — iOS app")}&body=${encodeURIComponent(notifyMessage)}`
      : null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="section-dark relative overflow-hidden rounded-3xl p-10 sm:p-14">
        <div className="absolute inset-0 grid-noise opacity-30" />
        <div className="relative grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <SectionLabel>Get the app</SectionLabel>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight">
              Download the Aby Luxury app
            </h2>
            <p className="mt-4 text-lg text-[var(--color-text-muted)] max-w-xl">
              Book rides, track your driver, chat with support and manage everything on the go.
              Aby Luxury Car Rentals, in your pocket.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              {android ? (
                <a
                  href={android}
                  className="inline-flex items-center gap-2.5 rounded-xl bg-[var(--color-sylarm-red)] px-6 py-3.5 font-semibold text-[var(--color-on-brand)] shadow-[0_8px_24px_-8px_rgba(195,165,55,0.6)] hover:bg-[var(--color-sylarm-red-light)] transition"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12 3l4 4h-3v6h-2V7H8l4-4zM5 18h14v2H5v-2zm0-3h14v2H5v-2z" />
                  </svg>
                  Download for Android
                </a>
              ) : (
                <GooglePlayBadge href="#" />
              )}
              {ios ? (
                // Real App Store link once published.
                // eslint-disable-next-line @next/next/no-img-element
                <a
                  href={ios}
                  className="inline-flex items-center gap-2.5 rounded-xl border border-white/30 bg-white/5 px-5 py-3.5 font-semibold text-white hover:bg-white/10 transition"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M16.5 12.3c0-2.5 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.2.9-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.5 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.6-1-2.6-4zM14.1 4.8c.7-.8 1.1-1.9 1-3-.9 0-2.1.6-2.7 1.4-.6.7-1.2 1.9-1.1 3 .9.1 2.1-.5 2.8-1.4z" />
                  </svg>
                  Download for iOS
                </a>
              ) : (
                <a
                  href={notifyHref ?? "#"}
                  target={notifyHref?.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 rounded-xl border border-white/30 bg-white/5 px-5 py-3.5 font-semibold text-white/85 hover:text-white hover:bg-white/10 transition"
                  aria-label="Get notified when iOS app launches"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M16.5 12.3c0-2.5 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.2.9-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.5 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.6-1-2.6-4zM14.1 4.8c.7-.8 1.1-1.9 1-3-.9 0-2.1.6-2.7 1.4-.6.7-1.2 1.9-1.1 3 .9.1 2.1-.5 2.8-1.4z" />
                  </svg>
                  <span className="flex flex-col items-start leading-tight">
                    <span className="text-[10px] uppercase tracking-wider text-white/55">
                      Coming soon
                    </span>
                    <span className="text-sm">Notify me — iOS app</span>
                  </span>
                </a>
              )}
            </div>
            <p className="mt-3 text-xs text-[var(--color-text-faint)]">
              {android
                ? `Android APK · allow “install from unknown sources” when prompted.${ios ? "" : " iOS app launching on the App Store soon — tap the iOS button to be notified."}`
                : "Apps launching soon — links activate once published."}
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/phone-mockup.png"
              alt="Aby Luxury Car Rentals mobile app"
              className="h-72 sm:h-96 lg:h-[460px] w-auto object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.55)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
