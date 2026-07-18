"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, KeyRound, Plug, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// The operator's first look: is an agent connected, what is the endpoint, how
// many tools it has, and what the agents have done lately. Server passes the
// live numbers; this component owns the copy-to-clipboard interaction.

const MCP_URL = "https://shopper.sh/api/mcp";

export function AgentConnectionPanel({
  apiKeys,
  toolCount,
  itemsSaved,
  radarSignals,
}: {
  apiKeys: number;
  toolCount: number;
  itemsSaved: number;
  radarSignals: number;
}) {
  const [copied, setCopied] = useState(false);
  const connected = apiKeys > 0;

  async function copy() {
    try {
      await navigator.clipboard.writeText(MCP_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card">
      <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Status + endpoint */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                connected ? "bg-success/10 text-success" : "bg-warning/10 text-warning",
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", connected ? "bg-success" : "bg-warning")} />
              {connected ? `Connected: ${apiKeys} API key${apiKeys === 1 ? "" : "s"}` : "No agent connected yet"}
            </span>
            <span className="text-xs text-muted-foreground">{toolCount} tools available</span>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <code className="min-w-0 flex-1 truncate rounded-lg border border-border bg-muted px-3 py-2 font-mono text-xs text-foreground">
              {MCP_URL}
            </code>
            <button
              type="button"
              onClick={copy}
              aria-label="Copy MCP endpoint"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <p className="mt-2 text-xs text-muted-foreground">
            {connected
              ? "Point any MCP client at this endpoint. Your agents share one wish list, lists, and memory."
              : "Create an API key, then point Claude Code, Cursor, or any MCP client here to start hunting."}
          </p>
          {!connected && (
            <p className="mt-1 text-xs text-muted-foreground/80">Takes about a minute.</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex shrink-0 flex-wrap gap-2">
          <Link
            href="/settings"
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full bg-primary font-semibold text-primary-foreground transition-all hover:-translate-y-0.5",
              connected ? "px-4 py-2.5 text-sm" : "px-5 py-3 text-base shadow-[0_8px_24px_-6px_rgba(37,99,235,0.5)]",
            )}
          >
            <KeyRound className={connected ? "h-4 w-4" : "h-5 w-5"} />
            {connected ? "Manage keys" : "Create API key"}
          </Link>
          <Link
            href="/connect"
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <Plug className="h-4 w-4" />
            Connect guide
          </Link>
        </div>
      </div>

      {/* Agent activity strip */}
      <div className="grid grid-cols-3 border-t border-border divide-x divide-border">
        <Stat label="Tools" value={String(toolCount)} href="/tools" />
        <Stat label="Items saved" value={String(itemsSaved)} href="/wishlist" />
        <Stat label="Radar finds, 7d" value={String(radarSignals)} href="/radar" />
      </div>
    </div>
  );
}

function Stat({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <Link href={href} className="group flex items-center justify-between px-4 py-3 transition-colors hover:bg-muted/50">
      <div>
        <div className="font-brand text-lg text-foreground">{value}</div>
        <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      </div>
      <ArrowRight className="h-3.5 w-3.5 -translate-x-1 text-primary opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
    </Link>
  );
}
