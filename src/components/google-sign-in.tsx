'use client';
import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/client-api';

type LoginResult = { requiresTwoFactor?: boolean; tempToken?: string; user?: unknown };
type Identity = { initialize: (options: { client_id: string; callback: (response: { credential?: string }) => void; auto_select: boolean }) => void; renderButton: (element: HTMLElement, options: { theme: string; size: string; text: string; shape: string }) => void };
let library: Promise<Identity> | null = null;
function loadIdentity(): Promise<Identity> {
  const google = (window as unknown as { google?: { accounts?: { id?: Identity } } }).google;
  if (google?.accounts?.id) return Promise.resolve(google.accounts.id);
  if (library) return library;
  library = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const fail = () => { clearTimeout(timer); script.remove(); library = null; reject(new Error('Google sign-in could not load. Please retry or use email or phone.')); };
    const timer = setTimeout(fail, 12000);
    script.src = 'https://accounts.google.com/gsi/client'; script.async = true;
    script.onload = () => { const identity = (window as unknown as { google?: { accounts?: { id?: Identity } } }).google?.accounts?.id; if (identity) { clearTimeout(timer); resolve(identity); } else fail(); };
    script.onerror = fail; document.head.appendChild(script);
  });
  return library;
}
export function GoogleSignIn({ deviceSignature, onResult, onBusy, disabled }: { deviceSignature: () => string; onResult: (result: LoginResult) => void; onBusy: (busy: boolean) => void; disabled: boolean }) {
  const target = useRef<HTMLDivElement>(null), running = useRef(false);
  const callbacks = useRef({ deviceSignature, onResult, onBusy, disabled }); callbacks.current = { deviceSignature, onResult, onBusy, disabled };
  const [error, setError] = useState(''), [revision, setRevision] = useState(0), [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true; const controller = new AbortController();
    setLoading(true); setError('');
    void api<{ clientId: string }>('/api/session/google-config', { signal: controller.signal }).then(async config => {
      const identity = await loadIdentity(); if (!active || !target.current) return;
      identity.initialize({ client_id: config.clientId, auto_select: false, callback: async response => {
        if (!active || !response.credential || running.current || callbacks.current.disabled) return;
        running.current = true; callbacks.current.onBusy(true); setError('');
        try { const result = await api<LoginResult>('/api/session/google', { method: 'POST', body: JSON.stringify({ idToken: response.credential, deviceSignature: callbacks.current.deviceSignature() }), signal: controller.signal }); if (active) callbacks.current.onResult(result); }
        catch (e) { if (active) setError(e instanceof Error ? e.message : 'Google sign-in failed. Please retry.'); }
        finally { running.current = false; if (active) callbacks.current.onBusy(false); }
      } });
      target.current.replaceChildren(); identity.renderButton(target.current, { theme: 'outline', size: 'large', text: 'continue_with', shape: 'pill' });
    }).catch(e => { if (active) setError(e instanceof Error ? e.message : 'Google sign-in is unavailable.'); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; controller.abort(); };
  }, [revision]);
  return <div className="form-stack"><div style={{ opacity: disabled ? .5 : 1, pointerEvents: disabled ? 'none' : 'auto' }} aria-busy={loading || disabled}><div ref={target} />{loading && <p role="status">Loading Google sign-in…</p>}</div>{error && <div className="form-error" role="alert">{error} <button type="button" className="text-link" onClick={() => setRevision(n => n + 1)}>Retry Google sign-in</button></div>}</div>;
}
