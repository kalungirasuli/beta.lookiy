import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const ACCESS_COOKIE = 'lookiy_web_access';
export const REFRESH_COOKIE = 'lookiy_web_refresh';
export const DEVICE_COOKIE = 'lookiy_web_signature';

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
  if (fetchSite && fetchSite !== 'same-origin') return false;
  if (!origin || origin === req.nextUrl.origin) return true;
  // Next can normalize the URL hostname before the route runs. The Host header
  // still identifies the browser-facing origin and excludes sibling subdomains.
  const host = req.headers.get('host');
  return Boolean(host && origin === `${req.nextUrl.protocol}//${host}`);
}

export function setSessionCookies(response: NextResponse, data: any, signature: string) {
  const options = { httpOnly: true, sameSite: 'lax' as const, secure: process.env.NODE_ENV === 'production', path: '/' };
  response.cookies.set(ACCESS_COOKIE, data.accessToken, { ...options, maxAge: 60 * 60 * 24 * 7 });
  response.cookies.set(REFRESH_COOKIE, data.refreshToken, { ...options, maxAge: 60 * 60 * 24 * 30 });
  response.cookies.set(DEVICE_COOKIE, signature, { ...options, maxAge: 60 * 60 * 24 * 30 });
}

export function clearSessionCookies(response: NextResponse) {
  response.cookies.delete(ACCESS_COOKIE);
  response.cookies.delete(REFRESH_COOKIE);
  response.cookies.delete(DEVICE_COOKIE);
}

export async function withSession(request: NextRequest, path: string, init: RequestInit) {
  const access = request.cookies.get(ACCESS_COOKIE)?.value;
  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;
  const signature = request.cookies.get(DEVICE_COOKIE)?.value;
  if ((!access && !refresh) || !signature) return jsonReply(401, { success: false, message: 'Sign in to continue.' });
  init = { ...init, headers: { ...init.headers, 'x-device-signature': signature } };
  let result = access ? await gateway(path, init, access) : { status: 401, body: { success: false } as GatewayReply };
  let newTokens: any;
  let renewalRejected = false;
  if (result.status === 401 && refresh) {
    const renewed = await gateway('/auth/refresh', { method: 'POST', body: JSON.stringify({ refreshToken: refresh }) });
    if (renewed.status === 200 && (renewed.body.data as any)?.accessToken) {
      newTokens = renewed.body.data;
      result = await gateway(path, init, newTokens.accessToken);
    } else if (renewed.status >= 500) {
      result = renewed;
    } else if (renewed.status === 401) {
      renewalRejected = true;
    }
  }
  const response = jsonReply(result.status, result.body);
  if (newTokens) setSessionCookies(response, newTokens, signature);
  else if (renewalRejected) {
    // Another request may have rotated this token and be setting the new cookies.
    response.headers.set('x-lookiy-session-retry', '1');
  } else if (result.status === 401 && !refresh) clearSessionCookies(response);
  return response;
}
