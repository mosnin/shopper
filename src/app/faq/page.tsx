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
        a: "Shopper is a personal shopping assistant powered by AI. You tell it what you want to buy, it searches across the whole internet, stores, marketplaces, and local sellers, and finds the best options and prices. Everything gets saved into simple lists you own: a Wish List for things you want and Shopping Lists for the grocery run, a house move, car parts, or office supplies.",
      },
      {
        q: "How does it find things?",
        a: "You describe what you want in plain words. Shopper searches lots of places at once, compares prices, reads the reviews, and opens a real browser for the trickier sites so nothing good slips through. Then it brings back real options from real sellers, not a page of ads, and saves each one with its price and seller.",
      },
      {
        q: "Do I need any special AI tools to use it?",
        a: "No. You can just use Shopper here and it does everything for you. If you already use AI assistants like ChatGPT, Claude, or Gemini, you can also connect them so they can shop through Shopper, but that is completely optional.",
      },
    ],
  },
  {
    category: "How it works",
    questions: [
      {
        q: "Does Shopper buy things for me?",
        a: "Shopper finds the best options, tracks prices, and keeps your lists in order, but you stay in control of the actual purchase. It does the hunting and the watching, then hands you the deal so you make the final call.",
      },
      {
        q: "Can it watch for deals?",
        a: "Yes. Tell Shopper what you are waiting for, like a used graphics card at a good price or a certain pair of shoes under $400, and it keeps watching in the background. The moment a match shows up or a price drops, it lands in your list so you never miss it. Deal alerts are part of the paid plans.",
      },
      {
        q: "How does it check the sellers?",
        a: "Every seller Shopper finds is checked against public business registries, so you know who you are buying from. If a seller cannot be verified, Shopper says so plainly instead of dressing it up, so you can decide with open eyes.",
      },
      {
        q: "Who owns my data?",
        a: "You do. Your lists are yours alone: private to you, easy to export, never resold, and never used to train AI models. Finds flow in, and your data does not leak out.",
      },
    ],
  },
  {
    category: "Plans and pricing",
    questions: [
      {
        q: "Is there a free plan?",
        a: "Yes. Free to start, with limited usage but the full experience: searching, seller checks, and your Wish List and Shopping Lists. Deal alerts and more searching come with Plus at $10/mo. Pro at $20/mo adds sourcing straight from manufacturers and suppliers.",
      },
      {
        q: "How does pricing work?",
        a: "Free with limited usage, Plus at $10/mo, and Pro at $20/mo. Plus unlocks deal alerts and more searching. Pro adds buying straight from the source on top. You can cancel anytime.",
      },
      {
        q: "Can it help with business buying?",
        a: "Yes, on the Pro plan. Pro goes past the retail shelf: Shopper can find manufacturers and suppliers directly, check each one against public business registries, and save them to your lists, which is how many teams use it for buying at work.",
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
