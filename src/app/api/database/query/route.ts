import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawQuery = (body.query || '').trim();

    if (!rawQuery) {
      return NextResponse.json({ success: false, error: 'Query string cannot be empty.' }, { status: 400 });
    }

    // Safety check: allow read-only queries only
    const normalized = rawQuery.replace(/--.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').trim().toUpperCase();
    const forbiddenKeywords = ['DROP ', 'DELETE ', 'INSERT ', 'UPDATE ', 'ALTER ', 'TRUNCATE ', 'GRANT ', 'REVOKE ', 'EXEC ', 'CREATE '];
    
    for (const kw of forbiddenKeywords) {
      if (normalized.includes(kw)) {
        return NextResponse.json(
          {
            success: false,
            error: `Security policy violation: Only read-only queries (SELECT / WITH) are allowed in this database studio. Mutating statement detected: "${kw.trim()}".`,
          },
          { status: 403 }
        );
      }
    }

    if (!normalized.startsWith('SELECT') && !normalized.startsWith('WITH')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Security policy violation: Query must begin with SELECT or WITH (Common Table Expression).',
        },
        { status: 400 }
      );
    }

    // Execute query with execution timer
    const startTime = performance.now();
    const rawResults: any = await prisma.$queryRawUnsafe(rawQuery);
    const durationMs = Math.round((performance.now() - startTime) * 10) / 10;

    const rowsArray = Array.isArray(rawResults) ? rawResults : [rawResults];
    
    // Safely serialize BigInt and Date values
    const serializedRows = JSON.parse(
      JSON.stringify(rowsArray, (_key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );

    const columns = serializedRows.length > 0 ? Object.keys(serializedRows[0]) : [];

    return NextResponse.json({
      success: true,
      columns,
      rows: serializedRows,
      rowCount: serializedRows.length,
      durationMs,
    });
  } catch (err: any) {
    console.error('Custom SQL Execution error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || 'Failed to execute query in PostgreSQL 16 database.',
      },
      { status: 400 }
    );
  }
}
