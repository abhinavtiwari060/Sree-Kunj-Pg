import { NextResponse } from 'next/server';
import { ensureDbSeeded } from '@/lib/dataService';

export async function POST() {
  try {
    await ensureDbSeeded();
    return NextResponse.json({ success: true, message: 'Database initialized and seeded successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Seeding failed' }, { status: 500 });
  }
}
