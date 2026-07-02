"use client";

import Link from "next/link";
import { LogoMark } from "@/components/brand/logo-mark";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { ImagePlaceholder } from "@/components/marketing/image-placeholder";

const easeOut = [0.16, 1, 0.3, 1] as const;

// The story, told straight: why Shopper exists. No invented history, no client
// counts, no team-size theater. Three beats and the principle that anchors them.
const story = [
  {
    eyebrow: "The problem",
    title: "Shopping eats hours agents could be spending.",
    body: [
      "Finding the right thing at the right price from a seller you can trust means twenty tabs, three marketplaces, a forum thread, and a saved search you forget to check. It is exactly the kind of patient, wide, repetitive work AI agents are built for.",
      "But the shopping tools bolted onto LLM providers search one partner catalog, forget everything between chats, and never ask who the seller actually is. Agents deserve a real shopping engine.",
    ],
  },
  {
    eyebrow: "The answer",
    title: "A shopping engine built for agents.",
    body: [
      "Shopper hunts the whole web: Exa, Firecrawl, and Tavily for search and scraping, and a real Browserbase browser for deep shopping on forums, marketplaces, and js-heavy storefronts.",
      "Every find lands as a structured record in your Wish List, with its seller, store, and manufacturer vetted against GLEIF, Companies House, and SEC EDGAR. Shopping Lists track the errands; Radar keeps standing scans running; About You keeps your sizes, tastes, and budgets in one durable place.",
    ],
  },
  {
    eyebrow: "Agent-first",
    title: "Built for agents to operate, over MCP.",
    body: [
      "Shopper was built agent-first from day one. Connect Hermes, OpenClaw, Codex, Claude Code, or any MCP client, or use the built-in agent, and it hunts, vets, and writes your lists directly.",
      "Agents and humans go through the same operations layer, so there is never drift between what the agent found and what you see.",
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-16">
        {/* Hero */}
        <section className="relative py-24 sm:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-muted/40 dark:bg-charcoal-dark" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(65,45,21,0.12),transparent_50%)]" />
          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
            <Badge variant="primary" className="mb-4">About</Badge>
            <h1 className="font-brand text-4xl tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              The shopping engine your{" "}
              <span className="text-gradient-orange">agents run</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Shopper exists because hunting the web for the right thing is work
              an agent should be doing for you. This is the why.
            </p>
            <ImagePlaceholder
              label="Agents hunting the web"
              aspect="aspect-[16/7]"
              className="mx-auto mt-12 max-w-3xl"
            />
          </div>
        </section>

        {/* Story */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-4">
            <div className="space-y-20">
              {story.map((section, index) => (
                <motion.div
                  key={section.eyebrow}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05, ease: easeOut }}
                >
                  <p className="text-xs uppercase tracking-[0.25em] text-primary">
                    {section.eyebrow}
                  </p>
                  <h2 className="font-brand mt-3 text-2xl text-foreground sm:text-3xl">
                    {section.title}
                  </h2>
                  {section.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 32)} className="mt-4 text-muted-foreground leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* The principle */}
        <section className="py-20 sm:py-28 bg-muted/30 dark:bg-charcoal-dark/30">
          <div className="mx-auto max-w-3xl px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: easeOut }}
              className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 sm:p-12 text-center"
            >
              <LogoMark className="mx-auto h-10 w-10" />
              <p className="mt-6 text-xs uppercase tracking-[0.25em] text-primary">
                The principle
              </p>
              <h2 className="font-brand mt-3 text-2xl text-foreground sm:text-3xl">
                A cheap price from a ghost store is{" "}
                <span className="text-gradient-orange">not a deal</span>
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Every find Shopper saves carries its seller, and every seller is
                checked against real registries: GLEIF, Companies House, SEC
                EDGAR. If a seller cannot be verified, the find says so plainly
                instead of dressing it up. Trust beats a bargain. That rule is
                the soul of the product: a find you can act on is the only kind
                worth saving.
              </p>
              <Button variant="outline" className="mt-8" asChild>
                <Link href="/manifesto">
                  Read the manifesto <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="font-brand text-3xl text-foreground sm:text-4xl">
              Connect your agent. It hunts.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Point your agent at Shopper over MCP, or use the built-in one, and
              watch your Wish List fill itself.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button variant="glow" size="lg" asChild>
                <Link href="/sign-up">
                  Get Started <ArrowRight className="ml-1 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/pricing">See Pricing</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
