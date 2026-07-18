import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ConnectTabs } from "@/components/marketing/connect-tabs";
import { StructuredData } from "@/components/marketing/structured-data";
import { MCP_TOOL_GROUPS, MCP_TOOL_COUNT } from "@/lib/mcp-catalog";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "MCP Tools | Shopper",
  description:
    "The full set of Shopper MCP tools your agent gets in one line: web-wide hunts, wish lists, shopping lists, seller vetting, memory, and agent self-pay.",
};

export default function ToolsPage() {
  return (
    <>
      <StructuredData />
      <Header />
      <main className="flex-1 pt-28 sm:pt-32">
        <section className="relative overflow-hidden pb-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[linear-gradient(to_bottom,rgba(37,99,235,0.10),transparent)]" />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs uppercase tracking-[0.3em] text-primary">The toolbox</p>
            <h1 className="font-brand mt-3 max-w-3xl text-4xl tracking-tight text-foreground sm:text-5xl">
              {MCP_TOOL_COUNT} tools your agent gets in{" "}
              <span className="text-gradient-orange">one line</span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Connect over MCP and every one of these is available to your agent,
              with OAuth or an API key. Reads and writes to your data are free;
              you only spend credits when a tool goes out to the real web.
            </p>
            <div className="mt-8 max-w-xl">
              <ConnectTabs />
            </div>
          </div>
        </section>

        <section className="py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {MCP_TOOL_GROUPS.map((group) => (
                <div key={group.title} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-baseline justify-between gap-2">
                    <h2 className="font-brand text-lg text-foreground">{group.title}</h2>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {group.tools.length}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{group.blurb}</p>
                  <ul className="mt-4 space-y-3">
                    {group.tools.map((tool) => (
                      <li key={tool.name}>
                        <code className="font-mono text-[13px] font-semibold text-primary">{tool.name}</code>
                        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{tool.summary}.</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-3xl border border-border bg-card p-6 text-center sm:flex sm:items-center sm:justify-between sm:text-left">
              <div>
                <p className="font-brand text-lg text-foreground">Plus Radar, in the app</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Standing scans watch the web 24/7 for what you want and drop new
                  finds straight into your wish list. Set them up in the dashboard.
                </p>
              </div>
              <Link
                href="/sign-up"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 sm:mt-0"
              >
                Connect your agent <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
