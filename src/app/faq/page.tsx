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
        a: "Shopper is the shopping engine your AI agents run. Agents hunt the whole web for items for sale, vet the sellers against real corporate registries, and save every find to a structured Wish List you own. Shopping Lists track your errands, Radar runs standing scans on paid plans, and About You keeps your sizes, tastes, and budgets in one durable place.",
      },
      {
        q: "Do I need to bring my own agent?",
        a: "No. Shopper ships with a built-in agent that hunts, vets, and works your lists from a chat. If you already run your own agent, connect it over MCP and it gets the same engines and the same lists.",
      },
      {
        q: "Is there a free plan?",
        a: "Yes. The free tier has limited usage but includes the full hunting engine, seller vetting, the built-in agent, MCP access, and your Wish List and Shopping Lists. Radar and higher usage come with Plus at $10/mo; Pro at $20/mo adds manufacturer and supplier sourcing.",
      },
    ],
  },
  {
    category: "Agents and MCP",
    questions: [
      {
        q: "How do agents connect?",
        a: "Any agent that speaks MCP works: Hermes, OpenClaw, Codex, Claude Code, Cursor, or your own. Generate an API key from Settings and point your MCP client at https://shopper.sh/api/mcp. Once connected, it can hunt, vet sellers, and read and write your Wish List, Shopping Lists, and About You immediately.",
      },
      {
        q: "What can a connected agent actually do?",
        a: "Everything the built-in agent can: hunt the web with Exa, Firecrawl, and Tavily, run deep shopping in a real Browserbase browser, vet sellers, save and update finds, work Shopping Lists, set up Radar scans on paid plans, and keep your About You context current. Agents go through the same operations layer the app uses, so there is no drift between what your agent does and what you see.",
      },
      {
        q: "What does a hunt cost?",
        a: "Browsing and editing your lists is always free. Hunts spend usage: the free plan includes enough to feel the product work, and Plus and Pro raise the ceiling. Deep shopping hunts that use a real browser cost more than plain search hunts, and Shopper always prefers the cheapest engine that can do the job.",
      },
    ],
  },
  {
    category: "Finds and sellers",
    questions: [
      {
        q: "How are sellers vetted?",
        a: "Every seller, store, and manufacturer attached to a find is checked against public corporate registries: GLEIF, Companies House, and SEC EDGAR. A verified seller shows its registry match; an unverifiable one is flagged plainly so you can decide with open eyes.",
      },
      {
        q: "Is Radar included in the free plan?",
        a: "No, Radar is paid-only. Standing scans run continuously in the background, so they live on Plus and Pro. Set one up, 'recently listed pre-owned GPUs at a good price' or 'Gucci shoes size 10M under $400', and matches land in your Wish List the moment they appear.",
      },
      {
        q: "Can Shopper source manufacturers and suppliers?",
        a: "Yes, on the Pro plan. Pro extends hunting and vetting past the retail shelf: agents source manufacturers and suppliers directly, vet them against the same registries, and save them as structured records, which is how many teams use Shopper for business buying.",
      },
      {
        q: "Who owns my data?",
        a: "You do. Your Wish List, Shopping Lists, and About You are a single source of truth you control: isolated per user, exportable, never resold, and never used to train models. Finds flow in; your data does not leak out.",
      },
    ],
  },
  {
    category: "Pricing and billing",
    questions: [
      {
        q: "How does pricing work?",
        a: "Free with limited usage, Plus at $10/mo, and Pro at $20/mo. Plus unlocks Radar and higher hunt usage; Pro adds manufacturer and supplier sourcing on top. You can cancel anytime.",
      },
      {
        q: "How is this different from the shopping tools inside my LLM provider?",
        a: "Provider shopping MCPs search a partner catalog and forget everything between chats. Shopper hunts the open web, drops into a real browser when it needs to, vets who is selling, and keeps durable lists every one of your agents shares. It is an order of magnitude more capable, which is the whole point of a dedicated engine.",
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
