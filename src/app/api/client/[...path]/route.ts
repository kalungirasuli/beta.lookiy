import { NextRequest } from 'next/server';
import { gateway, jsonReply, sameOriginMutation, withSession } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

function allowed(method: string, path: string) {
  if (method === 'GET') return [
    /^geo\/(search|place-details)$/, /^businesses\/search$/, /^operators\/vehicle-availability$/, /^journeys\/my\/(active|history)$/, /^journeys\/[a-f\d]{24}$/i,
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
  if (method === 'GET' && joined === 'geo/search') {
    const params = new URLSearchParams({ q: req.nextUrl.searchParams.get('q') || '', limit: '5' });
    const session = req.nextUrl.searchParams.get('sessionToken');
    if (session) params.set('sessionToken', session);
    const result = await gateway(`/geo/public/search?${params}`);
    return jsonReply(result.status, result.body);
  }
  if (method === 'GET' && joined === 'geo/place-details') {
    const params = new URLSearchParams({ id: req.nextUrl.searchParams.get('id') || '', sessionToken: req.nextUrl.searchParams.get('sessionToken') || '' });
    const result = await gateway(`/geo/public/place-details?${params}`);
    return jsonReply(result.status, result.body);
  }
  if (method === 'GET' && joined === 'businesses/search') {
    const params = new URLSearchParams({ q: req.nextUrl.searchParams.get('q') || '', limit: '8' });
    const result = await gateway(`/geo/public/businesses?${params}`);
    return jsonReply(result.status, result.body);
  }
  if (method === 'POST' && joined === 'geo/reverse-geocode') {
    const result = await gateway('/geo/public/reverse-geocode', { method: 'POST', body: await req.text() });
    return jsonReply(result.status, result.body);
  }
  const query = req.nextUrl.search;
  const init: RequestInit = { method };
  if (method === 'POST') init.body = await req.text();
  return withSession(req, `/${joined}${query}`, init);
}

export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return dispatch(req, (await context.params).path, 'GET');
}
export async function POST(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return dispatch(req, (await context.params).path, 'POST');
}
