import { describe, it, expect } from "vitest";
import { parsePrice, cleanTitle, refine, type DemoResult } from "@/lib/demo-hunt";

describe("parsePrice", () => {
  it("picks the smallest plausible $ amount in text", () => {
    expect(parsePrice("Was $1,200 now $899, local pickup")).toBe(899);
  });

  it("parses a single simple price", () => {
    expect(parsePrice("Selling for $150 obo")).toBe(150);
  });

  it("parses prices with thousands separators and cents", () => {
    expect(parsePrice("Buy it now $1,249.99")).toBe(1249.99);
  });

  it("ignores a lone 4-digit year-shaped number without a $ sign", () => {
    expect(parsePrice("1994 Mazda Miata, rust-free")).toBe(null);
  });

  it("ignores prices below the plausible floor", () => {
    expect(parsePrice("Shipping is only $5")).toBe(null);
  });

  it("ignores prices above the plausible ceiling", () => {
    expect(parsePrice("Total portfolio value $500,000")).toBe(null);
  });

  it("returns null when there is no dollar amount at all", () => {
    expect(parsePrice("Great condition, message me for details")).toBe(null);
  });

  it("returns the smallest of several valid candidates", () => {
    expect(parsePrice("$300 or best offer, originally $450, trade for $299")).toBe(299);
  });
});

describe("cleanTitle", () => {
  it("strips a trailing site-name tail after a pipe", () => {
    expect(cleanTitle("RTX 4090 Founders Edition | eBay")).toBe("RTX 4090 Founders Edition");
  });

  it("strips a trailing site-name tail after a hyphen", () => {
    expect(cleanTitle("Aeron Chair Size B - Facebook Marketplace")).toBe("Aeron Chair Size B");
  });

  it("collapses repeated whitespace", () => {
    expect(cleanTitle("Gucci   Loafers\n\tsize 10")).toBe("Gucci Loafers size 10");
  });

  it("trims leading and trailing whitespace", () => {
    expect(cleanTitle("   Herman Miller Aeron   ")).toBe("Herman Miller Aeron");
  });

  it("caps the length at 110 characters", () => {
    const long = "A".repeat(200);
    const out = cleanTitle(long);
    expect(out.length).toBe(110);
  });

  it("leaves a normal title unchanged", () => {
    expect(cleanTitle("1994 Mazda Miata, rust-free, new top")).toBe(
      "1994 Mazda Miata, rust-free, new top",
    );
  });
});

describe("refine", () => {
  const mk = (over: Partial<DemoResult>): DemoResult => ({
    title: "Item",
    url: "https://ebay.com/listing/1",
    source: "ebay.com",
    price: null,
    priceValue: null,
    condition: null,
    image: null,
    ...over,
  });

  it("drops results from junk domains even with a price", () => {
    const out = refine([
      mk({ url: "https://en.wikipedia.org/wiki/Thing", source: "wikipedia.org", priceValue: 100, price: "$100" }),
    ]);
    expect(out).toHaveLength(0);
  });

  it("requires either a price or a known marketplace domain", () => {
    const out = refine([
      mk({ url: "https://randomblog.example.com/post", source: "randomblog.example.com", priceValue: null }),
    ]);
    expect(out).toHaveLength(0);
  });

  it("keeps a marketplace result even without a price", () => {
    const out = refine([
      mk({ url: "https://www.ebay.com/itm/1", source: "ebay.com", priceValue: null }),
    ]);
    expect(out).toHaveLength(1);
  });

  it("keeps a non-marketplace result when it has a price", () => {
    const out = refine([
      mk({ url: "https://randomstore.example.com/item", source: "randomstore.example.com", priceValue: 42, price: "$42" }),
    ]);
    expect(out).toHaveLength(1);
  });

  it("caps results to at most two per source", () => {
    const results = [
      mk({ url: "https://ebay.com/1", priceValue: 10, price: "$10" }),
      mk({ url: "https://ebay.com/2", priceValue: 20, price: "$20" }),
      mk({ url: "https://ebay.com/3", priceValue: 30, price: "$30" }),
    ];
    const out = refine(results);
    expect(out).toHaveLength(2);
  });

  it("ranks marketplace + priced results ahead of priced-only non-marketplace results", () => {
    const results = [
      mk({ url: "https://randomstore.example.com/a", source: "randomstore.example.com", priceValue: 5, price: "$5" }),
      mk({ url: "https://ebay.com/a", source: "ebay.com", priceValue: 500, price: "$500" }),
    ];
    const out = refine(results);
    expect(out[0].source).toBe("ebay.com");
    expect(out[1].source).toBe("randomstore.example.com");
  });

  it("sorts cheapest first within the same rank tier", () => {
    const results = [
      mk({ url: "https://ebay.com/a", source: "ebay.com", priceValue: 900, price: "$900" }),
      mk({ url: "https://facebook.com/a", source: "facebook.com", priceValue: 100, price: "$100" }),
      mk({ url: "https://mercari.com/a", source: "mercari.com", priceValue: 500, price: "$500" }),
    ];
    const out = refine(results);
    expect(out.map((r) => r.priceValue)).toEqual([100, 500, 900]);
  });

  it("caps the overall result list at six", () => {
    const results = [
      "ebay.com", "facebook.com", "craigslist.org", "mercari.com",
      "offerup.com", "grailed.com", "poshmark.com", "stockx.com",
    ].map((source, i) =>
      mk({ url: `https://${source}/item-${i}`, source, priceValue: 100 + i, price: `$${100 + i}` }),
    );
    const out = refine(results);
    expect(out.length).toBeLessThanOrEqual(6);
  });

  it("drops a result with no url", () => {
    const out = refine([mk({ url: "", source: "ebay.com" })]);
    expect(out).toHaveLength(0);
  });
});
