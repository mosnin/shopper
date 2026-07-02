"use client";

import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

// The agents that plug into Shopper over MCP, and the engine underneath them.
// Rendered as wordmarks in the brand face so the wall stays legible in both
// light and dark mode without shipping a folder of third-party logos.
const items = [
  { id: "hermes", name: "Hermes" },
  { id: "openclaw", name: "OpenClaw" },
  { id: "codex", name: "Codex" },
  { id: "claude-code", name: "Claude Code" },
  { id: "cursor", name: "Cursor" },
  { id: "mcp", name: "MCP" },
  { id: "exa", name: "Exa" },
  { id: "firecrawl", name: "Firecrawl" },
  { id: "tavily", name: "Tavily" },
  { id: "browserbase", name: "Browserbase" },
];

export function AgentMarquee() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          Works with the agents you already run, on an engine built for the hunt
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
