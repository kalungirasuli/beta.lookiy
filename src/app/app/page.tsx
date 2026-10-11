import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, CalendarCheck, Megaphone, MessageSquare, Package, Store, Wallet } from 'lucide-react';
import { StoreLinks } from '@/components/store-links';

export const metadata: Metadata = { title: 'For business — Lookiy' };

export default function AppPage() {
  const appStore = process.env.NEXT_PUBLIC_APP_STORE_URL;
  const playStore = process.env.NEXT_PUBLIC_PLAY_STORE_URL;
  return <>
    <section className="inner-hero content-width split-hero">
      <div>
        <span className="eyebrow">LOOKIY FOR BUSINESS</span>
        <h1>Be found along the way.</h1>
        <p>People pass great local businesses every day without knowing what is inside. Lookiy helps nearby travellers discover your shop, see what you offer, and choose to visit while they are already on the move.</p>
        <StoreLinks appStoreUrl={appStore} playStoreUrl={playStore} />
      </div>
      <div className="inner-visual business-visual"><Image src="/images/discovery.jpg" fill alt="A neighbourhood business along a traveller's route" sizes="(max-width: 800px) 100vw, 45vw" /></div>
    </section>

    <section className="editorial-section">
      <div className="content-width"><span className="eyebrow">WHY JOIN LOOKIY</span><h2>Turn nearby movement into real visits.</h2><p>Your next customer may already be travelling past your door. A Lookiy business profile makes it easier for them to notice you, understand what you sell, and make your shop part of their journey.</p><div className="editorial-lines">
        <article><strong>Reach people nearby</strong><span>Show your business to travellers when your location is relevant to their route.</span></article>
        <article><strong>Give them a reason to stop</strong><span>Put your products, prices, and offers where customers can explore them before visiting.</span></article>
        <article><strong>Keep the conversation going</strong><span>Answer questions directly and build relationships beyond a single visit.</span></article>
      </div></div>
    </section>

    <section className="content-width">
      <div className="section-heading" style={{ marginTop: 88 }}><span className="eyebrow">WHAT YOU CAN DO</span><h2>One place to grow your local presence.</h2></div>
      <div className="info-grid">
      <article><Store size={26} /><h2>A storefront people can trust</h2><p>Show your location, cover photo, opening details, and the products that make your business worth a visit.</p></article>
      <article><Megaphone size={26} /><h2>Promote what matters now</h2><p>Feature a product or campaign for people moving nearby, with a budget you can control.</p></article>
      <article><Package size={26} /><h2>Show your inventory</h2><p>Add product photos, descriptions, prices, and availability so customers know what to expect.</p></article>
      <article><MessageSquare size={26} /><h2>Talk to customers</h2><p>Keep different customer conversations together and respond when someone wants to know more.</p></article>
      <article><CalendarCheck size={26} /><h2>Become a journey stop</h2><p>A traveller can add your shop to their route and plan a visit without losing their destination.</p></article>
      <article><Wallet size={26} /><h2>Stay in control of spend</h2><p>Top up your business wallet with mobile money, view activity, and decide when to promote.</p></article>
      </div>
    </section>

    <section className="editorial-section">
      <div className="content-width">
        <span className="eyebrow">FLEETS & OPERATORS</span>
        <h2>Run a whole fleet from one place.</h2>
        <p>If you manage vehicles and riders, Lookiy helps you see who is connected to your fleet, follow work and earnings, and keep clear records as you grow.</p>
        <div className="editorial-lines">
          <article><strong>Know your team</strong><span>See connected riders and vehicles together, with the option to pause or detach a connection.</span></article>
          <article><strong>Understand each day</strong><span>Review journeys and fleet earnings without piecing together separate phone messages.</span></article>
          <article><strong>Manage collections</strong><span>Set your collection arrangement and follow the history of what your fleet has earned.</span></article>
        </div>
        <Link href="/riders" className="text-link" style={{ marginTop: 30 }}>See the rider cycle <ArrowRight size={18} /></Link>
        <p style={{ marginTop: 24 }}><Link href="/support?topic=business" className="text-link">Ask us about joining Lookiy <ArrowRight size={18} /></Link></p>
      </div>
    </section>

    <section className="content-width">
      <div className="section-heading" style={{ marginTop: 90 }}><span className="eyebrow">IN YOUR POCKET</span><h2>Everything in the app.</h2></div>
      <div className="visual-grid">
        <figure><Image src="/images/app-create.jpg" fill alt="Create a Lookiy account in the app" /><figcaption>Create your account</figcaption></figure>
        <figure><Image src="/images/app-signin.jpg" fill alt="Sign in to Lookiy securely" /><figcaption>Sign in securely</figcaption></figure>
        <figure><Image src="/images/app-ready.jpg" fill alt="Lookiy ready to go" /><figcaption>Ready to move</figcaption></figure>
      </div>
    </section>
  </>;
}
