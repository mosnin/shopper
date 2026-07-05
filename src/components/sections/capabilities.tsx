"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

/**
 * The interactive heart of the homepage: a segmented showcase of what an agent
 * does inside Shopper. Selecting a capability swaps a bespoke, animated mini-UI
 * that demonstrates it rather than describing it. It auto-advances and pauses
 * the moment the visitor takes over. Reduced motion shows the first panel
 * static, still selectable.
 */

const EASE = [0.16, 1, 0.3, 1] as const;
const AUTO_MS = 5200;

type Cap = {
  id: string;
  label: string;
  title: string;
  body: string;
};

const caps: Cap[] = [
  {
    id: "hunt",
    label: "Web-wide hunts",
    title: "One find_items call hunts the whole web",
    body: "Your agent calls find_items and Shopper fans the hunt out across stores, marketplaces, and local sellers, with search engines under the hood (Exa, Firecrawl, Tavily). Back come structured listings with price and seller, not a page of links.",
  },
  {
    id: "deep",
    label: "Deep browser",
    title: "A real browser when scraping is not enough",
    body: "The best deals hide on marketplaces and forums that fight scrapers. Your agent opens a deep browser session and works them page by page: listings read, sellers rated, finds saved straight to the wish list.",
  },
  {
    id: "radar",
    label: "Radar scans",
    title: "Standing scans that watch the web 24/7",
    body: "Set a Radar: recently listed pre-owned GPUs at a good price, a grail sneaker in your size, a project car. It keeps scanning around the clock and drops every match into your wish list. On paid plans.",
  },
  {
    id: "lists",
    label: "Shared state",
    title: "Wish list and shopping lists as agent state",
    body: "Full CRUD over your wish list and shopping lists: the grocery run, the move, auto parts, office supplies. Every agent you connect reads and writes the same lists, so nothing lives and dies in one chat.",
  },
  {
    id: "about",
    label: "About You memory",
    title: "Context that persists across every client",
    body: "Sizes, budgets, preferences, and no-gos live in About You, plus recall and remember tools for everything else. It persists across sessions and across clients, so a hunt started in Claude Code picks up in Cursor.",
  },
  {
    id: "sourcing",
    label: "Agents pay their own way",
    title: "Your agent buys its own credits with x402",
    body: "Running low mid-hunt? Your agent pays over HTTP 402 with USDC and keeps working, no card form, no human in the loop. Credits and plans, bought by the agent itself. No other shopping MCP does this.",
  },
];

/* ------------------------------- Panels ----------------------------------- */

const panelContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
};
const panelItem = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: EASE } },
};

function PanelFrame({ children, reduce }: { children: React.ReactNode; reduce: boolean | null }) {
  return (
    <motion.div
      variants={reduce ? undefined : panelContainer}
      initial={reduce ? false : "hidden"}
      animate="show"
      className="flex h-full flex-col gap-2"
    >
      {children}
    </motion.div>
  );
}

function HuntPanel({ reduce }: { reduce: boolean | null }) {
  const found = [
    { name: "RTX 4090, pre-owned", price: "$1,140" },
    { name: "RTX 4090 FE, open box", price: "$1,289" },
    { name: "RTX 4090, refurb + warranty", price: "$1,310" },
    { name: "RTX 4090, local pickup", price: "$1,050" },
  ];
  return (
    <PanelFrame reduce={reduce}>
      <motion.div variants={panelItem} className="flex items-center gap-2 rounded-xl border border-border bg-background/60 px-3 py-2.5 font-mono text-xs text-foreground/80 dark:border-white/10 dark:bg-white/[0.03]">
        <span className="text-muted-foreground">find_items</span>
        pre-owned RTX 4090 under $1,400
      </motion.div>
      <motion.p variants={panelItem} className="px-1 text-[11px] text-muted-foreground">
        23 listings found across 9 sites, best 4 shown
      </motion.p>
      <div className="space-y-1.5">
        {found.map((f) => (
          <motion.div
            key={f.name}
            variants={panelItem}
            className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2.5 dark:border-white/10"
          >
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="font-brand text-sm text-foreground">{f.name}</span>
            </div>
            <span className="font-mono text-[11px] text-muted-foreground">{f.price}</span>
          </motion.div>
        ))}
      </div>
    </PanelFrame>
  );
}

function DeepPanel({ reduce }: { reduce: boolean | null }) {
  const lines = [
    { t: "scrape blocked: storefront needs javascript", muted: true },
    { t: "launching browser session", muted: true },
    { t: "logged marketplace, 3 pages of listings read", muted: false },
    { t: "seller ratings and 41 reviews collected", muted: false },
  ];
  return (
    <PanelFrame reduce={reduce}>
      <div className="space-y-1 rounded-xl border border-border bg-background/60 p-3 font-mono text-xs dark:border-white/10 dark:bg-white/[0.03]">
        {lines.map((l) => (
          <motion.p key={l.t} variants={panelItem} className={l.muted ? "text-muted-foreground" : "text-foreground"}>
            <span className="text-primary">{"> "}</span>
            {l.t}
          </motion.p>
        ))}
        <motion.p variants={panelItem} className="flex items-center gap-1.5 pt-1 text-success">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          2 finds saved to wish list
        </motion.p>
      </div>
      <motion.p variants={panelItem} className="px-1 pt-1 text-[11px] text-muted-foreground">
        A real browser reaching forums, marketplaces, and stores a plain search misses
      </motion.p>
    </PanelFrame>
  );
}

function RadarPanel({ reduce }: { reduce: boolean | null }) {
  const matches = [
    { name: "Gucci loafers, 10M", note: "$342, listed 2h ago" },
    { name: "Gucci Jordaan, 10M", note: "$389, listed today" },
  ];
  return (
    <PanelFrame reduce={reduce}>
      <motion.div variants={panelItem} className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2.5 dark:border-white/10">
        <span className="font-brand text-sm text-foreground">Gucci shoes, 10M, under $400</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          scanning
        </span>
      </motion.div>
      <motion.p variants={panelItem} className="px-1 text-[11px] text-muted-foreground">
        2 new matches since yesterday
      </motion.p>
      <div className="space-y-1.5">
        {matches.map((m) => (
          <motion.div
            key={m.name}
            variants={panelItem}
            className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2.5 dark:border-white/10"
          >
            <span className="font-brand text-sm text-foreground">{m.name}</span>
            <span className="font-mono text-[11px] text-muted-foreground">{m.note}</span>
          </motion.div>
        ))}
      </div>
    </PanelFrame>
  );
}

function ListsPanel({ reduce }: { reduce: boolean | null }) {
  const items = [
    { name: "Espresso grinder", state: "found, 3 options" },
    { name: "Walnut console table", state: "hunting" },
    { name: "Brake pads, 2019 Outback", state: "purchased" },
    { name: "Office chairs x6", state: "found, quote saved" },
  ];
  return (
    <PanelFrame reduce={reduce}>
      <motion.p variants={panelItem} className="px-1 text-[11px] text-muted-foreground">
        Shopping list: the move
      </motion.p>
      <div className="space-y-1.5">
        {items.map((it) => (
          <motion.div
            key={it.name}
            variants={panelItem}
            className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2.5 dark:border-white/10"
          >
            <div className="flex items-center gap-2">
              <span className={"h-1.5 w-1.5 rounded-full " + (it.state === "purchased" ? "bg-success" : "bg-primary")} />
              <span className={"font-brand text-sm " + (it.state === "purchased" ? "text-muted-foreground line-through" : "text-foreground")}>
                {it.name}
              </span>
            </div>
            <span className="font-mono text-[11px] text-muted-foreground">{it.state}</span>
          </motion.div>
        ))}
      </div>
    </PanelFrame>
  );
}

function AboutYouPanel({ reduce }: { reduce: boolean | null }) {
  const facts = [
    { k: "Shoe size", v: "10M", src: "you" },
    { k: "Style", v: "mid-century, walnut", src: "agent" },
    { k: "GPU budget", v: "under $1,400", src: "you" },
    { k: "Avoid", v: "drop-ship storefronts", src: "agent" },
  ];
  return (
    <PanelFrame reduce={reduce}>
      <motion.div variants={panelItem} className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2.5 dark:border-white/10">
        <span className="font-brand text-sm text-foreground">About You</span>
        <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">read on every hunt</span>
      </motion.div>
      <div className="space-y-1">
        {facts.map((f) => (
          <motion.div key={f.k} variants={panelItem} className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 hover:bg-muted/50 dark:hover:bg-white/[0.03]">
            <span className="w-24 shrink-0 text-xs text-muted-foreground">{f.k}</span>
            <span className="flex-1 truncate text-sm text-foreground">{f.v}</span>
            <span className="shrink-0 font-mono text-[10px] text-muted-foreground/70">via {f.src}</span>
          </motion.div>
        ))}
      </div>
    </PanelFrame>
  );
}

function SourcingPanel({ reduce }: { reduce: boolean | null }) {
  const rows = [
    { name: "HTTP 402 quote", check: "received" },
    { name: "USDC payment", check: "settled on-chain" },
    { name: "Credits topped up", check: "hunt resumed" },
  ];
  return (
    <PanelFrame reduce={reduce}>
      <motion.div variants={panelItem} className="flex items-center gap-2 rounded-xl border border-border bg-background/60 px-3 py-2.5 font-mono text-xs text-foreground/80 dark:border-white/10 dark:bg-white/[0.03]">
        <span className="text-muted-foreground">x402</span>
        buy_credits, paid in USDC
      </motion.div>
      <motion.p variants={panelItem} className="px-1 text-[11px] text-muted-foreground">
        The agent pays and keeps working, no human in the loop
      </motion.p>
      <div className="space-y-1.5">
        {rows.map((r) => (
          <motion.div
            key={r.name}
            variants={panelItem}
            className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2.5 dark:border-white/10"
          >
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              <span className="font-brand text-sm text-foreground">{r.name}</span>
            </div>
            <span className="font-mono text-[11px] text-muted-foreground">{r.check}</span>
          </motion.div>
        ))}
      </div>
    </PanelFrame>
  );
}

function Panel({ id, reduce }: { id: string; reduce: boolean | null }) {
  if (id === "hunt") return <HuntPanel reduce={reduce} />;
  if (id === "deep") return <DeepPanel reduce={reduce} />;
  if (id === "radar") return <RadarPanel reduce={reduce} />;
  if (id === "lists") return <ListsPanel reduce={reduce} />;
  if (id === "about") return <AboutYouPanel reduce={reduce} />;
  return <SourcingPanel reduce={reduce} />;
}

/* ------------------------------- Section ---------------------------------- */

export function CapabilitiesSection() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  }, []);

  useEffect(() => {
    if (reduce || paused) {
      stop();
      return;
    }
    timer.current = setInterval(() => setActive((a) => (a + 1) % caps.length), AUTO_MS);
    return stop;
  }, [reduce, paused, stop]);

  const select = useCallback((i: number) => {
    setActive(i);
    setPaused(true);
  }, []);

  const cap = caps[active];

  return (
    <section
      id="capabilities"
      className="relative overflow-hidden scroll-mt-24 bg-muted/30 py-24 dark:bg-background sm:py-32"
    >
      {/* Section-top wash: a whisper of brand blue for rhythm and dark-mode depth. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(37,99,235,0.06),transparent_70%)]"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-primary">What your agent gets</p>
          <h2 className="font-brand mt-3 text-3xl text-foreground sm:text-4xl lg:text-5xl">
            52 tools. <span className="text-gradient-orange">One shopping engine.</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Hunts, deep browser sessions, Radar scans, lists, memory, seller
            vetting, even billing: everything an agent needs to shop, over one
            MCP connection. Your data stays yours: exportable, never resold.
          </p>
        </div>

        <div
          className="mt-14 overflow-hidden rounded-[2rem] border border-border bg-card shadow-xl shadow-black/[0.04] dark:border-white/10 dark:shadow-black/40"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="grid lg:grid-cols-[minmax(0,300px)_1fr]">
            {/* Segmented control */}
            <div className="flex gap-2 overflow-x-auto border-b border-border p-4 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:border-b-0 lg:border-r dark:border-white/10">
              {caps.map((c, i) => {
                const on = i === active;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => select(i)}
                    aria-pressed={on}
                    className={
                      "group relative shrink-0 rounded-2xl px-4 py-3 text-left transition-colors lg:shrink " +
                      (on ? "bg-primary/10" : "hover:bg-muted/60 dark:hover:bg-white/[0.03]")
                    }
                  >
                    <span className={"font-brand text-sm " + (on ? "text-primary" : "text-foreground")}>
                      {c.label}
                    </span>
                    {/* auto-advance progress, desktop only */}
                    {on && !reduce && !paused && (
                      <motion.span
                        key={`p-${active}`}
                        className="absolute bottom-1.5 left-4 right-4 hidden h-0.5 origin-left rounded-full bg-primary/50 lg:block"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: AUTO_MS / 1000, ease: "linear" }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Copy + animated panel */}
            <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-2 lg:items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`copy-${cap.id}`}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <h3 className="font-brand text-xl text-foreground sm:text-2xl">{cap.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{cap.body}</p>
                </motion.div>
              </AnimatePresence>

              <div className="relative min-h-[300px] rounded-2xl border border-border bg-muted/30 p-3 dark:border-white/10 dark:bg-white/[0.02]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`panel-${cap.id}`}
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduce ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="h-full"
                  >
                    <Panel id={cap.id} reduce={reduce} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
