import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedUser } from "@/lib/auth-utils";
import { checkRateLimit } from "@/lib/rate-limit";
import { OpError } from "@/lib/crm-operations";
import { listItems, createItem } from "@/lib/item-operations";
import { ItemStatus } from "@prisma/client";

// GET /api/items?status=&listId=&q= - the wish list.
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get("status");
    const status = statusParam && statusParam in ItemStatus ? (statusParam as ItemStatus) : undefined;
    const items = await listItems(user.id, {
      status,
      listId: searchParams.get("listId") ?? undefined,
      q: searchParams.get("q") ?? undefined,
    });
    return NextResponse.json({ items });
  } catch (e) {
    if (e instanceof NextResponse) return e;
    if (e instanceof OpError) return NextResponse.json({ error: e.message }, { status: e.status });
    return NextResponse.json({ error: "Failed to list items" }, { status: 500 });
  }
}

const createSchema = z.object({
  title: z.string().trim().min(1).max(300),
  url: z.string().trim().max(2000).optional(),
  imageUrl: z.string().trim().max(2000).optional(),
  price: z.string().trim().max(80).optional(),
  condition: z.string().trim().max(80).optional(),
  quantity: z.number().int().min(1).max(9999).optional(),
  notes: z.string().trim().max(5000).optional(),
  listId: z.string().uuid().optional(),
  sellerId: z.string().uuid().optional(),
  status: z.nativeEnum(ItemStatus).optional(),
});

// POST /api/items - save an item to the wish list.
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    const rate = await checkRateLimit(`items-create:${user.id}`, 60, 60_000);
    if (!rate.success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    const parsed = createSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "Invalid item" }, { status: 400 });
    const item = await createItem(user.id, parsed.data);
    return NextResponse.json({ item }, { status: 201 });
  } catch (e) {
    if (e instanceof NextResponse) return e;
    if (e instanceof OpError) return NextResponse.json({ error: e.message }, { status: e.status });
    return NextResponse.json({ error: "Failed to save item" }, { status: 500 });
  }
}
