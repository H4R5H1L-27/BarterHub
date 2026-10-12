'use client';

import React, { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import {
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Code2,
  Eye,
  Key,
  Link2,
  Sparkles,
  Info,
  Filter,
  HelpCircle,
  Network,
} from 'lucide-react';

export type CardinalityType = '1:1' | '1:N' | 'N:M';

export interface CardinalityMeta {
  color: string;
  dashArray: string;
  strokeWidth: number;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  label: string;
  title: string;
  description: string;
  sourceMark: string;
  targetMark: string;
}

export const CARDINALITY_CONFIG: Record<CardinalityType, CardinalityMeta> = {
  '1:1': {
    color: '#14b8a6', // Teal
    dashArray: '6 4',
    strokeWidth: 2.2,
    badgeBg: '#042f2e',
    badgeBorder: '#14b8a6',
    badgeText: '#2dd4bf',
    label: '1 : 1',
    title: 'One-to-One Optional Extension',
    description: 'Each parent record links to at most 1 child extension record (e.g. Listing to BookDetails).',
    sourceMark: '1',
    targetMark: '1',
  },
  '1:N': {
    color: '#6366f1', // Indigo
    dashArray: 'none',
    strokeWidth: 2.2,
    badgeBg: '#1e1b4b',
    badgeBorder: '#6366f1',
    badgeText: '#a5b4fc',
    label: '1 : N',
    title: 'One-to-Many Parent-Child',
    description: 'One parent entity owns or references zero, one, or many child entities (e.g. User owns Listings).',
    sourceMark: '1',
    targetMark: 'N',
  },
  'N:M': {
    color: '#f59e0b', // Amber
    dashArray: '3 3',
    strokeWidth: 2.5,
    badgeBg: '#451a03',
    badgeBorder: '#f59e0b',
    badgeText: '#fcd34d',
    label: 'N : M',
    title: 'Many-to-Many Associative Join',
    description: 'Resolved through an associative bridge table (e.g. BarterItem maps multiple listings into barter proposals).',
    sourceMark: 'N',
    targetMark: 'M',
  },
};

interface ModelNode {
  id: string;
  name: string;
  tableName: string;
  domain: 'Core Marketplace' | 'Barter & Swaps' | 'Chat & Messaging' | 'Trust & Safety';
  color: string;
  badgeBg: string;
  x: number;
  y: number;
  width: number;
  height: number;
  pk: string;
  fks: { name: string; target: string; cardinality: CardinalityType }[];
  keyFields: string[];
}

const NODES: ModelNode[] = [
  // Core Marketplace
  {
    id: 'User',
    name: 'User',
    tableName: 'users',
    domain: 'Core Marketplace',
    color: '#4648d4',
    badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    x: 40,
    y: 80,
    width: 230,
    height: 290,
    pk: 'id (cuid)',
    fks: [],
    keyFields: ['name: String', 'email: String [unique]', 'city: String', 'reputationScore: 5.0', 'isVerified: Boolean', 'role: USER | ADMIN'],
  },
  {
    id: 'Listing',
    name: 'Listing',
    tableName: 'listings',
    domain: 'Core Marketplace',
    color: '#712ae2',
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
    x: 370,
    y: 80,
    width: 240,
    height: 310,
    pk: 'id (cuid)',
    fks: [{ name: 'userId', target: 'User', cardinality: '1:N' }],
    keyFields: ['title: String', 'listingType: BOOK | PRODUCT', 'exchangeType: BARTER | CASH | HYBRID', 'price: Float?', 'status: ACTIVE | TRADED', 'barterWishlist: String'],
  },
  {
    id: 'BookDetails',
    name: 'BookDetails',
    tableName: 'book_details',
    domain: 'Core Marketplace',
    color: '#0d9488',
    badgeBg: 'bg-teal-100 text-teal-800 border-teal-200',
    x: 710,
    y: 40,
    width: 230,
    height: 190,
    pk: 'id (cuid)',
    fks: [{ name: 'listingId', target: 'Listing', cardinality: '1:1' }],
    keyFields: ['isbn: String', 'author: String', 'edition: String', 'academicSubject: String', 'courseCode: String'],
  },
  {
    id: 'ProductDetails',
    name: 'ProductDetails',
    tableName: 'product_details',
    domain: 'Core Marketplace',
    color: '#0284c7',
    badgeBg: 'bg-sky-100 text-sky-800 border-sky-200',
    x: 710,
    y: 250,
    width: 230,
    height: 190,
    pk: 'id (cuid)',
    fks: [{ name: 'listingId', target: 'Listing', cardinality: '1:1' }],
    keyFields: ['category: String', 'brand: String', 'model: String', 'includesOriginalBox: Boolean', 'warrantyStatus: String'],
  },
  {
    id: 'SavedListing',
    name: 'SavedListing',
    tableName: 'saved_listings',
    domain: 'Core Marketplace',
    color: '#ec4899',
    badgeBg: 'bg-pink-100 text-pink-800 border-pink-200',
    x: 370,
    y: 430,
    width: 230,
    height: 155,
    pk: 'id (cuid)',
    fks: [
      { name: 'userId', target: 'User', cardinality: 'N:M' },
      { name: 'listingId', target: 'Listing', cardinality: 'N:M' },
    ],
    keyFields: ['createdAt: DateTime', 'unique pair: [userId, listingId]'],
  },
  {
    id: 'PriceHistory',
    name: 'PriceHistory',
    tableName: 'price_histories',
    domain: 'Core Marketplace',
    color: '#8b5cf6',
    badgeBg: 'bg-violet-100 text-violet-800 border-violet-200',
    x: 710,
    y: 460,
    width: 230,
    height: 150,
    pk: 'id (cuid)',
    fks: [{ name: 'listingId', target: 'Listing', cardinality: '1:N' }],
    keyFields: ['oldPrice: Float?', 'newPrice: Float', 'changedAt: DateTime'],
  },

  // Barter & Swaps
  {
    id: 'CashOffer',
    name: 'CashOffer',
    tableName: 'cash_offers',
    domain: 'Barter & Swaps',
    color: '#16a34a',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    x: 40,
    y: 420,
    width: 230,
    height: 220,
    pk: 'id (cuid)',
    fks: [
      { name: 'listingId', target: 'Listing', cardinality: '1:N' },
      { name: 'buyerId', target: 'User', cardinality: '1:N' },
      { name: 'sellerId', target: 'User', cardinality: '1:N' },
    ],
    keyFields: ['offerAmount: Float', 'counterAmount: Float?', 'status: PENDING | ACCEPTED', 'expiresAt: DateTime'],
  },
  {
    id: 'BarterProposal',
    name: 'BarterProposal',
    tableName: 'barter_proposals',
    domain: 'Barter & Swaps',
    color: '#d97706',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
    x: 370,
    y: 610,
    width: 250,
    height: 250,
    pk: 'id (cuid)',
    fks: [
      { name: 'initiatorId', target: 'User', cardinality: '1:N' },
      { name: 'recipientId', target: 'User', cardinality: '1:N' },
      { name: 'targetListingId', target: 'Listing', cardinality: '1:N' },
    ],
    keyFields: ['cashTopUp: Float (offset)', 'exchangeCode: TRD-XXXXXX (PIN)', 'status: PROPOSED | ACCEPTED | COMPLETED', 'notes: Text'],
  },
  {
    id: 'BarterItem',
    name: 'BarterItem',
    tableName: 'barter_items',
    domain: 'Barter & Swaps',
    color: '#ea580c',
    badgeBg: 'bg-orange-100 text-orange-800 border-orange-200',
    x: 710,
    y: 640,
    width: 230,
    height: 165,
    pk: 'id (cuid)',
    fks: [
      { name: 'proposalId', target: 'BarterProposal', cardinality: 'N:M' },
      { name: 'listingId', target: 'Listing', cardinality: 'N:M' },
    ],
    keyFields: ['createdAt: DateTime', 'associative barter bundle join'],
  },

  // Chat & Messaging
  {
    id: 'Conversation',
    name: 'Conversation',
    tableName: 'conversations',
    domain: 'Chat & Messaging',
    color: '#0891b2',
    badgeBg: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    x: 40,
    y: 680,
    width: 230,
    height: 190,
    pk: 'id (cuid)',
    fks: [
      { name: 'participantAId', target: 'User', cardinality: '1:N' },
      { name: 'participantBId', target: 'User', cardinality: '1:N' },
      { name: 'listingId', target: 'Listing', cardinality: '1:N' },
    ],
    keyFields: ['lastMessageAt: DateTime', 'bilateral session channel'],
  },
  {
    id: 'Message',
    name: 'Message',
    tableName: 'messages',
    domain: 'Chat & Messaging',
    color: '#2563eb',
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
    x: 40,
    y: 910,
    width: 230,
    height: 200,
    pk: 'id (cuid)',
    fks: [
      { name: 'conversationId', target: 'Conversation', cardinality: '1:N' },
      { name: 'senderId', target: 'User', cardinality: '1:N' },
    ],
    keyFields: ['messageType: TEXT | CASH_CARD | BARTER_CARD', 'content: Text', 'metadata: Json', 'isRead: Boolean'],
  },
  {
    id: 'Notification',
    name: 'Notification',
    tableName: 'notifications',
    domain: 'Chat & Messaging',
    color: '#6366f1',
    badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    x: 370,
    y: 900,
    width: 230,
    height: 180,
    pk: 'id (cuid)',
    fks: [{ name: 'userId', target: 'User', cardinality: '1:N' }],
    keyFields: ['type: OFFER_NEW | BARTER_ACCEPTED | MESSAGE_NEW', 'title: String', 'body: String', 'isRead: Boolean'],
  },

  // Trust & Safety
  {
    id: 'Review',
    name: 'Review',
    tableName: 'reviews',
    domain: 'Trust & Safety',
    color: '#e11d48',
    badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
    x: 710,
    y: 840,
    width: 230,
    height: 200,
    pk: 'id (cuid)',
    fks: [
      { name: 'authorId', target: 'User', cardinality: '1:N' },
      { name: 'targetId', target: 'User', cardinality: '1:N' },
      { name: 'listingId', target: 'Listing', cardinality: '1:N' },
    ],
    keyFields: ['rating: 1-5 Stars', 'punctualityScore: 1-5', 'itemAsDescribed: Boolean', 'comment: Text'],
  },
];

interface Edge {
  id: string;
  source: string;
  target: string;
  label: string;
  cardinality: CardinalityType;
  sourceAnchor: 'right' | 'left' | 'bottom' | 'top';
  targetAnchor: 'right' | 'left' | 'bottom' | 'top';
  description: string;
}

const EDGES: Edge[] = [
  // 1:N One-to-Many Relationships
  { id: 'e1', source: 'User', target: 'Listing', label: 'owns', cardinality: '1:N', sourceAnchor: 'right', targetAnchor: 'left', description: 'One User owns zero or many Listings' },
  { id: 'e4', source: 'User', target: 'CashOffer', label: 'buyer/seller', cardinality: '1:N', sourceAnchor: 'bottom', targetAnchor: 'top', description: 'One User participates in multiple Cash Offers' },
  { id: 'e5', source: 'Listing', target: 'CashOffer', label: 'receives bid', cardinality: '1:N', sourceAnchor: 'bottom', targetAnchor: 'right', description: 'One Listing can receive multiple Cash Offers' },
  { id: 'e6', source: 'User', target: 'BarterProposal', label: 'initiates/receives', cardinality: '1:N', sourceAnchor: 'right', targetAnchor: 'left', description: 'One User can initiate or receive multiple Barter Proposals' },
  { id: 'e7', source: 'Listing', target: 'BarterProposal', label: 'target of', cardinality: '1:N', sourceAnchor: 'bottom', targetAnchor: 'top', description: 'One Listing can be targeted by multiple Barter Proposals' },
  { id: 'e10', source: 'User', target: 'Conversation', label: 'participates', cardinality: '1:N', sourceAnchor: 'bottom', targetAnchor: 'top', description: 'One User participates in multiple chat Conversations' },
  { id: 'e11', source: 'Conversation', target: 'Message', label: 'contains', cardinality: '1:N', sourceAnchor: 'bottom', targetAnchor: 'top', description: 'One Conversation thread contains multiple Messages' },
  { id: 'e12', source: 'User', target: 'Notification', label: 'alerted', cardinality: '1:N', sourceAnchor: 'bottom', targetAnchor: 'left', description: 'One User receives multiple system Notifications' },
  { id: 'e15', source: 'Listing', target: 'PriceHistory', label: 'records', cardinality: '1:N', sourceAnchor: 'right', targetAnchor: 'left', description: 'One Listing generates multiple Price History snapshots' },
  { id: 'e16', source: 'User', target: 'Review', label: 'writes/receives', cardinality: '1:N', sourceAnchor: 'bottom', targetAnchor: 'left', description: 'One User gives or receives multiple Reviews' },

  // 1:1 One-to-One Optional Extension Relationships
  { id: 'e2', source: 'Listing', target: 'BookDetails', label: 'has optional', cardinality: '1:1', sourceAnchor: 'right', targetAnchor: 'left', description: 'One Listing has at most one 1:1 BookDetails record' },
  { id: 'e3', source: 'Listing', target: 'ProductDetails', label: 'has optional', cardinality: '1:1', sourceAnchor: 'right', targetAnchor: 'left', description: 'One Listing has at most one 1:1 ProductDetails record' },

  // N:M Many-to-Many Associative Join Bridges
  { id: 'e8', source: 'BarterProposal', target: 'BarterItem', label: 'bundles items', cardinality: 'N:M', sourceAnchor: 'right', targetAnchor: 'left', description: 'Join Bridge: Multiple Listings bundled into Barter Proposals via BarterItem' },
  { id: 'e9', source: 'Listing', target: 'BarterItem', label: 'offered in', cardinality: 'N:M', sourceAnchor: 'right', targetAnchor: 'top', description: 'Join Bridge: Multiple Listings offered across Barter Proposals via BarterItem' },
  { id: 'e13', source: 'User', target: 'SavedListing', label: 'bookmarks', cardinality: 'N:M', sourceAnchor: 'right', targetAnchor: 'left', description: 'Join Bridge: Users bookmark multiple Listings via SavedListing' },
  { id: 'e14', source: 'Listing', target: 'SavedListing', label: 'saved in', cardinality: 'N:M', sourceAnchor: 'bottom', targetAnchor: 'top', description: 'Join Bridge: Listings saved by multiple Users via SavedListing' },
];

const MERMAID_CODE = `erDiagram
    %% 1:N One-to-Many (||--o{)
    User ||--o{ Listing : "1:N owns"
    User ||--o{ CashOffer : "1:N buyer_or_seller"
    Listing ||--o{ CashOffer : "1:N receives_bid"
    User ||--o{ BarterProposal : "1:N initiates_or_receives"
    Listing ||--o{ BarterProposal : "1:N target_listing"
    User ||--o{ Conversation : "1:N participant"
    Conversation ||--o{ Message : "1:N contains"
    User ||--o{ Notification : "1:N alerts"
    User ||--o{ Review : "1:N reviews"
    Listing ||--o{ PriceHistory : "1:N price_snapshots"

    %% 1:1 One-to-One Optional (||--o|)
    Listing ||--o| BookDetails : "1:1 optional_book_meta"
    Listing ||--o| ProductDetails : "1:1 optional_product_meta"

    %% N:M Many-to-Many Associative Join Bridges (||--o{ into Join Table)
    BarterProposal ||--o{ BarterItem : "N:M join_proposal_bridge"
    Listing ||--o{ BarterItem : "N:M join_listing_bridge"
    User ||--o{ SavedListing : "N:M bookmark_user_bridge"
    Listing ||--o{ SavedListing : "N:M bookmark_listing_bridge"`;

export default function DatabaseERDiagram() {
  const [activeView, setActiveView] = useState<'visual' | 'mermaid' | 'code'>('visual');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [domainFilter, setDomainFilter] = useState<string>('All');
  const [cardinalityFilter, setCardinalityFilter] = useState<string>('All');
  const [zoom, setZoom] = useState<number>(1);
  const [copied, setCopied] = useState(false);
  const [mermaidSvg, setMermaidSvg] = useState<string>('');
  const [mermaidError, setMermaidError] = useState<string | null>(null);

  const nodeMap = new Map(NODES.map((n) => [n.id, n]));

  // Helper to compute anchor coordinate for edge curves
  const getAnchor = (node: ModelNode, anchor: 'right' | 'left' | 'bottom' | 'top') => {
    switch (anchor) {
      case 'right':
        return { x: node.x + node.width, y: node.y + node.height / 2 };
      case 'left':
        return { x: node.x, y: node.y + node.height / 2 };
      case 'top':
        return { x: node.x + node.width / 2, y: node.y };
      case 'bottom':
        return { x: node.x + node.width / 2, y: node.y + node.height };
    }
  };

  const getPathD = (edge: Edge) => {
    const sNode = nodeMap.get(edge.source);
    const tNode = nodeMap.get(edge.target);
    if (!sNode || !tNode) return '';

    const s = getAnchor(sNode, edge.sourceAnchor);
    const t = getAnchor(tNode, edge.targetAnchor);

    const dx = Math.abs(t.x - s.x) * 0.5;
    const dy = Math.abs(t.y - s.y) * 0.5;

    let c1x = s.x;
    let c1y = s.y;
    let c2x = t.x;
    let c2y = t.y;

    if (edge.sourceAnchor === 'right') c1x = s.x + Math.max(dx, 40);
    else if (edge.sourceAnchor === 'left') c1x = s.x - Math.max(dx, 40);
    else if (edge.sourceAnchor === 'bottom') c1y = s.y + Math.max(dy, 40);
    else if (edge.sourceAnchor === 'top') c1y = s.y - Math.max(dy, 40);

    if (edge.targetAnchor === 'left') c2x = t.x - Math.max(dx, 40);
    else if (edge.targetAnchor === 'right') c2x = t.x + Math.max(dx, 40);
    else if (edge.targetAnchor === 'top') c2y = t.y - Math.max(dy, 40);
    else if (edge.targetAnchor === 'bottom') c2y = t.y + Math.max(dy, 40);

    return `M ${s.x} ${s.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${t.x} ${t.y}`;
  };

  // Compute exact bezier midpoint for the cardinality badge pill
  const getBezierMidpoint = (edge: Edge) => {
    const sNode = nodeMap.get(edge.source);
    const tNode = nodeMap.get(edge.target);
    if (!sNode || !tNode) return { x: 0, y: 0 };

    const s = getAnchor(sNode, edge.sourceAnchor);
    const t = getAnchor(tNode, edge.targetAnchor);

    const dx = Math.abs(t.x - s.x) * 0.5;
    const dy = Math.abs(t.y - s.y) * 0.5;

    let c1x = s.x;
    let c1y = s.y;
    let c2x = t.x;
    let c2y = t.y;

    if (edge.sourceAnchor === 'right') c1x = s.x + Math.max(dx, 40);
    else if (edge.sourceAnchor === 'left') c1x = s.x - Math.max(dx, 40);
    else if (edge.sourceAnchor === 'bottom') c1y = s.y + Math.max(dy, 40);
    else if (edge.sourceAnchor === 'top') c1y = s.y - Math.max(dy, 40);

    if (edge.targetAnchor === 'left') c2x = t.x - Math.max(dx, 40);
    else if (edge.targetAnchor === 'right') c2x = t.x + Math.max(dx, 40);
    else if (edge.targetAnchor === 'top') c2y = t.y - Math.max(dy, 40);
    else if (edge.targetAnchor === 'bottom') c2y = t.y + Math.max(dy, 40);

    // Cubic Bezier midpoint formula at t = 0.5
    const midX = 0.125 * s.x + 0.375 * c1x + 0.375 * c2x + 0.125 * t.x;
    const midY = 0.125 * s.y + 0.375 * c1y + 0.375 * c2y + 0.125 * t.y;

    return { x: midX, y: midY };
  };

  const isConnected = (nodeId: string) => {
    if (!selectedNodeId) return true;
    if (selectedNodeId === nodeId) return true;
    return EDGES.some(
      (e) =>
        (e.source === selectedNodeId && e.target === nodeId) ||
        (e.target === selectedNodeId && e.source === nodeId)
    );
  };

  const isEdgeHighlighted = (edge: Edge) => {
    if (hoveredEdgeId === edge.id || selectedEdgeId === edge.id) return true;
    if (selectedNodeId) {
      return edge.source === selectedNodeId || edge.target === selectedNodeId;
    }
    return false;
  };

  const activeEdge = EDGES.find((e) => e.id === (hoveredEdgeId || selectedEdgeId));

  const handleCopy = () => {
    navigator.clipboard.writeText(MERMAID_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Attempt client-side mermaid render if mermaid global is available
  const renderMermaid = async () => {
    if (typeof window !== 'undefined' && (window as any).mermaid) {
      try {
        (window as any).mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          themeVariables: {
            primaryColor: '#4648d4',
            primaryTextColor: '#ffffff',
            primaryBorderColor: '#6366f1',
            lineColor: '#818cf8',
            secondaryColor: '#712ae2',
            tertiaryColor: '#0f172a',
          },
        });
        const id = `mermaid-svg-${Date.now()}`;
        const { svg } = await (window as any).mermaid.render(id, MERMAID_CODE);
        setMermaidSvg(svg);
        setMermaidError(null);
      } catch (err: any) {
        setMermaidError(err?.message || 'Could not render Mermaid diagram');
      }
    }
  };

  useEffect(() => {
    if (activeView === 'mermaid') {
      renderMermaid();
    }
  }, [activeView]);

  return (
    <div className="space-y-4">
      {/* Dynamic Mermaid script for optional vector rendering */}
      <Script
        src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"
        strategy="lazyOnload"
        onLoad={() => {
          if (activeView === 'mermaid') renderMermaid();
        }}
      />

      {/* Control Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs">
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-xs font-bold text-on-surface-variant mr-1 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-primary" /> View:
          </span>
          <button
            onClick={() => setActiveView('visual')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeView === 'visual'
                ? 'bg-primary text-white shadow-2xs'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Interactive Visual ER Canvas</span>
          </button>
          <button
            onClick={() => setActiveView('mermaid')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeView === 'mermaid'
                ? 'bg-primary text-white shadow-2xs'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mermaid Vector Diagram</span>
          </button>
          <button
            onClick={() => setActiveView('code')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeView === 'code'
                ? 'bg-primary text-white shadow-2xs'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Mermaid Code</span>
          </button>
        </div>

        {/* Zoom & Copy Controls */}
        <div className="flex items-center gap-2">
          {activeView === 'visual' && (
            <div className="flex items-center bg-surface-container-low rounded-full px-2 py-1 border border-outline-variant/30 gap-1 text-xs font-bold">
              <button
                onClick={() => setZoom((z) => Math.min(z + 0.15, 1.6))}
                className="p-1 hover:bg-surface-container rounded-full text-on-surface"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] px-1 text-outline">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom((z) => Math.max(z - 0.15, 0.65))}
                className="p-1 hover:bg-surface-container rounded-full text-on-surface"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="p-1 hover:bg-surface-container rounded-full text-outline hover:text-on-surface"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          )}

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-bold border border-outline-variant/30 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>
      </div>

      {/* FILTER CONTROLS: CARDINALITY & DOMAIN */}
      {activeView === 'visual' && (
        <div className="p-3 bg-surface-container-low/70 rounded-2xl border border-outline-variant/20 space-y-3">
          {/* Cardinality Selector Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 border-b border-outline-variant/20">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-extrabold uppercase tracking-wider text-outline flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5 text-primary" /> Cardinality:
              </span>
              {[
                { id: 'All', label: 'All Cardinalities (16)', color: 'bg-primary text-white' },
                { id: '1:1', label: '1:1 Optional (2)', color: 'bg-teal-600 text-white', badge: '1:1' },
                { id: '1:N', label: '1:N One-to-Many (10)', color: 'bg-indigo-600 text-white', badge: '1:N' },
                { id: 'N:M', label: 'N:M Many-to-Many (4)', color: 'bg-amber-600 text-white', badge: 'N:M' },
              ].map((c) => {
                const isSelected = cardinalityFilter === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setCardinalityFilter(c.id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border ${
                      isSelected
                        ? `${c.color} border-transparent shadow-2xs`
                        : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant border-outline-variant/30'
                    }`}
                  >
                    {c.id === '1:1' && <span className="w-2.5 h-0.5 bg-teal-400 border border-teal-300 border-dashed" />}
                    {c.id === '1:N' && <span className="w-2.5 h-0.5 bg-indigo-400" />}
                    {c.id === 'N:M' && <span className="w-2.5 h-0.5 bg-amber-400 border border-amber-300 border-dotted" />}
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Visual Guide / Legend */}
            <div className="flex items-center gap-3 text-[11px] font-mono shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-teal-400 border-t-2 border-dashed border-teal-400" />
                <span className="font-bold text-teal-800 dark:text-teal-300">1:1 Dashed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-indigo-500" />
                <span className="font-bold text-indigo-800 dark:text-indigo-300">1:N Solid</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-amber-500 border-t-2 border-dotted border-amber-500" />
                <span className="font-bold text-amber-800 dark:text-amber-300">N:M Dotted</span>
              </div>
            </div>
          </div>

          {/* Domain Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-outline mr-1">Domain:</span>
              {['All', 'Core Marketplace', 'Barter & Swaps', 'Chat & Messaging', 'Trust & Safety'].map((dom) => (
                <button
                  key={dom}
                  onClick={() => setDomainFilter(dom)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                    domainFilter === dom
                      ? 'bg-primary text-white shadow-2xs'
                      : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  {dom}
                </button>
              ))}
            </div>

            <span className="text-[11px] text-primary font-medium">
              Click any table card or relation line to isolate links
            </span>
          </div>
        </div>
      )}

      {/* VIEW 1: INTERACTIVE SVG ER DIAGRAM CANVAS */}
      {activeView === 'visual' && (
        <div className="space-y-4">
          <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl p-4 sm:p-6 overflow-hidden relative">
            <div className="overflow-auto max-h-[800px] rounded-2xl scrollbar-thin scrollbar-thumb-slate-700">
              <div
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: 'top left',
                  transition: 'transform 0.15s ease-out',
                  width: '1000px',
                  height: '1160px',
                  position: 'relative',
                }}
              >
                {/* Background grid pattern */}
                <svg
                  width="1000"
                  height="1160"
                  className="absolute inset-0 pointer-events-none"
                  style={{ zIndex: 0 }}
                >
                  <defs>
                    <pattern id="er-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="1000" height="1160" fill="url(#er-grid)" />

                  {/* SVG Relationship Edge Curves */}
                  {EDGES.map((edge) => {
                    const cfg = CARDINALITY_CONFIG[edge.cardinality];
                    const highlighted = isEdgeHighlighted(edge);
                    
                    const isDomainFiltered =
                      domainFilter !== 'All' &&
                      nodeMap.get(edge.source)?.domain !== domainFilter &&
                      nodeMap.get(edge.target)?.domain !== domainFilter;

                    const isCardFiltered =
                      cardinalityFilter !== 'All' && edge.cardinality !== cardinalityFilter;

                    if (isDomainFiltered) return null;

                    const pathD = getPathD(edge);
                    const mid = getBezierMidpoint(edge);

                    // Dim lines that do not match cardinality filter
                    const opacity = isCardFiltered ? 0.15 : highlighted ? 1 : 0.8;
                    const strokeColor = highlighted ? '#38bdf8' : cfg.color;

                    return (
                      <g
                        key={edge.id}
                        onMouseEnter={() => setHoveredEdgeId(edge.id)}
                        onMouseLeave={() => setHoveredEdgeId(null)}
                        onClick={() => setSelectedEdgeId(selectedEdgeId === edge.id ? null : edge.id)}
                        className="cursor-pointer"
                        style={{ opacity }}
                      >
                        {/* Invisible wider stroke for easier hover hit target */}
                        <path d={pathD} fill="none" stroke="transparent" strokeWidth="20" />
                        
                        {/* Visible relation line with distinct cardinality stroke */}
                        <path
                          d={pathD}
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth={highlighted ? 3.8 : cfg.strokeWidth}
                          strokeDasharray={cfg.dashArray}
                          className="transition-all duration-200"
                        />

                        {/* Midpoint Pill Badge showing 1:1, 1:N, or N:M */}
                        <g
                          transform={`translate(${mid.x}, ${mid.y})`}
                          className="transition-transform duration-150"
                        >
                          {/* Badge background */}
                          <rect
                            x="-22"
                            y="-10"
                            width="44"
                            height="20"
                            rx="6"
                            fill={cfg.badgeBg}
                            stroke={highlighted ? '#38bdf8' : cfg.badgeBorder}
                            strokeWidth={highlighted ? 2 : 1.5}
                          />
                          {/* Badge text */}
                          <text
                            x="0"
                            y="3.5"
                            textAnchor="middle"
                            fill={highlighted ? '#ffffff' : cfg.badgeText}
                            fontSize="10"
                            fontWeight="bold"
                            fontFamily="monospace"
                          >
                            {cfg.label}
                          </text>
                        </g>
                      </g>
                    );
                  })}
                </svg>

                {/* Entity Node Cards */}
                {NODES.map((node) => {
                  const isSelected = selectedNodeId === node.id;
                  const connected = isConnected(node.id);
                  const matchesDomain = domainFilter === 'All' || node.domain === domainFilter;
                  
                  const hasCardMatch =
                    cardinalityFilter === 'All' ||
                    EDGES.some(
                      (e) =>
                        e.cardinality === cardinalityFilter &&
                        (e.source === node.id || e.target === node.id)
                    );

                  const opacity = matchesDomain && connected && hasCardMatch ? 1 : 0.22;

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNodeId(isSelected ? null : node.id)}
                      style={{
                        position: 'absolute',
                        left: `${node.x}px`,
                        top: `${node.y}px`,
                        width: `${node.width}px`,
                        opacity,
                        zIndex: isSelected ? 30 : 10,
                      }}
                      className={`rounded-2xl border transition-all duration-200 cursor-pointer shadow-xl ${
                        isSelected
                          ? 'ring-4 ring-primary/80 border-primary bg-slate-900 shadow-primary/20 scale-[1.02]'
                          : 'border-slate-800 bg-slate-900/95 hover:border-slate-600 hover:bg-slate-900'
                      }`}
                    >
                      {/* Header */}
                      <div
                        className="p-3 rounded-t-2xl border-b border-slate-800 flex items-center justify-between"
                        style={{ borderTop: `3px solid ${node.color}` }}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-sm text-white">{node.name}</span>
                            <span className="text-[10px] font-mono text-slate-400">({node.tableName})</span>
                          </div>
                          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold block mt-0.5">
                            {node.domain}
                          </span>
                        </div>
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: node.color }}
                        />
                      </div>

                      {/* Attributes Table */}
                      <div className="p-3 space-y-1.5 text-[11px] font-mono">
                        {/* PK */}
                        <div className="flex items-center justify-between text-amber-400 font-bold bg-amber-950/30 px-2 py-0.5 rounded border border-amber-800/40">
                          <span className="flex items-center gap-1">
                            <Key className="w-3 h-3 text-amber-400" /> PK
                          </span>
                          <span>{node.pk}</span>
                        </div>

                        {/* FKs with Cardinality Badges */}
                        {node.fks.map((fk) => (
                          <div
                            key={fk.name}
                            className="flex items-center justify-between text-indigo-300 font-semibold bg-indigo-950/30 px-2 py-0.5 rounded border border-indigo-800/40 gap-1"
                          >
                            <span className="flex items-center gap-1 min-w-0 truncate">
                              <Link2 className="w-3 h-3 text-indigo-400 shrink-0" />
                              <span className="truncate">FK {fk.name}</span>
                            </span>
                            <div className="flex items-center gap-1 shrink-0">
                              <span className="text-[10px] text-indigo-200">→ {fk.target}</span>
                              <span
                                className={`text-[9px] px-1 py-0.2 rounded font-mono font-bold ${
                                  fk.cardinality === '1:1'
                                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                                    : fk.cardinality === 'N:M'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                }`}
                              >
                                {fk.cardinality}
                              </span>
                            </div>
                          </div>
                        ))}

                        {/* Selected Attributes */}
                        <div className="pt-1 space-y-1 border-t border-slate-800/60">
                          {node.keyFields.map((field) => (
                            <div key={field} className="text-slate-300 text-[10.5px] truncate flex items-center gap-1">
                              <span className="w-1 h-1 rounded-full bg-slate-600 shrink-0" />
                              <span className="truncate">{field}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Relationship Inspector Card */}
          {activeEdge && (
            <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10.5px] font-mono font-extrabold px-2 py-0.5 rounded border ${
                      activeEdge.cardinality === '1:1'
                        ? 'bg-teal-100 text-teal-800 border-teal-300'
                        : activeEdge.cardinality === 'N:M'
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-indigo-100 text-indigo-800 border-indigo-300'
                    }`}
                  >
                    {CARDINALITY_CONFIG[activeEdge.cardinality].label} {CARDINALITY_CONFIG[activeEdge.cardinality].title}
                  </span>
                  <span className="font-extrabold text-xs text-on-surface">
                    {activeEdge.source} ➔ {activeEdge.target} ({activeEdge.label})
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant font-medium">
                  {activeEdge.description}
                </p>
              </div>

              <button
                onClick={() => {
                  setHoveredEdgeId(null);
                  setSelectedEdgeId(null);
                }}
                className="text-xs font-bold text-outline hover:text-on-surface shrink-0"
              >
                Clear Focus
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: MERMAID VECTOR DIAGRAM */}
      {activeView === 'mermaid' && (
        <div className="bg-slate-950 rounded-3xl border border-slate-800 p-6 shadow-2xl overflow-x-auto min-h-[500px] flex items-center justify-center">
          {mermaidSvg ? (
            <div
              className="w-full flex justify-center mermaid-output"
              dangerouslySetInnerHTML={{ __html: mermaidSvg }}
            />
          ) : mermaidError ? (
            <div className="text-center space-y-3 p-8 text-slate-300">
              <Info className="w-8 h-8 text-amber-400 mx-auto" />
              <p className="font-bold text-white text-sm">Mermaid Rendering Note</p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Client-side SVG compiler is initializing. You can switch to the <strong>Mermaid Code</strong> tab to view or copy the production-grade schema code.
              </p>
            </div>
          ) : (
            <div className="text-center space-y-2 p-8">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-mono">Compiling Mermaid ER vector graph...</p>
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: MERMAID CODE EDITOR */}
      {activeView === 'code' && (
        <div className="rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs text-slate-400 font-mono">
            <span>production_er_schema.mermaid (Structured ER Notation)</span>
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="p-5 font-mono text-xs text-indigo-300 overflow-x-auto leading-relaxed max-h-[600px]">
            {MERMAID_CODE}
          </pre>
        </div>
      )}
    </div>
  );
}
