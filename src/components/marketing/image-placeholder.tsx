import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";

/**
 * A decorative-image placeholder for the logged-out site. Drop a real image in
 * later by replacing the component with an <Image>; until then it holds the
 * layout with an on-brand frame so the page reads finished.
 */
export function ImagePlaceholder({
  label = "Image",
  className,
  aspect = "aspect-[4/3]",
}: {
  /** Short note about what should eventually live here, e.g. "Hero visual". */
  label?: string;
  className?: string;
  /** Tailwind aspect-ratio utility for the frame. */
  aspect?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative w-full overflow-hidden rounded-3xl border border-dashed border-border bg-card/60",
        aspect,
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.08),transparent_60%)]" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
        <ImageIcon className="h-6 w-6 opacity-60" />
        <span className="text-xs uppercase tracking-[0.2em]">{label}</span>
      </div>
    </div>
  );
}
