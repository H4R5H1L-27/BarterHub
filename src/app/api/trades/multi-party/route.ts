import { NextRequest, NextResponse } from 'next/server';
import { loadMultiPartyTrades, createMultiPartyTrade, autoDetectAndCreateTradeChains } from '@/lib/multi-party-trade';
import { resolveUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const authUser = await resolveUser(req);
    const userId = searchParams.get('userId') || authUser?.id;
    const status = searchParams.get('status');

    let trades = loadMultiPartyTrades();

    // If requesting for a specific user, check if they already have trade chains
    const userHasTrades = userId
      ? trades.some((t) => t.participants.some((p) => p.userId === userId))
      : trades.length > 0;

    // Automatically detect and populate trade chains matching threshold if none exist for this user
    if (!userHasTrades || searchParams.get('auto') === 'true') {
      const autoRes = await autoDetectAndCreateTradeChains(0.85, userId);
      trades = autoRes.trades;
    }

    if (userId) {
      trades = trades.filter((t) => t.participants.some((p) => p.userId === userId));

      // Security & UX: Only the person RECEIVING the item (toUserId) sees the confirmation PIN.
      // The person delivering (fromUserId) must get it from the recipient during physical meetup.
      // Third parties never see it.
      trades = trades.map((t) => ({
        ...t,
        legs: t.legs.map((leg) => {
          if (leg.toUserId === userId) {
            return leg; // Receiver gets their legitimate confirmation code
          }
          return {
            ...leg,
            handshakePin: leg.isDelivered ? leg.handshakePin : '••••••••',
          };
        }),
      }));
    } else if (!searchParams.get('all')) {
      // If unauthenticated and no user specified, return empty array for privacy
      trades = [];
    }

    if (status) {
      trades = trades.filter((t) => t.status === status);
    }

    return NextResponse.json({ trades });
  } catch (error: any) {
    console.error('Error fetching multi-party trades:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await resolveUser(req);
    const body = await req.json();

    const trade = await createMultiPartyTrade({
      cycleId: body.cycleId,
      summary: body.summary,
      efficiencyGain: body.efficiencyGain,
      users: body.users,
      items: body.items,
      initiatorUserId: user?.id,
    });

    return NextResponse.json({ success: true, trade });
  } catch (error: any) {
    console.error('Error creating multi-party trade:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
