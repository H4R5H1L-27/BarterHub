'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Repeat, Plus, Check, AlertCircle, CheckCircle2, ArrowRight, DollarSign } from 'lucide-react';
import { ListingItem } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

interface BarterModalProps {
  targetListing: ListingItem;
  isOpen: boolean;
  onClose: () => void;
  onBarterSubmitted?: () => void;
}

export default function BarterModal({ targetListing, isOpen, onClose, onBarterSubmitted }: BarterModalProps) {
  const [userListings, setUserListings] = useState<ListingItem[]>([]);
  const [selectedListingIds, setSelectedListingIds] = useState<string[]>([]);
  const [cashTopUp, setCashTopUp] = useState<string>('0');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingListings, setFetchingListings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchMyListings = async () => {
      setFetchingListings(true);
      try {
        const res = await fetch('/api/listings/my');
        if (res.ok) {
          const data = await res.json();
          // Exclude target listing if owned by user
          const valid = (data.listings || []).filter((l: ListingItem) => l.id !== targetListing.id && l.status === 'ACTIVE');
          setUserListings(valid);
        }
      } catch (e) {
        console.error('Failed to fetch user listings for barter:', e);
      } finally {
        setFetchingListings(false);
      }
    };

    fetchMyListings();
  }, [isOpen, targetListing.id]);

  if (!isOpen) return null;

  const toggleItemSelection = (id: string) => {
    setSelectedListingIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (selectedListingIds.length === 0) {
      setError('Please select at least 1 item from your inventory to offer in trade.');
      return;
    }

    const topUpAmount = parseFloat(cashTopUp) || 0;

    setLoading(true);
    try {
      const res = await fetch('/api/barters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetListingId: targetListing.id,
          recipientId: targetListing.userId,
          offeredListingIds: selectedListingIds,
          cashTopUp: topUpAmount,
          notes: notes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit barter proposal.');
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        if (onBarterSubmitted) onBarterSubmitted();
      }, 1800);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-surface-container-lowest rounded-3xl shadow-modal border border-outline-variant/30 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30 bg-surface-container-low flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-fixed text-primary flex items-center justify-center font-bold">
              <Repeat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-on-surface text-base">Make Barter Proposal</h3>
              <p className="text-xs text-on-surface-variant">Trade items from your inventory with {targetListing.user.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-outline hover:text-on-surface rounded-full hover:bg-surface-container transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {success ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-primary-fixed text-primary flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="font-extrabold text-on-surface text-xl">Barter Proposal Sent!</h4>
            <p className="text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed">
              Your trade proposal has been delivered to {targetListing.user.name}. Track updates and negotiate in your Offers Hub.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto p-6 space-y-5">
            {error && (
              <div className="p-3 bg-clay/10 border border-clay/20 rounded-2xl text-clay text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Target Item card */}
            <div className="p-4 bg-surface-container-low border border-outline-variant/30 rounded-2xl">
              <span className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-1.5">
                Target Item (You Receive)
              </span>
              <div className="flex items-center gap-3">
                <img
                  src={targetListing.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200'}
                  alt={targetListing.title}
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-on-surface text-sm truncate">{targetListing.title}</h5>
                  <p className="text-xs text-primary font-semibold">
                    Condition: {targetListing.condition.replace('_', ' ')}
                  </p>
                </div>
              </div>
              {targetListing.barterWishlist && (
                <p className="mt-2.5 text-xs text-primary bg-primary-fixed/40 px-3 py-1.5 rounded-xl font-medium">
                  💡 <strong>Seller Wishlist:</strong> {targetListing.barterWishlist}
                </p>
              )}
            </div>

            {/* Select items from inventory */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-outline uppercase tracking-wider">
                  Select Items to Offer ({selectedListingIds.length} selected)
                </label>
                <Link
                  href="/listings/new"
                  target="_blank"
                  className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Post New
                </Link>
              </div>

              {fetchingListings ? (
                <div className="p-6 text-center text-xs text-outline">Loading your active inventory...</div>
              ) : userListings.length === 0 ? (
                <div className="p-6 border-2 border-dashed border-outline-variant/40 rounded-2xl text-center space-y-2">
                  <p className="text-xs font-bold text-on-surface">No active listings in your inventory</p>
                  <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
                    To propose a trade, post at least one book or product on your account.
                  </p>
                  <Link
                    href="/listings/new"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-full text-xs font-bold hover:bg-primary-container transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Post Barter Ad
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto pr-1">
                  {userListings.map((item) => {
                    const isSelected = selectedListingIds.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleItemSelection(item.id)}
                        className={`cursor-pointer p-2.5 rounded-2xl border flex items-center gap-3 transition-all ${
                          isSelected
                            ? 'border-primary bg-primary-fixed/30 shadow-sm'
                            : 'border-outline-variant/30 hover:bg-surface-container-low'
                        }`}
                      >
                        <img
                          src={item.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100'}
                          alt={item.title}
                          className="w-10 h-10 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-on-surface truncate">{item.title}</p>
                          <p className="text-[11px] text-outline">{formatPrice(item.price)}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 border ${
                          isSelected ? 'bg-primary text-white border-primary' : 'border-outline-variant/60'
                        }`}>
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Cash Top-Up Adjustment */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-outline uppercase tracking-wider block">
                Cash Top-Up / Balance ($ USD)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={cashTopUp}
                  onChange={(e) => setCashTopUp(e.target.value)}
                  placeholder="0"
                  className="w-full pl-8 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-full text-xs text-on-surface font-semibold focus:outline-none focus:border-primary"
                />
                <DollarSign className="w-4 h-4 text-outline absolute left-3 top-3" />
              </div>
              <p className="text-[10px] text-outline">
                Add extra cash to balance out any trade valuation gap.
              </p>
            </div>

            {/* Note */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-outline uppercase tracking-wider block">
                Trade Proposal Note
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Suggest campus meetup location, item condition questions, etc."
                rows={2}
                className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-2xl text-xs text-on-surface focus:outline-none focus:border-primary resize-none"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-full text-xs font-semibold text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || selectedListingIds.length === 0}
                className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-container text-white text-xs font-bold shadow-lift disabled:opacity-50 transition-all"
              >
                {loading ? 'Submitting...' : 'Submit Barter Proposal'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
