import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, ArrowUpRight, BadgeCheck, Banknote, CarFront, CircleDollarSign, KeyRound, MapPin, Navigation, UserPlus, Wallet } from 'lucide-react';

export const metadata: Metadata = { title: "Rider's Guide — Lookiy", description: 'How the Lookiy rider cycle works, from registration and verification to earning and withdrawal.' };

const steps = [
  { icon: UserPlus, title: 'Create your account', body: 'Sign up in the Lookiy mobile app and switch to Rider mode. Your single account keeps client and rider identities together, but rider access is granted only after you complete onboarding.', points: ['One account, multiple modes', 'No separate sign-up to drive'] },
  { icon: CarFront, title: 'Register your vehicle', body: 'Tell us what you drive — plate number, model, colour, category, and passenger or payload capacity. This is what Clients see before a journey starts.', points: ['Boda-boda, car, van, taxi, bus and more', 'Positive capacity is required'] },
  { icon: BadgeCheck, title: 'Submit your documents', body: 'Upload your national ID, driving licence, profile photo, vehicle registration, and insurance. A complete document bundle is required before you can receive requests.', points: ['NID, licence, photo, registration, insurance', 'A rejected document must be replaced'] },
  { icon: Navigation, title: 'Start within your grace period', body: 'You can receive requests for 14 days from registration while verification is in progress — no badge required yet. Missing setup, or reaching the deadline without verification, blocks new requests.', points: ['14 days from registration', 'Uploads later do not reset the deadline'] },
  { icon: CircleDollarSign, title: 'Verify your identity', body: 'Pay a one-time verification fee of UGX 20,000 and complete KYC. Your verified badge requires both fee payment and document approval.', points: ['UGX 20,000 one-time', 'Payment does not auto-approve documents'] },
  { icon: Banknote, title: 'Subscribe weekly', body: 'After verification, a flat subscription of UGX 5,000 for the current calendar week keeps you on the road. Past-week payments do not unlock requests.', points: ['UGX 5,000 per week', 'No commission on any ride'] },
  { icon: MapPin, title: 'Go online & receive requests', body: 'Flip the availability toggle and publish your location. Matching sends nearby journey requests in waves, each with a suggested fare and pickup distance.', points: ['Set price and distance filters', 'Requests expire with each wave'] },
  { icon: KeyRound, title: 'Negotiate, accept & lock', body: 'Accept the fare or counter it — the first acceptance locks the price. Before pickup, both you and the Client confirm a shared PIN or QR code to secure the journey.', points: ['Keep 100% of the fare you agree', 'Dual confirmation protects both sides'] },
  { icon: Navigation, title: 'Drive, complete & rate', body: 'Follow the live journey, stay in touch through in-journey chat, and complete the trip. Both sides rate each other, building trust across the platform.', points: ['Live tracking and deviation alerts', 'Journey-scoped chat'] },
  { icon: Wallet, title: 'Earn & withdraw', body: 'Your full fare settles into your Lookiy wallet. Withdraw to MTN MoMo or Airtel Money whenever you like. There is no ride commission to deduct.', points: ['100% of every fare is yours', 'Withdraw to mobile money'] },
];

export default function RidersGuidePage() {
  return <>
    <section className="inner-hero content-width">
      <span className="eyebrow">THE RIDER CYCLE</span>
      <h1>From sign-up<br />to every fare.</h1>
      <p>Becoming a Lookiy rider is a short, transparent path. Here is the full lifecycle — registration, verification, going online, and earning — exactly as it works in the app.</p>
      <Link href="/riders/benefits" className="primary-button inline-button">See rider benefits <ArrowRight size={18} /></Link>
    </section>

    <section className="content-width cycle-shell">
      {steps.map((s, i) => (
        <article className="cycle-step" key={s.title}>
          <div className="cycle-num"><b>{String(i + 1).padStart(2, '0')}</b>STEP</div>
          <div>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
            <ul>{s.points.map((p) => <li key={p}>{p}</li>)}</ul>
          </div>
        </article>
      ))}
    </section>

    <section className="editorial-section">
      <div className="content-width">
        <span className="eyebrow">WHY THE CYCLE MATTERS</span>
        <h2>A supply engine built to retain.</h2>
        <p>The rider lifecycle is designed for one outcome: operators who earn more and stay longer. A flat weekly subscription replaces the 15–25% commission that erodes earnings elsewhere, and verification is structured so riders can start earning during a 14-day grace period — then convert into verified, subscribed operators.</p>
        <div className="editorial-lines">
          <article><strong>Low barrier to start</strong><span>Earn during a 14-day grace period while identity verification completes.</span></article>
          <article><strong>Predictable cost</strong><span>UGX 5,000 per week. No percentage taken from any fare, ever.</span></article>
          <article><strong>Trust built in</strong><span>KYC, document review, and dual PIN/QR locks protect riders and clients alike.</span></article>
        </div>
        <Link href="/investors" className="text-link" style={{ marginTop: 30 }}>Explore the investor view <ArrowUpRight size={18} /></Link>
      </div>
    </section>
  </>;
}
