import type { NextRequest } from 'next/server';
import { jsonReply, withSession } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  if (request.headers.get('sec-fetch-site') === 'cross-site') {
    return jsonReply(403, { message: 'Map configuration is available in Lookiy.' });
  }

  const session = await withSession(request, '/auth/me', { method: 'GET' });
  if (!session.ok) return session;
  const account = await session.json();
  if (!account.success || !account.data) return jsonReply(503, { message: 'Could not verify your session.' });

  const response = jsonReply(200, {
    success: true,
    data: {
      key: process.env.GOOGLE_MAPS_KEY?.trim() || null,
      mapId: process.env.GOOGLE_MAPS_MAP_ID?.trim() || null,
    },
  });
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  for (const cookie of session.cookies.getAll()) response.cookies.set(cookie);
  return response;
}
