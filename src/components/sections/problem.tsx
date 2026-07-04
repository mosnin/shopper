"use client";

import { motion } from "motion/react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { DotGridSpotlight } from "@/components/dot-grid-spotlight";

const easeOut = [0.16, 1, 0.3, 1] as const;

// The two sides of the same coin: shopping the hard way, and shopping with
// Shopper. No icons-in-boxes (design rule); the contrast carries the point.
const without = [
  "Twenty tabs open, comparing prices by hand",
  "You find a deal, then lose the link an hour later",
  "You forget what you were even looking for",
  "The price drops the day after you stop checking",
];
const withShopper = [
  "One place that searches every store for you",
  "Every option saved with its price and seller",
  "Wish lists and shopping lists you can check off",
  "It keeps watching and tells you when prices drop",
];

export function ProblemSection() {
  return (
    <section className="relative scroll-mt-24 overflow-hidden bg-background py-24 sm:py-32">
      {/* Cursor-lit dot field: quiet until you move through it. The canvas
          tracks its own mouse events, so it keeps pointer events; content
          sits above at z-10 and stays fully interactive. */}
      <DotGridSpotlight
        className="absolute inset-0 h-full w-full"
        dotColor="rgba(37, 99, 235, 0.10)"
        activeDotColor="rgba(37, 99, 235, 0.45)"
        spacing={26}
      />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-primary">The problem</p>
          <h2 className="font-brand mt-3 text-3xl text-foreground sm:text-4xl lg:text-5xl">
            Shopping online is a mess.{" "}
            <span className="text-gradient-orange">It doesn't have to be.</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Dozens of tabs, prices that never sit still, deals you miss, and a
            wish list scattered across a hundred sites. Shopper does the hunting
            for you and keeps everything in one place you own.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: easeOut }}
          >
            <SpotlightCard className="h-full p-7">
              <p className="font-brand text-sm uppercase tracking-[0.2em] text-muted-foreground">
                Shopping on your own
              </p>
              <ul className="mt-5 space-y-3">
                {without.map((line) => (
                  <li key={line} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                    {line}
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: easeOut }}
          >
            <SpotlightCard className="h-full p-7">
              <p className="font-brand text-sm uppercase tracking-[0.2em] text-primary">
                Shopping with Shopper
              </p>
              <ul className="mt-5 space-y-3">
                {withShopper.map((line) => (
                  <li key={line} className="flex items-start gap-3 text-sm text-foreground/80">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                    {line}
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
