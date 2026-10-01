import { NextRequest, NextResponse } from 'next/server';
import { verifyTradeLeg } from '@/lib/multi-party-trade';
import { resolveUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await resolveUser(req);
    const body = await req.json();

    const result = await verifyTradeLeg({
      tradeId: params.id,
      legId: body.legId,
      pin: body.pin,
      verifierUserId: user?.id || body.userId,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error verifying trade leg:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
