import { NextRequest, NextResponse } from 'next/server';
import { getInquiries, createInquiry } from '@/lib/dataService';
import { getAdminFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';


export async function GET(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const inquiries = await getInquiries();
    return NextResponse.json({ success: true, count: inquiries.length, inquiries });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch inquiries' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, message } = body;

    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: 'Please provide your name, phone number, and message' },
        { status: 400 }
      );
    }

    const inquiry = await createInquiry(body);
    return NextResponse.json({ success: true, inquiry }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to send inquiry' }, { status: 500 });
  }
}
