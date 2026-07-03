"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Plus, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Minimal manual "Add item" control for the Wish List. Reveals a compact form
 * (title required; url, price, condition optional), POSTs to /api/items, then
 * refreshes the server component so the new card appears.
 */
export function AddItemButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, startSaving] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("");

  function reset() {
    setTitle("");
    setUrl("");
    setPrice("");
    setCondition("");
    setError(null);
  }

  function close() {
    setOpen(false);
    reset();
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t) {
      setError("A title is required.");
      return;
    }
    setError(null);
    startSaving(async () => {
      try {
        const res = await fetch("/api/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: t,
            url: url.trim() || undefined,
            price: price.trim() || undefined,
            condition: condition.trim() || undefined,
          }),
        });
        if (!res.ok) {
          const d = (await res.json().catch(() => ({}))) as { error?: string };
          setError(d.error ?? "Could not add the item.");
          return;
        }
        close();
        router.refresh();
      } catch {
        setError("Network error.");
      }
    });
  }

  return (
    <div className="relative">
      <Button variant="glow" onClick={() => setOpen((o) => !o)}>
        <Plus className="mr-1 h-4 w-4" />
        Add item
      </Button>

      <AnimatePresence>
        {open && (
          <>
            <button
              type="button"
              aria-hidden
              onClick={close}
              className="fixed inset-0 z-40 cursor-default bg-background/40 backdrop-blur-sm"
            />
            <motion.form
              onSubmit={submit}
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.16 }}
              className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-xl"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="font-brand text-sm text-foreground">Add an item</p>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={close}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2.5">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What is it? (required)"
                  autoFocus
                />
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Listing link (optional)"
                />
                <div className="flex gap-2">
                  <Input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Price"
                  />
                  <Input
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    placeholder="Condition"
                  />
                </div>
              </div>

              {error && <p className="mt-2 text-xs text-destructive">{error}</p>}

              <div className="mt-3 flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={close}>
                  Cancel
                </Button>
                <Button type="submit" variant="glow" size="sm" disabled={saving}>
                  {saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
                  Add item
                </Button>
              </div>
            </motion.form>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
