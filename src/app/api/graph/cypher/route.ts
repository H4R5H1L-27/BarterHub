import { NextRequest, NextResponse } from 'next/server';
import { executeCypher } from '@/lib/neo4j';

export async function POST(req: NextRequest) {
  try {
    const { query, params } = await req.json();
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query string is required' }, { status: 400 });
    }

    const result = await executeCypher(query, params || {});
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error executing Cypher query:', error);
    return NextResponse.json(
      { error: 'Failed to execute Cypher query', details: error.message },
      { status: 500 }
    );
  }
}
