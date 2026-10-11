import Image from 'next/image';
import type { Metadata } from 'next';
import { Mail, MessageCircle, Route } from 'lucide-react';
import { SupportForm } from '@/components/support-form';

export const metadata: Metadata = { title: 'Support — Lookiy' };

export default async function SupportPage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const { topic } = await searchParams;
  return <>
    <section className="inner-hero content-width split-hero">
      <div><span className="eyebrow">LOOKIY SUPPORT</span><h1>How can we help?</h1><p>Ask us about a journey, a payment, a business, or the wider Lookiy opportunity. Tell us what you need and we’ll get back to you.</p></div>
      <div className="inner-visual"><Image src="/images/passenger.jpg" fill alt="A Lookiy passenger on a journey" sizes="(max-width: 800px) 100vw, 45vw" /></div>
    </section>
    <section className="support-layout content-width">
      <div className="support-intro"><span className="eyebrow">GET IN TOUCH</span><h2>We’re here to listen.</h2><p>Choose the topic that fits your question and include any useful journey details. Please leave out passwords and payment PINs.</p><div className="support-reasons"><span><Route size={19} /> Journey questions</span><span><MessageCircle size={19} /> Business and rider enquiries</span><span><Mail size={19} /> Investor conversations</span></div></div>
      <div className="workspace-card"><h2>Send us a message</h2><SupportForm initialTopic={topic || 'general'} /></div>
    </section>
  </>;
}
