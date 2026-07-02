import Link from "next/link";
import {
  Users,
  Building2,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Card } from "@/components/ui/card";
import { FloatIn } from "@/components/ui/float-in";
import { ContactRows } from "@/components/dashboard/crm-rows";
import { EntityRows } from "@/components/dashboard/crm-rows";
import { CrmHeaderMenu } from "@/components/dashboard/crm-header-menu";
import { getDbUser } from "@/lib/server-user";
import { prisma } from "@/lib/prisma";

type Tab = "contacts" | "entities";

// Server-side page size for both lists.
const PAGE = 500;

export default async function CrmPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; page?: string }>;
}) {
  const { tab: tabParam, page: pageParam } = await searchParams;
  const tab: Tab = tabParam === "entities" ? "entities" : "contacts";
  const parsedPage = Number.parseInt(pageParam ?? "1", 10);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
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

  const [contactCount, entityCount] = await Promise.all([
    prisma.contact.count({ where: { userId: user.id } }),
    prisma.entity.count({ where: { userId: user.id } }),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <FloatIn delay={0} className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-brand text-2xl sm:text-3xl text-foreground">Wish List</h1>
          <p className="text-muted-foreground mt-1">
            Everything your agents find - sellers, stores, and the items worth
            keeping.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/shop">
              Discover
            </Link>
          </Button>
          <Button variant="glow" asChild>
            <Link href={tab === "entities" ? "/wishlist/entity/new" : "/wishlist/new"}>
              <Plus className="mr-1 h-4 w-4" />
              {tab === "entities" ? "Add seller" : "Add contact"}
            </Link>
          </Button>
          {tab === "entities" && <CrmHeaderMenu />}
        </div>
      </FloatIn>

      {/* Tabs */}
      <FloatIn delay={0.06}>
        <div className="flex gap-1 border-b border-border">
          <TabLink href="/wishlist?tab=contacts" active={tab === "contacts"}>
            Seller contacts
            <span className="text-muted-foreground">{contactCount}</span>
          </TabLink>
          <TabLink href="/wishlist?tab=entities" active={tab === "entities"}>
            Sellers & sources
            <span className="text-muted-foreground">{entityCount}</span>
          </TabLink>
        </div>
      </FloatIn>

      <FloatIn delay={0.1}>
        {tab === "contacts" ? (
          <ContactsList userId={user.id} page={page} />
        ) : (
          <EntitiesList userId={user.id} page={page} />
        )}
      </FloatIn>

      <Pager
        tab={tab}
        page={page}
        count={tab === "contacts" ? contactCount : entityCount}
      />
    </div>
  );
}

// Minimal pager, only shown once a list outgrows a single page.
function Pager({ tab, page, count }: { tab: Tab; page: number; count: number }) {
  if (count <= PAGE) return null;
  const totalPages = Math.ceil(count / PAGE);

  return (
    <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
      <span>
        Page {page} of {totalPages}
      </span>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link
            href={`/wishlist?tab=${tab}&page=${Math.max(1, page - 1)}`}
            aria-disabled={page <= 1}
            className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
          >
            Previous
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link
            href={`/wishlist?tab=${tab}&page=${Math.min(totalPages, page + 1)}`}
            aria-disabled={page >= totalPages}
            className={page >= totalPages ? "pointer-events-none opacity-50" : undefined}
          >
            Next
          </Link>
        </Button>
      </div>
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

async function ContactsList({ userId, page }: { userId: string; page: number }) {
  const contacts = await prisma.contact.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: { entity: { select: { id: true, name: true } } },
    // The list row never renders the enrichment blob; skip pulling KBs per row.
    omit: { enrichment: true },
    skip: (page - 1) * PAGE,
    take: PAGE,
  });

  if (contacts.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={Users}
          title="No seller contacts yet"
          description="Your agents save useful contacts at stores and manufacturers here, or add one manually."
          action={
            <Button variant="glow" asChild>
              <Link href="/wishlist/new">
                <Plus className="mr-1 h-4 w-4" />
                Add contact
              </Link>
            </Button>
          }
        />
      </Card>
    );
  }

  // Serialise dates so the client component receives plain strings.
  const rows = contacts.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    title: c.title,
    status: c.status,
    imageUrl: c.imageUrl,
    updatedAt: c.updatedAt.toISOString(),
    entity: c.entity ?? null,
  }));

  return <ContactRows contacts={rows} />;
}

async function EntitiesList({ userId, page }: { userId: string; page: number }) {
  const entities = await prisma.entity.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { contacts: true } } },
    // The list row never renders the enrichment blob; skip pulling KBs per row.
    omit: { enrichment: true },
    skip: (page - 1) * PAGE,
    take: PAGE,
  });

  if (entities.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={Building2}
          title="No sellers yet"
          description="Sellers & sources are the stores, marketplaces, and manufacturers behind your saved items. Ask your agent to find some, or add one manually."
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

