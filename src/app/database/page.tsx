'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Database,
  Table,
  Layers,
  Key,
  Link2,
  Code2,
  Search,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Terminal,
  Play,
  Share2,
  FileCode,
  ShieldCheck,
  CheckCircle2,
  ArrowDownUp,
  Cpu,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import DatabaseERDiagram from '@/components/database-er-diagram';
import CustomSQLWorkbench from '@/components/custom-sql-workbench';
import DatabaseDDLViewer from '@/components/database-ddl-viewer';

// ==========================================
// MODELS DATA DEFINITION
// ==========================================
interface ModelField {
  name: string;
  type: string;
  isId?: boolean;
  isUnique?: boolean;
  isNullable?: boolean;
  defaultValue?: string;
  relationTarget?: string;
  cardinality?: '1:1' | '1:N' | 'N:1' | 'N:M';
  onDelete?: string;
  description: string;
}

interface DBModel {
  name: string;
  tableName: string;
  domain: 'Core Marketplace' | 'Barter & Swaps' | 'Chat & Messaging' | 'Trust & Community';
  description: string;
  color: string;
  badgeBg: string;
  fields: ModelField[];
}

const DB_MODELS: DBModel[] = [
  {
    name: 'User',
    tableName: 'users',
    domain: 'Core Marketplace',
    color: '#4648d4',
    badgeBg: 'bg-primary-fixed text-primary',
    description: 'Central trader account profile, trust metrics, contact city, and trade counts.',
    fields: [
      { name: 'id', type: 'String (cuid)', isId: true, description: 'Primary key identity token' },
      { name: 'name', type: 'String', description: 'Full public persona name' },
      { name: 'email', type: 'String', isUnique: true, description: 'Unique login credential' },
      { name: 'password', type: 'String (hash)', description: 'Bcrypt encrypted password hash' },
      { name: 'avatar', type: 'String', isNullable: true, description: 'Profile headshot photo URL' },
      { name: 'bio', type: 'String', isNullable: true, description: 'Trader introduction biography' },
      { name: 'phone', type: 'String', isNullable: true, description: 'Optional SMS contact' },
      { name: 'city', type: 'String', defaultValue: "'New York'", description: 'Active marketplace city location' },
      { name: 'state', type: 'String', defaultValue: "'NY'", description: 'State jurisdiction code' },
      { name: 'role', type: 'Role (Enum)', defaultValue: 'USER', description: 'Access level: USER, MODERATOR, ADMIN' },
      { name: 'isVerified', type: 'Boolean', defaultValue: 'false', description: 'Campus ID / Phone verified badge' },
      { name: 'reputationScore', type: 'Float', defaultValue: '5.0', description: 'Dual-sided rating aggregate (1.0 - 5.0)' },
      { name: 'totalReviews', type: 'Int', defaultValue: '0', description: 'Count of completed trade reviews' },
      { name: 'totalTrades', type: 'Int', defaultValue: '0', description: 'Verified physical handshakes executed' },
      { name: 'totalSales', type: 'Int', defaultValue: '0', description: 'Completed direct cash buyouts' },
      { name: 'responseRate', type: 'Int', defaultValue: '100', description: 'Chat response percentage (%)' },
      { name: 'createdAt', type: 'DateTime', defaultValue: 'now()', description: 'Account registration timestamp' },
      { name: 'listings', type: 'Listing[]', relationTarget: 'Listing', cardinality: '1:N', description: 'All items posted by this trader' },
      { name: 'sentBarters', type: 'BarterProposal[]', relationTarget: 'BarterProposal', cardinality: '1:N', description: 'Outbound barter offers' },
      { name: 'receivedBarters', type: 'BarterProposal[]', relationTarget: 'BarterProposal', cardinality: '1:N', description: 'Inbound swap proposals' },
    ],
  },
  {
    name: 'Listing',
    tableName: 'listings',
    domain: 'Core Marketplace',
    color: '#712ae2',
    badgeBg: 'bg-secondary-fixed text-secondary',
    description: 'Classified goods or academic textbooks listed for barter, sale, or hybrid top-up.',
    fields: [
      { name: 'id', type: 'String (cuid)', isId: true, description: 'Primary key listing identifier' },
      { name: 'userId', type: 'String (FK)', relationTarget: 'User', cardinality: 'N:1', onDelete: 'Cascade', description: 'Owner account foreign key' },
      { name: 'title', type: 'String', description: 'Listing headline' },
      { name: 'description', type: 'Text', description: 'Detailed item provenance & condition text' },
      { name: 'listingType', type: 'ListingType (Enum)', description: 'BOOK | PRODUCT' },
      { name: 'exchangeType', type: 'ExchangeType (Enum)', description: 'CASH_ONLY | BARTER_ONLY | HYBRID' },
      { name: 'price', type: 'Float', isNullable: true, description: 'Valuation benchmark or cash buyout price' },
      { name: 'condition', type: 'ItemCondition (Enum)', description: 'BRAND_NEW | LIKE_NEW | VERY_GOOD | GOOD | ACCEPTABLE' },
      { name: 'status', type: 'ListingStatus (Enum)', defaultValue: 'ACTIVE', description: 'ACTIVE | RESERVED | PENDING_EXCHANGE | TRADED' },
      { name: 'images', type: 'String[]', description: 'Array of high-res packshot URLs' },
      { name: 'barterWishlist', type: 'Text', isNullable: true, description: 'Target swap keywords (e.g. "Kindle, Keychron")' },
      { name: 'viewsCount', type: 'Int', defaultValue: '0', description: 'Total impression views' },
      { name: 'pickupAvailable', type: 'Boolean', defaultValue: 'true', description: 'Local campus meetup enabled' },
      { name: 'isFeatured', type: 'Boolean', defaultValue: 'false', description: 'Promoted to marketplace hero feed' },
      { name: 'bookDetails', type: 'BookDetails?', relationTarget: 'BookDetails', cardinality: '1:1', description: 'Academic & ISBN metadata' },
      { name: 'productDetails', type: 'ProductDetails?', relationTarget: 'ProductDetails', cardinality: '1:1', description: 'Tech gear & hardware specs' },
    ],
  },
  {
    name: 'BookDetails',
    tableName: 'book_details',
    domain: 'Core Marketplace',
    color: '#0d9488',
    badgeBg: 'bg-teal-100 text-teal-800',
    description: 'Academic course codes, ISBN references, and literature annotations.',
    fields: [
      { name: 'id', type: 'String (cuid)', isId: true, description: 'Primary key token' },
      { name: 'listingId', type: 'String (FK)', isUnique: true, relationTarget: 'Listing', cardinality: '1:1', onDelete: 'Cascade', description: 'Parent listing relation' },
      { name: 'isbn', type: 'String', isNullable: true, description: '10-digit standard book number' },
      { name: 'isbn13', type: 'String', isNullable: true, description: '13-digit barcode ISBN' },
      { name: 'author', type: 'String', description: 'Author or editorial contributors' },
      { name: 'publisher', type: 'String', isNullable: true, description: 'Publishing press or university' },
      { name: 'edition', type: 'String', isNullable: true, description: 'Edition descriptor (e.g. 9th Edition)' },
      { name: 'genre', type: 'String', description: 'Subject classification category' },
      { name: 'format', type: 'BookFormat (Enum)', defaultValue: 'PAPERBACK', description: 'HARDCOVER | PAPERBACK | MASS_MARKET | SPIRAL' },
      { name: 'academicSubject', type: 'String', isNullable: true, description: 'Department (Computer Science, Biology, etc.)' },
      { name: 'courseCode', type: 'String', isNullable: true, description: 'University course identifier (CS 61A, MATH 53)' },
      { name: 'hasAnnotations', type: 'Boolean', defaultValue: 'false', description: 'Margin notes or highlighter markings flag' },
    ],
  },
  {
    name: 'ProductDetails',
    tableName: 'product_details',
    domain: 'Core Marketplace',
    color: '#0284c7',
    badgeBg: 'bg-sky-100 text-sky-800',
    description: 'Hardware brand, model numbers, box status, and accessory completeness.',
    fields: [
      { name: 'id', type: 'String (cuid)', isId: true, description: 'Primary key token' },
      { name: 'listingId', type: 'String (FK)', isUnique: true, relationTarget: 'Listing', cardinality: '1:1', onDelete: 'Cascade', description: 'Parent listing relation' },
      { name: 'category', type: 'String', description: 'Broad category (Electronics, Audio, Keyboards)' },
      { name: 'brand', type: 'String', isNullable: true, description: 'OEM manufacturer (Sony, Apple, Keychron)' },
      { name: 'model', type: 'String', isNullable: true, description: 'Specific model designation (WH-1000XM4)' },
      { name: 'includesOriginalBox', type: 'Boolean', defaultValue: 'false', description: 'OEM packaging present' },
      { name: 'includesAccessories', type: 'Boolean', defaultValue: 'false', description: 'Charger, cords, and adaptors bundled' },
      { name: 'warrantyStatus', type: 'String', isNullable: true, description: 'AppleCare, manufacturer warranty descriptor' },
    ],
  },
  {
    name: 'BarterProposal',
    tableName: 'barter_proposals',
    domain: 'Barter & Swaps',
    color: '#825100',
    badgeBg: 'bg-amber-100 text-amber-900',
    description: 'Item-for-item trade proposal with optional cash top-up and 6-digit handshake PIN token.',
    fields: [
      { name: 'id', type: 'String (cuid)', isId: true, description: 'Proposal transaction ID' },
      { name: 'initiatorId', type: 'String (FK)', relationTarget: 'User', cardinality: 'N:1', onDelete: 'Cascade', description: 'Proposing trader user' },
      { name: 'recipientId', type: 'String (FK)', relationTarget: 'User', cardinality: 'N:1', onDelete: 'Cascade', description: 'Target listing owner user' },
      { name: 'targetListingId', type: 'String (FK)', relationTarget: 'Listing', cardinality: 'N:1', onDelete: 'Cascade', description: 'Target object being requested' },
      { name: 'cashTopUp', type: 'Float', defaultValue: '0.0', description: 'Cash balance offset offered ($)' },
      { name: 'status', type: 'BarterStatus (Enum)', defaultValue: 'PROPOSED', description: 'PROPOSED | COUNTERED | ACCEPTED | REJECTED | COMPLETED' },
      { name: 'exchangeCode', type: 'String', isNullable: true, description: 'Synchronized 6-digit handshake token (TRD-XXXXXX)' },
      { name: 'notes', type: 'Text', isNullable: true, description: 'Trader note describing condition & terms' },
      { name: 'offeredItems', type: 'BarterItem[]', relationTarget: 'BarterItem', cardinality: '1:N', description: 'Offered item bundle mapping' },
      { name: 'createdAt', type: 'DateTime', defaultValue: 'now()', description: 'Proposal creation timestamp' },
    ],
  },
  {
    name: 'BarterItem',
    tableName: 'barter_items',
    domain: 'Barter & Swaps',
    color: '#d97706',
    badgeBg: 'bg-yellow-100 text-yellow-900',
    description: 'Join entity linking multiple offered inventory items into a single barter proposal.',
    fields: [
      { name: 'id', type: 'String (cuid)', isId: true, description: 'Item association ID' },
      { name: 'proposalId', type: 'String (FK)', relationTarget: 'BarterProposal', cardinality: 'N:1', onDelete: 'Cascade', description: 'Parent barter deal' },
      { name: 'listingId', type: 'String (FK)', relationTarget: 'Listing', cardinality: 'N:1', onDelete: 'Cascade', description: 'Item from initiator inventory' },
    ],
  },
  {
    name: 'CashOffer',
    tableName: 'cash_offers',
    domain: 'Barter & Swaps',
    color: '#16a34a',
    badgeBg: 'bg-emerald-100 text-emerald-900',
    description: 'Cash-only purchase offer or price negotiation with counter-offer support.',
    fields: [
      { name: 'id', type: 'String (cuid)', isId: true, description: 'Offer ID token' },
      { name: 'listingId', type: 'String (FK)', relationTarget: 'Listing', cardinality: 'N:1', onDelete: 'Cascade', description: 'Target listing' },
      { name: 'buyerId', type: 'String (FK)', relationTarget: 'User', cardinality: 'N:1', onDelete: 'Cascade', description: 'Bidding buyer' },
      { name: 'sellerId', type: 'String (FK)', relationTarget: 'User', cardinality: 'N:1', onDelete: 'Cascade', description: 'Item seller' },
      { name: 'offerAmount', type: 'Float', description: 'Offered cash sum ($)' },
      { name: 'counterAmount', type: 'Float', isNullable: true, description: 'Seller counter-offer valuation ($)' },
      { name: 'status', type: 'OfferStatus (Enum)', defaultValue: 'PENDING', description: 'PENDING | COUNTERED | ACCEPTED | DECLINED | COMPLETED' },
      { name: 'expiresAt', type: 'DateTime', isNullable: true, description: 'Offer expiration limit' },
    ],
  },
  {
    name: 'Conversation',
    tableName: 'conversations',
    domain: 'Chat & Messaging',
    color: '#6366f1',
    badgeBg: 'bg-indigo-100 text-indigo-900',
    description: 'Synchronous message thread between two traders anchored to an active listing.',
    fields: [
      { name: 'id', type: 'String (cuid)', isId: true, description: 'Conversation thread ID' },
      { name: 'participantAId', type: 'String (FK)', relationTarget: 'User', cardinality: 'N:1', onDelete: 'Cascade', description: 'First participant' },
      { name: 'participantBId', type: 'String (FK)', relationTarget: 'User', cardinality: 'N:1', onDelete: 'Cascade', description: 'Second participant' },
      { name: 'listingId', type: 'String (FK)', isNullable: true, relationTarget: 'Listing', cardinality: 'N:1', onDelete: 'SetNull', description: 'Anchored item context' },
      { name: 'lastMessageAt', type: 'DateTime', defaultValue: 'now()', description: 'Activity timestamp for sorting' },
      { name: 'messages', type: 'Message[]', relationTarget: 'Message', cardinality: '1:N', description: 'Ordered chat messages' },
    ],
  },
  {
    name: 'Message',
    tableName: 'messages',
    domain: 'Chat & Messaging',
    color: '#9333ea',
    badgeBg: 'bg-purple-100 text-purple-900',
    description: 'In-thread chat unit: plain text, interactive cash offer cards, or barter agreement cards.',
    fields: [
      { name: 'id', type: 'String (cuid)', isId: true, description: 'Message token ID' },
      { name: 'conversationId', type: 'String (FK)', relationTarget: 'Conversation', cardinality: 'N:1', onDelete: 'Cascade', description: 'Thread foreign key' },
      { name: 'senderId', type: 'String (FK)', relationTarget: 'User', cardinality: 'N:1', onDelete: 'Cascade', description: 'Author of message' },
      { name: 'receiverId', type: 'String (FK)', relationTarget: 'User', cardinality: 'N:1', onDelete: 'Cascade', description: 'Recipient user' },
      { name: 'content', type: 'Text', description: 'Text message or deal summary' },
      { name: 'messageType', type: 'MessageType (Enum)', defaultValue: 'TEXT', description: 'TEXT | CASH_OFFER_CARD | BARTER_PROPOSAL_CARD | SYSTEM_ALERT' },
      { name: 'metadata', type: 'Text (JSON)', isNullable: true, description: 'Serialized structured offer payload (amounts, item ids)' },
      { name: 'isRead', type: 'Boolean', defaultValue: 'false', description: 'Read receipt state' },
    ],
  },
  {
    name: 'Review',
    tableName: 'reviews',
    domain: 'Trust & Community',
    color: '#e11d48',
    badgeBg: 'bg-rose-100 text-rose-900',
    description: 'Dual-sided verified rating unlocked only following a successful 6-digit handshake.',
    fields: [
      { name: 'id', type: 'String (cuid)', isId: true, description: 'Review ID' },
      { name: 'reviewerId', type: 'String (FK)', relationTarget: 'User', cardinality: 'N:1', onDelete: 'Cascade', description: 'Review author' },
      { name: 'targetUserId', type: 'String (FK)', relationTarget: 'User', cardinality: 'N:1', onDelete: 'Cascade', description: 'User being evaluated' },
      { name: 'overallRating', type: 'Int', description: 'Primary 1-5 star score' },
      { name: 'conditionRating', type: 'Int', description: 'Item condition accuracy (1-5)' },
      { name: 'communicationRating', type: 'Int', description: 'Responsiveness rating (1-5)' },
      { name: 'punctualityRating', type: 'Int', description: 'Meetup timing rating (1-5)' },
      { name: 'isVerified', type: 'Boolean', defaultValue: 'true', description: 'Mutual handshake verification confirmation' },
    ],
  },
  {
    name: 'SavedListing',
    tableName: 'saved_listings',
    domain: 'Trust & Community',
    color: '#ec4899',
    badgeBg: 'bg-pink-100 text-pink-900',
    description: 'User bookmarks enabling instant barter proposals and price-drop notifications.',
    fields: [
      { name: 'id', type: 'String (cuid)', isId: true, description: 'Saved token' },
      { name: 'userId', type: 'String (FK)', relationTarget: 'User', cardinality: 'N:1', onDelete: 'Cascade', description: 'Saving user' },
      { name: 'listingId', type: 'String (FK)', relationTarget: 'Listing', cardinality: 'N:1', onDelete: 'Cascade', description: 'Bookmarked item' },
      { name: '@@unique', type: '[userId, listingId]', description: 'Compound unique constraint preventing duplicate saves' },
    ],
  },
  {
    name: 'PriceHistory',
    tableName: 'price_history',
    domain: 'Core Marketplace',
    color: '#64748b',
    badgeBg: 'bg-slate-100 text-slate-800',
    description: 'Historical valuation timeline tracking price reductions and trade equity adjustments.',
    fields: [
      { name: 'id', type: 'String (cuid)', isId: true, description: 'Record ID' },
      { name: 'listingId', type: 'String (FK)', relationTarget: 'Listing', cardinality: 'N:1', onDelete: 'Cascade', description: 'Associated listing' },
      { name: 'price', type: 'Float', description: 'Recorded price point at timestamp' },
      { name: 'createdAt', type: 'DateTime', defaultValue: 'now()', description: 'Price change timestamp' },
    ],
  },
  {
    name: 'Notification',
    tableName: 'notifications',
    domain: 'Trust & Community',
    color: '#f59e0b',
    badgeBg: 'bg-amber-100 text-amber-800',
    description: 'System and barter event alerts for new offers, accepted handshakes, and messages.',
    fields: [
      { name: 'id', type: 'String (cuid)', isId: true, description: 'Notification ID' },
      { name: 'userId', type: 'String (FK)', relationTarget: 'User', cardinality: 'N:1', onDelete: 'Cascade', description: 'Alert recipient' },
      { name: 'type', type: 'NotificationType (Enum)', description: 'OFFER | BARTER | MESSAGE | PRICE_DROP | SYSTEM' },
      { name: 'title', type: 'String', description: 'Notification title' },
      { name: 'body', type: 'String', description: 'Alert description' },
      { name: 'isRead', type: 'Boolean', defaultValue: 'false', description: 'Unread state flag' },
    ],
  },
  {
    name: 'Report',
    tableName: 'reports',
    domain: 'Trust & Community',
    color: '#dc2626',
    badgeBg: 'bg-red-100 text-red-900',
    description: 'Safety moderation reports for listing fraud, misgraded condition, or missed meetups.',
    fields: [
      { name: 'id', type: 'String (cuid)', isId: true, description: 'Report ID' },
      { name: 'reporterId', type: 'String (FK)', relationTarget: 'User', cardinality: 'N:1', onDelete: 'Cascade', description: 'Reporting trader' },
      { name: 'reportedUserId', type: 'String (FK)', relationTarget: 'User', cardinality: 'N:1', onDelete: 'Cascade', description: 'User reported' },
      { name: 'status', type: 'ReportStatus (Enum)', defaultValue: 'OPEN', description: 'OPEN | RESOLVED | DISMISSED' },
    ],
  },
  {
    name: 'SavedSearch',
    tableName: 'saved_searches',
    domain: 'Core Marketplace',
    color: '#0891b2',
    badgeBg: 'bg-cyan-100 text-cyan-800',
    description: 'Persisted search queries alerting users when matching textbooks or electronics appear.',
    fields: [
      { name: 'id', type: 'String (cuid)', isId: true, description: 'Saved search token' },
      { name: 'userId', type: 'String (FK)', relationTarget: 'User', cardinality: 'N:1', onDelete: 'Cascade', description: 'Subscribed user' },
      { name: 'label', type: 'String', description: 'Display name (e.g. "Linear Algebra 5th Ed")' },
      { name: 'query', type: 'String', description: 'Search term keywords' },
    ],
  },
  {
    name: 'Follow',
    tableName: 'follows',
    domain: 'Trust & Community',
    color: '#4f46e5',
    badgeBg: 'bg-indigo-100 text-indigo-800',
    description: 'Social graph connecting students and collectors to preferred peer traders.',
    fields: [
      { name: 'id', type: 'String (cuid)', isId: true, description: 'Follow ID' },
      { name: 'followerId', type: 'String (FK)', relationTarget: 'User', cardinality: 'N:1', onDelete: 'Cascade', description: 'Following trader' },
      { name: 'followingId', type: 'String (FK)', relationTarget: 'User', cardinality: 'N:1', onDelete: 'Cascade', description: 'Trader being followed' },
    ],
  },
];

// ==========================================
// ENUMS DATA DEFINITION
// ==========================================
interface EnumDef {
  name: string;
  description: string;
  values: string[];
}

const DB_ENUMS: EnumDef[] = [
  { name: 'Role', description: 'User security access levels', values: ['USER', 'MODERATOR', 'ADMIN'] },
  { name: 'ListingType', description: 'Broad catalog entity partition', values: ['BOOK', 'PRODUCT'] },
  { name: 'ExchangeType', description: 'Supported peer exchange models', values: ['CASH_ONLY', 'BARTER_ONLY', 'HYBRID'] },
  { name: 'ItemCondition', description: 'Stitch condition grading standards', values: ['BRAND_NEW', 'LIKE_NEW', 'VERY_GOOD', 'GOOD', 'ACCEPTABLE'] },
  { name: 'ListingStatus', description: 'Lifecycle state of classified ad', values: ['ACTIVE', 'RESERVED', 'PENDING_EXCHANGE', 'SOLD', 'TRADED', 'ARCHIVED'] },
  { name: 'BookFormat', description: 'Binding formats for publications', values: ['HARDCOVER', 'PAPERBACK', 'MASS_MARKET', 'SPIRAL', 'OTHER'] },
  { name: 'OfferStatus', description: 'Cash proposal negotiation lifecycle', values: ['PENDING', 'COUNTERED', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'CANCELLED', 'COMPLETED'] },
  { name: 'BarterStatus', description: 'Item-for-item swap agreement stages', values: ['PROPOSED', 'COUNTERED', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED'] },
  { name: 'MessageType', description: 'Rich message payload schemas', values: ['TEXT', 'CASH_OFFER_CARD', 'BARTER_PROPOSAL_CARD', 'SYSTEM_ALERT'] },
  { name: 'TransactionType', description: 'Completed exchange classification', values: ['CASH_SALE', 'BARTER_EXCHANGE'] },
  { name: 'ReportStatus', description: 'Moderator issue resolution', values: ['OPEN', 'RESOLVED', 'DISMISSED'] },
  { name: 'PromotionType', description: 'Paid or boosted visibility tiers', values: ['FEATURED', 'URGENT', 'TOP'] },
  { name: 'NotificationType', description: 'In-app event categories', values: ['OFFER', 'BARTER', 'MESSAGE', 'PRICE_DROP', 'SYSTEM'] },
];

// ==========================================
// SQL QUERIES PLAYGROUND DATA
// ==========================================
interface SQLQueryItem {
  id: string;
  title: string;
  category: 'Circular Matching' | 'Handshake & Verification' | 'Analytics & Metrics' | 'Audit & Negotiation';
  description: string;
  tables: string[];
  sql: string;
  sampleColumns: string[];
  sampleRows: (string | number)[][];
}

const SQL_QUERIES: SQLQueryItem[] = [
  {
    id: 'handshake-settlement',
    title: '6-Digit Handshake PIN Settlement & Code Verification',
    category: 'Handshake & Verification',
    description: 'Retrieves locked barter agreements with matched 6-digit handshake tokens and participant trust scores awaiting physical delivery confirmation.',
    tables: ['barter_proposals', 'users', 'listings'],
    sql: `SELECT 
  bp.id AS proposal_id,
  bp."exchangeCode" AS handshake_pin,
  init.name AS initiator_name,
  init."reputationScore" AS initiator_reputation,
  rec.name AS recipient_name,
  rec."reputationScore" AS recipient_reputation,
  l.title AS target_listing,
  bp."cashTopUp" AS cash_balance_adjustment,
  bp.status AS agreement_status
FROM "BarterProposal" bp
JOIN "User" init ON bp."initiatorId" = init.id
JOIN "User" rec ON bp."recipientId" = rec.id
JOIN "Listing" l ON bp."targetListingId" = l.id
WHERE bp.status = 'ACCEPTED' AND bp."exchangeCode" IS NOT NULL
ORDER BY bp."createdAt" DESC;`,
    sampleColumns: ['proposal_id', 'handshake_pin', 'initiator_name', 'target_listing', 'cash_balance', 'status'],
    sampleRows: [
      ['prop_ck921', 'TRD-849215', 'Elena Rostova (4.9★)', 'Sony WH-1000XM4 (Mint)', '+$40.00', 'ACCEPTED'],
      ['prop_ck882', 'TRD-314092', 'Alex Turner (5.0★)', 'CLRS Algorithms 4th Ed.', '+$0.00', 'ACCEPTED'],
      ['prop_ck740', 'TRD-628104', 'David Miller (4.9★)', 'Fujifilm X-T30 Mirrorless', '+$60.00', 'ACCEPTED'],
    ],
  },
  {
    id: 'multi-item-traversal',
    title: 'Multi-Item Barter Graph Traversal (Bundled Swaps)',
    category: 'Circular Matching',
    description: 'Traverses the BarterItem join table to aggregate all bundled items offered in exchange for a single high-value target listing.',
    tables: ['barter_proposals', 'barter_items', 'listings'],
    sql: `SELECT 
  bp.id AS proposal_id,
  target_l.title AS requested_item,
  target_l.price AS target_valuation,
  bp."cashTopUp" AS cash_top_up,
  COUNT(bi.id) AS bundle_item_count,
  STRING_AGG(offered_l.title, ' + ') AS bundled_offer_titles,
  SUM(COALESCE(offered_l.price, 0)) + bp."cashTopUp" AS total_effective_valuation
FROM "BarterProposal" bp
JOIN "Listing" target_l ON bp."targetListingId" = target_l.id
JOIN "BarterItem" bi ON bi."proposalId" = bp.id
JOIN "Listing" offered_l ON bi."listingId" = offered_l.id
GROUP BY bp.id, target_l.title, target_l.price, bp."cashTopUp"
HAVING SUM(COALESCE(offered_l.price, 0)) + bp."cashTopUp" >= target_l.price * 0.85
ORDER BY total_effective_valuation DESC;`,
    sampleColumns: ['proposal_id', 'requested_item', 'target_val', 'bundled_offer', 'total_effective_val'],
    sampleRows: [
      ['prop_902', 'Sony WH-1000XM4 Headset', '$195.00', 'Kindle Paperwhite ($135) + Akko Mech Keyboard ($40) + $20 Cash', '$195.00'],
      ['prop_884', 'Nintendo Switch OLED Bundle', '$295.00', 'Steam Deck 64GB ($260) + Zelda TotK Game ($35)', '$295.00'],
      ['prop_721', 'iPad Air M1 64GB WiFi', '$335.00', 'Fujifilm X-T30 Body ($340)', '$340.00'],
    ],
  },
  {
    id: 'circular-mutual-match',
    title: 'Circular Double-Coincidence Matchmaker Engine',
    category: 'Circular Matching',
    description: 'Finds mutual barter loops where User A has an item matching User B wishlist, AND User B has an item matching User A wishlist.',
    tables: ['listings', 'users', 'saved_listings'],
    sql: `SELECT 
  uA.name AS trader_A,
  lA.title AS item_A_offered,
  uB.name AS trader_B,
  lB.title AS item_B_offered,
  lA.city AS meetup_city,
  ABS(COALESCE(lA.price, 0) - COALESCE(lB.price, 0)) AS valuation_gap
FROM "Listing" lA
JOIN "User" uA ON lA."userId" = uA.id
JOIN "Listing" lB ON lB."userId" != uA.id
JOIN "User" uB ON lB."userId" = uB.id
WHERE lA.status = 'ACTIVE' 
  AND lB.status = 'ACTIVE'
  AND lA.city = lB.city
  AND (lA."barterWishlist" ILIKE '%' || lB.title || '%' OR lB.description ILIKE '%' || lA.title || '%')
  AND (lB."barterWishlist" ILIKE '%' || lA.title || '%' OR lA.description ILIKE '%' || lB.title || '%')
ORDER BY valuation_gap ASC;`,
    sampleColumns: ['trader_A', 'item_A', 'trader_B', 'item_B', 'meetup_city', 'val_gap'],
    sampleRows: [
      ['Marcus Chen', 'Keychron Q1 Wireless', 'Alex Turner', 'Clean Code + CS 61A Book Trio', 'San Francisco', '$5.00'],
      ['Sarah Jenkins', 'Calculus 9th Ed (Stewart)', 'Elena Rostova', 'Organic Chemistry Wade 8th', 'Boston', '$0.00'],
      ['David Miller', 'AudioQuest DAC + Preamp', 'Marcus Chen', 'Apple Magic Trackpad 2', 'Seattle', '$10.00'],
    ],
  },
  {
    id: 'reputation-leaderboard',
    title: 'Top Verified Campus Traders & Trust Leaderboard',
    category: 'Analytics & Metrics',
    description: 'Computes trader rankings across completed physical handshakes, punctuality metrics, condition accuracy, and zero-dispute records.',
    tables: ['users', 'reviews', 'barter_proposals'],
    sql: `SELECT 
  u.id,
  u.name,
  u.city,
  u."reputationScore",
  u."totalTrades",
  COUNT(r.id) AS verified_reviews_count,
  ROUND(AVG(r."punctualityRating"), 2) AS avg_punctuality,
  ROUND(AVG(r."conditionRating"), 2) AS avg_condition_accuracy,
  u."responseRate" || '%' AS response_rate
FROM "User" u
LEFT JOIN "Review" r ON u.id = r."targetUserId" AND r."isVerified" = true
WHERE u."totalTrades" >= 5
GROUP BY u.id, u.name, u.city, u."reputationScore", u."totalTrades", u."responseRate"
ORDER BY u."reputationScore" DESC, u."totalTrades" DESC
LIMIT 10;`,
    sampleColumns: ['trader_name', 'city', 'reputation', 'completed_trades', 'punctuality', 'condition_acc'],
    sampleRows: [
      ['Elena Rostova', 'Austin, TX', '4.98 ★', 35, '5.00 / 5.0', '4.95 / 5.0'],
      ['Alex Turner', 'New York, NY', '4.95 ★', 19, '4.90 / 5.0', '4.90 / 5.0'],
      ['Sarah Jenkins', 'Boston, MA', '4.92 ★', 18, '5.00 / 5.0', '4.92 / 5.0'],
      ['Marcus Chen', 'San Francisco, CA', '4.90 ★', 14, '4.85 / 5.0', '4.95 / 5.0'],
    ],
  },
  {
    id: 'negotiation-threads-cards',
    title: 'In-Thread Negotiation Offer Cards & Conversation Audit',
    category: 'Audit & Negotiation',
    description: 'Audits real-time messages containing structured cash offer cards and barter proposal cards with embedded metadata payloads.',
    tables: ['conversations', 'messages', 'users'],
    sql: `SELECT 
  c.id AS conversation_id,
  m.id AS message_id,
  m."createdAt",
  sender.name AS sender_name,
  m."messageType",
  m.content AS message_text,
  m.metadata AS card_json_payload,
  m."isRead"
FROM "Message" m
JOIN "Conversation" c ON m."conversationId" = c.id
JOIN "User" sender ON m."senderId" = sender.id
WHERE m."messageType" IN ('CASH_OFFER_CARD', 'BARTER_PROPOSAL_CARD')
ORDER BY m."createdAt" DESC
LIMIT 15;`,
    sampleColumns: ['conv_id', 'sender', 'card_type', 'message_text', 'metadata_summary'],
    sampleRows: [
      ['conv_482', 'Marcus Chen', 'BARTER_PROPOSAL_CARD', 'Counter-offer: Kindle + $40 Cash', '{"cash":40,"items":["l_kindle"]}'],
      ['conv_319', 'Alex Turner', 'CASH_OFFER_CARD', 'Direct Cash Offer: $85.00', '{"amount":85,"currency":"USD"}'],
      ['conv_110', 'Elena Rostova', 'BARTER_PROPOSAL_CARD', 'Item Swap: Organic Chem Wade for Stewart Calc', '{"items":["l_wade"]}'],
    ],
  },
  {
    id: 'faceted-valuation-distribution',
    title: 'Faceted Valuation Histogram & Category Distribution',
    category: 'Analytics & Metrics',
    description: 'Aggregates item count and average valuations across conditions and exchange modes to power the marketplace histogram slider.',
    tables: ['listings', 'book_details', 'product_details'],
    sql: `SELECT 
  l."listingType",
  l."exchangeType",
  l.condition,
  COUNT(l.id) AS item_count,
  ROUND(AVG(COALESCE(l.price, 0))::numeric, 2) AS avg_valuation,
  MIN(l.price) AS min_valuation,
  MAX(l.price) AS max_valuation,
  SUM(l."viewsCount") AS aggregate_views
FROM "Listing" l
WHERE l.status = 'ACTIVE'
GROUP BY l."listingType", l."exchangeType", l.condition
ORDER BY l."listingType", avg_valuation DESC;`,
    sampleColumns: ['listing_type', 'exchange_type', 'condition', 'count', 'avg_val', 'views'],
    sampleRows: [
      ['PRODUCT', 'BARTER_ONLY', 'LIKE_NEW', 18, '$245.50', '2,420 views'],
      ['PRODUCT', 'HYBRID', 'BRAND_NEW', 9, '$320.00', '1,890 views'],
      ['BOOK', 'BARTER_ONLY', 'VERY_GOOD', 24, '$84.00', '1,310 views'],
      ['BOOK', 'CASH_ONLY', 'GOOD', 15, '$45.00', '820 views'],
    ],
  },
];

export default function DatabasePage() {
  const [activeTab, setActiveTab] = useState<'models' | 'er' | 'sql' | 'enums' | 'ddl'>('sql');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedModel, setSelectedModel] = useState<DBModel | null>(DB_MODELS[0]);

  // Filtered models list
  const filteredModels = useMemo(() => {
    return DB_MODELS.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.tableName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.fields.some((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesDomain = selectedDomain === 'All' || m.domain === selectedDomain;
      return matchesSearch && matchesDomain;
    });
  }, [searchQuery, selectedDomain]);

  const domains = ['All', 'Core Marketplace', 'Barter & Swaps', 'Chat & Messaging', 'Trust & Community'];

  return (
    <div className="min-h-screen bg-surface py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ========================================================= */}
        {/* HERO BANNER */}
        {/* ========================================================= */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-fixed/40 via-surface-container-lowest to-surface-container-low p-8 sm:p-10 border border-outline-variant/30 shadow-sm">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary text-white text-xs font-bold tracking-wide uppercase shadow-sm">
                <Database className="w-3.5 h-3.5" />
                <span>PostgreSQL 16 & Prisma ORM</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-on-surface tracking-tight">
                Database Architecture & ER Schema
              </h1>
              <p className="text-on-surface-variant max-w-2xl text-sm sm:text-base leading-relaxed">
                Live interactive inspection of BarterHub&apos;s relational topology, entity-relationship models, foreign key cardinalities, and production-grade SQL queries for circular swaps and 6-digit handshake verification.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={() => setActiveTab('ddl')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    activeTab === 'ddl'
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-surface-container-lowest text-primary hover:bg-surface-container border border-primary/20'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>View Database Creation SQL (DDL)</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-primary/10 text-primary font-mono">48 stmts</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Bento */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/20 shadow-xs text-center">
                <p className="text-xs font-semibold text-outline uppercase tracking-wider">Models</p>
                <p className="text-2xl font-black text-primary mt-0.5">16</p>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/20 shadow-xs text-center">
                <p className="text-xs font-semibold text-outline uppercase tracking-wider">Enums</p>
                <p className="text-2xl font-black text-secondary mt-0.5">13</p>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/20 shadow-xs text-center">
                <p className="text-xs font-semibold text-outline uppercase tracking-wider">Relations</p>
                <p className="text-2xl font-black text-emerald-600 mt-0.5">28</p>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/20 shadow-xs text-center">
                <p className="text-xs font-semibold text-outline uppercase tracking-wider">Status</p>
                <div className="flex items-center justify-center gap-1.5 mt-1 text-xs font-bold text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Synced
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* VIEW NAVIGATION TABS */}
        {/* ========================================================= */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-outline-variant/30 pb-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'models', label: '1. Relational Schema & Fields', icon: Table },
              { id: 'er', label: '2. Interactive ER & Mermaid Schema', icon: Layers },
              { id: 'sql', label: '3. Custom SQL Studio & Workbench', icon: Terminal },
              { id: 'enums', label: '4. Enums & Custom Types (13)', icon: Code2 },
              { id: 'ddl', label: '5. SQL Creation DDL (All Commands)', icon: FileCode },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all shadow-xs ${
                    isActive
                      ? 'bg-primary text-white shadow-lift'
                      : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant border border-outline-variant/30'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/listings"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: RELATIONAL SCHEMA EXPLORER */}
        {/* ========================================================= */}
        {activeTab === 'models' && (
          <div className="space-y-6">
            {/* Search & Domain Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {domains.map((dom) => (
                  <button
                    key={dom}
                    onClick={() => setSelectedDomain(dom)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
                      selectedDomain === dom
                        ? 'bg-primary text-white'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container border border-outline-variant/20'
                    }`}
                  >
                    {dom}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter models or columns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-full text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Main Split View: Left Model List, Right Model Details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Model Rail */}
              <div className="lg:col-span-4 space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
                {filteredModels.map((model) => {
                  const isSelected = selectedModel?.name === model.name;
                  return (
                    <div
                      key={model.name}
                      onClick={() => setSelectedModel(model)}
                      className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                        isSelected
                          ? 'bg-surface-container-lowest border-primary shadow-sm ring-2 ring-primary/20'
                          : 'bg-surface-container-lowest hover:bg-surface-container-low border-outline-variant/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: model.color }}
                          />
                          <h3 className="font-extrabold text-sm text-on-surface">{model.name}</h3>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${model.badgeBg}`}>
                          {model.tableName}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-1.5 line-clamp-2 leading-relaxed">
                        {model.description}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-outline mt-2 pt-2 border-t border-outline-variant/10">
                        <span>{model.fields.length} attributes</span>
                        <span className="font-medium text-primary flex items-center gap-1">
                          Inspect <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Active Model Inspector */}
              <div className="lg:col-span-8 bg-surface-container-lowest rounded-3xl p-6 sm:p-8 border border-outline-variant/30 shadow-xs space-y-6">
                {selectedModel ? (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/20">
                      <div>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-md"
                            style={{ backgroundColor: selectedModel.color }}
                          />
                          <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">
                            {selectedModel.name}
                          </h2>
                          <span className="text-xs font-bold text-outline px-2.5 py-1 rounded-md bg-surface-container">
                            Table: <code className="text-primary font-mono">{selectedModel.tableName}</code>
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5">
                          {selectedModel.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const code = `model ${selectedModel.name} {\n${selectedModel.fields
                              .map((f) => `  ${f.name.padEnd(20)} ${f.type}`)
                              .join('\n')}\n}`;
                            handleCopyText(code);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-bold border border-outline-variant/30 transition-colors"
                        >
                          {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedCode ? 'Copied Prisma' : 'Copy Definition'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Fields Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-outline-variant/20 text-outline font-bold uppercase tracking-wider">
                            <th className="pb-3 pr-4">Attribute</th>
                            <th className="pb-3 pr-4">Data Type</th>
                            <th className="pb-3 pr-4">Constraints</th>
                            <th className="pb-3">Relationship / Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10 text-on-surface">
                          {selectedModel.fields.map((f) => (
                            <tr key={f.name} className="hover:bg-surface-container-low/50 transition-colors">
                              <td className="py-3 pr-4 font-mono font-bold text-on-surface flex items-center gap-1.5">
                                {f.isId && <Key className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                                {f.relationTarget && <Link2 className="w-3.5 h-3.5 text-primary shrink-0" />}
                                <span>{f.name}</span>
                              </td>
                              <td className="py-3 pr-4 font-mono text-primary font-medium">
                                {f.type}
                              </td>
                              <td className="py-3 pr-4 space-x-1">
                                {f.isId && (
                                  <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                                    PK
                                  </span>
                                )}
                                {f.isUnique && (
                                  <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">
                                    UNIQUE
                                  </span>
                                )}
                                {f.defaultValue && (
                                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">
                                    def: {f.defaultValue}
                                  </span>
                                )}
                                {f.onDelete && (
                                  <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px]">
                                    onDelete: {f.onDelete}
                                  </span>
                                )}
                              </td>
                              <td className="py-3 text-on-surface-variant">
                                {f.relationTarget ? (
                                  <div className="flex items-center gap-1.5 text-primary font-bold">
                                    <span>→ {f.relationTarget}</span>
                                    {f.cardinality && (
                                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-primary-fixed rounded">
                                        {f.cardinality}
                                      </span>
                                    )}
                                    <span className="text-outline font-normal text-xs ml-1">— {f.description}</span>
                                  </div>
                                ) : (
                                  f.description
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-20 text-outline">Select a model from the left rail to view its attributes.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: INTERACTIVE ER DIAGRAM */}
        {/* ========================================================= */}
        {activeTab === 'er' && (
          <div className="space-y-6">
            {/* Visual ER Canvas */}
            <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 border border-outline-variant/30 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/20">
                <div>
                  <h2 className="text-xl font-extrabold text-on-surface">
                    Entity-Relationship Topology & Relational Map
                  </h2>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Visual relationship clusters indicating primary foreign key anchors and cascade dependencies across the circular barter engine.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-1 bg-primary rounded" />
                    <span>1:N Has Many</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-1 bg-teal-500 rounded" />
                    <span>1:1 Optional Child</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-1 bg-amber-500 rounded" />
                    <span>N:M Multi-Join</span>
                  </div>
                </div>
              </div>

              {/* Visual ER Interactive Canvas */}
              <DatabaseERDiagram />

              {/* Graphical Domain Clusters Summary */}
              <div className="pt-6 border-t border-outline-variant/20">
                <h3 className="text-sm font-bold text-on-surface mb-3">Domain Entity Clusters & Foreign Key Bridges</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* Cluster 1: Core Marketplace */}
                <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">Core Entity Hub</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-bold">4 Models</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-white border border-outline-variant/20 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-on-surface">User</span>
                        <span className="text-[10px] font-mono text-outline">PK: id</span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant mt-1">
                        Owns Listings, Initiates Barters, Sends Messages, Receives Reviews.
                      </p>
                    </div>

                    <div className="flex justify-center text-outline">
                      <ArrowDownUp className="w-3.5 h-3.5 text-primary" />
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-outline-variant/20 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-on-surface">Listing</span>
                        <span className="text-[10px] font-mono text-outline">FK: userId</span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant mt-1">
                        Has optional 1:1 BookDetails & ProductDetails. Targeted by BarterProposals.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="p-2.5 rounded-lg bg-teal-50 border border-teal-200 text-[11px]">
                        <span className="font-bold text-teal-900 block">BookDetails</span>
                        <span className="text-teal-700 text-[10px]">ISBN, CourseCode</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-200 text-[11px]">
                        <span className="font-bold text-sky-900 block">ProductDetails</span>
                        <span className="text-sky-700 text-[10px]">Brand, Specs, Box</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cluster 2: Barter & Swaps Engine */}
                <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Barter & Swaps</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">3 Models</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-white border border-outline-variant/20 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-on-surface">BarterProposal</span>
                        <span className="text-[10px] font-mono text-amber-700">PIN: TRD-XXXXXX</span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant mt-1">
                        Links Initiator User + Recipient User + Target Listing + Cash Top-Up.
                      </p>
                    </div>

                    <div className="flex justify-center text-outline">
                      <ArrowDownUp className="w-3.5 h-3.5 text-amber-600" />
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-outline-variant/20 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-on-surface">BarterItem (Join Table)</span>
                        <span className="text-[10px] font-mono text-outline">1:N to Proposal</span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant mt-1">
                        Maps multi-item bundled swap offers: links multiple inventory listings to 1 proposal.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-outline-variant/20 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-on-surface">CashOffer</span>
                        <span className="text-[10px] font-mono text-emerald-700">Cash Flow</span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant mt-1">
                        Direct purchase bidding with offerAmount, counterAmount, and expiry timestamps.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cluster 3: Communication & In-Thread Cards */}
                <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-secondary">Messaging & Deals</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary-fixed text-secondary font-bold">2 Models</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-white border border-outline-variant/20 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-on-surface">Conversation</span>
                        <span className="text-[10px] font-mono text-outline">2 Participants</span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant mt-1">
                        Bilateral channel between ParticipantA & ParticipantB anchored to optional listingId.
                      </p>
                    </div>

                    <div className="flex justify-center text-outline">
                      <ArrowDownUp className="w-3.5 h-3.5 text-secondary" />
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-outline-variant/20 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-on-surface">Message</span>
                        <span className="text-[10px] font-mono text-secondary">Payload Cards</span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant mt-1">
                        Houses plain text or interactive CASH_OFFER_CARD & BARTER_PROPOSAL_CARD metadata.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-outline-variant/20 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-on-surface">Notification</span>
                        <span className="text-[10px] font-mono text-outline">Indexed</span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant mt-1">
                        Async push delivery for offer updates, messages, and price drops.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cluster 4: Reputation & Safety */}
                <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-700">Trust & Safety</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 font-bold">4 Models</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-white border border-outline-variant/20 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-on-surface">Review</span>
                        <span className="text-[10px] font-mono text-rose-700">Dual-Sided</span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant mt-1">
                        Punctuality, condition accuracy, and communication ratings unlocked by PIN match.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-outline-variant/20 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-on-surface">SavedListing</span>
                        <span className="text-[10px] font-mono text-outline">Unique Pair</span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant mt-1">
                        Wishlist bookmarks with compound index [userId, listingId].
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-outline-variant/20 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-on-surface">PriceHistory</span>
                        <span className="text-[10px] font-mono text-outline">Audit Log</span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant mt-1">
                        Temporal price timeline recording markdowns and barter valuation changes.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-[11px]">
                      <span className="font-bold text-red-900 block">Report</span>
                      <span className="text-red-700 text-[10px]">Community safety flagging & moderation</span>
                    </div>
                  </div>
                </div>
              </div>
              </div>

              {/* Cardinality Summary Table */}
              <div className="pt-4 border-t border-outline-variant/20 space-y-3">
                <h3 className="font-bold text-sm text-on-surface">Foreign Key Referential Cardinality Matrix</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
                    <span className="font-bold text-primary block">User → Listing (1:N)</span>
                    <span className="text-on-surface-variant text-[11px]">CASCADE on user deletion. A user owns zero or many posted items.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
                    <span className="font-bold text-teal-700 block">Listing → BookDetails (1:1)</span>
                    <span className="text-on-surface-variant text-[11px]">Unique listingId FK. Automatically cascades when listing is removed.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
                    <span className="font-bold text-amber-700 block">BarterProposal → BarterItem (1:N)</span>
                    <span className="text-on-surface-variant text-[11px]">Join table resolves M:N barter combinations into clean 1:N relations.</span>
                  </div>
                </div>
              </div>

              {/* Prisma Schema Location & Engine Validation */}
              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="text-on-surface-variant font-medium">
                  Prisma schema source: <code className="text-primary font-bold">prisma/schema.prisma</code>
                </span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-4 h-4" /> Validated with Prisma Engine 5.22
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: SQL QUERY WORKBENCH & CUSTOM STUDIO */}
        {/* ========================================================= */}
        {activeTab === 'sql' && (
          <div className="space-y-6">
            <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 border border-outline-variant/30 shadow-xs space-y-6">
              <div className="pb-4 border-b border-outline-variant/20">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>PostgreSQL 16 Analytical Playground</span>
                </div>
                <h2 className="text-xl font-extrabold text-on-surface">
                  SQL Query Studio & Interactive Workbench
                </h2>
                <p className="text-xs text-on-surface-variant mt-1">
                  Write, edit, and execute custom SQL queries against the local database with editable templates, live syntax safety, and real-time result tables.
                </p>
              </div>

              {/* Custom SQL Workbench with Live Editor & Templates */}
              <CustomSQLWorkbench curatedQueries={SQL_QUERIES} />
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: ENUMS & TYPES EXPLORER */}
        {/* ========================================================= */}
        {activeTab === 'enums' && (
          <div className="space-y-6">
            <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 border border-outline-variant/30 shadow-xs space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-on-surface">
                  PostgreSQL Enums & Domain Types (13 Custom Types)
                </h2>
                <p className="text-xs text-on-surface-variant mt-1">
                  Strictly typed enumerated values guarding transaction states, barter modes, and condition rubrics.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {DB_ENUMS.map((enumDef) => (
                  <div
                    key={enumDef.name}
                    className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-sm text-primary font-mono">{enumDef.name}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-container text-outline">
                        {enumDef.values.length} values
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant">{enumDef.description}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {enumDef.values.map((v) => (
                        <span
                          key={v}
                          className="px-2 py-0.5 rounded-md bg-white border border-outline-variant/20 font-mono text-[11px] font-bold text-on-surface shadow-2xs"
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: DATABASE CREATION DDL COMMANDS */}
        {/* ========================================================= */}
        {activeTab === 'ddl' && <DatabaseDDLViewer />}
      </div>
    </div>
  );
}
