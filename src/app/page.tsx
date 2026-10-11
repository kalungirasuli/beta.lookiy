import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, CarFront, Clock3, MapPinned, Package, Route, ShieldCheck, Smartphone, Users } from 'lucide-react';
import { HeroSearch } from '@/components/hero-search';

export default function HomePage() {
  return <>
    <section className="hero content-width">
      <div className="hero-copy"><span className="eyebrow">MOVEMENT MADE PERSONAL</span><h1>Go anywhere,<br />together.</h1><p>One place to plan your next ride, delivery, or journey across Uganda.</p><HeroSearch /><span className="hero-footnote">Already travelling? <Link href="/journeys">View your journeys <ArrowRight size={14} /></Link></span></div>
      <div className="hero-image"><Image src="/images/passenger.jpg" alt="Illustration of a passenger travelling by car" fill priority sizes="(max-width: 800px) 100vw, 48vw" /><div className="hero-image-badge"><span className="badge-icon"><Route size={18} /></span><span><strong>Where to next?</strong><small>Your journey starts here.</small></span></div></div>
    </section>

    <section className="services-section content-width"><div className="section-heading"><span className="eyebrow">MOVE YOUR WAY</span><h2>What can we help<br />you do today?</h2></div><div className="service-grid">
      <Link href="/ride" className="service-card blue"><span className="service-icon"><CarFront size={24} /></span><div><h3>Go somewhere</h3><p>Book a ride that fits your route and your budget.</p></div><ArrowUpRight className="service-arrow" size={21} /></Link>
      <Link href="/ride?purpose=delivery" className="service-card sand"><span className="service-icon"><Package size={24} /></span><div><h3>Send something</h3><p>Arrange a delivery and choose the vehicle it needs.</p></div><ArrowUpRight className="service-arrow" size={21} /></Link>
      <Link href="/journeys" className="service-card mist"><span className="service-icon"><MapPinned size={24} /></span><div><h3>Stay in the loop</h3><p>Find your current journeys and their latest updates.</p></div><ArrowUpRight className="service-arrow" size={21} /></Link>
    </div></section>

    <section className="story-section"><div className="content-width story-grid"><div className="story-image"><Image src="/images/ride.jpg" alt="Illustration of a car on a journey at dusk" fill sizes="(max-width: 800px) 100vw, 45vw" /></div><div className="story-copy"><span className="eyebrow">BUILT AROUND YOUR DAY</span><h2>From the first idea<br />to the last mile.</h2><p>Choose where to go, see the route, and suggest your fare or use the system estimate. Once your rider accepts, follow your journey from pickup to destination.</p><div className="story-points"><span><MapPinned size={20} /> Search places in Uganda</span><span><Clock3 size={20} /> Preview time and distance</span><span><ShieldCheck size={20} /> Review your rider’s details</span></div><Link href="/ride" className="primary-button inline-button">Plan a ride <ArrowRight size={18} /></Link></div></div></section>

    <section className="how-section content-width"><div className="section-heading"><span className="eyebrow">SIMPLE BY DESIGN</span><h2>Here’s how it works.</h2></div><div className="steps-grid"><article><span>01</span><h3>Set your route</h3><p>Search for a pickup and destination, then choose a vehicle.</p></article><article><span>02</span><h3>Agree on a fare</h3><p>Suggest your price or start with the system estimate.</p></article><article><span>03</span><h3>Meet your rider</h3><p>Check their name and vehicle details before you start.</p></article><article><span>04</span><h3>Travel with clarity</h3><p>See your journey status and stay connected on the way.</p></article></div></section>

    <section className="app-banner"><div className="content-width app-banner-inner"><div><span className="eyebrow light">THE FULL LOOKIY EXPERIENCE</span><h2>More possibilities<br />in the app.</h2><p>Rider tools, business features, and the complete travel experience live in the mobile app.</p><Link href="/get-app" className="light-button">Get the app <ArrowRight size={19} /></Link></div><div className="app-art" aria-hidden="true"><Smartphone size={174} strokeWidth={.7} /><span className="app-art-card"><Users size={19} /> Ride. Connect. Discover.</span></div></div></section>

    <section className="investor-strip content-width"><div><span className="eyebrow">OUR NEXT CHAPTER</span><h2>Building for the way<br />Uganda moves.</h2></div><div><p>Lookiy brings transport, local discovery, and connected journeys into one platform. Explore the product and our direction.</p><Link href="/investors" className="text-link">Explore Lookiy for investors <ArrowUpRight size={18} /></Link></div></section>
  </>;
}
