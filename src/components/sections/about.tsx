"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ImagePlaceholder } from "@/components/marketing/image-placeholder";

const easeOut = [0.16, 1, 0.3, 1] as const;

const values = [
  {
    title: "Owned data - yours to keep, yours to export",
    description:
      "Every find, list, and About You fact lives in your Shopper account. No shared pool, no lock-in, never resold. Export it all whenever you like.",
  },
  {
    title: "Vetted before you spend",
    description:
      "Before a big purchase or a new supplier, sellers are checked against public registries: GLEIF, Companies House, SEC EDGAR. Trust is earned, then verified.",
  },
  {
    title: "One memory, every client",
    description:
      "Agents read About You before every hunt: sizes, budgets, no-gos. State persists across sessions and clients, so every agent you connect shares it.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden scroll-mt-24 bg-background py-24 sm:py-32">
      {/* Section-top wash: a whisper of brand blue for rhythm and dark-mode depth. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(37,99,235,0.06),transparent_70%)]"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-primary">About Shopper</p>
            <h2 className="font-brand mt-3 text-3xl text-foreground sm:text-4xl lg:text-5xl">
              Shopping is work.{" "}
              <span className="text-gradient-orange">Agents should do it.</span>
            </h2>
            <p className="mt-5 text-lg text-muted-foreground">
              Shopper is the shopping engine your agents run. Connected over
              MCP, they hunt the whole web for items, compare prices, read
              reviews, vet sellers, and keep every find in lists you own.
            </p>
            <p className="mt-4 text-muted-foreground">
              Deal-hunting, resale sourcing, the grocery run, auto parts, a
              whole-home refit, or finding a manufacturer. You already run
              agents; Shopper gives them the engine, the state, and the memory
              to shop with understanding instead of search and forget.
            </p>
            <Link
              href="/sign-up"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              Start free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-4">
            <ImagePlaceholder label="Shopping bags and a phone" src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=75&w=1600&auto=format&fit=crop" aspect="aspect-[16/9]" />
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: easeOut }}
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
