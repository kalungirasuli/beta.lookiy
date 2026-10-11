'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPinned } from 'lucide-react';
import { Point, Route } from '@/lib/client-api';
import { loadGoogleMaps } from '@/lib/google-maps';

export function RouteMap({ pickup, destination, route, covered, className = '' }: { pickup: Point | null; destination: Point | null; route?: Route | null; covered?: Point[]; className?: string }) {
  const node = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '';
  useEffect(() => {
    if (!key || !node.current) return;
    let active = true;
    loadGoogleMaps(key).then(() => {
      if (!active || !node.current) return;
      const maps = window.google.maps;
      const center = pickup || destination || {lat:0.3476,lng:32.5825};
      const map = new maps.Map(node.current, { center, zoom: pickup && destination ? 12 : 11, disableDefaultUI: true, zoomControl: true, mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || undefined, clickableIcons: false });
      const bounds = new maps.LatLngBounds();
      if (pickup) { new maps.Marker({map,position:pickup,title:'Pickup'}); bounds.extend(pickup); }
      if (destination) { new maps.Marker({map,position:destination,title:'Destination'}); bounds.extend(destination); }
      if (route?.polyline && maps.geometry?.encoding) {
        const path = maps.geometry.encoding.decodePath(route.polyline);
        new maps.Polyline({ map, path, strokeColor:'#1769e8', strokeOpacity:.93, strokeWeight:5 });
        path.forEach((point: any) => bounds.extend(point));
      }
      if (covered && covered.length > 1) {
        new maps.Polyline({ map, path: covered, strokeColor:'#111317', strokeOpacity:.95, strokeWeight:5 });
        covered.forEach(point => bounds.extend(point));
        new maps.Marker({map,position:covered[covered.length-1],title:'Latest rider position'});
      }
      if (pickup && destination) map.fitBounds(bounds, 45);
      setError(false);
    }).catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, [key, pickup?.lat, pickup?.lng, destination?.lat, destination?.lng, route?.polyline, covered?.length]);
  return <div className={`map-panel ${className}`}>
    {key && !error ? <div className="map-canvas" ref={node} aria-label="Journey map" /> : <div className="map-fallback"><MapPinned size={43}/><strong>{error ? 'Map could not load' : 'Your route appears here'}</strong><p>{key ? 'Check your Maps key and try again.' : 'Add a Google Maps browser key to see the interactive map.'}</p></div>}
    {pickup && destination && <div className="map-overlay"><span><strong>{pickup.address || 'Pickup'} → {destination.address || 'Destination'}</strong><small>{route?.distance?.text || 'Route preview'}{route?.duration?.text ? ` · ${route.duration.text}` : ''}{route?.mode === 'fallback_haversine' ? ' · Straight-line estimate' : ''}</small></span></div>}
  </div>;
}
