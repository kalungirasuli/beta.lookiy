'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { ArrowRight, LocateFixed, MapPinned } from 'lucide-react';
import { api, ApiError, Journey, Point, post, Route, ugx } from '@/lib/client-api';
import { PlaceField } from '@/components/place-field';
import { RouteMap } from '@/components/route-map';

type Estimate = { totalFare: number; currency: string };

function RideForm() {
  const router = useRouter();
  const query = useSearchParams();
  const [session, setSession] = useState<'loading' | 'signed' | 'guest' | 'error'>('loading');
  const [pickupText, setPickupText] = useState(query.get('pickup') || '');
  const [destinationText, setDestinationText] = useState(query.get('destination') || '');
  const [pickup, setPickup] = useState<Point | null>(null);
  const [destination, setDestination] = useState<Point | null>(null);
  const [purpose, setPurpose] = useState<'IN_PERSON_MOVEMENT' | 'DELIVERY'>(query.get('purpose') === 'delivery' ? 'DELIVERY' : 'IN_PERSON_MOVEMENT');
  const [vehicle, setVehicle] = useState('CAR');
  const [passengers, setPassengers] = useState(1);
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState('');
  const [pricingMode, setPricingMode] = useState<'NEGOTIATION' | 'SYSTEM_PRICE'>('NEGOTIATION');
  const [offer, setOffer] = useState('');
  const [payment, setPayment] = useState<'CASH' | 'WALLET'>('CASH');
  const [route, setRoute] = useState<Route | null>(null);
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [routing, setRouting] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/api/session/me').then(() => setSession('signed')).catch(e => setSession(e instanceof ApiError && e.status === 401 ? 'guest' : 'error'));
    try {
      const draft = sessionStorage.getItem('lookiy-web-ride-draft');
      if (draft) {
        const saved = JSON.parse(draft);
        if (Date.now() - Number(saved.createdAt || 0) < 20 * 60 * 1000) {
          if (saved.pickup) { setPickup(saved.pickup); setPickupText(saved.pickup.address || 'Current location'); }
          if (saved.destination) { setDestination(saved.destination); setDestinationText(saved.destination.address || 'Destination'); }
        } else sessionStorage.removeItem('lookiy-web-ride-draft');
      }
    } catch { /* Ignore an expired browser draft. */ }
  }, []);

  useEffect(() => {
    if (session === 'signed') sessionStorage.removeItem('lookiy-web-ride-draft');
  }, [session]);

  useEffect(() => {
    if (!pickup || !destination || session !== 'signed') { setRoute(null); setEstimate(null); return; }
    let active = true;
    setRouting(true); setError('');
    post<Route>('/api/client/geo/route', { origin: pickup, destination }).then(value => { if (active) setRoute(value); }).catch(e => { if (active) setError(e.message); }).finally(() => { if (active) setRouting(false); });
    return () => { active = false; };
  }, [pickup, destination, session]);

  useEffect(() => {
    if (!pickup || !destination || !route) { setEstimate(null); return; }
    let active = true;
    post<Estimate>('/api/client/journeys/price-estimate', { pickupLocation: pickup, destination, vehicleType: vehicle }).then(value => { if (active) { setEstimate(value); if (!offer) setOffer(String(value.totalFare)); } }).catch(e => { if (active) setError(e.message); });
    return () => { active = false; };
  }, [pickup, destination, route, vehicle]);

  async function locate() {
    setError('');
    if (!navigator.geolocation) { setError('Your browser does not support location. Search for a pickup instead.'); return; }
    navigator.geolocation.getCurrentPosition(async position => {
      const { latitude: lat, longitude: lng } = position.coords;
      if (lat < -1.5 || lat > 4.3 || lng < 29.5 || lng > 35.1) { setError('Choose a pickup within Uganda.'); return; }
      let address = 'Current location';
      try { const found = await post<{ formattedAddress?: string }>('/api/client/geo/reverse-geocode', {lat,lng}); address = found.formattedAddress || address; } catch {}
      setPickup({ lat,lng,address }); setPickupText(address);
    }, () => setError('Location is unavailable. Search for your pickup instead.'), { enableHighAccuracy: false, timeout: 12000 });
  }

  async function submit() {
    setError('');
    if (!pickup || !destination) { setError('Select a pickup and destination from the place suggestions.'); return; }
    if (!route) { setError('Wait for the route preview.'); return; }
    if (pricingMode === 'SYSTEM_PRICE' && !estimate) { setError('Wait for the system estimate, or suggest your own fare.'); return; }
    if (pricingMode === 'NEGOTIATION' && (!Number.isInteger(Number(offer)) || Number(offer) < 1000 || Number(offer) > 10000000)) { setError('Suggest a fare between UGX 1,000 and 10,000,000.'); return; }
    if (purpose === 'DELIVERY' && (!description.trim() || !(Number(weight) > 0) || (vehicle === 'BODA' && Number(weight) >= 50))) { setError('Describe your delivery and enter a valid weight. Boda deliveries must be under 50 kg.'); return; }
    setBusy(true);
    try {
      const result = await post<{ journey: Journey }>('/api/client/journeys', {
        vehicleType: vehicle, journeyPurpose: purpose, pickupLocation: pickup, destination,
        passengerCount: purpose === 'IN_PERSON_MOVEMENT' ? passengers : undefined,
        delivery: purpose === 'DELIVERY' ? { description: description.trim(), weightKg: Number(weight) } : undefined,
        pricingMode, clientPrice: pricingMode === 'NEGOTIATION' ? Number(offer) : undefined, paymentMethod: payment,
      });
      router.push(`/journeys/${result.journey._id}`);
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not request a journey.'); }
    finally { setBusy(false); }
  }

  if (session === 'loading') return <div className="workspace"><div className="content-width loading">Opening journey planner…</div></div>;
  if (session === 'guest') return <div className="workspace"><div className="content-width"><div className="empty-state"><MapPinned size={39}/><h2>Sign in to plan your journey</h2><p>Place search, route previews and bookings are connected to your Lookiy account.</p><Link className="primary-button inline-button" href={`/login?next=${encodeURIComponent(`/ride?${query.toString()}`)}`}>Sign in to continue <ArrowRight size={17}/></Link></div></div></div>;
  if (session === 'error') return <div className="workspace"><div className="content-width"><div className="form-error">The API is unavailable. Check the gateway connection and try again.</div></div></div>;
  return <div className="workspace"><div className="content-width"><div className="workspace-head"><div><span className="eyebrow">YOUR NEXT JOURNEY</span><h1>Where to?</h1><p>Set a route, choose a vehicle and agree on a fare.</p></div><Link href="/journeys" className="text-link">Your journeys <ArrowRight size={17}/></Link></div><div className="workspace-grid"><div className="workspace-card"><h2>Plan your journey</h2><div className="form-stack">
    <PlaceField label="Pickup" value={pickupText} selected={pickup} placeholder="Where should we pick you up?" onChange={value => { setPickupText(value); setPickup(null); }} onSelect={point => { setPickup(point); setPickupText(point.address || 'Pickup'); }}/>
    <button type="button" className="secondary-button" onClick={locate} style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8}}><LocateFixed size={17} color="#1769e8"/> Use current location</button>
    <PlaceField label="Destination" value={destinationText} selected={destination} placeholder="Where are you going?" onChange={value => { setDestinationText(value); setDestination(null); }} onSelect={point => { setDestination(point); setDestinationText(point.address || 'Destination'); }}/>
    <div className="section-divider"/><div><h3>What are you moving?</h3><div className="choice-row"><button type="button" className={`choice-button ${purpose === 'IN_PERSON_MOVEMENT' ? 'active' : ''}`} onClick={() => setPurpose('IN_PERSON_MOVEMENT')}>People</button><button type="button" className={`choice-button ${purpose === 'DELIVERY' ? 'active' : ''}`} onClick={() => setPurpose('DELIVERY')}>A delivery</button></div></div>
    <div><h3>Vehicle</h3><div className="choice-row">{['BODA','CAR','TAXI','VAN'].map(value => <button type="button" className={`choice-button ${vehicle === value ? 'active' : ''}`} key={value} onClick={() => { setVehicle(value); if (value === 'BODA' && passengers > 2) setPassengers(2); }}>{value === 'BODA' ? 'Boda' : value === 'CAR' ? 'Car' : value === 'TAXI' ? 'Taxi' : 'Van'}</button>)}</div></div>
    {purpose === 'DELIVERY' ? <><div className="form-field"><label htmlFor="delivery-description">What are you sending?</label><input id="delivery-description" className="text-field" value={description} onChange={event => setDescription(event.target.value)} placeholder="Describe the item" maxLength={1000}/></div><div className="form-field"><label htmlFor="delivery-weight">Weight in kg</label><input id="delivery-weight" className="text-field" type="number" inputMode="decimal" min="0.001" step="0.1" value={weight} onChange={event => setWeight(event.target.value)} placeholder="e.g. 5"/></div></> : <div className="form-field"><label htmlFor="passengers">Passengers</label><select id="passengers" className="select-field" value={passengers} onChange={event => setPassengers(Number(event.target.value))}>{Array.from({length:vehicle === 'BODA' ? 2 : vehicle === 'CAR' ? 4 : 10},(_,index) => index+1).map(value => <option key={value} value={value}>{value}</option>)}</select></div>}
    <div className="section-divider"/><div><h3>Fare</h3><div className="choice-row"><button type="button" className={`choice-button ${pricingMode === 'NEGOTIATION' ? 'active' : ''}`} onClick={() => setPricingMode('NEGOTIATION')}>Suggest my price</button><button type="button" className={`choice-button ${pricingMode === 'SYSTEM_PRICE' ? 'active' : ''}`} onClick={() => setPricingMode('SYSTEM_PRICE')}>Use estimate</button></div>{estimate && <p className="form-hint" style={{marginTop:10}}>System estimate: {ugx(estimate.totalFare)}. Riders can choose to accept a suggested fare.</p>}</div>
    {pricingMode === 'NEGOTIATION' && <div className="form-field"><label htmlFor="fare">Your suggested fare (UGX)</label><input id="fare" className="text-field" type="number" inputMode="numeric" min="1000" max="10000000" step="1" value={offer} onChange={event => setOffer(event.target.value)} placeholder="Enter an amount" /></div>}
    <div><h3>Payment</h3><div className="choice-row"><button type="button" className={`choice-button ${payment === 'CASH' ? 'active' : ''}`} onClick={() => setPayment('CASH')}>Cash</button><button type="button" className={`choice-button ${payment === 'WALLET' ? 'active' : ''}`} onClick={() => setPayment('WALLET')}>Wallet</button></div></div>
    {error && <div className="form-error" role="alert">{error}</div>}
    <button className="primary-button form-submit" type="button" onClick={() => void submit()} disabled={busy || routing}>{busy ? 'Requesting…' : 'Request journey'} <ArrowRight size={18}/></button>
  </div></div><div><RouteMap pickup={pickup} destination={destination} route={route}/>{routing && <p className="loading">Preparing your route…</p>}{route && <div className="result-line"><span>Estimated travel</span><strong>{route.distance?.text} · {route.duration?.text}</strong></div>}</div></div></div></div>;
}

export default function RidePage() { return <Suspense fallback={<div className="workspace"><div className="content-width loading">Opening journey planner…</div></div>}><RideForm/></Suspense>; }
