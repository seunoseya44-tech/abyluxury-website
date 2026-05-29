import { AppStoreBadge, GooglePlayBadge } from "@/components/store-badges";
import { SectionLabel } from "@/components/ui";
import type { SiteSettings } from "@/lib/types";

export function DownloadCta({ settings }: { settings: SiteSettings }) {
  const { android, ios } = settings.apps;

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
              {ios && <AppStoreBadge href={ios} />}
            </div>
            <p className="mt-3 text-xs text-[var(--color-text-faint)]">
              {android
                ? "Android APK · allow “install from unknown sources” when prompted."
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
