"use client";

import { motion } from "motion/react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { TextFlip } from "@/components/text-flip";

const easeOut = [0.16, 1, 0.3, 1] as const;

// Why Shopper: built for shopping, not a chat that forgets. Four plain reasons.
const pillars = [
  {
    n: "01",
    title: "Built for shopping",
    body: "This is not a chat window that forgets what you asked. Shopper is made to find things to buy, compare prices, and help you decide, and it does that one job really well.",
  },
  {
    n: "02",
    title: "Lists you can see and own",
    body: "See, edit, and check off exactly what Shopper found and saved. Everything lives in real lists you control, not buried in a conversation you have to scroll back through.",
  },
  {
    n: "03",
    title: "It searches everywhere",
    body: "Shopper looks across stores, marketplaces, and local sellers, and opens a real browser for the tricky sites, so you get real listings from real sellers, not a page of ads.",
  },
  {
    n: "04",
    title: "It never stops watching",
    body: "Prices tracked and deals flagged long after you close the tab. Shopper keeps working in the background so you never overpay and never miss the drop.",
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
              {["shopping.", "your lists.", "good deals.", "you."]}
            </TextFlip>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A basic AI chat dumps a few links and forgets. Deal sites only show
            their own stock. Shopper searches everywhere, keeps your lists,
            tracks prices, and watches for deals, all in one place. And the data
            is yours to keep and export.
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
