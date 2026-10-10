import { NextResponse } from 'next/server';
import { syncPostgresToNeo4j } from '@/lib/neo4j';

export async function POST() {
  try {
    const result = await syncPostgresToNeo4j();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error syncing PostgreSQL to Neo4j:', error);
    return NextResponse.json(
      { error: 'Sync failed', details: error.message },
      { status: 500 }
    );
  }
}
