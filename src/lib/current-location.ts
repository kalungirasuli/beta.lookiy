import { LOCATION_PRECISE_METRES, LocationSample, LocationSampleFilter } from '../../shared/location-quality';

/** Race a very recent browser fix with live GPS; unusable/old fixes are rejected. */
export function browserLocation(geolocation: Geolocation, signal?: AbortSignal, timeoutMs = 20000, onUpdate?: (sample: LocationSample) => void): Promise<LocationSample> {
  const started = Date.now(), filter = new LocationSampleFilter();
  return new Promise((resolve, reject) => {
    let watcher: number | undefined, best: LocationSample | undefined, done = false;
    let refinementTimer: ReturnType<typeof setTimeout> | undefined;
    const finish = (sample?: LocationSample, error?: Error) => {
      if (done) return; done = true; clearTimeout(timer); if (refinementTimer) clearTimeout(refinementTimer);
      if (watcher != null) geolocation.clearWatch(watcher);
      signal?.removeEventListener('abort', cancel);
      if (sample && Date.now() - sample.sampleTimestamp <= 30000) resolve(sample);
      else reject(error || new Error('GPS is not accurate enough yet. Enable precise location, retry outdoors, or select the pickup pin.'));
    };
    const cancel = () => finish(undefined, new Error('Location request cancelled.'));
    const timer = setTimeout(() => finish(best), timeoutMs);
    signal?.addEventListener('abort', cancel, { once: true });
    if (signal?.aborted) { cancel(); return; }
    watcher = geolocation.watchPosition(position => {
      const sample: LocationSample = { lat: position.coords.latitude, lng: position.coords.longitude, accuracy: position.coords.accuracy, sampleTimestamp: position.timestamp, provider: 'browser', speed: position.coords.speed != null && position.coords.speed >= 0 ? position.coords.speed : undefined, heading: position.coords.heading != null && position.coords.heading >= 0 && position.coords.heading < 360 ? position.coords.heading : undefined };
      if (done || position.timestamp < started - 2000 || !filter.accept(sample)) return;
      if (!best || sample.accuracy! < best.accuracy!) best = sample;
      onUpdate?.(sample);
      if (sample.accuracy! <= LOCATION_PRECISE_METRES) finish(sample);
      else if (!refinementTimer) refinementTimer = setTimeout(() => finish(best), 4000);
    }, error => finish(best, new Error(error.code === 1 ? 'Allow precise location in your browser settings, or search for a pickup.' : 'Location is unavailable. Check Location Services, retry outdoors, or select a pickup.')), { enableHighAccuracy: true, maximumAge: 2000, timeout: timeoutMs });
    if (done) geolocation.clearWatch(watcher);
  });
}
