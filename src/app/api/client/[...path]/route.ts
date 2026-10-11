import { NextRequest } from 'next/server';
import { ACCESS_COOKIE, REFRESH_COOKIE, jsonReply, sameOriginMutation, withSession } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

function allowed(method: string, path: string) {
  if (method === 'GET') return [
    /^geo\/search$/, /^journeys\/my\/(active|history)$/, /^journeys\/[a-f\d]{24}$/i,
    /^tracking\/journey\/[a-f\d]{24}$/i, /^chat\/rooms\/[a-f\d]{24}\/messages$/i,
  ].some(pattern => pattern.test(path));
  if (method === 'POST') return [
    /^geo\/(route|reverse-geocode)$/, /^journeys\/price-estimate$/, /^journeys$/, /^journeys\/[a-f\d]{24}\/(cancel|complete)$/i,
    /^chat\/rooms\/[a-f\d]{24}\/messages$/i,
  ].some(pattern => pattern.test(path));
  return false;
}

async function dispatch(req: NextRequest, path: string[], method: 'GET' | 'POST') {
  if (method === 'POST' && !sameOriginMutation(req)) return jsonReply(403, { message: 'Cross-site requests are not allowed.' });
  const joined = path.join('/');
  if (!allowed(method, joined)) return jsonReply(404, { message: 'This feature is available in the mobile app.' });
  const query = req.nextUrl.search;
  const init: RequestInit = { method };
  if (method === 'POST') init.body = await req.text();
  return withSession(`/${joined}${query}`, init, req.cookies.get(ACCESS_COOKIE)?.value, req.cookies.get(REFRESH_COOKIE)?.value);
}

export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return dispatch(req, (await context.params).path, 'GET');
}
export async function POST(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return dispatch(req, (await context.params).path, 'POST');
}
