import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin } from '@/lib/dataService';
import { signAdminToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Please provide both email and password' },
        { status: 400 }
      );
    }

    const admin = await authenticateAdmin(email, password);
    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    const token = signAdminToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful',
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });

    // Set secure HTTP-only cookie
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
