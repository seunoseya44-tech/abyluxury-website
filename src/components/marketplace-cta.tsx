import Image from "next/image";
import { ButtonLink, SectionLabel } from "@/components/ui";
import { classNames } from "@/lib/format";

export function MarketplaceCta({
  image,
  eyebrow,
  title,
  body,
  ctaLabel,
  ctaHref,
  reverse = false,
}: {
  image: string;
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  reverse?: boolean;
}) {
  return (
    <div className="grid items-center gap-8 lg:gap-12 lg:grid-cols-2">
      <div className={classNames("relative", reverse && "lg:order-2")}>
        <div className="absolute -inset-3 -z-10 bg-[var(--color-sylarm-red)]/10 blur-3xl rounded-full" />
        <div className="relative aspect-[3/2] rounded-3xl overflow-hidden border border-[var(--color-border)] shadow-[0_30px_60px_-20px_rgba(16,19,28,0.25)]">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
      <div className={classNames(reverse && "lg:order-1")}>
        <SectionLabel>{eyebrow}</SectionLabel>
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight">{title}</h2>
        <p className="mt-4 text-lg text-[var(--color-text-muted)] leading-relaxed">{body}</p>
        <ButtonLink href={ctaHref} size="lg" className="mt-7">
          {ctaLabel}
        </ButtonLink>
      </div>
    </div>
  );
}
