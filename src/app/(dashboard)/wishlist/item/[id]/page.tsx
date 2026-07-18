import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FloatIn } from "@/components/ui/float-in";
import { ImagePlaceholder } from "@/components/marketing/image-placeholder";
import { getDbUser } from "@/lib/server-user";
import { prisma } from "@/lib/prisma";
import { ItemActions, MoveToList, EditPriceNotes } from "./actions";

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getDbUser();
  if (!user) redirect("/sign-in");

  const item = await prisma.item.findFirst({
    where: { id, userId: user.id },
    include: {
      seller: { select: { id: true, name: true } },
      list: { select: { id: true, name: true } },
    },
  });
  if (!item) notFound();

  const purchased = item.status === "PURCHASED";

  return (
    <div className="space-y-6">
      <FloatIn delay={0}>
        <Link
          href="/wishlist"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to wish list
        </Link>
      </FloatIn>

      <FloatIn delay={0.06} className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-brand text-2xl sm:text-3xl text-foreground">{item.title}</h1>
            {purchased && <Badge variant="success">Purchased</Badge>}
          </div>
          {item.source && (
            <p className="mt-1 text-sm text-muted-foreground">Source: {item.source}</p>
          )}
        </div>
        <ItemActions
          itemId={item.id}
          status={item.status}
          listId={item.listId}
          price={item.price}
          notes={item.notes}
        />
      </FloatIn>

      <div className="grid gap-6 lg:grid-cols-3">
        <FloatIn delay={0.1} className="lg:col-span-1 space-y-6">
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt={item.title}
              className="aspect-[4/3] w-full rounded-3xl border border-border object-cover"
            />
          ) : (
            <ImagePlaceholder label="No image" aspect="aspect-[4/3]" />
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {item.price && (
                <div>
                  <p className="text-xs text-muted-foreground">Price</p>
                  <p className="font-brand text-2xl text-primary">
                    {item.price}
                    {item.currency ? ` ${item.currency}` : ""}
                  </p>
                </div>
              )}
              <Field label="Condition" value={item.condition} />
              <Field label="Quantity" value={item.quantity ? String(item.quantity) : null} />
              <Field
                label="Seller"
                value={item.seller?.name ?? null}
                href={item.seller ? `/wishlist/entity/${item.seller.id}` : undefined}
              />
              <Field label="List" value={item.list?.name ?? "None"} />
              <Field
                label="Saved"
                value={item.createdAt.toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              />
              {purchased && item.purchasedAt && (
                <Field
                  label="Purchased"
                  value={item.purchasedAt.toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                />
              )}
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 pt-1 text-sm font-medium text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  View listing
                </a>
              )}
              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {item.tags.map((t) => (
                    <Badge key={t} variant="secondary">
                      {t}
                    </Badge>
                  ))}
                </div>
              )}
              {item.notes && (
                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">Notes</p>
                  <p className="whitespace-pre-wrap text-sm">{item.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Move to list</CardTitle>
            </CardHeader>
            <CardContent>
              <MoveToList itemId={item.id} listId={item.listId} />
            </CardContent>
          </Card>
        </FloatIn>

        <FloatIn delay={0.14} className="lg:col-span-2">
          <EditPriceNotes itemId={item.id} price={item.price} notes={item.notes} />
        </FloatIn>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  href,
}: {
  label: string;
  value: string | null | undefined;
  href?: string;
}) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      {href ? (
        <Link href={href} className="text-sm font-medium text-primary hover:underline">
          {value}
        </Link>
      ) : (
        <p className="text-sm font-medium text-foreground">{value}</p>
      )}
    </div>
  );
}
