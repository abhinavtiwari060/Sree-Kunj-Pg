import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

/**
 * ImageKit Serverless Authentication Endpoint
 * Generates HMAC-SHA1 signature and token for secure client-side uploads.
 * The private API key stays strictly on the server and is never exposed to the client.
 */
export async function GET() {
  try {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || '';
    const publicKey =
      process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ||
      process.env.IMAGEKIT_PUBLIC_KEY ||
      '';
    const urlEndpoint =
      process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ||
      process.env.IMAGEKIT_URL_ENDPOINT ||
      '';

    if (!privateKey) {
      console.warn('IMAGEKIT_PRIVATE_KEY is not configured in server environment variables.');
    }

    // Generate random token and expiry timestamp (valid for 40 minutes)
    const token = crypto.randomUUID();
    const expire = Math.floor(Date.now() / 1000) + 2400;

    // Cryptographic HMAC-SHA1 signature required by ImageKit: hmacSha1(token + expire, privateKey)
    const signature = crypto
      .createHmac('sha1', privateKey)
      .update(token + expire)
      .digest('hex');

    return NextResponse.json({
      token,
      expire,
      signature,
      publicKey,
      urlEndpoint,
    });
  } catch (error: any) {
    console.error('ImageKit auth signature generation failed:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate ImageKit authentication parameters' },
      { status: 500 }
    );
  }
}
