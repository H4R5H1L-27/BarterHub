'use client';

import React, { useState } from 'react';
import { Terminal, Database, ShieldCheck, Cpu, Copy, Check, Play, CheckCircle2, RefreshCw } from 'lucide-react';

export default function PostgreSQLJDBCViewer() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const codeSnippet = `// 1. Register PostgreSQL Driver
Class.forName("org.postgresql.Driver");

// 2. Establish Connection via DriverManager
Properties props = new Properties();
props.setProperty("user", "postgres");
props.setProperty("password", "password");
Connection conn = DriverManager.getConnection("jdbc:postgresql://localhost:5432/productexchange", props);

// 3. PreparedStatement with Parameter Binding (Anti-SQLi)
String sql = "SELECT * FROM \\"Listing\\" WHERE status = ? AND price <= ?";
try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
    pstmt.setString(1, "ACTIVE");
    pstmt.setDouble(2, 50.0);
    ResultSet rs = pstmt.executeQuery();
    while (rs.next()) {
        System.out.println(rs.getString("title") + " - $" + rs.getDouble("price"));
    }
}

// 4. ACID Multi-Statement Transaction with Atomic Rollback
conn.setAutoCommit(false);
try {
    // Pessimistic Row Lock
    PreparedStatement lock = conn.prepareStatement("SELECT * FROM \\"Listing\\" WHERE id = ? FOR UPDATE");
    lock.setString(1, listingId);
    lock.executeQuery();
    
    // Insert Proposal & Update Listing
    // ...
    conn.commit();
} catch (Exception e) {
    conn.rollback(); // Immediate Rollback on fault
} finally {
    conn.setAutoCommit(true);
}`;

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black">PostgreSQL Native JDBC Architecture</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">Enterprise Standard</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">Direct Java SE Database Connectivity via <code className="text-indigo-300 font-mono">DriverManager</code> & <code className="text-indigo-300 font-mono">PreparedStatement</code></p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Driver 42.7.4 (JDBC 4.2)
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          BarterHub utilizes official Type-4 PostgreSQL JDBC drivers (<code className="text-indigo-300">org.postgresql.Driver</code>) for low-overhead database transactions, parameterized queries, and ACID transactional boundaries with pessimistic row locking (<code className="text-indigo-300">FOR UPDATE</code>).
        </p>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800">
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">Driver Class</div>
            <div className="text-sm font-bold text-white font-mono mt-0.5">org.postgresql.Driver</div>
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">Connection Protocol</div>
            <div className="text-sm font-bold text-indigo-300 font-mono mt-0.5">DriverManager</div>
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">Transaction Isolation</div>
            <div className="text-sm font-bold text-white font-mono mt-0.5">READ_COMMITTED</div>
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">Concurrency Control</div>
            <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">SELECT ... FOR UPDATE</div>
          </div>
        </div>
      </div>

      {/* Runner Instructions & Code Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Terminal Run Commands */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">Run Standalone Java JDBC Module</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              The project includes a standalone Java JDBC CLI application located in <code className="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-700 font-mono text-[11px]">jdbc/</code>. You can compile and run it directly with npm scripts or PowerShell.
            </p>

            <div className="space-y-3">
              <div className="bg-slate-900 text-slate-200 rounded-xl p-3 text-xs font-mono">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Interactive Terminal Console:</div>
                <div className="text-emerald-400 flex items-center justify-between">
                  <span>npm run jdbc</span>
                  <button onClick={() => copyToClipboard('npm run jdbc', 'c1')} className="text-slate-400 hover:text-white">
                    {copied === 'c1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 text-slate-200 rounded-xl p-3 text-xs font-mono">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Automated 5-Phase JDBC Test Suite:</div>
                <div className="text-emerald-400 flex items-center justify-between">
                  <span>npm run jdbc:auto</span>
                  <button onClick={() => copyToClipboard('npm run jdbc:auto', 'c2')} className="text-slate-400 hover:text-white">
                    {copied === 'c2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Phase 1:</strong> Inspects PostgreSQL <code className="font-mono text-slate-800">DatabaseMetaData</code> (version, isolation).</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Phase 2:</strong> Parameterized <code className="font-mono text-slate-800">PreparedStatement</code> catalog querying.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Phase 3:</strong> SQL <code className="font-mono text-slate-800">JOIN</code> trader profile and reputation aggregation.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Phase 4:</strong> Analytical <code className="font-mono text-slate-800">GROUP BY</code> valuation distribution report.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Phase 5:</strong> Multi-statement ACID transaction with intentional simulated crash &amp; atomic rollback.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Java Code Snippet */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 text-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">Canonical Java JDBC Implementation</span>
              </div>
              <button onClick={() => copyToClipboard(codeSnippet, 'c3')} className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                {copied === 'c3' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied === 'c3' ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed max-h-96 pr-2">
              {codeSnippet}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
