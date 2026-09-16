'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Flame, PlusCircle, Package, ShieldCheck, Star, Search } from 'lucide-react';
import ListingCard from '@/components/marketplace/listing-card';
import CategoryRail from '@/components/marketplace/category-rail';
import { ListingItem } from '@/lib/types';
import { TRENDING_SEARCHES } from '@/lib/catalog';
import { useMarketplace } from '@/components/providers/marketplace-provider';

export default function HomePage() {
  const { city } = useMarketplace();
  const [featured, setFeatured] = useState<ListingItem[]>([]);
  const [fresh, setFresh] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cityParam = city && city !== 'All India' ? `&city=${encodeURIComponent(city)}` : '';
    Promise.all([
      fetch(`/api/listings?featured=1&limit=8${cityParam}`).then((r) => r.json()),
      fetch(`/api/listings?sort=newest&limit=8${cityParam}`).then((r) => r.json()),
    ])
      .then(([a, b]) => {
        setFeatured(a.listings || []);
        setFresh(b.listings || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [city]);

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-14 pb-16 bg-gradient-to-b from-primary-fixed/30 via-surface to-surface">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed text-primary text-xs font-bold mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Modern Circular Exchange Marketplace
          </div>
          <h1 className="font-extrabold text-4xl sm:text-6xl text-on-surface max-w-3xl tracking-tight leading-[1.1]">
            Find it. Swap it. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Keep it in circulation.
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-on-surface-variant text-base sm:text-lg leading-relaxed">
            The modern peer-to-peer barter platform. Trade textbooks, tech gear, audio equipment, and collectibles with true item-for-item swaps, hybrid cash top-ups, and 6-digit handshake verification.
          </p>

          {/* Quick CTA and stats */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/listings"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-primary hover:bg-primary-container text-white font-bold text-sm shadow-lift transition-all transform hover:-translate-y-0.5"
            >
              <Search className="w-4 h-4" />
              <span>Explore Marketplace</span>
            </Link>
            <Link
              href="/listings/new"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-surface-container-lowest border border-outline-variant/40 hover:border-primary text-on-surface font-bold text-sm shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4 text-secondary" />
              <span>Post a Barter Item</span>
            </Link>
          </div>

          {/* Trending tags */}
          <div className="mt-8 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-outline uppercase tracking-wider">Trending:</span>
            {TRENDING_SEARCHES.map((term) => (
              <Link
                key={term}
                href={`/listings?q=${encodeURIComponent(term)}`}
                className="px-3 py-1 rounded-full bg-surface-container-lowest border border-outline-variant/30 text-xs font-medium text-on-surface hover:border-primary hover:text-primary transition-all shadow-2xs"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Category Rail */}
      <section className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <CategoryRail />
        </div>
      </section>

      {/* Featured & Promoted Listings */}
      <section className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-tertiary-fixed text-tertiary">
                  <Flame className="w-5 h-5" />
                </span>
                <h2 className="font-extrabold text-2xl text-on-surface tracking-tight">Featured & Urgent Swaps</h2>
              </div>
              <p className="text-xs text-on-surface-variant mt-1.5">Top-ranked community listings and urgent trade requests</p>
            </div>
            <Link href="/listings?featured=1" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-80 bg-surface-container rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((item) => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Fresh on the Board */}
      <section className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-extrabold text-2xl text-on-surface tracking-tight">Fresh on the Board</h2>
              <p className="text-xs text-on-surface-variant mt-1.5">Latest books, electronics, and accessories posted by local traders</p>
            </div>
            <Link href="/listings" className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
              Browse full catalog <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {fresh.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Circular Value Props */}
      <section className="px-4 sm:px-6 lg:px-8 pt-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Search,
              title: 'Fast Discovery & Histograms',
              body: 'Filter by exchange mode, book ISBN, brand, condition, and interactive price histograms.',
              bg: 'bg-primary-fixed/40',
              iconColor: 'text-primary',
            },
            {
              icon: ShieldCheck,
              title: 'Handshake PIN Verification',
              body: '6-digit physical meetup PINs guarantee deals only close when both parties inspect and approve the items.',
              bg: 'bg-secondary-fixed/40',
              iconColor: 'text-secondary',
            },
            {
              icon: Star,
              title: 'In-Thread Deal Negotiation',
              body: 'Send barter proposals with multiple item trades, counter offers, and cash top-ups directly in live chat.',
              bg: 'bg-tertiary-fixed/40',
              iconColor: 'text-tertiary',
            },
          ].map((card) => (
            <div key={card.title} className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm hover:shadow-md transition-all">
              <div className={`w-12 h-12 rounded-xl ${card.bg} ${card.iconColor} flex items-center justify-center mb-4`}>
                <card.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-on-surface mb-2">{card.title}</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>

        {/* Sell CTA Banner */}
        <div className="max-w-7xl mx-auto mt-12 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-primary to-secondary text-white shadow-lift flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
              Fast & Free
            </span>
            <h2 className="font-extrabold text-2xl sm:text-3xl mt-3 tracking-tight">Post a barter listing in under a minute</h2>
            <p className="text-sm text-white/90 mt-2 max-w-xl leading-relaxed">
              Snap photos, list your barter wishlist, set your cash buyout value, and start receiving swap proposals from verified community members.
            </p>
          </div>
          <Link
            href="/listings/new"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 bg-white text-primary font-bold rounded-full shadow-lg hover:bg-surface-container-low transition-all transform hover:scale-105"
          >
            <PlusCircle className="w-5 h-5 text-secondary" />
            <span>Post Barter Ad</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
      <Package className="w-12 h-12 text-outline mx-auto mb-3" />
      <h3 className="font-bold text-lg text-on-surface">No ads in this city yet</h3>
      <p className="text-xs text-on-surface-variant mt-1">Be the first to list a swap in your area!</p>
      <Link
        href="/listings/new"
        className="inline-flex mt-4 items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-xs font-bold hover:bg-primary-container transition-all"
      >
        <PlusCircle className="w-4 h-4" /> List an item
      </Link>
    </div>
  );
}
