# Shopper

**The shopping engine for AI agents.** [shopper.sh](https://shopper.sh)

Shopper connects your AI agents (Hermes, OpenClaw, Codex, Claude Code, or any
MCP client) to a real shopping engine. Agents hunt the whole web for items for
sale using Exa, Firecrawl, and Tavily, go deep with a real browser
(Browserbase) on forums and marketplaces, keep your Wish List of items and
sellers current, work your Shopping Lists (groceries, a move, auto parts,
business supplies) and check off purchases, run Radar standing scans for the
exact items you want (paid plans), and source manufacturers on Pro.

## Surfaces

- **Shop** (`/shop`) - the shopping tools: web-wide item hunts, local stores, seller extraction.
- **Wish List** (`/wishlist`) - every find: items, sellers, stores, manufacturers, and the people behind them.
- **Shopping Lists** (`/shopping-list`) - lists agents monitor and check off as things get bought.
- **Radar** (`/radar`) - standing scans like "recently listed pre-owned GPUs at a good price" (Plus/Pro).
- **About You** (`/about-you`) - sizes, tastes, budgets; agents read and update it over MCP.
- **Agent** (`/agent`) - the built-in Shopper agent, if you don't bring your own.
- **MCP** (`/api/mcp`) - the full engine for connected agents: hunts, wish list, lists, deep shopping, sourcing, self-serve billing over x402.

## Plans

Free (limited usage) / Plus $10/mo / Pro $20/mo (adds manufacturer & supplier sourcing).

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Clerk auth,
Prisma on Postgres, Stripe + x402 USDC billing, Inngest jobs.

## Development

```bash
pnpm install
cp .env.local.example .env.local   # fill keys
pnpm dev
```

Build with `pnpm build`, lint with `pnpm lint`, test with `pnpm vitest run`.
See `CLAUDE.md`, `DESIGN.md`, and `AGENTS.md` for working rules.
