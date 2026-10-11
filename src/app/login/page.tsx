'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { api } from '@/lib/client-api';

type LoginResult = { accessToken?: string; requiresTwoFactor?: boolean; tempToken?: string };
function signature() {
  let value = sessionStorage.getItem('lookiy-web-device');
  if (!value) { value = crypto.randomUUID(); sessionStorage.setItem('lookiy-web-device', value); }
  return value;
}
function LoginForm() {
  const router = useRouter(); const params = useSearchParams();
  const [identity,setIdentity] = useState(''); const [password,setPassword] = useState(''); const [code,setCode] = useState(''); const [tempToken,setTempToken] = useState(''); const [error,setError] = useState(''); const [busy,setBusy] = useState(false);
  const requested = params.get('next') || '/journeys'; const next = requested.startsWith('/') && !requested.startsWith('//') ? requested : '/journeys';
  async function submit(event: FormEvent) {
    event.preventDefault();setError('');setBusy(true);
    try {
      const deviceSignature = signature();
      const result = tempToken
        ? await api<LoginResult>('/api/session/verify',{method:'POST',body:JSON.stringify({code,tempToken,deviceSignature})})
        : await api<LoginResult>('/api/session/login',{method:'POST',body:JSON.stringify({...(identity.includes('@') ? {email:identity.trim().toLowerCase()} : {phone:identity.trim()}),password,deviceSignature,deviceName:'Lookiy web',platform:'web'})});
      if (result.requiresTwoFactor && result.tempToken) { setTempToken(result.tempToken); return; }
      router.push(next); router.refresh();
    } catch(e) { setError(e instanceof Error ? e.message : 'Could not sign in.'); }
    finally { setBusy(false); }
  }
  return <div className="auth-shell"><div className="auth-art"><Image src="/images/ride.jpg" fill alt="Illustration of a journey by car" sizes="50vw"/><div className="auth-art-copy"><span className="eyebrow light">LOOKIY WEB</span><h2>Pick up where your journey left off.</h2></div></div><div className="auth-pane"><form className="auth-form" onSubmit={submit}><span className="eyebrow">WELCOME BACK</span><h1>{tempToken ? 'One more check.' : 'Let’s get moving.'}</h1><p>{tempToken ? 'Enter your authentication code to finish signing in.' : 'Sign in to plan a trip and see your journeys.'}</p><div className="form-stack">{tempToken ? <div className="form-field"><label htmlFor="code">Authentication code</label><input id="code" className="text-field" value={code} onChange={event => setCode(event.target.value)} inputMode="numeric" autoComplete="one-time-code" required/></div> : <><div className="form-field"><label htmlFor="identity">Email or phone</label><input id="identity" className="text-field" value={identity} onChange={event => setIdentity(event.target.value)} autoComplete="username" required/></div><div className="form-field"><label htmlFor="password">Password</label><input id="password" className="text-field" type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" required/></div></>}{error && <div className="form-error" role="alert">{error}</div>}<button className="primary-button" disabled={busy}>{busy ? 'Please wait…' : tempToken ? 'Verify and continue' : 'Sign in'} <ArrowRight size={18}/></button></div>{!tempToken && <p className="auth-alt">New to Lookiy? <Link href={`/register?next=${encodeURIComponent(next)}`}>Create an account</Link></p>}</form></div></div>;
}
export default function LoginPage(){return <Suspense fallback={<div className="loading content-width">Loading…</div>}><LoginForm/></Suspense>;}
