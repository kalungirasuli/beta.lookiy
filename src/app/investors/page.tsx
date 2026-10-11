import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, ArrowUpRight, Building2, Store, Users } from 'lucide-react';

export const metadata: Metadata = { title: 'Investors — Lookiy' };

export default function InvestorsPage() {
  return <>
    <section className="inner-hero content-width split-hero">
      <div>
        <span className="eyebrow">LOOKIY FOR INVESTORS</span>
        <h1>Backing the way Uganda moves.</h1>
        <p>Lookiy brings journeys, local businesses, and fleets into one marketplace. We are building a business around the trips people take every day and the places they pass along the way.</p>
        <Link href="/support?topic=investor" className="primary-button inline-button">Start a conversation <ArrowRight size={18} /></Link>
      </div>
      <div className="inner-visual"><Image src="/images/traffic.jpg" fill alt="Traffic moving through Uganda" sizes="(max-width: 800px) 100vw, 45vw" /></div>
    </section>

    <section className="investor-strip content-width">
      <div><span className="eyebrow">THE OPPORTUNITY</span><h2>One journey can create value for many.</h2></div>
      <div><p>A customer needs a reliable ride. A rider needs steady work and a fair way to earn. A local shop needs to be found by people close enough to visit. Lookiy connects those needs in the same journey.</p><Link href="/about" className="text-link">See how Lookiy works <ArrowUpRight size={18} /></Link></div>
    </section>

    <section className="info-grid content-width">
      <article><Users size={26} /><h2>Everyday demand</h2><p>Personal travel and deliveries create recurring opportunities to serve people moving across towns and cities.</p></article>
      <article><Store size={26} /><h2>Local commerce</h2><p>Businesses can reach travellers near their location and turn a route into a visit.</p></article>
      <article><Building2 size={26} /><h2>Fleet relationships</h2><p>Fleet owners need a clearer view of connected riders, work completed, and money earned.</p></article>
    </section>

    <section className="editorial-section">
      <div className="content-width">
        <span className="eyebrow">HOW LOOKIY EARNS</span>
        <h2>A business model tied to useful work.</h2>
        <p>Lookiy is designed to earn from services people choose because they help them work or grow. Riders keep their agreed ride fare; business promotion and fleet management create additional ways to serve the market.</p>
        <div className="editorial-lines">
          <article><strong>Rider access</strong><span>A flat weekly fee gives eligible riders access to journey requests instead of taking a percentage of each fare.</span></article>
          <article><strong>Business promotion</strong><span>Shops can fund ads and campaigns that appear when a traveller is close enough for the message to matter.</span></article>
          <article><strong>Fleet services</strong><span>Fleet owners can manage riders, vehicles, collections, and reporting in one place.</span></article>
        </div>
      </div>
    </section>

    <section className="content-width">
      <div className="section-heading" style={{ marginTop: 90 }}><span className="eyebrow">THE CUSTOMER EXPERIENCE</span><h2>Useful at each point in the journey.</h2></div>
      <div className="visual-grid">
        <figure><Image src="/images/discovery.jpg" fill alt="Discovering local businesses along a journey" /><figcaption>Discover a place nearby</figcaption></figure>
        <figure><Image src="/images/safety.jpg" fill alt="Lookiy safety and verification" /><figcaption>Travel with confidence</figcaption></figure>
        <figure><Image src="/images/flight.jpg" fill alt="Journeys across Uganda" /><figcaption>Plan the next journey</figcaption></figure>
      </div>
    </section>

    <section className="editorial-section">
      <div className="content-width">
        <span className="eyebrow">WHAT COMES NEXT</span>
        <h2>Prove the model, then grow it.</h2>
        <p>The product covers client journeys, rider operations, business profiles, and fleet management. The next step is to prove that these experiences work together for real customers in a focused pilot.</p>
        <div className="editorial-lines">
          <article><strong>Start focused</strong><span>Launch in a defined area with a manageable group of riders, fleet owners, and local businesses.</span></article>
          <article><strong>Measure what matters</strong><span>Follow completed journeys, repeat use, rider retention, business engagement, and the cost of serving each trip.</span></article>
          <article><strong>Expand with evidence</strong><span>Grow into new areas once reliability and the economics of the first market are clear.</span></article>
        </div>
      </div>
    </section>

    <section className="editorial-section" id="connect">
      <div className="content-width">
        <span className="eyebrow">LET'S TALK BUSINESS</span>
        <h2>Explore the opportunity with us.</h2>
        <p>For a conversation about the market, the business model, pilot plans, and investment, send our team a note. We can share further material directly with interested investors.</p>
        <Link href="/support?topic=investor" className="primary-button inline-button">Contact the team <ArrowRight size={18} /></Link>
      </div>
    </section>
  </>;
}
