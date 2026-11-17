export type Place = { lat?: number; lng?: number; formattedAddress: string; placeId?: string; primaryText?: string; secondaryText?: string };
export type Point = { lat: number; lng: number; address?: string; accuracy?: number; sampleTimestamp?: number; source?: 'gps' | 'manual' | 'place' };
export type Route = { distance?: { text: string; value: number }; duration?: { text: string; value: number }; polyline?: string | null; mode?: string };
export type Journey = {
  _id: string; status: string; vehicleType: string; journeyPurpose: string; pickupLocation: Point; destination: Point;
  createdAt?: string; finalPrice?: number; clientPrice?: number; systemPrice?: number; paymentMethod?: string;
  routePolyline?: string; riderDetails?: { name?: string; vehicleModel?: string; vehicleNumber?: string; avatar?: string; isVerified?: boolean };
  cancellationSettlement?: { dueUGX?: number; percentage?: number; pendingReview?: boolean };
};

export class ApiError extends Error {
  constructor(message: string, public status: number, public sessionRetry = false) { super(message); }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  // Refresh-token rotation allows exactly one request to renew a session. A
  // second request can therefore lose that race even though the browser has
  // received the winning response's replacement cookies. Retry briefly for
  // that explicit, side-effect-free gateway signal before showing a sign-out.
  const retryDelays = [150, 350, 700, 1500, 2500];
  for (let attempt = 0; ; attempt++) {
    const response = await fetch(path, { ...init, headers: { 'Content-Type': 'application/json', ...init.headers }, credentials: 'same-origin', cache: 'no-store' });
    const envelope = await response.json().catch(() => null);
    const sessionRetry = response.headers.get('x-lookiy-session-retry') === '1';
    if (response.ok && envelope?.success) return envelope.data as T;
    const delay = retryDelays[attempt];
    if (response.status === 401 && sessionRetry && delay !== undefined) {
      await new Promise(resolve => setTimeout(resolve, delay));
      continue;
    }
    const raw = envelope?.message;
    const message = Array.isArray(raw) ? raw.join(' ') : raw || 'Unable to complete this request.';
    throw new ApiError(message, response.status, sessionRetry);
  }
}

let sessionCheck: Promise<{ _id: string }> | null = null;

export function getWebSession(force = false) {
  if (force || !sessionCheck) {
    const pending = api<{ _id: string }>('/api/session/me').finally(() => { if (sessionCheck === pending) sessionCheck = null; });
    sessionCheck = pending;
  }
  return sessionCheck;
}

export function post<T>(path: string, body: unknown) {
  return api<T>(path, { method: 'POST', body: JSON.stringify(body) });
}

export function ugx(amount?: number) {
  return amount == null ? '—' : `UGX ${Math.round(amount).toLocaleString('en-UG')}`;
}
