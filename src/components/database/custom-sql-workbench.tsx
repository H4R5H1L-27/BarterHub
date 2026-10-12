'use client';

import React, { useState } from 'react';
import {
  Terminal,
  Play,
  Copy,
  Check,
  RotateCcw,
  Trash2,
  Sparkles,
  AlertCircle,
  Table as TableIcon,
  Code2,
  Database,
  Layers,
  BookOpen,
  ArrowRight,
  Filter,
} from 'lucide-react';

export interface SQLTemplateItem {
  id: string;
  name: string;
  category: 'Simple' | 'Joins' | 'Analytics';
  sql: string;
}

export interface TableMeta {
  name: string;
  label: string;
  hasCreatedAt: boolean;
}

const ALL_TABLES_COUNT_SQL = `SELECT 'User' AS "Table Name", COUNT(*) AS "Record Count" FROM "User"
UNION ALL SELECT 'Listing', COUNT(*) FROM "Listing"
UNION ALL SELECT 'BookDetails', COUNT(*) FROM "BookDetails"
UNION ALL SELECT 'ProductDetails', COUNT(*) FROM "ProductDetails"
UNION ALL SELECT 'BarterProposal', COUNT(*) FROM "BarterProposal"
UNION ALL SELECT 'BarterItem', COUNT(*) FROM "BarterItem"
UNION ALL SELECT 'CashOffer', COUNT(*) FROM "CashOffer"
UNION ALL SELECT 'Conversation', COUNT(*) FROM "Conversation"
UNION ALL SELECT 'Message', COUNT(*) FROM "Message"
UNION ALL SELECT 'Review', COUNT(*) FROM "Review"
UNION ALL SELECT 'SavedListing', COUNT(*) FROM "SavedListing"
UNION ALL SELECT 'Notification', COUNT(*) FROM "Notification"
UNION ALL SELECT 'Report', COUNT(*) FROM "Report"
ORDER BY "Record Count" DESC;`;

const DB_TABLES: TableMeta[] = [
  { name: 'User', label: 'Users & Profiles', hasCreatedAt: true },
  { name: 'Listing', label: 'Items & Books', hasCreatedAt: true },
  { name: 'BookDetails', label: 'Book Metadata & ISBN', hasCreatedAt: false },
  { name: 'ProductDetails', label: 'Electronics & Specs', hasCreatedAt: false },
  { name: 'BarterProposal', label: 'Trade Proposals & PINs', hasCreatedAt: true },
  { name: 'BarterItem', label: 'Items Offered in Trade', hasCreatedAt: false },
  { name: 'CashOffer', label: 'Cash Offers & Bids', hasCreatedAt: true },
  { name: 'Conversation', label: 'Chat Conversations', hasCreatedAt: true },
  { name: 'Message', label: 'Messages & Cards', hasCreatedAt: true },
  { name: 'Review', label: 'Ratings & Reviews', hasCreatedAt: true },
  { name: 'SavedListing', label: 'Saved Wishlists', hasCreatedAt: true },
  { name: 'Notification', label: 'Alerts & Notifications', hasCreatedAt: true },
  { name: 'Report', label: 'Safety Reports', hasCreatedAt: true },
];

export const SQL_TEMPLATES: SQLTemplateItem[] = [
  {
    id: 'all-tables-summary',
    name: 'All Tables Record Counts',
    category: 'Simple',
    sql: ALL_TABLES_COUNT_SQL,
  },
  {
    id: 'product-price-high',
    name: 'Products by Price (High to Low)',
    category: 'Simple',
    sql: `SELECT id, title, price, "listingType", condition, status
FROM "Listing"
WHERE price IS NOT NULL
ORDER BY price DESC
LIMIT 15;`,
  },
  {
    id: 'budget-deals',
    name: 'Budget Items (< $100)',
    category: 'Simple',
    sql: `SELECT title, price, condition, "listingType", status
FROM "Listing"
WHERE price <= 100 AND status = 'ACTIVE'
ORDER BY price DESC
LIMIT 15;`,
  },
  {
    id: 'tech-gear-only',
    name: 'Tech & Hardware Gear Only',
    category: 'Simple',
    sql: `SELECT title, price, condition, status, "createdAt"
FROM "Listing"
WHERE "listingType" = 'PRODUCT' AND status = 'ACTIVE'
ORDER BY "createdAt" DESC
LIMIT 15;`,
  },
  {
    id: 'books-only',
    name: 'Books & Textbooks Catalog',
    category: 'Simple',
    sql: `SELECT title, price, condition, status, "createdAt"
FROM "Listing"
WHERE "listingType" = 'BOOK' AND status = 'ACTIVE'
ORDER BY "createdAt" DESC
LIMIT 15;`,
  },
  {
    id: 'pure-barter-only',
    name: 'Pure Barters (Cashless Trades)',
    category: 'Simple',
    sql: `SELECT id, title, condition, "barterWishlist"
FROM "Listing"
WHERE "exchangeType" = 'BARTER_ONLY' AND status = 'ACTIVE'
LIMIT 15;`,
  },
  {
    id: 'most-viewed',
    name: 'Most Viewed Items',
    category: 'Simple',
    sql: `SELECT title, price, "viewsCount", condition, "exchangeType"
FROM "Listing"
ORDER BY "viewsCount" DESC
LIMIT 15;`,
  },
  {
    id: 'users-reputation',
    name: 'Users by Reputation Score',
    category: 'Simple',
    sql: `SELECT name, email, city, "reputationScore", "totalTrades", "isVerified"
FROM "User"
ORDER BY "reputationScore" DESC
LIMIT 15;`,
  },
  {
    id: 'active-listings-sellers',
    name: 'Active Listings & Sellers (Join)',
    category: 'Joins',
    sql: `SELECT 
  l.title, 
  l.price, 
  l."listingType",
  l."exchangeType", 
  u.name AS seller, 
  u.city, 
  u."reputationScore"
FROM "Listing" l
JOIN "User" u ON l."userId" = u.id
WHERE l.status = 'ACTIVE'
ORDER BY l.price DESC NULLS LAST
LIMIT 15;`,
  },
  {
    id: 'barter-proposals-pins',
    name: 'Barter Proposals & Handshake PINs (Join)',
    category: 'Joins',
    sql: `SELECT 
  bp.id,
  bp."exchangeCode" AS handshake_pin,
  init.name AS initiator,
  rec.name AS recipient,
  l.title AS target_item,
  bp."cashTopUp" AS cash_top_up,
  bp.status
FROM "BarterProposal" bp
JOIN "User" init ON bp."initiatorId" = init.id
JOIN "User" rec ON bp."recipientId" = rec.id
JOIN "Listing" l ON bp."targetListingId" = l.id
ORDER BY bp."createdAt" DESC
LIMIT 15;`,
  },
  {
    id: 'cash-offers-buyers',
    name: 'Cash Offers with Buyers (Join)',
    category: 'Joins',
    sql: `SELECT 
  co.id,
  co."offerAmount",
  co.status,
  buyer.name AS buyer_name,
  seller.name AS seller_name,
  l.title AS listing_title
FROM "CashOffer" co
JOIN "User" buyer ON co."buyerId" = buyer.id
JOIN "User" seller ON co."sellerId" = seller.id
JOIN "Listing" l ON co."listingId" = l.id
ORDER BY co."createdAt" DESC
LIMIT 15;`,
  },
  {
    id: 'top-traders-reviews',
    name: 'Top Traders & Reviews (Group By)',
    category: 'Analytics',
    sql: `SELECT 
  u.name, 
  u.city, 
  u."reputationScore", 
  u."totalTrades", 
  COUNT(r.id) AS verified_reviews
FROM "User" u
LEFT JOIN "Review" r ON r."targetId" = u.id
GROUP BY u.id, u.name, u.city, u."reputationScore", u."totalTrades"
ORDER BY u."reputationScore" DESC, u."totalTrades" DESC
LIMIT 15;`,
  },
  {
    id: 'category-valuation-breakdown',
    name: 'Valuation by Category (Group By)',
    category: 'Analytics',
    sql: `SELECT 
  l."listingType", 
  l."exchangeType", 
  COUNT(*) AS total_items, 
  ROUND(AVG(COALESCE(l.price, 0))::numeric, 2) AS avg_price, 
  MAX(l.price) AS max_price
FROM "Listing" l
GROUP BY l."listingType", l."exchangeType"
ORDER BY total_items DESC;`,
  },
];

interface CustomSQLWorkbenchProps {
  curatedQueries?: any[];
}

export default function CustomSQLWorkbench({ curatedQueries = [] }: CustomSQLWorkbenchProps) {
  // Left sidebar tab: 'tables' | 'queries' | 'recipes'
  const [sidebarTab, setSidebarTab] = useState<'tables' | 'queries' | 'recipes'>('tables');
  
  // SQL text state
  const [queryText, setQueryText] = useState<string>(ALL_TABLES_COUNT_SQL);
  const [activeItemId, setActiveItemId] = useState<string>('all-tables-summary');
  
  // Execution state
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

  // Template filter
  const [queryCategory, setQueryCategory] = useState<'All' | 'Simple' | 'Joins' | 'Analytics'>('All');

  const filteredTemplates = SQL_TEMPLATES.filter((t) =>
    queryCategory === 'All' ? true : t.category === queryCategory
  );

  // Run a query immediately
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

  // Click on a table: load SELECT * and auto-run
  const handleSelectTable = (table: TableMeta) => {
    setActiveItemId(table.name);
    const sql = table.hasCreatedAt
      ? `SELECT * FROM "${table.name}" ORDER BY "createdAt" DESC LIMIT 50;`
      : `SELECT * FROM "${table.name}" LIMIT 50;`;
    setQueryText(sql);
    handleRunQuery(sql);
  };

  // Click "All Tables Record Counts"
  const handleSelectAllTablesCount = () => {
    setActiveItemId('all-tables-summary');
    setQueryText(ALL_TABLES_COUNT_SQL);
    handleRunQuery(ALL_TABLES_COUNT_SQL);
  };

  // Click on a template
  const handleSelectTemplate = (tmpl: SQLTemplateItem) => {
    setActiveItemId(tmpl.id);
    setQueryText(tmpl.sql);
    handleRunQuery(tmpl.sql);
  };

  // Click on a curated recipe
  const handleSelectRecipe = (recipe: any) => {
    setActiveItemId(recipe.id || recipe.title);
    setQueryText(recipe.sql);
    handleRunQuery(recipe.sql);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(queryText);
    setCopiedQuery(true);
    setTimeout(() => setCopiedQuery(false), 2000);
  };

  const handleFormatSQL = () => {
    const formatted = queryText
      .replace(/\s+/g, ' ')
      .replace(/\s*(SELECT|FROM|WHERE|JOIN|LEFT JOIN|RIGHT JOIN|GROUP BY|ORDER BY|HAVING|LIMIT|UNION ALL)\s+/gi, '\n$1 ')
      .trim();
    setQueryText(formatted);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* ========================================================================= */}
      {/* LEFT COLUMN: TABLES & PRE-MADE OPTIONS (WIDTH: 320px) */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-80 shrink-0 space-y-4">
        {/* Sidebar Nav Tabs */}
        <div className="flex items-center p-1 bg-surface-container-low rounded-2xl border border-outline-variant/30 text-xs font-bold">
          <button
            onClick={() => setSidebarTab('tables')}
            className={`flex-1 py-1.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              sidebarTab === 'tables'
                ? 'bg-primary text-white shadow-2xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Tables ({DB_TABLES.length})</span>
          </button>

          <button
            onClick={() => setSidebarTab('queries')}
            className={`flex-1 py-1.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              sidebarTab === 'queries'
                ? 'bg-primary text-white shadow-2xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Queries ({SQL_TEMPLATES.length})</span>
          </button>

          {curatedQueries.length > 0 && (
            <button
              onClick={() => setSidebarTab('recipes')}
              className={`py-1.5 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                sidebarTab === 'recipes'
                  ? 'bg-primary text-white shadow-2xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Recipes</span>
            </button>
          )}
        </div>

        {/* TAB 1: BROWSE TABLES & ALL TABLE RECORDS */}
        {sidebarTab === 'tables' && (
          <div className="space-y-3">
            {/* Direct Option to View All Stored Records Across All Tables */}
            <button
              onClick={handleSelectAllTablesCount}
              className={`w-full p-3 rounded-2xl text-left transition-all border flex items-center justify-between ${
                activeItemId === 'all-tables-summary'
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/30'
                  : 'bg-emerald-50/50 hover:bg-emerald-100/60 border-emerald-200/80 text-emerald-900'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Layers className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-extrabold text-xs tracking-tight truncate">
                    📊 View All Tables Record Counts
                  </div>
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-300 font-medium truncate">
                    Live row count for every database table
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />
            </button>

            {/* Individual Table List */}
            <div className="p-2.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-1">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-outline flex items-center justify-between">
                <span>Select Table to View Records</span>
                <span className="font-mono text-[9px]">Limit 50</span>
              </div>

              <div className="space-y-0.5 max-h-[480px] overflow-y-auto pr-1">
                {DB_TABLES.map((table) => {
                  const isSelected = activeItemId === table.name;
                  return (
                    <button
                      key={table.name}
                      onClick={() => handleSelectTable(table)}
                      className={`w-full px-3 py-2 rounded-xl text-left text-xs transition-all flex items-center justify-between group ${
                        isSelected
                          ? 'bg-primary text-white font-bold shadow-2xs'
                          : 'hover:bg-surface-container text-on-surface'
                      }`}
                    >
                      <div className="min-w-0 flex items-center gap-2">
                        <TableIcon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-outline'}`} />
                        <span className="font-mono font-semibold truncate text-[11.5px]">{table.name}</span>
                      </div>
                      <span className={`text-[10.5px] truncate ml-2 font-normal ${isSelected ? 'text-white/80' : 'text-on-surface-variant'}`}>
                        {table.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRE-MADE QUERIES (SIMPLIFIED TEXT) */}
        {sidebarTab === 'queries' && (
          <div className="space-y-3">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 flex-wrap">
              {(['All', 'Simple', 'Joins', 'Analytics'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setQueryCategory(cat)}
                  className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold transition-all ${
                    queryCategory === cat
                      ? 'bg-primary text-white shadow-2xs'
                      : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Streamlined Query List */}
            <div className="p-2 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-1 max-h-[500px] overflow-y-auto pr-1">
              {filteredTemplates.map((tmpl) => {
                const isSelected = activeItemId === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    onClick={() => handleSelectTemplate(tmpl)}
                    className={`w-full p-2.5 rounded-xl text-left text-xs transition-all border ${
                      isSelected
                        ? 'bg-primary-fixed/40 border-primary text-primary font-bold shadow-2xs'
                        : 'bg-surface-container-lowest hover:bg-surface-container border-outline-variant/20 text-on-surface'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-xs truncate">{tmpl.name}</span>
                      <span
                        className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-mono font-bold shrink-0 ${
                          tmpl.category === 'Simple'
                            ? 'bg-emerald-100 text-emerald-800'
                            : tmpl.category === 'Joins'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-purple-100 text-purple-900'
                        }`}
                      >
                        {tmpl.category}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: CURATED RECIPES */}
        {sidebarTab === 'recipes' && (
          <div className="p-2 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-1 max-h-[500px] overflow-y-auto pr-1">
            {curatedQueries.map((recipe, idx) => {
              const isSelected = activeItemId === (recipe.id || recipe.title);
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectRecipe(recipe)}
                  className={`w-full p-2.5 rounded-xl text-left text-xs transition-all border ${
                    isSelected
                      ? 'bg-primary-fixed/40 border-primary text-primary font-bold shadow-2xs'
                      : 'bg-surface-container-lowest hover:bg-surface-container border-outline-variant/20 text-on-surface'
                  }`}
                >
                  <div className="font-bold text-xs truncate">{recipe.title}</div>
                  <div className="text-[10.5px] text-on-surface-variant truncate mt-0.5">
                    {recipe.description}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* RIGHT COLUMN: SQL EDITOR (TOP) & RESULTS TABLE (BELOW) */}
      {/* ========================================================================= */}
      <div className="flex-1 min-w-0 w-full space-y-6">
        {/* TOP: SQL EDITOR */}
        <div className="rounded-3xl bg-slate-950 border border-slate-800 shadow-xl overflow-hidden">
          {/* Editor Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 px-4 py-3 border-b border-slate-800/80 bg-slate-900/60 text-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-mono font-bold text-indigo-300 text-xs">
                PostgreSQL 16 Editor
              </span>
              <span className="text-slate-400 text-[11px] hidden sm:inline">
                • Read-only (SELECT / WITH)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleFormatSQL}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                title="Format SQL indentation"
              >
                Format
              </button>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
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
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-all"
              >
                <Play className={`w-3.5 h-3.5 ${executing ? 'animate-spin' : ''}`} />
                <span>{executing ? 'Running...' : 'Run Query'}</span>
              </button>
            </div>
          </div>

          {/* Editor Textarea */}
          <div className="p-4 bg-slate-950">
            <textarea
              value={queryText}
              onChange={(e) => {
                setQueryText(e.target.value);
                setActiveItemId('');
              }}
              rows={7}
              placeholder="Write or edit any PostgreSQL SELECT statement here..."
              className="w-full bg-transparent font-mono text-xs text-emerald-400 leading-relaxed focus:outline-none resize-y selection:bg-indigo-600 selection:text-white"
              spellCheck={false}
            />
          </div>

          <div className="px-4 py-2 bg-slate-900/40 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Click any table or query on the left to run immediately</span>
            <span className="hidden sm:inline">Port 5432 • Local DB</span>
          </div>
        </div>

        {/* BELOW: EXECUTION RESULTS & DATA GRID */}
        <div>
          {/* Initial Ready State */}
          {!executionResult && !executionError && !executing && (
            <div className="p-8 rounded-3xl bg-surface-container-low/60 border border-dashed border-outline-variant/40 text-center space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-surface-container flex items-center justify-center mx-auto text-primary shadow-2xs">
                <Play className="w-5 h-5 ml-0.5 text-primary" />
              </div>
              <h4 className="text-sm font-bold text-on-surface">Ready to Execute Query</h4>
              <p className="text-xs text-outline max-w-sm mx-auto">
                Click a table on the left, choose a pre-made query, or edit your SQL above and click <strong className="text-emerald-600 font-semibold">Run Query</strong>.
              </p>
            </div>
          )}

          {/* Running Spinner */}
          {executing && (
            <div className="p-10 rounded-3xl bg-surface-container-low/60 border border-outline-variant/30 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-on-surface">Executing query against PostgreSQL 16...</p>
            </div>
          )}

          {/* Error Banner */}
          {executionError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-1">
              <div className="flex items-center gap-2 font-bold text-xs">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>PostgreSQL Execution Error</span>
              </div>
              <p className="text-xs font-mono pl-6 text-rose-800">{executionError}</p>
            </div>
          )}

          {/* Result Data Grid */}
          {executionResult && !executionError && !executing && (
            <div className="p-5 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant/20">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-on-surface">
                      Result: {executionResult.rowCount} {executionResult.rowCount === 1 ? 'record' : 'records'}
                    </h3>
                    <p className="text-[11px] text-outline font-mono">
                      Completed in <strong className="text-primary">{executionResult.durationMs}ms</strong>
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

              {/* Table Data View */}
              {resultFormat === 'table' && (
                <div className="overflow-x-auto rounded-2xl border border-outline-variant/20 shadow-2xs max-h-[500px] overflow-y-auto">
                  {executionResult.rows.length === 0 ? (
                    <div className="p-8 text-center text-outline text-xs">
                      No records found in this table or query.
                    </div>
                  ) : (
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-surface-container border-b border-outline-variant/20 text-outline uppercase font-bold text-[10.5px] sticky top-0 z-10">
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
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                      val ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                    }`}
                                  >
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

              {/* JSON Data View */}
              {resultFormat === 'json' && (
                <div className="rounded-2xl bg-slate-950 p-4 font-mono text-xs text-indigo-300 overflow-x-auto max-h-[500px]">
                  <pre>{JSON.stringify(executionResult.rows, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
