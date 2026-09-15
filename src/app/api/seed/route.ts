import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed-data';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const stats = await seedDatabase();
    return NextResponse.json({
      success: true,
      message: 'Database seeded with realistic mock users, books, products, barters, offers, chats, and reviews.',
      stats,
    });
  } catch (error: any) {
    console.error('Seeding API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return POST();
}
