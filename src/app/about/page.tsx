import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Compass, HeartHandshake, Route, ShieldCheck, Smartphone, Wallet } from 'lucide-react';

export const metadata = { title: 'About — Lookiy' };

export default function AboutPage() {
  return <>
    <section className="inner-hero content-width split-hero">
      <div>
        <span className="eyebrow">ABOUT LOOKIY</span>
        <h1>Moving people.<br />Connecting places.</h1>
        <p>Lookiy is a Uganda-focused journey platform for riders, passengers, businesses, and the places between them — built for the way Uganda actually moves and pays.</p>
        <Link href="/ride" className="primary-button inline-button">Plan a journey <ArrowRight size={18} /></Link>
      </div>
      <div className="inner-visual"><Image src="/images/cars.jpg" fill alt="Illustrated traffic on a city road" sizes="(max-width: 800px) 100vw, 45vw" /></div>
    </section>

    <section className="info-grid content-width">
      <article><Compass size={26} /><h2>Go with clarity</h2><p>Choose a destination, see your route and agree on the fare before the journey begins.</p></article>
      <article><Route size={26} /><h2>Stay connected</h2><p>Follow journey progress and keep the right people close to the trip, from pickup to destination.</p></article>
      <article><HeartHandshake size={26} /><h2>Discover locally</h2><p>Bring local businesses into the moments when people are already moving nearby.</p></article>
    </section>

    <section className="editorial-section">
      <div className="content-width">
        <span className="eyebrow">WHY WE EXIST</span>
        <h2>Movement is local. It should feel that way.</h2>
        <p>Global ride-hailing takes a cut of every trip and never touches the commerce around it. Lookiy starts from Ugandan conditions — boda-bodas, mobile money, and shops on every corner — and builds a platform where riders keep what they earn, businesses reach people in motion, and fleets run themselves.</p>
        <div className="editorial-lines">
          <article><strong>Riders keep 100%</strong><span>No commission on rides. A flat weekly subscription replaces the cut that erodes earnings elsewhere.</span></article>
          <article><strong>Mobile money first</strong><span>MTN MoMo and Airtel Money are the default wallet — pay and get paid the way people already do.</span></article>
          <article><strong>Safety built in</strong><span>Identity verification and shared PIN or QR locks protect every journey on both sides.</span></article>
        </div>
      </div>
    </section>

    <section className="content-width">
      <div className="section-heading" style={{ marginTop: 90 }}><span className="eyebrow">THE EXPERIENCE</span><h2>Made for every journey.</h2></div>
      <div className="visual-grid">
        <figure><Image src="/images/passenger.jpg" fill alt="A passenger on a Lookiy journey" /><figcaption>Travel with confidence</figcaption></figure>
        <figure><Image src="/images/ride.jpg" fill alt="A Lookiy ride at dusk" /><figcaption>Every ride, covered</figcaption></figure>
        <figure><Image src="/images/safety.jpg" fill alt="Lookiy safety features" /><figcaption>Protected on every trip</figcaption></figure>
      </div>
    </section>

    <section className="editorial-section">
      <div className="content-width">
        <span className="eyebrow">ONE PLATFORM</span>
        <h2>Transport, commerce, and fleet — together.</h2>
        <p>One trip can serve three businesses: the rider, the operator, and the merchant. That is the idea behind everything we build.</p>
        <div className="editorial-lines">
          <article><strong><Route size={15} /> Transport</strong><span>Plan, negotiate, match, and track journeys across seven vehicle types.</span></article>
          <article><strong><HeartHandshake size={15} /> Commerce</strong><span>Discover nearby businesses, message them, and add a stop along the way.</span></article>
          <article><strong><Wallet size={15} /> Fleet finance</strong><span>Manage operators, commissions, and settlements from one place.</span></article>
        </div>
        <Link href="/investors" className="text-link" style={{ marginTop: 30 }}>Explore the bigger picture <ArrowRight size={18} /></Link>
      </div>
    </section>
  </>;
}
