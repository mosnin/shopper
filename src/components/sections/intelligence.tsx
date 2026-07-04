"use client";

import { motion } from "motion/react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ImagePlaceholder } from "@/components/marketing/image-placeholder";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The depth the words "wish list" hide, as an Apple-style bento: a few feature
 * tiles with live mini-visuals (price watching, seller vetting, price history,
 * sourced answers) sized larger than the rest, so breadth reads as depth, not
 * a uniform grid. Each visual animates once on view and respects reduced
 * motion through the shared whileInView pattern.
 */

function Tile({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: EASE }}
      className={"h-full " + className}
    >
      <SpotlightCard className="flex h-full flex-col p-6">{children}</SpotlightCard>
    </motion.div>
  );
}

function TileHead({ label, body }: { label: string; body: string }) {
  return (
    <>
      <h3 className="font-brand text-lg text-foreground">{label}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </>
  );
}

/* ------------------------------- Visuals ---------------------------------- */

function PriceWatchMini() {
  const bars = [
    { name: "RTX 4090, pre-owned", score: 88, tone: "bg-success", label: "$1,140, dropping" },
    { name: "Walnut console table", score: 62, tone: "bg-primary", label: "$640, steady" },
    { name: "Espresso grinder", score: 34, tone: "bg-muted-foreground/40", label: "$289, above target" },
  ];
  return (
    <div className="mt-5 space-y-2.5">
      {bars.map((b, i) => (
        <div key={b.name}>
          <div className="flex items-center justify-between text-xs">
            <span className="text-foreground/80">{b.name}</span>
            <span className="text-muted-foreground">{b.label}</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
            <motion.div
              className={`h-full rounded-full ${b.tone}`}
              initial={{ width: 0 }}
              whileInView={{ width: `${b.score}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease: EASE }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function Sparkline() {
  // A gently falling price line that draws itself once in view.
  const d = "M0 9 L18 11 L36 10 L54 18 L72 16 L90 26 L108 24 L126 34 L144 32";
  return (
    <div className="mt-5">
      <svg viewBox="0 0 144 46" className="h-16 w-full" fill="none" preserveAspectRatio="none">
        <motion.path
          d={`${d} L144 46 L0 46 Z`}
          fill="url(#sparkfill)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />
        <motion.path
          d={d}
          stroke="var(--color-primary)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
        />
        <defs>
          <linearGradient id="sparkfill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function SellerMini() {
  return (
    <div className="mt-5 rounded-xl border border-border bg-background/60 p-3 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        <span className="font-brand text-sm text-foreground">Meridian Textiles Ltd</span>
        <span className="text-xs text-muted-foreground">supplier</span>
      </div>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        <span className="rounded-md border border-border bg-card px-2 py-0.5 text-[11px] text-foreground/70 dark:border-white/10">
          GLEIF verified
        </span>
        <span className="rounded-md border border-border bg-card px-2 py-0.5 text-[11px] text-foreground/70 dark:border-white/10">
          registry match
        </span>
      </div>
    </div>
  );
}

function AskMini() {
  return (
    <div className="mt-5 rounded-xl border border-border bg-background/60 p-3 dark:border-white/10 dark:bg-white/[0.03]">
      <p className="font-mono text-[11px] text-muted-foreground">
        <span className="text-primary">? </span>Is this grinder actually quieter than my old one?
      </p>
      <p className="mt-2 text-sm text-foreground/85">
        Yes. Owners consistently report it runs quieter, and the maker lists a
        lower measured noise level than the model you have now.
      </p>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {["owner reviews", "spec sheet", "forum thread"].map((s) => (
          <span key={s} className="rounded-md border border-border bg-card px-2 py-0.5 text-[10px] text-muted-foreground dark:border-white/10">
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

export function IntelligenceSection() {
  return (
    <section id="intelligence" className="relative scroll-mt-24 bg-muted/30 py-24 dark:bg-background sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-primary">Your living wish list</p>
          <h2 className="font-brand mt-3 text-3xl text-foreground sm:text-4xl lg:text-5xl">
            Your wish list <span className="text-gradient-orange">keeps working</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A folder of bookmarks just sits there. Your Shopper wish list stays
            up to date: prices tracked, deals flagged, sellers checked, and
            better options surfaced while you get on with your day.
          </p>
        </div>

        <div className="mt-14 grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Price watching: the accent, a wide feature tile */}
          <Tile className="lg:col-span-2" delay={0}>
            <TileHead label="Prices tracked" body="Every saved item is checked again and again, so you hear about it the moment the price drops to where you want it, no refreshing tabs." />
            <PriceWatchMini />
          </Tile>

          {/* Seller vetting with a mini card */}
          <Tile delay={0.06}>
            <TileHead label="Sellers checked" body="Each seller is checked against public business registries, so you know who you're buying from." />
            <SellerMini />
          </Tile>

          {/* Three compact text tiles */}
          <Tile delay={0}>
            <TileHead label="Reviews read" body="Hundreds of reviews boiled down to the two things that actually matter for you." />
          </Tile>
          <Tile delay={0.06}>
            <TileHead label="Stock watched" body="Sold out, back in stock, relisted: your list knows before you do." />
          </Tile>
          <Tile delay={0.12}>
            <TileHead label="Better options found" body="A better price, a better seller, or a better fit, offered alongside every item." />
          </Tile>

          {/* Price history with a sparkline */}
          <Tile className="lg:col-span-2" delay={0}>
            <TileHead label="Price history" body="See where a price has been, so you know whether today's deal is actually a deal." />
            <Sparkline />
          </Tile>

          {/* Provenance, compact */}
          <Tile delay={0.06}>
            <TileHead label="Every option saved" body="The item, the price, the seller, and where it came from, saved with every find." />
          </Tile>

          {/* Sourced answers, full width */}
          <Tile className="lg:col-span-3" delay={0}>
            <div className="grid gap-4 lg:grid-cols-2 lg:items-center">
              <div>
                <TileHead label="Ask about anything" body="Ask a real question about an item or a seller and get a clear answer with its sources, not a wall of links to sort through yourself." />
              </div>
              <AskMini />
            </div>
          </Tile>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mx-auto mt-10 max-w-4xl"
        >
          <ImagePlaceholder label="A shopper reviewing finds on a laptop" src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=75&w=1600&auto=format&fit=crop" aspect="aspect-[21/9]" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-10 max-w-2xl text-center text-sm text-muted-foreground"
        >
          Messy search results are cleaned up into real listings from real
          sellers, never ad farms, never the wrong version. Getting it right
          beats casting a wide net, always.
        </motion.p>
      </div>
    </section>
  );
}
