import { LOCATION_MAX_AGE_MS, LOCATION_PRECISE_METRES, LocationSample, LocationSampleFilter } from '../../shared/location-quality';

/** Cached measurements are suggestions, never silently relabelled as fresh GPS. */
export function locationNeedsConfirmation(sample: { accuracy?: number; sampleTimestamp?: number }) {
  return (sample.accuracy ?? Infinity) > LOCATION_PRECISE_METRES || !sample.sampleTimestamp || Date.now() - sample.sampleTimestamp > 2000;
}

/** Race the browser's recent cache with a live watch, independently of HTTP. */
export function browserLocation(geolocation: Geolocation, signal?: AbortSignal, timeoutMs = 20000, onUpdate?: (sample: LocationSample) => void): Promise<LocationSample> {
  // An area estimate is a starting point for choosing a pickup, not a rider's
  // live position. The planner requires the client to confirm an approximate pin.
  const filter = new LocationSampleFilter({ maxAccuracy: 3000 });
  return new Promise((resolve, reject) => {
    let watcher: number | undefined, best: LocationSample | undefined, done = false;
    let refinementTimer: ReturnType<typeof setTimeout> | undefined;
    const finish = (sample?: LocationSample, error?: Error) => {
      if (done) return; done = true; clearTimeout(timer); if (refinementTimer) clearTimeout(refinementTimer);
      if (watcher != null) geolocation.clearWatch(watcher);
      signal?.removeEventListener('abort', cancel);
      if (sample && Date.now() - sample.sampleTimestamp <= LOCATION_MAX_AGE_MS) resolve(sample);
      else reject(error || new Error('We couldn’t find your location. Check Location Services, retry, or choose a pickup on the map.'));
    };
    const cancel = () => finish(undefined, new Error('Location request cancelled.'));
    const timer = setTimeout(() => finish(best), timeoutMs);
    signal?.addEventListener('abort', cancel, { once: true });
    if (signal?.aborted) { cancel(); return; }
    const accept = (position: GeolocationPosition) => {
      const sample: LocationSample = { lat: position.coords.latitude, lng: position.coords.longitude, accuracy: position.coords.accuracy, sampleTimestamp: position.timestamp, provider: 'browser', speed: position.coords.speed != null && position.coords.speed >= 0 ? position.coords.speed : undefined, heading: position.coords.heading != null && position.coords.heading >= 0 && position.coords.heading < 360 ? position.coords.heading : undefined };
      if (done || !filter.accept(sample)) return;
      best = sample;
      onUpdate?.(sample);
      if (!locationNeedsConfirmation(sample)) finish(sample);
      else if (!refinementTimer) refinementTimer = setTimeout(() => finish(best), 1200);
    };
    let cacheDone = !geolocation.getCurrentPosition, providerError: GeolocationPositionError | undefined;
    const failed = (error: GeolocationPositionError) => {
      providerError = error;
      if (error.code === 1 || cacheDone) finish(error.code === 1 ? undefined : best, new Error(error.code === 1 ? 'Allow precise location in your browser settings, or search for a pickup.' : 'Location is unavailable. Check Location Services, retry, or select a pickup.'));
    };
    // A separate low-power request can retrieve a warm browser fix while the
    // high-accuracy provider is starting. Both retain their original timestamp.
    if (geolocation.getCurrentPosition) geolocation.getCurrentPosition(position => {
      accept(position); cacheDone = true; if (providerError) failed(providerError);
    }, () => { cacheDone = true; if (providerError) failed(providerError); }, { enableHighAccuracy: false, maximumAge: LOCATION_MAX_AGE_MS, timeout: 2500 });
    if (done) return;
    watcher = geolocation.watchPosition(accept, failed, { enableHighAccuracy: true, maximumAge: LOCATION_MAX_AGE_MS, timeout: timeoutMs });
    if (done) geolocation.clearWatch(watcher);
  });
}
