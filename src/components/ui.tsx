import Link from "next/link";
import { classNames } from "@/lib/format";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "white"
  | "onColor";
type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-sylarm-red)] text-[var(--color-on-brand)] font-semibold hover:bg-[var(--color-sylarm-red-light)] shadow-[0_8px_24px_-8px_rgba(195,165,55,0.6)]",
  secondary:
    "bg-[var(--color-card)] text-[var(--color-text)] border border-[var(--color-border-strong)] hover:border-[var(--color-sylarm-red)]/50",
  ghost:
    "text-[var(--color-text)] hover:bg-[var(--color-subtle)]",
  outline:
    "border border-[var(--color-sylarm-red)]/40 text-[var(--color-sylarm-red)] hover:bg-[var(--color-sylarm-red)]/10",
  // For use on dark / red bands:
  white:
    "bg-white text-[var(--color-on-brand)] font-semibold hover:bg-white/90 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]",
  onColor:
    "border border-white/45 text-white hover:bg-white/12",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm rounded-lg",
  md: "h-11 px-5 text-sm rounded-xl",
  lg: "h-12 px-6 text-base rounded-xl",
};

const baseButton =
  "inline-flex items-center justify-center font-semibold transition-all disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap gap-2";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={classNames(
        baseButton,
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
    />
  );
}

type ButtonLinkProps = React.ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link
      {...rest}
      className={classNames(
        baseButton,
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
    />
  );
}

export function Badge({
  children,
  tone = "neutral",
  overlay = false,
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "red" | "green" | "gold" | "blue" | "purple";
  /** Solid, high-contrast styling for badges placed over photos. */
  overlay?: boolean;
  className?: string;
}) {
  const tones: Record<typeof tone, string> = {
    neutral:
      "bg-[var(--color-subtle)] text-[var(--color-text-muted)] border border-[var(--color-border)]",
    red:
      "bg-[var(--color-sylarm-red)]/12 text-[var(--color-sylarm-red)] border border-[var(--color-sylarm-red)]/35",
    green:
      "bg-[var(--color-success)]/12 text-[var(--color-success)] border border-[var(--color-success)]/35",
    gold:
      "bg-[var(--color-warning)]/12 text-[var(--color-warning)] border border-[var(--color-warning)]/35",
    blue:
      "bg-[var(--color-info)]/12 text-[var(--color-info)] border border-[var(--color-info)]/35",
    purple:
      "bg-[var(--color-purple)]/12 text-[var(--color-purple)] border border-[var(--color-purple)]/35",
  };
  // Solid backgrounds + white text so tags stay readable on top of any image.
  const overlayTones: Record<typeof tone, string> = {
    neutral: "bg-black/70 text-white border border-white/15 backdrop-blur-sm",
    red: "bg-[var(--color-sylarm-red)] text-white border border-black/10 shadow-sm",
    green: "bg-[var(--color-success)] text-white border border-black/10",
    gold: "bg-[var(--color-warning)] text-white border border-black/10",
    blue: "bg-[var(--color-info)] text-white border border-black/10",
    purple: "bg-[var(--color-purple)] text-white border border-black/10",
  };
  return (
    <span
      className={classNames(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider",
        (overlay ? overlayTones : tones)[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="h-px flex-1 max-w-[2.5rem] bg-[var(--color-sylarm-red)]" />
      <span className="text-xs font-bold tracking-[0.25em] uppercase text-[var(--color-sylarm-red-light)]">
        {children}
      </span>
    </div>
  );
}

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={classNames(
        "bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Input(
  props: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string; error?: string },
) {
  const { label, hint, error, className, id, ...rest } = props;
  const inputId = id ?? rest.name;
  return (
    <label className="block">
      {label && (
        <span className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
          {label}
        </span>
      )}
      <input
        id={inputId}
        {...rest}
        className={classNames(
          "w-full h-11 px-4 rounded-xl bg-[var(--color-bg-3)] border border-[var(--color-border-strong)] text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] focus:outline-none focus:border-[var(--color-sylarm-red)] focus:ring-4 focus:ring-[var(--color-sylarm-red)]/15 transition",
          error && "border-[var(--color-sylarm-red)]",
          className,
        )}
      />
      {error ? (
        <span className="block mt-1.5 text-xs text-[var(--color-sylarm-red-light)]">{error}</span>
      ) : hint ? (
        <span className="block mt-1.5 text-xs text-[var(--color-text-faint)]">{hint}</span>
      ) : null}
    </label>
  );
}

export function Select({
  label,
  hint,
  error,
  className,
  id,
  children,
  ...rest
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  hint?: string;
  error?: string;
}) {
  const selectId = id ?? rest.name;
  return (
    <label className="block">
      {label && (
        <span className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
          {label}
        </span>
      )}
      <select
        id={selectId}
        {...rest}
        className={classNames(
          "w-full h-11 px-4 rounded-xl bg-[var(--color-bg-3)] border border-[var(--color-border-strong)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-sylarm-red)] focus:ring-4 focus:ring-[var(--color-sylarm-red)]/15 transition appearance-none cursor-pointer",
          error && "border-[var(--color-sylarm-red)]",
          className,
        )}
      >
        {children}
      </select>
      {error ? (
        <span className="block mt-1.5 text-xs text-[var(--color-sylarm-red-light)]">{error}</span>
      ) : hint ? (
        <span className="block mt-1.5 text-xs text-[var(--color-text-faint)]">{hint}</span>
      ) : null}
    </label>
  );
}

export function Textarea({
  label,
  hint,
  error,
  className,
  id,
  ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hint?: string;
  error?: string;
}) {
  const inputId = id ?? rest.name;
  return (
    <label className="block">
      {label && (
        <span className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
          {label}
        </span>
      )}
      <textarea
        id={inputId}
        {...rest}
        className={classNames(
          "w-full min-h-[120px] p-4 rounded-xl bg-[var(--color-bg-3)] border border-[var(--color-border-strong)] text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] focus:outline-none focus:border-[var(--color-sylarm-red)] focus:ring-4 focus:ring-[var(--color-sylarm-red)]/15 transition resize-y",
          error && "border-[var(--color-sylarm-red)]",
          className,
        )}
      />
      {error ? (
        <span className="block mt-1.5 text-xs text-[var(--color-sylarm-red-light)]">{error}</span>
      ) : hint ? (
        <span className="block mt-1.5 text-xs text-[var(--color-text-faint)]">{hint}</span>
      ) : null}
    </label>
  );
}
