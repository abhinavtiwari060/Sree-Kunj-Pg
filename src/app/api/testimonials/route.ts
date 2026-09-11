import { NextRequest, NextResponse } from 'next/server';
import { getTestimonials, getAllTestimonialsAdmin, createTestimonial } from '@/lib/dataService';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    const testimonials = admin ? await getAllTestimonialsAdmin() : await getTestimonials();
    return NextResponse.json({ success: true, count: testimonials.length, testimonials });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch testimonials' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.name || !body.videoUrl) {
      return NextResponse.json({ error: 'Name and video URL are required' }, { status: 400 });
    }

    const testimonial = await createTestimonial(body);
    return NextResponse.json({ success: true, testimonial }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create testimonial' }, { status: 500 });
  }
}
