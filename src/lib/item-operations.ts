// Item + shopping-list operations - the shared core behind both the REST API
// (/api/items, /api/lists) and the MCP tools. An Item is a thing the user wants
// to buy; a "list" is a Pipeline row (table shopping_lists) that groups items.
// Reads and writes here are free (no credits): the meter only bills going out
// to the real web, which happens in the hunt tools, not here.

import { Prisma, ItemStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { OpError } from "@/lib/crm-operations";

// The list row the UI and agents work with: name, goal, and item tallies.
const listInclude = {
  _count: { select: { items: true } },
} satisfies Prisma.PipelineInclude;

export type ItemInput = {
  title: string;
  url?: string | null;
  imageUrl?: string | null;
  price?: string | null;
  currency?: string | null;
  condition?: string | null;
  quantity?: number | null;
  notes?: string | null;
  tags?: string[];
  status?: ItemStatus;
  sellerId?: string | null;
  listId?: string | null;
  source?: string | null;
};

function clean(s: string | null | undefined): string | undefined {
  const t = s?.trim();
  return t ? t : undefined;
}

/** List a user's items, newest first. Filter by status and/or list. */
export async function listItems(
  userId: string,
  opts: { status?: ItemStatus; listId?: string; q?: string } = {},
) {
  const where: Prisma.ItemWhereInput = { userId };
  if (opts.status) where.status = opts.status;
  if (opts.listId) where.listId = opts.listId;
  if (opts.q?.trim()) {
    const q = opts.q.trim();
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { notes: { contains: q, mode: "insensitive" } },
    ];
  }
  return prisma.item.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: { seller: { select: { id: true, name: true } }, list: { select: { id: true, name: true } } },
    take: 500,
  });
}

/** Save an item to the wish list (optionally onto a list and/or a seller). */
export async function createItem(userId: string, input: ItemInput) {
  const title = clean(input.title);
  if (!title) throw new OpError("An item needs a title.", 400);

  // Verify any referenced seller / list belongs to this user before linking.
  if (input.sellerId) {
    const seller = await prisma.entity.findFirst({ where: { id: input.sellerId, userId }, select: { id: true } });
    if (!seller) throw new OpError("Seller not found.", 404);
  }
  if (input.listId) {
    const list = await prisma.pipeline.findFirst({ where: { id: input.listId, userId }, select: { id: true } });
    if (!list) throw new OpError("List not found.", 404);
  }

  return prisma.item.create({
    data: {
      userId,
      title,
      url: clean(input.url),
      imageUrl: clean(input.imageUrl),
      price: clean(input.price),
      currency: clean(input.currency),
      condition: clean(input.condition),
      quantity: input.quantity ?? undefined,
      notes: clean(input.notes),
      tags: input.tags ?? [],
      status: input.status ?? "WANTED",
      sellerId: input.sellerId ?? undefined,
      listId: input.listId ?? undefined,
      source: input.source ?? "manual",
      purchasedAt: input.status === "PURCHASED" ? new Date() : undefined,
    },
  });
}

/** Update an item. Passing status PURCHASED stamps purchasedAt (and clears it on the way back). */
export async function updateItem(userId: string, id: string, patch: Partial<ItemInput>) {
  const existing = await prisma.item.findFirst({ where: { id, userId }, select: { id: true, status: true } });
  if (!existing) throw new OpError("Item not found.", 404);

  const data: Prisma.ItemUpdateInput = {};
  if (patch.title !== undefined) data.title = clean(patch.title) ?? undefined;
  if (patch.url !== undefined) data.url = clean(patch.url) ?? null;
  if (patch.imageUrl !== undefined) data.imageUrl = clean(patch.imageUrl) ?? null;
  if (patch.price !== undefined) data.price = clean(patch.price) ?? null;
  if (patch.currency !== undefined) data.currency = clean(patch.currency) ?? null;
  if (patch.condition !== undefined) data.condition = clean(patch.condition) ?? null;
  if (patch.quantity !== undefined) data.quantity = patch.quantity ?? null;
  if (patch.notes !== undefined) data.notes = clean(patch.notes) ?? null;
  if (patch.tags !== undefined) data.tags = patch.tags;
  if (patch.listId !== undefined) data.list = patch.listId ? { connect: { id: patch.listId } } : { disconnect: true };
  if (patch.sellerId !== undefined) data.seller = patch.sellerId ? { connect: { id: patch.sellerId } } : { disconnect: true };
  if (patch.status !== undefined) {
    data.status = patch.status;
    data.purchasedAt = patch.status === "PURCHASED" ? new Date() : null;
  }

  return prisma.item.update({ where: { id }, data });
}

/** Mark an item purchased (or back to wanted). The shopping-list check-off. */
export async function setItemStatus(userId: string, id: string, status: ItemStatus) {
  return updateItem(userId, id, { status });
}

export async function deleteItem(userId: string, id: string) {
  const existing = await prisma.item.findFirst({ where: { id, userId }, select: { id: true } });
  if (!existing) throw new OpError("Item not found.", 404);
  await prisma.item.delete({ where: { id } });
  return { deleted: true };
}

/* ------------------------------- Lists -------------------------------- */

/** List the user's shopping lists with item counts and how many are purchased. */
export async function listShoppingLists(userId: string) {
  const lists = await prisma.pipeline.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: listInclude,
  });
  // Purchased counts in one grouped query, then merged in.
  const purchased = await prisma.item.groupBy({
    by: ["listId"],
    where: { userId, status: "PURCHASED", listId: { not: null } },
    _count: { _all: true },
  });
  const boughtByList = new Map(purchased.map((p) => [p.listId, p._count._all]));
  return lists.map((l) => ({
    id: l.id,
    name: l.name,
    goal: l.goal,
    total: l._count.items,
    purchased: boughtByList.get(l.id) ?? 0,
    createdAt: l.createdAt,
    updatedAt: l.updatedAt,
  }));
}

/** A single list with its items, wanted first then purchased. */
export async function getShoppingList(userId: string, id: string) {
  const list = await prisma.pipeline.findFirst({ where: { id, userId } });
  if (!list) throw new OpError("List not found.", 404);
  const items = await prisma.item.findMany({
    where: { userId, listId: id },
    orderBy: [{ status: "asc" }, { createdAt: "asc" }],
    include: { seller: { select: { id: true, name: true } } },
  });
  return { list: { id: list.id, name: list.name, goal: list.goal }, items };
}

export async function createShoppingList(userId: string, input: { name: string; goal?: string }) {
  const name = clean(input.name);
  if (!name) throw new OpError("A list needs a name.", 400);
  return prisma.pipeline.create({ data: { userId, name, goal: clean(input.goal) } });
}

export async function deleteShoppingList(userId: string, id: string) {
  const existing = await prisma.pipeline.findFirst({ where: { id, userId }, select: { id: true } });
  if (!existing) throw new OpError("List not found.", 404);
  // Items detach (listId set null via FK) rather than being destroyed, so a
  // deleted list never silently deletes things the user still wants.
  await prisma.pipeline.delete({ where: { id } });
  return { deleted: true };
}
