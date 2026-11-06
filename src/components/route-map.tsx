'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { MapPinned, LocateFixed } from 'lucide-react';
import { api, Point, Route } from '@/lib/client-api';
import { loadGoogleMaps, mapsAuthFailureEvent } from '@/lib/google-maps';
import { STREET_ZOOM, mapFrame } from '../../shared/map-camera';

export function RouteMap({ pickup, destination, currentLocation, onPickupChange, route, covered, className = '' }: { pickup: Point | null; destination: Point | null; currentLocation?: Point | null; onPickupChange?: (point: Point) => void; route?: Route | null; covered?: Point[]; className?: string }) {
  const node = useRef<HTMLDivElement>(null), map = useRef<google.maps.Map | null>(null), panned = useRef(false);
  const initialFrame = useRef(mapFrame(pickup, destination, currentLocation));
  const [status, setStatus] = useState<'loading' | 'missing' | 'error' | 'ready'>('loading');
  const [attempt, setAttempt] = useState(0);
  const ready = status === 'ready';
  const [viewportRevision, setViewportRevision] = useState(0);
  const riderMarker = useRef<google.maps.Marker | null>(null);
  const [now, setNow] = useState(Date.now);
  const measuredAt = currentLocation?.sampleTimestamp;
  const fresh = measuredAt != null && now - measuredAt <= 30000 && measuredAt - now <= 5000;
  useEffect(() => { if (!measuredAt) return; const timer = setInterval(() => setNow(Date.now()), 5000); return () => clearInterval(timer); }, [measuredAt]);
  const selectionKey = `${pickup?.lat},${pickup?.lng}|${destination?.lat},${destination?.lng}`;
  useEffect(() => { panned.current = false; }, [selectionKey]);
  const pickupChanged = useRef(onPickupChange); useLayoutEffect(() => { pickupChanged.current = onPickupChange; }, [onPickupChange]);
  useEffect(() => {
    const controller = new AbortController();
    let denied = false;
    function onAuthFailure() { denied = true; setStatus('error'); }
    window.addEventListener(mapsAuthFailureEvent, onAuthFailure);
    setStatus('loading');
    api<{ key: string | null; mapId: string | null }>('/api/maps/config', { signal: controller.signal }).then(async config => {
      if (controller.signal.aborted) return;
      if (!config.key) { setStatus('missing'); return; }
      await loadGoogleMaps(config.key);
      if (controller.signal.aborted || denied || !node.current) return;
      map.current = new google.maps.Map(node.current, { center: initialFrame.current.center, zoom: STREET_ZOOM, disableDefaultUI: true, zoomControl: true, mapId: config.mapId || undefined, clickableIcons: true, mapTypeId: google.maps.MapTypeId.ROADMAP, colorScheme: google.maps.ColorScheme.LIGHT });
      map.current.addListener('dragstart', () => { panned.current = true; });
      if (!denied) setStatus('ready');
    }).catch(() => { if (!controller.signal.aborted) setStatus('error'); });
    return () => {
      controller.abort();
      window.removeEventListener(mapsAuthFailureEvent, onAuthFailure);
      if (map.current) google.maps.event.clearInstanceListeners(map.current);
      map.current = null;
    };
  }, [attempt]);
  useEffect(() => {
    if (!ready || !node.current || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => setViewportRevision(value => value + 1));
    observer.observe(node.current); return () => observer.disconnect();
  }, [ready]);
  useEffect(() => {
    if (!ready || !map.current) return;
    const overlays: (google.maps.Marker | google.maps.Polyline)[] = [], bounds = new google.maps.LatLngBounds();
    if (pickup) {
      const marker = new google.maps.Marker({ map: map.current, position: pickup, title: 'Pickup · drag to adjust', draggable: !!onPickupChange });
      marker.addListener('dragend', (event: google.maps.MapMouseEvent) => { if (event.latLng) pickupChanged.current?.({ lat: event.latLng.lat(), lng: event.latLng.lng(), source: 'manual' }); });
      overlays.push(marker); bounds.extend(pickup);
    }
    if (destination) { overlays.push(new google.maps.Marker({ map: map.current, position: destination, title: 'Destination' })); bounds.extend(destination); }
    if (route?.polyline) {
      const path = google.maps.geometry.encoding.decodePath(route.polyline);
      overlays.push(new google.maps.Polyline({ map: map.current, path, strokeColor: '#1769e8', strokeOpacity: .93, strokeWeight: 5 }));
      path.forEach(point => bounds.extend(point));
    }
    if (!panned.current && node.current?.clientWidth && node.current.clientHeight) {
      const routePoints = route?.polyline ? google.maps.geometry.encoding.decodePath(route.polyline).map(p => ({ lat: p.lat(), lng: p.lng() })) : [];
      const frame = mapFrame(pickup, destination, currentLocation, [], routePoints);
      if (!frame.single) { const frameBounds = new google.maps.LatLngBounds(); frame.points.forEach(point => frameBounds.extend(point)); map.current.fitBounds(frameBounds, 35); }
      else { map.current.setCenter(frame.center); map.current.setZoom(STREET_ZOOM); }
    }
    return () => overlays.forEach(overlay => { google.maps.event.clearInstanceListeners(overlay); overlay.setMap(null); });
  }, [ready, pickup?.lat, pickup?.lng, destination?.lat, destination?.lng, currentLocation?.lat, currentLocation?.lng, route?.polyline, !!onPickupChange, viewportRevision]);
  // Live tracking overlays never recreate or recenter the map.
  useEffect(() => {
    if (!ready || !map.current || !covered?.length) return;
    const line = new google.maps.Polyline({ map: map.current, path: covered, strokeColor: '#111317', strokeWeight: 5 });
    return () => { line.setMap(null); };
  }, [ready, covered]);
  useEffect(() => {
    if (!ready || !map.current) return;
    riderMarker.current = new google.maps.Marker({ map: map.current, title: 'Latest measured rider position' });
    return () => { riderMarker.current?.setMap(null); riderMarker.current = null; };
  }, [ready]);
  const riderLat = covered?.at(-1)?.lat, riderLng = covered?.at(-1)?.lng;
  useEffect(() => {
    const marker = riderMarker.current;
    if (!marker) return;
    if (!Number.isFinite(riderLat) || !Number.isFinite(riderLng)) { marker.setVisible(false); return; }
    marker.setVisible(true);
    const from = marker.getPosition(), to = { lat: riderLat!, lng: riderLng! };
    if (!from) { marker.setPosition(to); return; }
    const start = performance.now(); let frame = 0;
    const animate = (time: number) => { const progress = Math.min(1, (time - start) / 800); marker.setPosition({ lat: from.lat() + (to.lat - from.lat()) * progress, lng: from.lng() + (to.lng - from.lng()) * progress }); if (progress < 1) frame = requestAnimationFrame(animate); };
    frame = requestAnimationFrame(animate); return () => cancelAnimationFrame(frame);
  }, [ready, riderLat, riderLng]);
  useEffect(() => {
    if (!ready || !map.current || !currentLocation) return;
    const circle = new google.maps.Circle({ map: map.current, center: currentLocation, radius: currentLocation.accuracy || 0, fillColor: '#4285F4', fillOpacity: .12, strokeColor: '#4285F4', strokeOpacity: .3, strokeWeight: 1, clickable: false });
    const dot = new google.maps.Marker({ map: map.current, position: currentLocation, title: fresh ? 'Your measured location' : 'Last measured location · refresh GPS', icon: { path: google.maps.SymbolPath.CIRCLE, scale: 7, fillColor: fresh ? '#4285F4' : '#8793A5', fillOpacity: 1, strokeColor: '#FFFFFF', strokeWeight: 3 }, zIndex: 100 });
    return () => { dot.setMap(null); circle.setMap(null); };
  }, [ready, currentLocation?.lat, currentLocation?.lng, currentLocation?.accuracy, fresh]);
  function recenter() {
    if (!map.current) return;
    panned.current = false;
    const points = [pickup, destination].filter((p): p is Point => !!p);
    if (currentLocation) { map.current.panTo(currentLocation); map.current.setZoom(17); }
    else if (points.length > 1) { const bounds = new google.maps.LatLngBounds(); points.forEach(point => bounds.extend(point)); map.current.fitBounds(bounds, 45); }
    else if (points[0]) { map.current.panTo(points[0]); map.current.setZoom(16); }
  }
  return <div className={['map-panel', className].join(' ')}>
    <div className="map-canvas" ref={node} aria-label="Journey map" />
    {!ready && <div className="map-fallback" role="status"><MapPinned size={43} aria-hidden /><strong>{status === 'loading' ? 'Loading your map…' : 'Map unavailable'}</strong>{status !== 'loading' && <p>You can still search for places and plan your journey.</p>}{status === 'error' && <button className="secondary-button" type="button" onClick={() => setAttempt(value => value + 1)}>Retry map</button>}</div>}
    {ready && <button type="button" aria-label="Recenter map" onClick={recenter} style={{ position: 'absolute', right: 12, bottom: 80, padding: 12, borderRadius: '50%', background: 'white', border: 0, color: '#4285F4' }}><LocateFixed size={23}/></button>}
    {pickup && destination && <div className="map-overlay"><span><strong>{pickup.address || 'Pickup'} → {destination.address || 'Destination'}</strong><small>{route?.distance?.text || 'Route preview'}{route?.duration?.text ? ' · ' + route.duration.text : ''}{route?.mode === 'fallback_haversine' ? ' · Straight-line estimate' : ''}</small></span></div>}
  </div>;
}
