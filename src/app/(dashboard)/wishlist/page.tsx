import Link from "next/link";
import { Building2, ShoppingBag, ExternalLink, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Card } from "@/components/ui/card";
import { FloatIn } from "@/components/ui/float-in";
import { ImagePlaceholder } from "@/components/marketing/image-placeholder";
import { EntityRows } from "@/components/dashboard/crm-rows";
import { AddItemButton } from "@/components/dashboard/add-item-button";
import { getDbUser } from "@/lib/server-user";
import { prisma } from "@/lib/prisma";

type Tab = "items" | "sellers";

// Server-side page size for both lists.
const PAGE = 500;

export default async function WishlistPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab: tabParam } = await searchParams;
  const tab: Tab = tabParam === "sellers" ? "sellers" : "items";
  const user = await getDbUser();

  if (!user) {
    return (
      <div className="space-y-2">
        <h1 className="font-brand text-2xl sm:text-3xl text-foreground">Wish List</h1>
        <p className="text-muted-foreground">
          Your account is being set up. Refresh in a moment.
        </p>
      </div>
    );
  }

  const [itemCount, sellerCount] = await Promise.all([
    prisma.item.count({ where: { userId: user.id } }),
    prisma.entity.count({ where: { userId: user.id } }),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <FloatIn delay={0} className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-brand text-2xl sm:text-3xl text-foreground">Wish List</h1>
          <p className="text-muted-foreground mt-1">
            Every item your agents find, in one place. Prices, listings, and the
            sellers behind them.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/shop">Shop</Link>
          </Button>
          {tab === "sellers" ? (
            <Button variant="glow" asChild>
              <Link href="/wishlist/entity/new">
                <Plus className="mr-1 h-4 w-4" />
                Add seller
              </Link>
            </Button>
          ) : (
            <AddItemButton />
          )}
        </div>
      </FloatIn>

      {/* Tabs */}
      <FloatIn delay={0.06}>
        <div className="flex gap-1 border-b border-border">
          <TabLink href="/wishlist?tab=items" active={tab === "items"}>
            Items
            <span className="text-muted-foreground">{itemCount}</span>
          </TabLink>
          <TabLink href="/wishlist?tab=sellers" active={tab === "sellers"}>
            Sellers
            <span className="text-muted-foreground">{sellerCount}</span>
          </TabLink>
        </div>
      </FloatIn>

      <FloatIn delay={0.1}>
        {tab === "sellers" ? (
          <SellersList userId={user.id} />
        ) : (
          <ItemsGrid userId={user.id} />
        )}
      </FloatIn>
    </div>
  );
}

function TabLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "-mb-px flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm transition-colors",
        active
          ? "border-primary text-foreground font-medium"
          : "border-transparent text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </Link>
  );
}

/* ================= Items ================= */

async function ItemsGrid({ userId }: { userId: string }) {
  const items = await prisma.item.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: { seller: { select: { id: true, name: true } } },
    take: PAGE,
  });

  if (items.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={ShoppingBag}
          title="No items yet"
          description="Ask your connected agent to hunt items for you (find_items over MCP), or add one by hand. Everything worth buying lands here."
          action={
            <Button variant="glow" asChild>
              <Link href="/shop">Start shopping</Link>
            </Button>
          }
        />
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <ItemCard
          key={item.id}
          delay={Math.min(i * 0.03, 0.3)}
          item={{
            id: item.id,
            title: item.title,
            url: item.url,
            imageUrl: item.imageUrl,
            price: item.price,
            condition: item.condition,
            status: item.status,
            sellerName: item.seller?.name ?? null,
          }}
        />
      ))}
    </div>
  );
}

type ItemCardData = {
  id: string;
  title: string;
  url: string | null;
  imageUrl: string | null;
  price: string | null;
  condition: string | null;
  status: string;
  sellerName: string | null;
};

function ItemCard({ item, delay }: { item: ItemCardData; delay: number }) {
  const purchased = item.status === "PURCHASED";
  const meta = [item.condition, item.sellerName].filter(Boolean).join(" · ");

  return (
    <FloatIn delay={delay}>
      <Link
        href={`/wishlist/item/${item.id}`}
        className={cn(
          "flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card",
          "shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08),0_1px_3px_-1px_rgba(0,0,0,0.06)]",
          "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_-4px_rgba(0,0,0,0.12),0_2px_6px_-2px_rgba(37,99,235,0.12)]",
          purchased && "opacity-70"
        )}
      >
        {/* Visual */}
        {item.imageUrl ? (
          // Plain img: listing images come from arbitrary external hosts.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.title}
            className="aspect-[4/3] w-full object-cover"
          />
        ) : (
          <ImagePlaceholder
            label="No image"
            aspect="aspect-[4/3]"
            className="rounded-none border-0 border-b border-border"
          />
        )}

        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={cn(
                "line-clamp-2 flex-1 text-sm font-medium text-foreground",
                purchased && "line-through"
              )}
            >
              {item.title}
            </h3>
            {purchased && (
              <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                Purchased
              </span>
            )}
          </div>

          {item.price && (
            <p className="font-brand text-lg text-primary">{item.price}</p>
          )}

          {meta && (
            <p className="line-clamp-1 text-xs text-muted-foreground">{meta}</p>
          )}

          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="mt-auto inline-flex items-center gap-1.5 pt-1 text-xs font-medium text-primary hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View listing
            </a>
          )}
        </div>
      </Link>
    </FloatIn>
  );
}

/* ================= Sellers ================= */

async function SellersList({ userId }: { userId: string }) {
  const entities = await prisma.entity.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { contacts: true } } },
    // The list row never renders the enrichment blob; skip pulling KBs per row.
    omit: { enrichment: true },
    take: PAGE,
  });

  if (entities.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={Building2}
          title="No sellers yet"
          description="Sellers are the stores, marketplaces, and manufacturers behind your items. Ask your agent to find some, or add one manually."
          action={
            <Button variant="glow" asChild>
              <Link href="/wishlist/entity/new">
                <Plus className="mr-1 h-4 w-4" />
                Add seller
              </Link>
            </Button>
          }
        />
      </Card>
    );
  }

  // Serialise dates so the client component receives plain strings.
  const rows = entities.map((e) => ({
    id: e.id,
    name: e.name,
    status: e.status,
    industry: e.industry,
    domain: e.domain,
    location: e.location,
    logoUrl: e.logoUrl,
    updatedAt: e.updatedAt.toISOString(),
    _count: e._count,
  }));

  return <EntityRows entities={rows} />;
}
