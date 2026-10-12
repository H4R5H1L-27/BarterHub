'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BookOpen, 
  Package, 
  Repeat, 
  DollarSign, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  MessageSquare, 
  Heart, 
  Share2, 
  Star,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Truck,
  Pencil
} from 'lucide-react';
import OfferModal from '@/components/modals/offer-modal';
import BarterModal from '@/components/modals/barter-modal';
import { ListingItem } from '@/lib/types';
import { formatPrice, getConditionBadgeColor, getExchangeTypeBadge, formatDate } from '@/lib/utils';

export default function ListingDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [listing, setListing] = useState<ListingItem | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Modal triggers
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [barterModalOpen, setBarterModalOpen] = useState(false);

  useEffect(() => {
    // Fetch logged in user
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.user) setCurrentUser(d.user);
      })
      .catch(() => {});

    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listings/${id}`);
        if (res.ok) {
          const data = await res.json();
          setListing(data.listing);
        }
      } catch (err) {
        console.error('Failed to load listing:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-gray-200 rounded-3xl" />
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded-lg w-3/4" />
            <div className="h-6 bg-gray-200 rounded-lg w-1/3" />
            <div className="h-24 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Listing Not Found</h2>
        <p className="text-sm text-gray-700 mb-6">This item may have been removed or already traded.</p>
        <Link
          href="/listings"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>
      </div>
    );
  }

  const isBook = listing.listingType === 'BOOK';
  const exchangeBadge = getExchangeTypeBadge(listing.exchangeType);
  const conditionClass = getConditionBadgeColor(listing.condition);
  const images = listing.images && listing.images.length > 0 
    ? listing.images 
    : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800'];

  const handleStartChat = () => {
    router.push(`/messages?recipientId=${listing.userId}&listingId=${listing.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Back button breadcrumb */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/listings"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Listings
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Listed {formatDate(listing.createdAt)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Photos Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[4/3] w-full rounded-3xl overflow-hidden bg-gray-100 border border-gray-200/80 shadow-md relative">
            <img
              src={images[activeImageIndex]}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className={`px-3 py-1 text-xs font-bold rounded-full border shadow-sm ${exchangeBadge.classes}`}>
                {exchangeBadge.label}
              </span>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full border bg-white/95 shadow-sm ${conditionClass}`}>
                {listing.condition.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Thumbnails row */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-indigo-600 ring-2 ring-indigo-600/30'
                      : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Description Block */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-4 mt-6">
            <h3 className="font-bold text-gray-900 text-base">Item Description</h3>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>

            {/* Barter Wishlist Box if applicable */}
            {listing.exchangeType !== 'CASH_ONLY' && listing.barterWishlist && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-2 text-purple-900 font-bold text-xs uppercase tracking-wide">
                  <Repeat className="w-4 h-4 text-purple-600" />
                  <span>Owner's Barter Wishlist</span>
                </div>
                <p className="text-xs text-purple-900 leading-relaxed font-medium">
                  {listing.barterWishlist}
                </p>
              </div>
            )}
          </div>

          {/* Metadata Specifications (Books vs Products) */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
              {isBook ? <BookOpen className="w-5 h-5 text-indigo-600" /> : <Package className="w-5 h-5 text-indigo-600" />}
              <span>{isBook ? 'Book & Edition Details' : 'Product Specifications'}</span>
            </h3>

            {isBook && listing.bookDetails ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-400 block mb-0.5">Author</span>
                  <span className="font-bold text-gray-900">{listing.bookDetails.author}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-400 block mb-0.5">Genre</span>
                  <span className="font-bold text-gray-900">{listing.bookDetails.genre}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-400 block mb-0.5">Format</span>
                  <span className="font-bold text-gray-900">{listing.bookDetails.format}</span>
                </div>
                {listing.bookDetails.isbn13 && (
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-400 block mb-0.5">ISBN-13</span>
                    <span className="font-bold text-gray-900">{listing.bookDetails.isbn13}</span>
                  </div>
                )}
                {listing.bookDetails.publisher && (
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-400 block mb-0.5">Publisher</span>
                    <span className="font-bold text-gray-900">{listing.bookDetails.publisher}</span>
                  </div>
                )}
                {listing.bookDetails.academicSubject && (
                  <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-100">
                    <span className="text-emerald-700 block mb-0.5">Course / Subject</span>
                    <span className="font-bold">{listing.bookDetails.courseCode || ''} {listing.bookDetails.academicSubject}</span>
                  </div>
                )}
              </div>
            ) : listing.productDetails ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                {listing.productDetails.brand && (
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-400 block mb-0.5">Brand</span>
                    <span className="font-bold text-gray-900">{listing.productDetails.brand}</span>
                  </div>
                )}
                {listing.productDetails.model && (
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-400 block mb-0.5">Model</span>
                    <span className="font-bold text-gray-900">{listing.productDetails.model}</span>
                  </div>
                )}
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-400 block mb-0.5">Original Box</span>
                  <span className="font-bold text-gray-900">{listing.productDetails.includesOriginalBox ? 'Included' : 'Not Included'}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-400 block mb-0.5">Accessories</span>
                  <span className="font-bold text-gray-900">{listing.productDetails.includesAccessories ? 'Included' : 'Unit Only'}</span>
                </div>
              </div>
            ) : null}
          </div>

        </div>

        <div className="lg:col-span-5 space-y-6">
          
          {/* Quick Owner Controls shortcut only if logged-in user owns listing */}
          {currentUser && currentUser.id === listing.userId && (
            <div className="bg-primary text-white p-4 sm:p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
              <div>
                <p className="text-[11px] font-bold text-primary-fixed uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Owner Controls
                </p>
                <p className="text-xs sm:text-sm font-semibold text-white mt-0.5">
                  You created this posting. Update details or manage barter proposals.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/listings/${listing.id}/edit`}
                  className="px-4 py-2 bg-white text-primary font-bold rounded-xl text-xs hover:bg-primary-fixed transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit Posting</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="px-3.5 py-2 bg-primary-container text-white font-semibold rounded-xl text-xs hover:bg-primary-container/80 transition-colors"
                >
                  Dashboard →
                </Link>
              </div>
            </div>
          )}

          {/* Main Price & Action Card */}
          <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant/30 shadow-sm space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight leading-snug">
                {listing.title}
              </h1>
              <div className="flex items-center gap-2 mt-2 text-xs text-on-surface-variant">
                <MapPin className="w-3.5 h-3.5 text-outline" />
                <span>{listing.city}, {listing.state}</span>
                <span>•</span>
                <span>{listing.viewsCount} views</span>
              </div>
            </div>

            {/* Price section */}
            <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/30 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-outline font-bold uppercase tracking-wider block">
                  {listing.exchangeType === 'BARTER_ONLY' ? 'Exchange Mode' : 'Asking Valuation'}
                </span>
                <span className="text-3xl font-extrabold text-on-surface">
                  {formatPrice(listing.price, listing.currency)}
                </span>
              </div>
              {listing.isNegotiable && listing.exchangeType !== 'BARTER_ONLY' && (
                <span className="text-xs font-bold text-primary bg-primary-fixed px-3 py-1 rounded-full">
                  Price Negotiable
                </span>
              )}
            </div>

            {/* CTAs */}
            <div className="space-y-3">
              {currentUser && currentUser.id === listing.userId ? (
                <div className="p-4 bg-primary-fixed/30 border border-primary/20 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-primary">You own this posting</p>
                    <span className="text-[10px] uppercase font-bold text-outline">Verified Owner</span>
                  </div>
                  <Link
                    href={`/listings/${listing.id}/edit`}
                    className="w-full py-3 px-4 bg-primary text-white rounded-full text-xs font-bold hover:bg-primary-container shadow-lift transition-all flex items-center justify-center gap-2"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit Posting Details</span>
                  </Link>
                  <Link
                    href="/dashboard"
                    className="block w-full py-2 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-full text-xs font-semibold transition-colors text-center border border-outline-variant/30"
                  >
                    Manage in Dashboard
                  </Link>
                </div>
              ) : (
                <>
                  {/* If hybrid or barter only: show Propose Barter button */}
                  {listing.exchangeType !== 'CASH_ONLY' && (
                    <button
                      onClick={() => setBarterModalOpen(true)}
                      className="w-full py-3.5 px-4 bg-primary hover:bg-primary-container text-white rounded-full font-bold text-sm shadow-lift flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
                    >
                      <Repeat className="w-4 h-4" />
                      <span>Make Barter Proposal</span>
                    </button>
                  )}

                  {/* If cash only or hybrid: show Make Cash Offer button */}
                  {listing.exchangeType !== 'BARTER_ONLY' && (
                    <button
                      onClick={() => setOfferModalOpen(true)}
                      className="w-full py-3.5 px-4 bg-secondary hover:bg-secondary-container text-white rounded-full font-bold text-sm shadow-lift flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
                    >
                      <DollarSign className="w-4 h-4" />
                      <span>Make Cash Offer</span>
                    </button>
                  )}

                  {/* Message Seller */}
                  <button
                    onClick={handleStartChat}
                    className="w-full py-3 px-4 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-colors border border-outline-variant/30"
                  >
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <span>Chat with Trader</span>
                  </button>
                </>
              )}
            </div>

            {/* Handover & Delivery Options */}
            <div className="pt-4 border-t border-outline-variant/30 space-y-2 text-xs text-on-surface-variant">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>{listing.pickupAvailable ? 'Safe local campus meetup available' : 'Local pickup unavailable'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-primary shrink-0" />
                <span>
                  {listing.shippingAvailable 
                    ? `Shipping available (${formatPrice(listing.shippingCost)})` 
                    : 'Local exchange only (no shipping)'}
                </span>
              </div>
            </div>
          </div>

          {/* Seller Trust Profile Card */}
          <div className="bg-surface-container-lowest p-6 sm:p-7 rounded-3xl border border-outline-variant/30 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-outline uppercase tracking-wider">
              Trader Reputation Dossier
            </h4>

            <div className="flex items-center gap-3">
              <Link href={`/profile/${listing.userId}`}>
                <img
                  src={listing.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                  alt={listing.user.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-outline-variant/30"
                />
              </Link>
              <div>
                <Link href={`/profile/${listing.userId}`} className="font-extrabold text-on-surface text-base hover:text-primary flex items-center gap-1.5 transition-colors">
                  {listing.user.name}
                  {listing.user.isVerified && <ShieldCheck className="w-4 h-4 text-primary" />}
                </Link>
                <div className="flex items-center gap-1.5 text-xs text-outline mt-0.5">
                  <span className="text-tertiary font-bold flex items-center gap-0.5">
                    ★ {listing.user.reputationScore.toFixed(1)}
                  </span>
                  <span>•</span>
                  <span>{listing.user.totalReviews} verified trades</span>
                </div>
              </div>
            </div>

            {listing.user.bio && (
              <p className="text-xs text-on-surface-variant italic bg-surface-container-low p-3 rounded-2xl">
                &quot;{listing.user.bio}&quot;
              </p>
            )}

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
              <div className="p-3 bg-surface-container-low rounded-2xl">
                <span className="text-outline block text-[10px] font-bold uppercase">Completed Swaps</span>
                <span className="font-extrabold text-on-surface text-sm">{listing.user.totalTrades} trades</span>
              </div>
              <div className="p-3 bg-surface-container-low rounded-2xl">
                <span className="text-outline block text-[10px] font-bold uppercase">Response Speed</span>
                <span className="font-extrabold text-on-surface text-sm">{listing.user.avgResponseTime || 'Replies quickly'}</span>
              </div>
            </div>

            <Link
              href={`/profile/${listing.userId}`}
              className="block text-center py-2 text-xs font-bold text-primary hover:underline"
            >
              View Full Trader Trust Dossier →
            </Link>
          </div>

          {/* Safety Notice */}
          <div className="p-4 bg-tertiary-fixed/30 border border-tertiary/20 rounded-2xl flex items-start gap-3 text-xs text-on-tertiary-fixed">
            <AlertTriangle className="w-4 h-4 text-tertiary mt-0.5 shrink-0" />
            <div>
              <p className="font-bold">Campus Safe Zone Meetup</p>
              <p className="mt-0.5 text-on-tertiary-fixed/90 leading-relaxed">
                Always exchange items in campus centers or public coffee shops. Verify the 6-digit handshake code before handing over goods.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Modals */}
      <OfferModal
        listing={listing}
        isOpen={offerModalOpen}
        onClose={() => setOfferModalOpen(false)}
      />

      <BarterModal
        targetListing={listing}
        isOpen={barterModalOpen}
        onClose={() => setBarterModalOpen(false)}
      />

    </div>
  );
}
