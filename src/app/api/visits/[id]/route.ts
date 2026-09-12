import { NextRequest, NextResponse } from 'next/server';
import { updateVisitStatus } from '@/lib/dataService';
import { getAdminFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';


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

    if (!['Waiting', 'Confirmed', 'Completed', 'Cancelled'].includes(status)) {
      return NextResponse.json({ error: 'Invalid visit status' }, { status: 400 });
    }

    const updated = await updateVisitStatus(params.id, status);
    if (!updated) {
      return NextResponse.json({ error: 'Visit request not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, visit: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update visit status' }, { status: 500 });
  }
}
