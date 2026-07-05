// MCP tool catalog - the public source of truth for the tools a connected
// agent gets. Names and descriptions mirror src/app/api/mcp/[transport]/route.ts;
// tests/mcp-catalog.test.ts guards that this list matches the live server 1:1,
// so the "52 tools" claim can never silently drift. Grouped for the /tools page.

export type McpTool = { name: string; summary: string };
export type McpToolGroup = { title: string; blurb: string; tools: McpTool[] };

export const MCP_TOOL_GROUPS: McpToolGroup[] = [
  {
    title: "Hunt the web",
    blurb: "Find items and stores across the whole web, and go deep when scraping is not enough.",
    tools: [
      { name: "find_items", summary: "Comprehensive shopping hunt from a prompt (e.g" },
      { name: "find_local_stores", summary: "Discover local stores and sellers on Google Maps (via Apify) and save the new ones to the wish list, deduped by domain then name" },
      { name: "search_web", summary: "Search the web (Tavily) for items, listings, prices, and reviews, e.g" },
      { name: "google_search", summary: "Run a Google web search via Apify and get organic results (title, URL, snippet) - good for price checks and availability" },
      { name: "deep_shopping_session", summary: "Start a deep-shopping browser session (Browserbase): a real headless browser for hunts that scraping cannot cover - forums, marketplaces, listings tha" },
      { name: "source_manufacturers", summary: "Source manufacturers and suppliers for a product from a prompt (e.g" },
    ],
  },
  {
    title: "Wish list",
    blurb: "Save, read, update, and check off the things you want to buy.",
    tools: [
      { name: "save_item", summary: "Save an item the user wants to the wish list" },
      { name: "list_items", summary: "List items on the wish list, newest first" },
      { name: "update_item", summary: "Update a saved item: fix the price, add a listing url, move it to a shopping list (listId), attach a seller (sellerId), or set status" },
      { name: "mark_item_purchased", summary: "Check an item off: set it PURCHASED (stamps the purchase time), or back to WANTED. This is the shopping-list check-off" },
      { name: "delete_item", summary: "Remove an item from the wish list by id" },
      { name: "search_wishlist", summary: "Search across saved items, sellers, and seller contacts in the wish list" },
    ],
  },
  {
    title: "Shopping lists",
    blurb: "Group items into lists an agent works and checks off as they arrive.",
    tools: [
      { name: "list_shopping_lists", summary: "List the user's shopping lists with item tallies (total and how many are purchased)" },
      { name: "get_shopping_list", summary: "Get a shopping list with all its items (wanted first, then purchased)" },
      { name: "create_shopping_list", summary: "Create a shopping list with a name and optional goal (e.g" },
      { name: "delete_shopping_list", summary: "Delete a shopping list by id" },
    ],
  },
  {
    title: "Sellers & sources",
    blurb: "Track, enrich, and vet the stores and makers behind every find.",
    tools: [
      { name: "list_sources", summary: "List sellers and sources (stores, marketplaces, brands, manufacturers) saved in the wish list, newest first" },
      { name: "get_source", summary: "Get one seller or source by id, including its saved seller contacts" },
      { name: "create_source", summary: "Save a seller, store, marketplace, or manufacturer into the wish list (the place that carries the goods)" },
      { name: "update_source", summary: "Update fields on a saved seller, source, or item record (price changes, status, notes)" },
      { name: "enrich_source", summary: "Enrich a seller or manufacturer via Explorium using its domain (company data + firmographics)" },
      { name: "delete_source", summary: "Permanently delete a seller, source, or item record from the wish list by id" },
      { name: "verify_seller", summary: "Verify a seller or manufacturer against authoritative public registries: GLEIF (global LEI), UK Companies House, and SEC EDGAR (US public companies)" },
      { name: "detect_store_tech", summary: "Detect the technologies a store's website uses (ecommerce platform, CMS, payments, support tools, hosting) by fingerprinting its homepage" },
      { name: "extract_seller_details", summary: "Extract a store or seller site's public contact details (emails, phones, social links) via Firecrawl-grade scraping (Apify), deduped and tied to the s" },
    ],
  },
  {
    title: "Seller contacts",
    blurb: "People at stores and manufacturers, for sourcing and quotes.",
    tools: [
      { name: "list_seller_contacts", summary: "List seller contacts (people at stores, marketplaces, and manufacturers), newest first" },
      { name: "get_seller_contact", summary: "Get one seller contact by id, including the linked seller and saved email context" },
      { name: "create_seller_contact", summary: "Save a seller contact (a person at a store, marketplace, or manufacturer)" },
      { name: "update_seller_contact", summary: "Update fields on a seller contact (including status and seller assignment)" },
      { name: "delete_seller_contact", summary: "Permanently delete a seller contact from the wish list by id" },
      { name: "enrich_seller_contact", summary: "Find and save a seller contact's missing LinkedIn, work email, or phone (key for supplier sourcing)" },
      { name: "save_email_context", summary: "Save an email exchanged with a seller contact (quotes, availability, order threads) onto their record as reusable context" },
    ],
  },
  {
    title: "Collections",
    blurb: "Group seller contacts for sourcing and outreach.",
    tools: [
      { name: "list_collections", summary: "List wish list collections (grouped seller contacts) with member counts" },
      { name: "get_collection", summary: "Get a collection and its member seller contacts" },
      { name: "create_collection", summary: "Create a collection manually, optionally with member seller-contact ids" },
      { name: "build_smart_collection", summary: "Build a collection from a goal: vector-matches the closest eligible seller contacts (enriched, not yet contacted, not already on a shopping list)" },
    ],
  },
  {
    title: "Outreach & calls",
    blurb: "Reach sellers, place and log calls, and chase quotes.",
    tools: [
      { name: "place_call", summary: "Call a seller via the user's connected AgentPhone account: the AI phone agent dials the number and follows your systemPrompt (ask about stock, conditi" },
      { name: "list_contact_calls", summary: "Get the phone-call history with a seller contact (direction, numbers, status, duration, transcript, recording), newest first" },
      { name: "sync_call", summary: "Refresh a logged call from AgentPhone: pull the latest status, duration, transcript, and recording onto the call record" },
      { name: "log_call", summary: "Record a phone call with a seller that happened outside Shopper (for context)" },
      { name: "log_outreach", summary: "Record that you reached out to a seller or supplier: stamps when, advances status (defaults to CONTACTED), and logs what you said as an activity" },
      { name: "list_due_followups", summary: "List seller contacts that need a follow-up (quotes you are waiting on, suppliers who have not replied): in a given status (default CONTACTED) and not" },
      { name: "add_activity", summary: "Log a timestamped note, call, or reply on a seller contact or seller without overwriting its notes field" },
      { name: "list_activities", summary: "Get the activity trail (outreach, notes, calls, replies) for a seller contact or seller, newest first" },
    ],
  },
  {
    title: "Memory & context",
    blurb: "Durable state every connected agent shares.",
    tools: [
      { name: "get_user_context", summary: "Read the About You context: the durable profile that grounds every hunt - sizes, styles and brands loved or avoided, budgets, home and vehicle details" },
      { name: "update_user_context", summary: "Write the About You context" },
      { name: "recall", summary: "Recall relevant past context (earlier hunts, saved preferences, wish list notes) by similarity" },
      { name: "remember", summary: "Persist a durable note or fact to long-term memory so a future session can recall it" },
    ],
  },
  {
    title: "Billing (agent self-pay)",
    blurb: "Agents check balance and buy their own usage with USDC over x402.",
    tools: [
      { name: "get_balance", summary: "Your current Shopper usage balance: credits remaining, plan, and when the meter next resets" },
      { name: "get_usage", summary: "The Shopper price list: how many credits each metered action costs, the plans you can buy, top-up limits, and your current balance" },
      { name: "buy_credits", summary: "Buy more Shopper usage credits with USDC over x402 (pay as you go, $0.01 per credit)" },
      { name: "buy_plan", summary: "Buy a Shopper plan for 30 days with USDC over x402 (plus or pro; cheaper per credit than top-ups for sustained work)" },
    ],
  },
];

export const MCP_TOOL_NAMES: string[] = MCP_TOOL_GROUPS.flatMap((g) => g.tools.map((t) => t.name));
export const MCP_TOOL_COUNT = MCP_TOOL_NAMES.length;

