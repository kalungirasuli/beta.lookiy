import Link from 'next/link';
import Image from 'next/image';

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-intro content-width">
      <Link href="/" className="brand-crop footer-brand" aria-label="Lookiy home"><Image className="brand-image" src="/images/lookiy-icon-1.png" alt="Lookiy" width={452} height={156} /></Link>
      <Link href="/support">Visit the help centre</Link>
    </div>
    <nav className="footer-directory content-width" aria-label="Footer navigation">
      <div><h2>Company</h2><Link href="/about">About us</Link><Link href="/investors">Investors</Link><Link href="/support">Support</Link></div>
      <div><h2>Products</h2><Link href="/ride">Ride</Link><Link href="/ride?purpose=delivery">Delivery</Link><Link href="/app">Lookiy for business</Link></div>
      <div><h2>Earn</h2><Link href="/riders">Become a rider</Link><Link href="/riders/benefits">Rider benefits</Link></div>
      <div><h2>Travel</h2><Link href="/journeys">Your journeys</Link><Link href="/get-app">Get the app</Link></div>
    </nav>
    <div className="footer-bottom content-width"><span>© {new Date().getFullYear()} Lookiy</span><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div></div>
  </footer>;
}
