import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function storeUrl(value: string | undefined, host: string) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === host ? url : null;
  } catch { return null; }
}

export function GET(request: NextRequest) {
  const agent = request.headers.get('user-agent') || '';
  const apple = /iPhone|iPad|iPod|Macintosh|Mac OS X/i.test(agent);
  const android = /Android/i.test(agent);
  const appStore = storeUrl(process.env.NEXT_PUBLIC_APP_STORE_URL, 'apps.apple.com');
  const playStore = storeUrl(process.env.NEXT_PUBLIC_PLAY_STORE_URL, 'play.google.com');
  const target = android ? playStore : apple ? appStore : null;

  if (target) return NextResponse.redirect(target, { status: 307, headers: { 'Cache-Control': 'no-store' } });
  const fallback = new URL('/app', request.url);
  fallback.searchParams.set('store', android ? 'android' : apple ? 'ios' : 'other');
  return NextResponse.redirect(fallback, { status: 307, headers: { 'Cache-Control': 'no-store' } });
}
