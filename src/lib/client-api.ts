export type Place = { lat: number; lng: number; formattedAddress: string; placeId?: string };
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
  const response = await fetch(path, { ...init, headers: { 'Content-Type': 'application/json', ...init.headers }, credentials: 'same-origin', cache: 'no-store' });
  const envelope = await response.json().catch(() => null);
  if (!response.ok || !envelope?.success) {
    const raw = envelope?.message;
    const message = Array.isArray(raw) ? raw.join(' ') : raw || 'Unable to complete this request.';
    throw new ApiError(message, response.status, response.headers.get('x-lookiy-session-retry') === '1');
  }
  return envelope.data as T;
}

let sessionCheck: Promise<{ _id: string }> | null = null;

export function getWebSession(force = false) {
  async function check() {
    for (const delay of [150, 300]) {
      try {
        return await api<{ _id: string }>('/api/session/me');
      } catch (error) {
        if (!(error instanceof ApiError) || !error.sessionRetry) throw error;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    return api<{ _id: string }>('/api/session/me');
  }

  if (force || !sessionCheck) {
    const pending = check().finally(() => { if (sessionCheck === pending) sessionCheck = null; });
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
