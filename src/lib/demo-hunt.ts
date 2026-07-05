// The public "five second moment" engine. Runs a REAL hunt when a search
// provider is configured (Tavily, then Exa), parses prices, and ranks the
// cheapest first so deals surface. When no provider is configured it returns an
// honest, clearly-labelled sample set so the marketing box still demonstrates
// the shape of the result, never pretending sample data is live.

import { isTavilyConfigured, tavilySearch } from "@/lib/tavily";
import { isExaConfigured, exaDeepSearch } from "@/lib/exa";

export type DemoResult = {
  title: string;
  url: string;
  source: string; // display domain, e.g. "ebay.com"
  price: string | null; // display string, e.g. "$849"
  priceValue: number | null; // numeric for ranking
  condition: string | null;
  image: string | null;
};

export type DemoHunt = {
  provider: "live" | "sample";
  query: string;
  results: DemoResult[];
};

function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

// Pull a plausible listing price from text. Skips obvious non-prices (years,
// huge numbers) and returns the smallest sensible candidate.
function parsePrice(text: string): number | null {
  const matches = text.match(/\$\s?\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\$\s?\d{2,6}(?:\.\d{2})?/g);
  if (!matches) return null;
  const nums = matches
    .map((m) => Number(m.replace(/[^0-9.]/g, "")))
    .filter((n) => Number.isFinite(n) && n >= 10 && n <= 200_000);
  if (!nums.length) return null;
  return Math.min(...nums);
}

function fmtPrice(n: number | null): string | null {
  if (n == null) return null;
  return "$" + Math.round(n).toLocaleString("en-US");
}

function guessCondition(text: string): string | null {
  const t = text.toLowerCase();
  if (/\bbrand new\b|\bnew in box\b|\bnib\b|\bsealed\b/.test(t)) return "new";
  if (/\brefurb/.test(t)) return "refurbished";
  if (/\blike new\b|\bopen box\b/.test(t)) return "like new";
  if (/\bused\b|\bpre-?owned\b|\bsecond ?hand\b/.test(t)) return "used";
  return null;
}

function rank(results: DemoResult[]): DemoResult[] {
  // Priced items first, cheapest to dearest; unpriced after, original order.
  const priced = results.filter((r) => r.priceValue != null).sort((a, b) => (a.priceValue! - b.priceValue!));
  const rest = results.filter((r) => r.priceValue == null);
  return [...priced, ...rest].slice(0, 6);
}

async function liveHunt(query: string): Promise<DemoResult[] | null> {
  const shopQuery = `${query} for sale price listing`;
  try {
    if (isTavilyConfigured()) {
      const raw = await tavilySearch(shopQuery, { maxResults: 12 });
      const mapped = raw.map((r) => {
        const priceValue = parsePrice(`${r.title} ${r.content}`);
        return {
          title: r.title.slice(0, 120),
          url: r.url,
          source: domainOf(r.url),
          price: fmtPrice(priceValue),
          priceValue,
          condition: guessCondition(`${r.title} ${r.content}`),
          image: null,
        } satisfies DemoResult;
      });
      if (mapped.length) return rank(mapped);
    }
    if (isExaConfigured()) {
      const raw = await exaDeepSearch(shopQuery, 12);
      const mapped = raw.map((r) => {
        const text = `${r.title} ${r.summary ?? ""} ${(r.highlights ?? []).join(" ")}`;
        const priceValue = parsePrice(text);
        return {
          title: (r.title ?? "Listing").slice(0, 120),
          url: r.url,
          source: domainOf(r.url),
          price: fmtPrice(priceValue),
          priceValue,
          condition: guessCondition(text),
          image: null,
        } satisfies DemoResult;
      });
      if (mapped.length) return rank(mapped);
    }
  } catch (e) {
    console.warn("[demo-hunt] live provider failed, using sample", e);
  }
  return null;
}

/* ------------------------------- Sample sets ------------------------------ */
// Realistic, honestly-labelled sample listings, keyed by what the query is
// about. Prices and sellers are illustrative. Shown only when no live provider
// is configured, and the UI marks them as samples.

type Sample = Omit<DemoResult, "price"> & { priceValue: number };
const img = (id: string) => `https://images.unsplash.com/photo-${id}?q=70&w=400&auto=format&fit=crop`;

const SAMPLES: { match: RegExp; results: Sample[] }[] = [
  {
    match: /gpu|4090|4080|3090|graphics|rtx|radeon/i,
    results: [
      { title: "NVIDIA RTX 4090 Founders Edition, local pickup", url: "https://www.ebay.com", source: "ebay.com", priceValue: 849, condition: "used", image: img("1591488320449-011701bb6704") },
      { title: "RTX 4090 Gaming OC, open box, tested", url: "https://www.facebook.com/marketplace", source: "facebook.com", priceValue: 899, condition: "like new", image: null },
      { title: "GeForce RTX 4090 24GB, original owner", url: "https://www.reddit.com/r/hardwareswap", source: "reddit.com", priceValue: 925, condition: "used", image: null },
      { title: "RTX 4090 Suprim X, refurbished, warranty", url: "https://www.newegg.com", source: "newegg.com", priceValue: 1099, condition: "refurbished", image: null },
    ],
  },
  {
    match: /sneaker|shoe|gucci|jordan|loafer|nike|yeezy|boot/i,
    results: [
      { title: "Gucci Horsebit Loafers, size 10M, worn twice", url: "https://www.grailed.com", source: "grailed.com", priceValue: 360, condition: "like new", image: img("1543163521-1bf539c55dd2") },
      { title: "Gucci Jordaan Loafer 10, box + dust bag", url: "https://poshmark.com", source: "poshmark.com", priceValue: 385, condition: "used", image: null },
      { title: "Gucci leather loafers 10M, authenticated", url: "https://www.ebay.com", source: "ebay.com", priceValue: 399, condition: "used", image: null },
      { title: "Gucci loafers size 10, deadstock", url: "https://www.stockx.com", source: "stockx.com", priceValue: 540, condition: "new", image: null },
    ],
  },
  {
    match: /car|miata|honda|toyota|truck|motorcycle|project/i,
    results: [
      { title: "1994 Mazda Miata, rust-free, new top", url: "https://www.craigslist.org", source: "craigslist.org", priceValue: 4200, condition: "used", image: img("1494976388531-d1058494cdd8") },
      { title: "NA Miata project, runs, clean title", url: "https://www.facebook.com/marketplace", source: "facebook.com", priceValue: 4800, condition: "used", image: null },
      { title: "Mazda MX-5 1996, one owner, garage kept", url: "https://bringatrailer.com", source: "bringatrailer.com", priceValue: 5600, condition: "used", image: null },
    ],
  },
  {
    match: /chair|desk|aeron|herman|office|furniture|sofa|table/i,
    results: [
      { title: "Herman Miller Aeron Size B, fully loaded", url: "https://www.facebook.com/marketplace", source: "facebook.com", priceValue: 420, condition: "used", image: img("1580480055273-228ff5388ef8") },
      { title: "Aeron Remastered, posture fit, local", url: "https://www.craigslist.org", source: "craigslist.org", priceValue: 520, condition: "like new", image: null },
      { title: "Herman Miller Aeron, refurbished, warranty", url: "https://www.ebay.com", source: "ebay.com", priceValue: 675, condition: "refurbished", image: null },
    ],
  },
];

const DEFAULT_SAMPLE: Sample[] = [
  { title: "Top-rated listing, verified seller, local pickup", url: "https://www.ebay.com", source: "ebay.com", priceValue: 149, condition: "used", image: img("1607082348824-0a96f2a4b9da") },
  { title: "Open-box, tested and working", url: "https://www.facebook.com/marketplace", source: "facebook.com", priceValue: 179, condition: "like new", image: null },
  { title: "Refurbished with warranty", url: "https://www.newegg.com", source: "newegg.com", priceValue: 219, condition: "refurbished", image: null },
];

function sampleHunt(query: string): DemoResult[] {
  const set = SAMPLES.find((s) => s.match.test(query))?.results ?? DEFAULT_SAMPLE;
  return set
    .slice()
    .sort((a, b) => a.priceValue - b.priceValue)
    .map((s) => ({ ...s, price: fmtPrice(s.priceValue) }));
}

export async function runDemoHunt(query: string): Promise<DemoHunt> {
  const clean = query.trim().slice(0, 160);
  const live = clean ? await liveHunt(clean) : null;
  if (live && live.length) return { provider: "live", query: clean, results: live };
  return { provider: "sample", query: clean, results: sampleHunt(clean) };
}
