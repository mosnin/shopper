"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ListOption = { id: string; name: string };

export function ItemActions({
  itemId,
  status,
  listId,
  price,
  notes,
}: {
  itemId: string;
  status: string;
  listId: string | null;
  price: string | null;
  notes: string | null;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function patch(body: Record<string, unknown>) {
    setBusy(true);
    try {
      await fetch(`/api/items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/items/${itemId}`, { method: "DELETE" });
      if (res.ok) router.push("/wishlist");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {status === "PURCHASED" ? (
        <Button variant="outline" size="sm" disabled={busy} onClick={() => patch({ status: "WANTED" })}>
          <RotateCcw className="mr-1 h-4 w-4" />
          Back to wanted
        </Button>
      ) : (
        <Button variant="glow" size="sm" disabled={busy} onClick={() => patch({ status: "PURCHASED" })}>
          <Check className="mr-1 h-4 w-4" />
          Mark purchased
        </Button>
      )}
      <Button variant="outline" size="icon-sm" disabled={busy} onClick={remove} aria-label="Delete item">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function MoveToList({ itemId, listId }: { itemId: string; listId: string | null }) {
  const router = useRouter();
  const [lists, setLists] = useState<ListOption[] | null>(null);
  const [value, setValue] = useState(listId ?? "");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/lists")
      .then((r) => r.json())
      .then((data) => setLists(data.lists ?? []))
      .catch(() => setLists([]));
  }, []);

  async function move(next: string) {
    setValue(next);
    setBusy(true);
    try {
      await fetch(`/api/items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listId: next || null }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <select
      value={value}
      disabled={busy || !lists}
      onChange={(e) => move(e.target.value)}
      className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
    >
      <option value="">No list</option>
      {(lists ?? []).map((l) => (
        <option key={l.id} value={l.id}>
          {l.name}
        </option>
      ))}
    </select>
  );
}

export function EditPriceNotes({
  itemId,
  price,
  notes,
}: {
  itemId: string;
  price: string | null;
  notes: string | null;
}) {
  const router = useRouter();
  const [priceValue, setPriceValue] = useState(price ?? "");
  const [notesValue, setNotesValue] = useState(notes ?? "");
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);

  async function save() {
    setBusy(true);
    try {
      await fetch(`/api/items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: priceValue || null, notes: notesValue || null }),
      });
      setDirty(false);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Edit</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">Price</label>
          <Input
            value={priceValue}
            onChange={(e) => {
              setPriceValue(e.target.value);
              setDirty(true);
            }}
            placeholder="e.g. $49.99"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">Notes</label>
          <textarea
            value={notesValue}
            onChange={(e) => {
              setNotesValue(e.target.value);
              setDirty(true);
            }}
            rows={4}
            className="flex w-full rounded-2xl border border-input bg-background px-4 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Notes on this item"
          />
        </div>
        <Button size="sm" disabled={busy || !dirty} onClick={save}>
          Save changes
        </Button>
      </CardContent>
    </Card>
  );
}
