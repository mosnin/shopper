"use client";

import { motion } from "motion/react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { TextFlip } from "@/components/text-flip";

const easeOut = [0.16, 1, 0.3, 1] as const;

// The moat: everyone else owns one of these. Shopper is all four as one system.
const pillars = [
  {
    n: "01",
    title: "Structured lists",
    body: "Wish lists, shopping lists, and About You as typed records, not links lost in a chat scroll. Deduped and validated on the way in, exportable on the way out.",
  },
  {
    n: "02",
    title: "A real UI",
    body: "You can see, edit, and check off exactly what your agent found and saved. No black box, no scrolling back through a conversation.",
  },
  {
    n: "03",
    title: "A real shopping engine",
    body: "Exa, Firecrawl, and Tavily powered search and scraping, plus a Browserbase browser for the hard sites. First-class tools, orchestrated into real listings from real sellers.",
  },
  {
    n: "04",
    title: "Agent-native by default",
    body: "A secure MCP surface and per-user keys mean your agent shops directly, through the same layer the app uses. Any client, one engine.",
  },
];

export function WhyShopperSection() {
  return (
    <section id="why" className="relative scroll-mt-24 bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-primary">Why Shopper</p>
          <h2 className="font-brand mt-3 flex flex-wrap items-baseline justify-center gap-x-2 text-3xl text-foreground sm:text-4xl lg:text-5xl">
            <span>Shopper owns</span>
            <TextFlip
              as={motion.span}
              interval={1.9}
              className="text-gradient-orange"
            >
              {["structure.", "the UI.", "the engine.", "all four."]}
            </TextFlip>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            The shopping MCPs bolted onto LLM providers dump links and forget.
            Deal sites only see their own inventory. Shopper is structure, UI,
            a real shopping engine, and agent-native access, as one system, an
            order of magnitude better than a bolt-on. Your data stays owned and
            exportable.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08, ease: easeOut }}
              className="h-full"
            >
              <SpotlightCard className="h-full p-6">
                <span className="font-brand text-3xl text-primary tabular-nums">{pillar.n}</span>
                <h3 className="font-brand mt-3 text-xl text-foreground">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pillar.body}</p>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
