// Premade skills that teach an agent how to operate Shopper. Surfaced on /skills
// where users can copy them or download as .md to drop into their own agent.

export interface Skill {
  slug: string;
  name: string;
  description: string;
  content: string; // markdown
}

export const SKILLS: Skill[] = [
  {
    slug: "shopper-discover",
    name: "Hunt an item with Shopper",
    description: "Find items, stores, and local sellers and save them to the wish list, deduped and vetted.",
    content: `---
name: shopper-discover
description: Hunt items and sellers with Shopper and save the finds to the wish list.
---

# Hunt an item with Shopper

Use Shopper's hunting tools to turn "I want X" into real, saved, comparable finds.

## When to use
- The user wants something specific ("a used Eames lounge chair under $2k").
- You want real listings and stores, not a raw list of links.

## How to work
1. Ground the hunt first: read the About You context (sizes, brands, budgets)
   so results actually fit the user.
2. Start with the item hunt: describe what you want and pick a count. Shopper
   searches across stores, marketplaces, and listings and returns real finds
   with name, website, and details, saving the new ones to the wish list.
3. For shopping nearby (thrift stores, furniture shops, dealerships), run the
   local store hunt with a query plus a location - it pulls stores from Google
   Maps with phone and address.
4. Use raw web search only for research: price checks, reviews, availability.
   Never present a raw search hit as a vetted find.
5. Review the results, compare prices, and keep the strong ones. Duplicates
   (by domain) are skipped automatically.

## Rules
- Always carry the price, condition, and URL with a saved item.
- Never save a record without a real name. Skip anything labeled unknown.
- One seller per domain. Do not create duplicates.
`,
  },
  {
    slug: "shopper-enrich",
    name: "Vet a seller before you buy",
    description: "Check firmographics, registries, tech stack, and contact info on a seller, accurately.",
    content: `---
name: shopper-enrich
description: Vet sellers and seller contacts in Shopper without ever attaching the wrong record.
---

# Vet a seller before you buy

## Sellers and sources
- Open a seller and enrich it to add company data and firmographics from its
  domain - the first pass on any unknown store or supplier.
- Verify the seller against public registries (GLEIF, Companies House, SEC
  EDGAR) before a big purchase or a new supplier: legal name, jurisdiction,
  registration status, with provenance. This is the scam check.
- Detect the store's tech (ecommerce platform, payments, support tools) to
  judge how established a shop is.

## Seller contacts
- On a seller contact, fill missing fields only: find LinkedIn, email, or phone.
- Email and phone require the contact to be tied to a real seller domain
  (their website, linked seller, or a work email at the store's domain).

## Accuracy (non-negotiable)
- Enrichment must match the RIGHT person and seller. Verify name AND company
  before saving. A work email must be at the seller's own domain.
- If a confident match cannot be made, do nothing and say "couldn't find it".
  A wrong value is never acceptable.
`,
  },
  {
    slug: "shopper-link-contacts",
    name: "Keep the wish list clean",
    description: "Link seller contacts to sellers, dedupe, and bulk-vet the right way.",
    content: `---
name: shopper-link-contacts
description: Keep Shopper tidy: link seller contacts to sellers, dedupe, bulk-vet.
---

# Keep the wish list clean

Shopper is built around the contact-to-seller relationship. A seller contact is
most useful when it belongs to a store, marketplace, or manufacturer.

## Steps
1. For any unassigned seller contact, use "Match to company". Shopper finds
   where they work and links them, creating the seller if needed (never a
   duplicate).
2. Use search + sort on the wish list to find records fast. "Smart sort" ranks
   by how well results match your query; "Score fit" rates each record 0-100
   against your About You context.
3. To vet many at once, select records and use Bulk enrich. Confirm the usage
   prompt first; already-filled fields are skipped.

## Rules
- Match by domain first, then name. Never create a second seller for the same
  domain.
`,
  },
  {
    slug: "shopper-intent-monitors",
    name: "Watch a market with Radar",
    description: "Run Radar standing scans and background research that drop new finds into your wish list.",
    content: `---
name: shopper-intent-monitors
description: Set up Radar standing scans and background research in Shopper.
---

# Watch a market with Radar

## Radar standing scans
- For an item worth waiting for (a discontinued lens, a fair-priced GPU, a
  specific vintage piece), set up a Radar scan with what you want, then
  "Schedule recurring". Shopper re-runs the hunt and saves new matching
  listings automatically, deduped. Radar is available on paid plans.

## Background research
- From "Deep research", schedule a recurring job. Target a specific seller or
  item to keep its notes and prices fresh, or leave it open to save new
  sources as records.

## Notifications
- Set an "Agent notifications webhook" in Settings. When a scheduled scan
  completes, Shopper POSTs the new finds to your URL so your agent can wake up
  and act on them - compare, vet, or flag the buy.
`,
  },
  {
    slug: "shopper-mcp-agent",
    name: "Connect your agent (MCP)",
    description: "Operate Shopper from your own agent over MCP, with safe guardrails.",
    content: `---
name: shopper-mcp-agent
description: Drive Shopper's shopping engine from an external agent via MCP and webhooks.
---

# Connect your agent (MCP)

Shopper is the shopping engine your agents run. Point your own agent at it over
MCP.

## Setup
1. Create an API key in Settings.
2. Connect Shopper's MCP server in your agent using that key. Your agent can
   now read and write the wish list (sellers, items, seller contacts), work
   shopping lists, and run hunts and vetting through the same operations the
   app uses.
3. To get notified when Radar scans and scheduled tasks finish, set the Agent
   notifications webhook in Settings; handle the POST in your agent.

## Guardrails (always)
- Confirm before purchases, outreach to sellers, or other high-stakes actions.
- Never attach details to the wrong seller or person. Verify name and company
  first; prefer nothing over a wrong value.
- Deduplicate before saving records (one seller per domain), and always carry
  price, condition, and URL with a saved item.
`,
  },
];

export function getSkill(slug: string): Skill | undefined {
  return SKILLS.find((s) => s.slug === slug);
}
