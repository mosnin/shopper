import type { Metadata } from "next";
import { LegalDoc } from "@/components/legal/legal-doc";

export const metadata: Metadata = {
  title: "Subprocessors | Shopper",
  description: "The third-party services Shopper uses to run the product.",
};

export default function SubprocessorsPage() {
  return (
    <LegalDoc
      title="Subprocessors"
      updated="June 9, 2026"
      intro={
        <>
          To run Shopper we rely on a focused set of trusted providers. Each
          processes data only to deliver part of the service and is bound to
          protect it. We list them here in the open so you always know who
          touches your data. This page is referenced by our Data Processing
          Addendum.
        </>
      }
      sections={[
        {
          heading: "Infrastructure",
          bullets: [
            "Vercel: application hosting and serverless compute.",
            "Neon: managed Postgres database and vector memory (pgvector) where your wish list, lists, and agent memory are stored.",
            "Upstash: rate limiting and ephemeral queues.",
            "Inngest: scheduled and background jobs (Radar scans and hunt runs).",
            "Uploadthing: file uploads.",
          ],
        },
        {
          heading: "Identity and payments",
          bullets: [
            "Clerk: authentication and account management.",
            "Stripe: subscription billing and card payment processing.",
            "x402 (USDC): optional agent payments settled on-chain; Shopper records the transaction reference.",
          ],
        },
        {
          heading: "Intelligence and data providers",
          body: [
            "These power item hunts, seller vetting, and seller-contact enrichment. Shopper orchestrates them, applies its accuracy rule, and writes only verified results into your wish list. We orchestrate providers; we do not sell data. Seller vetting also draws on public registries (GLEIF, UK Companies House, SEC EDGAR); those are open public data sources, not personal-data subprocessors.",
          ],
          bullets: [
            "Exa: web-wide item hunts and Radar scans.",
            "Tavily: web search and crawl.",
            "Firecrawl: web search and structured page extraction.",
            "Apify: marketplace and listing scrapers.",
            "Bright Data: search results and page scraping for hunts, when configured.",
            "Browserbase: real browser sessions for deep hunts on forums and marketplaces.",
            "Explorium: seller firmographics and contact data for vetting and sourcing.",
            "Pipe0: seller-contact enrichment (work email and phone).",
            "Linkup: sourced deep research on sellers and items.",
            "Anymailfinder, Findymail, and Bouncer: finding and verifying a seller contact's work email.",
            "OpenStreetMap Nominatim: geocoding store locations.",
            "AgentMail: seller and supplier email sending and threading, through the account you connect.",
            "AgentPhone: AI phone calls to sellers and suppliers, through the account you connect.",
            "OpenAI: the model and embeddings behind the built-in agent, and the small model that refines noisy results.",
          ],
        },
        {
          heading: "Changes to this list",
          body: [
            "We update this page when we add or remove a subprocessor. If you have a data processing agreement with us that requires advance notice of changes, we will provide it as agreed.",
          ],
        },
      ]}
      related={[
        { label: "Data Processing Addendum", href: "/dpa" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Security", href: "/security" },
      ]}
    />
  );
}
