'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { type FormEvent, useEffect, useRef, useState } from 'react';
import { ArrowRight, Clock3, LoaderCircle, Navigation } from 'lucide-react';
import { getWebSession, ApiError, type Point } from '@/lib/client-api';
import { browserLocation } from '@/lib/current-location';
import { PlaceField } from './place-field';

export function HeroSearch({ next = '/ride', initialPickup = '', initialDestination = '', homepage = false }: { next?: string; initialPickup?: string; initialDestination?: string; homepage?: boolean }) {
  const router = useRouter();
  const [pickupText, setPickupText] = useState(initialPickup);
  const [destinationText, setDestinationText] = useState(initialDestination);
  const [pickup, setPickup] = useState<Point | null>(null);
  const [destination, setDestination] = useState<Point | null>(null);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const [locating, setLocating] = useState(false);
  const submitting = useRef(false);
  const locationRequest = useRef<AbortController | null>(null);
  useEffect(() => () => locationRequest.current?.abort(), []);

  function selectPickup(point: Point) {
    locationRequest.current?.abort();
    setLocating(false);
    setPickup(point);
    setPickupText(point.address || 'Pickup');
    setError('');
  }

  async function useCurrentLocation() {
    if (locating || checking) return;
    if (!navigator.geolocation) { setError('Search for a pickup location instead.'); return; }
    const controller = new AbortController();
    locationRequest.current?.abort();
    locationRequest.current = controller;
    setLocating(true);
    setError('');
    try {
      const position = await browserLocation(navigator.geolocation, controller.signal);
      if (controller.signal.aborted) return;
      if (position.lat < -1.5 || position.lat > 4.3 || position.lng < 29.5 || position.lng > 35.1) throw new Error('Choose a pickup within Uganda.');
      selectPickup({ ...position, source: 'gps', address: 'Current location' });
    } catch (error) {
      if (!controller.signal.aborted) setError(error instanceof Error ? error.message : 'Could not find your location. Search for a pickup instead.');
    } finally {
      if (locationRequest.current === controller) setLocating(false);
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setChecking(true);
    setError('');
    try {
      sessionStorage.setItem('lookiy-web-ride-draft', JSON.stringify({ pickup, destination, pickupText, destinationText, createdAt: Date.now() }));
      await getWebSession();
      router.push(next);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) router.push(`/login?next=${encodeURIComponent(next)}`);
      else {
        setError('Could not open the journey planner. Please try again.');
        submitting.current = false;
        setChecking(false);
      }
    }
  }

  const submitButton = <button type="submit" className="primary-button" disabled={checking || locating}>
    {checking ? <>Opening planner… <LoaderCircle className="spin" size={18} aria-hidden /></> : homepage ? 'See prices' : <>Plan your journey <ArrowRight size={18} aria-hidden /></>}
  </button>;

  return <form className={homepage ? 'hero-booking home-booking' : 'hero-booking'} onSubmit={submit} aria-busy={checking || locating}>
    {homepage && <span className="home-pickup-time"><Clock3 size={18} aria-hidden /> Pickup now</span>}
    <div className="place-pair">
      <PlaceField kind="pickup" label="Pickup location" placeholder={homepage ? 'Pickup location' : 'Enter pickup location'} value={pickupText} selected={pickup}
        fieldId={homepage ? 'home-pickup' : undefined}
        action={homepage && <button type="button" className="home-location-button" aria-label="Use my current location" disabled={locating || checking} onClick={useCurrentLocation}>
          {locating ? <LoaderCircle className="spin" size={20} aria-hidden /> : <Navigation size={20} fill="currentColor" aria-hidden />}
        </button>}
        onChange={text => { locationRequest.current?.abort(); setLocating(false); setPickupText(text); setPickup(null); setError(''); }}
        onSelect={selectPickup} />
      <PlaceField kind="destination" label="Dropoff location" placeholder={homepage ? 'Dropoff location' : 'Enter dropoff location'} value={destinationText} selected={destination}
        onChange={text => { setDestinationText(text); setDestination(null); setError(''); }}
        onSelect={point => { setDestination(point); setDestinationText(point.address || 'Destination'); setError(''); }} />
    </div>
    {error && <p className="form-error" role="alert">{error}</p>}
    {homepage ? <div className="home-booking-actions">{submitButton}<Link href="/journeys">View your journey activity</Link></div> : submitButton}
  </form>;
}
