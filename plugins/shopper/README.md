# Shopper plugin for Claude Code

Shopper is the CRM your agents run. This plugin bundles five Shopper skills and
connects Shopper's remote MCP server so Claude can read and write every record:
discover leads, enrich accurately, keep the CRM clean, schedule intent monitors,
and operate the whole thing over MCP.

## What's inside

- Skills (model-invoked, namespaced as `/shopper:<name>`):
  - `shopper-discover` - find companies and people and add them to the CRM, deduped.
  - `shopper-enrich` - add firmographics, tech stack, funding, and verified contact
    info, without ever attaching the wrong record.
  - `shopper-link-contacts` - link people to companies, dedupe, bulk-enrich.
  - `shopper-intent-monitors` - schedule recurring intent scans and deep research.
  - `shopper-mcp-agent` - drive Shopper's CRM from an external agent via MCP.
- MCP server: Shopper's remote Streamable HTTP server at
  `https://www.shopper.sh/api/mcp/mcp`, declared in the plugin manifest. It
  starts automatically when the plugin is enabled and exposes Shopper's tools
  (entities, contacts, emails, discovery, enrichment) to Claude.

## Install

This repo doubles as a plugin marketplace (see `.claude-plugin/marketplace.json`
at the repo root). Add the marketplace, then install the plugin.

From GitHub (replace `owner/repo` with this repository):

```
/plugin marketplace add owner/repo
/plugin install shopper@shopper-marketplace
```

From a local clone of this repo:

```
/plugin marketplace add ./
/plugin install shopper@shopper-marketplace
```

Or test the plugin directly without a marketplace:

```
claude --plugin-dir ./plugins/shopper
```

After installing, run `/reload-plugins` (or restart) to load the skills and MCP
server. The skills appear under the `/shopper:` namespace.

## Authentication (required for the MCP server)

Shopper's MCP server supports two auth methods on the same URL:

1. OAuth (for clients that do the browser flow, e.g. Claude's custom connector).
   You sign in to Shopper to authorize; no key needed.
2. API key as a Bearer token (for key-based / headless agents like openclaw,
   Hermes, and this plugin's default config).

This plugin's manifest passes `Authorization: Bearer ${SHOPPER_API_KEY}`. Create a
key in Shopper Settings -> API keys, then export it before launching Claude Code:

```
export SHOPPER_API_KEY=scl_your_key_here
```

If you'd rather use OAuth, remove the `headers` block from the plugin's
`mcpServers` config and authenticate via `/mcp`. Until authenticated, the skills
still load but MCP tool calls will be unauthorized.

## Notes

- Hard accuracy rule (Shopper): enrichment must never attach data for the wrong
  person or company. Verify name AND company/domain before saving; prefer null and
  "couldn't find it" over a wrong value.
- One company per domain. Deduplicate before creating records.
