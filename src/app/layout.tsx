import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import './globals.css';

export const metadata: Metadata = { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3200'), title: 'Lookiy — Go anywhere, together', description: 'Plan journeys across Uganda with Lookiy. Book rides, arrange deliveries, and follow your trips.', icons: { icon: '/images/lookiy-icon.png' } };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><SiteHeader /><main>{children}</main><SiteFooter /></body></html>;
}
