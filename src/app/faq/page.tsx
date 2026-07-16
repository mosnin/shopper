"use client";

import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ChevronDown } from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";

const faqCategories = [
  {
    category: "Getting started",
    questions: [
      {
        q: "What is Shopper?",
        a: "Shopper is the shopping engine for AI agents. Your agent connects over MCP and gets a real engine: web-wide hunts for items for sale, deep browser sessions on marketplaces and forums, seller vetting against public registries, and structured state it shares with every other agent you connect: a wish list, shopping lists, About You context, and long-term memory. Not another chat that dumps links and forgets.",
      },
      {
        q: "How does my agent connect?",
        a: "One line. Point any MCP client, Claude Code, Cursor, Codex, OpenClaw, Hermes, or anything else that speaks MCP, at https://shopper.sh/api/mcp and authenticate with OAuth or an API key. The tools appear immediately. No SDK, no bespoke integration.",
      },
      {
        q: "What tools does my agent get?",
        a: "52 MCP tools covering the whole engine: hunts and deep browser shopping, Radar standing scans, wish list and shopping list read and write, seller vetting, About You and long-term memory, and billing tools so an agent can check credits and top up over x402. Every connected agent works from the same shared state.",
      },
      {
        q: "Do I need my own agent?",
        a: "No. Shopper includes a built-in agent that runs the same tools from a plain conversation in the app. Connect your own agents whenever you want; they all read and write the same lists, so nothing forks.",
      },
    ],
  },
  {
    category: "How it works",
    questions: [
      {
        q: "What is Radar?",
        a: "Radar is standing scans: your agent describes what you are waiting for, a pre-owned RTX 4090 under $1,100, a size 10M loafer under $400, a specific part, and Radar watches the web 24/7. New matches land in your list the moment they appear. Radar comes with paid plans: 25 standing scans on Pro, 100 on Max.",
      },
      {
        q: "Can my agent really pay for itself?",
        a: "Yes. Shopper supports x402, so an agent can buy its own credits and plans autonomously with USDC over HTTP 402, no human in the checkout loop. Spending is capped by what you fund the wallet with, so autonomy never means an open tab. As far as we know, no other shopping platform lets agents do this.",
      },
      {
        q: "How are sellers vetted?",
        a: "Every seller behind a find is checked against public registries: GLEIF, Companies House, and SEC EDGAR. If a seller cannot be verified, the find says so plainly instead of dressing it up, so you and your agent decide with open eyes.",
      },
      {
        q: "Does Shopper purchase items for me?",
        a: "Not yet. Shopper hunts, watches, vets, and organizes; checkout stays with you today. Your agent hands you a vetted find with the price and the seller, and you make the buy. What agents can pay for autonomously today is Shopper itself, via x402.",
      },
      {
        q: "Who owns the data?",
        a: "You do. Your wish list, shopping lists, About You, and memory are a single source of truth you control: exportable anytime, never resold, never used to train models. Agents come and go; the state stays yours.",
      },
    ],
  },
  {
    category: "Plans and pricing",
    questions: [
      {
        q: "What does it cost?",
        a: "Free to start, with limited usage but the full surface: MCP connection, hunts, seller vetting, and your lists. Pro is $20/mo with 25 Radar standing scans, deep browser sessions, and manufacturer and supplier sourcing. Max is $49/mo with 100 Radar scans and the highest throughput, built for resellers and sourcers. Cancel anytime.",
      },
      {
        q: "Can my agent buy the plan itself?",
        a: "Yes. Plans and credit top-ups are available over x402, so a funded agent can purchase them autonomously with USDC. Humans pay by card through Stripe. Same plans, two doors.",
      },
      {
        q: "Can it source past the retail shelf?",
        a: "Yes, on Pro. Your agent can find manufacturers and suppliers directly, vet each one against public registries, and save them to your lists. That is how resellers and teams use Shopper for buying at volume.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-16">
        {/* Hero */}
        <section className="relative py-24 sm:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-muted/40 dark:bg-charcoal-dark" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.12),transparent_50%)]" />
          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
            <Badge variant="primary" className="mb-4">FAQ</Badge>
            <h1 className="font-brand text-4xl tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Frequently asked{" "}
              <span className="text-gradient-orange">questions</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about Shopper. Can&apos;t find what
              you&apos;re looking for? Reach out to us directly.
            </p>
          </div>
        </section>

        {/* FAQ Sections */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-4">
            <div className="space-y-12">
              {faqCategories.map((category) => (
                <div key={category.category}>
                  <h2 className="font-brand text-xl text-foreground mb-4">{category.category}</h2>
                  <Accordion.Root type="single" collapsible className="space-y-2">
                    {category.questions.map((item, i) => (
                      <Accordion.Item
                        key={i}
                        value={`${category.category}-${i}`}
                        className="rounded-xl border border-border overflow-hidden"
                      >
                        <Accordion.Trigger className="flex w-full items-center justify-between p-4 text-left text-sm font-medium hover:bg-muted/50 transition-colors cursor-pointer group [&[data-state=open]>svg]:rotate-180">
                          {item.q}
                          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                        </Accordion.Trigger>
                        <Accordion.Content className="overflow-hidden data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
                          <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
                            {item.a}
                          </div>
                        </Accordion.Content>
                      </Accordion.Item>
                    ))}
                  </Accordion.Root>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-20 bg-muted/30 dark:bg-charcoal-dark/30">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="font-brand text-2xl text-foreground">Still have questions?</h2>
            <p className="mt-3 text-muted-foreground">
              We&apos;re here to help. Reach out and we&apos;ll get back to you within 24 hours.
            </p>
            <Button variant="glow" size="lg" className="mt-6" asChild>
              <Link href="/contact">
                Contact Us <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
