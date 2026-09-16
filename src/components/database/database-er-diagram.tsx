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
} from 'lucide-react';

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
  fks: { name: string; target: string }[];
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
    fks: [{ name: 'userId', target: 'User' }],
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
    fks: [{ name: 'listingId', target: 'Listing' }],
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
    fks: [{ name: 'listingId', target: 'Listing' }],
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
    width: 220,
    height: 140,
    pk: 'id (cuid)',
    fks: [
      { name: 'userId', target: 'User' },
      { name: 'listingId', target: 'Listing' },
    ],
    keyFields: ['createdAt: DateTime'],
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
    fks: [{ name: 'listingId', target: 'Listing' }],
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
      { name: 'listingId', target: 'Listing' },
      { name: 'buyerId', target: 'User' },
      { name: 'sellerId', target: 'User' },
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
      { name: 'initiatorId', target: 'User' },
      { name: 'recipientId', target: 'User' },
      { name: 'targetListingId', target: 'Listing' },
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
    height: 160,
    pk: 'id (cuid)',
    fks: [
      { name: 'proposalId', target: 'BarterProposal' },
      { name: 'listingId', target: 'Listing' },
    ],
    keyFields: ['createdAt: DateTime', 'bundle mapping join'],
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
      { name: 'participantAId', target: 'User' },
      { name: 'participantBId', target: 'User' },
      { name: 'listingId', target: 'Listing' },
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
      { name: 'conversationId', target: 'Conversation' },
      { name: 'senderId', target: 'User' },
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
    fks: [{ name: 'userId', target: 'User' }],
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
      { name: 'authorId', target: 'User' },
      { name: 'targetId', target: 'User' },
      { name: 'listingId', target: 'Listing' },
    ],
    keyFields: ['rating: 1-5 Stars', 'punctualityScore: 1-5', 'itemAsDescribed: Boolean', 'comment: Text'],
  },
];

interface Edge {
  id: string;
  source: string;
  target: string;
  label: string;
  cardinality: '1:1' | '1:N' | 'N:M';
  sourceAnchor: 'right' | 'left' | 'bottom' | 'top';
  targetAnchor: 'right' | 'left' | 'bottom' | 'top';
  color: string;
}

const EDGES: Edge[] = [
  { id: 'e1', source: 'User', target: 'Listing', label: 'owns', cardinality: '1:N', sourceAnchor: 'right', targetAnchor: 'left', color: '#4648d4' },
  { id: 'e2', source: 'Listing', target: 'BookDetails', label: 'has optional', cardinality: '1:1', sourceAnchor: 'right', targetAnchor: 'left', color: '#0d9488' },
  { id: 'e3', source: 'Listing', target: 'ProductDetails', label: 'has optional', cardinality: '1:1', sourceAnchor: 'right', targetAnchor: 'left', color: '#0284c7' },
  { id: 'e4', source: 'User', target: 'CashOffer', label: 'buyer/seller', cardinality: '1:N', sourceAnchor: 'bottom', targetAnchor: 'top', color: '#16a34a' },
  { id: 'e5', source: 'Listing', target: 'CashOffer', label: 'receives bid', cardinality: '1:N', sourceAnchor: 'bottom', targetAnchor: 'right', color: '#16a34a' },
  { id: 'e6', source: 'User', target: 'BarterProposal', label: 'initiates/receives', cardinality: '1:N', sourceAnchor: 'right', targetAnchor: 'left', color: '#d97706' },
  { id: 'e7', source: 'Listing', target: 'BarterProposal', label: 'target of', cardinality: '1:N', sourceAnchor: 'bottom', targetAnchor: 'top', color: '#d97706' },
  { id: 'e8', source: 'BarterProposal', target: 'BarterItem', label: 'contains items', cardinality: '1:N', sourceAnchor: 'right', targetAnchor: 'left', color: '#ea580c' },
  { id: 'e9', source: 'Listing', target: 'BarterItem', label: 'offered in', cardinality: '1:N', sourceAnchor: 'right', targetAnchor: 'top', color: '#ea580c' },
  { id: 'e10', source: 'User', target: 'Conversation', label: 'participates', cardinality: '1:N', sourceAnchor: 'bottom', targetAnchor: 'top', color: '#0891b2' },
  { id: 'e11', source: 'Conversation', target: 'Message', label: 'contains', cardinality: '1:N', sourceAnchor: 'bottom', targetAnchor: 'top', color: '#2563eb' },
  { id: 'e12', source: 'User', target: 'Notification', label: 'alerted', cardinality: '1:N', sourceAnchor: 'bottom', targetAnchor: 'left', color: '#6366f1' },
  { id: 'e13', source: 'User', target: 'SavedListing', label: 'bookmarks', cardinality: '1:N', sourceAnchor: 'right', targetAnchor: 'left', color: '#ec4899' },
  { id: 'e14', source: 'Listing', target: 'SavedListing', label: 'saved in', cardinality: '1:N', sourceAnchor: 'bottom', targetAnchor: 'top', color: '#ec4899' },
  { id: 'e15', source: 'Listing', target: 'PriceHistory', label: 'records', cardinality: '1:N', sourceAnchor: 'right', targetAnchor: 'left', color: '#8b5cf6' },
  { id: 'e16', source: 'User', target: 'Review', label: 'writes/receives', cardinality: '1:N', sourceAnchor: 'bottom', targetAnchor: 'left', color: '#e11d48' },
];

const MERMAID_CODE = `erDiagram
    User ||--o{ Listing : "owns"
    User ||--o{ CashOffer : "sends/receives"
    User ||--o{ BarterProposal : "initiates/receives"
    User ||--o{ Message : "sends/receives"
    User ||--o{ Review : "writes/receives"
    User ||--o{ Notification : "alerted"
    User ||--o{ SavedListing : "bookmarks"
    User ||--o{ Conversation : "participates in"

    Listing ||--o| BookDetails : "has optional 1:1"
    Listing ||--o| ProductDetails : "has optional 1:1"
    Listing ||--o{ CashOffer : "receives"
    Listing ||--o{ BarterProposal : "target of"
    Listing ||--o{ SavedListing : "saved in"
    Listing ||--o{ PriceHistory : "records"

    BarterProposal ||--o{ BarterItem : "contains items offered"
    Listing ||--o{ BarterItem : "offered in"

    Conversation ||--o{ Message : "contains"`;

export default function DatabaseERDiagram() {
  const [activeView, setActiveView] = useState<'visual' | 'mermaid' | 'code'>('visual');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);
  const [domainFilter, setDomainFilter] = useState<string>('All');
  const [zoom, setZoom] = useState<number>(1);
  const [copied, setCopied] = useState(false);
  const [mermaidSvg, setMermaidSvg] = useState<string>('');
  const [mermaidError, setMermaidError] = useState<string | null>(null);
  const mermaidContainerRef = useRef<HTMLDivElement>(null);

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

    // Compute bezier control points based on orientation
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
    if (hoveredEdgeId === edge.id) return true;
    if (selectedNodeId) {
      return edge.source === selectedNodeId || edge.target === selectedNodeId;
    }
    return false;
  };

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
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeView === 'visual'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            🎨 Interactive Visual ER Canvas
          </button>
          <button
            onClick={() => {
              setActiveView('mermaid');
              renderMermaid();
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeView === 'mermaid'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            🧜 Mermaid Vector Diagram
          </button>
          <button
            onClick={() => setActiveView('code')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeView === 'code'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            💻 Mermaid Code
          </button>
        </div>

        {/* Action / Zoom Controls */}
        <div className="flex items-center gap-2">
          {activeView === 'visual' && (
            <div className="flex items-center bg-surface-container-low rounded-full px-2 py-1 border border-outline-variant/30 gap-1 text-xs font-bold">
              <button
                onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
                className="p-1 hover:bg-surface-container rounded-full text-on-surface"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-1 text-[11px] text-outline font-mono">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom((z) => Math.min(1.4, z + 0.15))}
                className="p-1 hover:bg-surface-container rounded-full text-on-surface"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setZoom(1);
                  setSelectedNodeId(null);
                }}
                className="p-1 hover:bg-surface-container rounded-full text-on-surface"
                title="Reset View"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-bold border border-outline-variant/30 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>
      </div>

      {/* Domain Filters when in Visual Mode */}
      {activeView === 'visual' && (
        <div className="flex items-center justify-between flex-wrap gap-2 px-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-outline font-bold uppercase tracking-wider mr-1">Filter Domain:</span>
            {['All', 'Core Marketplace', 'Barter & Swaps', 'Chat & Messaging', 'Trust & Safety'].map((dom) => (
              <button
                key={dom}
                onClick={() => setDomainFilter(dom)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                  domainFilter === dom
                    ? 'bg-on-surface text-white'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {dom}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-outline flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 bg-primary inline-block rounded" /> 1:N Relation
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 bg-teal-500 inline-block rounded" /> 1:1 Optional Child
            </span>
            <span className="text-primary font-semibold">Tip: Click table node to focus links</span>
          </div>
        </div>
      )}

      {/* VIEW 1: INTERACTIVE SVG ER DIAGRAM CANVAS */}
      {activeView === 'visual' && (
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
                  {/* Arrow markers for edges */}
                  <marker
                    id="arrow-default"
                    viewBox="0 0 10 10"
                    refX="6"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 8 5 L 0 9 z" fill="#64748b" />
                  </marker>
                  <marker
                    id="arrow-highlight"
                    viewBox="0 0 10 10"
                    refX="6"
                    refY="5"
                    markerWidth="7"
                    markerHeight="7"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 8 5 L 0 9 z" fill="#38bdf8" />
                  </marker>
                </defs>
                <rect width="1000" height="1160" fill="url(#er-grid)" />

                {/* SVG Relationship Edge Curves */}
                {EDGES.map((edge) => {
                  const highlighted = isEdgeHighlighted(edge);
                  const isFiltered =
                    domainFilter !== 'All' &&
                    nodeMap.get(edge.source)?.domain !== domainFilter &&
                    nodeMap.get(edge.target)?.domain !== domainFilter;

                  if (isFiltered) return null;

                  const pathD = getPathD(edge);
                  return (
                    <g
                      key={edge.id}
                      onMouseEnter={() => setHoveredEdgeId(edge.id)}
                      onMouseLeave={() => setHoveredEdgeId(null)}
                      className="cursor-pointer"
                    >
                      {/* Invisible wider stroke for easier hover hit target */}
                      <path d={pathD} fill="none" stroke="transparent" strokeWidth="16" />
                      {/* Visible relation line */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke={highlighted ? '#38bdf8' : edge.color}
                        strokeWidth={highlighted ? '3.5' : '1.8'}
                        strokeOpacity={highlighted ? 1 : 0.65}
                        strokeDasharray={edge.cardinality === '1:1' ? '4 3' : 'none'}
                        markerEnd={highlighted ? 'url(#arrow-highlight)' : 'url(#arrow-default)'}
                        className="transition-all duration-200"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Entity Node Cards */}
              {NODES.map((node) => {
                const isSelected = selectedNodeId === node.id;
                const connected = isConnected(node.id);
                const matchesDomain = domainFilter === 'All' || node.domain === domainFilter;
                const opacity = matchesDomain && connected ? 1 : 0.25;

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

                      {/* FKs */}
                      {node.fks.map((fk) => (
                        <div
                          key={fk.name}
                          className="flex items-center justify-between text-indigo-300 font-semibold bg-indigo-950/30 px-2 py-0.5 rounded border border-indigo-800/40"
                        >
                          <span className="flex items-center gap-1">
                            <Link2 className="w-3 h-3 text-indigo-400" /> FK {fk.name}
                          </span>
                          <span className="text-[10px] text-indigo-200">→ {fk.target}</span>
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
                {mermaidError}. You can view the rich interactive SVG diagram using the <strong>🎨 Interactive Visual ER Canvas</strong> tab above.
              </p>
              <button
                onClick={() => setActiveView('visual')}
                className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container"
              >
                Switch to Interactive ER Canvas
              </button>
            </div>
          ) : (
            <div className="text-center space-y-3 p-12 text-slate-400">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-semibold">Generating live vector Mermaid ER diagram...</p>
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: RAW MERMAID CODE */}
      {activeView === 'code' && (
        <div className="rounded-3xl bg-slate-950 border border-slate-800 p-6 font-mono text-xs text-emerald-400 overflow-x-auto shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-slate-400 text-xs">Standard Mermaid.js Entity-Relationship Syntax</span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="text-[12px] leading-relaxed select-all">{MERMAID_CODE}</pre>
        </div>
      )}
    </div>
  );
}
