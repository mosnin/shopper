"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, Trash2, ArrowLeft, Check, Plus, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FloatIn } from "@/components/ui/float-in";
import { AsciiField } from "@/components/dashboard/ascii-field";
import { cn } from "@/lib/utils";

type ListSummary = {
  id: string;
  name: string;
  goal: string | null;
  total: number;
  purchased: number;
  createdAt: string;
  updatedAt: string;
};

type ItemStatus = "WANTED" | "PURCHASED" | "ARCHIVED";

type Item = {
  id: string;
  title: string;
  url: string | null;
  imageUrl: string | null;
  price: string | number | null;
  condition: string | null;
  quantity: number | null;
  notes: string | null;
  status: ItemStatus;
  seller: { id: string; name: string } | null;
  createdAt: string;
};

export default function ShoppingListPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <FloatIn>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card">
          <AsciiField className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12] dark:opacity-30" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(37,99,235,0.10),transparent_60%)]" />
          <div className="relative z-10 px-6 py-9 sm:px-10 sm:py-12">
            <p className="font-brand text-xs uppercase tracking-[0.25em] text-primary/80">Shopper // Shopping Lists</p>
            <h1 className="font-brand mt-2 text-3xl text-foreground sm:text-4xl">Shopping Lists</h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Keep a list for anything that needs buying: groceries, a move, auto parts, business
              supplies. Your agent hunts the items; you check them off as they arrive.
            </p>
          </div>
        </div>
      </FloatIn>

      {selected ? (
        <ListDetail id={selected} onBack={() => setSelected(null)} />
      ) : (
        <ListOverview onOpen={setSelected} />
      )}
    </div>
  );
}

/* ----------------------------- Overview ----------------------------- */

function ListOverview({ onOpen }: { onOpen: (id: string) => void }) {
  const [lists, setLists] = useState<ListSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    const d = await fetch("/api/lists").then((r) => r.json()).catch(() => ({}));
    setLists(d.lists ?? []);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function create() {
    if (!name.trim()) return;
    setBusy(true); setErr(null);
    try {
      const res = await fetch("/api/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, goal: goal.trim() || undefined }),
      });
      if (res.ok) { setName(""); setGoal(""); setOpen(false); load(); }
      else { const d = await res.json().catch(() => ({})); setErr(d.error ?? "Couldn't create the list."); }
    } catch { setErr("Network error."); }
    finally { setBusy(false); }
  }

  async function remove(id: string) {
    if (!confirm("Delete this list? The items stay in your Wish List.")) return;
    setLists((ls) => ls.filter((l) => l.id !== id));
    await fetch(`/api/lists/${id}`, { method: "DELETE" });
  }

  return (
    <div className="space-y-4">
      <Button size="sm" onClick={() => setOpen((o) => !o)} variant={open ? "glow" : "default"}>
        <Plus className="mr-1.5 h-4 w-4" /> New list
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="List name, e.g. Weekly groceries" />
              <Input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Goal or description (optional)" />
              {err && <p className="text-xs text-destructive">{err}</p>}
              <Button size="sm" onClick={create} disabled={busy || !name.trim()}>
                {busy ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : null} Create list
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading lists...
        </div>
      ) : lists.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
          <p className="font-brand text-base">No lists yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create one for a grocery run, a move, or a restock, or ask your connected agent to build one over MCP.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {lists.map((l) => {
            const pct = l.total > 0 ? Math.round((l.purchased / l.total) * 100) : 0;
            return (
              <div key={l.id} className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30">
                <button type="button" onClick={() => onOpen(l.id)} className="block w-full text-left">
                  <p className="font-brand truncate text-base">{l.name}</p>
                  {l.goal && <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{l.goal}</p>}
                  <p className="mt-3 text-xs text-muted-foreground">
                    {l.purchased} of {l.total} bought
                  </p>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </button>
                <div className="mt-3 flex justify-end">
                  <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-destructive" onClick={() => remove(l.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ----------------------------- Detail ----------------------------- */

function ListDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    const d = await fetch(`/api/lists/${id}`).then((r) => r.json()).catch(() => ({}));
    setName(d.list?.name ?? "List");
    setGoal(d.list?.goal ?? null);
    setItems(d.items ?? []);
    setLoading(false);
  }, [id]);
  useEffect(() => { load(); }, [load]);

  async function addItem() {
    if (!title.trim()) return;
    setAdding(true);
    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, price: price.trim() || undefined, listId: id }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d.item) {
        setItems((its) => [...its, d.item as Item]);
        setTitle("");
        setPrice("");
      }
    } finally {
      setAdding(false);
    }
  }

  async function toggle(item: Item) {
    const next: ItemStatus = item.status === "PURCHASED" ? "WANTED" : "PURCHASED";
    const prev = items;
    setItems((its) => its.map((i) => (i.id === item.id ? { ...i, status: next } : i)));
    try {
      const res = await fetch(`/api/items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) setItems(prev);
    } catch {
      setItems(prev);
    }
  }

  async function remove(item: Item) {
    if (!confirm("Remove this item?")) return;
    setItems((its) => its.filter((i) => i.id !== item.id));
    await fetch(`/api/items/${item.id}`, { method: "DELETE" });
  }

  const visible = items.filter((i) => i.status !== "ARCHIVED");
  const sorted = [...visible].sort((a, b) => {
    const rank = (s: ItemStatus) => (s === "PURCHASED" ? 1 : 0);
    return rank(a.status) - rank(b.status);
  });
  const total = visible.length;
  const purchased = visible.filter((i) => i.status === "PURCHASED").length;
  const pct = total > 0 ? Math.round((purchased / total) * 100) : 0;
  const allDone = total > 0 && purchased === total;

  return (
    <div className="space-y-4">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All lists
      </button>

      <div>
        <h2 className="font-brand text-xl">{name}</h2>
        {goal && <p className="mt-0.5 text-sm text-muted-foreground">{goal}</p>}
      </div>

      <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add an item, e.g. Olive oil" className="flex-1"
          onKeyDown={(e) => { if (e.key === "Enter") addItem(); }} />
        <Input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price (optional)" className="sm:w-40"
          onKeyDown={(e) => { if (e.key === "Enter") addItem(); }} />
        <Button size="sm" onClick={addItem} disabled={adding || !title.trim()}>
          {adding ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Plus className="mr-1.5 h-4 w-4" />} Add
        </Button>
      </div>

      {!loading && total > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground">{purchased} of {total} purchased</p>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
          </div>
          {allDone && (
            <p className="pt-1 text-sm text-primary">All done. Everything on this list is bought.</p>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading items...
        </div>
      ) : total === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
          <p className="text-sm text-muted-foreground">Nothing on this list yet. Add an item or ask your agent to hunt these.</p>
        </div>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {sorted.map((item) => {
            const bought = item.status === "PURCHASED";
            const meta = [
              item.price != null && item.price !== "" ? `$${item.price}` : null,
              item.condition,
              item.seller?.name ? `from ${item.seller.name}` : null,
            ].filter(Boolean).join("  ·  ");
            return (
              <li key={item.id} className="flex items-center gap-3 px-4 py-3">
                <button
                  type="button"
                  onClick={() => toggle(item)}
                  aria-label={bought ? "Mark as not purchased" : "Mark as purchased"}
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                    bought ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"
                  )}
                >
                  {bought && <Check className="h-3.5 w-3.5" />}
                </button>

                <div className="min-w-0 flex-1">
                  <p className={cn("truncate text-sm", bought && "text-muted-foreground line-through")}>{item.title}</p>
                  {meta && <p className="truncate text-xs text-muted-foreground">{meta}</p>}
                </div>

                {item.url && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                    View <ExternalLink className="h-3 w-3" />
                  </a>
                )}

                <button type="button" onClick={() => remove(item)}
                  className="text-muted-foreground transition-colors hover:text-destructive" aria-label="Remove item">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
