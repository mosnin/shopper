import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedUser } from "@/lib/auth-utils";
import { OpError } from "@/lib/crm-operations";
import { updateItem, deleteItem } from "@/lib/item-operations";
import { ItemStatus } from "@prisma/client";

const patchSchema = z.object({
  title: z.string().trim().min(1).max(300).optional(),
  url: z.string().trim().max(2000).nullable().optional(),
  imageUrl: z.string().trim().max(2000).nullable().optional(),
  price: z.string().trim().max(80).nullable().optional(),
  condition: z.string().trim().max(80).nullable().optional(),
  quantity: z.number().int().min(1).max(9999).nullable().optional(),
  notes: z.string().trim().max(5000).nullable().optional(),
  listId: z.string().uuid().nullable().optional(),
  sellerId: z.string().uuid().nullable().optional(),
  status: z.nativeEnum(ItemStatus).optional(),
});

// PATCH /api/items/[id] - edit an item, move it to a list, or check it off.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthenticatedUser();
    const { id } = await params;
    const parsed = patchSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "Invalid update" }, { status: 400 });
    const item = await updateItem(user.id, id, parsed.data);
    return NextResponse.json({ item });
  } catch (e) {
    if (e instanceof NextResponse) return e;
    if (e instanceof OpError) return NextResponse.json({ error: e.message }, { status: e.status });
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

// DELETE /api/items/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthenticatedUser();
    const { id } = await params;
    return NextResponse.json(await deleteItem(user.id, id));
  } catch (e) {
    if (e instanceof NextResponse) return e;
    if (e instanceof OpError) return NextResponse.json({ error: e.message }, { status: e.status });
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
