import { describe, it, expect } from "vitest";
import { runDemoHunt } from "@/lib/demo-hunt";

// No search provider is configured in test, so this exercises the honest
// sample path: it must always return labelled, ranked, non-empty results.
describe("demo hunt (sample path)", () => {
  it("returns ranked sample results for a known category", async () => {
    const r = await runDemoHunt("pre-owned RTX 4090 under $900");
    expect(r.provider).toBe("sample");
    expect(r.results.length).toBeGreaterThan(0);
    // cheapest first
    const priced = r.results.filter((x) => x.priceValue != null).map((x) => x.priceValue!);
    expect(priced).toEqual([...priced].sort((a, b) => a - b));
    // the top result carries a display price
    expect(r.results[0].price).toMatch(/^\$/);
  });

  it("falls back to the default set for an unknown query", async () => {
    const r = await runDemoHunt("some obscure thing 12345");
    expect(r.results.length).toBeGreaterThan(0);
    expect(r.results.every((x) => x.title.length > 0 && x.source.length > 0)).toBe(true);
  });

  it("handles an empty query without throwing", async () => {
    const r = await runDemoHunt("   ");
    expect(r.results.length).toBeGreaterThan(0);
  });
});
