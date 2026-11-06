'use client';

import { useRouter } from 'next/navigation';
import { type FormEvent, useRef, useState } from 'react';
import { ArrowRight, LoaderCircle } from 'lucide-react';
import { getWebSession, ApiError, type Point } from '@/lib/client-api';
import { PlaceField } from './place-field';

export function HeroSearch({ next = '/ride', initialPickup = '', initialDestination = '' }: { next?: string; initialPickup?: string; initialDestination?: string }) {
  const router = useRouter();
  const [pickupText, setPickupText] = useState(initialPickup);
  const [destinationText, setDestinationText] = useState(initialDestination);
  const [pickup, setPickup] = useState<Point | null>(null);
  const [destination, setDestination] = useState<Point | null>(null);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const submitting = useRef(false);

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

  return <form className="hero-booking" onSubmit={submit} aria-busy={checking}>
    <div className="place-pair">
      <PlaceField kind="pickup" label="Pickup location" placeholder="Enter pickup location" value={pickupText} selected={pickup}
        onChange={text => { setPickupText(text); setPickup(null); setError(''); }}
        onSelect={point => { setPickup(point); setPickupText(point.address || 'Pickup'); setError(''); }} />
      <PlaceField kind="destination" label="Dropoff location" placeholder="Enter dropoff location" value={destinationText} selected={destination}
        onChange={text => { setDestinationText(text); setDestination(null); setError(''); }}
        onSelect={point => { setDestination(point); setDestinationText(point.address || 'Destination'); setError(''); }} />
    </div>
    {error && <p className="form-error" role="alert">{error}</p>}
    <button type="submit" className="primary-button" disabled={checking}>
      {checking ? <>Opening planner… <LoaderCircle className="spin" size={18} aria-hidden /></> : <>Plan your journey <ArrowRight size={18} aria-hidden /></>}
    </button>
  </form>;
}
