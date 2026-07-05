import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ConnectTabs } from "@/components/marketing/connect-tabs";
import { MCP_TOOL_COUNT } from "@/lib/mcp-catalog";
import { ArrowRight, KeyRound, Plug, Radar, Wallet } from "lucide-react";

export const metadata: Metadata = {
  title: "Connect your agent | Shopper",
  description:
    "Point any MCP agent at Shopper in one line. Claude Code, Cursor, Codex, OpenClaw, Hermes, or anything that speaks MCP. OAuth or API key.",
};

const steps = [
  {
    n: "1",
    title: "Add the endpoint",
    body: "Drop the one-line config into your MCP client. That is the whole install.",
  },
  {
    n: "2",
    title: "Authorize",
    body: "Sign in with OAuth on first call, or paste an API key from Settings. Your agent is now scoped to your account.",
  },
  {
    n: "3",
    title: "Tell it what you want",
    body: `Your agent can call all ${MCP_TOOL_COUNT} tools: hunt the web, save finds, vet sellers, work lists, and top up its own credits.`,
  },
];

const facts = [
  { icon: Plug, title: "Any MCP client", body: "Claude Code, Cursor, Codex, OpenClaw, Hermes, or your own. Streamable HTTP." },
  { icon: KeyRound, title: "OAuth or API key", body: "OAuth on first connect, or per-agent API keys you can rotate and revoke." },
  { icon: Radar, title: "Shared state", body: "Every agent you connect works from one wish list, lists, and memory." },
  { icon: Wallet, title: "Agents self-pay", body: "Over x402, an agent buys its own credits in USDC, capped by what you fund." },
];

export default function ConnectPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-28 sm:pt-32">
        <section className="relative overflow-hidden pb-10">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[linear-gradient(to_bottom,rgba(37,99,235,0.10),transparent)]" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary">Connect</p>
              <h1 className="font-brand mt-3 text-4xl tracking-tight text-foreground sm:text-5xl">
                Give your agent{" "}
                <span className="text-gradient-orange">buying power</span>
              </h1>
              <p className="mt-4 max-w-xl text-lg text-muted-foreground">
                One line points any MCP agent at Shopper. No SDK, no glue code.
                Sign in and your agent starts hunting.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/sign-up"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5"
                >
                  Create an account <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-3.5 text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  See all {MCP_TOOL_COUNT} tools
                </Link>
              </div>
            </div>
            <ConnectTabs />
          </div>
        </section>

        <section className="py-8">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {facts.map((f) => (
                <div key={f.title} className="rounded-2xl border border-border bg-card p-5">
                  <f.icon className="h-5 w-5 text-primary" aria-hidden />
                  <h3 className="font-brand mt-3 text-base text-foreground">{f.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              {steps.map((s) => (
                <div key={s.n} className="flex gap-4 rounded-2xl border border-border bg-card p-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-brand text-primary">
                    {s.n}
                  </span>
                  <div>
                    <h3 className="font-brand text-base text-foreground">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
