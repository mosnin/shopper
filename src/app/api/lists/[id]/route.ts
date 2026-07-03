import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-utils";
import { OpError } from "@/lib/crm-operations";
import { getShoppingList, deleteShoppingList } from "@/lib/item-operations";

// GET /api/lists/[id] - a list with its items.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthenticatedUser();
    const { id } = await params;
    return NextResponse.json(await getShoppingList(user.id, id));
  } catch (e) {
    if (e instanceof NextResponse) return e;
    if (e instanceof OpError) return NextResponse.json({ error: e.message }, { status: e.status });
    return NextResponse.json({ error: "Failed to load list" }, { status: 500 });
  }
}

// DELETE /api/lists/[id] - delete a list (its items detach, they are not destroyed).
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthenticatedUser();
    const { id } = await params;
    return NextResponse.json(await deleteShoppingList(user.id, id));
  } catch (e) {
    if (e instanceof NextResponse) return e;
    if (e instanceof OpError) return NextResponse.json({ error: e.message }, { status: e.status });
    return NextResponse.json({ error: "Failed to delete list" }, { status: 500 });
  }
}
