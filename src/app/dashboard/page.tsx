'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Package, 
  Eye, 
  DollarSign, 
  Repeat, 
  Trash2, 
  ExternalLink, 
  TrendingDown, 
  Sparkles, 
  Zap, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Share2, 
  PlusCircle, 
  SlidersHorizontal,
  Tag,
  AlertCircle,
  Pencil
} from 'lucide-react';
import { ListingItem } from '@/lib/types';

export default function MyListingsDashboard() {
  const [listings, setListings] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'RESERVED' | 'SOLD' | 'TRADED'>('ALL');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.user) {
          setUser(d.user);
          fetchMyListings();
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, []);

  const fetchMyListings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/listings/my');
      if (res.ok) {
        const data = await res.json();
        setListings(data.listings || []);
      }
    } catch (err) {
      console.error('Failed to load user listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/listings/${id}/promote`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        showSuccess('Status updated successfully');
        fetchMyListings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePromote = async (id: string, type: 'FEATURED' | 'URGENT' | 'TOP') => {
    try {
      const res = await fetch(`/api/listings/${id}/promote`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promote: type }),
      });
      if (res.ok) {
        showSuccess(`Promoted listing with ${type} boost!`);
        fetchMyListings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdatePrice = async (id: string) => {
    if (!newPrice || isNaN(parseFloat(newPrice))) return;
    try {
      const res = await fetch(`/api/listings/${id}/promote`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: parseFloat(newPrice) }),
      });
      if (res.ok) {
        showSuccess('Price updated successfully');
        setEditingPriceId(null);
        setNewPrice('');
        fetchMyListings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) return;
    try {
      const res = await fetch(`/api/listings/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showSuccess('Listing deleted');
        setListings((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyLink = (id: string) => {
    const url = `${window.location.origin}/listings/${id}`;
    navigator.clipboard.writeText(url);
    showSuccess('Listing link copied to clipboard!');
  };

  const showSuccess = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const filteredListings = listings.filter((item) => {
    if (activeTab === 'ALL') return true;
    return item.status === activeTab;
  });

  const totalViews = listings.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0);
  const totalOffers = listings.reduce((acc, curr) => acc + (curr._count?.cashOffers || 0) + (curr._count?.barterProposalsAsTarget || 0), 0);
  const activeCount = listings.filter((i) => i.status === 'ACTIVE').length;

  if (!loading && !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-14 h-14 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
          <SlidersHorizontal className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Sign in to manage your items</h2>
        <p className="text-xs text-gray-500">
          Only the owner of a listing can access its management controls, update prices, and boost visibility.
        </p>
        <Link
          href="/login"
          className="inline-block px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm"
        >
          Sign In / Switch Persona
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Notification */}
      {actionSuccess && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-on-surface text-white px-4 py-3 rounded-2xl shadow-modal text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant/30 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed text-primary text-[11px] font-bold mb-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Listing Management Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Inventory & Barter Velocity
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Monitor barter velocity, drop prices, boost visibility, manage inbound proposals, and verify meetups.
          </p>
        </div>

        <Link
          href="/listings/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary hover:bg-secondary-container text-white font-bold text-xs rounded-full shadow-[0_4px_16px_rgba(113,42,226,0.25)] transition-all self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Barter</span>
        </Link>
      </div>

      {/* 4 Bento Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Active Listings */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-on-surface-variant">Active Inventory</span>
            <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold text-on-surface">{activeCount}</span>
              <span className="text-xs text-outline">items listed</span>
            </div>
            <div className="text-[11px] text-primary font-bold">
              {listings.length > 0 ? Math.round((activeCount / listings.length) * 100) : 100}% circulating
            </div>
          </div>
          <div className="w-full bg-surface-container-low h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full"
              style={{ width: `${listings.length > 0 ? (activeCount / listings.length) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Inbound Proposals */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-on-surface-variant">Inbound Proposals</span>
            <div className="w-9 h-9 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary">
              <Repeat className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold text-on-surface">{totalOffers}</span>
              <span className="text-xs text-outline">proposals</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold">
              <span>Ready for negotiation</span>
            </div>
          </div>
          <div className="w-full bg-surface-container-low h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-tertiary h-full rounded-full" style={{ width: '65%' }} />
          </div>
        </div>

        {/* Metric 3: Total Views with Sparkline */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-on-surface-variant">Total Catalog Views</span>
            <div className="w-9 h-9 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-end justify-between gap-2">
            <div>
              <div className="text-3xl font-extrabold text-on-surface">{totalViews}</div>
              <div className="text-[11px] text-secondary font-bold flex items-center gap-1">
                <span>↑ Active audience</span>
              </div>
            </div>
            {/* Sparkline Graphic */}
            <svg className="w-16 h-8 text-secondary" fill="none" preserveAspectRatio="none" viewBox="0 0 100 40">
              <path d="M0 35 Q 20 28, 35 30 T 65 14 T 100 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
              <path d="M0 35 Q 20 28, 35 30 T 65 14 T 100 4 L 100 40 L 0 40 Z" fill="currentColor" fillOpacity="0.12" />
            </svg>
          </div>
          <div className="w-full bg-surface-container-low h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-secondary h-full rounded-full" style={{ width: '80%' }} />
          </div>
        </div>

        {/* Metric 4: Completed Exchanges */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-on-surface-variant">Completed Exchanges</span>
            <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold text-on-surface">
                {listings.filter((i) => i.status === 'TRADED' || i.status === 'SOLD').length}
              </span>
              <span className="text-xs text-outline">swaps finalized</span>
            </div>
            <div className="text-[11px] text-on-surface font-bold">
              ★ 4.98 <span className="text-outline font-normal">trust rating</span>
            </div>
          </div>
          <div className="w-full bg-surface-container-low h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: '90%' }} />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-surface-container-low rounded-2xl overflow-x-auto">
        {(['ALL', 'ACTIVE', 'RESERVED', 'SOLD', 'TRADED'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            {tab === 'ALL' ? 'All Items' : tab}
            <span className="ml-1.5 opacity-70">
              ({tab === 'ALL' ? listings.length : listings.filter((i) => i.status === tab).length})
            </span>
          </button>
        ))}
      </div>

      {/* Listings List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 bg-surface-container rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="bg-surface-container-lowest p-12 text-center rounded-3xl border border-outline-variant/30 shadow-sm space-y-4">
          <Package className="w-12 h-12 text-outline mx-auto" />
          <h3 className="text-base font-bold text-on-surface">No items found in this view</h3>
          <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
            You don't have any items matching this filter tab. Post a new listing to start trading!
          </p>
          <Link
            href="/listings/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full text-xs font-bold hover:bg-primary-container transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Post First Item
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredListings.map((item) => {
            return (
              <div
                key={item.id}
                className="bg-surface-container-lowest p-5 rounded-3xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
              >
                {/* Thumbnail & Info */}
                <div className="flex gap-4 items-start flex-1 min-w-0">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-surface-container-low shrink-0 border border-outline-variant/30">
                    <img
                      src={item.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    {item.isFeatured && (
                      <span className="absolute top-1 left-1 bg-secondary text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md shadow-sm">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-lg ${
                          item.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'RESERVED'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-surface-container text-on-surface-variant'
                        }`}
                      >
                        {item.status}
                      </span>
                      <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-lg uppercase">
                        {item.listingType}
                      </span>
                      <span className="text-[10px] font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded-lg uppercase">
                        {item.exchangeType.replace('_', ' ')}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-on-surface truncate">{item.title}</h3>

                    {/* Price & Price Drop */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-on-surface">
                        {item.price ? `$${item.price}` : 'Barter Only'}
                      </span>
                      {item.previousPrice && (
                        <span className="text-xs text-outline line-through">
                          ${item.previousPrice}
                        </span>
                      )}
                    </div>

                    {/* Quick Stats */}
                    <div className="flex items-center gap-4 text-xs text-on-surface-variant pt-1">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-outline" />
                        <span>{item.viewsCount || 0} views</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Repeat className="w-3.5 h-3.5 text-primary" />
                        <span className="font-bold text-primary">
                          {(item._count?.cashOffers || 0) + (item._count?.barterProposalsAsTarget || 0)} proposals
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Interactive Management Toolbar */}
                <div className="w-full md:w-auto border-t md:border-t-0 md:border-l border-outline-variant/30 pt-4 md:pt-0 md:pl-5 flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <label className="text-[10px] font-bold uppercase text-outline sm:hidden md:block">
                      Status:
                    </label>
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      className="px-3 py-1.5 bg-surface-container-low border border-outline-variant/40 rounded-full text-xs font-semibold text-on-surface focus:outline-none focus:border-primary"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="RESERVED">RESERVED</option>
                      <option value="TRADED">TRADED</option>
                      <option value="SOLD">SOLD</option>
                      <option value="ARCHIVED">ARCHIVED</option>
                    </select>
                  </div>

                  {/* Quick Action Button Bar */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Edit Posting */}
                    <Link
                      href={`/listings/${item.id}/edit`}
                      className="px-3 py-1.5 bg-primary/10 hover:bg-primary hover:text-white text-primary rounded-full text-xs font-bold flex items-center gap-1 transition-all shadow-xs"
                      title="Edit Full Posting"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Link>

                    {/* View Public Listing */}
                    <Link
                      href={`/listings/${item.id}`}
                      className="p-2 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-full text-xs font-semibold flex items-center transition-colors"
                      title="View Public Page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    {/* Copy Link */}
                    <button
                      onClick={() => handleCopyLink(item.id)}
                      className="p-2 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-full text-xs font-semibold flex items-center transition-colors"
                      title="Share / Copy Link"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Edit Price Drop Tool */}
                    <button
                      onClick={() => {
                        setEditingPriceId(editingPriceId === item.id ? null : item.id);
                        setNewPrice(item.price ? item.price.toString() : '');
                      }}
                      className="px-3 py-1.5 bg-tertiary-fixed text-on-tertiary-fixed rounded-full text-xs font-bold flex items-center gap-1 transition-all"
                      title="Update / Drop Price"
                    >
                      <TrendingDown className="w-3.5 h-3.5" />
                      <span>Price</span>
                    </button>

                    {/* Promote / Boost Button */}
                    <button
                      onClick={() => handlePromote(item.id, 'FEATURED')}
                      disabled={item.isFeatured}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${
                        item.isFeatured
                          ? 'bg-secondary-fixed text-secondary cursor-default'
                          : 'bg-primary-fixed hover:bg-primary-fixed-dim text-primary'
                      }`}
                      title="Feature Ad on Top"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{item.isFeatured ? 'Featured' : 'Boost'}</span>
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-clay/10 hover:bg-clay/20 text-clay rounded-full text-xs font-semibold flex items-center transition-colors"
                      title="Delete Listing"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Inline Price Drop Input Modal */}
                  {editingPriceId === item.id && (
                    <div className="mt-2 p-2.5 bg-amber-50 rounded-2xl border border-amber-200 flex items-center gap-2">
                      <input
                        type="number"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        placeholder="New price ($)"
                        className="w-24 px-2 py-1 text-xs border border-amber-300 rounded-lg focus:outline-none"
                      />
                      <button
                        onClick={() => handleUpdatePrice(item.id)}
                        className="px-3 py-1 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
