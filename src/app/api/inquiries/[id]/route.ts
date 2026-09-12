import { NextRequest, NextResponse } from 'next/server';
import { updateInquiryStatus } from '@/lib/dataService';
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

    if (!['New', 'Contacted', 'Resolved', 'Closed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid inquiry status' }, { status: 400 });
    }

    const updated = await updateInquiryStatus(params.id, status);
    if (!updated) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, inquiry: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update inquiry status' }, { status: 500 });
  }
}
