'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ListingItem } from '@/lib/types';

const COMPARE_KEY = 'bh_compare';
const SEARCH_KEY = 'bh_recent_searches';
const CITY_KEY = 'bh_city';

type MarketplaceContextValue = {
  city: string;
  setCity: (city: string) => void;
  compareIds: string[];
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  recentSearches: string[];
  rememberSearch: (q: string) => void;
  favorites: Set<string>;
  toggleFavorite: (listing: ListingItem) => Promise<void>;
};

const MarketplaceContext = createContext<MarketplaceContextValue | null>(null);

export function MarketplaceProvider({ children }: { children: React.ReactNode }) {
  const [city, setCityState] = useState('All India');
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      setCityState(localStorage.getItem(CITY_KEY) || 'All India');
      setCompareIds(JSON.parse(localStorage.getItem(COMPARE_KEY) || '[]'));
      setRecentSearches(JSON.parse(localStorage.getItem(SEARCH_KEY) || '[]'));
    } catch {
      /* ignore */
    }
    fetch('/api/favorites')
      .then((r) => r.json())
      .then((data) => {
        const ids = (data.listings || []).map((l: ListingItem) => l.id);
        setFavorites(new Set(ids));
      })
      .catch(() => {});
  }, []);

  const setCity = (next: string) => {
    setCityState(next);
    localStorage.setItem(CITY_KEY, next);
  };

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((x) => x !== id) : prev.length >= 3 ? prev : [...prev, id];
      localStorage.setItem(COMPARE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const clearCompare = () => {
    setCompareIds([]);
    localStorage.setItem(COMPARE_KEY, '[]');
  };

  const rememberSearch = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const next = [trimmed, ...prev.filter((x) => x.toLowerCase() !== trimmed.toLowerCase())].slice(0, 8);
      localStorage.setItem(SEARCH_KEY, JSON.stringify(next));
      return next;
    });
  };

  const toggleFavorite = async (listing: ListingItem) => {
    const saved = favorites.has(listing.id);
    setFavorites((prev) => {
      const next = new Set(prev);
      if (saved) next.delete(listing.id);
      else next.add(listing.id);
      return next;
    });
    try {
      if (saved) {
        await fetch(`/api/favorites?listingId=${listing.id}`, { method: 'DELETE' });
      } else {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ listingId: listing.id }),
        });
      }
    } catch {
      setFavorites((prev) => {
        const next = new Set(prev);
        if (saved) next.add(listing.id);
        else next.delete(listing.id);
        return next;
      });
    }
  };

  const value = useMemo(
    () => ({
      city,
      setCity,
      compareIds,
      toggleCompare,
      clearCompare,
      recentSearches,
      rememberSearch,
      favorites,
      toggleFavorite,
    }),
    [city, compareIds, recentSearches, favorites]
  );

  return <MarketplaceContext.Provider value={value}>{children}</MarketplaceContext.Provider>;
}

export function useMarketplace() {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) throw new Error('useMarketplace must be used within MarketplaceProvider');
  return ctx;
}
