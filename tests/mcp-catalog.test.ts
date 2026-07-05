import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { MCP_TOOL_NAMES, MCP_TOOL_COUNT } from "@/lib/mcp-catalog";

// Guard: the public tool catalog must match the live MCP server exactly, so the
// marketing "52 tools" claim and the /tools page can never drift from reality.
const routeSrc = readFileSync(
  resolve(process.cwd(), "src/app/api/mcp/[transport]/route.ts"),
  "utf8",
);
const liveNames = Array.from(
  routeSrc.matchAll(/server\.tool\(\s*"([a-z_]+)"/g),
  (m) => m[1],
);

describe("mcp tool catalog", () => {
  it("matches the live MCP server tool set exactly", () => {
    expect([...MCP_TOOL_NAMES].sort()).toEqual([...liveNames].sort());
  });
  it("has no duplicates", () => {
    expect(new Set(MCP_TOOL_NAMES).size).toBe(MCP_TOOL_NAMES.length);
  });
  it("count constant is correct", () => {
    expect(MCP_TOOL_COUNT).toBe(liveNames.length);
  });
});
