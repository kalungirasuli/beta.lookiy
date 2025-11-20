'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';
import ImmersiveHero from '@/components/ImmersiveHero';
import RealPeopleSection from '@/components/RealPeopleSection';
import MakeItMatterSection from '@/components/MakeItMatterSection';
import UseCasesSection from '@/components/UseCasesSection';
import JoinWaitingListForm from '@/components/JoinWaitingListForm';
import SEO from '@/components/SEO';

export default function Homecoming() {
  const seoMetadata = {
    title: 'Lookiy - The Way to Africa and World\'s Next Generation of Social Communication',
    description: 'Lookiy is the way to Africa and the world\'s next generation of social communication in the digital space. Making lives easier than ever. Connect globally, build locally. Join the digital revolution.',
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
      'social media alternative',
      'global network',
      'community building',
      'digital revolution',
      'Lookiy platform',
      'online community',
      'social connection',
      'world connection'
    ],
    ogImage: 'https://lookiy.net/logomin.png',
    ogUrl: 'https://lookiy.net',
    twitterHandle: '@LookiyApp',
    authorName: 'Lookiy Team',
    publishedDate: new Date('2025-01-01').toISOString(),
    modifiedDate: new Date().toISOString(),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'Lookiy',
      'description': 'Lookiy is the way to Africa and the world\'s next generation of social communication in the digital space. Making lives easier than ever.',
      'url': 'https://lookiy.net',
      'logo': 'https://lookiy.net/logo.svg',
      'sameAs': [
        'https://twitter.com/LookiyApp',
        'https://instagram.com/lookiyapp',
        'https://facebook.com/lookiyapp'
      ],
      'contactPoint': {
        '@type': 'ContactPoint',
        'contactType': 'Customer Service',
        'email': 'support@lookiy.net',
        'url': 'https://lookiy.net/support'
      },
      'foundingDate': '2025-01-01',
      'areaServed': ['Africa', 'World'],
      'mainEntity': {
        '@type': 'SoftwareApplication',
        'name': 'Lookiy',
        'description': 'Next generation social communication platform for Africa and the world',
        'applicationCategory': 'SocialNetworking',
        'operatingSystem': 'Web, iOS, Android',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD'
        },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': '4.8',
          'ratingCount': '1000',
          'bestRating': '5',
          'worstRating': '1'
        }
      }
    }
  };

  return (
    <>
      <SEO metadata={seoMetadata} />
      <div className="min-h-screen flex flex-col">
        {/* Animated background */}
        <AnimatedBackground />
        
        {/* Navigation */}
        <Navbar />
        
        {/* Main Content */}
        <main className="flex-grow flex flex-col">
          {/* Immersive Hero Section */}
          <ImmersiveHero />
          
          {/* Real People Real Links Section */}
          <RealPeopleSection />
          
          {/* How You'll Make It Matter Section */}
          <MakeItMatterSection />
          
          {/* Use Cases Section */}
          <UseCasesSection />
          
          {/* Join Waiting List Form */}
          <JoinWaitingListForm />
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}