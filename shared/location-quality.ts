/** Raw measurements only. Display interpolation must never enter this pipeline. */
export interface LocationSample {
  lat: number; lng: number; accuracy?: number; sampleTimestamp: number;
  speed?: number; heading?: number; provider?: 'fused' | 'core-location' | 'browser' | 'unknown'; mocked?: boolean;
}
export const LOCATION_PRECISE_METRES = 30;
export const LOCATION_MAX_AGE_MS = 30_000;
export const LOCATION_MAX_ACCURACY_METRES = 150;
export type LocationIssue = 'INVALID' | 'STALE' | 'FUTURE' | 'INACCURATE' | 'OUT_OF_ORDER' | 'JUMP' | 'MOCKED' | 'UNVERIFIED';
export function locationDistance(a: Pick<LocationSample, 'lat' | 'lng'>, b: Pick<LocationSample, 'lat' | 'lng'>) {
  const r = Math.PI / 180;
  const v = Math.sin((b.lat - a.lat) * r / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin((b.lng - a.lng) * r / 2) ** 2;
  return 12_742_000 * Math.atan2(Math.sqrt(v), Math.sqrt(Math.max(0, 1 - v)));
}
export function locationIssue(sample: LocationSample, previous?: LocationSample | null, options: { now?: number; requireAccuracy?: boolean; rejectMocked?: boolean; maxAccuracy?: number } = {}): LocationIssue | null {
  const now = options.now ?? Date.now();
  if (![sample.lat, sample.lng, sample.sampleTimestamp].every(Number.isFinite) || Math.abs(sample.lat) > 90 || Math.abs(sample.lng) > 180 || sample.sampleTimestamp <= 0) return 'INVALID';
  if (sample.sampleTimestamp > now + 5000) return 'FUTURE';
  if (now - sample.sampleTimestamp > LOCATION_MAX_AGE_MS) return 'STALE';
  if (sample.mocked && options.rejectMocked) return 'MOCKED';
  if (sample.accuracy == null ? options.requireAccuracy !== false : !Number.isFinite(sample.accuracy) || sample.accuracy <= 0 || sample.accuracy > (options.maxAccuracy ?? LOCATION_MAX_ACCURACY_METRES)) return 'INACCURATE';
  if (sample.speed != null && (!Number.isFinite(sample.speed) || sample.speed < 0 || sample.speed > 100)) return 'INVALID';
  if (sample.heading != null && (!Number.isFinite(sample.heading) || sample.heading < 0 || sample.heading >= 360)) return 'INVALID';
  if (previous) {
    const seconds = (sample.sampleTimestamp - previous.sampleTimestamp) / 1000;
    if (seconds <= 0) return 'OUT_OF_ORDER';
    // Both uncertainty radii and up to 80 m/s legitimate travel are allowed.
    // Reacquire after interruptions instead of assuming the user stayed still.
    if (seconds < 30 && locationDistance(previous, sample) > 80 * seconds + 3 * ((previous.accuracy ?? 30) + (sample.accuracy ?? 30))) return 'JUMP';
  }
  return null;
}
export class LocationSampleFilter {
  lastReliable: LocationSample | null = null;
  private pending: LocationSample | null = null;
  constructor(private options: { rejectMocked?: boolean } = {}) {}
  accept(sample: LocationSample, now = Date.now()): boolean {
    const issue = locationIssue(sample, this.lastReliable, { ...this.options, now });
    if (issue === 'JUMP') {
      // One spike is withheld; corroborating fresh readings can reacquire.
      if (!this.pending || locationIssue(sample, this.pending, { ...this.options, now })) { this.pending = sample; return false; }
    } else if (issue) return false;
    this.pending = null; this.lastReliable = sample; return true;
  }
}
/** Display only, including the shortest path across the antimeridian. */
export function interpolateLocation(from: LocationSample, to: LocationSample, progress: number) {
  const fraction = Math.max(0, Math.min(1, progress)), longitude = ((to.lng - from.lng + 540) % 360) - 180;
  return { lat: from.lat + (to.lat - from.lat) * fraction, lng: ((from.lng + longitude * fraction + 540) % 360) - 180 };
}
