import { NextResponse } from 'next/server';
import { getBarterGraphOverview } from '@/lib/neo4j';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getBarterGraphOverview();
    return NextResponse.json({ cycles: data.cycles });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
