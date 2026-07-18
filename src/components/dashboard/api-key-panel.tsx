"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, Copy, Check, Plus, KeyRound } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type ApiKey = {
  id: string;
  name: string;
  prefix: string;
  last4: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
};

function CopyableCode({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="flex items-center gap-2 rounded-lg bg-[#0B1120] px-3 py-2.5">
      <code className="min-w-0 flex-1 overflow-x-auto whitespace-pre font-mono text-xs text-slate-100">
        {text}
      </code>
      <Button
        variant="ghost"
        size="icon-sm"
        className="shrink-0 text-slate-300 hover:text-slate-100 hover:bg-white/10"
        onClick={copy}
        aria-label={`Copy ${label}`}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      </Button>
    </div>
  );
}

export function ApiKeyPanel({ mcpUrl }: { mcpUrl: string }) {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  async function load() {
    const res = await fetch("/api/keys");
    if (res.ok) setKeys((await res.json()).keys ?? []);
    setLoaded(true);
  }

  useEffect(() => {
    load();
  }, []);

  async function create() {
    if (!name.trim()) return;
    setBusy(true);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setCreated(data.plaintext);
        setName("");
        load();
      }
    } finally {
      setBusy(false);
    }
  }

  async function revoke(id: string) {
    if (!confirm("Revoke this key? Connected agents using it will lose access."))
      return;
    await fetch(`/api/keys/${id}`, { method: "DELETE" });
    load();
  }

  const activeKeys = keys.filter((k) => !k.revokedAt);
  const revokedKeys = keys.filter((k) => k.revokedAt);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">API keys</CardTitle>
        <CardDescription>
          Mint a key for each agent (OpenClaw, Hermes, Claude Code) so it can
          call the Shopper MCP server as you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Create flow */}
        <div className="space-y-3">
          {created ? (
            <div className="space-y-2 rounded-xl border border-primary/40 bg-primary/5 p-4">
              <p className="text-sm font-medium text-foreground">
                Your new key, shown once
              </p>
              <p className="text-xs text-muted-foreground">
                Copy it now and store it somewhere safe. You will not see it again.
              </p>
              <CopyableCode text={created} label="API key" />
              <Button variant="ghost" size="sm" onClick={() => setCreated(null)}>
                Done
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="Key name (e.g. OpenClaw)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && create()}
              />
              <Button variant="glow" onClick={create} disabled={busy || !name.trim()}>
                <Plus className="mr-1 h-4 w-4" />
                Create key
              </Button>
            </div>
          )}
        </div>

        {/* Key list */}
        {loaded && keys.length === 0 ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <KeyRound className="h-4 w-4" />
            No keys yet. Create one to connect an agent.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {activeKeys.map((k) => (
              <div key={k.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{k.name}</span>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">
                    {k.prefix}...{k.last4} ·{" "}
                    {k.lastUsedAt
                      ? `last used ${new Date(k.lastUsedAt).toLocaleDateString()}`
                      : "never used"}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => revoke(k.id)}
                  aria-label={`Revoke ${k.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {revokedKeys.map((k) => (
              <div key={k.id} className="flex items-center justify-between gap-3 py-3 opacity-60">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{k.name}</span>
                    <Badge variant="destructive">Revoked</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">
                    {k.prefix}...{k.last4}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Point your agent here */}
        <div className="space-y-2 border-t border-border pt-4">
          <p className="text-sm font-medium text-foreground">Point your agent here</p>
          <CopyableCode text={mcpUrl} label="MCP endpoint" />
          <CopyableCode
            text="Authorization: Bearer <your key>"
            label="Authorization header"
          />
          <p className="text-xs text-muted-foreground">
            Need setup steps for a specific client?{" "}
            <Link href="/connect" className="text-primary hover:underline">
              See per-agent connect guides
            </Link>
            .
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
