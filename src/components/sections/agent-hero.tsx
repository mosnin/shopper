"use client";

// The agent-first hero. Shopper is the shopping engine for AI agents, so the
// hero sells exactly that: a one-line connect, a live tool-call transcript,
// and the numbers that make it credible (52 MCP tools, Radar, x402 self-pay).
// Content is stationary; only the ambient product tiles float. Light on
// mobile: fewer tiles, static blobs, small image requests.

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { ArrowRight, Check, Copy, Radar as RadarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/* ----------------------------- Connect card ----------------------------- */

const MCP_URL = "https://shopper.sh/api/mcp";

const CONNECT_TABS = [
  {
    id: "claude",
    label: "Claude Code",
    code: `claude mcp add --transport http shopper ${MCP_URL}`,
    lang: "shell",
  },
  {
    id: "cursor",
    label: "Cursor",
    code: `{
  "mcpServers": {
    "shopper": { "url": "${MCP_URL}" }
  }
}`,
    lang: "json",
  },
  {
    id: "any",
    label: "Any agent",
    code: `# Streamable HTTP + OAuth or API key
${MCP_URL}`,
    lang: "shell",
  },
] as const;

function ConnectCard() {
  const [tab, setTab] = useState<(typeof CONNECT_TABS)[number]["id"]>("claude");
  const [copied, setCopied] = useState(false);
  const active = CONNECT_TABS.find((t) => t.id === tab) ?? CONNECT_TABS[0];

  async function copy() {
    try {
      await navigator.clipboard.writeText(active.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable; the code is selectable */
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-[#0B1120] shadow-2xl shadow-primary/10">
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <div className="flex items-center gap-1">
          {CONNECT_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                tab === t.id
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:text-slate-200",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy to clipboard"
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      {/* Code */}
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-relaxed text-slate-100">
        <code>{active.code}</code>
      </pre>
      {/* One-liner under the code */}
      <div className="border-t border-white/10 px-4 py-2.5 text-xs text-slate-400">
        One line. Your agent gets 52 shopping tools, memory, and a wallet.
      </div>
    </div>
  );
}

/* --------------------------- Live transcript ---------------------------- */

type Line =
  | { kind: "user"; text: string }
  | { kind: "tool"; name: string; args: string }
  | { kind: "result"; text: string }
  | { kind: "radar"; text: string };

const SCRIPT: Line[] = [
  { kind: "user", text: "Find a pre-owned RTX 4090 under $900" },
  { kind: "tool", name: "find_items", args: '{ "query": "pre-owned RTX 4090 under $900" }' },
  { kind: "result", text: "7 listings found. Best: $849, local pickup, seller verified." },
  { kind: "tool", name: "save_item", args: '{ "title": "RTX 4090 FE", "price": "$849" }' },
  { kind: "result", text: "Saved to wish list." },
  { kind: "radar", text: "Radar armed: watching for new 4090 listings under $900." },
];

function Transcript({ reduce }: { reduce: boolean }) {
  const [step, setStep] = useState(reduce ? SCRIPT.length : 0);

  useEffect(() => {
    if (reduce) return;
    if (step >= SCRIPT.length) {
      const reset = setTimeout(() => setStep(0), 6000);
      return () => clearTimeout(reset);
    }
    const t = setTimeout(() => setStep((s) => s + 1), step === 0 ? 900 : 1100);
    return () => clearTimeout(t);
  }, [step, reduce]);

  return (
    <div className="rounded-2xl border border-border bg-card/80 p-4 backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Live from a connected agent
        </span>
        <span className="inline-flex items-center gap-1.5 text-[0.65rem] font-medium text-success">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
          connected
        </span>
      </div>
      <div className="min-h-[196px] space-y-2 font-mono text-[12.5px] leading-relaxed">
        <AnimatePresence initial={false}>
          {SCRIPT.slice(0, step || (reduce ? SCRIPT.length : 0)).map((line, i) => (
            <motion.div
              key={i}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "rounded-lg px-3 py-1.5",
                line.kind === "user" && "bg-primary/10 text-foreground",
                line.kind === "tool" && "text-muted-foreground",
                line.kind === "result" && "text-foreground",
                line.kind === "radar" && "bg-warning/10 text-foreground",
              )}
            >
              {line.kind === "user" && <span>&gt; {line.text}</span>}
              {line.kind === "tool" && (
                <span>
                  <span className="text-primary">{line.name}</span>
                  <span className="opacity-70">({line.args})</span>
                </span>
              )}
              {line.kind === "result" && <span>{line.text}</span>}
              {line.kind === "radar" && (
                <span className="inline-flex items-start gap-1.5">
                  <RadarIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
                  {line.text}
                </span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------- Ambient product tiles ------------------------ */

const TILES = [
  { src: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=70&w=420&auto=format&fit=crop", cls: "left-[4%] top-[16%] h-28 w-28 rounded-[2rem] rotate-[-6deg]", d: 7 },
  { src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=70&w=420&auto=format&fit=crop", cls: "left-[10%] bottom-[12%] h-32 w-32 rounded-full rotate-[5deg]", d: 9 },
  { src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=70&w=420&auto=format&fit=crop", cls: "right-[6%] top-[14%] h-28 w-28 rounded-[2rem] rotate-[7deg]", d: 8 },
  { src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=70&w=420&auto=format&fit=crop", cls: "right-[12%] bottom-[16%] h-32 w-32 rounded-full rotate-[-4deg]", d: 10 },
];

/* --------------------------------- Hero --------------------------------- */

const STATS = [
  { value: "52", label: "MCP tools" },
  { value: "24/7", label: "Radar scans" },
  { value: "USDC", label: "agents pay their own way" },
  { value: "100%", label: "your data, exportable" },
];

export function AgentHero() {
  const reduce = useReducedMotion() ?? false;

  return (
    <section className="relative flex min-h-[100svh] w-full flex-col justify-center overflow-hidden bg-background pb-16 pt-28 sm:pt-32">
      {/* Backdrop: brand wash + soft blobs (static, cheap) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-56 bg-[linear-gradient(to_bottom,rgba(37,99,235,0.10),transparent)]" />
        <div className="absolute left-[-12%] top-[-8%] h-[46vw] w-[46vw] rounded-full bg-[#3B82F6] opacity-25 blur-[110px] dark:opacity-20" />
        <div className="absolute bottom-[-14%] right-[-8%] h-[42vw] w-[42vw] rounded-full bg-[#22C55E] opacity-20 blur-[110px] dark:opacity-15" />
        <div className="absolute bottom-[-10%] left-[24%] h-[36vw] w-[36vw] rounded-full bg-[#FACC15] opacity-20 blur-[120px] dark:opacity-10" />
      </div>

      {/* Ambient product tiles: desktop only, gentle float, never near the copy */}
      <div className="pointer-events-none absolute inset-0 hidden xl:block" aria-hidden>
        {TILES.map((t, i) => (
          <motion.div
            key={i}
            animate={reduce ? undefined : { y: [0, -18, 0] }}
            transition={{ duration: t.d, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
            className={cn("absolute overflow-hidden border border-border/60 bg-card shadow-xl shadow-slate-900/10", t.cls)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={t.src} alt="" loading="lazy" className="h-full w-full object-cover" draggable={false} />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:px-8">
        {/* Left: the pitch */}
        <div className="flex flex-col items-start text-left">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            The shopping engine for AI agents
          </motion.p>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="font-brand text-4xl leading-[1.04] tracking-tight text-foreground sm:text-6xl"
          >
            Give your agents
            <span className="block text-gradient-orange">buying power</span>
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground"
          >
            Connect any MCP agent in one line. It hunts the whole web for what
            you want, watches new listings around the clock with Radar, keeps
            structured wish lists and shopping lists, and pays for its own usage
            when you let it.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="mt-7 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-primary/40"
            >
              Connect your agent
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-7 py-3.5 text-base font-medium text-muted-foreground backdrop-blur transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              Free to start
            </Link>
          </motion.div>

          {/* Proof row */}
          <motion.dl
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.26 }}
            className="mt-10 grid w-full max-w-xl grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4"
          >
            {STATS.map((s) => (
              <div key={s.label} className="border-l-2 border-primary/30 pl-3">
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-brand text-xl text-foreground">{s.value}</dd>
                <dd className="text-xs leading-snug text-muted-foreground">{s.label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Right: connect + live transcript */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col gap-4"
        >
          <ConnectCard />
          <Transcript reduce={reduce} />
        </motion.div>
      </div>
    </section>
  );
}
