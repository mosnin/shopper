import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";

/**
 * A framed image slot for the marketing site. Pass `src` to show a real photo
 * (royalty-free Unsplash shots are used across the site); omit it to render a
 * labelled placeholder so the layout still reads finished before art is added.
 */
export function ImagePlaceholder({
  label = "Image",
  src,
  className,
  aspect = "aspect-[4/3]",
}: {
  /** Short note about the slot, and the image's alt text when `src` is set. */
  label?: string;
  /** Real image URL. When set, the photo renders instead of the placeholder. */
  src?: string;
  className?: string;
  /** Tailwind aspect-ratio utility for the frame. */
  aspect?: string;
}) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-3xl border border-border bg-card/60",
        !src && "border-dashed",
        aspect,
        className,
      )}
    >
      {src ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={label}
            loading="lazy"
            className="h-full w-full object-cover"
            draggable={false}
          />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/10" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.08),transparent_60%)]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageIcon className="h-6 w-6 opacity-60" aria-hidden />
            <span className="text-xs uppercase tracking-[0.2em]">{label}</span>
          </div>
        </>
      )}
    </div>
  );
}
