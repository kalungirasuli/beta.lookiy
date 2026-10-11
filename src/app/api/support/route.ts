import { NextRequest } from 'next/server';
import { gateway, jsonReply, sameOriginMutation } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  if (!sameOriginMutation(req)) return jsonReply(403, { success: false, message: 'Cross-site requests are not allowed.' });
  const text = await req.text();
  if (text.length > 10000) return jsonReply(413, { success: false, message: 'Your message is too long.' });
  let body: unknown;
  try { body = JSON.parse(text); } catch { return jsonReply(400, { success: false, message: 'Enter the required details.' }); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return jsonReply(400, { success: false, message: 'Enter the required details.' });
  const { name, email, topic, message, website } = body as Record<string, unknown>;
  if (typeof website === 'string' && website.length) return jsonReply(400, { success: false, message: 'Unable to send this request.' });
  const result = await gateway('/support/requests', {
    method: 'POST', body: JSON.stringify({ name, email, topic, message, website: '' }),
  });
  return jsonReply(result.status, result.body);
}
