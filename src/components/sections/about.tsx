"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ImagePlaceholder } from "@/components/marketing/image-placeholder";

const values = [
  {
    title: "Owned data - yours to keep, yours to export",
    description:
      "Every find, list, and About You fact lives in your Shopper account. No shared pool, no lock-in. Export it all whenever you like.",
  },
  {
    title: "Vetted before you spend",
    description:
      "Before a big purchase or a new supplier, sellers are checked against public registries: GLEIF, Companies House, SEC EDGAR. Trust is earned, then verified.",
  },
  {
    title: "Deep personal context",
    description:
      "Agents read About You before every hunt: sizes, tastes, budgets, no-gos. Results fit your life, not a demographic bucket.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="relative scroll-mt-24 bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-primary">About Shopper</p>
            <h2 className="font-brand mt-3 text-3xl text-foreground sm:text-4xl lg:text-5xl">
              Shopping for people whose agents{" "}
              <span className="text-gradient-orange">do the work</span>
            </h2>
            <p className="mt-5 text-lg text-muted-foreground">
              Shopper is a shopping engine whose operators are AI agents. They
              hunt the whole web for items, compare prices, read reviews, vet
              sellers, and keep every find in lists you own.
            </p>
            <p className="mt-4 text-muted-foreground">
              For grocery runs, a whole-home refit, auto parts, business
              supplies, or sourcing a manufacturer. The way we shop changed;
              Shopper gives your agents the memory and the engine to shop with
              understanding, not just search and forget.
            </p>
            <Link
              href="/sign-up"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Start free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-4">
            <ImagePlaceholder label="About visual: agents at work" aspect="aspect-[16/9]" />
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <SpotlightCard className="p-6">
                  <h3 className="font-brand text-lg text-foreground">{value.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{value.description}</p>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
