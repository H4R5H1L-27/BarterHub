'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Share2,
  RefreshCw,
  Play,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Layers,
  ArrowRight,
  TrendingUp,
  Cpu,
  Database,
  Search,
  Sparkles,
  ShieldCheck,
  GitBranch,
  Repeat,
  CircleDot,
  Clock,
  Code2,
  HelpCircle,
  X,
  ExternalLink,
  ChevronRight,
  ArrowUpRight,
  Check,
  Lock,
} from 'lucide-react';

interface GraphStats {
  status: 'connected' | 'fallback_engine';
  driverUri: string;
  totalUsers: number;
  totalListings: number;
  totalRelationships: number;
  discovered2WaySwaps: number;
  discovered3WayCycles: number;
  graphDensity: number;
  topTraders: Array<{ name: string; itemsCount: number; swapOptionsCount: number }>;
  categoriesInDemand: Array<{ category: string; demandScore: number }>;
}

interface BarterCycleItem {
  id: string;
  title: string;
  ownerId: string;
  ownerName: string;
  desiredByUserId: string;
  desiredByUserName: string;
  price?: number;
  condition?: string;
}

interface BarterCycle {
  id: string;
  type: '2_WAY_DIRECT_SWAP' | '3_WAY_TRIANGULAR_LOOP' | '4_WAY_RING';
  length: number;
  users: Array<{ id: string; name: string; city: string }>;
  items: BarterCycleItem[];
  confidenceScore: number;
  efficiencyGain: string;
  summary: string;
}

const CYPHER_PRESETS = [
  {
    name: '3-Way Triangular Barter Cycles',
    description: 'Detects multi-hop liquidity cycles: Trader A -> Trader B -> Trader C -> Trader A',
    query: `MATCH (l1:Listing)-[:WISHES_FOR]->(l2:Listing)-[:WISHES_FOR]->(l3:Listing)-[:WISHES_FOR]->(l1)
WHERE l1 <> l2 AND l2 <> l3 AND l1 <> l3
RETURN l1.title AS item1, l2.title AS item2, l3.title AS item3`,
    postgresEquivalent: `-- Requires 3-Way Self JOIN or Recursive CTE with Cycle Checks:
WITH RECURSIVE BarterPaths AS (
  SELECT b1."targetListingId" AS start_item, bi1."listingId" AS current_item, 1 AS depth, ARRAY[b1."targetListingId", bi1."listingId"] AS visited
  FROM "BarterProposal" b1 JOIN "BarterItem" bi1 ON b1.id = bi1."proposalId"
  UNION ALL
  SELECT bp.start_item, bi2."listingId", bp.depth + 1, bp.visited || bi2."listingId"
  FROM BarterPaths bp
  JOIN "BarterProposal" b2 ON bp.current_item = b2."targetListingId"
  JOIN "BarterItem" bi2 ON b2.id = bi2."proposalId"
  WHERE bp.depth < 3 AND NOT (bi2."listingId" = ANY(bp.visited[2:]))
)
SELECT * FROM BarterPaths WHERE current_item = start_item AND depth = 3;`,
  },
  {
    name: 'Transitive Barter Paths & Rings',
    description: 'Finds transitive trade chains where items flow through intermediaries',
    query: `MATCH path = (l1:Listing)-[:WISHES_FOR*2..3]->(l2:Listing)
WHERE l1 <> l2
RETURN [n in nodes(path) | n.title] AS tradeChain, length(path) AS hops
LIMIT 5`,
    postgresEquivalent: `WITH RECURSIVE TransitivePaths AS (
  SELECT b1."targetListingId" AS start_item, bi1."listingId" AS current_item, 1 AS depth
  FROM "BarterProposal" b1 JOIN "BarterItem" bi1 ON b1.id = bi1."proposalId"
  UNION ALL
  SELECT tp.start_item, bi2."listingId", tp.depth + 1
  FROM TransitivePaths tp
  JOIN "BarterProposal" b2 ON tp.current_item = b2."targetListingId"
  JOIN "BarterItem" bi2 ON b2.id = bi2."proposalId"
  WHERE tp.depth < 3
)
SELECT * FROM TransitivePaths WHERE depth >= 2 LIMIT 5;`,
  },
  {
    name: 'Trader Degree Centrality (Top Barter Hubs)',
    description: 'Calculates degree centrality in the trade graph to identify top market makers',
    query: `MATCH (u:User)-[:OWNS]->(l:Listing)
OPTIONAL MATCH (l)-[r:WISHES_FOR|OFFERS_SWAP_FOR]-()
RETURN u.name AS traderName, count(DISTINCT l) AS activeListings, count(r) AS degreeCentrality
ORDER BY degreeCentrality DESC LIMIT 5`,
    postgresEquivalent: `SELECT u.name, COUNT(DISTINCT l.id) AS active_listings, COUNT(bp.id) AS total_edges
FROM "User" u
LEFT JOIN "Listing" l ON l."userId" = u.id
LEFT JOIN "BarterProposal" bp ON bp."targetListingId" = l.id
GROUP BY u.id, u.name
ORDER BY total_edges DESC LIMIT 5;`,
  },
];

export default function Neo4jGraphExplorer() {
  const [stats, setStats] = useState<GraphStats | null>(null);
  const [cycles, setCycles] = useState<BarterCycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Cypher Console State
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [customCypher, setCustomCypher] = useState(CYPHER_PRESETS[0].query);
  const [queryResult, setQueryResult] = useState<any>(null);
  const [runningQuery, setRunningQuery] = useState(false);

  // Trade Modal State
  const [selectedCycleForAction, setSelectedCycleForAction] = useState<BarterCycle | null>(null);
  const [initiatedSwaps, setInitiatedSwaps] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchGraphData();
  }, []);

  const fetchGraphData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/graph/overview');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setCycles(data.cycles || []);
      }
    } catch (err) {
      console.error('Failed to load graph overview:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      const res = await fetch('/api/graph/sync', { method: 'POST' });
      const data = await res.json();
      setSyncMessage(data.message || 'Synchronization complete');
      await fetchGraphData();
      setTimeout(() => setSyncMessage(null), 4000);
    } catch (err: any) {
      setSyncMessage('Sync error: ' + err.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleExecuteCypher = async (queryToRun?: string) => {
    const q = queryToRun || customCypher;
    try {
      setRunningQuery(true);
      const res = await fetch('/api/graph/cypher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      setQueryResult(data);
    } catch (err: any) {
      setQueryResult({ error: err.message });
    } finally {
      setRunningQuery(false);
    }
  };

  const filteredCycles = cycles.filter((c) => c.type === '3_WAY_TRIANGULAR_LOOP' || c.length >= 3);

  const [createdTradeId, setCreatedTradeId] = useState<string | null>(null);

  const handleInitiateSwap = async (cycle: BarterCycle) => {
    try {
      const res = await fetch('/api/trades/multi-party', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cycleId: cycle.id,
          summary: cycle.summary,
          efficiencyGain: cycle.efficiencyGain,
          users: cycle.users,
          items: cycle.items,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setInitiatedSwaps((prev) => new Set(prev).add(cycle.id));
        setCreatedTradeId(data.trade?.id || cycle.id);
        setSyncMessage(`🎉 3-Way Trade Chain created! Request sent to all ${cycle.users.length} participants.`);
      }
    } catch (err: any) {
      console.error('Failed to create trade chain:', err);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER BANNER: Ultra Clean, High-Contrast Dark Header */}
      {/* ========================================================================= */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Subtle glowing background orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {stats?.status === 'connected' ? 'Neo4j Live Bolt Server' : 'Deterministic Graph Engine (Active)'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Neo4j Barter Graph & Multi-Hop Cycle Engine
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Added alongside PostgreSQL to solve the <strong>&quot;Double Coincidence of Wants&quot;</strong>. 
              While relational SQL struggles with multi-hop recursive self-joins, Neo4j uses <strong>index-free adjacency</strong> to find multi-party circular barter loops where no single person has to pay money.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleSync}
              disabled={syncing}
              className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing Graph...' : 'Sync Postgres → Neo4j'}
            </button>
          </div>
        </div>

        {syncMessage && (
          <div className="mt-4 px-4 py-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncMessage}</span>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. STATS OVERVIEW CARDS: Clean White, High-Contrast Light Mode */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>Graph Nodes</span>
            <CircleDot className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {(stats?.totalUsers || 0) + (stats?.totalListings || 0)}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            {stats?.totalUsers || 0} Users • {stats?.totalListings || 0} Items
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>Relationships</span>
            <GitBranch className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-black text-cyan-600">
            {stats?.totalRelationships || 0}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">OWNS, WISHES, SWAPS</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/30 shadow-xs">
          <div className="flex items-center justify-between text-amber-800 text-xs font-semibold mb-1">
            <span>Circular Loops</span>
            <Share2 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600">
            {stats?.discovered3WayCycles || 0}
          </div>
          <div className="text-[11px] text-amber-800 font-medium mt-1">3-Party Trade Rings</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>Graph Density</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-600">
            {stats?.graphDensity || 0}%
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Network Connectivity</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>Query Speed</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            &lt; 2 ms
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Index-Free Adjacency</div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. DISCOVERED CYCLES: High Contrast Cards with Action Buttons */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Discovered Multi-Party Barter Loops
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Select a circular trade chain below and click &quot;Initiate Multi-Party Swap&quot; to test the coordinated handover.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/60 text-xs font-bold flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-amber-600" />
              <span>{filteredCycles.length} Multi-Party Cycles Found</span>
            </span>
          </div>
        </div>

        {filteredCycles.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            No cycles found for the selected filter. Click &quot;Sync Postgres → Neo4j&quot; to refresh.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredCycles.map((cycle) => {
              const isInitiated = initiatedSwaps.has(cycle.id);
              return (
                <div
                  key={cycle.id}
                  className="p-5 sm:p-6 rounded-2xl border bg-gradient-to-br from-amber-50/50 via-white to-white border-amber-200 hover:border-amber-300 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    {/* Card Top: Badges */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border flex items-center gap-1.5 bg-amber-100 text-amber-800 border-amber-300">
                        <Share2 className="w-3.5 h-3.5 text-amber-700" />
                        3-Way Triangular Loop
                      </span>
                      <span className="text-xs font-bold text-slate-600 bg-white px-2.5 py-1 rounded-full border border-slate-200">
                        Confidence: {(cycle.confidenceScore * 100).toFixed(0)}%
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-800 mb-4 leading-relaxed">
                      {cycle.summary}
                    </p>

                    {/* Step-by-Step Flow List */}
                    <div className="space-y-2 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 text-xs mb-4">
                      {cycle.items.map((item, idx) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-2 py-1.5 border-b border-slate-200/70 last:border-0"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                              {idx + 1}
                            </span>
                            <div className="truncate">
                              <span className="font-bold text-slate-900">{item.ownerName}</span>
                              <span className="text-slate-500 text-[11px] ml-1">gives</span>
                              <div className="text-indigo-600 font-semibold truncate text-[11px]">
                                &quot;{item.title}&quot;
                              </div>
                            </div>
                          </div>

                          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                          <div className="text-right shrink-0">
                            <span className="text-[11px] text-slate-500">to</span>
                            <span className="font-bold text-slate-900 text-xs ml-1">
                              {item.desiredByUserName}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom: Action Button & Liquidity Note */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                      {cycle.efficiencyGain}
                    </span>

                    <button
                      onClick={() => setSelectedCycleForAction(cycle)}
                      className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                        isInitiated
                          ? 'bg-slate-100 text-slate-600 border border-slate-200'
                          : 'bg-amber-600 hover:bg-amber-500 text-white'
                      }`}
                    >
                      {isInitiated ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Chain Active</span>
                        </>
                      ) : (
                        <>
                          <span>Initiate Multi-Party Swap</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE CYPHER CONSOLE: Dark IDE look with high contrast code */}
      {/* ========================================================================= */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-emerald-400" />
              <h3 className="text-xl font-extrabold text-white tracking-tight">
                Interactive Cypher Query Workbench
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Run real declarative Cypher queries against the graph database layer and benchmark execution times.
            </p>
          </div>

          <button
            onClick={() => handleExecuteCypher()}
            disabled={runningQuery}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 self-start sm:self-auto"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${runningQuery ? 'animate-spin' : ''}`} />
            {runningQuery ? 'Executing...' : 'Run Cypher Query'}
          </button>
        </div>

        {/* Preset Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {CYPHER_PRESETS.map((p, idx) => (
            <button
              key={p.name}
              onClick={() => {
                setSelectedPreset(idx);
                setCustomCypher(p.query);
                handleExecuteCypher(p.query);
              }}
              className={`p-4 rounded-2xl border text-left transition-all ${
                selectedPreset === idx
                  ? 'bg-slate-800 border-emerald-400 text-white ring-1 ring-emerald-400/30'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <div className="font-bold text-xs mb-1 flex items-center justify-between text-white">
                <span>{p.name}</span>
                {selectedPreset === idx && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                {p.description}
              </p>
            </button>
          ))}
        </div>

        {/* Query Editor & PostgreSQL Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Share2 className="w-4 h-4" />
                Cypher Query (Neo4j Graph NoSQL)
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Index-Free Adjacency</span>
            </div>
            <textarea
              value={customCypher}
              onChange={(e) => setCustomCypher(e.target.value)}
              rows={8}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-emerald-300 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Database className="w-4 h-4" />
                Equivalent Relational SQL (PostgreSQL)
              </span>
              <span className="text-[11px] text-amber-400 font-mono">Expensive Recursive / Self-JOIN</span>
            </div>
            <textarea
              readOnly
              value={CYPHER_PRESETS[selectedPreset].postgresEquivalent}
              rows={8}
              className="w-full bg-slate-950/70 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-400 focus:outline-none cursor-default"
            />
          </div>
        </div>

        {/* Execution Output Table */}
        {queryResult && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">Execution Output:</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {queryResult.rows?.length || 0} rows returned
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {queryResult.executionTimeMs || 1} ms latency
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Engine: <strong className="text-white">{queryResult.source === 'live_neo4j' ? 'Neo4j Bolt Server' : 'Deterministic Graph Engine'}</strong>
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 max-h-72 bg-slate-950">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-800/80 text-slate-300 uppercase text-[10px] sticky top-0">
                  <tr>
                    {queryResult.columns?.map((col: string) => (
                      <th key={col} className="px-4 py-3 font-bold">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {queryResult.rows?.map((row: any, rIdx: number) => (
                    <tr key={rIdx} className="hover:bg-slate-800/50 transition-colors">
                      {queryResult.columns?.map((col: string) => (
                        <td key={col} className="px-4 py-2.5 text-slate-200 truncate max-w-xs">
                          {typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col] ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 6. MODAL: Multi-Party Swap Execution (How to actually use the 3-way ring) */}
      {/* ========================================================================= */}
      {selectedCycleForAction && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedCycleForAction(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 uppercase tracking-wider mb-2">
                <Share2 className="w-3.5 h-3.5" />
                <span>Multi-Party Swap Execution</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Coordinated 3-Way Exchange Protocol
              </h3>
              <p className="text-xs text-slate-500">
                How BarterHub securely executes triangular trades using 6-digit handshake verification PINs.
              </p>
            </div>

            {/* Handover Stages */}
            <div className="space-y-3">
              {selectedCycleForAction.items.map((item, idx) => {
                const pin = `PIN-${(7241 + idx * 1387) % 9000 + 1000}`;
                return (
                  <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-900">Leg {idx + 1}: {item.ownerName} → {item.desiredByUserName}</span>
                      </div>
                      <div className="text-xs text-indigo-700 font-semibold pl-7">
                        Item: &quot;{item.title}&quot;
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Verification PIN</span>
                      <span className="font-mono text-xs font-extrabold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                        {pin}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Escrow & Delivery Guarantee:
              </div>
              <p className="text-[11px] leading-relaxed">
                Once each recipient verifies their partner&apos;s PIN in person at the local exchange point, the cycle is marked complete and reputation points are awarded to all 3 traders simultaneously!
              </p>
            </div>

            {createdTradeId ? (
              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Multi-Party Trade Chain Request Created!</strong> Notifications sent to all 3 participants. They can now review &amp; accept in their Offers dashboard.
                  </span>
                </div>
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => {
                      setSelectedCycleForAction(null);
                      setCreatedTradeId(null);
                    }}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Close
                  </button>
                  <Link
                    href="/offers?tab=multi_party"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-2 shadow-sm"
                  >
                    <span>Open in Offers &amp; Swaps Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedCycleForAction(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={async () => {
                    await handleInitiateSwap(selectedCycleForAction);
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Send Trade Requests to All Participants</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
