import { NextRequest, NextResponse } from 'next/server';
import { updateBookingStatus } from '@/lib/dataService';
import { getAdminFromRequest } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const body = await req.json();
    const { status } = body;

    if (!['Waiting', 'Booked', 'Unbooked', 'Cancelled'].includes(status)) {
      return NextResponse.json({ error: 'Invalid booking status' }, { status: 400 });
    }

    const updated = await updateBookingStatus(params.id, status);
    if (!updated) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, booking: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update booking' }, { status: 500 });
  }
}
