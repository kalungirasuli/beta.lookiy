import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-main content-width">
      <div><Link href="/" className="footer-wordmark">lookiy<span>.</span></Link><p>Where Uganda moves together.</p></div>
      <div><strong>Explore</strong><Link href="/ride">Book a journey</Link><Link href="/journeys">Your journeys</Link><Link href="/get-app">Get the app</Link></div>
      <div><strong>Company</strong><Link href="/about">About Lookiy</Link><Link href="/investors">Investors</Link><Link href="/riders">Rider&apos;s guide</Link><Link href="/riders/benefits">Rider benefits</Link><Link href="/app">For business <ArrowUpRight size={13} /></Link><Link href="/support">Support</Link></div>
      <div><strong>Legal</strong><Link href="/terms">Terms and conditions</Link><Link href="/privacy">Privacy policy</Link></div>
    </div>
    <div className="footer-bottom content-width"><span>© {new Date().getFullYear()} Lookiy</span><span><Link href="/terms">Terms</Link> · <Link href="/privacy">Privacy</Link></span></div>
  </footer>;
}
