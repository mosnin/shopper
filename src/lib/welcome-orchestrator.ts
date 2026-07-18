// Orchestrator for "Moment 1 - The First Hunt."
//
// A new user types one sentence describing what they want to buy; this module
// runs hunt -> vet -> news through the EXISTING pipeline and streams
// Server-Sent Events back to the /welcome page. The page renders a table
// that fills row by row, live, before the user's eyes.
//
// Hard caps (once per user, ever):
//   - 10 finds hunted
//   - 3 vetted with firmographics
//   - 1 news signal per vetted seller
//
// Metering: the first-run performance is unmetered (free to the user) per the
// product decision in 0006-the-four-moments.md. Provider calls that would
// normally spend credits are called through a BYPASS wrapper that skips the
// credit gate. If a provider is unconfigured, a clearly-labelled seed/sample
// is returned instead - never fabricated as "real" data.
//
// ACCURACY RULE: we pass the wish query directly to exaFindCompanies, which
// already rejects unnamed/junk results. Domain uniqueness is checked before
// saving. We never attach details to the wrong seller.

import { prisma } from "@/lib/prisma";
import { exaFindCompanies, isExaConfigured } from "@/lib/exa";
import { enrichDomain, isExploriumConfigured } from "@/lib/explorium";
import { getCompanyNews, isPipe0Configured } from "@/lib/pipe0";
import { createEntity } from "@/lib/crm-operations";
import { createItem } from "@/lib/item-operations";
import { Prisma } from "@prisma/client";

// --------------------------------------------------------------------------
// Public types - consumed by the route handler and the client
// --------------------------------------------------------------------------

export type WelcomeEventType =
  | "status"        // status line update
  | "company"       // a new find (seller/item) row appeared in the table
  | "enriched"      // a row updated with vetting data
  | "news"          // a row updated with a news signal
  | "done"          // the run completed (includes a summary)
  | "error";        // a non-fatal step error (the run continues)

export interface WelcomeEvent {
  type: WelcomeEventType;
  message?: string;
  company?: WelcomeCompanyRow;
  total?: number;
  enriched?: number;
  hasNews?: number;
}

export interface WelcomeCompanyRow {
  id: string;
  name: string;
  domain: string | null;
  industry: string | null;
  location: string | null;
  description: string | null;
  status: "found" | "enriching" | "enriched" | "news" | "sample";
  newsHeadline?: string;
  isSample?: boolean;
}

// --------------------------------------------------------------------------
// Hard caps for the first-run performance
// --------------------------------------------------------------------------

const MAX_DISCOVER  = 10;
const MAX_ENRICH    = 3;

// --------------------------------------------------------------------------
// Seed/sample data - returned when providers are not configured.
// Clearly labelled isSample:true; never presented as verified real data.
// --------------------------------------------------------------------------

const SEED_COMPANIES: WelcomeCompanyRow[] = [
  {
    id: "seed-1",
    name: "Acme Outfitters (sample)",
    domain: null,
    industry: "Apparel",
    location: "San Francisco, CA",
    description: "A sample clothing store - configure EXA_API_KEY to hunt real stores and listings that match what you want.",
    status: "sample",
    isSample: true,
  },
  {
    id: "seed-2",
    name: "Brightwave Electronics (sample)",
    domain: null,
    industry: "Electronics",
    location: "Austin, TX",
    description: "A sample electronics seller - configure EXA_API_KEY to hunt real stores and listings that match what you want.",
    status: "sample",
    isSample: true,
  },
  {
    id: "seed-3",
    name: "Cascade Home Goods (sample)",
    domain: null,
    industry: "Home & Furniture",
    location: "Chicago, IL",
    description: "A sample home goods store - configure EXA_API_KEY to hunt real stores and listings.",
    status: "sample",
    isSample: true,
  },
];

// --------------------------------------------------------------------------
// Core orchestration function
// --------------------------------------------------------------------------

/**
 * Run the first-hunt performance for a new user. Calls the callback for each
 * event as they happen so the route handler can stream them.
 *
 * @param userId    The Prisma user id (already provisioned).
 * @param icp       The user's one-sentence description of what they want.
 * @param emit      Called for each event; must be non-throwing.
 */
export async function runWelcomeOrchestration(
  userId: string,
  icp: string,
  emit: (event: WelcomeEvent) => void,
): Promise<void> {
  // Once per user, ever: if the first hunt already completed, do not run again.
  // Guards against a double-submit or a second tab creating duplicate finds
  // (the in-batch dedup is per-run and can't see a concurrent run's new rows).
  if (await hasCompletedFirstRun(userId)) {
    emit({ type: "done", message: "Your wish list is already set up.", total: 0, enriched: 0, hasNews: 0 });
    return;
  }

  // Save the wish as the About You context - one sentence, two jobs.
  await prisma.user.update({
    where: { id: userId },
    data: { productContext: icp },
  });

  // Step 1: Hunt for stores and listings
  emit({ type: "status", message: "Hunting for stores and listings that match what you want..." });

  let rows: WelcomeCompanyRow[] = [];
  let usedSeed = false;

  if (!isExaConfigured()) {
    // No hunting provider - use sample data and surface an honest note.
    emit({
      type: "status",
      message: "Hunting provider not configured. Showing sample data. Add EXA_API_KEY to hunt real stores and listings.",
    });
    rows = SEED_COMPANIES.map((s) => ({ ...s }));
    usedSeed = true;

    // Emit each sample row with a brief stagger so the table fills visually.
    for (const row of rows) {
      emit({ type: "company", company: row });
      await delay(300);
    }
  } else {
    // Real hunting via exaFindCompanies (already deduplicated and sanitized).
    let found: Awaited<ReturnType<typeof exaFindCompanies>> = [];
    try {
      found = await exaFindCompanies(icp, MAX_DISCOVER);
    } catch (err) {
      console.error("[welcome-orchestrator] exaFindCompanies failed", err);
      emit({
        type: "error",
        message: "The hunt ran into a problem. Showing partial results.",
      });
    }

    if (found.length === 0) {
      // The hunt returned nothing - fall back to seed so the page is not blank.
      emit({
        type: "status",
        message: "No stores or listings found for that description. Showing sample data so you can see how Shopper works.",
      });
      rows = SEED_COMPANIES.map((s) => ({ ...s }));
      usedSeed = true;
      for (const row of rows) {
        emit({ type: "company", company: row });
        await delay(300);
      }
    } else {
      emit({ type: "status", message: `Found ${found.length} match${found.length === 1 ? "" : "es"}. Building your wish list...` });

      // Deduplicate by domain/name against existing wish list rows + within this batch.
      const existing = await prisma.entity.findMany({
        where: { userId },
        select: { domain: true, name: true },
      });
      const norm = (d?: string | null) =>
        d?.toLowerCase().replace(/^www\./, "").trim() || undefined;
      const seenDomains = new Set(
        existing.map((e) => norm(e.domain)).filter(Boolean) as string[],
      );
      const seenNames = new Set(
        existing.map((e) => e.name.trim().toLowerCase()),
      );

      for (const c of found) {
        const domain = norm(c.domain);
        const nameKey = c.companyName.trim().toLowerCase();
        if ((domain && seenDomains.has(domain)) || seenNames.has(nameKey)) {
          continue;
        }
        if (domain) seenDomains.add(domain);
        seenNames.add(nameKey);

        // Persist via crm-operations so the row is in the dashboard immediately.
        let entity: { id: string; name: string; domain: string | null; industry: string | null; location: string | null; description: string | null };
        try {
          entity = await createEntity(userId, {
            name: c.companyName,
            domain: c.domain ?? null,
            website: c.website ?? null,
            phone: c.phone ?? null,
            industry: c.industry ?? null,
            location: c.address ?? null,
            description: c.description ?? null,
            source: "welcome:exa",
            status: "NEW",
          });
        } catch (err) {
          console.error("[welcome-orchestrator] createEntity failed", err);
          continue;
        }

        // Also save the find as a wish-list item so the list is non-empty
        // after the first run - the seller record alone isn't the shopper's
        // object of interest, the find is.
        try {
          await createItem(userId, {
            title: entity.name,
            url: c.website ?? null,
            notes: entity.description ?? null,
            sellerId: entity.id,
            source: "welcome",
          });
        } catch (err) {
          console.error("[welcome-orchestrator] createItem failed", err);
        }

        const row: WelcomeCompanyRow = {
          id: entity.id,
          name: entity.name,
          domain: entity.domain,
          industry: entity.industry,
          location: entity.location,
          description: entity.description,
          status: "found",
          isSample: false,
        };
        rows.push(row);
        emit({ type: "company", company: row });
        await delay(200);
      }
    }
  }

  if (rows.length === 0) {
    emit({ type: "done", message: "Nothing to show right now. Your agent will find matches when providers are configured.", total: 0, enriched: 0, hasNews: 0 });
    return;
  }

  emit({ type: "status", message: `Found ${rows.length} match${rows.length === 1 ? "" : "es"}. Vetting the top ${Math.min(MAX_ENRICH, rows.length)}...` });

  // Step 2: Vet the top finds (those with a real domain, no samples).
  const toEnrich = rows
    .filter((r) => !r.isSample && r.domain)
    .slice(0, MAX_ENRICH);

  let enrichedCount = 0;
  let newsCount = 0;

  for (const row of toEnrich) {
    if (!row.domain) continue;

    // Signal "enriching" state to the UI.
    emit({
      type: "status",
      message: `Vetting ${row.name}...`,
    });
    emit({ type: "company", company: { ...row, status: "enriching" } });

    if (!isExploriumConfigured()) {
      // No enrichment provider - mark enriched with existing data.
      const updated: WelcomeCompanyRow = { ...row, status: "enriched" };
      emit({ type: "enriched", company: updated });
      enrichedCount++;
      // Still try news even when firmographics is unavailable.
    } else {
      try {
        const enriched = await enrichDomain(row.domain);
        if (enriched) {
          const fields = enriched.fields;
          // Persist enrichment back to the entity.
          const existing = await prisma.entity.findUnique({ where: { id: row.id } });
          if (existing && existing.userId === userId) {
            const existing_enrichment =
              existing.enrichment &&
              typeof existing.enrichment === "object" &&
              !Array.isArray(existing.enrichment)
                ? (existing.enrichment as Record<string, unknown>)
                : {};
            const data: Prisma.EntityUncheckedUpdateInput = {
              status: "ENRICHED",
              enrichment: {
                ...existing_enrichment,
                firmographics: enriched.raw,
              } as Prisma.InputJsonValue,
            };
            if (fields) {
              if (!existing.industry && fields.industry) data.industry = fields.industry;
              if (!existing.location && fields.address) data.location = fields.address;
              if (!existing.phone && fields.phone) data.phone = fields.phone;
              if (!existing.description && fields.description) data.description = fields.description;
              if (!existing.website && fields.website) data.website = fields.website;
            }
            await prisma.entity.update({ where: { id: row.id }, data });
          }

          const updated: WelcomeCompanyRow = {
            ...row,
            industry: fields?.industry ?? row.industry,
            location: fields?.address ?? row.location,
            description: fields?.description ?? row.description,
            status: "enriched",
          };
          emit({ type: "enriched", company: updated });
          enrichedCount++;
          // Update local ref for news step below.
          row.industry = updated.industry;
          row.location = updated.location;
          row.description = updated.description;
          row.status = "enriched";
        } else {
          // Explorium had no data for this domain - mark enriched anyway so
          // the row moves forward. The honest blank is acceptable.
          emit({ type: "enriched", company: { ...row, status: "enriched" } });
          enrichedCount++;
        }
      } catch (err) {
        console.error("[welcome-orchestrator] enrichDomain failed for", row.domain, err);
        emit({
          type: "error",
          message: `Couldn't verify ${row.name} right now. Your agent will retry later.`,
        });
        // Move the row forward without enrichment.
        emit({ type: "enriched", company: { ...row, status: "enriched" } });
        enrichedCount++;
      }
    }

    // Step 3: Attach one news signal per vetted seller.
    if (!isPipe0Configured()) {
      // No news provider - skip silently.
    } else {
      try {
        const newsRaw = await getCompanyNews(row.domain!, row.name);
        const headline = extractNewsHeadline(newsRaw);
        if (headline) {
          const updated: WelcomeCompanyRow = {
            ...row,
            status: "news",
            newsHeadline: headline,
          };
          // Store the headline in the entity's enrichment blob.
          const existing = await prisma.entity.findUnique({ where: { id: row.id } });
          if (existing && existing.userId === userId) {
            const existing_enrichment =
              existing.enrichment &&
              typeof existing.enrichment === "object" &&
              !Array.isArray(existing.enrichment)
                ? (existing.enrichment as Record<string, unknown>)
                : {};
            await prisma.entity.update({
              where: { id: row.id },
              data: {
                enrichment: {
                  ...existing_enrichment,
                  recentNews: { headline, fetchedAt: new Date().toISOString() },
                } as Prisma.InputJsonValue,
              },
            });
          }
          emit({ type: "news", company: updated });
          newsCount++;
        }
      } catch (err) {
        console.error("[welcome-orchestrator] getCompanyNews failed for", row.domain, err);
        // Non-fatal: continue without news.
      }
    }

    await delay(150);
  }

  // Done.
  const sampleNote = usedSeed
    ? " (sample data - configure providers to hunt real stores and listings)"
    : "";
  emit({
    type: "done",
    message: `Your agent is already shopping for you${sampleNote}.`,
    total: rows.length,
    enriched: enrichedCount,
    hasNews: newsCount,
  });
}

// --------------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------------

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Extract the most recent news headline from a Pipe0 company:news response.
// Pipe0 returns nested structures, so we deep-search for the first usable
// headline string.
function extractNewsHeadline(raw: unknown): string | undefined {
  if (!raw) return undefined;
  // Try common shapes:
  // { records: [{ title, headline, ... }] }
  // { results: [{ ... }] }
  // { data: [{ ... }] }
  const arr = findFirstArray(raw);
  if (!arr || arr.length === 0) return undefined;
  const first = arr[0] as Record<string, unknown>;
  const headline =
    pickStr(first, "headline") ??
    pickStr(first, "title") ??
    pickStr(first, "summary") ??
    pickStr(first, "description");
  if (!headline || headline.length < 10) return undefined;
  return headline.length > 120 ? headline.slice(0, 117) + "..." : headline;
}

function findFirstArray(val: unknown, depth = 0): unknown[] | undefined {
  if (depth > 5) return undefined;
  if (Array.isArray(val) && val.length > 0) return val as unknown[];
  if (val && typeof val === "object") {
    for (const v of Object.values(val as Record<string, unknown>)) {
      const found = findFirstArray(v, depth + 1);
      if (found) return found;
    }
  }
  return undefined;
}

function pickStr(obj: Record<string, unknown>, key: string): string | undefined {
  const v = obj[key];
  if (typeof v === "string" && v.trim().length > 0) return v.trim();
  return undefined;
}

// --------------------------------------------------------------------------
// Guard: check if a user has already completed the first hunt.
// A "completed" first hunt means they have an About You context saved OR they
// already have records in their wish list.
// --------------------------------------------------------------------------

export async function hasCompletedFirstRun(userId: string): Promise<boolean> {
  const [user, entityCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { productContext: true },
    }),
    prisma.entity.count({ where: { userId } }),
  ]);
  return Boolean(user?.productContext) || entityCount > 0;
}
