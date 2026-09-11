import { NextRequest, NextResponse } from 'next/server';
import { getRooms, createRoom } from '@/lib/dataService';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const floor = searchParams.get('floor') ? Number(searchParams.get('floor')) : undefined;
    const availability = searchParams.get('availability') || undefined;

    const rooms = await getRooms({ floor, availability });
    return NextResponse.json({ success: true, count: rooms.length, rooms });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch rooms' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.roomNumber || !body.floor || !body.price || !body.type) {
      return NextResponse.json({ error: 'Missing required room fields' }, { status: 400 });
    }

    const room = await createRoom({
      ...body,
      floor: Number(body.floor),
      price: Number(body.price),
      capacity: Number(body.capacity || 1),
      facilities: Array.isArray(body.facilities) ? body.facilities : [],
      images: Array.isArray(body.images) ? body.images : [],
    });

    return NextResponse.json({ success: true, room }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create room' }, { status: 500 });
  }
}
