'use client';

declare global {
  interface Window {
    google?: any;
    __lookiyMapPromise?: Promise<void>;
    __lookiyMapsLoaded?: () => void;
    gm_authFailure?: () => void;
  }
}

export const mapsAuthFailureEvent = 'lookiy-maps-auth-failure';
let authDenied = false;

export function loadGoogleMaps(key: string): Promise<void> {
  if (authDenied) return Promise.reject(new Error('Google Maps authorization failed.'));
  if (window.google?.maps?.importLibrary) return Promise.resolve();
  if (!window.__lookiyMapPromise) {
    window.__lookiyMapPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      const fail = () => { clearTimeout(timer); script.remove(); reject(new Error('Google Maps could not load.')); };
      const timer = setTimeout(fail, 12000);
      window.gm_authFailure = () => { authDenied = true; window.dispatchEvent(new Event(mapsAuthFailureEvent)); };
      window.__lookiyMapsLoaded = () => { clearTimeout(timer); resolve(); };
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=geometry&loading=async&callback=__lookiyMapsLoaded`;
      script.async = true;
      script.onerror = fail;
      document.head.appendChild(script);
    }).catch(error => {
      window.__lookiyMapPromise = undefined;
      throw error;
    });
  }
  return window.__lookiyMapPromise;
}
