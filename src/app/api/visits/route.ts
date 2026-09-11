import { NextRequest, NextResponse } from 'next/server';
import { getVisits, createVisit } from '@/lib/dataService';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const visits = await getVisits();
    return NextResponse.json({ success: true, count: visits.length, visits });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch visits' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, visitType, preferredDate, preferredTime } = body;

    if (!name || !phone || !visitType || !preferredDate || !preferredTime) {
      return NextResponse.json(
        { error: 'Missing required visit details' },
        { status: 400 }
      );
    }

    const visit = await createVisit(body);
    return NextResponse.json({ success: true, visit }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to schedule visit' }, { status: 500 });
  }
}
