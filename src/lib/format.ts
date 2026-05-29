const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export function formatNaira(amount: number): string {
  return nairaFormatter.format(amount);
}

export function formatDate(input: string | Date): string {
  const date = typeof input === "string" ? new Date(input) : input;
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatDateOnly(input: string | Date): string {
  const date = typeof input === "string" ? new Date(input) : input;
  return new Intl.DateTimeFormat("en-NG", { dateStyle: "medium" }).format(date);
}

export function classNames(
  ...parts: Array<string | undefined | null | false>
): string {
  return parts.filter(Boolean).join(" ");
}
