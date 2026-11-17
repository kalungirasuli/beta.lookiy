'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Circle, MapPin, Square, Store } from 'lucide-react';
import { api, type Place, type Point } from '@/lib/client-api';

type BusinessDestination = { businessId: string; businessName: string; category: string; address?: string; buildingName?: string; shopName?: string; floorNumber?: string; roomNumber?: string; lat: number; lng: number };
type SearchOption = { kind: 'place' | 'business'; value: Place | BusinessDestination; title: string; subtitle?: string };
type SearchResult<T> = { query: string; items: T[]; error?: boolean };
type Props = { label: string; value: string; selected: Point | null; onChange: (value: string) => void; onSelect: (place: Point) => void; placeholder: string; kind: 'pickup' | 'destination'; fieldId?: string; action?: ReactNode };

function businessAddress(business: BusinessDestination) {
  const values = [business.shopName, business.buildingName, business.floorNumber ? `Floor ${business.floorNumber}` : '', business.roomNumber ? `Room ${business.roomNumber}` : '', business.address];
  return [...new Map(values.filter(Boolean).map(value => [value!.trim().toLowerCase(), value!.trim()])).values()].join(', ');
}

function businessDestinationAddress(business: BusinessDestination) {
  return [business.businessName, businessAddress(business)].filter(Boolean).join(', ');
}

function validBusiness(value: unknown): value is BusinessDestination {
  const business = value as Partial<BusinessDestination>;
  return typeof business?.businessId === 'string' && typeof business.businessName === 'string' && Number.isFinite(business.lat) && Number.isFinite(business.lng);
}

export function PlaceField({ label, value, selected, onChange, onSelect, placeholder, kind, fieldId, action }: Props) {
  const generatedId = useId();
  const id = fieldId || generatedId;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [revision, setRevision] = useState(0);
  const [places, setPlaces] = useState<SearchResult<Place>>();
  const [businesses, setBusinesses] = useState<SearchResult<BusinessDestination>>();
  const [choosing, setChoosing] = useState(false);
  const [selectionError, setSelectionError] = useState('');
  const searchSession = useRef('');
  const selectionRequest = useRef<AbortController | null>(null);
  useEffect(() => () => selectionRequest.current?.abort(), []);
  const query = value.trim().replace(/\s+/g, ' ');
  const searching = open && !selected && query.length >= 2;
  const currentPlaces = searching && places?.query === query ? places : undefined;
  const currentBusinesses = searching && businesses?.query === query ? businesses : undefined;
  const options: SearchOption[] = [
    ...(currentPlaces?.items || []).map(place => ({ kind: 'place' as const, value: place, title: place.primaryText || place.formattedAddress, subtitle: place.secondaryText })),
    ...(currentBusinesses?.items || []).map(business => ({ kind: 'business' as const, value: business, title: business.businessName, subtitle: [business.category, businessAddress(business)].filter(Boolean).join(' · ') })),
  ];
  const expanded = searching;

  useEffect(() => {
    if (!searching) return;
    const controller = new AbortController();
    if (!searchSession.current && globalThis.crypto?.randomUUID) searchSession.current = globalThis.crypto.randomUUID();
    const params = new URLSearchParams({ q: query });
    if (searchSession.current) params.set('sessionToken', searchSession.current);
    const placeTimer = setTimeout(async () => {
      try {
        const data = await api<Place[]>(`/api/client/geo/search?${params}`, { signal: controller.signal });
        const items = data.filter(place => place.formattedAddress && (place.placeId || (Number.isFinite(place.lat) && Number.isFinite(place.lng))));
        if (!controller.signal.aborted) { setPlaces({ query, items }); setActive(-1); }
      } catch {
        if (!controller.signal.aborted) setPlaces({ query, items: [], error: true });
      }
    }, 180);
    const businessTimer = setTimeout(async () => {
      try {
        const data = await api<BusinessDestination[]>(`/api/client/businesses/search?${new URLSearchParams({ q: query })}`, { signal: controller.signal });
        if (!controller.signal.aborted) setBusinesses({ query, items: data.filter(validBusiness) });
      } catch {
        if (!controller.signal.aborted) setBusinesses({ query, items: [], error: true });
      }
    }, 300);
    return () => { clearTimeout(placeTimer); clearTimeout(businessTimer); controller.abort(); };
  }, [query, searching, revision]);

  function cancelSelection() {
    selectionRequest.current?.abort();
    selectionRequest.current = null;
    setChoosing(false);
    setSelectionError('');
  }

  async function select(option: SearchOption) {
    if (selectionRequest.current) return;
    const controller = new AbortController();
    selectionRequest.current = controller;
    setSelectionError('');
    try {
      const place = option.value as Place;
      let { lat, lng } = place;
      let address = option.kind === 'place' ? place.formattedAddress : businessDestinationAddress(option.value as BusinessDestination);
      if (option.kind === 'place' && (!Number.isFinite(lat) || !Number.isFinite(lng))) {
        setChoosing(true);
        const params = new URLSearchParams({ id: place.placeId || '', sessionToken: searchSession.current });
        const details = await api<Place>(`/api/client/geo/place-details?${params}`, { signal: controller.signal });
        ({ lat, lng } = details);
        address = details.formattedAddress || address;
        searchSession.current = '';
      }
      if (controller.signal.aborted) return;
      if (lat === undefined || lng === undefined || !Number.isFinite(lat) || !Number.isFinite(lng)) throw new Error('Missing location');
      onSelect({ lat, lng, address, source: option.kind === 'place' ? 'place' : 'manual' });
      searchSession.current = '';
      setActive(-1);
      setOpen(false);
    } catch {
      if (!controller.signal.aborted) setSelectionError('Could not select that place. Please try again.');
    } finally {
      if (selectionRequest.current === controller) selectionRequest.current = null;
      if (!controller.signal.aborted) setChoosing(false);
    }
  }

  function handleKey(event: KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing) return;
    if (event.key === 'Escape' && open) { event.preventDefault(); cancelSelection(); setOpen(false); setActive(-1); }
    else if (event.key === 'ArrowDown' && !open && !selected && query.length >= 2) { event.preventDefault(); setOpen(true); }
    else if (options.length && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      event.preventDefault();
      const next = event.key === 'ArrowDown' ? Math.min(active + 1, options.length - 1) : active < 0 ? options.length - 1 : Math.max(active - 1, 0);
      setActive(next); document.getElementById(`${id}-option-${next}`)?.scrollIntoView({ block: 'nearest' });
    } else if (options.length && event.key === 'Enter' && options[active]) { event.preventDefault(); select(options[active]); }
  }

  const placeRows = options.filter((option): option is SearchOption & { kind: 'place'; value: Place } => option.kind === 'place');
  const businessRows = options.filter((option): option is SearchOption & { kind: 'business'; value: BusinessDestination } => option.kind === 'business');
  const optionIndex = (option: SearchOption) => options.indexOf(option);

  return <div className="place-field" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) { cancelSelection(); searchSession.current = ''; setOpen(false); setActive(-1); } }}>
    <label htmlFor={id}>{label}</label>
    <div className="place-input">
      {kind === 'pickup' ? <Circle size={13} fill="currentColor" aria-hidden /> : <Square size={13} fill="currentColor" aria-hidden />}
      <input id={id} role="combobox" aria-autocomplete="list" aria-expanded={expanded} aria-controls={expanded ? `${id}-options` : undefined} aria-activedescendant={expanded && options[active] ? `${id}-option-${active}` : undefined} autoComplete="off" placeholder={placeholder} value={value}
        onFocus={() => setOpen(true)} onClick={() => setOpen(true)} onChange={event => { cancelSelection(); onChange(event.target.value); setActive(-1); setOpen(true); }} onKeyDown={handleKey} />
      {action}
    </div>
    {expanded && <div className="place-popup" id={`${id}-options`} role="listbox" aria-label={`${label} suggestions`}>
      <section className="place-result-section"><div className="place-result-heading"><strong>Places</strong><span translate="no">Google Maps</span></div>
        {placeRows.length ? <div className="place-options">{placeRows.map(option => <ResultRow key={(option.value as Place).placeId || `${option.value.lat}-${option.value.lng}`} option={option} index={optionIndex(option)} active={active} id={id} onSelect={select} />)}</div> : <p className="place-empty">{!currentPlaces ? 'Searching places…' : currentPlaces.error ? 'Places are unavailable right now.' : 'No matching places found.'}</p>}
      </section>
      <section className="place-result-section place-businesses"><div className="place-result-heading"><strong>Businesses</strong></div>
        {businessRows.length ? <div className="place-options">{businessRows.map(option => <ResultRow key={(option.value as BusinessDestination).businessId} option={option} index={optionIndex(option)} active={active} id={id} onSelect={select} />)}</div> : <p className="place-empty">{!currentBusinesses ? 'Searching businesses…' : currentBusinesses.error ? 'Businesses are unavailable right now.' : 'No matching businesses found.'}</p>}
      </section>
      {choosing && <p className="place-empty" role="status">Finding the selected place…</p>}
      {selectionError && <p className="place-empty" role="alert">{selectionError}</p>}
      {(currentPlaces?.error || currentBusinesses?.error) && <button className="place-retry" type="button" onClick={() => { setPlaces(undefined); setBusinesses(undefined); setRevision(value => value + 1); }}>Retry search</button>}
    </div>}
  </div>;
}

function ResultRow({ option, index, active, id, onSelect }: { option: SearchOption; index: number; active: number; id: string; onSelect: (option: SearchOption) => void }) {
  return <div role="option" tabIndex={-1} id={`${id}-option-${index}`} aria-selected={active === index} onMouseDown={event => event.preventDefault()} onClick={() => onSelect(option)}>
    {option.kind === 'place' ? <MapPin size={19} aria-hidden /> : <Store size={19} aria-hidden />}
    <span><strong>{option.title}</strong>{option.subtitle && <small>{option.subtitle}</small>}</span>
  </div>;
}
