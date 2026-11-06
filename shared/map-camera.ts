import { locationDistance } from './location-quality';

type Point = { lat?: number; lng?: number };
export type CameraPoint = { lat: number; lng: number };
export const STREET_ZOOM = 17;
export const STREET_DELTA = 0.005;
export const DEFAULT_MAP_CENTER = { lat: 0.3136, lng: 32.5811 };
export const validMapPoint = (p?: Point | null): p is CameraPoint => !!p && Number.isFinite(p.lat) && Number.isFinite(p.lng) && Math.abs(p.lat!) <= 90 && Math.abs(p.lng!) <= 180;

/** Selected places determine the frame; unrelated promotional/live pins do not. */
export function mapFrame(pickup?: Point | null, destination?: Point | null, current?: Point | null, stops: Point[] = [], route: CameraPoint[] = []) {
  const anchors = [pickup, ...stops, destination].filter(validMapPoint);
  if (!anchors.length) return { center: validMapPoint(current) ? current : DEFAULT_MAP_CENTER, points: [] as CameraPoint[], single: true };
  const points = [...anchors];
  const routeRadius = Math.max(3000, ...anchors.map(point => locationDistance(anchors[0], point) * 3));
  // A previous route can remain on screen while a new selection is resolving.
  if (anchors.length > 1 && route.length > 1 && route.every(point => validMapPoint(point) && locationDistance(anchors[0], point) <= routeRadius) && locationDistance(anchors[0], route[0]) < 1000 && locationDistance(anchors[anchors.length - 1], route[route.length - 1]) < 1000) points.push(...route);
  const single = points.every(point => locationDistance(points[0], point) < 25);
  return { center: points[0], points, single };
}

export function mapPadding(width: number, height: number, fullscreen: boolean) {
  return { top: Math.min(fullscreen ? 170 : 45, height * 0.22), bottom: Math.min(fullscreen ? 100 : 45, height * 0.18), left: Math.min(65, width * 0.15), right: Math.min(65, width * 0.15) };
}

/** Explicit Mercator camera avoids native fit-bounds commands racing map/sheet layout. */
export function mapCamera(frame: ReturnType<typeof mapFrame>, width: number, height: number, fullscreen = false) {
  if (frame.single || !frame.points.length) return { center: { latitude: frame.center.lat, longitude: frame.center.lng }, zoom: STREET_ZOOM, heading: 0, pitch: 0 };
  const ys = frame.points.map(point => { const sin = Math.sin(Math.max(-85, Math.min(85, point.lat)) * Math.PI / 180); return 0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI); });
  const xs = frame.points.map(point => (point.lng + 180) / 360);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const padding = mapPadding(width, height, fullscreen);
  const usableWidth = Math.max(1, width - padding.left - padding.right), usableHeight = Math.max(1, height - padding.top - padding.bottom);
  const zoom = Math.min(STREET_ZOOM, Math.log2(usableWidth / (256 * Math.max(1e-9, maxX - minX))), Math.log2(usableHeight / (256 * Math.max(1e-9, maxY - minY))));
  const x = (minX + maxX) / 2, y = (minY + maxY) / 2;
  return { center: { latitude: Math.atan(Math.sinh(Math.PI * (1 - 2 * y))) * 180 / Math.PI, longitude: x * 360 - 180 }, zoom: Math.max(1, zoom), heading: 0, pitch: 0 };
}
