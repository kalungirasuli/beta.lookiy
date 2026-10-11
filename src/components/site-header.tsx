'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { api } from '@/lib/client-api';

export function SiteHeader() {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => { api('/api/session/me').then(() => setSignedIn(true)).catch(() => setSignedIn(false)); }, [pathname]);
  return <header className="site-header">
    <div className="nav-shell">
      <Link className="brand-crop" href="/" aria-label="Lookiy home"><Image className="brand-image" src="/images/lookiy-icon-1.png" alt="Lookiy" width={452} height={156} priority /></Link>
      <nav className={menu ? 'nav-links open' : 'nav-links'} aria-label="Main navigation">
        <Link href="/ride" onClick={() => setMenu(false)}>Ride</Link>
        <Link href="/riders" onClick={() => setMenu(false)}>Riders</Link>
        <Link href="/about" onClick={() => setMenu(false)}>About</Link>
        <Link href="/investors" onClick={() => setMenu(false)}>Investors</Link>
        <Link href="/app" onClick={() => setMenu(false)}>For business <ArrowUpRight size={15} /></Link>
        <Link href="/support" onClick={() => setMenu(false)}>Support</Link>
      </nav>
      <div className="nav-actions">
        <Link href={signedIn ? '/journeys' : '/login'} className="nav-text-link">{signedIn ? 'Your journeys' : 'Log in'}</Link>
        <Link href="/ride" className="pill-button nav-cta">Book a ride</Link>
        <button type="button" className="menu-toggle" onClick={() => setMenu(!menu)} aria-label={menu ? 'Close navigation' : 'Open navigation'}>{menu ? <X size={23} /> : <Menu size={23} />}</button>
      </div>
    </div>
  </header>;
}
