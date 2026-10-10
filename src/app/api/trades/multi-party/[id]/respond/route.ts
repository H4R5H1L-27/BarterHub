import { NextRequest, NextResponse } from 'next/server';
import { respondToMultiPartyTrade } from '@/lib/multi-party-trade';
import { resolveUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await resolveUser(req);
    const body = await req.json();

    const userId = user?.id || body.userId;
    if (!userId) {
      return NextResponse.json({ error: 'You must be signed in to respond to a trade' }, { status: 401 });
    }

    // A user cannot accept or decline on behalf of another user
    if (user?.id && body.userId && body.userId !== user.id) {
      return NextResponse.json({ error: 'You can only respond for yourself' }, { status: 403 });
    }

    const result = await respondToMultiPartyTrade({
      tradeId: params.id,
      userId,
      action: body.action || 'ACCEPT',
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error responding to multi-party trade:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
