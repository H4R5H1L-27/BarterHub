'use client';

import React from 'react';
import Link from 'next/link';
import { GitCompare, X, ArrowRight } from 'lucide-react';
import { useMarketplace } from './marketplace-provider';

export default function CompareTray() {
  const { compareIds, clearCompare, toggleCompare } = useMarketplace();
  if (compareIds.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[min(680px,calc(100%-2rem))] bg-inverse-surface/95 backdrop-blur-md text-inverse-on-surface rounded-full shadow-2xl px-5 py-3 flex items-center justify-between gap-4 ring-1 ring-white/10">
      <div className="flex items-center gap-2.5 text-xs font-semibold">
        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-on-primary">
          <GitCompare className="w-3.5 h-3.5" />
        </div>
        <span>Comparing {compareIds.length} of 3 listings</span>
      </div>
      
      <div className="flex items-center gap-2">
        {compareIds.map((id) => (
          <button
            key={id}
            onClick={() => toggleCompare(id)}
            className="text-[11px] px-2.5 py-1 rounded-full bg-surface-container-high/20 hover:bg-surface-container-high/40 text-inverse-on-surface flex items-center gap-1 transition-colors"
            aria-label="Remove from compare"
          >
            <span>Item #{id.slice(-4)}</span>
            <X className="w-3 h-3 text-white/60 hover:text-white" />
          </button>
        ))}

        <Link
          href={`/compare?ids=${compareIds.join(',')}`}
          className="px-4 py-1.5 rounded-full bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-sm transition-all flex items-center gap-1"
        >
          <span>Compare</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        
        <button 
          onClick={clearCompare} 
          className="text-xs text-inverse-on-surface/60 hover:text-inverse-on-surface px-2 py-1 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
