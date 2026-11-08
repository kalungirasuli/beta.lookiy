'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import { browserLocation } from '@/lib/current-location';
import { ArrowRight, LoaderCircle, LocateFixed } from 'lucide-react';
import { api, ApiError, getWebSession, Journey, Point, post, Route, ugx } from '@/lib/client-api';
import { PlaceField } from '@/components/place-field';
import { HeroSearch } from '@/components/hero-search';
import { RouteMap } from '@/components/route-map';

type Estimate = { totalFare: number; pricing: { fareId: string; revision: number; pickupFeeUGX?: number; pickupDistanceKm?: number } };
type AvailableVehicle = {
  catalogSpecificationId: string; vehicleType: string; vehicleVariant: string; available: boolean;
  typeLabel?: string; variantLabel?: string; vehicleBrand?: string; vehicleModel?: string; vehicleYear?: number; vehicleCapacity?: number; premium?: boolean;
};

function locationDto({ lat, lng, address }: Point) { return { lat, lng, address }; }

function vehicleLabel(option: AvailableVehicle) {
  return [option.typeLabel || option.vehicleType, option.variantLabel, [option.vehicleBrand, option.vehicleModel, option.vehicleYear].filter(Boolean).join(' '), option.vehicleCapacity && `${option.vehicleCapacity} seats`, option.premium && 'Premium'].filter(Boolean).join(' · ');
}

function RideForm() {
  const router = useRouter();
  const query = useSearchParams();
  const [session, setSession] = useState<'loading' | 'signed' | 'guest' | 'error'>('loading');
  const [pickupText, setPickupText] = useState(query.get('pickup') || '');
  const [destinationText, setDestinationText] = useState(query.get('destination') || '');
  const [pickup, setPickup] = useState<Point | null>(null);
  const [measuredLocation, setMeasuredLocation] = useState<Point | null>(null), [locating, setLocating] = useState(false), [confirmed, setConfirmed] = useState(false);
  const locationRequest = useRef<AbortController | null>(null), pickupVersion = useRef(0);
  useEffect(() => () => { pickupVersion.current++; locationRequest.current?.abort(); }, []);
  function cancelLocation() { pickupVersion.current++; locationRequest.current?.abort(); setLocating(false); }
  const [destination, setDestination] = useState<Point | null>(null);
  const [purpose, setPurpose] = useState<'IN_PERSON_MOVEMENT' | 'DELIVERY'>(query.get('purpose') === 'delivery' ? 'DELIVERY' : 'IN_PERSON_MOVEMENT');
  const [vehicleId, setVehicleId] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState('');
  const [pricingMode, setPricingMode] = useState<'NEGOTIATION' | 'SYSTEM_PRICE'>('SYSTEM_PRICE');
  const [offer, setOffer] = useState<string | null>(null);
  const [payment, setPayment] = useState<'CASH' | 'WALLET'>('CASH');
  const [route, setRoute] = useState<Route | null>(null);
  const [availability, setAvailability] = useState<{ key: string; options: AvailableVehicle[]; error?: string; hasListings?: boolean } | null>(null);
  const [quote, setQuote] = useState<{ key: string; estimate?: Estimate; error?: string } | null>(null);
  const [revision, setRevision] = useState(0);
  const [acceptedFee, setAcceptedFee] = useState('');
  const [routing, setRouting] = useState(false);
  const [busy, setBusy] = useState(false);
  const submitting = useRef(false);
  const [error, setError] = useState('');
  const pickupLat = pickup?.lat, pickupLng = pickup?.lng;
  const passengerCount = purpose === 'IN_PERSON_MOVEMENT' ? passengers : undefined;
  const availabilityKey = `${pickupLat},${pickupLng}|${purpose}|${passengerCount}|${revision}`;
  const currentAvailability = availability?.key === availabilityKey ? availability : null;
  const vehicle = currentAvailability?.options.find(option => option.catalogSpecificationId === vehicleId);
  const quoteKey = `${availabilityKey}|${vehicleId}|${destination?.lat},${destination?.lng}`;
  const currentQuote = quote?.key === quoteKey ? quote : null;
  const estimate = currentQuote?.estimate;
  const fee = estimate?.pricing.pickupFeeUGX ?? 0;
  const feeKey = fee ? `${quoteKey}|${estimate?.pricing.revision}|${estimate?.totalFare}` : '';
  const shownOffer = offer ?? (estimate ? String(estimate.totalFare) : '');

  useEffect(() => {
    getWebSession().then(() => setSession('signed')).catch(e => setSession(e instanceof ApiError && e.status === 401 ? 'guest' : 'error'));
    try {
      const draft = sessionStorage.getItem('lookiy-web-ride-draft');
      if (draft) {
        const saved = JSON.parse(draft);
        if (Date.now() - Number(saved.createdAt || 0) < 20 * 60 * 1000) {
          if (saved.pickup) { setPickup(saved.pickup); setPickupText(saved.pickup.address || 'Current location'); }
          if (saved.destination) { setDestination(saved.destination); setDestinationText(saved.destination.address || 'Destination'); }
          if (!saved.pickup && typeof saved.pickupText === 'string') setPickupText(saved.pickupText);
          if (!saved.destination && typeof saved.destinationText === 'string') setDestinationText(saved.destinationText);
        } else sessionStorage.removeItem('lookiy-web-ride-draft');
      }
    } catch { /* Ignore an expired browser draft. */ }
  }, []);

  useEffect(() => {
    if (session === 'signed') sessionStorage.removeItem('lookiy-web-ride-draft');
  }, [session]);

  useEffect(() => {
    setRoute(null);
    if (!pickup || !destination || session !== 'signed') { setRouting(false); return; }
    let active = true;
    setRouting(true); setError('');
    post<Route>('/api/client/geo/route', { origin: { lat: pickup.lat, lng: pickup.lng }, destination: { lat: destination.lat, lng: destination.lng } }).then(value => { if (active) setRoute(value); }).catch(e => { if (active) setError(e.message); }).finally(() => { if (active) setRouting(false); });
    return () => { active = false; };
  }, [pickup, destination, session]);

  useEffect(() => {
    if (pickupLat == null || pickupLng == null || session !== 'signed') return;
    const controller = new AbortController();
    const query = new URLSearchParams({ pickupLat: String(pickupLat), pickupLng: String(pickupLng), journeyPurpose: purpose, passengerCount: String(passengerCount ?? 0) });
    api<{ options: AvailableVehicle[]; hasVehicleListings?: boolean }>(`/api/client/operators/vehicle-availability?${query}`, { signal: controller.signal })
      .then(data => { if (!controller.signal.aborted) setAvailability({ key: availabilityKey, options: data.options.filter(option => option.available), hasListings: data.hasVehicleListings }); })
      .catch(() => { if (!controller.signal.aborted) setAvailability({ key: availabilityKey, options: [], error: 'Could not check nearby vehicles.' }); });
    return () => controller.abort();
  }, [pickupLat, pickupLng, purpose, passengerCount, availabilityKey, session]);

  useEffect(() => {
    if (!pickup || !destination || !vehicle) return;
    const controller = new AbortController();
    const payload = { pickupLocation: locationDto(pickup), destination: locationDto(destination), vehicleType: vehicle.vehicleType, vehicleVariant: vehicle.vehicleVariant, catalogSpecificationId: vehicle.vehicleType === 'BODA' ? undefined : vehicle.catalogSpecificationId, journeyPurpose: purpose, passengerCount };
    api<Estimate>('/api/client/journeys/price-estimate', { method: 'POST', body: JSON.stringify(payload), signal: controller.signal })
      .then(value => { if (!controller.signal.aborted) setQuote({ key: quoteKey, estimate: value }); })
      .catch(e => { if (!controller.signal.aborted) setQuote({ key: quoteKey, error: e instanceof Error ? e.message : 'Could not check the fare.' }); });
    return () => controller.abort();
  }, [pickup, destination, vehicle, purpose, passengerCount, quoteKey]);

  async function locate() {
    cancelLocation(); const version = pickupVersion.current;
    const controller = new AbortController(); locationRequest.current = controller;
    setError(''); setLocating(true);
    if (!navigator.geolocation) { setError('Your browser does not support location. Search for a pickup instead.'); setLocating(false); return; }
    try {
      const sample = await browserLocation(navigator.geolocation, controller.signal, 20000, sample => { if (version === pickupVersion.current) setMeasuredLocation({ ...sample, source: 'gps', address: 'Current location' }); });
      if (version !== pickupVersion.current) return;
      const { lat, lng } = sample;
      if (lat < -1.5 || lat > 4.3 || lng < 29.5 || lng > 35.1) throw new Error('Choose a pickup within Uganda.');
      const point: Point = { ...sample, source: 'gps', address: 'Current location' };
      setMeasuredLocation(point); setPickup(point); setPickupText(point.address!); setConfirmed(sample.accuracy! <= 30);
      void post<{ formattedAddress?: string }>('/api/client/geo/reverse-geocode', {lat,lng}).then(found => {
        if (version === pickupVersion.current && found.formattedAddress) { setPickup({ ...point, address: found.formattedAddress }); setPickupText(found.formattedAddress); }
      }).catch(() => undefined);
    } catch (error) { if (version === pickupVersion.current && !controller.signal.aborted) setError(error instanceof Error ? error.message : 'Location is unavailable.'); }
    finally { if (version === pickupVersion.current) setLocating(false); }
  }

  async function submit() {
    if (submitting.current) return;
    setError('');
    if (!pickup || !destination) { setError('Select a pickup and destination from the place suggestions.'); return; }
    if (pickup.source === 'gps' && (pickup.accuracy ?? Infinity) > 30 && !confirmed) { setError('Confirm the approximate pickup pin or drag it to your exact meeting point.'); return; }
    if (!route) { setError('Wait for the route preview.'); return; }
    if (!vehicle || !estimate?.pricing) { setError('Choose an available vehicle and wait for its fare.'); return; }
    if (feeKey && acceptedFee !== feeKey) { setError('Confirm the Premium pickup fee to continue.'); return; }
    if (pricingMode === 'NEGOTIATION' && (!Number.isInteger(Number(shownOffer)) || Number(shownOffer) < 1000 || Number(shownOffer) > 10000000)) { setError('Suggest a fare between UGX 1,000 and 10,000,000.'); return; }
    if (purpose === 'DELIVERY' && (!description.trim() || !(Number(weight) > 0) || (vehicle.vehicleType === 'BODA' && Number(weight) >= 50))) { setError('Describe your delivery and enter a valid weight. Boda deliveries must be under 50 kg.'); return; }
    submitting.current = true;
    setBusy(true);
    try {
      const result = await post<{ journey: Journey }>('/api/client/journeys', {
        vehicleType: vehicle.vehicleType, vehicleVariant: vehicle.vehicleVariant, catalogSpecificationId: vehicle.vehicleType === 'BODA' ? undefined : vehicle.catalogSpecificationId,
        journeyPurpose: purpose, pickupLocation: locationDto(pickup), destination: locationDto(destination), passengerCount,
        expectedFare: { fareId: estimate.pricing.fareId, revision: estimate.pricing.revision, totalFare: estimate.totalFare },
        acceptPremiumPickupFee: Boolean(feeKey && acceptedFee === feeKey),
        delivery: purpose === 'DELIVERY' ? { description: description.trim(), weightKg: Number(weight) } : undefined,
        pricingMode, clientPrice: pricingMode === 'NEGOTIATION' ? Number(shownOffer) : undefined, paymentMethod: payment,
      });
      router.push(`/journeys/${result.journey._id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not request a journey.');
      if (e instanceof ApiError && e.status === 409) setRevision(value => value + 1);
    }
    finally { submitting.current = false; setBusy(false); }
  }

  if (session === 'loading') return <div className="workspace"><div className="content-width loading">Opening journey planner…</div></div>;
  if (session !== 'signed') {
    const search = query.toString();
    return <section className="inner-hero content-width split-hero">
      <div>
        <span className="eyebrow">PLAN WITH LOOKIY</span>
        <h1>{query.get('purpose') === 'delivery' ? 'Send a delivery' : 'Get a ride'}</h1>
        <p>Search for your pickup and dropoff. Sign in when you’re ready to plan.</p>
        <HeroSearch next={search ? `/ride?${search}` : '/ride'} initialPickup={pickupText} initialDestination={destinationText} />
      </div>
      <div className="inner-visual">
        <Image src="/images/ride.jpg" fill alt="" sizes="(max-width: 800px) 100vw, 45vw" priority />
      </div>
    </section>;
  }
  return <div className="workspace booking-workspace"><div className="content-width">
    <div className="workspace-head"><div><h1>Plan your journey</h1><p>Set a route, choose a vehicle and agree on a fare.</p></div><Link href="/journeys" className="text-link">Your journeys <ArrowRight size={17} aria-hidden /></Link></div>
    <form className="booking-layout" aria-busy={busy || routing} onSubmit={event => { event.preventDefault(); void submit(); }}>
    <section className="workspace-card form-stack booking-places" aria-label="Pickup and dropoff">
    <div className="place-pair">
      <PlaceField kind="pickup" label="Pickup location" value={pickupText} selected={pickup} placeholder="Enter pickup location" onChange={value => { cancelLocation(); setPickupText(value); setPickup(null); }} onSelect={point => { cancelLocation(); setPickup(point); setPickupText(point.address || 'Pickup'); }}/>
      <PlaceField kind="destination" label="Dropoff location" value={destinationText} selected={destination} placeholder="Where are you going?" onChange={value => { setDestinationText(value); setDestination(null); }} onSelect={point => { setDestination(point); setDestinationText(point.address || 'Destination'); }}/>
    </div>
    <button type="button" className="secondary-button" onClick={locate} disabled={locating}><LocateFixed size={17} aria-hidden /> {locating ? 'Finding an accurate location…' : 'Use current location'}</button>
    {pickup?.source === 'gps' && <p className="form-hint">GPS accuracy: about {Math.round(pickup.accuracy || 0)} m. Check your side of the road; drag the pickup pin to adjust it.</p>}
    {pickup?.source === 'gps' && (pickup.accuracy ?? Infinity) > 30 && !confirmed && <button type="button" className="secondary-button" onClick={() => setConfirmed(true)}>Confirm this approximate pickup pin</button>}
    </section>
    <section className="booking-map" aria-label="Route preview">
      <RouteMap pickup={pickup} destination={destination} route={route} currentLocation={measuredLocation} onPickupChange={point => { cancelLocation(); setPickup({ ...point, source: 'manual', address: 'Pinned pickup' }); setPickupText('Pinned pickup'); setConfirmed(true); }} />
      {routing && <p className="loading" role="status">Preparing your route…</p>}
      {route && <div className="result-line" role="status"><span>Estimated travel</span><strong>{route.distance?.text} · {route.duration?.text}</strong></div>}
    </section>
    <section className="workspace-card form-stack booking-options" aria-label="Ride options">
    <div><h3>What are you moving?</h3><div className="choice-row"><button type="button" aria-pressed={purpose === 'IN_PERSON_MOVEMENT'} className={`choice-button ${purpose === 'IN_PERSON_MOVEMENT' ? 'active' : ''}`} onClick={() => setPurpose('IN_PERSON_MOVEMENT')}>People</button><button type="button" aria-pressed={purpose === 'DELIVERY'} className={`choice-button ${purpose === 'DELIVERY' ? 'active' : ''}`} onClick={() => setPurpose('DELIVERY')}>A delivery</button></div></div>
    {purpose === 'DELIVERY' ? <><div className="form-field"><label htmlFor="delivery-description">What are you sending?</label><input id="delivery-description" className="text-field" value={description} onChange={event => setDescription(event.target.value)} placeholder="Describe the item" maxLength={1000}/></div><div className="form-field"><label htmlFor="delivery-weight">Weight in kg</label><input id="delivery-weight" className="text-field" type="number" inputMode="decimal" min="0.001" step="0.001" value={weight} onChange={event => setWeight(event.target.value)} placeholder="e.g. 5"/></div></> : <div className="form-field"><label htmlFor="passengers">Passengers</label><select id="passengers" className="select-field" value={passengers} onChange={event => setPassengers(Number(event.target.value))}>{Array.from({length:60},(_,index) => index+1).map(value => <option key={value} value={value}>{value}</option>)}</select></div>}
    <div className="form-field">
      <label htmlFor="vehicle">Available vehicles</label>
      {currentAvailability?.options.length ? <select id="vehicle" className="select-field" value={vehicle?.catalogSpecificationId || ''} onChange={event => { setVehicleId(event.target.value); setOffer(null); setError(''); }}>
        <option value="">Choose a vehicle</option>
        {currentAvailability.options.map(option => <option key={option.catalogSpecificationId} value={option.catalogSpecificationId}>{vehicleLabel(option)}</option>)}
      </select> : <p className="form-hint" role="status">{!pickup ? 'Choose a pickup to see nearby vehicles.' : !currentAvailability ? 'Checking nearby vehicles…' : currentAvailability.error || (currentAvailability.hasListings === false ? 'No vehicle list created yet.' : 'No vehicles are available nearby right now.')}</p>}
      {currentAvailability && <button className="place-retry" type="button" onClick={() => setRevision(value => value + 1)}>Refresh nearby vehicles</button>}
    </div>
    {vehicle && destination && !currentQuote && <p role="status" className="form-hint">Checking the fare…</p>}
    {currentQuote?.error && <div className="form-error" role="alert">{currentQuote.error} <button type="button" className="place-retry" onClick={() => setRevision(value => value + 1)}>Refresh fare</button></div>}
    <div className="section-divider"/><div><h3>Fare</h3><div className="choice-row"><button type="button" aria-pressed={pricingMode === 'NEGOTIATION'} className={`choice-button ${pricingMode === 'NEGOTIATION' ? 'active' : ''}`} onClick={() => setPricingMode('NEGOTIATION')}>Suggest my price</button><button type="button" aria-pressed={pricingMode === 'SYSTEM_PRICE'} className={`choice-button ${pricingMode === 'SYSTEM_PRICE' ? 'active' : ''}`} onClick={() => setPricingMode('SYSTEM_PRICE')}>Use estimate</button></div>{estimate && <p className="form-hint" style={{marginTop:10}}>System estimate: {ugx(estimate.totalFare)}. Riders can choose to accept a suggested fare.</p>}</div>
    {fee > 0 && <label className="pickup-fee"><input type="checkbox" checked={acceptedFee === feeKey} onChange={event => setAcceptedFee(event.target.checked ? feeKey : '')} /> I accept the {ugx(fee)} Premium pickup fee included in this estimate.</label>}
    {pricingMode === 'NEGOTIATION' && <div className="form-field"><label htmlFor="fare">Your suggested fare (UGX)</label><input id="fare" className="text-field" type="number" inputMode="numeric" min="1000" max="10000000" step="1" value={shownOffer} onChange={event => setOffer(event.target.value)} placeholder="Enter an amount" /></div>}
    <div><h3>Payment</h3><div className="choice-row"><button type="button" aria-pressed={payment === 'CASH'} className={`choice-button ${payment === 'CASH' ? 'active' : ''}`} onClick={() => setPayment('CASH')}>Cash</button><button type="button" aria-pressed={payment === 'WALLET'} className={`choice-button ${payment === 'WALLET' ? 'active' : ''}`} onClick={() => setPayment('WALLET')}>Wallet</button></div></div>
    {error && <div className="form-error" role="alert">{error}</div>}
    {!!vehicle && <button className="primary-button form-submit" type="submit" disabled={busy || routing || !route || !estimate?.pricing || Boolean(feeKey && acceptedFee !== feeKey)}>{busy ? <>Requesting… <LoaderCircle className="spin" size={18} aria-hidden /></> : <>Request journey <ArrowRight size={18} aria-hidden /></>}</button>}
    </section>
    </form>
  </div></div>;
}

export default function RidePage() { return <Suspense fallback={<div className="workspace"><div className="content-width loading">Opening journey planner…</div></div>}><RideForm/></Suspense>; }
