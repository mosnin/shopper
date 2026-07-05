"use client";

import { motion } from "motion/react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { TextFlip } from "@/components/text-flip";

const easeOut = [0.16, 1, 0.3, 1] as const;

// Why Shopper vs the shopping MCPs bolted onto LLM providers. Four plain reasons.
const pillars = [
  {
    n: "01",
    title: "Structure, not link dumps",
    body: "Bolted-on shopping MCPs return links and forget them. Shopper returns typed finds with price, seller, and source, saved into lists your agent can query, update, and check off.",
  },
  {
    n: "02",
    title: "A real engine underneath",
    body: "52 tools backed by a real shopping engine: web-wide hunts, local stores, deep browser sessions for marketplaces and forums, and seller vetting against public registries.",
  },
  {
    n: "03",
    title: "It keeps watching",
    body: "Stateless MCPs stop when the session ends. Radar runs standing scans 24/7 and drops matches into your wish list, so your agent wakes up to finds instead of starting over.",
  },
  {
    n: "04",
    title: "A wallet of its own",
    body: "With x402, your agent buys its own credits and plans in USDC over HTTP 402, no human in the loop. No provider's bolted-on shopping tool lets an agent fund its own work.",
  },
];

export function WhyShopperSection() {
  return (
    <section id="why" className="relative scroll-mt-24 bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-primary">Why Shopper</p>
          <h2 className="font-brand mt-3 flex flex-wrap items-baseline justify-center gap-x-2 text-3xl text-foreground sm:text-4xl lg:text-5xl">
            <span>Built for</span>
            <TextFlip
              as={motion.span}
              interval={1.9}
              className="text-gradient-orange"
            >
              {["agents.", "state.", "watching.", "operators."]}
            </TextFlip>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            The shopping MCPs bolted onto LLM providers are stateless link
            dumps: no lists, no watching, no memory. Shopper is structure, an
            engine, standing scans, and a wallet in one system: an order of
            magnitude more. And the data is yours: exportable, never resold.
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
