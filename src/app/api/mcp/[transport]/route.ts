import { createMcpHandler, withMcpAuth } from "mcp-handler";
import { z } from "zod";
import type { AuthInfo } from "@modelcontextprotocol/sdk/server/auth/types.js";
import { authenticateApiKey, bearerFromRequest } from "@/lib/api-auth";
import { userIdFromAccessToken } from "@/lib/oauth";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  topUpHint,
  isX402Configured,
  buildRequirements,
  grantAfterSettle,
  paymentRequiredBody,
  paymentRef,
  verifyPayment,
  settlePayment,
  decodePaymentHeader,
  resourceUrl,
  x402Network,
  USD_PER_CREDIT,
} from "@/lib/x402";
import {
  OpError,
  listEntities,
  getEntity,
  createEntity,
  updateEntity,
  enrichEntity,
  deleteEntity,
  findCompanies,
  discoverLocalLeads,
  extractSiteContacts,
  searchGoogle,
  listContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
  saveEmail,
  searchCrm,
  logOutreach,
  addActivity,
  listActivities,
  listDueFollowups,
  placeContactCall,
  saveCall,
  listContactCalls,
  syncContactCall,
} from "@/lib/crm-operations";
import { tavilySearch, isTavilyConfigured } from "@/lib/tavily";
import { enrichContactField } from "@/lib/contact-enrich";
import {
  spendCredits,
  ensureCredits,
  getBilling,
  addCredits,
  alreadyCredited,
  applyPlan,
  PLANS,
  PLAN_USD,
  CREDIT_COSTS,
  type PaidPlanName,
} from "@/lib/credits";
import { storeMemory, recallMemory } from "@/lib/memory";
import { prisma } from "@/lib/prisma";
import { planFor } from "@/lib/credits";
import {
  listItems,
  createItem,
  updateItem,
  setItemStatus,
  deleteItem,
  listShoppingLists,
  getShoppingList,
  createShoppingList,
  deleteShoppingList,
} from "@/lib/item-operations";
import {
  isBrowserbaseConfigured,
  createBrowserSession,
  sessionDebugUrl,
} from "@/lib/browserbase";
import { verifyEntity } from "@/lib/enrich/verified-entity";
import { detectEntityTech } from "@/lib/enrich/technographics";
import {
  listSegments,
  getSegment,
  createSegment,
  buildSmartSegment,
} from "@/lib/field-operations";

type ToolResult = {
  content: { type: "text"; text: string }[];
  isError?: boolean;
};

const ok = (data: unknown): ToolResult => ({
  content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
});
const fail = (message: string): ToolResult => ({
  content: [{ type: "text", text: message }],
  isError: true,
});

// Read the authenticated user id injected by withMcpAuth.
function userIdFrom(extra: { authInfo?: AuthInfo }): string {
  const id = (extra.authInfo?.extra as { userId?: string } | undefined)?.userId;
  if (!id) throw new OpError("Unauthorized", 401);
  return id;
}

// Turn an OpError into a tool message, appending the x402 top-up pointer when
// the failure is "out of credits" (402) and agent payments are configured, so a
// connected agent can pay its own way and retry instead of stalling.
function opErrorMessage(e: OpError): string {
  if (e.status === 402) {
    // Structured, machine-actionable out-of-credits contract: an autonomous
    // agent parses this, calls buy_credits (USDC over x402, no human), then
    // retries the exact call that failed.
    if (isX402Configured()) {
      return JSON.stringify({
        error: "insufficient_credits",
        message: e.message,
        code: 402,
        remedy: {
          reason: "Buy more usage yourself with USDC over x402, no human needed.",
          tools: ["buy_credits", "buy_plan", "get_usage"],
          suggestedCall: { tool: "buy_credits", args: { credits: 1000 } },
          retryAfterPurchase: true,
        },
        paymentsConfigured: true,
      });
    }
    const hint = topUpHint();
    if (hint) return `${e.message} ${hint}`;
  }
  return e.message;
}

// Wrap a tool body so OpErrors become clean tool errors instead of 500s.
async function run(fn: () => Promise<unknown>): Promise<ToolResult> {
  try {
    return ok(await fn());
  } catch (e) {
    if (e instanceof OpError) return fail(opErrorMessage(e));
    console.error("MCP tool error", e);
    return fail("Internal error");
  }
}

// Like run(), but adds a per-user rate limit for tools that hit paid providers
// or fan out writes - external agents hold long-lived keys, so an uncapped paid
// tool is unbounded spend. Durable when Upstash is configured. Passes the
// authenticated userId into the body.
async function gated(
  extra: { authInfo?: AuthInfo },
  bucket: string,
  limit: number,
  fn: (userId: string) => Promise<unknown>,
): Promise<ToolResult> {
  try {
    const userId = userIdFrom(extra);
    const rate = await checkRateLimit(`mcp:${bucket}:${userId}`, limit, 60_000);
    if (!rate.success) return fail("Rate limit reached for this tool. Please wait a moment and try again.");
    return ok(await fn(userId));
  } catch (e) {
    if (e instanceof OpError) return fail(opErrorMessage(e));
    console.error("MCP tool error", e);
    return fail("Internal error");
  }
}

// Two-step x402 over MCP. An MCP tool call can't carry the HTTP-402
// challenge/response, so a buy tool called WITHOUT xPayment returns a quote (the
// payment requirements an x402 client signs); called again WITH the signed
// base64 X-PAYMENT, it verifies, idempotency-checks the on-chain nonce, settles,
// and credits. Reuses the exact x402 + credits path the HTTP routes use, so a
// nonce settled through either transport is recognised as a duplicate.
async function buyCreditsViaMcp(
  userId: string,
  credits: number,
  xPayment?: string,
): Promise<unknown> {
  if (!isX402Configured()) throw new OpError("Agent payments are not configured yet.", 501);
  const priceUsd = Math.round(credits * USD_PER_CREDIT * 100) / 100;
  const requirements = buildRequirements({
    priceUsd,
    resource: resourceUrl("/api/x402/topup"),
    description: `Top up ${credits} Shopper credits`,
  });
  if (!xPayment) {
    return {
      step: "quote",
      credits,
      priceUsd,
      ...paymentRequiredBody(
        requirements,
        "Sign this with your x402 client and call buy_credits again with xPayment set.",
      ),
    };
  }
  const payload = decodePaymentHeader(xPayment);
  if (!payload) throw new OpError("xPayment is not a valid base64 X-PAYMENT payload.", 400);
  const verified = await verifyPayment(payload, requirements);
  if (!verified.ok) throw new OpError(`Payment invalid: ${verified.reason}`, 402);
  const ref = paymentRef(payload);
  if (!ref) throw new OpError("Payment payload missing nonce - cannot process idempotently.", 400);
  const prior = await alreadyCredited(userId, ref);
  if (prior !== null) return { step: "settled", credited: 0, balance: prior, duplicate: true };
  const settled = await settlePayment(payload, requirements);
  if (!settled.ok) throw new OpError(`Settlement failed: ${settled.reason}`, 402);
  const balance = await grantAfterSettle(
    () => addCredits(userId, credits, { action: "topup_x402", ref }),
    { transaction: settled.transaction, userId, ref, amount: String(credits) },
  );
  return { step: "settled", credited: credits, balance, network: x402Network(), transaction: settled.transaction };
}

async function buyPlanViaMcp(
  userId: string,
  plan: PaidPlanName,
  xPayment?: string,
): Promise<unknown> {
  if (!isX402Configured()) throw new OpError("Agent payments are not configured yet.", 501);
  const requirements = buildRequirements({
    priceUsd: PLAN_USD[plan],
    resource: resourceUrl("/api/x402/subscribe"),
    description: `Shopper ${plan} plan, 30 days`,
  });
  if (!xPayment) {
    return {
      step: "quote",
      plan,
      usd: PLAN_USD[plan],
      credits: PLANS[plan].credits,
      ...paymentRequiredBody(
        requirements,
        "Sign this with your x402 client and call buy_plan again with xPayment set.",
      ),
    };
  }
  const payload = decodePaymentHeader(xPayment);
  if (!payload) throw new OpError("xPayment is not a valid base64 X-PAYMENT payload.", 400);
  const verified = await verifyPayment(payload, requirements);
  if (!verified.ok) throw new OpError(`Payment invalid: ${verified.reason}`, 402);
  const ref = paymentRef(payload);
  if (!ref) throw new OpError("Payment payload missing nonce - cannot process idempotently.", 400);
  const seen = await alreadyCredited(userId, ref);
  if (seen !== null) return { step: "settled", plan, duplicate: true };
  const settled = await settlePayment(payload, requirements);
  if (!settled.ok) throw new OpError(`Settlement failed: ${settled.reason}`, 402);
  await grantAfterSettle(
    () => applyPlan(userId, plan, { ref }),
    { transaction: settled.transaction, userId, ref, amount: `plan:${plan}` },
  );
  return { step: "settled", plan, credits: PLANS[plan].credits, period: "30 days", network: x402Network(), transaction: settled.transaction };
}

const handler = createMcpHandler(
  (server) => {
    /* -------------------------- Entities -------------------------- */
    server.tool(
      "list_sources",
      "List sellers and sources (stores, marketplaces, brands, manufacturers) saved in the wish list, newest first. Optional search query over name/domain/category.",
      { query: z.string().optional() },
      async ({ query }, extra) =>
        run(() => listEntities(userIdFrom(extra), query)),
    );

    server.tool(
      "get_source",
      "Get one seller or source by id, including its saved seller contacts.",
      { id: z.string() },
      async ({ id }, extra) => run(() => getEntity(userIdFrom(extra), id)),
    );

    server.tool(
      "create_source",
      "Save a seller, store, marketplace, or manufacturer into the wish list (the place that carries the goods). For an actual item to BUY, use save_item instead - this tool is for the sellers themselves.",
      {
        name: z.string(),
        domain: z.string().optional(),
        website: z.string().optional(),
        industry: z.string().optional(),
        location: z.string().optional(),
        description: z.string().optional(),
        size: z.string().optional(),
        notes: z.string().optional(),
        tags: z.array(z.string().max(50)).max(50).optional(),
      },
      async (args, extra) =>
        gated(extra, "create", 120, (userId) =>
          createEntity(userId, { ...args, source: "agent" }),
        ),
    );

    server.tool(
      "update_source",
      "Update fields on a saved seller, source, or item record (price changes, status, notes).",
      {
        id: z.string(),
        name: z.string().optional(),
        domain: z.string().nullable().optional(),
        website: z.string().nullable().optional(),
        industry: z.string().nullable().optional(),
        location: z.string().nullable().optional(),
        description: z.string().nullable().optional(),
        size: z.string().nullable().optional(),
        notes: z.string().nullable().optional(),
        status: z.enum(["NEW", "ENRICHED", "ARCHIVED"]).optional(),
        tags: z.array(z.string().max(50)).max(50).optional(),
      },
      async ({ id, ...rest }, extra) =>
        run(() => updateEntity(userIdFrom(extra), id, rest)),
    );

    server.tool(
      "enrich_source",
      "Enrich a seller or manufacturer via Explorium using its domain (company data + firmographics). Useful before buying from an unknown store or supplier; stores the result on the record.",
      { id: z.string() },
      { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
      async ({ id }, extra) => gated(extra, "enrich", 20, (userId) => enrichEntity(userId, id)),
    );

    server.tool(
      "delete_source",
      "Permanently delete a seller, source, or item record from the wish list by id. Its seller contacts are kept (unlinked). Use to clean up junk or duplicates.",
      { id: z.string() },
      { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
      async ({ id }, extra) => run(() => deleteEntity(userIdFrom(extra), id)),
    );

    /* -------------------------- Contacts -------------------------- */
    server.tool(
      "list_seller_contacts",
      "List seller contacts (people at stores, marketplaces, and manufacturers), newest first. Optional search query and status filter.",
      {
        query: z.string().optional(),
        status: z.string().optional(),
      },
      async ({ query, status }, extra) =>
        run(() => listContacts(userIdFrom(extra), { q: query, status })),
    );

    server.tool(
      "get_seller_contact",
      "Get one seller contact by id, including the linked seller and saved email context.",
      { id: z.string() },
      async ({ id }, extra) => run(() => getContact(userIdFrom(extra), id)),
    );

    server.tool(
      "create_seller_contact",
      "Save a seller contact (a person at a store, marketplace, or manufacturer). Optionally assign to a seller by entityId.",
      {
        name: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        company: z.string().optional(),
        title: z.string().optional(),
        website: z.string().optional(),
        linkedin: z.string().optional(),
        location: z.string().optional(),
        notes: z.string().optional(),
        tags: z.array(z.string().max(50)).max(50).optional(),
        entityId: z.string().optional(),
      },
      async (args, extra) =>
        gated(extra, "create", 120, (userId) =>
          createContact(userId, { ...args, source: "agent" }),
        ),
    );

    server.tool(
      "update_seller_contact",
      "Update fields on a seller contact (including status and seller assignment).",
      {
        id: z.string(),
        name: z.string().nullable().optional(),
        email: z.string().nullable().optional(),
        phone: z.string().nullable().optional(),
        company: z.string().nullable().optional(),
        title: z.string().nullable().optional(),
        status: z
          .enum([
            "NEW",
            "ENRICHED",
            "CONTACTED",
            "REPLIED",
            "QUALIFIED",
            "WON",
            "LOST",
            "ARCHIVED",
          ])
          .optional(),
        notes: z.string().nullable().optional(),
        tags: z.array(z.string().max(50)).max(50).optional(),
        entityId: z.string().nullable().optional(),
      },
      async ({ id, ...rest }, extra) =>
        run(() => updateContact(userIdFrom(extra), id, rest)),
    );

    server.tool(
      "delete_seller_contact",
      "Permanently delete a seller contact from the wish list by id. Use to clean up junk or duplicates.",
      { id: z.string() },
      { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
      async ({ id }, extra) => run(() => deleteContact(userIdFrom(extra), id)),
    );

    server.tool(
      "enrich_seller_contact",
      "Find and save a seller contact's missing LinkedIn, work email, or phone (key for supplier sourcing). Verified against the person's name AND company so a same-name stranger is never attached; needs the contact linked to a seller or to have a website/work email so the domain is known. Pass the contact id and which field to enrich.",
      { id: z.string(), field: z.enum(["linkedin", "email", "phone"]) },
      { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
      async ({ id, field }, extra) =>
        gated(extra, "enrich", 20, (userId) => enrichContactField(userId, id, field)),
    );

    /* ------------------------ Email context ----------------------- */
    server.tool(
      "save_email_context",
      "Save an email exchanged with a seller contact (quotes, availability, order threads) onto their record as reusable context.",
      {
        contactId: z.string(),
        direction: z.enum(["INBOUND", "OUTBOUND"]),
        subject: z.string().max(500).optional(),
        body: z.string().max(100_000).optional(),
        fromAddr: z.string().max(320).optional(),
        toAddr: z.string().max(320).optional(),
        savedAsContext: z.boolean().optional(),
      },
      async (args, extra) =>
        run(() =>
          saveEmail(userIdFrom(extra), {
            ...args,
            savedAsContext: args.savedAsContext ?? true,
          }),
        ),
    );

    /* ----------------------- Shopping tools ----------------------- */
    server.tool(
      "search_wishlist",
      "Search across saved items, sellers, and seller contacts in the wish list.",
      { query: z.string() },
      async ({ query }, extra) =>
        run(() => searchCrm(userIdFrom(extra), query)),
    );

    server.tool(
      "search_web",
      "Search the web (Tavily) for items, listings, prices, and reviews, e.g. 'pre-owned RTX 4090 for sale under $900'. Returns titles, URLs, and snippets to review and save with save_item.",
      {
        query: z.string(),
        maxResults: z.number().int().min(1).max(20).optional(),
      },
      async ({ query, maxResults }, extra) =>
        gated(extra, "search_web", 30, async (userId) => {
          if (!isTavilyConfigured())
            throw new OpError("Web search is not configured (TAVILY_API_KEY missing).", 501);
          await ensureCredits(userId, "web_search");
          const results = await tavilySearch(query, { maxResults });
          // Debit only after the search succeeded. (enrich/find tools debit
          // inside the shared ops layer - never double-charge here.)
          await spendCredits(userId, "web_search");
          return results;
        }),
    );

    server.tool(
      "find_items",
      "Comprehensive shopping hunt from a prompt (e.g. 'recently listed pre-owned GPUs at a good price' or 'Gucci loafers size 10M under $400') via Exa deep research across stores, marketplaces, and listings. Results are deduped against the wish list by domain then name and the new ones are saved. This is the main shopping tool - prefer it over search_web when the goal is to find and save items or sellers.",
      { query: z.string(), count: z.number().int().min(1).max(25).optional() },
      { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
      async ({ query, count }, extra) =>
        gated(extra, "find_companies", 10, (userId) => findCompanies(userId, { query, count })),
    );

    server.tool(
      "find_local_stores",
      "Discover local stores and sellers on Google Maps (via Apify) and save the new ones to the wish list, deduped by domain then name. The tool for shopping nearby: query is what to find ('used furniture stores'), location narrows it ('Austin, TX'). Captures name, website, phone, and address. Costs 15 credits per run that returns results (a dry run is free).",
      {
        query: z.string(),
        location: z.string().optional(),
        count: z.number().int().min(1).max(20).optional(),
      },
      { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
      async ({ query, location, count }, extra) =>
        gated(extra, "maps_leads", 10, (userId) => discoverLocalLeads(userId, { query, location, count })),
    );

    server.tool(
      "extract_seller_details",
      "Extract a store or seller site's public contact details (emails, phones, social links) via Firecrawl-grade scraping (Apify), deduped and tied to the site host. Returns the data for you to review and save selectively with create_seller_contact - it does NOT auto-create records. Costs 8 credits when details are found (nothing on a miss).",
      { url: z.string() },
      { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: true },
      async ({ url }, extra) =>
        gated(extra, "contact_extract", 20, (userId) => extractSiteContacts(userId, url)),
    );

    server.tool(
      "google_search",
      "Run a Google web search via Apify and get organic results (title, URL, snippet) - good for price checks and availability. For finding AND saving items or stores in one step, prefer find_items or find_local_stores. Costs 4 credits per search that returns results.",
      {
        query: z.string(),
        limit: z.number().int().min(1).max(20).optional(),
      },
      { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: true },
      async ({ query, limit }, extra) =>
        gated(extra, "serp_search", 30, (userId) => searchGoogle(userId, { query, limit })),
    );

    /* ------------------------- Collections ------------------------ */
    server.tool(
      "list_collections",
      "List wish list collections (grouped seller contacts) with member counts.",
      {},
      async (_args, extra) => run(() => listSegments(userIdFrom(extra))),
    );

    server.tool(
      "get_collection",
      "Get a collection and its member seller contacts.",
      { id: z.string() },
      async ({ id }, extra) => run(() => getSegment(userIdFrom(extra), id)),
    );

    server.tool(
      "create_collection",
      "Create a collection manually, optionally with member seller-contact ids.",
      { name: z.string().max(200), goal: z.string().max(2000).optional(), contactIds: z.array(z.string()).max(1000).optional() },
      async (args, extra) => run(() => createSegment(userIdFrom(extra), args)),
    );

    server.tool(
      "build_smart_collection",
      "Build a collection from a goal: vector-matches the closest eligible seller contacts (enriched, not yet contacted, not already on a shopping list). Use this to auto-group suppliers to approach.",
      { goal: z.string(), quantity: z.number().int().min(1).max(100).optional(), name: z.string().optional() },
      async (args, extra) => run(() => buildSmartSegment(userIdFrom(extra), args)),
    );

    /* --------------------------- Wish list ------------------------ */
    server.tool(
      "save_item",
      "Save an item the user wants to the wish list. This is how a find becomes a tracked item: title is the product or listing name, url is the listing page, price is free text ('$899', '40-60'), condition is 'new'/'used'/etc. Optionally attach it to a seller (sellerId) and/or a shopping list (listId). Prefer this over create_source for things to BUY; create_source is for the stores and sellers themselves.",
      {
        title: z.string(),
        url: z.string().optional(),
        imageUrl: z.string().optional(),
        price: z.string().optional(),
        condition: z.string().optional(),
        quantity: z.number().int().min(1).max(9999).optional(),
        notes: z.string().optional(),
        sellerId: z.string().optional(),
        listId: z.string().optional(),
      },
      { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
      async (args, extra) =>
        gated(extra, "create", 200, (userId) => createItem(userId, { ...args, source: "agent" })),
    );

    server.tool(
      "list_items",
      "List items on the wish list, newest first. Filter by status ('WANTED' | 'PURCHASED' | 'ARCHIVED'), by a shopping list (listId), or by a search query. Call before saving so you build on what is already there.",
      {
        status: z.enum(["WANTED", "PURCHASED", "ARCHIVED"]).optional(),
        listId: z.string().optional(),
        query: z.string().optional(),
      },
      { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      async ({ status, listId, query }, extra) =>
        run(() => listItems(userIdFrom(extra), { status, listId, q: query })),
    );

    server.tool(
      "update_item",
      "Update a saved item: fix the price, add a listing url, move it to a shopping list (listId), attach a seller (sellerId), or set status. Pass only what changes.",
      {
        id: z.string(),
        title: z.string().optional(),
        url: z.string().nullable().optional(),
        price: z.string().nullable().optional(),
        condition: z.string().nullable().optional(),
        quantity: z.number().int().min(1).max(9999).nullable().optional(),
        notes: z.string().nullable().optional(),
        sellerId: z.string().nullable().optional(),
        listId: z.string().nullable().optional(),
        status: z.enum(["WANTED", "PURCHASED", "ARCHIVED"]).optional(),
      },
      async ({ id, ...patch }, extra) => run(() => updateItem(userIdFrom(extra), id, patch)),
    );

    server.tool(
      "mark_item_purchased",
      "Check an item off: set it PURCHASED (stamps the purchase time), or back to WANTED. This is the shopping-list check-off.",
      { id: z.string(), purchased: z.boolean().default(true) },
      async ({ id, purchased }, extra) =>
        run(() => setItemStatus(userIdFrom(extra), id, purchased ? "PURCHASED" : "WANTED")),
    );

    server.tool(
      "delete_item",
      "Remove an item from the wish list by id.",
      { id: z.string() },
      { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
      async ({ id }, extra) => run(() => deleteItem(userIdFrom(extra), id)),
    );

    /* ------------------------ Shopping lists ---------------------- */
    server.tool(
      "list_shopping_lists",
      "List the user's shopping lists with item tallies (total and how many are purchased). Lists are anything that needs buying: groceries, home decor for a move, auto parts, business supplies.",
      {},
      { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      async (_args, extra) => run(() => listShoppingLists(userIdFrom(extra))),
    );

    server.tool(
      "get_shopping_list",
      "Get a shopping list with all its items (wanted first, then purchased).",
      { id: z.string() },
      async ({ id }, extra) => run(() => getShoppingList(userIdFrom(extra), id)),
    );

    server.tool(
      "create_shopping_list",
      "Create a shopping list with a name and optional goal (e.g. 'restock the office' or 'furnish the new apartment'). Add items to it with save_item using its listId.",
      { name: z.string(), goal: z.string().optional() },
      async (args, extra) => run(() => createShoppingList(userIdFrom(extra), args)),
    );

    server.tool(
      "delete_shopping_list",
      "Delete a shopping list by id. Its items are kept (detached from the list), not destroyed.",
      { id: z.string() },
      { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
      async ({ id }, extra) => run(() => deleteShoppingList(userIdFrom(extra), id)),
    );

    /* ------------------------- About You -------------------------- */
    server.tool(
      "get_user_context",
      "Read the About You context: the durable profile that grounds every hunt - sizes, styles and brands loved or avoided, budgets, home and vehicle details, dietary needs, business supply requirements. Free and read-only. Call it before shopping so results actually fit the user.",
      {},
      { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      async (_args, extra) =>
        run(async () => {
          const user = await prisma.user.findUnique({
            where: { id: userIdFrom(extra) },
            select: { productContext: true },
          });
          return { aboutYou: user?.productContext ?? "" };
        }),
    );
    server.tool(
      "update_user_context",
      "Write the About You context. Pass the FULL replacement text (fetch it with get_user_context first, then merge in what you learned - a size, a brand preference, a budget). This is how connected agents keep the user profile current so every future hunt fits.",
      { content: z.string().max(20000) },
      { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      async ({ content }, extra) =>
        gated(extra, "user_context", 30, async (userId) => {
          await prisma.user.update({ where: { id: userId }, data: { productContext: content } });
          return { updated: true, length: content.length };
        }),
    );

    /* ------------------------ Deep shopping ----------------------- */
    server.tool(
      "deep_shopping_session",
      "Start a deep-shopping browser session (Browserbase): a real headless browser for hunts that scraping cannot cover - forums, marketplaces, listings that only render in a browser. Returns a CDP connectUrl your agent drives directly (Playwright/Puppeteer connect over CDP) plus a live debug URL a human can watch. Costs 30 credits per session. Available on paid plans.",
      {},
      { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
      async (_args, extra) =>
        gated(extra, "deep_shopping", 10, async (userId) => {
          if (!isBrowserbaseConfigured())
            throw new OpError("Deep shopping is not configured (BROWSERBASE_API_KEY / BROWSERBASE_PROJECT_ID missing).", 501);
          const user = await prisma.user.findUnique({ where: { id: userId }, select: { plan: true } });
          if ((user?.plan ?? "free") === "free")
            throw new OpError("Deep shopping browser sessions are a paid feature. Upgrade to Plus or Pro (see buy_plan or /pricing).", 403);
          await ensureCredits(userId, "deep_shopping");
          const session = await createBrowserSession();
          await spendCredits(userId, "deep_shopping");
          const debugUrl = await sessionDebugUrl(session.id);
          return { ...session, debugUrl };
        }),
    );

    /* -------------------- Manufacturer sourcing ------------------- */
    server.tool(
      "source_manufacturers",
      "Source manufacturers and suppliers for a product from a prompt (e.g. 'OEM manufacturers of anodized aluminum water bottles' or 'US wholesale suppliers of oak flooring') via Exa deep research, deduped against the wish list, and save the new ones as sources. Pair with enrich_seller_contact and verify_seller to reach and vet them. Pro plan only. Costs 12 credits per run.",
      { query: z.string(), count: z.number().int().min(1).max(25).optional() },
      { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
      async ({ query, count }, extra) =>
        gated(extra, "source_manufacturers", 10, async (userId) => {
          const user = await prisma.user.findUnique({ where: { id: userId }, select: { plan: true } });
          const plan = user?.plan ?? "free";
          if (plan !== "pro" && plan !== "beta")
            throw new OpError("Manufacturer sourcing is a Pro feature. Upgrade to Pro (see buy_plan or /pricing).", 403);
          return findCompanies(userId, {
            query: `manufacturers, factories, or wholesale suppliers: ${query}`,
            count,
          });
        }),
    );

    /* --------------------------- Memory --------------------------- */
    server.tool(
      "recall",
      "Recall relevant past context (earlier hunts, saved preferences, wish list notes) by similarity. Each MCP session is stateless, so call this before assuming you do not know something.",
      { query: z.string(), k: z.number().int().min(1).max(20).optional() },
      { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      async ({ query, k }, extra) => run(() => recallMemory(userIdFrom(extra), query, k)),
    );
    server.tool(
      "remember",
      "Persist a durable note or fact to long-term memory so a future session can recall it. Use for purchase decisions, user preferences, and seller context worth keeping.",
      { content: z.string().max(8000), refId: z.string().optional() },
      { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
      async ({ content, refId }, extra) =>
        run(async () => {
          await storeMemory(userIdFrom(extra), "message", content, refId);
          return { remembered: true };
        }),
    );

    /* --------------------------- Billing -------------------------- */
    server.tool(
      "get_balance",
      "Your current Shopper usage balance: credits remaining, plan, and when the meter next resets. Free and read-only. Call it at the start of a session and after an insufficient_credits error.",
      {},
      { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      async (_args, extra) =>
        run(async () => {
          const b = await getBilling(userIdFrom(extra));
          return { ...b, usdPerCredit: USD_PER_CREDIT, paymentsConfigured: isX402Configured() };
        }),
    );
    server.tool(
      "get_usage",
      "The Shopper price list: how many credits each metered action costs, the plans you can buy, top-up limits, and your current balance. Free and read-only. Use it to plan spend and pick what to buy when low.",
      {},
      { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      async (_args, extra) =>
        run(async () => {
          const b = await getBilling(userIdFrom(extra));
          return {
            creditsRemaining: b.creditsRemaining,
            plan: b.plan,
            usdPerCredit: USD_PER_CREDIT,
            actionCosts: CREDIT_COSTS,
            plans: (Object.keys(PLAN_USD) as PaidPlanName[]).map((plan) => ({
              plan,
              usd: PLAN_USD[plan],
              credits: PLANS[plan].credits,
              period: "30 days",
            })),
            topUp: { minCredits: 100, maxCredits: 100000 },
            paymentsConfigured: isX402Configured(),
          };
        }),
    );
    server.tool(
      "buy_credits",
      "Buy more Shopper usage credits with USDC over x402 (pay as you go, $0.01 per credit). TWO STEPS: (1) call with { credits } and NO xPayment to get a quote (the payment requirements); (2) have your x402 client sign a USDC payment for those requirements and call again with the same { credits } plus xPayment set to the base64 X-PAYMENT header. Returns the new balance. Call this when a tool returns insufficient_credits, then retry the failed call. Safe to retry: a settled payment is never charged twice (idempotent on the on-chain nonce).",
      { credits: z.number().int().min(100).max(100000).default(1000), xPayment: z.string().optional() },
      { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: true },
      async ({ credits, xPayment }, extra) =>
        gated(extra, "x402_buy", 30, (userId) => buyCreditsViaMcp(userId, credits, xPayment)),
    );
    server.tool(
      "buy_plan",
      "Buy a Shopper plan for 30 days with USDC over x402 (plus or pro; cheaper per credit than top-ups for sustained work). TWO STEPS: (1) call with { plan } and NO xPayment for a quote; (2) sign the USDC payment with your x402 client and call again with the same { plan } plus xPayment (base64 X-PAYMENT). Activates the plan and refills credits to its allotment. Idempotent on the on-chain nonce; not recurring (re-buy after 30 days).",
      { plan: z.enum(["plus", "pro"]), xPayment: z.string().optional() },
      { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: true },
      async ({ plan, xPayment }, extra) =>
        gated(extra, "x402_buy", 20, (userId) => buyPlanViaMcp(userId, plan, xPayment)),
    );

    server.tool(
      "verify_seller",
      "Verify a seller or manufacturer against authoritative public registries: GLEIF (global LEI), UK Companies House, and SEC EDGAR (US public companies). Adds legal name, LEI, jurisdiction, registration status, and officers, with provenance - the scam check before a big purchase or a new supplier. Free (open/public data, no credits). Matches strictly by legal name; returns 'no record found' rather than guessing.",
      { id: z.string() },
      { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: true },
      async ({ id }, extra) => gated(extra, "verify_entity", 20, (userId) => verifyEntity(userId, id)),
    );
    server.tool(
      "detect_store_tech",
      "Detect the technologies a store's website uses (ecommerce platform, CMS, payments, support tools, hosting) by fingerprinting its homepage. Free (derived from the public page). Useful for judging how established a seller is. The record needs a website or domain.",
      { id: z.string() },
      { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: true },
      async ({ id }, extra) => gated(extra, "detect_tech", 20, (userId) => detectEntityTech(userId, id)),
    );

    /* ------------------------- Phone calls ------------------------ */
    server.tool(
      "place_call",
      "Call a seller via the user's connected AgentPhone account: the AI phone agent dials the number and follows your systemPrompt (ask about stock, condition, price, pickup). Logs the call on the seller contact and marks them CONTACTED. Uses the contact's phone unless you pass toNumber (E.164, e.g. +14155551234). Requires AgentPhone connected in Settings.",
      {
        contactId: z.string(),
        systemPrompt: z.string().min(1).max(8000),
        toNumber: z.string().max(40).optional(),
        agentId: z.string().max(200).optional(),
        fromNumberId: z.string().max(200).optional(),
        initialGreeting: z.string().max(2000).optional(),
      },
      { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
      async (a, extra) => gated(extra, "place_call", 20, (userId) => placeContactCall(userId, a)),
    );
    server.tool(
      "list_contact_calls",
      "Get the phone-call history with a seller contact (direction, numbers, status, duration, transcript, recording), newest first.",
      { contactId: z.string() },
      { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      async ({ contactId }, extra) => run(() => listContactCalls(userIdFrom(extra), contactId)),
    );
    server.tool(
      "sync_call",
      "Refresh a logged call from AgentPhone: pull the latest status, duration, transcript, and recording onto the call record. Use after a call ends.",
      { logId: z.string() },
      { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: true },
      async ({ logId }, extra) => run(() => syncContactCall(userIdFrom(extra), logId)),
    );
    server.tool(
      "log_call",
      "Record a phone call with a seller that happened outside Shopper (for context). Does not place a call.",
      {
        contactId: z.string(),
        direction: z.enum(["INBOUND", "OUTBOUND"]),
        toNumber: z.string().max(40).optional(),
        fromNumber: z.string().max(40).optional(),
        summary: z.string().max(10000).optional(),
        transcript: z.string().max(100000).optional(),
        status: z.string().max(40).optional(),
        durationSec: z.number().int().min(0).optional(),
        recordingUrl: z.string().max(1000).optional(),
      },
      { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
      async (a, extra) => run(() => saveCall(userIdFrom(extra), a)),
    );

    /* ----------------------- Outreach tracking -------------------- */
    server.tool(
      "log_outreach",
      "Record that you reached out to a seller or supplier: stamps when, advances status (defaults to CONTACTED), and logs what you said as an activity. Call this after every outbound message so follow-ups stay reliable.",
      {
        contactId: z.string(),
        summary: z.string().max(5000),
        channel: z.enum(["email", "linkedin", "phone"]).optional(),
        status: z
          .enum(["NEW", "ENRICHED", "CONTACTED", "REPLIED", "QUALIFIED", "WON", "LOST", "ARCHIVED"])
          .optional(),
      },
      { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
      async (a, extra) => run(() => logOutreach(userIdFrom(extra), a)),
    );
    server.tool(
      "list_due_followups",
      "List seller contacts that need a follow-up (quotes you are waiting on, suppliers who have not replied): in a given status (default CONTACTED) and not contacted in the last N days (default 7), oldest first.",
      {
        status: z
          .enum(["NEW", "ENRICHED", "CONTACTED", "REPLIED", "QUALIFIED", "WON", "LOST", "ARCHIVED"])
          .optional(),
        staleDays: z.number().int().min(0).max(365).optional(),
        limit: z.number().int().min(1).max(200).optional(),
      },
      { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      async (a, extra) => run(() => listDueFollowups(userIdFrom(extra), a)),
    );
    server.tool(
      "add_activity",
      "Log a timestamped note, call, or reply on a seller contact or seller without overwriting its notes field.",
      {
        contactId: z.string().optional(),
        entityId: z.string().optional(),
        kind: z.enum(["note", "call", "outreach", "reply", "status_change"]),
        body: z.string().max(10000),
        channel: z.string().max(40).optional(),
      },
      { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
      async (a, extra) => run(() => addActivity(userIdFrom(extra), a)),
    );
    server.tool(
      "list_activities",
      "Get the activity trail (outreach, notes, calls, replies) for a seller contact or seller, newest first.",
      {
        contactId: z.string().optional(),
        entityId: z.string().optional(),
        limit: z.number().int().min(1).max(100).optional(),
      },
      { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      async (a, extra) => run(() => listActivities(userIdFrom(extra), a)),
    );
  },
  {
    serverInfo: { name: "shopper", version: "0.1.0" },
    instructions: `Shopper is a shopping engine that you, an AI agent, operate end to end for your user. You hunt the web for items they want, watch for new listings, keep their wish list and shopping lists current, source manufacturers (Pro), and pay for your own usage when credits run low. Reads and writes to the wish list are free; only actions that go out to the real web (hunts, scraping, enrichment, browser sessions) cost credits.

THE SHOPPING LOOP
1. Orient. Call get_balance to know your runway, get_user_context to load the user's sizes, tastes, and budgets, and recall for past context (this session is stateless). Call search_wishlist before hunting so you build on saved records instead of duplicating them.
2. Hunt. Use find_items for comprehensive shopping from a prompt (it searches across stores, marketplaces, and listings via Exa deep research). Use find_local_stores for shopping nearby via Google Maps. Use search_web (Tavily) and google_search to read raw results, check prices, and read reviews. When you find something worth keeping, call save_item with the title, listing url, price, and condition - do not present a raw search hit as a vetted find.
3. Go deep when scraping is not enough. deep_shopping_session gives you a real browser (Browserbase) for forums, marketplaces, and javascript-heavy storefronts - connect over CDP, browse like a person, then save_item what you find. Paid plans.
4. Vet before buying. enrich_source for firmographics on an unknown store, verify_seller against public registries (GLEIF, Companies House, SEC EDGAR) before a big purchase or new supplier, detect_store_tech to judge how established a shop is. Prefer a null over a wrong value - never attach data to the wrong seller.
5. Keep the lists. Items are the star: save_item saves a thing to buy (carry its price, condition, and url), list_items reads the wish list, update_item fixes details, mark_item_purchased checks it off. Sellers (the stores and manufacturers themselves) are saved with create_source. Shopping lists group items: create_shopping_list for anything that needs buying (groceries, a move, auto parts, business supplies), then save_item with that list's listId to add to it, mark_item_purchased as things arrive, and list_shopping_lists / get_shopping_list to report progress.
6. Work seller relationships (sourcing). source_manufacturers (Pro) finds factories and wholesale suppliers. extract_seller_details pulls public contact info from a seller site; enrich_seller_contact completes a person's email or phone; place_call has the AI phone agent call a seller about stock or price; save_email_context and log_outreach keep every thread on the record; list_due_followups finds quotes worth chasing.
7. Learn the user. When you discover a durable fact (a size, a brand they love, a budget ceiling), merge it into update_user_context and remember the decision - every future hunt gets sharper.

ACCURACY IS NON-NEGOTIABLE. Never present a listing you did not verify exists, never attach details to the wrong seller, and always carry the price, condition, and URL with a saved item. Prefer "couldn't find it" over a guess.

WHEN YOU RUN OUT OF CREDITS, PAY AND RETRY. Metered tools return a JSON error with "error":"insufficient_credits" carrying a remedy. Do not stall or ask the human. Instead: (1) call buy_credits with no xPayment to get a quote, (2) sign the USDC payment with your x402 client and call buy_credits again with xPayment set, (3) retry the exact call that failed. Top-ups are idempotent, so a retried payment never double-charges. For sustained work, buy_plan (plus or pro) is cheaper per credit. Only escalate to the human if buy_credits reports that agent payments are not configured.

Be economical: every external call spends real money. Orient before you hunt, dedupe by reading first, go deep only when scraping falls short, and always advance the record's state so your next session resumes cleanly.`,
  },
  { basePath: "/api/mcp" },
);

// Per-user API key auth: resolve the bearer token to a Shopper user and inject
// the userId into authInfo.extra for the tools to scope on.
const authHandler = withMcpAuth(
  handler,
  async (req, bearerToken): Promise<AuthInfo | undefined> => {
    const token = bearerToken ?? bearerFromRequest(req);
    if (!token) return undefined;

    // Per-user API key (scl_...) first.
    const user = await authenticateApiKey(token);
    if (user) {
      return { token, clientId: user.id, scopes: [], extra: { userId: user.id } };
    }

    // OAuth access token (issued by our authorization server).
    const userId = await userIdFromAccessToken(token);
    if (userId) {
      return { token, clientId: userId, scopes: [], extra: { userId } };
    }

    return undefined;
  },
  {
    required: true,
    // 401s point clients at our protected-resource metadata, kicking off OAuth.
    resourceMetadataPath: "/.well-known/oauth-protected-resource",
  },
);

export { authHandler as GET, authHandler as POST, authHandler as DELETE };
