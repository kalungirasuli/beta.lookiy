import { NextRequest } from 'next/server';
import { ACCESS_COOKIE, REFRESH_COOKIE, clearSessionCookies, gateway, jsonReply, sameOriginMutation, setSessionCookies, withSession } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ action: string }> }) {
  if ((await params).action === 'google-config') {
    const clientId = process.env.GOOGLE_WEB_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID;
    if (!clientId) return jsonReply(503, { message: 'Google sign-in is not configured yet. Please use email or phone sign-in.' });
    return jsonReply(200, { success: true, data: { clientId } });
  }
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
  if (!['login', 'register', 'verify', 'google'].includes(action)) return jsonReply(404, { message: 'Unknown session action.' });
  const payload = await req.json().catch(() => null);
  if (!payload || typeof payload !== 'object') return jsonReply(400, { message: 'Enter the required details.' });
  const path = action === 'verify' ? '/auth/2fa/verify' : action === 'google' ? '/auth/login/google' : `/auth/${action}`;
  const { tempToken, ...body } = payload;
  if (action === 'google' && (typeof body.idToken !== 'string' || body.idToken.length < 20 || body.idToken.length > 10000 || typeof body.deviceSignature !== 'string' || body.deviceSignature.length > 200)) return jsonReply(400, { message: 'Google sign-in details are incomplete. Please retry.' });
  const result = await gateway(path, { method: 'POST', body: JSON.stringify(action === 'google' ? { idToken: body.idToken, deviceSignature: body.deviceSignature } : body) }, action === 'verify' && typeof tempToken === 'string' ? tempToken : undefined);
  const data = result.body.data as any;
  const { accessToken: _access, refreshToken: _refresh, ...publicData } = data || {};
  const response = jsonReply(result.status, { ...result.body, ...(data ? { data: publicData } : {}) });
  if (result.status < 300 && data?.accessToken && data?.refreshToken) setSessionCookies(response, data);
  return response;
}
