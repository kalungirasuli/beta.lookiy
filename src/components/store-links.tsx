'use client';

import { useEffect, useState } from 'react';
import { Apple, ArrowUpRight, Play, Smartphone, X } from 'lucide-react';

type OS = 'android' | 'ios' | 'other';

function detectOS(): OS {
  if (typeof navigator === 'undefined') return 'other';
  const ua = navigator.userAgent || '';
  if (/android/i.test(ua)) return 'android';
  if (/iphone|ipad|ipod/i.test(ua)) return 'ios';
  return 'other';
}

export function StoreLinks({ appStoreUrl, playStoreUrl }: { appStoreUrl?: string; playStoreUrl?: string }) {
  const [os, setOs] = useState<OS>('other');
  const [open, setOpen] = useState(false);
  useEffect(() => setOs(detectOS()), []);

  const appStore = appStoreUrl;
  const playStore = playStoreUrl;
  const direct = os === 'ios' ? appStore : os === 'android' ? playStore : undefined;

  return (
    <>
      {direct ? (
        <a className="primary-button inline-button" href={direct} target="_blank" rel="noopener noreferrer">
          Get started {os === 'ios' ? <Apple size={18} /> : <Play size={18} />}
        </a>
      ) : (
        <button type="button" className="primary-button inline-button" onClick={() => setOpen(true)}>
          Get started <ArrowUpRight size={18} />
        </button>
      )}

      {open && (
        <div className="store-modal-backdrop" onClick={() => setOpen(false)} role="presentation">
          <div className="store-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="close" onClick={() => setOpen(false)} aria-label="Close"><X size={18} /></button>
            <h3>Get Lookiy on your phone</h3>
            <p>Lookiy is a mobile app. Open the <strong>App Store</strong> (iPhone) or <strong>Google Play</strong> (Android) on your phone and search for <strong>“Lookiy”</strong> to download it.</p>
            <div className="store-badge-row">
              {appStore && <a className="store-badge" href={appStore} target="_blank" rel="noopener noreferrer"><Apple size={22} /><span><small>Download on the</small>App Store</span></a>}
              {playStore && <a className="store-badge" href={playStore} target="_blank" rel="noopener noreferrer"><Play size={22} /><span><small>Get it on</small>Google Play</span></a>}
              {!appStore && !playStore && <span className="store-badge"><Smartphone size={22} /><span>Store links coming soon</span></span>}
            </div>
            <p className="store-note">This device can’t run the mobile app. Grab your phone to get started — everything you need lives there.</p>
          </div>
        </div>
      )}
    </>
  );
}
