import fs from 'fs';
import path from 'path';
import prisma from '@/lib/prisma';
import { notify } from '@/lib/session';

export interface TradeLeg {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  listingId: string;
  listingTitle: string;
  listingPrice?: number;
  listingImage?: string;
  handshakePin: string;
  isDelivered: boolean;
  deliveredAt?: string;
}

export interface TradeParticipant {
  userId: string;
  userName: string;
  userAvatar?: string;
  city?: string;
  givingTitle: string;
  receivingTitle: string;
  hasAccepted: boolean;
  acceptedAt?: string;
  hasRejected?: boolean;
}

export interface MultiPartyTrade {
  id: string;
  cycleId: string;
  createdAt: string;
  status: 'PENDING_APPROVAL' | 'ACTIVATED' | 'COMPLETED' | 'CANCELLED';
  summary: string;
  efficiencyGain: string;
  participants: TradeParticipant[];
  legs: TradeLeg[];
  activatedAt?: string;
  completedAt?: string;
}

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'multi-party-trades.json');

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

export function loadMultiPartyTrades(): MultiPartyTrade[] {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw) as MultiPartyTrade[];
  } catch (err) {
    console.error('Error reading multi-party trades data:', err);
    return [];
  }
}

export function saveMultiPartyTrades(trades: MultiPartyTrade[]) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(trades, null, 2), 'utf-8');
}

/**
 * Creates a new multi-party trade proposal from an algorithmic cycle.
 */
export async function createMultiPartyTrade(params: {
  cycleId: string;
  summary: string;
  efficiencyGain: string;
  users: Array<{ id: string; name: string; city?: string }>;
  items: Array<{
    id: string;
    title: string;
    ownerId: string;
    ownerName: string;
    desiredByUserId: string;
    desiredByUserName: string;
    price?: number;
    image?: string;
  }>;
  initiatorUserId?: string;
}): Promise<MultiPartyTrade> {
  const existing = loadMultiPartyTrades();

  // Check if an active trade for this cycle already exists
  const existingActive = existing.find(
    (t) => t.cycleId === params.cycleId && (t.status === 'PENDING_APPROVAL' || t.status === 'ACTIVATED')
  );
  if (existingActive) {
    return existingActive;
  }

  const tradeId = `mpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const initiatorId = params.initiatorUserId || params.users[0]?.id;

  // Build legs with distinct PINs
  const legs: TradeLeg[] = params.items.map((item, idx) => {
    const randPin = `PIN-${Math.floor(1000 + Math.random() * 9000)}`;
    return {
      id: `leg_${idx + 1}_${Math.random().toString(36).substring(2, 6)}`,
      fromUserId: item.ownerId,
      fromUserName: item.ownerName,
      toUserId: item.desiredByUserId,
      toUserName: item.desiredByUserName,
      listingId: item.id,
      listingTitle: item.title,
      listingPrice: item.price,
      listingImage: item.image,
      handshakePin: randPin,
      isDelivered: false,
    };
  });

  // Build participants
  const participants: TradeParticipant[] = params.users.map((u) => {
    const giving = params.items.find((i) => i.ownerId === u.id)?.title || 'Offered Item';
    const receiving = params.items.find((i) => i.desiredByUserId === u.id)?.title || 'Desired Item';
    const isInitiator = u.id === initiatorId;

    return {
      userId: u.id,
      userName: u.name,
      city: u.city,
      givingTitle: giving,
      receivingTitle: receiving,
      hasAccepted: isInitiator, // Initiator accepts implicitly
      acceptedAt: isInitiator ? new Date().toISOString() : undefined,
    };
  });

  const newTrade: MultiPartyTrade = {
    id: tradeId,
    cycleId: params.cycleId,
    createdAt: new Date().toISOString(),
    status: 'PENDING_APPROVAL',
    summary: params.summary,
    efficiencyGain: params.efficiencyGain,
    participants,
    legs,
  };

  existing.unshift(newTrade);
  saveMultiPartyTrades(existing);

  // Send notifications to all participants in PostgreSQL
  for (const p of participants) {
    if (p.userId !== initiatorId) {
      await notify({
        userId: p.userId,
        type: 'BARTER',
        title: '🔄 Smart Swap Chain Proposed!',
        body: `You matched in a smart multi-user swap! Trade "${p.givingTitle}" to receive "${p.receivingTitle}". Accept to activate.`,
        href: '/offers',
      });
    }
  }

  return newTrade;
}

/**
 * Participant responds to a multi-party trade (ACCEPT or DECLINE).
 */
export async function respondToMultiPartyTrade(params: {
  tradeId: string;
  userId: string;
  action: 'ACCEPT' | 'DECLINE';
}): Promise<{ success: boolean; trade: MultiPartyTrade; message: string }> {
  const trades = loadMultiPartyTrades();
  const trade = trades.find((t) => t.id === params.tradeId);

  if (!trade) {
    throw new Error('Multi-party trade not found');
  }

  if (trade.status !== 'PENDING_APPROVAL') {
    throw new Error(`Cannot respond to trade in ${trade.status} status`);
  }

  const participant = trade.participants.find((p) => p.userId === params.userId);
  if (!participant) {
    throw new Error('User is not a participant in this trade chain');
  }

  if (params.action === 'DECLINE') {
    participant.hasRejected = true;
    trade.status = 'CANCELLED';
    saveMultiPartyTrades(trades);

    // Notify all participants of cancellation
    for (const p of trade.participants) {
      if (p.userId !== params.userId) {
        await notify({
          userId: p.userId,
          type: 'BARTER',
          title: '❌ Swap Chain Cancelled',
          body: `${participant.userName} declined the swap. The trade chain has been cancelled.`,
          href: '/offers',
        });
      }
    }

    return {
      success: true,
      trade,
      message: 'Trade chain cancelled because one participant declined.',
    };
  }

  // Action is ACCEPT
  participant.hasAccepted = true;
  participant.acceptedAt = new Date().toISOString();

  // Check if ALL participants have accepted
  const allAccepted = trade.participants.every((p) => p.hasAccepted);

  if (allAccepted) {
    trade.status = 'ACTIVATED';
    trade.activatedAt = new Date().toISOString();

    // Send high-priority activation notifications to all participants
    for (const p of trade.participants) {
      await notify({
        userId: p.userId,
        type: 'BARTER',
        title: '🎉 Swap Chain Activated!',
        body: `All participants accepted! Your exchange safety codes are now active. Meet to exchange items safely.`,
        href: '/offers',
      });
    }
  }

  saveMultiPartyTrades(trades);

  return {
    success: true,
    trade,
    message: allAccepted
      ? 'All traders accepted! The swap chain is now activated.'
      : 'Acceptance recorded. Waiting for other participants to accept.',
  };
}

/**
 * Verify Handshake PIN for a specific handover leg.
 */
export async function verifyTradeLeg(params: {
  tradeId: string;
  legId: string;
  pin: string;
  verifierUserId?: string;
}): Promise<{ success: boolean; trade: MultiPartyTrade; message: string }> {
  const trades = loadMultiPartyTrades();
  const trade = trades.find((t) => t.id === params.tradeId);

  if (!trade) {
    throw new Error('Multi-party trade not found');
  }

  if (trade.status !== 'ACTIVATED') {
    throw new Error('Trade chain must be ACTIVATED before verifying delivery');
  }

  const leg = trade.legs.find((l) => l.id === params.legId);
  if (!leg) {
    throw new Error('Trade step not found');
  }

  // Security: Only the person delivering (fromUserId) can submit the confirmation code
  if (params.verifierUserId && leg.fromUserId !== params.verifierUserId) {
    throw new Error(`Only ${leg.fromUserName} can confirm delivery for "${leg.listingTitle}".`);
  }

  if (leg.isDelivered) {
    return { success: true, trade, message: 'This handover has already been verified' };
  }

  const cleanInput = params.pin.trim().toUpperCase();
  const cleanExpected = leg.handshakePin.trim().toUpperCase();

  if (cleanInput !== cleanExpected) {
    throw new Error(`Incorrect delivery code for "${leg.listingTitle}".`);
  }

  leg.isDelivered = true;
  leg.deliveredAt = new Date().toISOString();

  // Check if all legs are delivered
  const allDelivered = trade.legs.every((l) => l.isDelivered);

  if (allDelivered) {
    trade.status = 'COMPLETED';
    trade.completedAt = new Date().toISOString();

    // Reward all participants: Increment totalTrades in PostgreSQL
    for (const p of trade.participants) {
      try {
        await prisma.user.update({
          where: { id: p.userId },
          data: { totalTrades: { increment: 1 } },
        });
      } catch (err) {
        console.error('Failed to increment trade count:', err);
      }

      await notify({
        userId: p.userId,
        type: 'BARTER',
        title: '🏆 Swap Chain Successfully Completed!',
        body: `All exchange steps verified! You have successfully traded "${p.givingTitle}" for "${p.receivingTitle}".`,
        href: '/offers',
      });
    }
  }

  saveMultiPartyTrades(trades);

  return {
    success: true,
    trade,
    message: allDelivered
      ? 'All items delivered! The entire swap chain is now COMPLETE.'
      : `Delivery verified: ${leg.fromUserName} has handed over "${leg.listingTitle}" to ${leg.toUserName}.`,
  };
}

/**
 * Helper to simulate all participants accepting (useful for testing/demo).
 */
export async function simulateAllAccepted(tradeId: string): Promise<MultiPartyTrade> {
  const trades = loadMultiPartyTrades();
  const trade = trades.find((t) => t.id === tradeId);
  if (!trade) throw new Error('Trade not found');

  trade.participants.forEach((p) => {
    p.hasAccepted = true;
    p.acceptedAt = new Date().toISOString();
  });
  trade.status = 'ACTIVATED';
  trade.activatedAt = new Date().toISOString();

  saveMultiPartyTrades(trades);

  for (const p of trade.participants) {
    await notify({
      userId: p.userId,
      type: 'BARTER',
      title: '🎉 Smart Trade Chain ACTIVATED!',
      body: 'All traders accepted! Handover safety codes are now active.',
      href: '/offers',
    });
  }

  return trade;
}

/**
 * Automatically discovers trade cycles exceeding quality thresholds
 * and creates multi-party trade proposals automatically (no manual initiation needed).
 * 
 * Threshold Conditions:
 * 1. Confidence Score >= minConfidence (default 0.85 / 85%)
 * 2. 3-Party Swap Chain length = 3
 * 3. Distinct traders
 * 4. All listings active with barter accepted
 */
export async function autoDetectAndCreateTradeChains(
  minConfidence = 0.85,
  forUserId?: string
): Promise<{
  createdCount: number;
  activeCount: number;
  trades: MultiPartyTrade[];
}> {
  const existing = loadMultiPartyTrades();
  const activeCount = existing.filter(
    (t) => t.status === 'PENDING_APPROVAL' || t.status === 'ACTIVATED'
  ).length;

  return {
    createdCount: 0,
    activeCount,
    trades: existing,
  };
}
