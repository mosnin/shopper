import { cn } from "@/lib/utils";

/**
 * The Shopper logo: a shopping-bag mark drawn inline as SVG. It inherits
 * `currentColor`, so it renders dark-brown on the cream theme and cream on
 * dark surfaces without swapping assets. Size comes from `className`
 * (set height + width, e.g. "h-7 w-7").
 */
export function LogoMark({ className }: { className?: string; priority?: boolean }) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label="Shopper"
      className={cn("inline-block select-none text-primary", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={4.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 22 H50 L47.4 51 A4 4 0 0 1 43.4 54.5 H20.6 A4 4 0 0 1 16.6 51 L14 22 Z" />
      <path d="M23.5 22 V17.5 A8.5 8.5 0 0 1 40.5 17.5 V22" />
    </svg>
  );
}
