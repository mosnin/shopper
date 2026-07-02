"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { AsciiField } from "@/components/dashboard/ascii-field";

/**
 * The hero centerpiece: a live, self-driving demo of an agent running a hunt.
 * It types a shopping ask, streams finds in one at a time, fills in seller
 * vetting and match scores, and cycles through a few asks. The visitor can
 * click a preset to rebuild it themselves. This is "show, don't tell": the
 * product is working before they sign up. Reduced motion shows the finished
 * board with no animation.
 *
 * The data is generic demo data, plausible and clearly not real listings, so
 * the preview stays honest: this is what a hunt looks like once an agent runs.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

type Intent = "hot" | "warm" | "cool";

type Row = {
  company: string;
  domain: string;
  chips: string[];
  intent: Intent;
  fit: number;
  contacts: number;
};

type Build = {
  label: string;
  prompt: string;
  rows: Row[];
};

const builds: Build[] = [
  {
    label: "Pre-owned GPU",
    prompt: "recently listed pre-owned RTX 4090s under $1,100",
    rows: [
      { company: "RTX 4090 Founders Edition", domain: "listed 2h ago - marketplace", chips: ["$1,040", "Barely used", "Seller vetted"], intent: "hot", fit: 94, contacts: 3 },
      { company: "RTX 4090 Gaming OC", domain: "listed today - forum classifieds", chips: ["$1,085", "Boxed", "Seller vetted"], intent: "warm", fit: 86, contacts: 2 },
      { company: "RTX 4090 SUPRIM X", domain: "refurb outlet store", chips: ["$1,099", "Refurb, warranty", "Registry match"], intent: "hot", fit: 82, contacts: 3 },
      { company: "RTX 4090 Trinity", domain: "auction, ends in 3 days", chips: ["$960 bid", "Untested", "Watch"], intent: "cool", fit: 71, contacts: 1 },
    ],
  },
  {
    label: "Gucci, size 10M",
    prompt: "Gucci shoes size 10M under $400",
    rows: [
      { company: "Gucci Jordaan loafer", domain: "resale marketplace", chips: ["$365", "10M", "Seller vetted"], intent: "hot", fit: 91, contacts: 3 },
      { company: "Gucci Ace sneaker", domain: "consignment store", chips: ["$310", "10M", "Authenticated"], intent: "warm", fit: 84, contacts: 2 },
      { company: "Gucci horsebit slipper", domain: "outlet storefront", chips: ["$398", "10M", "Registry match"], intent: "warm", fit: 78, contacts: 2 },
      { company: "Gucci Brixton loafer", domain: "private seller listing", chips: ["$280", "9.5M runs big", "Watch"], intent: "cool", fit: 69, contacts: 1 },
    ],
  },
  {
    label: "Workshop restock",
    prompt: "restock the workshop shopping list: sandpaper, wood glue, clamps",
    rows: [
      { company: "Sandpaper, 120-400 grit box", domain: "hardware supplier", chips: ["$24", "In stock", "Seller vetted"], intent: "hot", fit: 89, contacts: 3 },
      { company: "Wood glue, gallon", domain: "manufacturer direct", chips: ["$31", "Ships today", "Registry match"], intent: "warm", fit: 80, contacts: 2 },
      { company: "Parallel clamps, 4-pack", domain: "marketplace listing", chips: ["$96", "Open box", "Seller vetted"], intent: "warm", fit: 76, contacts: 2 },
      { company: "Bench vise, 6 inch", domain: "auction, used", chips: ["$42 bid", "Pickup only", "Watch"], intent: "cool", fit: 64, contacts: 1 },
    ],
  },
];

const intentDot: Record<Intent, string> = {
  hot: "bg-success",
  warm: "bg-primary",
  cool: "bg-muted-foreground/40",
};

const intentLabel: Record<Intent, string> = {
  hot: "Great deal",
  warm: "Fair price",
  cool: "Watching",
};

export function LiveDemo() {
  const reduce = useReducedMotion();
  const [activeIdx, setActiveIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [revealed, setRevealed] = useState(0);
  const [enriched, setEnriched] = useState(false);
  const [status, setStatus] = useState("Reading your ask");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);
  const at = useCallback((ms: number, fn: () => void) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  const runBuild = useCallback(
    (idx: number, autoAdvance: boolean) => {
      clearTimers();
      const build = builds[idx];
      setActiveIdx(idx);
      setTyped("");
      setRevealed(0);
      setEnriched(false);
      setStatus("Reading your ask");

      // Reduced motion: skip straight to the finished board.
      if (reduce) {
        setTyped(build.prompt);
        setRevealed(build.rows.length);
        setEnriched(true);
        setStatus(`Done. ${build.rows.length} finds saved, ${totalContacts(build)} sellers vetted`);
        return;
      }

      // 1) Type the prompt.
      const chars = build.prompt.length;
      const typeStep = 26;
      for (let c = 1; c <= chars; c++) {
        at(c * typeStep, () => setTyped(build.prompt.slice(0, c)));
      }
      let t = chars * typeStep + 360;

      // 2) Discover: stream rows one at a time.
      at(t, () => setStatus("Hunting the web"));
      t += 320;
      build.rows.forEach((_, i) => {
        at(t, () => setRevealed(i + 1));
        t += 420;
      });

      // 3) Enrich + sense intent.
      t += 200;
      at(t, () => setStatus("Vetting sellers"));
      at(t + 120, () => setEnriched(true));
      t += 900;
      at(t, () => setStatus("Scoring the deals"));
      t += 850;
      at(t, () => setStatus(`Done. ${build.rows.length} finds saved, ${totalContacts(build)} sellers vetted`));

      // 4) Hold, then move to the next prompt.
      if (autoAdvance) {
        t += 3200;
        at(t, () => runBuild((idx + 1) % builds.length, true));
      }
    },
    [reduce, clearTimers, at],
  );

  useEffect(() => {
    runBuild(0, true);
    return clearTimers;
    // runBuild and clearTimers are stable for the component's life.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const build = builds[activeIdx];

  return (
    <div className="relative mx-auto w-full max-w-4xl">
      {/* soft brand glow under the window */}
      <div className="pointer-events-none absolute -inset-x-6 -bottom-10 top-16 bg-[radial-gradient(ellipse_at_50%_50%,rgba(65,45,21,0.22),transparent_70%)] blur-2xl" />

      <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-2xl shadow-black/10 dark:border-white/10 dark:shadow-black/50">
        {/* window chrome */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3 dark:border-white/10">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-muted-foreground/25" />
            <span className="h-3 w-3 rounded-full bg-muted-foreground/25" />
            <span className="h-3 w-3 rounded-full bg-muted-foreground/25" />
          </div>
          <div className="mx-auto flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] text-muted-foreground dark:border-white/10">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            app.shopper.sh / shop
          </div>
        </div>

        {/* agent prompt bar with the typing prompt + live status */}
        <div className="relative overflow-hidden border-b border-border bg-muted/40 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
          <AsciiField className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.08] dark:opacity-[0.10]" cell={12} speed={0.06} gradient />
          <div className="relative z-10 flex items-center gap-2.5">
            <span className="flex h-2 w-2 shrink-0 items-center justify-center">
              <span className="absolute h-2 w-2 animate-ping rounded-full bg-primary/60" />
              <span className="h-2 w-2 rounded-full bg-primary" />
            </span>
            <p className="truncate font-mono text-xs text-foreground/85">
              <span className="text-muted-foreground">shopper </span>
              {typed}
              {!reduce && (
                <motion.span
                  aria-hidden
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.7, repeat: Infinity, repeatType: "reverse" }}
                  className="ml-0.5 inline-block h-3 w-[2px] translate-y-[2px] bg-primary"
                />
              )}
            </p>
          </div>
          <div className="relative z-10 mt-1.5 flex items-center gap-2 pl-[1.1rem]">
            <AnimatePresence mode="wait">
              <motion.span
                key={status}
                initial={reduce ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -4 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="text-[11px] text-muted-foreground"
              >
                {status}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* table */}
        <div className="px-2 py-2 sm:px-3 sm:py-3">
          <div className="grid grid-cols-12 gap-3 px-3 py-2 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
            <div className="col-span-6 sm:col-span-5">Find</div>
            <div className="col-span-2 hidden sm:block">Deal</div>
            <div className="col-span-4 hidden sm:block">Details</div>
            <div className="col-span-6 text-right sm:col-span-1">Match</div>
          </div>

          {/* Fixed height so the board does not jump as rows stream in. */}
          <div className="min-h-[268px] space-y-1">
            <AnimatePresence mode="popLayout">
              {build.rows.slice(0, revealed).map((row) => (
                <motion.div
                  key={`${build.label}-${row.company}`}
                  layout
                  initial={reduce ? false : { opacity: 0, y: 10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={reduce ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="grid grid-cols-12 items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-muted/50 dark:hover:bg-white/[0.03]"
                >
                  {/* company + domain */}
                  <div className="col-span-6 sm:col-span-5">
                    <div className="flex items-center gap-2">
                      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${intentDot[row.intent]}`} />
                      <span className="font-brand text-sm text-foreground">{row.company}</span>
                    </div>
                    <p className="mt-0.5 truncate pl-3.5 text-xs text-muted-foreground">{row.domain}</p>
                  </div>

                  {/* signal */}
                  <div className="col-span-2 hidden sm:block">
                    <AnimatePresence>
                      {enriched && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.4 }}
                          className="text-xs text-muted-foreground"
                        >
                          {intentLabel[row.intent]}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* enrichment chips */}
                  <div className="col-span-4 hidden flex-wrap gap-1.5 sm:flex">
                    <AnimatePresence>
                      {enriched &&
                        row.chips.map((chip, ci) => (
                          <motion.span
                            key={chip}
                            initial={reduce ? false : { opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: ci * 0.06, ease: EASE }}
                            className="rounded-md border border-border bg-background/60 px-2 py-0.5 text-[11px] text-foreground/70 dark:border-white/10 dark:bg-white/[0.03]"
                          >
                            {chip}
                          </motion.span>
                        ))}
                    </AnimatePresence>
                  </div>

                  {/* fit */}
                  <div className="col-span-6 flex items-center justify-end gap-2 sm:col-span-1">
                    <div className="h-1.5 w-14 overflow-hidden rounded-full bg-muted sm:w-10">
                      <motion.div
                        className="h-full rounded-full bg-primary"
                        initial={reduce ? false : { width: 0 }}
                        animate={{ width: enriched ? `${row.fit}%` : 0 }}
                        transition={{ duration: 0.7, ease: EASE }}
                      />
                    </div>
                    <span className="w-6 text-right font-brand text-xs tabular-nums text-foreground">
                      {enriched ? row.fit : ""}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Interactive preset prompts: click to rebuild the board yourself. */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs text-muted-foreground">Try a hunt:</span>
        {builds.map((b, i) => (
          <button
            key={b.label}
            type="button"
            onClick={() => runBuild(i, false)}
            aria-pressed={i === activeIdx}
            className={
              i === activeIdx
                ? "rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors"
                : "rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
            }
          >
            {b.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function totalContacts(build: Build): number {
  return build.rows.reduce((sum, r) => sum + r.contacts, 0);
}
