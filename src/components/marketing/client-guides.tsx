"use client";

import { useState } from "react";
import { Check, ChevronDown, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { MCP_URL } from "@/components/marketing/connect-tabs";

// Per-client setup guides for /connect. Plain accordion state, no new deps.
// Each guide: numbered steps + one copyable code block, dark terminal style
// matching ConnectTabs.

type Guide = {
  id: string;
  label: string;
  steps: string[];
  code: string;
  auth: string;
};

const GUIDES: Guide[] = [
  {
    id: "claude-code",
    label: "Claude Code",
    steps: [
      "Run the add command in your terminal.",
      "Run /mcp inside Claude Code and choose Shopper.",
      "Approve the OAuth prompt in your browser. Your agent is connected.",
    ],
    code: `claude mcp add --transport http shopper ${MCP_URL}`,
    auth: "Uses OAuth: Claude Code opens a browser tab on first /mcp call, you sign in, and the token is stored for you.",
  },
  {
    id: "cursor",
    label: "Cursor",
    steps: [
      "Create (or open) .cursor/mcp.json in your project or home directory.",
      "Paste the snippet below and save.",
      "Reload Cursor. It will prompt you to authorize on first use.",
    ],
    code: `{
  "mcpServers": {
    "shopper": {
      "url": "${MCP_URL}"
    }
  }
}`,
    auth: "Uses OAuth by default: Cursor opens a browser tab to sign in. You can also add an API key header manually if you prefer.",
  },
  {
    id: "codex",
    label: "Codex CLI",
    steps: [
      "Open ~/.codex/config.toml.",
      "Add the mcp_servers.shopper block below.",
      "Restart Codex CLI. It authenticates over OAuth on first call.",
    ],
    code: `[mcp_servers.shopper]
url = "${MCP_URL}"`,
    auth: "Uses OAuth: Codex opens a browser tab on first connection. Codex builds without header support can pass an API key via a proxy instead.",
  },
  {
    id: "openclaw-hermes",
    label: "OpenClaw and Hermes",
    steps: [
      "Grab an API key from Settings > API keys in your Shopper account.",
      "Point your client at the endpoint as a streamable HTTP MCP server.",
      "Add the key as a Bearer token on every request.",
    ],
    code: `MCP endpoint: ${MCP_URL}
Transport: streamable HTTP
Header: Authorization: Bearer <your API key>`,
    auth: "Uses an API key: these clients do not run an OAuth flow, so authenticate with a per-agent key you can rotate or revoke in Settings.",
  },
  {
    id: "any",
    label: "Any MCP client",
    steps: [
      "Point your client's MCP config at the endpoint below.",
      "Choose streamable HTTP as the transport.",
      "Authenticate with OAuth if your client supports it, or an API key from Settings if it does not.",
    ],
    code: `Endpoint: ${MCP_URL}
Authorization: Bearer <API key from Settings>`,
    auth: "Either works: OAuth is the smoothest path when your client supports it; an API key header works everywhere else.",
  },
];

function GuideBlock({ guide }: { guide: Guide }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(guide.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked; the code stays selectable */
    }
  }

  return (
    <div className="space-y-4 px-5 pb-5 pt-1">
      <ol className="space-y-2">
        {guide.steps.map((step, i) => (
          <li key={i} className="flex gap-3 text-sm text-muted-foreground">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
              {i + 1}
            </span>
            <span className="leading-relaxed">{step}</span>
          </li>
        ))}
      </ol>
      <div className="overflow-hidden rounded-xl border border-border bg-[#0B1120]">
        <div className="flex items-center justify-end border-b border-white/10 px-3 py-1.5">
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
        <pre className="overflow-x-auto px-4 py-3 font-mono text-[13px] leading-relaxed text-slate-100">
          <code>{guide.code}</code>
        </pre>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">{guide.auth}</p>
    </div>
  );
}

export function ClientGuides() {
  const [open, setOpen] = useState<string>(GUIDES[0].id);

  return (
    <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
      {GUIDES.map((guide) => {
        const expanded = open === guide.id;
        return (
          <div key={guide.id}>
            <button
              type="button"
              onClick={() => setOpen(expanded ? "" : guide.id)}
              aria-expanded={expanded}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <span className="font-brand text-base text-foreground">{guide.label}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                  expanded && "rotate-180",
                )}
                aria-hidden
              />
            </button>
            {expanded && <GuideBlock guide={guide} />}
          </div>
        );
      })}
    </div>
  );
}
