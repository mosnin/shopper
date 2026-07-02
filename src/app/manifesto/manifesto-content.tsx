"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { AsciiField } from "@/components/dashboard/ascii-field";
import { LogoMark } from "@/components/brand/logo-mark";

const easeOut = [0.16, 1, 0.3, 1] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};
const line = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: easeOut } },
};

// The Shopper manifesto: an on-brand editorial statement of why the product
// exists. A short conviction piece about agents that shop for people, the time
// given back, and data the buyer owns.
const beliefs = [
  "Nobody gets to the end of a life and wishes they had spent more evenings comparing listings in twenty tabs. Finding the right thing at the right price from a seller you can trust is real work, and it was never meant to be yours.",
  "It is agent work. Patient, wide, relentless: sweep the whole web, read the forum thread, open the js-heavy storefront, check who the seller actually is, and come back with the one find that matters. Agents are built for exactly this. They just never had an engine.",
  "The shopping tools bolted onto chat assistants are not that engine. One partner catalog, no memory between sessions, no idea who is selling. We think your agents deserve the open web, a real browser, vetted sellers, and lists that persist.",
  "And we think what they learn about you, your sizes, your tastes, your budgets, your wants, belongs to you. Exportable, never resold, shared across every agent you run. The hunt keeps going while you live your life. That is the time given back.",
];

export function ManifestoContent() {
  return (
    <section className="relative flex min-h-screen w-full flex-col items-center overflow-hidden bg-background px-4 pb-28 pt-36 sm:px-6">
      {/* The signature, the brand's soul */}
      <AsciiField
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12] dark:opacity-[0.22]"
        cell={14}
        speed={0.07}
        gradient
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(65,45,21,0.14),transparent_55%)]" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center text-center"
      >
        <motion.div variants={line}>
          <LogoMark className="h-12 w-12" />
        </motion.div>

        <motion.p
          variants={line}
          className="mt-10 text-xs uppercase tracking-[0.3em] text-primary"
        >
          Manifesto
        </motion.p>

        <motion.h1
          variants={line}
          className="font-brand mt-5 text-4xl leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
        >
          The hunting should{" "}
          <span className="text-gradient-orange">do itself</span>.
        </motion.h1>

        <div className="mt-12 space-y-7">
          {beliefs.map((belief) => (
            <motion.p
              key={belief}
              variants={line}
              className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground"
            >
              {belief}
            </motion.p>
          ))}
        </div>

        <motion.p
          variants={line}
          className="font-brand mt-14 text-2xl text-foreground sm:text-3xl"
        >
          This is Shopper.
        </motion.p>

        <motion.div variants={line} className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-primary/40"
          >
            Get started
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-border px-8 py-3.5 text-base font-medium text-muted-foreground backdrop-blur-md transition-colors hover:border-foreground/30 hover:text-foreground"
          >
            Back to home
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
