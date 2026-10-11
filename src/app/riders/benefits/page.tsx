import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, ArrowUpRight, BadgeCheck, Bell, Building2, CircleDollarSign, Coins, Route, ShieldCheck, Wallet } from 'lucide-react';

export const metadata: Metadata = { title: 'Rider Benefits — Lookiy', description: 'Why riders choose Lookiy: zero commission, predictable weekly fees, and full control over every fare.' };

const benefits = [
  { icon: CircleDollarSign, title: 'Keep 100% of every fare', body: 'Lookiy takes no commission on rides. The fare you negotiate with a client is the fare you keep.' },
  { icon: Coins, title: 'A predictable weekly fee', body: 'One flat UGX 5,000 subscription per week replaces percentage commissions. Your cost never grows with your earnings.' },
  { icon: BadgeCheck, title: 'Start earning fast', body: 'A 14-day grace period lets you receive requests while verification completes — no badge required from day one.' },
  { icon: Bell, title: 'Choose your requests', body: 'Set price and distance filters, and accept, ignore, or counter every request. You are never forced to take a fare.' },
  { icon: Wallet, title: 'Get paid to mobile money', body: 'Fares settle into your wallet and withdraw to MTN MoMo or Airtel Money on your schedule.' },
  { icon: ShieldCheck, title: 'Safe by design', body: 'Identity verification, document review, and dual PIN/QR locks protect you and your clients on every trip.' },
  { icon: Route, title: 'Built-in business', body: 'Map commerce brings discovery moments along your route — more reasons for people to ride, and places to stop by.' },
  { icon: Building2, title: 'Fleet-ready', body: 'Hook onto a fleet for structured commissions and automated settlements, or stay independent. The choice is yours.' },
];

export default function RiderBenefitsPage() {
  return <>
    <section className="inner-hero content-width">
      <span className="eyebrow">RIDER BENEFITS</span>
      <h1>Earn more.<br />Keep it all.</h1>
      <p>Most platforms take a 15–25% cut of every ride. Lookiy is different by design: a flat weekly subscription and zero commission, so your earnings stay yours.</p>
      <Link href="/riders" className="primary-button inline-button">See how it works <ArrowRight size={18} /></Link>
    </section>

    <section className="benefit-grid content-width">
      {benefits.map((b) => (
        <article key={b.title}><b.icon size={26} /><h2>{b.title}</h2><p>{b.body}</p></article>
      ))}
    </section>

    <section className="editorial-section">
      <div className="content-width">
        <span className="eyebrow">THE ECONOMICS</span>
        <h2>Commission vs. subscription.</h2>
        <p>The difference is structural. Percentage commissions punish busy operators — the more you earn, the more you lose. A flat weekly fee means your effort translates directly into income.</p>
        <table className="compare-table">
          <thead><tr><th>What you keep</th><th>Lookiy</th><th>Typical platforms</th></tr></thead>
          <tbody>
            <tr><td>Commission per ride</td><td className="highlight">0%</td><td>15–25%</td></tr>
            <tr><td>Ongoing cost</td><td className="highlight">Flat UGX 5,000 / week</td><td>Scales with every fare</td></tr>
            <tr><td>Start earning</td><td className="highlight">Day one, 14-day grace</td><td>Usually post-approval only</td></tr>
            <tr><td>Fare control</td><td className="highlight">Negotiate every fare</td><td>System-set pricing</td></tr>
            <tr><td>On a UGX 500,000 week</td><td className="highlight">UGX 495,000 kept</td><td>UGX 375,000–425,000 kept</td></tr>
          </tbody>
        </table>
        <p style={{ marginTop: 22, color: '#5d6571' }}>On a UGX 500,000 week, a typical 20% commission would take UGX 100,000. Lookiy&apos;s flat fee keeps that money in your wallet.</p>
      </div>
    </section>

    <section className="investor-strip content-width">
      <div><span className="eyebrow">WHY THIS WINS</span><h2>Supply that chooses<br />to stay.</h2></div>
      <div><p>Zero commission is the strongest supply-side incentive a ride platform can offer. It compounds into operator retention, reliable availability, and a network effect that powers every other part of the Lookiy business — map commerce and fleet finance.</p><Link href="/investors" className="text-link">Explore Lookiy for investors <ArrowUpRight size={18} /></Link></div>
    </section>
  </>;
}
