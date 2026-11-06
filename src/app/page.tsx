import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CarFront, CircleUserRound, MapPin, Package, Route, Smartphone, Store } from 'lucide-react';
import { HeroSearch } from '@/components/hero-search';
import './home.css';

const services = [
  { title: 'Ride', description: 'Find a nearby rider and choose the right vehicle for your trip.', href: '/ride', Icon: CarFront },
  { title: 'Delivery', description: 'Send a package across town and follow it to its destination.', href: '/ride?purpose=delivery', Icon: Package },
  { title: 'Journeys', description: 'Check your active trips and see where you’ve been.', href: '/journeys', Icon: Route },
  { title: 'Business', description: 'Give customers a way to discover and visit your shop.', href: '/app', Icon: Store },
];

const steps = [
  { title: 'Set your route', description: 'Enter a pickup and dropoff, then choose an available vehicle.' },
  { title: 'Review your fare', description: 'Check the estimate or suggest a fare before you request your trip.' },
  { title: 'Meet your rider', description: 'Check the rider’s name and vehicle details at pickup.' },
  { title: 'Follow your journey', description: 'See your trip progress and stay in touch along the way.' },
];

const scenes = [
  { src: 'passenger.jpg', position: '50% 43%' },
  { src: 'flight.jpg', position: '50% 62%' },
  { src: 'ride.jpg', position: '50% 58%' },
  { src: 'discovery.jpg', position: '50% 83%' },
  { src: 'cars.jpg', position: '50% 62%' },
  { src: 'safety.jpg', position: '50% 62%' },
];

export default function HomePage() {
  return <div className="home-page">
    <section className="home-content home-hero" aria-labelledby="home-title">
      <div className="home-hero-copy">
        <p className="home-region"><MapPin size={16} aria-hidden /> Uganda <a href="#home-pickup">Choose pickup</a></p>
        <h1 id="home-title">Go anywhere</h1>
        <HeroSearch homepage />
      </div>
      <div className="home-collage">
        <div className="home-collage-grid" aria-hidden="true">
          {scenes.map(({ src, position }, index) => <div className="home-scene" key={src}>
            <Image src={`/images/${src}`} alt="" fill priority={index < 2} sizes="(max-width: 600px) 44vw, 230px" style={{ objectPosition: position }} />
          </div>)}
        </div>
        <div className="home-collage-cta">
          <strong>Ready to go?</strong>
          <Link href="/ride">Plan a journey</Link>
        </div>
      </div>
    </section>

    <section className="home-content home-section home-services" aria-labelledby="home-services">
      <h2 id="home-services">Explore what you can do with Lookiy</h2>
      <div className="home-service-grid">
        {services.map(({ title, description, href, Icon }) => <article className="home-service-card" key={title}>
          <div className="home-service-copy">
            <h3>{title}</h3>
            <p>{description}</p>
            <Link href={href} aria-label={`${title} details`}>Details</Link>
          </div>
          <span className="home-service-icon" aria-hidden="true"><Icon size={42} strokeWidth={1.5} /></span>
        </article>)}
      </div>
    </section>

    <section className="home-content home-section" aria-labelledby="home-steps">
      <h2 id="home-steps">How to request a ride</h2>
      <ol className="home-steps">
        {steps.map(({ title, description }) => <li key={title}>
          <h3>{title}</h3><p>{description}</p>
        </li>)}
      </ol>
    </section>

    <section className="home-content home-section home-feature" aria-labelledby="home-travel">
      <div className="home-feature-media">
        <Image src="/images/flight.jpg" alt="View of a city at night through an airplane window" fill sizes="(max-width: 760px) 100vw, 540px" style={{ objectPosition: '50% 65%' }} />
      </div>
      <div className="home-feature-copy">
        <h2 id="home-travel">Where are you headed next?</h2>
        <p>Plan a ride across Uganda. Check the route, travel time, and fare before you request it.</p>
        <Link className="home-light-button" href="/ride">Plan a ride <ArrowRight size={18} aria-hidden /></Link>
      </div>
    </section>

    <section className="home-content home-section home-feature home-feature-reverse" aria-labelledby="home-earn">
      <div className="home-feature-media">
        <Image src="/images/ride.jpg" alt="A car on a road at dusk" fill sizes="(max-width: 760px) 100vw, 540px" style={{ objectPosition: '50% 61%' }} />
      </div>
      <div className="home-feature-copy">
        <h2 id="home-earn">Earn with Lookiy</h2>
        <p>Apply to become a rider, register your vehicle, and go online when you’re ready for trips.</p>
        <Link className="home-light-button" href="/riders">Become a rider <ArrowRight size={18} aria-hidden /></Link>
      </div>
    </section>

    <section className="home-downloads" aria-labelledby="home-apps">
      <div className="home-content home-section">
        <h2 id="home-apps">Take Lookiy with you</h2>
        <div className="home-download-grid">
          <Link href="/get-app" className="home-download-card">
            <span className="home-download-icon"><Smartphone size={30} aria-hidden /></span>
            <span><strong>Get the Lookiy app</strong><small>Book and follow rides on your phone</small></span>
            <ArrowRight size={24} aria-hidden />
          </Link>
          <Link href="/riders" className="home-download-card">
            <span className="home-download-icon"><CircleUserRound size={30} aria-hidden /></span>
            <span><strong>Use Lookiy as a rider</strong><small>Learn how to register and get started</small></span>
            <ArrowRight size={24} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  </div>;
}
