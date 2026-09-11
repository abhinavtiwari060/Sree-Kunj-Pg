import { NextRequest, NextResponse } from 'next/server';
import { getBookings, createBooking } from '@/lib/dataService';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const bookings = await getBookings();
    return NextResponse.json({ success: true, count: bookings.length, bookings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerPhone,
      residentName,
      residentPhone,
      relationship,
      floor,
      roomNumber,
      preferredMoveInDate,
    } = body;

    // Strict validation
    if (!customerName || !customerPhone || !residentName || !residentPhone || !floor || !roomNumber || !preferredMoveInDate) {
      return NextResponse.json(
        { error: 'Missing required booking fields. Please provide all details.' },
        { status: 400 }
      );
    }

    const booking = await createBooking(body);
    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to process booking request' }, { status: 500 });
  }
}
