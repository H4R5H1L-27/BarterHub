'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Package, Repeat, MapPin, ShieldCheck, Heart, GitCompare, Zap, Crown } from 'lucide-react';
import { ListingItem } from '@/lib/types';
import { formatPrice, getConditionBadgeColor, getExchangeTypeBadge } from '@/lib/utils';
import { useMarketplace } from './marketplace-provider';

export default function ListingCard({ listing }: { listing: ListingItem }) {
  const { favorites, toggleFavorite, compareIds, toggleCompare } = useMarketplace();
  const isBook = listing.listingType === 'BOOK';
  const exchangeBadge = getExchangeTypeBadge(listing.exchangeType);
  const conditionClass = getConditionBadgeColor(listing.condition);
  const primaryImage = listing.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80';
  const saved = listing.isSaved || favorites.has(listing.id);
  const compared = compareIds.includes(listing.id);

  return (
    <article className="group bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-3.5 shadow-sm hover:shadow-lift hover:-translate-y-1 transition-all duration-200 flex flex-col h-full">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-surface-container-low">
        <Link href={`/listings/${listing.id}`} className="block h-full">
          <img
            src={primaryImage}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Floating Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 pointer-events-none">
          {listing.isTopAd && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full bg-tertiary-fixed text-on-tertiary-fixed shadow-sm">
              <Crown className="w-3 h-3 text-tertiary" /> Top
            </span>
          )}
          {listing.isFeatured && (
            <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full bg-secondary-fixed text-on-secondary-fixed shadow-sm">
              Featured
            </span>
          )}
          {listing.isUrgent && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full bg-clay text-white shadow-sm">
              <Zap className="w-3 h-3" /> Urgent
            </span>
          )}
          <span className="px-2.5 py-0.5 text-[10px] font-semibold rounded-full bg-surface-container-lowest/90 text-primary border border-primary/20 backdrop-blur-sm shadow-sm">
            {exchangeBadge.label}
          </span>
        </div>

        {/* Action icons */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => toggleFavorite(listing)}
            aria-label={saved ? 'Remove from favorites' : 'Save listing'}
            className={`w-8 h-8 rounded-full flex items-center justify-center border shadow-sm backdrop-blur-md transition-all ${
              saved
                ? 'bg-clay text-white border-clay'
                : 'bg-white/90 text-on-surface-variant border-outline-variant/40 hover:text-clay hover:bg-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => toggleCompare(listing.id)}
            aria-label="Compare listing"
            className={`w-8 h-8 rounded-full flex items-center justify-center border shadow-sm backdrop-blur-md transition-all ${
              compared
                ? 'bg-primary text-white border-primary'
                : 'bg-white/90 text-on-surface-variant border-outline-variant/40 hover:text-primary hover:bg-white'
            }`}
          >
            <GitCompare className="w-4 h-4" />
          </button>
        </div>

        <div className="absolute bottom-2.5 right-2.5 bg-on-surface/80 backdrop-blur text-white p-1.5 rounded-lg">
          {isBook ? <BookOpen className="w-3.5 h-3.5" /> : <Package className="w-3.5 h-3.5" />}
        </div>
      </div>

      <div className="pt-3.5 flex flex-col flex-1">
        <Link href={`/listings/${listing.id}`}>
          <h3 className="font-bold text-on-surface text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {listing.title}
          </h3>
        </Link>
        {isBook && listing.bookDetails?.author && (
          <p className="text-xs text-on-surface-variant mt-1">by {listing.bookDetails.author}</p>
        )}
        {!isBook && listing.productDetails?.brand && (
          <p className="text-xs text-on-surface-variant mt-1">{listing.productDetails.brand}</p>
        )}

        {listing.exchangeType !== 'CASH_ONLY' && listing.barterWishlist && (
          <p className="mt-2 text-xs text-primary font-medium line-clamp-1 flex items-center gap-1.5 bg-primary-fixed/30 px-2 py-1 rounded-lg">
            <Repeat className="w-3.5 h-3.5 shrink-0 text-primary" />
            <span className="truncate">Wants: {listing.barterWishlist}</span>
          </p>
        )}

        <div className="mt-auto pt-3 flex items-end justify-between gap-2">
          <div>
            <p className="text-base sm:text-lg font-extrabold text-on-surface">
              {listing.exchangeType === 'BARTER_ONLY' ? (
                <span className="text-primary text-sm font-bold">Open to trade</span>
              ) : (
                formatPrice(listing.price, listing.currency)
              )}
            </p>
            {listing.previousPrice && listing.price && listing.previousPrice > listing.price && (
              <p className="text-[11px] text-outline line-through">{formatPrice(listing.previousPrice)}</p>
            )}
            <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-surface-container text-on-surface-variant">
              {listing.condition.replace('_', ' ')}
            </span>
          </div>
          <p className="text-xs text-on-surface-variant flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-outline" />
            {listing.city}
          </p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-outline-variant/30 flex items-center justify-between text-xs text-on-surface-variant">
          <Link href={`/profile/${listing.userId}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <span className="font-semibold truncate max-w-[120px]">{listing.user.name}</span>
            {listing.user.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-primary" />}
          </Link>
          <span className="text-outline text-[11px]">{listing.viewsCount} views</span>
        </div>
      </div>
    </article>
  );
}
