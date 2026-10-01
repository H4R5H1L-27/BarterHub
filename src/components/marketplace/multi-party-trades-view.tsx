'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  Check,
  X,
  AlertCircle,
  KeyRound,
  PackageCheck,
  UserCheck,
} from 'lucide-react';
import { MultiPartyTrade } from '@/lib/multi-party-trade';

export default function MultiPartyTradesView({ currentUserId }: { currentUserId?: string }) {
  const [trades, setTrades] = useState<MultiPartyTrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [pinInputs, setPinInputs] = useState<Record<string, string>>({});
  const [resolvedUserId, setResolvedUserId] = useState<string | undefined>(currentUserId);

  useEffect(() => {
    // If currentUserId wasn't passed, fetch from /api/auth/me
    if (!currentUserId) {
      fetch('/api/auth/me')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.user?.id) {
            setResolvedUserId(data.user.id);
            fetchTrades(data.user.id);
          } else {
            setLoading(false);
          }
        })
        .catch(() => setLoading(false));
    } else {
      setResolvedUserId(currentUserId);
      fetchTrades(currentUserId);
    }
  }, [currentUserId]);

  const fetchTrades = async (userId?: string) => {
    try {
      setLoading(true);
      const uid = userId || resolvedUserId;
      const url = uid ? `/api/trades/multi-party?userId=${encodeURIComponent(uid)}` : '/api/trades/multi-party';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setTrades(data.trades || []);
      }
    } catch (err) {
      console.error('Failed to load swap chains:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (tradeId: string, action: 'ACCEPT' | 'DECLINE') => {
    try {
      setActionLoading(`${tradeId}-${action}`);
      const res = await fetch(`/api/trades/multi-party/${tradeId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, userId: resolvedUserId }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ text: data.message || 'Response recorded', type: 'success' });
        await fetchTrades();
      } else {
        setMsg({ text: data.error || 'Failed to submit response', type: 'error' });
      }
    } catch (err: any) {
      setMsg({ text: err.message, type: 'error' });
    } finally {
      setActionLoading(null);
      setTimeout(() => setMsg(null), 4000);
    }
  };

  const handleVerifyDelivery = async (tradeId: string, legId: string, pinToSubmit: string) => {
    try {
      setActionLoading(legId);
      const res = await fetch(`/api/trades/multi-party/${tradeId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ legId, pin: pinToSubmit }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ text: data.message, type: 'success' });
        await fetchTrades();
      } else {
        setMsg({ text: data.error, type: 'error' });
      }
    } catch (err: any) {
      setMsg({ text: err.message, type: 'error' });
    } finally {
      setActionLoading(null);
      setTimeout(() => setMsg(null), 4000);
    }
  };

  // Strictly filter to trades that involve this specific logged-in user
  const myTrades = resolvedUserId
    ? trades.filter((t) => t.participants.some((p) => p.userId === resolvedUserId))
    : trades;

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {msg && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2.5 transition-all shadow-sm ${
            msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-rose-50 text-rose-900 border border-rose-200'
          }`}
        >
          {msg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{msg.text}</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-on-surface-variant text-xs">
          Scanning your listings for circular smart match opportunities...
        </div>
      ) : myTrades.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-8 sm:p-12 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-on-surface">No Smart Swap Chains Right Now</h3>
            <p className="text-xs text-on-surface-variant max-w-md mx-auto">
              When a direct 1-to-1 swap isn&apos;t possible, our engine automatically detects 3-person trade loops matching your listings and wishlists without any cash needed.
            </p>
          </div>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold shadow-sm transition-all"
          >
            <span>Explore Marketplace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {myTrades.map((trade) => {
            const isPending = trade.status === 'PENDING_APPROVAL';
            const isActivated = trade.status === 'ACTIVATED';
            const isCompleted = trade.status === 'COMPLETED';
            const isCancelled = trade.status === 'CANCELLED';

            const myParticipant = trade.participants.find((p) => p.userId === resolvedUserId);
            const myApprovalPending = isPending && myParticipant && !myParticipant.hasAccepted && !myParticipant.hasRejected;

            return (
              <div
                key={trade.id}
                className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden"
              >
                {/* Header Bar */}
                <div className="p-6 bg-surface-container-low/50 border-b border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider border ${
                          isCompleted
                            ? 'bg-purple-100 text-purple-800 border-purple-200'
                            : isActivated
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : isPending
                            ? 'bg-amber-100 text-amber-900 border-amber-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {isPending
                          ? 'Awaiting All Approvals'
                          : isActivated
                          ? 'Active - Ready for Exchange'
                          : isCompleted
                          ? 'Swap Completed'
                          : 'Cancelled'}
                      </span>
                      <span className="text-xs text-on-surface-variant font-medium">
                        3-Trader Circular Swap
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-on-surface">
                      {trade.summary}
                    </p>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-6">
                  {/* Step 1: Participants & Consent */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-on-surface">
                      <span className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-primary" />
                        <span>1. Trader Approvals ({trade.participants.filter((p) => p.hasAccepted).length}/3 Accepted)</span>
                      </span>
                      <span className="text-[11px] text-on-surface-variant">
                        All 3 must accept before items are handed over
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {trade.participants.map((p) => {
                        const isMe = p.userId === resolvedUserId;

                        return (
                          <div
                            key={p.userId}
                            className={`p-4 rounded-2xl border text-xs space-y-3 transition-all ${
                              isMe
                                ? 'bg-primary-fixed/20 border-primary shadow-xs ring-1 ring-primary/20'
                                : p.hasAccepted
                                ? 'bg-emerald-50/40 border-emerald-200'
                                : p.hasRejected
                                ? 'bg-rose-50/40 border-rose-200'
                                : 'bg-surface-container-low border-outline-variant/30'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className="font-extrabold text-on-surface">
                                  {p.userName}
                                </span>
                                {isMe && (
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-white px-2 py-0.5 rounded-full border border-primary/30">
                                    You
                                  </span>
                                )}
                              </div>

                              {p.hasAccepted ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                                  <Check className="w-3 h-3" />
                                  <span>Accepted</span>
                                </span>
                              ) : p.hasRejected ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-300">
                                  <X className="w-3 h-3" />
                                  <span>Declined</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                                  <Clock className="w-3 h-3" />
                                  <span>Pending</span>
                                </span>
                              )}
                            </div>

                            <div className="space-y-1 text-[11px]">
                              <div className="text-on-surface-variant">
                                Gives: <strong className="text-on-surface">{p.givingTitle}</strong>
                              </div>
                              <div className="text-primary font-semibold">
                                Receives: <strong className="text-primary">{p.receivingTitle}</strong>
                              </div>
                            </div>

                            {/* Only the current user gets Accept/Decline controls on their own card */}
                            {isMe && myApprovalPending && (
                              <div className="flex items-center gap-2 pt-2 border-t border-outline-variant/20">
                                <button
                                  onClick={() => handleRespond(trade.id, 'ACCEPT')}
                                  disabled={actionLoading === `${trade.id}-ACCEPT`}
                                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Accept Swap</span>
                                </button>
                                <button
                                  onClick={() => handleRespond(trade.id, 'DECLINE')}
                                  disabled={actionLoading === `${trade.id}-DECLINE`}
                                  className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-rose-50 hover:text-rose-700 text-on-surface-variant font-bold text-xs transition-all disabled:opacity-50"
                                >
                                  Decline
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 2: Exchange & Delivery Handover */}
                  {(isActivated || isCompleted) && (
                    <div className="space-y-4 pt-4 border-t border-outline-variant/20">
                      <div className="flex items-center justify-between text-xs font-bold text-on-surface">
                        <span className="flex items-center gap-1.5 text-primary">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>2. Physical Meetup & Handover Verification ({trade.legs.filter((l) => l.isDelivered).length}/3 Complete)</span>
                        </span>
                        <span className="text-[11px] text-on-surface-variant font-medium">
                          Each handover requires the recipient to give their code to the deliverer
                        </span>
                      </div>

                      <div className="space-y-3">
                        {(() => {
                          const incomingLeg = trade.legs.find((l) => l.toUserId === resolvedUserId);
                          const outgoingLeg = trade.legs.find((l) => l.fromUserId === resolvedUserId);
                          const otherLeg = trade.legs.find(
                            (l) => l.fromUserId !== resolvedUserId && l.toUserId !== resolvedUserId
                          );

                          return (
                            <>
                              {/* 1. INCOMING ITEM: User is the RECEIVER */}
                              {incomingLeg && (
                                <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/30 space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                                        ↓
                                      </span>
                                      <span className="font-extrabold text-xs text-emerald-950">
                                        Your Incoming Item: Receive &quot;{incomingLeg.listingTitle}&quot;
                                      </span>
                                    </div>
                                    {incomingLeg.isDelivered ? (
                                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200">
                                        <PackageCheck className="w-3.5 h-3.5 text-purple-600" />
                                        <span>Received & Verified</span>
                                      </span>
                                    ) : (
                                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                                        Awaiting Delivery from {incomingLeg.fromUserName}
                                      </span>
                                    )}
                                  </div>

                                  {!incomingLeg.isDelivered && (
                                    <div className="p-3 bg-white rounded-xl border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                      <div className="text-xs text-slate-700">
                                        <p className="font-bold text-slate-900">Your Delivery Confirmation Code:</p>
                                        <p className="text-[11px] text-slate-500 mt-0.5">
                                          Meet <strong>{incomingLeg.fromUserName}</strong> in person. Once you inspect and receive the item, share this secret code with them so they can complete their delivery:
                                        </p>
                                      </div>
                                      <span className="font-mono text-base font-black text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-300 shadow-2xs self-start sm:self-auto shrink-0 tracking-wider">
                                        {incomingLeg.handshakePin}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* 2. OUTGOING HANDOVER: User is the DELIVERER */}
                              {outgoingLeg && (
                                <div className="p-4 rounded-2xl border border-primary/30 bg-primary-fixed/10 space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className="w-6 h-6 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center">
                                        ↑
                                      </span>
                                      <span className="font-extrabold text-xs text-on-surface">
                                        Your Outgoing Handover: Deliver &quot;{outgoingLeg.listingTitle}&quot; to {outgoingLeg.toUserName}
                                      </span>
                                    </div>
                                    {outgoingLeg.isDelivered ? (
                                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                                        <span>Handover Confirmed</span>
                                      </span>
                                    ) : (
                                      <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                                        Action Required by You
                                      </span>
                                    )}
                                  </div>

                                  {!outgoingLeg.isDelivered && (
                                    <div className="p-3 bg-white rounded-xl border border-primary/20 space-y-2">
                                      <p className="text-xs text-on-surface">
                                        Hand over the item to <strong>{outgoingLeg.toUserName}</strong> in person. Ask {outgoingLeg.toUserName} for their secret confirmation code and enter it below:
                                      </p>
                                      <div className="flex items-center gap-2">
                                        <input
                                          type="text"
                                          value={pinInputs[outgoingLeg.id] ?? ''}
                                          onChange={(e) =>
                                            setPinInputs((prev) => ({
                                              ...prev,
                                              [outgoingLeg.id]: e.target.value.toUpperCase(),
                                            }))
                                          }
                                          placeholder="Enter PIN-XXXX"
                                          className="font-mono text-xs px-3.5 py-2 rounded-xl border border-outline-variant/60 w-36 text-center bg-surface-container-lowest uppercase font-bold tracking-wider"
                                        />
                                        <button
                                          onClick={() =>
                                            handleVerifyDelivery(
                                              trade.id,
                                              outgoingLeg.id,
                                              pinInputs[outgoingLeg.id] ?? ''
                                            )
                                          }
                                          disabled={
                                            actionLoading === outgoingLeg.id ||
                                            !(pinInputs[outgoingLeg.id] ?? '').trim()
                                          }
                                          className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                                        >
                                          <KeyRound className="w-3.5 h-3.5" />
                                          <span>Verify Handover</span>
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* 3. THIRD-PARTY STEP: Exchange between the other two participants */}
                              {otherLeg && (
                                <div className="p-3.5 rounded-2xl border border-outline-variant/20 bg-surface-container-low/40 flex items-center justify-between text-xs opacity-75">
                                  <div className="space-y-0.5">
                                    <div className="font-semibold text-on-surface">
                                      {otherLeg.fromUserName} hands over &quot;{otherLeg.listingTitle}&quot; to {otherLeg.toUserName}
                                    </div>
                                    <div className="text-[11px] text-on-surface-variant">
                                      Handover between other participants in the chain
                                    </div>
                                  </div>
                                  {otherLeg.isDelivered ? (
                                    <span className="text-[11px] font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                                      Delivered
                                    </span>
                                  ) : (
                                    <span className="text-[11px] text-on-surface-variant bg-surface-container px-2.5 py-0.5 rounded-full font-medium">
                                      In Progress
                                    </span>
                                  )}
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Completion Celebration */}
                  {isCompleted && (
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-100 via-indigo-50 to-emerald-100 border border-purple-200 text-xs font-bold text-purple-950 flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-purple-600 shrink-0" />
                      <span>
                        All items have been delivered and verified! The swap chain is complete. Trade counts and reputation points have been credited to your account.
                      </span>
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
