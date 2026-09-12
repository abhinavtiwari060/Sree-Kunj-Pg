import { NextRequest, NextResponse } from 'next/server';
import { getFacilities, getAllFacilitiesAdmin, createFacility } from '@/lib/dataService';
import { getAdminFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';


export async function GET(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    const facilities = admin ? await getAllFacilitiesAdmin() : await getFacilities();
    return NextResponse.json({ success: true, count: facilities.length, facilities });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch facilities' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.name || !body.description) {
      return NextResponse.json({ error: 'Facility name and description are required' }, { status: 400 });
    }

    const facility = await createFacility(body);
    return NextResponse.json({ success: true, facility }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create facility' }, { status: 500 });
  }
}
