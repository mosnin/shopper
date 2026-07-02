"use client";

/**
 * AgentCircuitSection - the system, wired. A CircuitBoard visualization
 * customized to Shopper's actual flow: your agent plugs in over MCP, hunts
 * and Radar scans feed vetting and price comparison, every find lands in
 * the wish list core, and the wish list drives your lists and alerts.
 * Animated pulses trace the paths agents actually take through the product
 * (MCP in, finds out). Used on the homepage and /product/how-it-works.
 */

import { useEffect, useState } from "react";
import useMeasure from "react-use-measure";
import { CircuitBoard } from "@/components/ui/circuit-board";
import Border2 from "@/components/pixel-perfect/border2";

const NODES = [
  { id: "agent", x: 70, y: 200, label: "Your agent", status: "active" as const, size: "md" as const },
  { id: "hunt", x: 240, y: 80, label: "Hunt", status: "processing" as const },
  { id: "radar", x: 240, y: 320, label: "Radar", status: "active" as const },
  { id: "vet", x: 420, y: 80, label: "Vet", status: "active" as const },
  { id: "compare", x: 420, y: 320, label: "Compare", status: "processing" as const },
  { id: "wishlist", x: 600, y: 200, label: "Wish List", status: "active" as const, size: "lg" as const },
  { id: "lists", x: 780, y: 120, label: "Lists", status: "active" as const },
  { id: "alerts", x: 780, y: 280, label: "Alerts", status: "active" as const },
];

const CONNECTIONS = [
  { from: "agent", to: "hunt", animated: true },
  { from: "agent", to: "radar", animated: true },
  { from: "hunt", to: "vet", animated: true },
  { from: "radar", to: "compare", animated: true },
  { from: "vet", to: "wishlist", animated: true },
  { from: "compare", to: "wishlist", animated: true },
  { from: "wishlist", to: "lists", animated: true, bidirectional: true },
  { from: "wishlist", to: "alerts", animated: true, bidirectional: true },
];

// Shopper brand brown for traces and pulses; grid stays whisper-quiet.
const BROWN = {
  traceColor: "rgba(65, 45, 21, 0.30)",
  pulseColor: "#412D15",
  nodeColor: "rgba(65, 45, 21, 0.55)",
};

const BOARD_W = 850;
const BOARD_H = 400;

export function AgentCircuit({ className }: { className?: string }) {
  // The board reads theme from the DOM; render after mount to avoid a
  // light/dark mismatch flash during hydration.
  const [mounted, setMounted] = useState(false);
  // Canonical mount-gate pattern (same as dashboard-shell) to avoid a theme
  // mismatch flash during hydration.
  useEffect(() => setMounted(true), []); // eslint-disable-line react-hooks/set-state-in-effect

  // The board positions nodes in fixed pixels, so scale the whole surface to
  // the measured container width instead of overflowing on small screens.
  const [measureRef, bounds] = useMeasure();
  const scale = bounds.width > 0 ? Math.min(bounds.width / BOARD_W, 1) : 1;

  return (
    <div ref={measureRef} className={className} style={{ height: BOARD_H * scale }}>
      {mounted && (
        <div style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
          <CircuitBoard
            nodes={NODES}
            connections={CONNECTIONS}
            width={BOARD_W}
            height={BOARD_H}
            pulseSpeed={2.6}
            traceWidth={2}
            {...BROWN}
          />
        </div>
      )}
    </div>
  );
}

export function AgentCircuitSection() {
  return (
    <section className="relative bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-primary">The system</p>
          <h2 className="font-brand mt-3 text-3xl text-foreground sm:text-4xl lg:text-5xl">
            Your agents plug in over MCP
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Hermes, OpenClaw, Codex, Claude Code, or the built-in Shopper agent:
            hunts and Radar feed vetting and comparison, every find lands in the
            wish list, and the wish list drives your lists and alerts.
          </p>
        </div>

        <div className="relative mx-auto mt-12 w-full max-w-4xl rounded-2xl border border-border bg-card/40 p-3 sm:p-6">
          <Border2 />
          <AgentCircuit className="w-full overflow-hidden" />
        </div>
      </div>
    </section>
  );
}
