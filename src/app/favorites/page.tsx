'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  Sparkles, 
  TrendingDown, 
  Repeat, 
  ArrowRight, 
  Package, 
  GitCompare, 
  MapPin, 
  ShieldCheck, 
  Crown, 
  Zap, 
  SlidersHorizontal 
} from 'lucide-react';
import { ListingItem } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { useMarketplace } from '@/components/providers/marketplace-provider';

export default function FavoritesPage() {
  const { toggleFavorite, toggleCompare, compareIds } = useMarketplace();
  const [savedListings, setSavedListings] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PRICE_DROP' | 'BARTER'>('ALL');

  useEffect(() => {
    fetch('/api/favorites')
      .then((r) => (r.ok ? r.json() : { listings: [] }))
      .then((data) => {
        setSavedListings(data.listings || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (listing: ListingItem) => {
    toggleFavorite(listing);
    setSavedListings((prev) => prev.filter((item) => item.id !== listing.id));
  };

  const filtered = savedListings.filter((item) => {
    if (filter === 'PRICE_DROP') return item.previousPrice && item.price && item.previousPrice > item.price;
    if (filter === 'BARTER') return item.exchangeType !== 'CASH_ONLY';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant/30 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed text-primary text-[11px] font-bold mb-2">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Saved Watchlist</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Saved Listings & Barter Matches
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Track price drops, mutual barter matches, and compare book editions and hardware specs.
          </p>
        </div>

        <Link
          href="/listings"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-container text-white font-bold text-xs rounded-full shadow-lift transition-all self-start md:self-auto"
        >
          <span>Explore More Ads</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Mutual Match Alert Banner (from Stitch favorites_saved_listings) */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-primary/10 via-surface-container to-secondary/10 border border-primary/20 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base text-on-surface">Mutual Match Alert</span>
              <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-bold text-[10px]">
                Smart Recommendation
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-1 max-w-xl leading-relaxed">
              Traders in your area have posted listings with wishlists matching items in your inventory. Propose a swap to exchange without cash!
            </p>
          </div>
        </div>

        <Link
          href="/listings"
          className="shrink-0 px-4 py-2 rounded-full bg-surface-container-lowest text-primary font-bold text-xs shadow-sm hover:bg-primary-fixed transition-colors"
        >
          Review Recommendations →
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-surface-container-low rounded-2xl overflow-x-auto">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            filter === 'ALL'
              ? 'bg-primary text-white shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          All Saved ({savedListings.length})
        </button>
        <button
          onClick={() => setFilter('PRICE_DROP')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            filter === 'PRICE_DROP'
              ? 'bg-primary text-white shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <TrendingDown className="w-3.5 h-3.5 text-tertiary" />
          <span>Price Dropped</span>
        </button>
        <button
          onClick={() => setFilter('BARTER')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            filter === 'BARTER'
              ? 'bg-primary text-white shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <Repeat className="w-3.5 h-3.5 text-secondary" />
          <span>Open to Barter</span>
        </button>
      </div>

      {/* Saved Listings Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-80 bg-surface-container rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-8 space-y-3">
          <Heart className="w-12 h-12 text-outline/50 mx-auto" />
          <h3 className="font-bold text-lg text-on-surface">No saved items found</h3>
          <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
            Browse the catalog and click the heart icon on any listing to track price drops and receive swap alerts.
          </p>
          <Link
            href="/listings"
            className="inline-flex mt-3 px-5 py-2.5 rounded-full bg-primary text-white text-xs font-bold hover:bg-primary-container transition-all"
          >
            Explore Marketplace
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => {
            const compared = compareIds.includes(item.id);
            return (
              <article
                key={item.id}
                className="group bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-4 shadow-sm hover:shadow-lift hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
              >
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-surface-container-low">
                  <Link href={`/listings/${item.id}`} className="block h-full">
                    <img
                      src={item.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Overlays */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
                    {item.previousPrice && item.price && item.previousPrice > item.price && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary text-white text-[10px] font-bold shadow-sm">
                        <TrendingDown className="w-3 h-3" />
                        Price Drop
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-primary text-[10px] font-bold shadow-sm">
                      {item.exchangeType.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => toggleCompare(item.id)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center border shadow-sm backdrop-blur-md transition-all ${
                        compared ? 'bg-primary text-white border-primary' : 'bg-white/90 text-on-surface hover:bg-white'
                      }`}
                      title="Compare specs"
                    >
                      <GitCompare className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(item)}
                      className="w-8 h-8 rounded-full bg-clay text-white flex items-center justify-center shadow-sm hover:scale-110 transition-all"
                      title="Remove from watchlist"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </div>

                <div className="pt-4 flex flex-col flex-1">
                  <Link href={`/listings/${item.id}`}>
                    <h3 className="font-bold text-base text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                  </Link>

                  {item.barterWishlist && (
                    <p className="mt-2 text-xs text-primary font-medium line-clamp-1 flex items-center gap-1.5 bg-primary-fixed/30 px-2.5 py-1 rounded-lg">
                      <Repeat className="w-3.5 h-3.5 shrink-0 text-primary" />
                      <span className="truncate">Wants: {item.barterWishlist}</span>
                    </p>
                  )}

                  <div className="mt-auto pt-4 flex items-end justify-between">
                    <div>
                      <p className="text-lg font-extrabold text-on-surface">
                        {item.exchangeType === 'BARTER_ONLY' ? (
                          <span className="text-primary text-sm font-bold">Open to trade</span>
                        ) : (
                          formatPrice(item.price, item.currency)
                        )}
                      </p>
                      {item.previousPrice && (
                        <p className="text-xs text-outline line-through">{formatPrice(item.previousPrice)}</p>
                      )}
                    </div>
                    <p className="text-xs text-outline flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {item.city}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-outline-variant/30 flex items-center justify-between">
                    <Link href={`/listings/${item.id}`} className="text-xs font-bold text-primary hover:underline">
                      Make Swap Proposal →
                    </Link>
                    <span className="text-[11px] text-outline">{item.viewsCount} views</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
