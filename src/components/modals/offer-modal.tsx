'use client';

import React, { useState } from 'react';
import { X, DollarSign, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ListingItem } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

interface OfferModalProps {
  listing: ListingItem;
  isOpen: boolean;
  onClose: () => void;
  onOfferSubmitted?: () => void;
}

export default function OfferModal({ listing, isOpen, onClose, onOfferSubmitted }: OfferModalProps) {
  const [offerAmount, setOfferAmount] = useState<string>(
    listing.price ? Math.max(1, Math.round(listing.price * 0.85)).toString() : ''
  );
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const amount = parseFloat(offerAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid offer amount.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: listing.id,
          sellerId: listing.userId,
          offerAmount: amount,
          message: message.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit offer.');
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        if (onOfferSubmitted) onOfferSubmitted();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-3xl shadow-modal border border-outline-variant/30 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30 bg-surface-container-low">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-secondary-fixed text-secondary flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-on-surface text-base">Make Cash Offer</h3>
              <p className="text-xs text-on-surface-variant">Submit a cash buyout offer to {listing.user.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-outline hover:text-on-surface rounded-full hover:bg-surface-container transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        {success ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="font-extrabold text-on-surface text-xl">Offer Submitted!</h4>
            <p className="text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed">
              Your offer of <strong className="text-on-surface">{formatPrice(parseFloat(offerAmount))}</strong> has been delivered. You can track responses in your Offers Hub and chat directly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <div className="p-3 bg-clay/10 border border-clay/20 rounded-2xl text-clay text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Target Item summary */}
            <div className="flex items-center gap-3 p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/30">
              <img
                src={listing.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200'}
                alt={listing.title}
                className="w-14 h-14 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h5 className="font-bold text-on-surface text-sm truncate">{listing.title}</h5>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Asking Price:{' '}
                  <strong className="text-on-surface font-extrabold">
                    {formatPrice(listing.price, listing.currency)}
                  </strong>
                </p>
              </div>
            </div>

            {/* Offer Amount Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-outline uppercase tracking-wider">
                Your Offer Amount ($ USD)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-outline font-semibold text-base">$</span>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  required
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  placeholder="Enter cash amount"
                  className="w-full pl-8 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-full text-sm font-bold text-on-surface focus:outline-none focus:border-secondary transition-all"
                />
              </div>
              <p className="text-[10px] text-outline">
                The seller can accept, decline, or send you a counter-offer in chat.
              </p>
            </div>

            {/* Optional Note */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-outline uppercase tracking-wider">
                Message to Trader (Optional)
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. Can meet in campus student center tomorrow at 2 PM..."
                className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-2xl text-xs text-on-surface focus:outline-none focus:border-secondary resize-none transition-all"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 rounded-full text-xs font-semibold text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-secondary hover:bg-secondary-container active:scale-95 disabled:opacity-50 shadow-lift transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{loading ? 'Sending...' : 'Send Cash Offer'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
