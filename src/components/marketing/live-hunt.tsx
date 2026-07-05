"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Loader2, Radar, Search, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DemoHunt, DemoResult } from "@/lib/demo-hunt";

// The real five-second moment. Type a query, hit go, and actual ranked listings
// come back from /api/demo/hunt. On a deploy with a search provider configured
// these are live; otherwise the API returns a clearly-labelled sample and we
// say so. Either way the visitor feels the product work before signing up.

const CHIPS = [
  "pre-owned RTX 4090 under $900",
  "Gucci loafers size 10M under $400",
  "rust-free Miata project car",
  "Herman Miller Aeron near me",
];

const HUNTING = ["Searching marketplaces", "Reading listings", "Parsing prices", "Ranking the deals"];

// Persist the hunt so it survives the Clerk signup redirect. The Radar page
// reads it on first visit and offers to watch exactly this, closing the loop
// from "try it" to "your agent is already watching."
function rememberIntent(query: string) {
  try {
    localStorage.setItem("shopper_intent", query);
  } catch {
    /* storage blocked; the ?intent= query param is the fallback */
  }
}

export function LiveHunt() {
  const [query, setQuery] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [hunt, setHunt] = useState<DemoHunt | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState(0);

  async function run(q: string) {
    const value = q.trim();
    if (!value || state === "loading") return;
    setQuery(value);
    setState("loading");
    setError(null);
    setHunt(null);
    // Cosmetic progress ticker while the request is in flight.
    setPhase(0);
    const ticker = setInterval(() => setPhase((p) => Math.min(p + 1, HUNTING.length - 1)), 650);
    try {
      const res = await fetch("/api/demo/hunt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: value }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "The hunt failed. Try again.");
        setState("error");
        return;
      }
      setHunt(data as DemoHunt);
      setState("done");
    } catch {
      setError("Network hiccup. Try again.");
      setState("error");
    } finally {
      clearInterval(ticker);
    }
  }

  const best = hunt?.results.find((r) => r.priceValue != null);

  return (
    <div className="w-full">
      {/* Search bar */}
      <form
        onSubmit={(e) => { e.preventDefault(); run(query); }}
        className="relative flex items-center gap-2 rounded-2xl border border-border bg-card p-2 shadow-xl shadow-primary/5 focus-within:border-primary/50"
      >
        <Search className="ml-2 h-5 w-5 shrink-0 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Hunt anything, e.g. pre-owned RTX 4090 under $900"
          className="min-w-0 flex-1 bg-transparent py-2 text-base text-foreground outline-none placeholder:text-muted-foreground/70"
          aria-label="Hunt query"
        />
        <button
          type="submit"
          disabled={state === "loading" || !query.trim()}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-60"
        >
          {state === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Hunt <ArrowRight className="h-4 w-4" /></>}
        </button>
      </form>

      {/* Starter chips */}
      {state === "idle" && (
        <div className="mt-3 flex flex-wrap gap-2">
          {CHIPS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => run(c)}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Loading ticker */}
      <AnimatePresence>
        {state === "loading" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"
          >
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span>{HUNTING[phase]}...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {state === "error" && (
        <p className="mt-4 rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
          {error}{" "}
          <Link href="/sign-up" className="font-medium text-primary hover:underline">Sign up free</Link>.
        </p>
      )}

      {/* Results */}
      <AnimatePresence>
        {state === "done" && hunt && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {hunt.results.length} found for &ldquo;{hunt.query}&rdquo;, cheapest first
              </span>
              {hunt.provider === "live" ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 font-medium text-success">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
                  live
                </span>
              ) : (
                <span
                  title="A representative hunt. Sign up and your agent runs every hunt live across the web."
                  className="rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground"
                >
                  example
                </span>
              )}
            </div>

            <div className="space-y-2">
              {hunt.results.map((r, i) => (
                <ResultRow key={r.url + i} r={r} i={i} isBest={best === r} />
              ))}
            </div>

            {/* The bridge to the paid feature: turn this hunt into a Radar scan. */}
            <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-2.5">
                <Radar className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm text-foreground">
                  Want this watched 24/7? Radar re-runs this hunt around the clock
                  and pings you the second a better one is listed.
                </p>
              </div>
              <Link
                href={`/sign-up?intent=${encodeURIComponent(hunt.query)}`}
                onClick={() => rememberIntent(hunt.query)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5"
              >
                Watch with Radar <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {hunt.provider === "sample" && (
              <p className="mt-2 text-center text-xs text-muted-foreground">
                This is an example. Sign up and your agent runs this hunt live
                across every marketplace.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ResultRow({ r, i, isBest }: { r: DemoResult; i: number; isBest: boolean }) {
  return (
    <motion.a
      href={r.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05 }}
      className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-3 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
    >
      {/* Thumb */}
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted">
        {r.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={r.image} alt="" className="h-full w-full object-cover" loading="lazy" draggable={false} />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold uppercase text-muted-foreground">
            {r.source.slice(0, 2)}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium text-foreground">{r.title}</p>
          {isBest && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
              <Tag className="h-3 w-3" /> best price
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {r.source}
          {r.condition ? ` · ${r.condition}` : ""}
        </p>
      </div>

      {/* Price */}
      <div className="shrink-0 text-right">
        {r.price ? (
          <span className="font-brand text-lg text-foreground">{r.price}</span>
        ) : (
          <span className="text-xs text-muted-foreground">view</span>
        )}
        <ArrowRight className="ml-auto mt-0.5 h-3.5 w-3.5 -translate-x-1 text-primary opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
      </div>
    </motion.a>
  );
}
