"use client";

import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

// A scrolling row: the agents that plug in over MCP and what they get.
// Rendered as wordmarks in the brand face so the wall stays legible in both
// light and dark mode.
const items = [
  { id: "claude-code", name: "Claude Code" },
  { id: "cursor", name: "Cursor" },
  { id: "codex", name: "Codex" },
  { id: "openclaw", name: "OpenClaw" },
  { id: "hermes", name: "Hermes" },
  { id: "mcp", name: "any MCP client" },
  { id: "tools", name: "52 tools" },
  { id: "radar", name: "Radar 24/7" },
  { id: "deep-browser", name: "Deep browser" },
  { id: "usdc", name: "USDC-native" },
];

export function AgentMarquee() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          One MCP endpoint. Every agent you run becomes a shopper.
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
