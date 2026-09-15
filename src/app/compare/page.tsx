'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ListingItem } from '@/lib/types';
import { 
  GitCompare, 
  ArrowLeft, 
  Check, 
  X, 
  Repeat, 
  DollarSign, 
  MapPin, 
  ShieldCheck, 
  ArrowRight 
} from 'lucide-react';

function CompareContent() {
  const searchParams = useSearchParams();
  const idsParam = searchParams.get('ids') || '';
  const ids = idsParam.split(',').filter(Boolean);

  const [listings, setListings] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ids.length === 0) {
      setLoading(false);
      return;
    }

    Promise.all(
      ids.map((id) =>
        fetch(`/api/listings/${id}`)
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => data?.listing || null)
          .catch(() => null)
      )
    ).then((results) => {
      setListings(results.filter(Boolean) as ListingItem[]);
      setLoading(false);
    });
  }, [idsParam]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs font-semibold text-on-surface-variant">Loading item comparison matrix...</p>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-surface-container-high text-primary flex items-center justify-center mx-auto shadow-sm">
          <GitCompare className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-on-surface">No Items Selected to Compare</h1>
        <p className="text-xs text-on-surface-variant">
          Select up to 3 items from the catalog to compare their condition, market valuation, and barter terms side by side.
        </p>
        <div className="pt-2">
          <Link
            href="/listings"
            className="px-6 py-2.5 rounded-full bg-primary text-on-primary font-bold text-xs shadow-md hover:bg-primary-container transition-all inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary mb-1">
            <GitCompare className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Side-by-Side Analysis</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">Compare Listing Specifications</h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Evaluate fair exchange parity, physical condition, and meetup safety before offering a barter.
          </p>
        </div>

        <Link
          href="/listings"
          className="px-4 py-2 rounded-full bg-surface-container-lowest text-on-surface font-semibold text-xs border border-outline-variant/30 hover:bg-surface-container transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
        </Link>
      </div>

      {/* Comparison Grid Table */}
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/20 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/15">
                <th className="p-5 w-48 text-xs font-bold text-outline uppercase tracking-wider bg-surface-container-low/40">
                  Item Attribute
                </th>
                {listings.map((item) => (
                  <th key={item.id} className="p-5 min-w-[260px] max-w-[320px]">
                    <div className="space-y-3">
                      <div className="w-full h-40 rounded-2xl overflow-hidden bg-surface-container-low">
                        <img
                          src={item.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                          {item.listingType === 'BOOK' ? 'Book / Textbook' : 'Product & Gear'}
                        </span>
                        <h3 className="text-sm font-bold text-on-surface line-clamp-2 mt-0.5">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-xs text-on-surface">
              {/* Valuation / Asking Price */}
              <tr>
                <td className="p-4 font-bold text-on-surface-variant bg-surface-container-low/30">
                  Estimated Valuation
                </td>
                {listings.map((item) => (
                  <td key={item.id} className="p-4 font-bold text-tertiary text-sm">
                    {item.exchangeType === 'BARTER_ONLY' ? (
                      <span className="text-secondary font-semibold text-xs">Pure Barter (No Cash)</span>
                    ) : (
                      `$${item.price?.toFixed(2) || '0.00'}`
                    )}
                  </td>
                ))}
              </tr>

              {/* Exchange Mode */}
              <tr>
                <td className="p-4 font-bold text-on-surface-variant bg-surface-container-low/30">
                  Exchange Mode
                </td>
                {listings.map((item) => (
                  <td key={item.id} className="p-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-xs font-semibold">
                      {item.exchangeType === 'BARTER_ONLY' && <Repeat className="w-3.5 h-3.5 text-secondary" />}
                      {item.exchangeType === 'HYBRID' && <Repeat className="w-3.5 h-3.5 text-primary" />}
                      {item.exchangeType === 'CASH_ONLY' && <DollarSign className="w-3.5 h-3.5 text-emerald-600" />}
                      {item.exchangeType.replace('_', ' ')}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Condition Grade */}
              <tr>
                <td className="p-4 font-bold text-on-surface-variant bg-surface-container-low/30">
                  Condition Grade
                </td>
                {listings.map((item) => (
                  <td key={item.id} className="p-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-bold text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {item.condition.replace('_', ' ')}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Barter Wishlist */}
              <tr>
                <td className="p-4 font-bold text-on-surface-variant bg-surface-container-low/30">
                  Owner Wishlist
                </td>
                {listings.map((item) => (
                  <td key={item.id} className="p-4 text-on-surface-variant">
                    {item.barterWishlist ? (
                      <p className="text-xs leading-relaxed">{item.barterWishlist}</p>
                    ) : (
                      <span className="text-outline italic">Open to all fair trade offers</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Location & Safe Meetup */}
              <tr>
                <td className="p-4 font-bold text-on-surface-variant bg-surface-container-low/30">
                  Safe Location
                </td>
                {listings.map((item) => (
                  <td key={item.id} className="p-4">
                    <div className="flex items-center gap-1.5 text-on-surface-variant">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{item.city}, {item.state}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Seller Name */}
              <tr>
                <td className="p-4 font-bold text-on-surface-variant bg-surface-container-low/30">
                  Trader Profile
                </td>
                {listings.map((item) => (
                  <td key={item.id} className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                        {item.user?.name?.[0] || 'T'}
                      </div>
                      <span className="font-semibold text-on-surface">{item.user?.name || 'Verified Trader'}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Action Buttons */}
              <tr>
                <td className="p-4 font-bold text-on-surface-variant bg-surface-container-low/30">
                  Direct Action
                </td>
                {listings.map((item) => (
                  <td key={item.id} className="p-4">
                    <Link
                      href={`/listings/${item.id}`}
                      className="w-full py-2.5 px-4 rounded-full bg-primary hover:bg-primary-container text-on-primary text-xs font-bold text-center inline-flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <span>View & Propose</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-xs">Loading comparison...</div>}>
      <CompareContent />
    </Suspense>
  );
}
