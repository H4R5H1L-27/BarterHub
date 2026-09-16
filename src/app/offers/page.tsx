'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeftRight, 
  Repeat, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Star
} from 'lucide-react';
import { CashOfferItem, BarterProposalItem } from '@/lib/types';
import { formatPrice, formatDate } from '@/lib/utils';
import ReviewModal from '@/components/modals/review-modal';

export default function OffersDashboardPage() {
  const [activeTab, setActiveTab] = useState<'RECEIVED_BARTERS' | 'SENT_BARTERS' | 'RECEIVED_OFFERS' | 'SENT_OFFERS'>('RECEIVED_BARTERS');
  
  const [user, setUser] = useState<any>(null);
  const [receivedBarters, setReceivedBarters] = useState<BarterProposalItem[]>([]);
  const [sentBarters, setSentBarters] = useState<BarterProposalItem[]>([]);
  const [receivedOffers, setReceivedOffers] = useState<CashOfferItem[]>([]);
  const [sentOffers, setSentOffers] = useState<CashOfferItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Counter offer modal / input state
  const [counterInputId, setCounterInputId] = useState<string | null>(null);
  const [counterAmount, setCounterAmount] = useState<string>('');

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<{
    targetUserId: string;
    targetUserName: string;
    listingId?: string;
    transactionType: 'CASH_SALE' | 'BARTER_EXCHANGE';
  } | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const authRes = await fetch('/api/auth/me');
      if (authRes.ok) {
        const uData = await authRes.json();
        if (uData.user) {
          setUser(uData.user);
        } else {
          setUser(null);
          setLoading(false);
          return;
        }
      } else {
        setUser(null);
        setLoading(false);
        return;
      }

      const [bartersRes, offersRes] = await Promise.all([
        fetch('/api/barters'),
        fetch('/api/offers'),
      ]);

      if (bartersRes.ok) {
        const bData = await bartersRes.json();
        setReceivedBarters(bData.receivedBarters || []);
        setSentBarters(bData.sentBarters || []);
      }

      if (offersRes.ok) {
        const oData = await offersRes.json();
        setReceivedOffers(oData.receivedOffers || []);
        setSentOffers(oData.sentOffers || []);
      }
    } catch (err) {
      console.error('Error fetching offers data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleBarterAction = async (proposalId: string, action: 'ACCEPT' | 'REJECT' | 'COMPLETE') => {
    try {
      const res = await fetch(`/api/barters/${proposalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to update barter:', err);
    }
  };

  const handleOfferAction = async (offerId: string, action: 'ACCEPT' | 'COUNTER' | 'DECLINE' | 'COMPLETE', customAmount?: number) => {
    try {
      const res = await fetch(`/api/offers/${offerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, counterAmount: customAmount }),
      });
      if (res.ok) {
        setCounterInputId(null);
        setCounterAmount('');
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to update offer:', err);
    }
  };

  const openReviewForBarter = (proposal: BarterProposalItem) => {
    setReviewTarget({
      targetUserId: proposal.initiatorId,
      targetUserName: proposal.initiator.name,
      listingId: proposal.targetListingId,
      transactionType: 'BARTER_EXCHANGE',
    });
    setReviewModalOpen(true);
  };

  const openReviewForOffer = (offer: CashOfferItem) => {
    setReviewTarget({
      targetUserId: offer.buyerId,
      targetUserName: offer.buyer.name,
      listingId: offer.listingId,
      transactionType: 'CASH_SALE',
    });
    setReviewModalOpen(true);
  };

  const [handshakePin, setHandshakePin] = useState('');
  const [pinVerificationMsg, setPinVerificationMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [verifyingPin, setVerifyingPin] = useState(false);

  const handleVerifyHandshakePin = async (e?: React.FormEvent, pinToVerify?: string) => {
    if (e) e.preventDefault();
    const clean = (pinToVerify || handshakePin).trim().toUpperCase();
    if (!clean) {
      setPinVerificationMsg({
        type: 'error',
        text: 'Please enter the handshake PIN provided by the trader (e.g. TRD-8492).',
      });
      return;
    }

    setVerifyingPin(true);
    setPinVerificationMsg(null);

    try {
      const res = await fetch('/api/barters/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: clean }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPinVerificationMsg({
          type: 'success',
          text: data.message || 'Handshake PIN verified successfully! Trade status marked as completed.',
        });
        setHandshakePin('');
        // Refresh dashboard data so the proposal updates to COMPLETED
        fetchDashboardData();
      } else {
        setPinVerificationMsg({
          type: 'error',
          text: data.error || 'Failed to verify handshake PIN.',
        });
      }
    } catch (err: any) {
      setPinVerificationMsg({
        type: 'error',
        text: err?.message || 'Network error verifying handshake PIN.',
      });
    } finally {
      setVerifyingPin(false);
    }
  };

  if (!loading && !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-14 h-14 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
          <Repeat className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Sign in to view your offers & swaps</h2>
        <p className="text-xs text-gray-500">
          Your barter proposals, cash counter-offers, and in-person handshake verification PINs are protected and require signing in.
        </p>
        <Link
          href="/login?redirect=/offers"
          className="inline-block px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm"
        >
          Sign In to View Offers
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant/30 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed text-primary text-[11px] font-bold mb-2">
            <Repeat className="w-3.5 h-3.5" />
            <span>Negotiation Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Offers & Barter Negotiation Hub
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Review incoming barter swaps, respond to cash offers, verify handover PINs, and finalize safe local swaps.
          </p>
        </div>
      </div>

      {/* Handshake PIN Verification Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-primary/10 via-surface-container to-secondary/10 border border-primary/20 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3 h-3" />
            <span>In-Person Safety</span>
          </div>
          <h3 className="font-extrabold text-lg text-on-surface">Enter Handshake PIN: Verify Swap Delivery</h3>
          <p className="text-xs text-on-surface-variant mt-1 max-w-lg">
            When meeting in person, ask the trader for their verification handshake code (e.g. <strong className="font-mono text-primary">TRD-8492</strong>) to verify item delivery and mark the swap as completed.
          </p>
          {pinVerificationMsg && (
            <div
              className={`text-xs font-bold mt-2 px-3.5 py-2 rounded-xl border flex items-center gap-2 ${
                pinVerificationMsg.type === 'success'
                  ? 'text-emerald-800 bg-emerald-50 border-emerald-300'
                  : 'text-rose-800 bg-rose-50 border-rose-300'
              }`}
            >
              {pinVerificationMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{pinVerificationMsg.text}</span>
            </div>
          )}
        </div>

        <form onSubmit={(e) => handleVerifyHandshakePin(e)} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            maxLength={12}
            placeholder="e.g. TRD-8492"
            value={handshakePin}
            onChange={(e) => setHandshakePin(e.target.value.toUpperCase())}
            className="w-full sm:w-44 h-11 px-4 bg-surface-container-lowest border border-outline-variant/50 rounded-full text-center font-mono text-sm font-bold tracking-wider text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-inner uppercase"
          />
          <button
            type="submit"
            disabled={verifyingPin || !handshakePin.trim()}
            className="h-11 px-6 rounded-full bg-primary hover:bg-primary-container disabled:opacity-50 text-white text-xs font-bold shadow-lift transition-all shrink-0 flex items-center justify-center gap-2"
          >
            {verifyingPin ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <span>Verify Handshake</span>
            )}
          </button>
        </form>
      </div>

      {/* Navigation Pill Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-surface-container-low rounded-2xl">
        <button
          onClick={() => setActiveTab('RECEIVED_BARTERS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'RECEIVED_BARTERS'
              ? 'bg-primary text-white shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <Repeat className="w-3.5 h-3.5" />
          <span>Received Barters ({receivedBarters.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('SENT_BARTERS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'SENT_BARTERS'
              ? 'bg-primary text-white shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <Repeat className="w-3.5 h-3.5" />
          <span>Sent Barters ({sentBarters.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('RECEIVED_OFFERS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'RECEIVED_OFFERS'
              ? 'bg-primary text-white shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Received Cash Offers ({receivedOffers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('SENT_OFFERS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'SENT_OFFERS'
              ? 'bg-primary text-white shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Sent Cash Offers ({sentOffers.length})</span>
        </button>
      </div>

      {/* Content View */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-32 bg-surface-container rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* TAB 1: RECEIVED BARTERS */}
          {activeTab === 'RECEIVED_BARTERS' && (
            receivedBarters.length === 0 ? (
              <div className="p-12 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
                <Repeat className="w-10 h-10 text-outline mx-auto mb-3" />
                <h3 className="font-bold text-on-surface text-sm">No incoming barter proposals</h3>
                <p className="text-xs text-on-surface-variant mt-1">When someone offers to swap items for your listings, they will appear here.</p>
              </div>
            ) : (
              receivedBarters.map((proposal) => (
                <div key={proposal.id} className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-outline-variant/20">
                    <div className="flex items-center gap-3">
                      <img
                        src={proposal.initiator.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={proposal.initiator.name}
                        className="w-10 h-10 rounded-full object-cover border border-outline-variant/40"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-on-surface">{proposal.initiator.name}</span>
                          {proposal.initiator.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-primary" />}
                          <span className="text-xs text-tertiary font-bold">★ {proposal.initiator.reputationScore.toFixed(1)}</span>
                        </div>
                        <p className="text-xs text-outline">Proposed {formatDate(proposal.createdAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        proposal.status === 'ACCEPTED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : proposal.status === 'COMPLETED'
                          ? 'bg-primary-fixed text-primary'
                          : proposal.status === 'REJECTED'
                          ? 'bg-clay/10 text-clay'
                          : 'bg-secondary-fixed text-secondary'
                      }`}>
                        {proposal.status}
                      </span>
                    </div>
                  </div>

                  {/* Trade details: target vs offered */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                        Your Item (Target)
                      </span>
                      <div className="flex items-center gap-3">
                        <img
                          src={proposal.targetListing.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100'}
                          alt={proposal.targetListing.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-xs font-bold text-gray-900">{proposal.targetListing.title}</p>
                          <p className="text-[11px] text-gray-700">Condition: {proposal.targetListing.condition}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block mb-1.5">
                        Offered in Swap ({proposal.offeredItems.length} item{proposal.offeredItems.length > 1 ? 's' : ''})
                      </span>
                      <div className="space-y-1.5">
                        {proposal.offeredItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-2">
                            <img
                              src={item.listing.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100'}
                              alt={item.listing.title}
                              className="w-8 h-8 rounded-md object-cover"
                            />
                            <span className="text-xs font-semibold text-gray-800 truncate">{item.listing.title}</span>
                          </div>
                        ))}
                      </div>
                      {proposal.cashTopUp > 0 && (
                        <div className="mt-2 text-xs font-bold text-emerald-700 bg-emerald-100/60 px-2.5 py-1 rounded-md inline-block">
                          + Includes ${proposal.cashTopUp} Cash Top-Up from Buyer
                        </div>
                      )}
                    </div>
                  </div>

                  {proposal.notes && (
                    <p className="text-xs text-gray-600 bg-white p-3 rounded-xl border border-gray-100 italic">
                      "{proposal.notes}"
                    </p>
                  )}

                  {/* Verification Code Box when ACCEPTED */}
                  {proposal.status === 'ACCEPTED' && proposal.exchangeCode && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-emerald-900">Exchange Verification Code</p>
                        <p className="text-xs text-emerald-700 mt-0.5">Share and verify this code during in-person physical meetup.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3.5 py-1.5 bg-emerald-600 text-white font-mono font-black text-sm rounded-lg shadow-sm">
                          {proposal.exchangeCode}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setHandshakePin(proposal.exchangeCode!);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="px-2.5 py-1.5 bg-white hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-lg border border-emerald-300 shadow-2xs transition-colors"
                          title="Fill this code into the handshake verification box above"
                        >
                          Auto-Fill
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <Link
                      href={`/messages?recipientId=${proposal.initiatorId}&listingId=${proposal.targetListingId}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Chat with Trader
                    </Link>

                    <div className="flex items-center gap-2">
                      {proposal.status === 'PROPOSED' && (
                        <>
                          <button
                            onClick={() => handleBarterAction(proposal.id, 'REJECT')}
                            className="px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            Decline Swap
                          </button>
                          <button
                            onClick={() => handleBarterAction(proposal.id, 'ACCEPT')}
                            className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-sm transition-all"
                          >
                            Accept Barter
                          </button>
                        </>
                      )}

                      {proposal.status === 'ACCEPTED' && (
                        <button
                          onClick={() => handleBarterAction(proposal.id, 'COMPLETE')}
                          className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Mark Trade Handover Completed
                        </button>
                      )}

                      {proposal.status === 'COMPLETED' && (
                        <button
                          onClick={() => openReviewForBarter(proposal)}
                          className="px-4 py-2 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl flex items-center gap-1.5"
                        >
                          <Star className="w-3.5 h-3.5 fill-amber-500" /> Leave Verified Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )
          )}

          {/* TAB 2: SENT BARTERS */}
          {activeTab === 'SENT_BARTERS' && (
            sentBarters.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-gray-200">
                <Repeat className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 text-sm">No outgoing barter proposals</h3>
                <p className="text-xs text-gray-700 mt-1">When you propose trades on listings, they will show up here.</p>
              </div>
            ) : (
              sentBarters.map((proposal) => (
                <div key={proposal.id} className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div>
                      <span className="text-xs text-gray-700">Sent to <strong>{proposal.recipient.name}</strong> • {formatDate(proposal.createdAt)}</span>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                      {proposal.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={proposal.targetListing.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100'}
                      alt={proposal.targetListing.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-700 font-semibold">You requested item:</p>
                      <h4 className="text-sm font-bold text-gray-900 truncate">{proposal.targetListing.title}</h4>
                      <p className="text-xs text-purple-700 font-semibold mt-0.5">
                        Offered: {proposal.offeredItems.length} item(s) {proposal.cashTopUp > 0 ? `+ $${proposal.cashTopUp} cash` : ''}
                      </p>
                    </div>
                  </div>

                  {proposal.exchangeCode && proposal.status !== 'COMPLETED' && (
                    <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>Meetup Verification Code:</span>
                        <strong className="font-mono font-bold text-sm bg-white px-2 py-0.5 rounded border border-emerald-200">
                          {proposal.exchangeCode}
                        </strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setHandshakePin(proposal.exchangeCode!);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-lg border border-emerald-300 shadow-2xs transition-colors"
                      >
                        Auto-Fill
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <Link
                      href={`/messages?recipientId=${proposal.recipientId}&listingId=${proposal.targetListingId}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Chat with Owner
                    </Link>

                    {proposal.status === 'COMPLETED' && (
                      <button
                        onClick={() => openReviewForBarter(proposal)}
                        className="px-4 py-1.5 text-xs font-bold text-amber-700 bg-amber-50 rounded-xl"
                      >
                        Leave Review
                      </button>
                    )}
                  </div>
                </div>
              ))
            )
          )}

          {/* TAB 3: RECEIVED CASH OFFERS */}
          {activeTab === 'RECEIVED_OFFERS' && (
            receivedOffers.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-gray-200">
                <DollarSign className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 text-sm">No incoming cash offers</h3>
                <p className="text-xs text-gray-700 mt-1">Offers made by buyers on your items will appear here.</p>
              </div>
            ) : (
              receivedOffers.map((offer) => (
                <div key={offer.id} className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={offer.buyer.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={offer.buyer.name}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                      <div>
                        <span className="font-bold text-sm text-gray-900">{offer.buyer.name}</span>
                        <p className="text-xs text-gray-700">Offered {formatDate(offer.createdAt)}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      offer.status === 'ACCEPTED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : offer.status === 'COUNTERED'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {offer.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 bg-slate-50 p-3.5 rounded-xl">
                    <img
                      src={offer.listing.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100'}
                      alt={offer.listing.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 truncate">{offer.listing.title}</h4>
                      <p className="text-xs text-gray-700">List Asking Price: {formatPrice(offer.listing.price)}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-gray-700 block">Offer Amount</span>
                      <span className="text-xl font-black text-emerald-600">{formatPrice(offer.offerAmount)}</span>
                      {offer.counterAmount && (
                        <p className="text-xs text-amber-600 font-bold">Countered: {formatPrice(offer.counterAmount)}</p>
                      )}
                    </div>
                  </div>

                  {offer.message && (
                    <p className="text-xs text-gray-600 italic bg-white p-3 rounded-xl border border-gray-100">
                      "{offer.message}"
                    </p>
                  )}

                  {/* Counter Offer Input Box */}
                  {counterInputId === offer.id && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
                      <span className="text-xs font-bold text-amber-900">Your Counter Price: $</span>
                      <input
                        type="number"
                        step="0.5"
                        value={counterAmount}
                        onChange={(e) => setCounterAmount(e.target.value)}
                        placeholder="Enter counter"
                        className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs w-28 font-bold"
                      />
                      <button
                        onClick={() => handleOfferAction(offer.id, 'COUNTER', parseFloat(counterAmount))}
                        className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700"
                      >
                        Send Counter
                      </button>
                      <button
                        onClick={() => setCounterInputId(null)}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <Link
                      href={`/messages?recipientId=${offer.buyerId}&listingId=${offer.listingId}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Chat with Buyer
                    </Link>

                    <div className="flex items-center gap-2">
                      {offer.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleOfferAction(offer.id, 'DECLINE')}
                            className="px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => setCounterInputId(offer.id)}
                            className="px-3 py-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg"
                          >
                            Counter-Offer
                          </button>
                          <button
                            onClick={() => handleOfferAction(offer.id, 'ACCEPT')}
                            className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
                          >
                            Accept ${offer.offerAmount}
                          </button>
                        </>
                      )}

                      {offer.status === 'ACCEPTED' && (
                        <button
                          onClick={() => handleOfferAction(offer.id, 'COMPLETE')}
                          className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
                        >
                          Mark Sale Completed
                        </button>
                      )}

                      {offer.status === 'COMPLETED' && (
                        <button
                          onClick={() => openReviewForOffer(offer)}
                          className="px-4 py-1.5 text-xs font-bold text-amber-700 bg-amber-50 rounded-lg flex items-center gap-1"
                        >
                          <Star className="w-3.5 h-3.5 fill-amber-500" /> Review Buyer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )
          )}

          {/* TAB 4: SENT CASH OFFERS */}
          {activeTab === 'SENT_OFFERS' && (
            sentOffers.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-gray-200">
                <DollarSign className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 text-sm">No outgoing cash offers</h3>
                <p className="text-xs text-gray-700 mt-1">Browse the catalog to make an offer on any book or gear listing.</p>
              </div>
            ) : (
              sentOffers.map((offer) => (
                <div key={offer.id} className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <span className="text-xs text-gray-700">Sent to seller <strong>{offer.seller.name}</strong> • {formatDate(offer.createdAt)}</span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      {offer.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <img
                      src={offer.listing.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100'}
                      alt={offer.listing.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 truncate">{offer.listing.title}</h4>
                      <p className="text-xs text-emerald-600 font-bold mt-0.5">Your Offer: {formatPrice(offer.offerAmount)}</p>
                      {offer.counterAmount && (
                        <p className="text-xs text-amber-600 font-bold">Seller Countered: {formatPrice(offer.counterAmount)}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Link
                      href={`/messages?recipientId=${offer.sellerId}&listingId=${offer.listingId}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Open Chat Thread
                    </Link>

                    {offer.status === 'COUNTERED' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOfferAction(offer.id, 'ACCEPT')}
                          className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
                        >
                          Accept Counter ${offer.counterAmount}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )
          )}

        </div>
      )}

      {/* Review Modal */}
      {reviewTarget && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setReviewTarget(null);
          }}
          targetUserId={reviewTarget.targetUserId}
          targetUserName={reviewTarget.targetUserName}
          listingId={reviewTarget.listingId}
          transactionType={reviewTarget.transactionType}
          onReviewSubmitted={() => {
            fetchDashboardData();
          }}
        />
      )}

    </div>
  );
}
