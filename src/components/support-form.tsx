'use client';

import { FormEvent, useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { post } from '@/lib/client-api';

const topics = [
  ['general', 'General question'], ['journey', 'A journey'], ['payment', 'A payment'],
  ['business', 'Business on Lookiy'], ['investor', 'Investment inquiry'],
] as const;

export function SupportForm({ initialTopic }: { initialTopic: string }) {
  const [topic, setTopic] = useState(topics.some(([value]) => value === initialTopic) ? initialTopic : 'general');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (name.trim().length < 2 || message.trim().length < 15) {
      setError('Add your name and at least 15 characters about how we can help.');
      return;
    }
    setBusy(true);
    try {
      await post('/api/support', { name: name.trim(), email: email.trim(), topic, message: message.trim(), website });
      setSent(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Your message could not be sent. Please try again.');
    } finally { setBusy(false); }
  }

  if (sent) return <div className="support-sent" role="status"><CheckCircle2 size={35} /><h2>Message received.</h2><p>Thanks for getting in touch. Our team will reply to the email address you provided.</p><button type="button" className="secondary-button" onClick={() => { setSent(false); setMessage(''); }}>Send another message</button></div>;

  return <form className="support-form" onSubmit={submit}>
    <div className="two-col-form">
      <div className="form-field"><label htmlFor="support-name">Your name</label><input id="support-name" className="text-field" value={name} onChange={event => setName(event.target.value)} autoComplete="name" minLength={2} maxLength={100} required /></div>
      <div className="form-field"><label htmlFor="support-email">Email address</label><input id="support-email" className="text-field" type="email" value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" maxLength={254} required /></div>
    </div>
    <div className="form-field"><label htmlFor="support-topic">What can we help with?</label><select id="support-topic" className="select-field" value={topic} onChange={event => setTopic(event.target.value)}>{topics.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
    <div className="form-field"><label htmlFor="support-message">Your message</label><textarea id="support-message" className="text-field support-message" value={message} onChange={event => setMessage(event.target.value)} minLength={15} maxLength={4000} placeholder="Tell us what happened or what you would like to know." required /></div>
    <div className="support-honeypot" aria-hidden="true"><label htmlFor="support-website">Website</label><input id="support-website" tabIndex={-1} autoComplete="off" value={website} onChange={event => setWebsite(event.target.value)} /></div>
    {error && <div className="form-error" role="alert">{error}</div>}
    <p className="form-hint">We use these details only to respond to your request. See our <a href="/privacy">privacy policy</a>.</p>
    <button type="submit" className="primary-button" disabled={busy}>{busy ? 'Sending…' : 'Send message'} <ArrowRight size={18} /></button>
  </form>;
}
