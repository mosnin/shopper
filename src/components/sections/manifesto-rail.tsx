"use client";

/**
 * ManifestoRail - a SidePanel motion surface (see DESIGN.md, Motion Surfaces)
 * pinned to the page's left edge. Collapsed it is a quiet spine labeled with
 * the toggle; opened, it stretches across the page and speaks the manifesto's
 * core belief with a path to the full page. A moment of conviction between
 * the about section and the closing CTA.
 */

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SidePanel } from "@/components/ui/side-panel";

export function ManifestoRail() {
  const [open, setOpen] = useState(false);

  return (
    <section aria-label="The manifesto" className="py-10 sm:py-14">
      <SidePanel
        panelOpen={open}
        handlePanelOpen={() => setOpen((v) => !v)}
        className="bg-card"
        renderButton={(toggle) => (
          <button
            type="button"
            onClick={toggle}
            aria-expanded={open}
            className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="font-brand">{open ? "Close" : "Why we built this"}</span>
          </button>
        )}
      >
        <div className="px-6 pb-8 pt-2 md:px-10">
          <p className="max-w-3xl font-brand text-xl leading-snug text-foreground sm:text-2xl">
            Shopping is work agents should do. We do not think it is a feature you bolt onto an LLM. It is the product.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            So we built the engine: a structured place where every find is typed,
            priced, and yours, with a real interface a human can browse and an
            agent can operate over the same surface. Your lists compound instead
            of scrolling away, and the leverage stays quiet: your agents, already
            hunting for you.
          </p>
          <Link
            href="/manifesto"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            Read the manifesto
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </SidePanel>
    </section>
  );
}
