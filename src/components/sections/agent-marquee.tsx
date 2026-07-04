"use client";

import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

// A friendly scrolling row: where Shopper looks, what it does, and the AI
// assistants it works with. Rendered as wordmarks in the brand face so the
// wall stays legible in both light and dark mode.
const items = [
  { id: "every-store", name: "Every store" },
  { id: "marketplaces", name: "Marketplaces" },
  { id: "local-sellers", name: "Local sellers" },
  { id: "price-tracking", name: "Price tracking" },
  { id: "deal-alerts", name: "Deal alerts" },
  { id: "chatgpt", name: "ChatGPT" },
  { id: "claude", name: "Claude" },
  { id: "gemini", name: "Gemini" },
  { id: "any-ai", name: "and any AI assistant" },
];

export function AgentMarquee() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          Searches everywhere you shop, and works with the AI assistants you already use
        </p>
      </div>

      <div className="relative mt-8 h-[72px] w-full overflow-hidden">
        <InfiniteSlider className="flex h-full w-full items-center" duration={40} gap={64}>
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-center">
              <span className="whitespace-nowrap font-brand text-xl text-foreground/60 transition-colors duration-300 hover:text-foreground sm:text-2xl">
                {item.name}
              </span>
            </div>
          ))}
        </InfiniteSlider>

        <ProgressiveBlur
          className="pointer-events-none absolute left-0 top-0 h-full w-[120px] sm:w-[200px]"
          direction="left"
          blurIntensity={1}
        />
        <ProgressiveBlur
          className="pointer-events-none absolute right-0 top-0 h-full w-[120px] sm:w-[200px]"
          direction="right"
          blurIntensity={1}
        />
      </div>
    </section>
  );
}
