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
            "Supabase: managed Postgres database and vector memory (pgvector) where your wish list is stored.",
            "Upstash: rate limiting and ephemeral queues.",
            "Inngest: scheduled and background jobs (intent monitors and research runs).",
            "Uploadthing: file uploads.",
          ],
        },
        {
          heading: "Identity and payments",
          bullets: [
            "Clerk: authentication and account management.",
            "Stripe: subscription billing and payment processing.",
          ],
        },
        {
          heading: "Intelligence and data providers",
          body: [
            "These power item hunts, seller vetting, and research. Shopper orchestrates them, applies its accuracy rule, and writes only verified results into your wish list. We orchestrate providers; we do not sell data.",
          ],
          bullets: [
            "Exa: web-wide item hunts and Radar scans.",
            "Explorium: company firmographics and people data.",
            "Pipe0: contact enrichment (work email and phone).",
            "Bright Data: web search and structured extraction.",
            "Tavily: web search and crawl.",
            "Linkup: sourced deep research.",
            "AgentMail: per-user email sending and threading.",
            "OpenAI: the model behind the built-in agent and the small model that refines noisy results.",
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
