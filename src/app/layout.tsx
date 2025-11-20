import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito_Sans } from "next/font/google";
import "./globals.css";
// import LoadingProvider from "@/components/LoadingProvider";
import AppWrapper from "@/components/AppWrapper";
import { UserProvider } from "@/contexts/UserContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lookiy - The Way to Africa and World's Next Generation of Social Communication",
  description: "Lookiy is the way to Africa and the world's next generation of social communication in the digital space. Making lives easier than ever. Connect globally, build locally.",
  keywords: [
    'Lookiy',
    'social communication',
    'digital platform',
    'Africa',
    'social networking',
    'global connection',
    'digital communication',
    'community platform',
    'next generation social network',
    'connecting people',
    'digital space',
    'networking app',
    'social media alternative'
  ],
  authors: [{ name: 'Lookiy Team', url: 'https://lookiy.net' }],
  creator: 'Lookiy Team',
  publisher: 'Lookiy',
  icons: {
    icon: '/logomin.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://lookiy.net',
    siteName: 'Lookiy',
    title: "Lookiy - The Way to Africa and World's Next Generation of Social Communication",
    description: "Lookiy is the way to Africa and the world's next generation of social communication in the digital space. Making lives easier than ever.",
    images: [
      {
        url: 'https://lookiy.net/api/og?title=Lookiy%20-%20The%20Way%20to%20Africa%20and%20World%27s%20Next%20Generation%20of%20Social%20Communication&description=Making%20lives%20easier%20than%20ever.%20Connect%20globally%2C%20build%20locally.',
        width: 1200,
        height: 630,
        alt: 'Lookiy - Next Generation Social Communication Platform',
        type: 'image/png',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@LookiyApp',
    creator: '@LookiyApp',
    title: "Lookiy - The Way to Africa and World's Next Generation of Social Communication",
    description: "Lookiy is the way to Africa and the world's next generation of social communication in the digital space. Making lives easier than ever.",
    images: ['https://lookiy.net/api/og?title=Lookiy%20-%20The%20Way%20to%20Africa%20and%20World%27s%20Next%20Generation%20of%20Social%20Communication&description=Making%20lives%20easier%20than%20ever.%20Connect%20globally%2C%20build%20locally.'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  referrer: 'strict-origin-when-cross-origin',
  category: 'technology',
  classification: 'Software',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  alternates: {
    canonical: 'https://lookiy.net',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${nunitoSans.variable} antialiased`}
      >
        {/* <LoadingProvider> */}
          <UserProvider>
            <AppWrapper>
              <div className="overflow-scroll-container">
                {children}
              </div>
            </AppWrapper>
          </UserProvider>
        {/* </LoadingProvider> */}
      </body>
    </html>
  );
}
