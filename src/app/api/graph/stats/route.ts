import { NextResponse } from 'next/server';
import { getBarterGraphOverview } from '@/lib/neo4j';

export async function GET() {
  try {
    const data = await getBarterGraphOverview();
    return NextResponse.json({ stats: data.stats });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
