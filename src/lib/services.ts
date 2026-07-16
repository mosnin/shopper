import {
  Radar,
  Globe,
  Bot,
  Plug,
  ShieldCheck,
  ListChecks,
  type LucideIcon,
} from "lucide-react";

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  /** Short capability tag (rendered as a badge on marketing pages). */
  startingPrice: string;
}

// Shopper's capabilities - the things the agents do. Doubles as marketing copy.
export const services: Service[] = [
  {
    id: "shop",
    name: "Shop",
    description:
      "Your agents hunt the whole web for items for sale - Exa, Firecrawl, and Tavily under the hood, with a real Browserbase browser for deep shopping on forums, marketplaces, and js-heavy storefronts.",
    icon: Globe,
    features: [
      "Web-wide item hunting, not one catalog",
      "Deep shopping with a real browser",
      "Forums, marketplaces, storefronts",
      "Finds land straight in your Wish List",
    ],
    startingPrice: "Core",
  },
  {
    id: "vet",
    name: "Vet & enrich sellers",
    description:
      "Every find comes with a seller you can judge. Shopper checks sellers, stores, and manufacturers against GLEIF, Companies House, and SEC EDGAR, and enriches the record so you know who you are buying from.",
    icon: ShieldCheck,
    features: [
      "Registry checks: GLEIF / Companies House / SEC EDGAR",
      "Seller, store & manufacturer records",
      "Enriched on the way into the Wish List",
      "Judge before you pay",
    ],
    startingPrice: "Built in",
  },
  {
    id: "agent",
    name: "The built-in agent",
    description:
      "No agent of your own? Chat with the built-in Shopper agent. It hunts, vets, saves to your Wish List, and works your Shopping Lists - it shops, it doesn't just link-dump.",
    icon: Bot,
    features: [
      "Hunt from a plain-English ask",
      "Reads and writes your lists",
      "Knows your About You context",
      "Visible, checkable finds",
    ],
    startingPrice: "Included",
  },
  {
    id: "connect",
    name: "Connect your agents",
    description:
      "Open by connection. Point Hermes, OpenClaw, Codex, Claude Code, or any MCP client at Shopper and it gets the same hunting engines, lists, and vetting the built-in agent uses.",
    icon: Plug,
    features: [
      "MCP tools over your lists",
      "Hermes / OpenClaw / Codex / Claude Code",
      "Wish List read + write",
      "About You kept current by agents",
    ],
    startingPrice: "MCP",
  },
  {
    id: "radar",
    name: "Radar",
    description:
      "Standing scans that keep hunting after you stop asking: recently listed pre-owned GPUs at a good price, Gucci shoes size 10M under $400, cars, suppliers, anything.",
    icon: Radar,
    features: [
      "Standing scans on a schedule",
      "Price, condition & size constraints",
      "New matches land in your Wish List",
      "Pro and Max plans",
    ],
    startingPrice: "Paid plans",
  },
  {
    id: "shopping-lists",
    name: "Shopping lists",
    description:
      "Groceries, home decor for a move, auto parts, business supplies. Your agent monitors each list, hunts down the items, and checks off purchases as they happen.",
    icon: ListChecks,
    features: [
      "Lists for any project or errand",
      "Agent-monitored, agent-updated",
      "Purchases checked off automatically",
      "Shared context across your agents",
    ],
    startingPrice: "Included",
  },
];
