import { NextRequest, NextResponse } from 'next/server';
import { updateFacility, deleteFacility } from '@/lib/dataService';
import { getAdminFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';


export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const body = await req.json();
    const updated = await updateFacility(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Facility not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, facility: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update facility' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const success = await deleteFacility(params.id);
    if (!success) {
      return NextResponse.json({ error: 'Facility not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Facility deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete facility' }, { status: 500 });
  }
}
