import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import './globals.css';
import './booking.css';

const inter = localFont({
  src: './fonts/inter-latin-wght-normal.woff2',
  variable: '--font-lookiy',
  weight: '100 900',
  display: 'swap',
});

export const metadata: Metadata = { metadataBase: new URL(process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3200'), title: 'Lookiy — Go anywhere, together', description: 'Plan journeys across Uganda with Lookiy. Book rides, arrange deliveries, and follow your trips.', icons: { icon: '/images/lookiy-icon.png' } };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className={inter.variable}><body><a className="skip-link" href="#main-content">Skip to main content</a><SiteHeader /><main id="main-content" tabIndex={-1}>{children}</main><SiteFooter /></body></html>;
}
