// SEO Configuration for Lookiy
// This file contains all SEO-related configurations and metadata

export const SITE_CONFIG = {
  name: 'Lookiy',
  description: 'Lookiy is the way to Africa and the world\'s next generation of social communication in the digital space. Making lives easier than ever.',
  tagline: 'Lookiy is the way to Africa and world next generation of social communication is the digital space. Making lifes easier than ever',
  url: 'https://lookiy.net',
  twitterHandle: '@LookiyApp',
  email: 'support@lookiy.net',
  phone: '+256 704616280',
  logo: 'https://lookiy.net/logo.svg',
  favicon: '/logomin.svg',
  ogImage: 'https://lookiy.net/logomin.png',
};

export const KEYWORDS = [
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
  'world connection',
  'network discovery',
  'instant connection',
  'real-time networking',
  'digital transformation',
  'social innovation',
  'Africa tech',
  'global connectivity',
  'web3 social',
  'decentralized network',
  'community driven',
];

export const STRUCTURED_DATA = {
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'Lookiy',
    'url': 'https://lookiy.net',
    'logo': 'https://lookiy.net/logo.svg',
    'description': 'Lookiy is the way to Africa and the world\'s next generation of social communication in the digital space. Making lives easier than ever.',
    'sameAs': [
      'https://twitter.com/LookiyApp',
      'https://instagram.com/lookiyapp',
      'https://facebook.com/lookiyapp',
      'https://linkedin.com/company/lookiyapp',
    ],
    'contactPoint': {
      '@type': 'ContactPoint',
      'contactType': 'Customer Service',
      'email': 'support@lookiy.net',
      'availableLanguage': ['en', 'es', 'fr', 'pt'],
    },
    'foundingDate': '2025-01-01',
    'areaServed': ['Africa', 'World'],
    'knowsAbout': [
      'Social Networking',
      'Digital Communication',
      'Community Building',
      'Network Discovery',
      'Global Connectivity',
    ],
  },

  softwareApplication: {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'Lookiy',
    'description': 'Next generation social communication platform for Africa and the world',
    'applicationCategory': 'SocialNetworking',
    'operatingSystem': 'Web, iOS, Android',
    'url': 'https://lookiy.net',
    'downloadUrl': 'https://lookiy.net/download',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD',
      'availability': 'https://schema.org/InStock',
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '4.8',
      'ratingCount': '1000',
      'bestRating': '5',
      'worstRating': '1',
      'reviewCount': '1000',
    },
    'author': {
      '@type': 'Organization',
      'name': 'Lookiy Team',
      'url': 'https://lookiy.net',
    },
  },

  website: {
    '@context': 'https://schema.org',
    '@type': 'Website',
    'name': 'Lookiy',
    'url': 'https://lookiy.net',
    'description': 'Lookiy is the way to Africa and the world\'s next generation of social communication in the digital space. Making lives easier than ever.',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': 'https://lookiy.net/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  },

  breadcrumb: {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://lookiy.net',
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Support',
        'item': 'https://lookiy.net/',
      },
      
    ],
  },

  faqSchema: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'What is Lookiy?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Lookiy is the next generation of social communication platform that connects people globally while building strong local communities. It\'s designed to make digital communication easier and more meaningful.',
        },
      },
      {
        '@type': 'Question',
        'name': 'Is Lookiy available worldwide?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes, Lookiy is designed for Africa and the entire world. Our platform enables global connectivity with local community focus.',
        },
      },
      {
        '@type': 'Question',
        'name': 'How do I join Lookiy?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'You can sign up on our website or join the waitlist to get early access when we launch.',
        },
      },
      {
        '@type': 'Question',
        'name': 'Is Lookiy free?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes, Lookiy is completely free to use for all basic features.',
        },
      },
      {
        '@type': 'Question',
        'name': 'How does Lookiy ensure privacy?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Lookiy prioritizes user privacy and data security with enterprise-grade encryption and privacy controls.',
        },
      },
    ],
  },
};

export const SEO_PAGES = {
  home: {
    title: 'Lookiy - The Way to Africa and World\'s Next Generation of Social Communication',
    description: 'Lookiy is the way to Africa and the world\'s next generation of social communication in the digital space. Making lives easier than ever. Connect globally, build locally.',
    keywords: KEYWORDS,
    canonical: 'https://lookiy.net',
    ogImage: 'https://lookiy.net/og-image.png',
    twitterCard: 'summary_large_image',
  },
  support: {
    title: 'Support Lookiy - Join Our Movement',
    description: 'Be part of the digital revolution. Support Lookiy and help shape the future of global social communication.',
    keywords: ['support lookiy', 'contact lookiy', 'feedback', 'beta testing'],
    canonical: 'https://lookiy.net/support',
  },

  signup: {
    title: 'Sign Up - Lookiy',
    description: 'Create a new Lookiy account and start connecting with networks and communities across Africa and the world.',
    keywords: ['signup lookiy', 'create account', 'register lookiy'],
    canonical: 'https://lookiy.net/Homecoming#waitlist',
  },
};

export const SOCIAL_MEDIA_PREVIEW = {
  title: 'Lookiy - The Way to Africa and World\'s Next Generation of Social Communication',
  description: 'Lookiy is the way to Africa and the world\'s next generation of social communication in the digital space. Making lives easier than ever.',
  image: 'https://lookiy.net/logomin.png',
  url: 'https://lookiy.net',
  type: 'website',
};

export const JSON_LD_HOMEPAGE = {
  '@context': 'https://schema.org',
  '@graph': [
    STRUCTURED_DATA.organization,
    STRUCTURED_DATA.softwareApplication,
    STRUCTURED_DATA.website,
    STRUCTURED_DATA.faqSchema,
  ],
};
