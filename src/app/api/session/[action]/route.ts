import { NextRequest } from 'next/server';
import { ACCESS_COOKIE, REFRESH_COOKIE, clearSessionCookies, gateway, jsonReply, sameOriginMutation, setSessionCookies, withSession } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ action: string }> }) {
  if ((await params).action !== 'me') return jsonReply(404, { message: 'Unknown session action.' });
  return withSession('/auth/me', { method: 'GET' }, req.cookies.get(ACCESS_COOKIE)?.value, req.cookies.get(REFRESH_COOKIE)?.value);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ action: string }> }) {
  if (!sameOriginMutation(req)) return jsonReply(403, { message: 'Cross-site requests are not allowed.' });
  const action = (await params).action;
  if (action === 'logout') {
    const token = req.cookies.get(ACCESS_COOKIE)?.value;
    if (token) await gateway('/auth/logout', { method: 'POST' }, token);
    const response = jsonReply(200, { success: true });
    clearSessionCookies(response);
    return response;
  }
  if (!['login', 'register', 'verify'].includes(action)) return jsonReply(404, { message: 'Unknown session action.' });
  const payload = await req.json().catch(() => null);
  if (!payload || typeof payload !== 'object') return jsonReply(400, { message: 'Enter the required details.' });
  const path = action === 'verify' ? '/auth/2fa/verify' : `/auth/${action}`;
  const { tempToken, ...body } = payload;
  const result = await gateway(path, { method: 'POST', body: JSON.stringify(body) }, action === 'verify' && typeof tempToken === 'string' ? tempToken : undefined);
  const response = jsonReply(result.status, result.body);
  const data = result.body.data as any;
  if (result.status < 300 && data?.accessToken && data?.refreshToken) setSessionCookies(response, data);
  return response;
}
