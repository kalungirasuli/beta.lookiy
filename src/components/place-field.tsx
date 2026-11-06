'use client';

import { useEffect, useId, useState, type KeyboardEvent } from 'react';
import { Circle, MapPin, Square } from 'lucide-react';
import { api, type Place, type Point } from '@/lib/client-api';

type Props = {
  label: string;
  value: string;
  selected: Point | null;
  onChange: (value: string) => void;
  onSelect: (place: Point) => void;
  placeholder: string;
  kind: 'pickup' | 'destination';
};

export function PlaceField({ label, value, selected, onChange, onSelect, placeholder, kind }: Props) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState<{ query: string; options: Place[]; message: string; failed?: boolean }>();
  const query = value.trim();
  const searching = open && !selected && query.length >= 2;
  const current = searching && result?.query === query ? result : undefined;
  const options = current?.options || [];
  const expanded = options.length > 0;

  useEffect(() => {
    if (!searching) return;
    let mounted = true;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const places = await api<Place[]>(`/api/client/geo/search?q=${encodeURIComponent(query)}`, { signal: controller.signal });
        const options = places.filter(place => Number.isFinite(place.lat) && Number.isFinite(place.lng) && place.formattedAddress);
        if (mounted) setResult({ query, options, message: options.length ? '' : 'No places found. Try another name.' });
      } catch {
        if (mounted) setResult({ query, options: [], message: 'Place search is unavailable.', failed: true });
      }
    }, 180);
    return () => { mounted = false; clearTimeout(timer); controller.abort(); };
  }, [query, searching, revision]);

  function select(place: Place) {
    onSelect({ lat: place.lat, lng: place.lng, address: place.formattedAddress });
    setActive(-1);
    setOpen(false);
  }

  function handleKey(event: KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing) return;
    if (event.key === 'Escape' && open) {
      event.preventDefault();
      setOpen(false);
      setActive(-1);
    } else if (event.key === 'ArrowDown' && !open && !selected && query.length >= 2) {
      event.preventDefault();
      setOpen(true);
    } else if (expanded && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      event.preventDefault();
      const next = event.key === 'ArrowDown' ? Math.min(active + 1, options.length - 1) : active < 0 ? options.length - 1 : Math.max(active - 1, 0);
      setActive(next);
      document.getElementById(`${id}-option-${next}`)?.scrollIntoView({ block: 'nearest' });
    } else if (expanded && event.key === 'Enter' && options[active]) {
      event.preventDefault();
      select(options[active]);
    }
  }

  return <div className="place-field" onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) { setOpen(false); setActive(-1); }
  }}>
    <label htmlFor={id}>{label}</label>
    <div className="place-input">
      {kind === 'pickup' ? <Circle size={13} fill="currentColor" aria-hidden /> : <Square size={13} fill="currentColor" aria-hidden />}
      <input id={id} role="combobox" aria-autocomplete="list" aria-expanded={expanded}
        aria-controls={expanded ? `${id}-options` : undefined}
        aria-activedescendant={expanded && options[active] ? `${id}-option-${active}` : undefined}
        autoComplete="off" placeholder={placeholder} value={value}
        onFocus={() => { setOpen(true); setResult(undefined); }} onClick={() => setOpen(true)}
        onChange={event => { onChange(event.target.value); setActive(-1); setOpen(true); setResult(undefined); }} onKeyDown={handleKey} />
    </div>
    {expanded && <div className="place-popup">
      <div className="place-options" id={`${id}-options`} role="listbox" aria-label={`${label} suggestions`}>
        {options.map((place, index) => <div role="option" tabIndex={-1} id={`${id}-option-${index}`} aria-selected={active === index}
          key={place.placeId || `${place.lat}-${place.lng}-${index}`}
          onMouseDown={event => event.preventDefault()} onClick={() => select(place)}>
          <MapPin size={19} aria-hidden /><span>{place.formattedAddress}</span>
        </div>)}
      </div>
      <div className="place-credit">Powered by Google</div>
    </div>}
    {searching && !expanded && <div className="place-feedback">
      <p className="place-message" role="status">{current?.message || 'Searching places…'}</p>
      {current?.failed && <button className="place-retry" type="button" onClick={() => {
        document.getElementById(id)?.focus();
        setResult(undefined);
        setRevision(value => value + 1);
      }}>Retry place search</button>}
    </div>}
  </div>;
}
