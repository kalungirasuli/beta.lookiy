import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const ACCESS_COOKIE = 'lookiy_web_access';
export const REFRESH_COOKIE = 'lookiy_web_refresh';

export type GatewayReply<T = unknown> = { success?: boolean; data?: T; message?: string | string[]; statusCode?: number };

export async function gateway(path: string, init: RequestInit = {}, token?: string) {
  const base = (process.env.API_GATEWAY_URL || 'http://localhost:3000').replace(/\/$/, '');
  try {
    const response = await fetch(base + path, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init.headers },
      cache: 'no-store',
      signal: AbortSignal.timeout(12000),
    });
    const body = await response.json().catch(() => ({ message: 'The service returned an unreadable response.' })) as GatewayReply;
    return { status: response.status, body };
  } catch {
    return { status: 503, body: { success: false, message: 'Lookiy is temporarily unavailable. Please try again.' } as GatewayReply };
  }
}

export function jsonReply(status: number, body: GatewayReply) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

export function sameOriginMutation(req: NextRequest) {
  const origin = req.headers.get('origin');
  const fetchSite = req.headers.get('sec-fetch-site');
  return fetchSite !== 'cross-site' && (!origin || origin === req.nextUrl.origin);
}

export function setSessionCookies(response: NextResponse, data: any) {
  const options = { httpOnly: true, sameSite: 'lax' as const, secure: process.env.NODE_ENV === 'production', path: '/' };
  response.cookies.set(ACCESS_COOKIE, data.accessToken, { ...options, maxAge: 60 * 60 * 24 * 7 });
  response.cookies.set(REFRESH_COOKIE, data.refreshToken, { ...options, maxAge: 60 * 60 * 24 * 30 });
}

export function clearSessionCookies(response: NextResponse) {
  response.cookies.delete(ACCESS_COOKIE);
  response.cookies.delete(REFRESH_COOKIE);
}

export async function withSession(path: string, init: RequestInit, access?: string, refresh?: string) {
  if (!access && !refresh) return jsonReply(401, { success: false, message: 'Sign in to continue.' });
  let result = access ? await gateway(path, init, access) : { status: 401, body: { success: false } as GatewayReply };
  let newTokens: any;
  if (result.status === 401 && refresh) {
    const renewed = await gateway('/auth/refresh', { method: 'POST', body: JSON.stringify({ refreshToken: refresh }) });
    if (renewed.status === 200 && (renewed.body.data as any)?.accessToken) {
      newTokens = renewed.body.data;
      result = await gateway(path, init, newTokens.accessToken);
    }
  }
  const response = jsonReply(result.status, result.body);
  if (newTokens) setSessionCookies(response, newTokens);
  else if (result.status === 401) clearSessionCookies(response);
  return response;
}
