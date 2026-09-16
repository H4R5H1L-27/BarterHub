'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  BookOpen, 
  Package, 
  Repeat, 
  DollarSign, 
  X,
  ArrowUpDown
} from 'lucide-react';
import ListingCard from '@/components/marketplace/listing-card';
import { ListingItem, ListingType, ExchangeType, ItemCondition } from '@/lib/types';

function ListingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [listings, setListings] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [listingType, setListingType] = useState<string>(searchParams.get('type') || '');
  const [exchangeType, setExchangeType] = useState<string>(searchParams.get('exchange') || '');
  const [condition, setCondition] = useState<string>(searchParams.get('condition') || '');
  const [minPrice, setMinPrice] = useState<string>(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get('maxPrice') || '');
  const [city, setCity] = useState<string>(searchParams.get('city') || '');
  const [sort, setSort] = useState<string>(searchParams.get('sort') || 'newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [verified, setVerified] = useState(searchParams.get('verified') === '1');
  const [shipping, setShipping] = useState(searchParams.get('shipping') === '1');
  const [posted, setPosted] = useState(searchParams.get('posted') || '');
  const [featured, setFeatured] = useState(searchParams.get('featured') === '1');

  // Keep state in sync with URL searchParams (e.g. when navigating or clicking Navbar search/category buttons)
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
    setListingType(searchParams.get('type') || '');
    setExchangeType(searchParams.get('exchange') || '');
    setCondition(searchParams.get('condition') || '');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setCity(searchParams.get('city') || '');
    setSort(searchParams.get('sort') || 'newest');
    setVerified(searchParams.get('verified') === '1');
    setShipping(searchParams.get('shipping') === '1');
    setPosted(searchParams.get('posted') || '');
    setFeatured(searchParams.get('featured') === '1');
  }, [searchParams]);

  useEffect(() => {
    fetchFilteredListings();
  }, [searchParams]);

  const fetchFilteredListings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/listings?${searchParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setListings(data.listings || []);
      }
    } catch (err) {
      console.error('Error loading listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateFiltersInUrl = (overrideParams?: Record<string, string>) => {
    const params = new URLSearchParams();
    const currentQuery = overrideParams && 'q' in overrideParams ? overrideParams.q : query;
    const currentType = overrideParams && 'type' in overrideParams ? overrideParams.type : listingType;
    const currentExchange = overrideParams && 'exchange' in overrideParams ? overrideParams.exchange : exchangeType;
    const currentCondition = overrideParams && 'condition' in overrideParams ? overrideParams.condition : condition;
    const currentMin = overrideParams && 'minPrice' in overrideParams ? overrideParams.minPrice : minPrice;
    const currentMax = overrideParams && 'maxPrice' in overrideParams ? overrideParams.maxPrice : maxPrice;
    const currentCity = overrideParams && 'city' in overrideParams ? overrideParams.city : city;
    const currentSort = overrideParams && 'sort' in overrideParams ? overrideParams.sort : sort;

    if (currentQuery.trim()) params.set('q', currentQuery.trim());
    if (currentType) params.set('type', currentType);
    if (currentExchange) params.set('exchange', currentExchange);
    if (currentCondition) params.set('condition', currentCondition);
    if (currentMin) params.set('minPrice', currentMin);
    if (currentMax) params.set('maxPrice', currentMax);
    if (currentCity.trim()) params.set('city', currentCity.trim());
    if (currentSort && currentSort !== 'newest') params.set('sort', currentSort);

    router.push(`/listings?${params.toString()}`);
  };

  const handleApplyFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateFiltersInUrl();
    setMobileFilterOpen(false);
  };

  const handleClearFilters = () => {
    setQuery('');
    setListingType('');
    setExchangeType('');
    setCondition('');
    setMinPrice('');
    setMaxPrice('');
    setCity('');
    setSort('newest');
    router.push('/listings');
    setMobileFilterOpen(false);
  };

  const FilterSidebar = () => (
    <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-6 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
      <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          <span className="font-bold text-sm text-on-surface">Filters</span>
        </div>
        <button
          onClick={handleClearFilters}
          className="text-xs font-bold text-primary hover:text-secondary transition-colors"
          type="button"
        >
          Clear All
        </button>
      </div>

      {/* Category Selector */}
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-bold text-outline uppercase tracking-wider">Categories</label>
        <div className="flex flex-col gap-1.5">
          {[
            { label: 'All Categories', val: '' },
            { label: 'Books & Textbooks', val: 'BOOK', icon: BookOpen },
            { label: 'Gear & Electronics', val: 'PRODUCT', icon: Package },
          ].map((cat) => {
            const active = listingType === cat.val;
            return (
              <button
                key={cat.val}
                type="button"
                onClick={() => {
                  setListingType(cat.val);
                  updateFiltersInUrl({ type: cat.val });
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
                  active
                    ? 'bg-primary-container text-white shadow-sm'
                    : 'text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <span>{cat.label}</span>
                {cat.icon && <cat.icon className="w-3.5 h-3.5 opacity-80" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Exchange Mode Filter */}
      <div className="flex flex-col gap-2 pt-3 border-t border-outline-variant/30">
        <label className="text-[11px] font-bold text-outline uppercase tracking-wider">Exchange Mode</label>
        <div className="flex flex-col gap-1.5">
          {[
            { label: 'All Modes', val: '', desc: 'Any trade preference' },
            { label: 'True Barter', val: 'BARTER_ONLY', desc: 'Item-for-item trade', icon: Repeat },
            { label: 'Hybrid Swap', val: 'HYBRID', desc: 'Item + partial cash' },
            { label: 'Cash Direct', val: 'CASH_ONLY', desc: 'Straight valuation buyout', icon: DollarSign },
          ].map((mode) => {
            const active = exchangeType === mode.val;
            return (
              <button
                key={mode.val}
                type="button"
                onClick={() => {
                  setExchangeType(mode.val);
                  updateFiltersInUrl({ exchange: mode.val });
                }}
                className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                  active
                    ? 'bg-primary-fixed/40 border-primary text-primary'
                    : 'bg-surface-container-lowest border-outline-variant/30 hover:bg-surface-container-low text-on-surface'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{mode.label}</span>
                  {mode.icon && <mode.icon className="w-3.5 h-3.5" />}
                </div>
                <p className="text-[10px] text-outline mt-0.5">{mode.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Valuation Range Histogram & Inputs */}
      <div className="flex flex-col gap-2 pt-3 border-t border-outline-variant/30">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-outline uppercase tracking-wider">Valuation Range</label>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-fixed text-primary">
            USD ($)
          </span>
        </div>
        {/* Visual histogram bars */}
        <div className="h-10 w-full flex items-end gap-1 px-1 pt-2 opacity-85">
          <div className="w-full bg-primary-fixed-dim/40 rounded-t h-2" />
          <div className="w-full bg-primary-fixed-dim/60 rounded-t h-4" />
          <div className="w-full bg-primary-fixed-dim/80 rounded-t h-7" />
          <div className="w-full bg-primary rounded-t h-10" />
          <div className="w-full bg-primary rounded-t h-8" />
          <div className="w-full bg-primary-container rounded-t h-5" />
          <div className="w-full bg-primary-fixed-dim/50 rounded-t h-3" />
        </div>
        <div className="flex items-center gap-2 mt-1">
          <input
            type="number"
            placeholder="Min $"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onBlur={() => updateFiltersInUrl()}
            className="w-1/2 px-3 py-1.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary"
          />
          <span className="text-outline text-xs">-</span>
          <input
            type="number"
            placeholder="Max $"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onBlur={() => updateFiltersInUrl()}
            className="w-1/2 px-3 py-1.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Condition Selector */}
      <div className="flex flex-col gap-2 pt-3 border-t border-outline-variant/30">
        <label className="text-[11px] font-bold text-outline uppercase tracking-wider">Condition</label>
        <select
          value={condition}
          onChange={(e) => {
            setCondition(e.target.value);
            updateFiltersInUrl({ condition: e.target.value });
          }}
          className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-xl text-xs text-on-surface font-medium focus:outline-none focus:border-primary"
        >
          <option value="">Any Condition</option>
          <option value="BRAND_NEW">Brand New</option>
          <option value="LIKE_NEW">Like New</option>
          <option value="VERY_GOOD">Very Good</option>
          <option value="GOOD">Good</option>
          <option value="ACCEPTABLE">Acceptable</option>
        </select>
      </div>

      {/* Location */}
      <div className="flex flex-col gap-2 pt-3 border-t border-outline-variant/30">
        <label className="text-[11px] font-bold text-outline uppercase tracking-wider">City / Campus</label>
        <input
          type="text"
          placeholder="e.g. New York, Austin, UCLA"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onBlur={() => updateFiltersInUrl()}
          className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-xl text-xs text-on-surface font-medium focus:outline-none focus:border-primary"
        />
      </div>

      <button
        type="button"
        onClick={() => handleApplyFilters()}
        className="w-full py-2.5 bg-primary hover:bg-primary-container text-white rounded-full text-xs font-bold shadow-lift transition-all mt-2"
      >
        Apply Filters
      </button>
    </aside>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed text-primary text-[11px] font-bold mb-2">
            Circular Catalog
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Explore Exchange Catalog
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            {listings.length} available items ready for peer-to-peer barter, cash offer, or hybrid swap
          </p>
        </div>

        {/* Search, Sort, and Mobile Toggle */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 bg-surface-container-lowest border border-outline-variant/40 rounded-full text-xs font-bold text-on-surface shadow-sm"
          >
            <Filter className="w-3.5 h-3.5 text-primary" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-lowest border border-outline-variant/40 rounded-full shadow-sm">
            <ArrowUpDown className="w-3.5 h-3.5 text-outline" />
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                updateFiltersInUrl({ sort: e.target.value });
              }}
              className="bg-transparent text-xs font-semibold text-on-surface border-none focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Pills */}
      {(query || listingType || exchangeType || condition || city || minPrice || maxPrice) && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs font-bold text-outline">Active filters:</span>
          {query && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container text-xs font-medium text-on-surface">
              Query: &quot;{query}&quot;
              <button onClick={() => { setQuery(''); updateFiltersInUrl({ q: '' }); }} className="hover:text-primary"><X className="w-3 h-3" /></button>
            </span>
          )}
          {listingType && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container text-xs font-medium text-on-surface">
              Type: {listingType}
              <button onClick={() => { setListingType(''); updateFiltersInUrl({ type: '' }); }} className="hover:text-primary"><X className="w-3 h-3" /></button>
            </span>
          )}
          {exchangeType && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container text-xs font-medium text-on-surface">
              Mode: {exchangeType}
              <button onClick={() => { setExchangeType(''); updateFiltersInUrl({ exchange: '' }); }} className="hover:text-primary"><X className="w-3 h-3" /></button>
            </span>
          )}
          {condition && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container text-xs font-medium text-on-surface">
              Condition: {condition}
              <button onClick={() => { setCondition(''); updateFiltersInUrl({ condition: '' }); }} className="hover:text-primary"><X className="w-3 h-3" /></button>
            </span>
          )}
          {city && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container text-xs font-medium text-on-surface">
              City: {city}
              <button onClick={() => { setCity(''); updateFiltersInUrl({ city: '' }); }} className="hover:text-primary"><X className="w-3 h-3" /></button>
            </span>
          )}
          <button
            onClick={handleClearFilters}
            className="text-xs font-bold text-primary hover:underline ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Layout: Filter Sidebar + Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="hidden lg:block">
          <FilterSidebar />
        </div>

        {/* Listings Display Grid */}
        <div className="flex-1 w-full">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-80 bg-surface-container rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-20 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-8">
              <Package className="w-12 h-12 text-outline mx-auto mb-3" />
              <h3 className="font-bold text-lg text-on-surface">No matching listings found</h3>
              <p className="text-xs text-on-surface-variant mt-1 max-w-sm mx-auto">
                Try widening your price range, clearing filters, or searching for other keywords.
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-5 px-5 py-2 rounded-full bg-primary text-white text-xs font-bold hover:bg-primary-container transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {listings.map((item) => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xs bg-surface-container-lowest h-full overflow-y-auto p-5 shadow-modal">
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30 mb-4">
              <h3 className="font-bold text-base text-on-surface">Filters</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 rounded-full hover:bg-surface-container text-outline"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterSidebar />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-outline">Loading catalog...</div>}>
      <ListingsContent />
    </Suspense>
  );
}
