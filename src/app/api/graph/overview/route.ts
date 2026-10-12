import { NextResponse } from 'next/server';
import { getBarterGraphOverview } from '@/lib/neo4j';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getBarterGraphOverview();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching graph overview:', error);
    return NextResponse.json(
      { error: 'Failed to fetch graph data', details: error.message },
      { status: 500 }
    );
  }
}
