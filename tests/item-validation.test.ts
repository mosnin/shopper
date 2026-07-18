import { describe, it, expect } from "vitest";
import { MCP_TOOL_GROUPS, MCP_TOOL_NAMES } from "@/lib/mcp-catalog";

// Grouping invariants for the public MCP tool catalog (beyond the live-server
// parity check in tests/mcp-catalog.test.ts). DB-bound validation of
// item-operations (createItem/updateItem etc.) is not testable without a
// Prisma/Neon connection, so it is intentionally skipped here.
describe("mcp catalog grouping invariants", () => {
  it("every tool has a non-empty summary", () => {
    for (const group of MCP_TOOL_GROUPS) {
      for (const tool of group.tools) {
        expect(tool.summary.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("every tool name is snake_case (lowercase letters and underscores only)", () => {
    for (const name of MCP_TOOL_NAMES) {
      expect(name).toMatch(/^[a-z][a-z0-9]*(_[a-z0-9]+)*$/);
    }
  });

  it("every group has a title and a non-empty blurb", () => {
    for (const group of MCP_TOOL_GROUPS) {
      expect(group.title.trim().length).toBeGreaterThan(0);
      expect(group.blurb.trim().length).toBeGreaterThan(0);
    }
  });

  it("every group has at least one tool", () => {
    for (const group of MCP_TOOL_GROUPS) {
      expect(group.tools.length).toBeGreaterThan(0);
    }
  });

  it("no tool name is duplicated across groups", () => {
    expect(new Set(MCP_TOOL_NAMES).size).toBe(MCP_TOOL_NAMES.length);
  });

  it("no summary uses an em dash or en dash", () => {
    for (const group of MCP_TOOL_GROUPS) {
      for (const tool of group.tools) {
        expect(tool.summary).not.toMatch(/[–—]/);
      }
    }
  });
});
