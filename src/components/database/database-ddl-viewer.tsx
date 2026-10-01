'use client';

import React, { useState, useMemo } from 'react';
import {
  FileCode,
  Copy,
  Check,
  Download,
  Search,
  Layers,
  Database,
  Table,
  Key,
  Link2,
  Code2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Filter,
  Eye,
  CheckCircle2,
} from 'lucide-react';

interface SQLSection {
  id: string;
  category: 'extensions' | 'enums' | 'tables' | 'constraints' | 'foreign_keys' | 'seed';
  title: string;
  badge: string;
  badgeColor: string;
  description: string;
  itemCount: number;
  sql: string;
  tablesAffected?: string[];
}

const EXTENSIONS_SQL = `-- ============================================================================
-- 1. POSTGRESQL EXTENSIONS & PREREQUISITES
-- Required for cryptographic hashing, UUID generation, and indexing performance.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set standard timezone and client encoding
SET client_encoding = 'UTF8';
SET timezone = 'UTC';`;

const ENUMS_SQL = `-- ============================================================================
-- 2. CUSTOM DOMAIN ENUMS (13 PostgreSQL Types)
-- Strictly typed enum domains enforcing platform states and condition rubrics.
-- ============================================================================

-- Access control roles
CREATE TYPE "Role" AS ENUM (
  'USER',
  'MODERATOR',
  'ADMIN'
);

-- Classified item classification
CREATE TYPE "ListingType" AS ENUM (
  'BOOK',
  'PRODUCT'
);

-- Exchange payment modes
CREATE TYPE "ExchangeType" AS ENUM (
  'CASH_ONLY',
  'BARTER_ONLY',
  'HYBRID'
);

-- Standardized item condition rubrics
CREATE TYPE "ItemCondition" AS ENUM (
  'BRAND_NEW',
  'LIKE_NEW',
  'VERY_GOOD',
  'GOOD',
  'ACCEPTABLE'
);

-- Listing lifecycle states
CREATE TYPE "ListingStatus" AS ENUM (
  'ACTIVE',
  'RESERVED',
  'PENDING_EXCHANGE',
  'SOLD',
  'TRADED',
  'ARCHIVED'
);

-- Physical book binding format
CREATE TYPE "BookFormat" AS ENUM (
  'HARDCOVER',
  'PAPERBACK',
  'MASS_MARKET',
  'SPIRAL',
  'OTHER'
);

-- Cash negotiation proposal states
CREATE TYPE "OfferStatus" AS ENUM (
  'PENDING',
  'COUNTERED',
  'ACCEPTED',
  'DECLINED',
  'EXPIRED',
  'CANCELLED',
  'COMPLETED'
);

-- Barter swap workflow states
CREATE TYPE "BarterStatus" AS ENUM (
  'PROPOSED',
  'COUNTERED',
  'ACCEPTED',
  'REJECTED',
  'CANCELLED',
  'COMPLETED'
);

-- Chat messaging payload types
CREATE TYPE "MessageType" AS ENUM (
  'TEXT',
  'CASH_OFFER_CARD',
  'BARTER_PROPOSAL_CARD',
  'SYSTEM_ALERT'
);

-- Transaction classification for reviews
CREATE TYPE "TransactionType" AS ENUM (
  'CASH_SALE',
  'BARTER_EXCHANGE'
);

-- Community moderation report status
CREATE TYPE "ReportStatus" AS ENUM (
  'OPEN',
  'RESOLVED',
  'DISMISSED'
);

-- Listing promotion flags
CREATE TYPE "PromotionType" AS ENUM (
  'FEATURED',
  'URGENT',
  'TOP'
);

-- Activity notification triggers
CREATE TYPE "NotificationType" AS ENUM (
  'OFFER',
  'BARTER',
  'MESSAGE',
  'PRICE_DROP',
  'SYSTEM'
);`;

const TABLES_SQL_USERS = `-- Domain: User Identity & Trust
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "bio" TEXT,
    "phone" TEXT,
    "city" TEXT NOT NULL DEFAULT 'New York',
    "state" TEXT NOT NULL DEFAULT 'NY',
    "country" TEXT NOT NULL DEFAULT 'USA',
    "postalCode" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "reputationScore" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "totalTrades" INTEGER NOT NULL DEFAULT 0,
    "totalSales" INTEGER NOT NULL DEFAULT 0,
    "responseRate" INTEGER NOT NULL DEFAULT 100,
    "avgResponseTime" TEXT NOT NULL DEFAULT 'Within 1 hour',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Follow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);`;

const TABLES_SQL_CATALOG = `-- Domain: Catalog & Item Specifications
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "listingType" "ListingType" NOT NULL,
    "exchangeType" "ExchangeType" NOT NULL,
    "price" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "isNegotiable" BOOLEAN NOT NULL DEFAULT true,
    "condition" "ItemCondition" NOT NULL,
    "status" "ListingStatus" NOT NULL DEFAULT 'ACTIVE',
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pickupAvailable" BOOLEAN NOT NULL DEFAULT true,
    "shippingAvailable" BOOLEAN NOT NULL DEFAULT false,
    "shippingCost" DOUBLE PRECISION,
    "barterWishlist" TEXT,
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
    "sharesCount" INTEGER NOT NULL DEFAULT 0,
    "previousPrice" DOUBLE PRECISION,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isUrgent" BOOLEAN NOT NULL DEFAULT false,
    "isTopAd" BOOLEAN NOT NULL DEFAULT false,
    "featuredUntil" TIMESTAMP(3),
    "urgentUntil" TIMESTAMP(3),
    "topUntil" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "BookDetails" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "listingId" TEXT NOT NULL,
    "isbn" TEXT,
    "isbn13" TEXT,
    "author" TEXT NOT NULL,
    "publisher" TEXT,
    "publicationYear" INTEGER,
    "edition" TEXT,
    "genre" TEXT NOT NULL,
    "format" "BookFormat" NOT NULL DEFAULT 'PAPERBACK',
    "language" TEXT NOT NULL DEFAULT 'English',
    "pageCount" INTEGER,
    "hasAnnotations" BOOLEAN NOT NULL DEFAULT false,
    "academicSubject" TEXT,
    "courseCode" TEXT
);

CREATE TABLE "ProductDetails" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "listingId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subCategory" TEXT,
    "brand" TEXT,
    "model" TEXT,
    "includesOriginalBox" BOOLEAN NOT NULL DEFAULT false,
    "includesAccessories" BOOLEAN NOT NULL DEFAULT false,
    "warrantyStatus" TEXT
);

CREATE TABLE "PriceHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "listingId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "SavedListing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "SavedSearch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);`;

const TABLES_SQL_BARTERS = `-- Domain: Barter Proposals & Cash Negotiations
CREATE TABLE "CashOffer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "listingId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "offerAmount" DOUBLE PRECISION NOT NULL,
    "counterAmount" DOUBLE PRECISION,
    "status" "OfferStatus" NOT NULL DEFAULT 'PENDING',
    "message" TEXT,
    "expiresAt" TIMESTAMP(3),
    "conversationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "BarterProposal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "initiatorId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "targetListingId" TEXT NOT NULL,
    "cashTopUp" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "BarterStatus" NOT NULL DEFAULT 'PROPOSED',
    "exchangeCode" TEXT,
    "notes" TEXT,
    "conversationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "BarterItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "proposalId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL
);`;

const TABLES_SQL_CHATS = `-- Domain: Real-time Messaging & Chat Threads
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "participantAId" TEXT NOT NULL,
    "participantBId" TEXT NOT NULL,
    "listingId" TEXT,
    "lastMessageAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "messageType" "MessageType" NOT NULL DEFAULT 'TEXT',
    "metadata" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);`;

const TABLES_SQL_SAFETY = `-- Domain: Social Trust, Auditing & System Notifications
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reviewerId" TEXT NOT NULL,
    "targetUserId" TEXT NOT NULL,
    "listingId" TEXT,
    "transactionType" "TransactionType" NOT NULL,
    "overallRating" INTEGER NOT NULL,
    "conditionRating" INTEGER NOT NULL,
    "communicationRating" INTEGER NOT NULL,
    "punctualityRating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Report" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reporterId" TEXT NOT NULL,
    "reportedUserId" TEXT NOT NULL,
    "listingId" TEXT,
    "reason" TEXT NOT NULL,
    "details" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "href" TEXT,
    "listingId" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);`;

const CONSTRAINTS_SQL = `-- ============================================================================
-- 4. UNIQUE CONSTRAINTS & PERFORMANCE INDEXES
-- Enforces data integrity and speeds up search/filter lookups.
-- ============================================================================

-- Unique Constraints
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "BookDetails_listingId_key" ON "BookDetails"("listingId");
CREATE UNIQUE INDEX "ProductDetails_listingId_key" ON "ProductDetails"("listingId");
CREATE UNIQUE INDEX "SavedListing_userId_listingId_key" ON "SavedListing"("userId", "listingId");
CREATE UNIQUE INDEX "Follow_followerId_followingId_key" ON "Follow"("followerId", "followingId");

-- Composite & Query Indexes
CREATE INDEX "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");
CREATE INDEX "Listing_userId_idx" ON "Listing"("userId");
CREATE INDEX "Listing_status_exchangeType_idx" ON "Listing"("status", "exchangeType");
CREATE INDEX "CashOffer_listingId_idx" ON "CashOffer"("listingId");
CREATE INDEX "CashOffer_buyerId_idx" ON "CashOffer"("buyerId");
CREATE INDEX "CashOffer_sellerId_idx" ON "CashOffer"("sellerId");
CREATE INDEX "BarterProposal_targetListingId_idx" ON "BarterProposal"("targetListingId");
CREATE INDEX "BarterProposal_initiatorId_idx" ON "BarterProposal"("initiatorId");
CREATE INDEX "BarterProposal_recipientId_idx" ON "BarterProposal"("recipientId");
CREATE INDEX "BarterItem_proposalId_idx" ON "BarterItem"("proposalId");
CREATE INDEX "Conversation_participantAId_idx" ON "Conversation"("participantAId");
CREATE INDEX "Conversation_participantBId_idx" ON "Conversation"("participantBId");
CREATE INDEX "Message_conversationId_idx" ON "Message"("conversationId");
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");
CREATE INDEX "Review_targetUserId_idx" ON "Review"("targetUserId");`;

const FOREIGN_KEYS_SQL = `-- ============================================================================
-- 5. FOREIGN KEY CONSTRAINTS & REFERENTIAL INTEGRITY
-- Enforces cascading deletions, nullable links, and strict parent-child checks.
-- ============================================================================

-- Listing Owner FK
ALTER TABLE "Listing" 
  ADD CONSTRAINT "Listing_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "User"("id") 
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Book Details 1:1 FK
ALTER TABLE "BookDetails" 
  ADD CONSTRAINT "BookDetails_listingId_fkey" 
  FOREIGN KEY ("listingId") REFERENCES "Listing"("id") 
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Product Details 1:1 FK
ALTER TABLE "ProductDetails" 
  ADD CONSTRAINT "ProductDetails_listingId_fkey" 
  FOREIGN KEY ("listingId") REFERENCES "Listing"("id") 
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Price History FK
ALTER TABLE "PriceHistory" 
  ADD CONSTRAINT "PriceHistory_listingId_fkey" 
  FOREIGN KEY ("listingId") REFERENCES "Listing"("id") 
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Saved Listings FKs
ALTER TABLE "SavedListing" 
  ADD CONSTRAINT "SavedListing_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "User"("id") 
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SavedListing" 
  ADD CONSTRAINT "SavedListing_listingId_fkey" 
  FOREIGN KEY ("listingId") REFERENCES "Listing"("id") 
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Saved Searches FK
ALTER TABLE "SavedSearch" 
  ADD CONSTRAINT "SavedSearch_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "User"("id") 
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Cash Offer FKs
ALTER TABLE "CashOffer" 
  ADD CONSTRAINT "CashOffer_listingId_fkey" 
  FOREIGN KEY ("listingId") REFERENCES "Listing"("id") 
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CashOffer" 
  ADD CONSTRAINT "CashOffer_buyerId_fkey" 
  FOREIGN KEY ("buyerId") REFERENCES "User"("id") 
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CashOffer" 
  ADD CONSTRAINT "CashOffer_sellerId_fkey" 
  FOREIGN KEY ("sellerId") REFERENCES "User"("id") 
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Barter Proposal FKs
ALTER TABLE "BarterProposal" 
  ADD CONSTRAINT "BarterProposal_initiatorId_fkey" 
  FOREIGN KEY ("initiatorId") REFERENCES "User"("id") 
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "BarterProposal" 
  ADD CONSTRAINT "BarterProposal_recipientId_fkey" 
  FOREIGN KEY ("recipientId") REFERENCES "User"("id") 
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "BarterProposal" 
  ADD CONSTRAINT "BarterProposal_targetListingId_fkey" 
  FOREIGN KEY ("targetListingId") REFERENCES "Listing"("id") 
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Barter Items Junction FKs
ALTER TABLE "BarterItem" 
  ADD CONSTRAINT "BarterItem_proposalId_fkey" 
  FOREIGN KEY ("proposalId") REFERENCES "BarterProposal"("id") 
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "BarterItem" 
  ADD CONSTRAINT "BarterItem_listingId_fkey" 
  FOREIGN KEY ("listingId") REFERENCES "Listing"("id") 
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Conversation FKs
ALTER TABLE "Conversation" 
  ADD CONSTRAINT "Conversation_participantAId_fkey" 
  FOREIGN KEY ("participantAId") REFERENCES "User"("id") 
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Conversation" 
  ADD CONSTRAINT "Conversation_participantBId_fkey" 
  FOREIGN KEY ("participantBId") REFERENCES "User"("id") 
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Conversation" 
  ADD CONSTRAINT "Conversation_listingId_fkey" 
  FOREIGN KEY ("listingId") REFERENCES "Listing"("id") 
  ON DELETE SET NULL ON UPDATE CASCADE;

-- Message FKs
ALTER TABLE "Message" 
  ADD CONSTRAINT "Message_conversationId_fkey" 
  FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") 
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Message" 
  ADD CONSTRAINT "Message_senderId_fkey" 
  FOREIGN KEY ("senderId") REFERENCES "User"("id") 
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Message" 
  ADD CONSTRAINT "Message_receiverId_fkey" 
  FOREIGN KEY ("receiverId") REFERENCES "User"("id") 
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Review FKs
ALTER TABLE "Review" 
  ADD CONSTRAINT "Review_reviewerId_fkey" 
  FOREIGN KEY ("reviewerId") REFERENCES "User"("id") 
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Review" 
  ADD CONSTRAINT "Review_targetUserId_fkey" 
  FOREIGN KEY ("targetUserId") REFERENCES "User"("id") 
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Review" 
  ADD CONSTRAINT "Review_listingId_fkey" 
  FOREIGN KEY ("listingId") REFERENCES "Listing"("id") 
  ON DELETE SET NULL ON UPDATE CASCADE;

-- Report FKs
ALTER TABLE "Report" 
  ADD CONSTRAINT "Report_reporterId_fkey" 
  FOREIGN KEY ("reporterId") REFERENCES "User"("id") 
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Report" 
  ADD CONSTRAINT "Report_reportedUserId_fkey" 
  FOREIGN KEY ("reportedUserId") REFERENCES "User"("id") 
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Report" 
  ADD CONSTRAINT "Report_listingId_fkey" 
  FOREIGN KEY ("listingId") REFERENCES "Listing"("id") 
  ON DELETE SET NULL ON UPDATE CASCADE;

-- Notification FKs
ALTER TABLE "Notification" 
  ADD CONSTRAINT "Notification_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "User"("id") 
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Notification" 
  ADD CONSTRAINT "Notification_listingId_fkey" 
  FOREIGN KEY ("listingId") REFERENCES "Listing"("id") 
  ON DELETE SET NULL ON UPDATE CASCADE;

-- Follow Social Graph FKs
ALTER TABLE "Follow" 
  ADD CONSTRAINT "Follow_followerId_fkey" 
  FOREIGN KEY ("followerId") REFERENCES "User"("id") 
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Follow" 
  ADD CONSTRAINT "Follow_followingId_fkey" 
  FOREIGN KEY ("followingId") REFERENCES "User"("id") 
  ON DELETE CASCADE ON UPDATE CASCADE;`;

const SEED_BOOTSTRAP_SQL = `-- ============================================================================
-- 6. INITIAL SEED & DEMO PERSONAS BOOTSTRAP (SAMPLE)
-- Populates core accounts and initial listings for immediate testing.
-- ============================================================================

-- Insert Test Personas (password: password123)
INSERT INTO "User" ("id", "name", "email", "password", "city", "state", "reputationScore", "totalTrades", "isVerified")
VALUES 
  ('usr_marcus', 'Marcus Chen', 'marcus@example.com', '$2a$10$fVqX0O2qXvVn...', 'San Francisco', 'CA', 4.95, 14, true),
  ('usr_alex', 'Alex Turner', 'alex@example.com', '$2a$10$fVqX0O2qXvVn...', 'New York', 'NY', 4.88, 19, true),
  ('usr_sarah', 'Sarah Jenkins', 'sarah@example.com', '$2a$10$fVqX0O2qXvVn...', 'Boston', 'MA', 4.92, 18, true),
  ('usr_elena', 'Elena Rostova', 'elena@example.com', '$2a$10$fVqX0O2qXvVn...', 'Austin', 'TX', 5.0, 35, true)
ON CONFLICT ("id") DO NOTHING;

-- Insert Featured Listing
INSERT INTO "Listing" ("id", "userId", "title", "description", "listingType", "exchangeType", "price", "condition", "status", "city", "state", "barterWishlist")
VALUES 
  ('lst_sony_xm5', 'usr_marcus', 'Sony WH-1000XM5 Noise-Cancelling Headphones', 'Flawless silver edition with original case and cabling.', 'PRODUCT', 'HYBRID', 260.00, 'LIKE_NEW', 'ACTIVE', 'San Francisco', 'CA', 'Keychron Q1, Kindle Paperwhite')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ProductDetails" ("id", "listingId", "category", "brand", "model", "includesOriginalBox", "includesAccessories")
VALUES 
  ('pd_sony_xm5', 'lst_sony_xm5', 'Audio & Headphones', 'Sony', 'WH-1000XM5', true, true)
ON CONFLICT ("id") DO NOTHING;`;

const FULL_COMBINED_DDL = `${EXTENSIONS_SQL}

${ENUMS_SQL}

-- ============================================================================
-- 3. CORE TABLES DEFINITIONS (16 Models)
-- ============================================================================

${TABLES_SQL_USERS}

${TABLES_SQL_CATALOG}

${TABLES_SQL_BARTERS}

${TABLES_SQL_CHATS}

${TABLES_SQL_SAFETY}

${CONSTRAINTS_SQL}

${FOREIGN_KEYS_SQL}

${SEED_BOOTSTRAP_SQL}`;

const SECTIONS: SQLSection[] = [
  {
    id: 'all',
    category: 'tables',
    title: 'Complete Production DDL (All Statements)',
    badge: 'All-In-One Script',
    badgeColor: 'bg-primary text-white',
    description: '',
    itemCount: 48,
    sql: FULL_COMBINED_DDL,
  },
  {
    id: 'extensions',
    category: 'extensions',
    title: '1. Extensions & Database Environment',
    badge: 'Prerequisites',
    badgeColor: 'bg-cyan-100 text-cyan-800',
    description: 'Enables necessary PostgreSQL extensions (uuid-ossp, pgcrypto) for primary keys, cryptographic hashes, and sets UTF-8 timezone defaults.',
    itemCount: 2,
    sql: EXTENSIONS_SQL,
  },
  {
    id: 'enums',
    category: 'enums',
    title: '2. Custom Domain Enums (13 Types)',
    badge: '13 Enums',
    badgeColor: 'bg-purple-100 text-purple-800',
    description: 'PostgreSQL CREATE TYPE AS ENUM statements defining all valid exchange modes, lifecycle states, condition rubrics, and payload types.',
    itemCount: 13,
    sql: ENUMS_SQL,
  },
  {
    id: 'tables-users',
    category: 'tables',
    title: '3A. Identity & Social Tables (User, Follow)',
    badge: '2 Tables',
    badgeColor: 'bg-blue-100 text-blue-800',
    description: 'DDL for User accounts, security credentials, geographic locations, trust stats, and follower social graph.',
    itemCount: 2,
    tablesAffected: ['User', 'Follow'],
    sql: TABLES_SQL_USERS,
  },
  {
    id: 'tables-catalog',
    category: 'tables',
    title: '3B. Catalog & Item Specs (Listing, BookDetails, ProductDetails)',
    badge: '6 Tables',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    description: 'DDL for classified items, specialized textbook metadata (ISBN, course codes), electronics hardware specs, price history, and bookmarks.',
    itemCount: 6,
    tablesAffected: ['Listing', 'BookDetails', 'ProductDetails', 'PriceHistory', 'SavedListing', 'SavedSearch'],
    sql: TABLES_SQL_CATALOG,
  },
  {
    id: 'tables-barters',
    category: 'tables',
    title: '3C. Barter & Cash Negotiations (CashOffer, BarterProposal, BarterItem)',
    badge: '3 Tables',
    badgeColor: 'bg-amber-100 text-amber-800',
    description: 'DDL for multi-item swaps, cash top-ups, handshake delivery verification tokens, and price negotiation offers.',
    itemCount: 3,
    tablesAffected: ['CashOffer', 'BarterProposal', 'BarterItem'],
    sql: TABLES_SQL_BARTERS,
  },
  {
    id: 'tables-chats',
    category: 'tables',
    title: '3D. Real-time Messaging & Chat Threads (Conversation, Message)',
    badge: '2 Tables',
    badgeColor: 'bg-indigo-100 text-indigo-800',
    description: 'DDL for conversation channels between traders and in-thread structured deal cards.',
    itemCount: 2,
    tablesAffected: ['Conversation', 'Message'],
    sql: TABLES_SQL_CHATS,
  },
  {
    id: 'tables-safety',
    category: 'tables',
    title: '3E. Trust, Safety & Alerts (Review, Report, Notification)',
    badge: '3 Tables',
    badgeColor: 'bg-rose-100 text-rose-800',
    description: 'DDL for dual-sided post-trade verified reviews, community moderation disputes, and real-time activity alerts.',
    itemCount: 3,
    tablesAffected: ['Review', 'Report', 'Notification'],
    sql: TABLES_SQL_SAFETY,
  },
  {
    id: 'constraints',
    category: 'constraints',
    title: '4. Unique Constraints & Performance Indexes',
    badge: '18 Indexes',
    badgeColor: 'bg-teal-100 text-teal-800',
    description: 'Unique key constraints preventing duplicate emails or bookmarks, alongside B-Tree indexes for fast join and filter query performance.',
    itemCount: 18,
    sql: CONSTRAINTS_SQL,
  },
  {
    id: 'foreign_keys',
    category: 'foreign_keys',
    title: '5. Foreign Key Relations & Referential Integrity',
    badge: '28 FKs',
    badgeColor: 'bg-orange-100 text-orange-800',
    description: 'ALTER TABLE statements creating referential constraints with ON DELETE CASCADE and ON DELETE SET NULL rules across all 16 tables.',
    itemCount: 28,
    sql: FOREIGN_KEYS_SQL,
  },
  {
    id: 'seed',
    category: 'seed',
    title: '6. Bootstrap Seed Data (Demo Personas & Items)',
    badge: 'Sample Seed',
    badgeColor: 'bg-stone-100 text-stone-800',
    description: 'Initial seed SQL statements to quickly populate local development environments with test personas, listings, and products.',
    itemCount: 6,
    sql: SEED_BOOTSTRAP_SQL,
  },
];

export default function DatabaseDDLViewer() {
  const [selectedSectionId, setSelectedSectionId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const selectedSection = useMemo(() => {
    return SECTIONS.find((s) => s.id === selectedSectionId) || SECTIONS[0];
  }, [selectedSectionId]);

  // Filter sections by search
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return SECTIONS;
    const q = searchQuery.toLowerCase();
    return SECTIONS.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.sql.toLowerCase().includes(q) ||
        s.tablesAffected?.some((t) => t.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const handleCopySection = () => {
    navigator.clipboard.writeText(selectedSection.sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(FULL_COMBINED_DDL);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDownloadSQL = () => {
    const blob = new Blob([FULL_COMBINED_DDL], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'barterhub-postgresql-schema.sql';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Stats & Quick Actions */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-surface-container-lowest via-surface-container-low to-surface-container border border-outline-variant/30 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-on-surface">
            Database Creation Commands
          </h2>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleCopyAll}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/30 hover:bg-surface-container text-xs font-bold text-on-surface transition-all shadow-xs"
          >
            {copiedAll ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-primary" />}
            <span>{copiedAll ? 'Entire DDL Copied!' : 'Copy All DDL (48 Stmts)'}</span>
          </button>

          <button
            onClick={handleDownloadSQL}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download .sql Script</span>
          </button>
        </div>
      </div>

      {/* Execution Sequence Stepper Pills */}
      <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/20 shadow-xs">
        <div className="pb-2 mb-3 border-b border-outline-variant/20 text-xs font-bold text-outline uppercase tracking-wider">
          <span>Execution Hierarchy & Migration Order</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center text-xs">
          {[
            { step: '1', name: 'Extensions', icon: '⚡' },
            { step: '2', name: '13 Enums', icon: '🏷️' },
            { step: '3', name: '16 Tables', icon: '🏛️' },
            { step: '4', name: 'Indexes', icon: '⚡' },
            { step: '5', name: '28 FKs', icon: '🔗' },
            { step: '6', name: 'Seed Data', icon: '🌱' },
          ].map((item, idx) => (
            <div
              key={item.step}
              className="p-2.5 rounded-xl bg-surface-container-low/70 border border-outline-variant/20 flex items-center justify-center gap-2"
            >
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-black text-[10px] flex items-center justify-center">
                {item.step}
              </span>
              <span className="font-bold text-on-surface text-[11px]">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search SQL, table name, enum..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-full text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-2xs"
          />
        </div>
      </div>

      {/* Main Content Split: Left Navigation Rail & Right Code Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Segregated Sections Navigation Rail */}
        <div className="lg:col-span-4 space-y-2 max-h-[820px] overflow-y-auto pr-1">
          {filteredSections.map((sec) => {
            const isSelected = selectedSectionId === sec.id;
            return (
              <div
                key={sec.id}
                onClick={() => setSelectedSectionId(sec.id)}
                className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-surface-container-lowest border-primary shadow-sm ring-2 ring-primary/20'
                    : 'bg-surface-container-lowest hover:bg-surface-container-low border-outline-variant/20'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${sec.badgeColor}`}>
                        {sec.badge}
                      </span>
                      {sec.itemCount > 0 && (
                        <span className="text-[10px] font-mono text-outline font-bold">
                          {sec.itemCount} items
                        </span>
                      )}
                    </div>
                    <h3 className={`text-xs font-bold line-clamp-1 ${isSelected ? 'text-primary' : 'text-on-surface'}`}>
                      {sec.title}
                    </h3>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 mt-1 transition-transform ${isSelected ? 'text-primary rotate-90' : 'text-outline'}`} />
                </div>
                <p className="text-[11px] text-on-surface-variant line-clamp-2 mt-1.5 leading-relaxed">
                  {sec.description}
                </p>

                {sec.tablesAffected && sec.tablesAffected.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-outline-variant/10">
                    {sec.tablesAffected.map((tbl) => (
                      <span
                        key={tbl}
                        className="px-1.5 py-0.5 rounded bg-surface-container text-[10px] font-mono text-on-surface font-semibold"
                      >
                        {tbl}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Side: Selected SQL Code Box with Syntax Styling */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col">
            {/* Header of the Code Box */}
            <div className="p-4 sm:p-5 bg-surface-container-low border-b border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${selectedSection.badgeColor}`}>
                    {selectedSection.badge}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-on-surface mt-1">
                  {selectedSection.title}
                </h3>
                {selectedSection.description && (
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {selectedSection.description}
                  </p>
                )}
              </div>

              {/* Copy Section Button */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopySection}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 hover:bg-surface-container text-xs font-bold text-on-surface transition-all shadow-2xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-primary" />}
                  <span>{copied ? 'Copied!' : 'Copy Section'}</span>
                </button>
              </div>
            </div>

            {/* Code Body */}
            <div className="relative bg-[#0d1117] p-4 sm:p-6 overflow-x-auto max-h-[680px] overflow-y-auto">
              <pre className="text-[12px] sm:text-[13px] font-mono leading-relaxed text-slate-100 selection:bg-primary/30">
                <code>{selectedSection.sql}</code>
              </pre>
            </div>

            {/* Footer Summary */}
            <div className="p-3.5 bg-surface-container-low border-t border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="text-on-surface-variant font-medium">
                Tip: You can execute any query in this script directly via <strong className="text-primary font-bold">Tab 3 (Custom SQL Studio)</strong>.
              </span>
              <span className="text-emerald-700 font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-4 h-4" /> Idempotent & Cascade Safe
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
