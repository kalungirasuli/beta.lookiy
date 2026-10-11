'use client';

import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { api, Place, Point } from '@/lib/client-api';

export function PlaceField({ label, value, selected, onChange, onSelect, placeholder }: { label: string; value: string; selected: Point | null; onChange: (value: string) => void; onSelect: (place: Point) => void; placeholder: string }) {
  const [options, setOptions] = useState<Place[]>([]);
  const [focused, setFocused] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (selected || value.trim().length < 2) { setOptions([]); return; }
    let active = true;
    const timer = setTimeout(async () => {
      setBusy(true);
      try { const results = await api<Place[]>(`/api/client/geo/search?q=${encodeURIComponent(value.trim())}&limit=5`); if (active) setOptions(results); }
      catch { if (active) setOptions([]); }
      finally { if (active) setBusy(false); }
    }, 300);
    return () => { active = false; clearTimeout(timer); };
  }, [value, selected]);
  return <div className="form-field"><label htmlFor={`place-${label}`}>{label}</label><input id={`place-${label}`} className="text-field" value={value} placeholder={placeholder} onFocus={() => setFocused(true)} onBlur={() => setTimeout(() => setFocused(false), 180)} onChange={event => onChange(event.target.value)} autoComplete="off" />
    {focused && (busy || options.length > 0) && <div className="suggestion-list" role="listbox">{busy && <div className="loading" style={{padding:12}}>Searching Uganda places…</div>}{options.map(place => <button type="button" key={place.placeId || `${place.lat}-${place.lng}`} onMouseDown={event => event.preventDefault()} onClick={() => { onSelect({lat:place.lat,lng:place.lng,address:place.formattedAddress});setOptions([]);setFocused(false); }}><MapPin size={16}/>{place.formattedAddress}</button>)}</div>}
  </div>;
}
