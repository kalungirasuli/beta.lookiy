'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { ArrowRight, Circle, MapPin } from 'lucide-react';
import { api, Place, Point } from '@/lib/client-api';
import { loadGoogleMaps } from '@/lib/google-maps';

type Prediction = { label: string; place?: any; point?: Point };

function HeroPlaceInput({ id, label, placeholder, value, selected, onChange, onSelect, icon }: {
  id: string; label: string; placeholder: string; value: string; selected: Point | null;
  onChange: (text: string) => void; onSelect: (point: Point) => void; icon: React.ReactNode;
}) {
  const [options, setOptions] = useState<Prediction[]>([]);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [active, setActive] = useState(-1);
  const token = useRef<any>(null);
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '';

  useEffect(() => {
    if (!open || selected || value.trim().length < 2) {
      setOptions([]);
      setBusy(false);
      return;
    }
    let current = true;
    const timer = setTimeout(async () => {
      setBusy(true);
      setMessage('');
      try {
        let next: Prediction[];
        if (key) {
          await loadGoogleMaps(key);
          const places = await window.google.maps.importLibrary('places');
          if (!token.current) token.current = new places.AutocompleteSessionToken();
          const result = await places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input: value.trim(), includedRegionCodes: ['ug'], region: 'ug', sessionToken: token.current,
          });
          next = result.suggestions.filter((item: any) => item.placePrediction).slice(0, 5).map((item: any) => ({
            label: item.placePrediction.text.toString(), place: item.placePrediction.toPlace(),
          }));
        } else {
          const results = await api<Place[]>(`/api/client/geo/search?q=${encodeURIComponent(value.trim())}&limit=5`);
          next = results.map(place => ({ label: place.formattedAddress, point: { lat: place.lat, lng: place.lng, address: place.formattedAddress } }));
        }
        if (current) {
          setOptions(next);
          setActive(-1);
          if (!next.length) setMessage('No places found in Uganda. Try another name.');
        }
      } catch {
        if (current) { setOptions([]); setMessage('Place search is unavailable. Please try again later.'); }
      } finally { if (current) setBusy(false); }
    }, 300);
    return () => { current = false; clearTimeout(timer); };
  }, [key, open, selected, value]);

  async function choose(option: Prediction) {
    setBusy(true);
    setMessage('');
    try {
      let point = option.point;
      if (!point && option.place) {
        await option.place.fetchFields({ fields: ['location', 'formattedAddress'] });
        const location = option.place.location;
        if (!location) throw new Error('This place has no location.');
        point = { lat: location.lat(), lng: location.lng(), address: option.place.formattedAddress || option.label };
      }
      if (!point || !Number.isFinite(point.lat) || !Number.isFinite(point.lng)) throw new Error('This place has no coordinates.');
      onSelect(point);
      token.current = null;
      setOptions([]);
      setOpen(false);
    } catch { setMessage('Could not select this place. Try another result.'); }
    finally { setBusy(false); }
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!open || !options.length) return;
    if (event.key === 'ArrowDown') { event.preventDefault(); setActive(index => Math.min(index + 1, options.length - 1)); }
    if (event.key === 'ArrowUp') { event.preventDefault(); setActive(index => Math.max(index - 1, 0)); }
    if (event.key === 'Escape') { event.preventDefault(); setOpen(false); }
    if (event.key === 'Enter' && active >= 0) { event.preventDefault(); void choose(options[active]); }
  }

  return <div className="booking-place">
    <div className="booking-input">{icon}<input id={id} aria-label={label} role="combobox" aria-autocomplete="list" aria-expanded={open && options.length > 0} aria-controls={`${id}-options`} aria-activedescendant={active >= 0 ? `${id}-option-${active}` : undefined} placeholder={placeholder} value={value} onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 140)} onChange={event => { onChange(event.target.value); setOpen(true); }} onKeyDown={onKeyDown} autoComplete="off" /></div>
    {open && value.trim().length >= 2 && !selected && (busy || options.length > 0 || message) && <div className="hero-suggestions" id={`${id}-options`} role="listbox" aria-label={`${label} suggestions`}>
      {busy && <div className="hero-suggestion-status">Searching Uganda places…</div>}
      {!busy && options.map((option, index) => <button type="button" role="option" aria-selected={index === active} id={`${id}-option-${index}`} className={index === active ? 'active' : ''} key={`${option.label}-${index}`} onMouseDown={event => event.preventDefault()} onClick={() => void choose(option)}><MapPin size={17}/><span>{option.label}</span></button>)}
      {!busy && message && <div className="hero-suggestion-status">{message}</div>}
      {!!key && options.length > 0 && <div className="hero-suggestion-credit">Powered by Google</div>}
    </div>}
  </div>;
}

export function HeroSearch() {
  const router = useRouter();
  const [pickupText, setPickupText] = useState('');
  const [destinationText, setDestinationText] = useState('');
  const [pickup, setPickup] = useState<Point | null>(null);
  const [destination, setDestination] = useState<Point | null>(null);
  const [error, setError] = useState('');

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!pickup || !destination) { setError('Choose both places from the suggestions before continuing.'); return; }
    setError('');
    sessionStorage.setItem('lookiy-web-ride-draft', JSON.stringify({ pickup, destination, createdAt: Date.now() }));
    const query = new URLSearchParams({ pickup: pickup.address || pickupText, destination: destination.address || destinationText });
    router.push(`/ride?${query}`);
  }

  return <form className="hero-booking" onSubmit={submit}>
    <HeroPlaceInput id="hero-pickup" label="Pickup location" placeholder="Pickup location" value={pickupText} selected={pickup} onChange={text => { setPickupText(text); setPickup(null); setError(''); }} onSelect={point => { setPickup(point); setPickupText(point.address || 'Pickup'); setError(''); }} icon={<Circle size={16} strokeWidth={2.5} />} />
    <HeroPlaceInput id="hero-destination" label="Destination" placeholder="Dropoff location" value={destinationText} selected={destination} onChange={text => { setDestinationText(text); setDestination(null); setError(''); }} onSelect={point => { setDestination(point); setDestinationText(point.address || 'Destination'); setError(''); }} icon={<MapPin size={18} fill="currentColor" />} />
    {error && <p className="hero-search-error" role="alert">{error}</p>}
    <button type="submit" className="primary-button">Plan your journey <ArrowRight size={18} /></button>
  </form>;
}
