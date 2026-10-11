export type Place = { lat: number; lng: number; formattedAddress: string; placeId?: string };
export type Point = { lat: number; lng: number; address?: string };
export type Route = { distance?: { text: string; value: number }; duration?: { text: string; value: number }; polyline?: string | null; mode?: string };
export type Journey = {
  _id: string; status: string; vehicleType: string; journeyPurpose: string; pickupLocation: Point; destination: Point;
  createdAt?: string; finalPrice?: number; clientPrice?: number; systemPrice?: number; paymentMethod?: string;
  routePolyline?: string; riderDetails?: { name?: string; vehicleModel?: string; vehicleNumber?: string; avatar?: string; isVerified?: boolean };
  cancellationSettlement?: { dueUGX?: number; percentage?: number; pendingReview?: boolean };
};

export class ApiError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, { ...init, headers: { 'Content-Type': 'application/json', ...init.headers }, credentials: 'same-origin', cache: 'no-store' });
  const envelope = await response.json().catch(() => null);
  if (!response.ok || !envelope?.success) {
    const raw = envelope?.message;
    const message = Array.isArray(raw) ? raw.join(' ') : raw || 'Unable to complete this request.';
    throw new ApiError(message, response.status);
  }
  return envelope.data as T;
}

export function post<T>(path: string, body: unknown) {
  return api<T>(path, { method: 'POST', body: JSON.stringify(body) });
}

export function ugx(amount?: number) {
  return amount == null ? '—' : `UGX ${Math.round(amount).toLocaleString('en-UG')}`;
}
