'use client';

import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Play,
  Copy,
  Check,
  RotateCcw,
  Trash2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Table as TableIcon,
  Code2,
  FileCode,
  Sliders,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

export interface SQLTemplateItem {
  id: string;
  name: string;
  category: 'Simple' | 'Joins & Swaps' | 'Analytics';
  description: string;
  sql: string;
}

export const SQL_TEMPLATES: SQLTemplateItem[] = [
  // ==========================================
  // SIMPLE & DIRECT TEMPLATES (Beginner-Friendly)
  // ==========================================
  {
    id: 'product-list-by-price-desc',
    name: 'Product List by Price (High to Low)',
    category: 'Simple',
    description: 'Lists all items ordered by highest valuation first with price, condition, and status.',
    sql: `SELECT id, title, price, "listingType", condition, status
FROM "Listing"
WHERE price IS NOT NULL
ORDER BY price DESC
LIMIT 10;`,
  },
  {
    id: 'product-list-by-price-asc',
    name: 'Product List by Price (Budget Deals / Low to High)',
    category: 'Simple',
    description: 'Finds the most affordable budget items ordered from lowest price to highest.',
    sql: `SELECT id, title, price, "listingType", condition, "exchangeType"
FROM "Listing"
WHERE price IS NOT NULL AND status = 'ACTIVE'
ORDER BY price ASC
LIMIT 10;`,
  },
  {
    id: 'products-under-100',
    name: 'Products Under $100',
    category: 'Simple',
    description: 'Filters active marketplace items priced under or equal to $100.',
    sql: `SELECT title, price, condition, "listingType", status
FROM "Listing"
WHERE price <= 100 AND status = 'ACTIVE'
ORDER BY price DESC;`,
  },
  {
    id: 'tech-products-only',
    name: 'Tech & Hardware Gear Only',
    category: 'Simple',
    description: 'Filters listings where listingType is PRODUCT (headphones, keyboards, e-readers).',
    sql: `SELECT title, price, condition, status, "createdAt"
FROM "Listing"
WHERE "listingType" = 'PRODUCT' AND status = 'ACTIVE'
ORDER BY "createdAt" DESC
LIMIT 10;`,
  },
  {
    id: 'books-only',
    name: 'Books & Textbooks Catalog',
    category: 'Simple',
    description: 'Filters listings where listingType is BOOK (academic textbooks, manuals).',
    sql: `SELECT title, price, condition, status, "createdAt"
FROM "Listing"
WHERE "listingType" = 'BOOK' AND status = 'ACTIVE'
ORDER BY "createdAt" DESC
LIMIT 10;`,
  },
  {
    id: 'pure-barter-only',
    name: 'Pure Barters (Zero Cash Needed)',
    category: 'Simple',
    description: 'Finds item-for-item trade listings that require no cash payment.',
    sql: `SELECT id, title, condition, "barterWishlist"
FROM "Listing"
WHERE "exchangeType" = 'BARTER_ONLY' AND status = 'ACTIVE'
LIMIT 10;`,
  },
  {
    id: 'most-viewed-listings',
    name: 'Most Viewed / Trending Items',
    category: 'Simple',
    description: 'Ranks listings by popularity and impression views.',
    sql: `SELECT title, price, "viewsCount", condition, "exchangeType"
FROM "Listing"
ORDER BY "viewsCount" DESC
LIMIT 10;`,
  },
  {
    id: 'users-by-reputation',
    name: 'User List by Reputation Score',
    category: 'Simple',
    description: 'Lists registered community traders ordered by their dual-sided reputation rating.',
    sql: `SELECT name, email, city, "reputationScore", "totalTrades", "isVerified"
FROM "User"
ORDER BY "reputationScore" DESC
LIMIT 10;`,
  },
  {
    id: 'quick-counts',
    name: 'Total Platform Counts (Simple Summary)',
    category: 'Simple',
    description: 'One-shot count of total users, listings, barter proposals, and cash offers.',
    sql: `SELECT 
  (SELECT COUNT(*) FROM "User") AS total_users,
  (SELECT COUNT(*) FROM "Listing") AS total_listings,
  (SELECT COUNT(*) FROM "BarterProposal") AS total_barter_proposals,
  (SELECT COUNT(*) FROM "CashOffer") AS total_cash_offers;`,
  },

  // ==========================================
  // ADVANCED JOINS & ANALYTICS
  // ==========================================
  {
    id: 'active-listings',
    name: 'Active Listings & Seller Details (Join)',
    category: 'Joins & Swaps',
    description: 'Fetches active catalog listings joined with seller reputation, city location, and exchange mode.',
    sql: `SELECT 
  l.id, 
  l.title, 
  l.price, 
  l."listingType",
  l."exchangeType", 
  l.condition, 
  u.name AS seller_name, 
  u.city, 
  u."reputationScore"
FROM "Listing" l
JOIN "User" u ON l."userId" = u.id
WHERE l.status = 'ACTIVE'
ORDER BY l.price DESC NULLS LAST
LIMIT 10;`,
  },
  {
    id: 'barter-handshake-pins',
    name: 'Barter Proposals with 6-Digit Handshake PINs (Join)',
    category: 'Joins & Swaps',
    description: 'Inspects accepted barter agreements with their synchronized verification handshake PIN tokens.',
    sql: `SELECT 
  bp.id AS proposal_id,
  bp."exchangeCode" AS handshake_pin,
  init.name AS initiator_trader,
  rec.name AS recipient_trader,
  l.title AS target_item,
  bp."cashTopUp" AS cash_balance_adjustment,
  bp.status AS agreement_status,
  bp."createdAt"
FROM "BarterProposal" bp
JOIN "User" init ON bp."initiatorId" = init.id
JOIN "User" rec ON bp."recipientId" = rec.id
JOIN "Listing" l ON bp."targetListingId" = l.id
ORDER BY bp."createdAt" DESC
LIMIT 10;`,
  },
  {
    id: 'top-traders',
    name: 'Top Rated Traders & Reputation Metrics (Group By)',
    category: 'Analytics',
    description: 'Ranks community traders by dual-sided reputation rating, verified physical trades, and review counts.',
    sql: `SELECT 
  u.id, 
  u.name, 
  u.city, 
  u."isVerified",
  u."reputationScore", 
  u."totalTrades", 
  u."totalSales", 
  COUNT(r.id) AS verified_reviews
FROM "User" u
LEFT JOIN "Review" r ON r."targetId" = u.id
GROUP BY u.id, u.name, u.city, u."isVerified", u."reputationScore", u."totalTrades", u."totalSales"
ORDER BY u."reputationScore" DESC, u."totalTrades" DESC
LIMIT 10;`,
  },
  {
    id: 'negotiation-messages',
    name: 'In-Thread Negotiation Cards & Messages (Join)',
    category: 'Joins & Swaps',
    description: 'Audits bilateral conversation messages including embedded CASH_OFFER_CARD and BARTER_PROPOSAL_CARD metadata.',
    sql: `SELECT 
  m.id AS message_id, 
  c.id AS conversation_id, 
  s.name AS sender_name, 
  m."messageType", 
  m.content AS message_text, 
  m."isRead",
  m."createdAt"
FROM "Message" m
JOIN "Conversation" c ON m."conversationId" = c.id
JOIN "User" s ON m."senderId" = s.id
WHERE m."messageType" IN ('CASH_OFFER_CARD', 'BARTER_PROPOSAL_CARD', 'TEXT')
ORDER BY m."createdAt" DESC
LIMIT 10;`,
  },
  {
    id: 'textbooks-course-codes',
    name: 'Academic Textbooks by Subject & Course Code (Join)',
    category: 'Joins & Swaps',
    description: 'Queries textbooks with course codes, ISBN numbers, authors, and annotations.',
    sql: `SELECT 
  l.title AS book_title, 
  l.price, 
  bd.isbn, 
  bd.author, 
  bd."academicSubject", 
  bd."courseCode", 
  bd."hasAnnotations",
  u.name AS seller
FROM "Listing" l
JOIN "BookDetails" bd ON bd."listingId" = l.id
JOIN "User" u ON l."userId" = u.id
WHERE l.status = 'ACTIVE'
LIMIT 10;`,
  },
  {
    id: 'category-aggregation',
    name: 'Category Valuation & Inventory Aggregation (Group By)',
    category: 'Analytics',
    description: 'Computes inventory count, average valuation, and max price grouped by listing type and exchange mode.',
    sql: `SELECT 
  l."listingType", 
  l."exchangeType", 
  COUNT(*) AS total_items, 
  ROUND(AVG(COALESCE(l.price, 0))::numeric, 2) AS avg_valuation, 
  MAX(l.price) AS max_valuation
FROM "Listing" l
GROUP BY l."listingType", l."exchangeType"
ORDER BY total_items DESC;`,
  },
];

interface CustomSQLWorkbenchProps {
  curatedQueries: any[];
}

export default function CustomSQLWorkbench({ curatedQueries }: CustomSQLWorkbenchProps) {
  const [workbenchMode, setWorkbenchMode] = useState<'custom' | 'recipes'>('custom');
  const [queryText, setQueryText] = useState<string>(SQL_TEMPLATES[0].sql);
  const [activeTemplateId, setActiveTemplateId] = useState<string>(SQL_TEMPLATES[0].id);
  const [activeRecipeIndex, setActiveRecipeIndex] = useState<number>(0);
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<{
    columns: string[];
    rows: any[];
    rowCount: number;
    durationMs: number;
  } | null>(null);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [resultFormat, setResultFormat] = useState<'table' | 'json'>('table');
  const [copiedQuery, setCopiedQuery] = useState(false);

  // Template category filter
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'Simple' | 'Joins & Swaps' | 'Analytics'>('ALL');

  const filteredTemplates = SQL_TEMPLATES.filter((t) =>
    categoryFilter === 'ALL' ? true : t.category === categoryFilter
  );

  const handleSelectTemplate = (tmpl: SQLTemplateItem) => {
    setActiveTemplateId(tmpl.id);
    setQueryText(tmpl.sql);
    setExecutionResult(null);
    setExecutionError(null);
  };

  const handleLoadRecipeIntoEditor = (recipeSql: string) => {
    setQueryText(recipeSql);
    setActiveTemplateId('');
    setWorkbenchMode('custom');
    setExecutionResult(null);
    setExecutionError(null);
  };

  const handleRunQuery = async (queryToRun?: string) => {
    const q = (queryToRun !== undefined ? queryToRun : queryText).trim();
    if (!q) return;

    setExecuting(true);
    setExecutionError(null);

    try {
      const res = await fetch('/api/database/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });

      const data = await res.json();
      if (data.success) {
        setExecutionResult({
          columns: data.columns || [],
          rows: data.rows || [],
          rowCount: data.rowCount ?? (data.rows?.length || 0),
          durationMs: data.durationMs || 0,
        });
      } else {
        setExecutionError(data.error || 'SQL query execution failed.');
      }
    } catch (err: any) {
      setExecutionError(err?.message || 'Network error connecting to database query API.');
    } finally {
      setExecuting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(queryText);
    setCopiedQuery(true);
    setTimeout(() => setCopiedQuery(false), 2000);
  };

  const handleFormatSQL = () => {
    // Simple indentation cleaner for keywords
    const formatted = queryText
      .replace(/\s+/g, ' ')
      .replace(/\s*(SELECT|FROM|WHERE|JOIN|LEFT JOIN|RIGHT JOIN|GROUP BY|ORDER BY|HAVING|LIMIT)\s+/gi, '\n$1 ')
      .trim();
    setQueryText(formatted);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWorkbenchMode('custom')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              workbenchMode === 'custom'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>⚡ Custom SQL Query Studio (Editable)</span>
          </button>
          <button
            onClick={() => setWorkbenchMode('recipes')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              workbenchMode === 'recipes'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>📚 Curated Production Recipes ({curatedQueries.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-outline">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>PostgreSQL 16.2 • Port 5432</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: CUSTOM SQL QUERY STUDIO WITH EDITABLE TEMPLATES */}
      {/* ========================================================================= */}
      {workbenchMode === 'custom' && (
        <div className="space-y-6">
          {/* Editable Templates Palette */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-outline flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                Select Editable SQL Template:
              </span>
              <span className="text-[11px] text-primary font-semibold">
                Click any template to load into the editor and customize
              </span>
            </div>

            {/* Template Category Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'ALL', label: `All (${SQL_TEMPLATES.length})` },
                { id: 'Simple', label: `⭐ Simple Queries (${SQL_TEMPLATES.filter((t) => t.category === 'Simple').length})` },
                { id: 'Joins & Swaps', label: `🔄 Multi-Table Joins (${SQL_TEMPLATES.filter((t) => t.category === 'Joins & Swaps').length})` },
                { id: 'Analytics', label: `📈 Analytics & Aggregations (${SQL_TEMPLATES.filter((t) => t.category === 'Analytics').length})` },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategoryFilter(c.id as any)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                    categoryFilter === c.id
                      ? 'bg-primary text-white shadow-2xs'
                      : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
              {filteredTemplates.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => handleSelectTemplate(tmpl)}
                  className={`p-2.5 rounded-xl text-left transition-all border ${
                    activeTemplateId === tmpl.id
                      ? 'bg-primary-fixed/30 border-primary text-primary shadow-2xs ring-1 ring-primary/40'
                      : 'bg-surface-container-lowest hover:bg-surface-container-low border-outline-variant/30 text-on-surface'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs truncate block">{tmpl.name}</span>
                    <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-mono font-bold ${
                      tmpl.category === 'Simple' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : tmpl.category === 'Joins & Swaps'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-purple-100 text-purple-900'
                    }`}>
                      {tmpl.category}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-on-surface-variant truncate mt-0.5">{tmpl.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive SQL Code Editor */}
          <div className="rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
            {/* Editor Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-slate-800 text-indigo-300 font-mono text-[11px] font-bold">
                  SQL Editor (Read-Only Safety Guard Enabled)
                </span>
                <span className="text-slate-400 text-[11px] hidden md:inline">
                  Supports SELECT, JOIN, GROUP BY, aggregates, and subqueries
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleFormatSQL}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
                  title="Format SQL indentation"
                >
                  Format
                </button>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
                  title="Copy SQL to clipboard"
                >
                  {copiedQuery ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedQuery ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={() => setQueryText('')}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Clear editor"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleRunQuery()}
                  disabled={executing || !queryText.trim()}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-all"
                >
                  <Play className={`w-3.5 h-3.5 ${executing ? 'animate-spin' : ''}`} />
                  <span>{executing ? 'Executing Query...' : 'Execute SQL (PostgreSQL)'}</span>
                </button>
              </div>
            </div>

            {/* Monospaced Editable Textarea */}
            <div className="p-4 bg-slate-950 relative">
              <textarea
                value={queryText}
                onChange={(e) => {
                  setQueryText(e.target.value);
                  setActiveTemplateId('');
                }}
                rows={10}
                placeholder="Write or edit any PostgreSQL SELECT statement here..."
                className="w-full bg-transparent font-mono text-xs text-emerald-400 leading-relaxed focus:outline-none resize-y selection:bg-indigo-600 selection:text-white"
                spellCheck={false}
              />
            </div>

            <div className="px-5 py-2 bg-slate-900 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Shortcut: Click Execute SQL or tweak conditions above</span>
              <span>Tables: User, Listing, BookDetails, BarterProposal, CashOffer, Message</span>
            </div>
          </div>

          {/* Prompt card before execution */}
          {!executionResult && !executionError && !executing && (
            <div className="p-8 rounded-3xl bg-surface-container-low/60 border border-dashed border-outline-variant/40 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center mx-auto text-primary shadow-2xs">
                <Play className="w-6 h-6 ml-0.5 text-primary" />
              </div>
              <h4 className="text-sm font-bold text-on-surface">Ready to Execute Query</h4>
              <p className="text-xs text-outline max-w-md mx-auto">
                Select or edit any SQL query in the editor above, then click <strong className="text-emerald-600 font-bold">Execute SQL (PostgreSQL)</strong> to run the statement and display live database results.
              </p>
            </div>
          )}

          {/* Executing Spinner */}
          {executing && (
            <div className="p-10 rounded-3xl bg-surface-container-low/60 border border-outline-variant/30 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-on-surface">Executing query against PostgreSQL 16...</p>
            </div>
          )}

          {/* Execution Error Banner */}
          {executionError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-1">
              <div className="flex items-center gap-2 font-bold text-xs">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>PostgreSQL Execution Error</span>
              </div>
              <p className="text-xs font-mono pl-6 text-rose-800">{executionError}</p>
            </div>
          )}

          {/* Dynamic Execution Result Output */}
          {executionResult && !executionError && !executing && (
            <div className="p-5 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant/20">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-on-surface">
                      Live Result Set ({executionResult.rowCount} {executionResult.rowCount === 1 ? 'row' : 'rows'})
                    </h3>
                    <p className="text-[11px] text-outline font-mono">
                      Query executed in <strong className="text-primary">{executionResult.durationMs}ms</strong> on local PostgreSQL database
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-outline mr-1">View:</span>
                  <button
                    onClick={() => setResultFormat('table')}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      resultFormat === 'table'
                        ? 'bg-primary text-white'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    <TableIcon className="w-3 h-3" />
                    <span>Table View</span>
                  </button>
                  <button
                    onClick={() => setResultFormat('json')}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      resultFormat === 'json'
                        ? 'bg-primary text-white'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    <Code2 className="w-3 h-3" />
                    <span>Raw JSON</span>
                  </button>
                </div>
              </div>

              {/* Table View */}
              {resultFormat === 'table' && (
                <div className="overflow-x-auto rounded-2xl border border-outline-variant/20 shadow-2xs">
                  {executionResult.rows.length === 0 ? (
                    <div className="p-8 text-center text-outline text-xs">
                      No records matched the query criteria.
                    </div>
                  ) : (
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-surface-container border-b border-outline-variant/20 text-outline uppercase font-bold text-[10.5px]">
                        <tr>
                          {executionResult.columns.map((col) => (
                            <th key={col} className="p-3 whitespace-nowrap">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/10 text-on-surface">
                        {executionResult.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-surface-container-low/70 transition-colors">
                            {executionResult.columns.map((col) => {
                              const val = row[col];
                              let displayVal = val;
                              if (val === null || val === undefined) {
                                displayVal = <span className="text-outline italic">NULL</span>;
                              } else if (typeof val === 'boolean') {
                                displayVal = (
                                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${val ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                                    {val ? 'TRUE' : 'FALSE'}
                                  </span>
                                );
                              } else if (typeof val === 'object') {
                                displayVal = JSON.stringify(val);
                              }
                              return (
                                <td key={col} className="p-3 whitespace-nowrap text-on-surface">
                                  {displayVal}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* JSON View */}
              {resultFormat === 'json' && (
                <div className="rounded-2xl bg-slate-950 p-4 font-mono text-xs text-indigo-300 overflow-x-auto max-h-96">
                  <pre>{JSON.stringify(executionResult.rows, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: CURATED PRODUCTION RECIPES */}
      {/* ========================================================================= */}
      {workbenchMode === 'recipes' && (
        <div className="space-y-6">
          {/* Query Selector Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {curatedQueries.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setActiveRecipeIndex(idx)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  activeRecipeIndex === idx
                    ? 'bg-primary text-white border-primary shadow-xs'
                    : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant border-outline-variant/20'
                }`}
              >
                {q.title}
              </button>
            ))}
          </div>

          {/* Active Curated Query Card */}
          {curatedQueries[activeRecipeIndex] && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20">
                <div>
                  <h3 className="font-bold text-sm text-on-surface">
                    {curatedQueries[activeRecipeIndex].title}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {curatedQueries[activeRecipeIndex].description}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleLoadRecipeIntoEditor(curatedQueries[activeRecipeIndex].sql)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-white text-xs font-bold hover:bg-primary-container shadow-xs transition-all"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>✏️ Open & Edit in SQL Studio</span>
                  </button>
                </div>
              </div>

              {/* Code Block */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 text-slate-100 p-5 font-mono text-xs shadow-inner">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-slate-400 text-[11px]">
                  <span>PostgreSQL 16 Compatible Query</span>
                  <button
                    onClick={() => handleLoadRecipeIntoEditor(curatedQueries[activeRecipeIndex].sql)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
                  >
                    <Play className="w-3 h-3" />
                    <span>Run Query in Studio</span>
                  </button>
                </div>
                <pre className="overflow-x-auto whitespace-pre leading-relaxed text-indigo-200">
                  {curatedQueries[activeRecipeIndex].sql}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
