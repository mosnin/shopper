"use client";

// The outcome-first hero. It leads with the reseller's pain (never overpay,
// never miss the deal), puts a REAL live hunt dead center so a visitor feels
// the product work before signing up, and keeps "connect your own agent" as
// the second beat for builders. Light on mobile: static blobs, no float.

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check, Copy, Radar as RadarIcon } from "lucide-react";
import { RotatingWord } from "@/components/ui/rotating-word";
import { LiveHunt } from "@/components/marketing/live-hunt";
import { MCP_URL } from "@/components/marketing/connect-tabs";

const STATS = [
  { value: "52", label: "MCP tools" },
  { value: "24/7", label: "Radar scans" },
  { value: "USDC", label: "agents self-pay" },
  { value: "1 line", label: "to connect" },
];

function ConnectStrip() {
  const [copied, setCopied] = useState(false);
  const cmd = `claude mcp add --transport http shopper ${MCP_URL}`;
  async function copy() {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  }
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-2 rounded-2xl border border-border bg-[#0B1120] p-2 sm:flex-row sm:items-center">
      <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap px-3 py-2 font-mono text-xs text-slate-100">
        {cmd}
      </code>
      <button
        type="button"
        onClick={copy}
        className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-200 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

export function AgentHero() {
  const reduce = useReducedMotion() ?? false;

  return (
    <section className="relative w-full overflow-hidden bg-background pb-20 pt-28 sm:pt-32">
      {/* Backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-64 bg-[linear-gradient(to_bottom,rgba(37,99,235,0.10),transparent)]" />
        <div className="absolute left-[-12%] top-[-8%] h-[46vw] w-[46vw] rounded-full bg-[#3B82F6] opacity-20 blur-[120px]" />
        <div className="absolute right-[-10%] top-[10%] h-[40vw] w-[40vw] rounded-full bg-[#22C55E] opacity-15 blur-[120px]" />
        <div className="absolute bottom-[-16%] left-[26%] h-[38vw] w-[38vw] rounded-full bg-[#FACC15] opacity-15 blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          The shopping engine for AI agents, resellers, and deal-hunters
        </motion.p>

        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="font-brand text-4xl leading-[1.05] tracking-tight text-foreground sm:text-6xl"
        >
          Never miss an underpriced{" "}
          <RotatingWord
            words={["GPU", "grail", "project car", "supplier"]}
            className="text-gradient-orange"
          />{" "}
          again
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground"
        >
          Shopper hunts every marketplace, forum, and local seller, ranks the
          deals cheapest first, and watches 24/7 with Radar. Try a real hunt
          right now, no sign up.
        </motion.p>

        {/* THE MOMENT: a real, live hunt */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="mx-auto mt-8 max-w-2xl text-left"
        >
          <LiveHunt />
        </motion.div>

        {/* Proof row */}
        <motion.dl
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mx-auto mt-10 grid max-w-xl grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4"
        >
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-brand text-xl text-foreground">{s.value}</dd>
              <dd className="text-xs leading-snug text-muted-foreground">{s.label}</dd>
            </div>
          ))}
        </motion.dl>

        {/* Second beat: builders connect their own agent */}
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.36 }}
          className="mx-auto mt-12 max-w-2xl border-t border-border pt-8"
        >
          <p className="mb-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <RadarIcon className="h-4 w-4 text-primary" />
            Run your own agent? Point any MCP client at Shopper in one line.
          </p>
          <ConnectStrip />
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              Start free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/connect"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              Connect guide
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
