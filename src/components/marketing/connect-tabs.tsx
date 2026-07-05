"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

// The one-line connect snippet, per client. Reused on the hero, the /connect
// page, and integrations. Tabs are copy-paste ready against the live endpoint.
export const MCP_URL = "https://shopper.sh/api/mcp";

const TABS = [
  { id: "claude", label: "Claude Code", code: `claude mcp add --transport http shopper ${MCP_URL}` },
  { id: "cursor", label: "Cursor", code: `{
  "mcpServers": {
    "shopper": { "url": "${MCP_URL}" }
  }
}` },
  { id: "codex", label: "Codex / others", code: `# Any MCP client, Streamable HTTP
# Auth: OAuth (recommended) or an API key header
${MCP_URL}` },
] as const;

export function ConnectTabs({ className }: { className?: string }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("claude");
  const [copied, setCopied] = useState(false);
  const active = TABS.find((t) => t.id === tab) ?? TABS[0];

  async function copy() {
    try {
      await navigator.clipboard.writeText(active.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked; the code stays selectable */
    }
  }

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border bg-[#0B1120] shadow-2xl shadow-primary/10", className)}>
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <div className="flex items-center gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                tab === t.id ? "bg-white/10 text-white" : "text-slate-400 hover:text-slate-200",
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
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-relaxed text-slate-100">
        <code>{active.code}</code>
      </pre>
      <div className="border-t border-white/10 px-4 py-2.5 text-xs text-slate-400">
        One line. Your agent gets 52 tools, shared memory, and a wallet.
      </div>
    </div>
  );
}
