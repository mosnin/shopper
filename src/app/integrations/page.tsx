"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AsciiField } from "@/components/dashboard/ascii-field";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ConnectionDemo } from "@/components/marketing/connection-demo";

const easeOut = [0.16, 1, 0.3, 1] as const;

// Known MCP clients. The lists are the substrate; the agent is interchangeable.
const agents = [
  { name: "Hermes", body: "Point Hermes at Shopper and it hunts the web, vets sellers, and fills the Wish List you can see." },
  { name: "OpenClaw", body: "OpenClaw agents get the full engine over MCP: search, deep shopping, and list read and write." },
  { name: "Codex", body: "Codex connects over the same surface, so your coding agent can also restock the workshop." },
  { name: "Claude Code", body: "Drop the Shopper MCP config into Claude Code and ask it to find the part mid-session." },
  { name: "Cursor", body: "Cursor speaks MCP, so the same editor that ships your code can source your hardware." },
  { name: "Any MCP client", body: "If it speaks MCP, it connects. No bespoke integration, no exported copy of your data." },
];

// The engines the hunts run on, plus how money moves. Honest and specific:
// these are the actual providers under the hood, not aspirations.
const engines = [
  { name: "Exa", body: "Neural web search that finds items for sale where keyword engines give up." },
  { name: "Firecrawl", body: "Scrapes storefronts and listings into clean, structured finds." },
  { name: "Tavily", body: "Fast, wide search for sweeping the long tail of the web." },
  { name: "Browserbase", body: "A real browser for deep shopping: forums, marketplaces, js-heavy storefronts." },
  { name: "Stripe", body: "Card billing for Plus and Pro plans, cancel anytime." },
  { name: "x402 + USDC", body: "Agents can pay for usage themselves in USDC over HTTP, no human in the loop." },
];

// What a connected agent can actually do over the MCP surface.
const capabilities = [
  "Hunt the whole web for items for sale from a plain-English ask",
  "Deep shop with a real browser: forums, marketplaces, storefronts",
  "Vet sellers against GLEIF, Companies House, and SEC EDGAR",
  "Read and write the Wish List and Shopping Lists",
  "Keep About You current: sizes, tastes, budgets",
  "Set up Radar standing scans on paid plans",
];

const steps = [
  {
    n: "01",
    title: "Create a key",
    body: "Generate a per-user API key in Settings. It scopes an agent to your lists and nothing else.",
  },
  {
    n: "02",
    title: "Point your agent",
    body: "Connect your MCP client to the Shopper endpoint with that key. The tools appear automatically.",
  },
  {
    n: "03",
    title: "It hunts",
    body: "Your agent hunts, vets sellers, and writes the same lists you see, with every action logged.",
  },
];

export default function IntegrationsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden py-24 sm:py-32">
          <AsciiField
            className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.10] dark:opacity-[0.20]"
            cell={14}
            speed={0.06}
            gradient
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(65,45,21,0.12),transparent_55%)]" />
          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Integrations</p>
            <h1 className="font-brand mt-4 text-4xl tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Connect your <span className="text-gradient-orange">own agents</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
              Shopper is open by connection. Plug any MCP agent into the same
              shopping engine over a secure endpoint and per-user keys. The lists
              are the substrate; agents are interchangeable.
            </p>
            <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-primary/40"
              >
                Get started
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/security"
                className="inline-flex items-center gap-2 rounded-full border border-border px-8 py-3.5 text-base font-medium text-muted-foreground backdrop-blur-md transition-colors hover:border-foreground/30 hover:text-foreground"
              >
                How your data stays yours
              </Link>
            </div>
          </div>
        </section>

        {/* Interactive connection demo */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs uppercase tracking-[0.25em] text-primary">Connect</p>
              <h2 className="font-brand mt-3 text-3xl text-foreground sm:text-4xl">
                Paste the config, <span className="text-gradient-orange">watch it connect</span>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                A per-user key scopes an agent to your data and nothing else. Drop
                the endpoint into your MCP client and the typed tools appear.
              </p>
            </div>
            <div className="mt-12">
              <ConnectionDemo />
            </div>
          </div>
        </section>

        {/* Agents */}
        <section className="bg-muted/30 py-24 dark:bg-background sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs uppercase tracking-[0.25em] text-primary">Works with</p>
              <h2 className="font-brand mt-3 text-3xl text-foreground sm:text-4xl">
                One engine, <span className="text-gradient-orange">any agent</span>
              </h2>
            </div>
            <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {agents.map((agent, index) => (
                <motion.div
                  key={agent.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08, ease: easeOut }}
                  className="h-full"
                >
                  <SpotlightCard className="h-full p-6">
                    <h3 className="font-brand text-lg text-foreground">{agent.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{agent.body}</p>
                  </SpotlightCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Engines and payments */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs uppercase tracking-[0.25em] text-primary">Under the hood</p>
              <h2 className="font-brand mt-3 text-3xl text-foreground sm:text-4xl">
                The engines <span className="text-gradient-orange">hunts run on</span>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Best-in-class search, scraping, and browsing, plus two ways to
                pay: cards for humans, USDC for agents.
              </p>
            </div>
            <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {engines.map((engine, index) => (
                <motion.div
                  key={engine.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08, ease: easeOut }}
                  className="h-full"
                >
                  <SpotlightCard className="h-full p-6">
                    <h3 className="font-brand text-lg text-foreground">{engine.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{engine.body}</p>
                  </SpotlightCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Capabilities */}
        <section className="bg-muted/30 py-24 dark:bg-background sm:py-32">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs uppercase tracking-[0.25em] text-primary">Over MCP</p>
              <h2 className="font-brand mt-3 text-3xl text-foreground sm:text-4xl">
                What a connected agent <span className="text-gradient-orange">can do</span>
              </h2>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {capabilities.map((cap, index) => (
                <motion.div
                  key={cap}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.06, ease: easeOut }}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="text-sm text-foreground/80">{cap}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="bg-muted/40 py-24 dark:bg-charcoal-dark sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs uppercase tracking-[0.25em] text-primary">Connect in minutes</p>
              <h2 className="font-brand mt-3 text-3xl text-foreground sm:text-4xl">
                From key to <span className="text-gradient-orange">first write</span>
              </h2>
            </div>
            <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08, ease: easeOut }}
                  className="h-full"
                >
                  <SpotlightCard className="h-full p-6">
                    <span className="font-brand text-3xl text-primary tabular-nums">{step.n}</span>
                    <h3 className="font-brand mt-3 text-xl text-foreground">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                  </SpotlightCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
