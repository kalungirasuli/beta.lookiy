'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { getWebSession } from '@/lib/client-api';

export function SiteHeader() {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    let active = true;
    getWebSession().then(() => { if (active) setSignedIn(true); }).catch(() => { if (active) setSignedIn(false); });
    return () => { active = false; };
  }, [pathname]);
  return <header className="site-header" onKeyDown={event => {
    if (menu && event.key === 'Escape') { setMenu(false); menuButton.current?.focus(); }
  }}>
    <div className="nav-shell">
      <Link className="brand-crop" href="/" aria-label="Lookiy home"><Image className="brand-image" src="/images/lookiy-icon-1.png" alt="Lookiy" width={452} height={156} priority /></Link>
      <nav id="main-navigation" className={menu ? 'nav-links open' : 'nav-links'} aria-label="Main navigation">
        <Link href="/ride" onClick={() => setMenu(false)}>Ride</Link>
        <Link href="/riders" onClick={() => setMenu(false)}>Drive</Link>
        <Link href="/ride?purpose=delivery" onClick={() => setMenu(false)}>Delivery</Link>
        <Link href="/app" onClick={() => setMenu(false)}>Business</Link>
        <Link href="/about" onClick={() => setMenu(false)}>About</Link>
        <Link href="/support" className="nav-menu-help" onClick={() => setMenu(false)}>Help</Link>
      </nav>
      <div className="nav-actions">
        <Link href="/support" className="nav-text-link nav-desktop-help" onClick={() => setMenu(false)}>Help</Link>
        <Link href={signedIn ? '/journeys' : '/login'} className="nav-text-link" onClick={() => setMenu(false)}>{signedIn ? 'Your journeys' : 'Log in'}</Link>
        <Link href={signedIn ? '/ride' : '/register'} className={signedIn ? 'pill-button nav-cta nav-cta-book' : 'pill-button nav-cta'} onClick={() => setMenu(false)}>{signedIn ? 'Book a ride' : 'Sign up'}</Link>
        <button ref={menuButton} type="button" className="menu-toggle" aria-expanded={menu} aria-controls="main-navigation" onClick={() => setMenu(!menu)} aria-label={menu ? 'Close navigation' : 'Open navigation'}>{menu ? <X size={23} /> : <Menu size={23} />}</button>
      </div>
    </div>
  </header>;
}
