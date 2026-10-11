'use client';

declare global {
  interface Window {
    google?: any;
    __lookiyMapPromise?: Promise<void>;
  }
}

export function loadGoogleMaps(key: string): Promise<void> {
  if (window.google?.maps?.importLibrary) return Promise.resolve();
  if (!window.__lookiyMapPromise) {
    window.__lookiyMapPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=geometry,places&loading=async`;
      script.async = true;
      script.onload = () => window.google?.maps?.importLibrary ? resolve() : reject(new Error('Google Maps could not load.'));
      script.onerror = () => reject(new Error('Google Maps could not load.'));
      document.head.appendChild(script);
    }).catch(error => {
      window.__lookiyMapPromise = undefined;
      throw error;
    });
  }
  return window.__lookiyMapPromise;
}
