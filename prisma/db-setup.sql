-- Shopper - database setup (Postgres on Neon)
-- Generated from prisma/schema.prisma via `prisma migrate diff --from-empty`.
-- Regenerate after any schema change; do not hand-edit table DDL here.
-- Apply with psql or the Neon SQL editor when creating a fresh database
-- (equivalent to `pnpm db:push` plus the extensions and vector index below).

-- 0. Extensions
-- pgvector powers the agent's token-efficient recall (memory_chunks.embedding).
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateEnum
CREATE TYPE "SellerStatus" AS ENUM ('NEW', 'ENRICHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SellerContactStatus" AS ENUM ('NEW', 'ENRICHED', 'CONTACTED', 'REPLIED', 'QUALIFIED', 'WON', 'LOST', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "Emaildirection" AS ENUM ('INBOUND', 'OUTBOUND');

-- CreateEnum
CREATE TYPE "CallDirection" AS ENUM ('INBOUND', 'OUTBOUND');

-- CreateEnum
CREATE TYPE "ShoppingListStage" AS ENUM ('NEW', 'ENRICHED', 'PROSPECTING', 'ENGAGING', 'REPLYING', 'WON', 'LOST');

-- CreateEnum
CREATE TYPE "ConversationStatus" AS ENUM ('OPEN', 'AWAITING_REPLY', 'STALLED', 'CLOSED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "imageUrl" TEXT,
    "role" TEXT NOT NULL DEFAULT 'member',
    "aboutYou" TEXT,
    "agentMailApiKey" TEXT,
    "agentPhoneApiKey" TEXT,
    "taskWebhookUrl" TEXT,
    "plan" TEXT NOT NULL DEFAULT 'beta',
    "creditsRemaining" INTEGER NOT NULL DEFAULT 10000,
    "creditsResetAt" TIMESTAMP(3),
    "stripeCustomerId" TEXT,
    "lastSeenAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_ledger" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "delta" INTEGER NOT NULL,
    "balanceAfter" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "ref" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credit_ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memory_chunks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "refId" TEXT,
    "content" TEXT NOT NULL,
    "embedding" vector(1536),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "memory_chunks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hashedKey" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "last4" TEXT NOT NULL,
    "lastUsedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sellers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT,
    "website" TEXT,
    "logoUrl" TEXT,
    "phone" TEXT,
    "industry" TEXT,
    "location" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "geocodedAt" TIMESTAMP(3),
    "description" TEXT,
    "size" TEXT,
    "status" "SellerStatus" NOT NULL DEFAULT 'NEW',
    "source" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "notes" TEXT,
    "enrichment" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sellers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "geocode_cache" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "displayName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "geocode_cache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seller_contacts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sellerId" TEXT,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "company" TEXT,
    "title" TEXT,
    "website" TEXT,
    "linkedin" TEXT,
    "location" TEXT,
    "imageUrl" TEXT,
    "status" "SellerContactStatus" NOT NULL DEFAULT 'NEW',
    "source" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "notes" TEXT,
    "lastContactedAt" TIMESTAMP(3),
    "enrichment" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seller_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contactId" TEXT,
    "sellerId" TEXT,
    "kind" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "channel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "processed_events" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "processed_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "idempotency_keys" (
    "key" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "idempotency_keys_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "revoked_tokens" (
    "jti" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "revoked_tokens_pkey" PRIMARY KEY ("jti")
);

-- CreateTable
CREATE TABLE "seller_contact_emails" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "agentMailMessageId" TEXT,
    "agentMailThreadId" TEXT,
    "direction" "Emaildirection" NOT NULL,
    "fromAddr" TEXT,
    "toAddr" TEXT,
    "subject" TEXT,
    "body" TEXT,
    "savedAsContext" BOOLEAN NOT NULL DEFAULT false,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seller_contact_emails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seller_contact_calls" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "agentPhoneCallId" TEXT,
    "direction" "CallDirection" NOT NULL,
    "fromNumber" TEXT,
    "toNumber" TEXT,
    "status" TEXT,
    "durationSec" INTEGER,
    "summary" TEXT,
    "transcript" TEXT,
    "recordingUrl" TEXT,
    "savedAsContext" BOOLEAN NOT NULL DEFAULT false,
    "startedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seller_contact_calls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "radar_scans" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "frequency" TEXT NOT NULL DEFAULT 'daily',
    "exaMonitorId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "autoAdd" BOOLEAN NOT NULL DEFAULT true,
    "lastRunAt" TIMESTAMP(3),
    "nextRunAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "radar_scans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "radar_scan_runs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scanId" TEXT NOT NULL,
    "items" JSONB,
    "found" INTEGER NOT NULL DEFAULT 0,
    "added" INTEGER NOT NULL DEFAULT 0,
    "addedToWishlist" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "radar_scan_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research_schedules" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'linkup',
    "depth" TEXT NOT NULL DEFAULT 'deep',
    "frequency" TEXT NOT NULL DEFAULT 'daily',
    "targetType" TEXT,
    "targetId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "lastRunAt" TIMESTAMP(3),
    "nextRunAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "research_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collections" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "goal" TEXT,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collection_members" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "score" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "collection_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_lists" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "goal" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shopping_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_list_items" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "shoppingListId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "stage" "ShoppingListStage" NOT NULL DEFAULT 'NEW',
    "priorityScore" INTEGER,
    "conversationStatus" "ConversationStatus" NOT NULL DEFAULT 'OPEN',
    "lastActivityAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shopping_list_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "field_provenance" (
    "id" TEXT NOT NULL,
    "recordType" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "confidence" INTEGER NOT NULL DEFAULT 80,
    "valueSnapshot" TEXT,
    "retrievedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedAt" TIMESTAMP(3),
    "stale" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "field_provenance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_clerkId_key" ON "users"("clerkId");

-- CreateIndex
CREATE INDEX "credit_ledger_userId_createdAt_idx" ON "credit_ledger"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "conversations_userId_idx" ON "conversations"("userId");

-- CreateIndex
CREATE INDEX "messages_conversationId_idx" ON "messages"("conversationId");

-- CreateIndex
CREATE INDEX "memory_chunks_userId_idx" ON "memory_chunks"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_hashedKey_key" ON "api_keys"("hashedKey");

-- CreateIndex
CREATE INDEX "api_keys_userId_idx" ON "api_keys"("userId");

-- CreateIndex
CREATE INDEX "sellers_userId_idx" ON "sellers"("userId");

-- CreateIndex
CREATE INDEX "sellers_userId_status_idx" ON "sellers"("userId", "status");

-- CreateIndex
CREATE INDEX "sellers_userId_updatedAt_idx" ON "sellers"("userId", "updatedAt");

-- CreateIndex
CREATE INDEX "sellers_userId_createdAt_idx" ON "sellers"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "sellers_userId_domain_idx" ON "sellers"("userId", "domain");

-- CreateIndex
CREATE UNIQUE INDEX "geocode_cache_query_key" ON "geocode_cache"("query");

-- CreateIndex
CREATE INDEX "seller_contacts_userId_idx" ON "seller_contacts"("userId");

-- CreateIndex
CREATE INDEX "seller_contacts_userId_status_idx" ON "seller_contacts"("userId", "status");

-- CreateIndex
CREATE INDEX "seller_contacts_userId_status_lastContactedAt_idx" ON "seller_contacts"("userId", "status", "lastContactedAt");

-- CreateIndex
CREATE INDEX "seller_contacts_sellerId_idx" ON "seller_contacts"("sellerId");

-- CreateIndex
CREATE INDEX "seller_contacts_userId_updatedAt_idx" ON "seller_contacts"("userId", "updatedAt");

-- CreateIndex
CREATE INDEX "seller_contacts_userId_createdAt_idx" ON "seller_contacts"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "activities_userId_createdAt_idx" ON "activities"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "activities_contactId_createdAt_idx" ON "activities"("contactId", "createdAt");

-- CreateIndex
CREATE INDEX "activities_sellerId_createdAt_idx" ON "activities"("sellerId", "createdAt");

-- CreateIndex
CREATE INDEX "processed_events_createdAt_idx" ON "processed_events"("createdAt");

-- CreateIndex
CREATE INDEX "idempotency_keys_createdAt_idx" ON "idempotency_keys"("createdAt");

-- CreateIndex
CREATE INDEX "revoked_tokens_expiresAt_idx" ON "revoked_tokens"("expiresAt");

-- CreateIndex
CREATE INDEX "seller_contact_emails_contactId_idx" ON "seller_contact_emails"("contactId");

-- CreateIndex
CREATE INDEX "seller_contact_emails_agentMailThreadId_idx" ON "seller_contact_emails"("agentMailThreadId");

-- CreateIndex
CREATE INDEX "seller_contact_calls_contactId_idx" ON "seller_contact_calls"("contactId");

-- CreateIndex
CREATE INDEX "seller_contact_calls_agentPhoneCallId_idx" ON "seller_contact_calls"("agentPhoneCallId");

-- CreateIndex
CREATE INDEX "radar_scans_userId_idx" ON "radar_scans"("userId");

-- CreateIndex
CREATE INDEX "radar_scans_active_nextRunAt_idx" ON "radar_scans"("active", "nextRunAt");

-- CreateIndex
CREATE INDEX "radar_scans_exaMonitorId_idx" ON "radar_scans"("exaMonitorId");

-- CreateIndex
CREATE INDEX "radar_scan_runs_scanId_idx" ON "radar_scan_runs"("scanId");

-- CreateIndex
CREATE INDEX "radar_scan_runs_userId_idx" ON "radar_scan_runs"("userId");

-- CreateIndex
CREATE INDEX "research_schedules_userId_idx" ON "research_schedules"("userId");

-- CreateIndex
CREATE INDEX "research_schedules_active_nextRunAt_idx" ON "research_schedules"("active", "nextRunAt");

-- CreateIndex
CREATE INDEX "collections_userId_idx" ON "collections"("userId");

-- CreateIndex
CREATE INDEX "collection_members_contactId_idx" ON "collection_members"("contactId");

-- CreateIndex
CREATE UNIQUE INDEX "collection_members_collectionId_contactId_key" ON "collection_members"("collectionId", "contactId");

-- CreateIndex
CREATE INDEX "shopping_lists_userId_idx" ON "shopping_lists"("userId");

-- CreateIndex
CREATE INDEX "shopping_list_items_userId_idx" ON "shopping_list_items"("userId");

-- CreateIndex
CREATE INDEX "shopping_list_items_contactId_idx" ON "shopping_list_items"("contactId");

-- CreateIndex
CREATE INDEX "shopping_list_items_shoppingListId_stage_idx" ON "shopping_list_items"("shoppingListId", "stage");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_list_items_shoppingListId_contactId_key" ON "shopping_list_items"("shoppingListId", "contactId");

-- CreateIndex
CREATE INDEX "field_provenance_recordType_recordId_idx" ON "field_provenance"("recordType", "recordId");

-- CreateIndex
CREATE INDEX "field_provenance_retrievedAt_idx" ON "field_provenance"("retrievedAt");

-- CreateIndex
CREATE INDEX "field_provenance_stale_idx" ON "field_provenance"("stale");

-- CreateIndex
CREATE UNIQUE INDEX "field_provenance_recordType_recordId_field_key" ON "field_provenance"("recordType", "recordId", "field");

-- AddForeignKey
ALTER TABLE "credit_ledger" ADD CONSTRAINT "credit_ledger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memory_chunks" ADD CONSTRAINT "memory_chunks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sellers" ADD CONSTRAINT "sellers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_contacts" ADD CONSTRAINT "seller_contacts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_contacts" ADD CONSTRAINT "seller_contacts_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "sellers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "seller_contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "sellers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_contact_emails" ADD CONSTRAINT "seller_contact_emails_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "seller_contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_contact_calls" ADD CONSTRAINT "seller_contact_calls_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "seller_contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "radar_scans" ADD CONSTRAINT "radar_scans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "radar_scan_runs" ADD CONSTRAINT "radar_scan_runs_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "radar_scans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_schedules" ADD CONSTRAINT "research_schedules_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_members" ADD CONSTRAINT "collection_members_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_members" ADD CONSTRAINT "collection_members_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "seller_contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_lists" ADD CONSTRAINT "shopping_lists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_list_items" ADD CONSTRAINT "shopping_list_items_shoppingListId_fkey" FOREIGN KEY ("shoppingListId") REFERENCES "shopping_lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_list_items" ADD CONSTRAINT "shopping_list_items_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "seller_contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Vector recall index. HNSW (preferred over ivfflat): higher recall, needs no
-- training/list tuning, and handles ongoing inserts gracefully. Recall uses the
-- cosine operator (embedding <=> query), so the index uses vector_cosine_ops.
CREATE INDEX IF NOT EXISTS "memory_chunks_embedding_hnsw_idx"
  ON "memory_chunks" USING hnsw ("embedding" vector_cosine_ops);
