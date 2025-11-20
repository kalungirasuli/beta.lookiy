'use client';

import { useEffect } from 'react';

interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  ogUrl: string;
  twitterHandle?: string;
  authorName?: string;
  publishedDate?: string;
  modifiedDate?: string;
  jsonLd?: Record<string, string | number | boolean | Record<string, unknown> | unknown[]>;
}

export const useSEO = (metadata: SEOMetadata) => {
  useEffect(() => {
    // Update meta tags
    updateMetaTags(metadata);
    
    // Update Open Graph tags
    updateOpenGraphTags(metadata);
    
    // Update Twitter Card tags
    updateTwitterTags(metadata);
    
    // Add JSON-LD structured data
    if (metadata.jsonLd) {
      addJsonLd(metadata.jsonLd);
    }
  }, [metadata]);
};

const updateMetaTags = (metadata: SEOMetadata) => {
  // Title
  document.title = metadata.title;
  updateMetaTag('name', 'description', metadata.description);
  updateMetaTag('name', 'keywords', metadata.keywords.join(', '));
  updateMetaTag('name', 'viewport', 'width=device-width, initial-scale=1.0');
  updateMetaTag('name', 'author', metadata.authorName || 'Lookiy Team');
  updateMetaTag('name', 'theme-color', '#f97316');
  
  // Canonical URL
  updateMetaTag('rel', 'canonical', metadata.ogUrl, 'link');
  
  // Published and Modified dates
  if (metadata.publishedDate) {
    updateMetaTag('property', 'article:published_time', metadata.publishedDate);
  }
  if (metadata.modifiedDate) {
    updateMetaTag('property', 'article:modified_time', metadata.modifiedDate);
  }
};

const updateOpenGraphTags = (metadata: SEOMetadata) => {
  updateMetaTag('property', 'og:title', metadata.title);
  updateMetaTag('property', 'og:description', metadata.description);
  updateMetaTag('property', 'og:image', metadata.ogImage);
  updateMetaTag('property', 'og:url', metadata.ogUrl);
  updateMetaTag('property', 'og:type', 'website');
  updateMetaTag('property', 'og:site_name', 'Lookiy');
  updateMetaTag('property', 'og:locale', 'en_US');
};

const updateTwitterTags = (metadata: SEOMetadata) => {
  updateMetaTag('name', 'twitter:card', 'summary_large_image');
  updateMetaTag('name', 'twitter:title', metadata.title);
  updateMetaTag('name', 'twitter:description', metadata.description);
  updateMetaTag('name', 'twitter:image', metadata.ogImage);
  if (metadata.twitterHandle) {
    updateMetaTag('name', 'twitter:creator', metadata.twitterHandle);
    updateMetaTag('name', 'twitter:site', metadata.twitterHandle);
  }
};

const updateMetaTag = (
  attribute: 'name' | 'property' | 'rel',
  name: string,
  content: string,
  tagName: string = 'meta'
) => {
  if (tagName === 'meta') {
    let element = document.querySelector(`meta[${attribute}="${name}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attribute, name);
      document.head.appendChild(element);
    }
    (element as HTMLMetaElement).content = content;
  } else if (tagName === 'link') {
    let element = document.querySelector(`link[rel="${name}"]`);
    if (!element) {
      element = document.createElement('link');
      element.setAttribute('rel', name);
      document.head.appendChild(element);
    }
    (element as HTMLLinkElement).href = content;
  }
};

const addJsonLd = (schema: Record<string, string | number | boolean | Record<string, unknown> | unknown[]>) => {
  // Remove existing JSON-LD if present
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  // Add new JSON-LD
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.innerHTML = JSON.stringify(schema);
  document.head.appendChild(script);
};

export const SEOComponent = ({ metadata }: { metadata: SEOMetadata }) => {
  useSEO(metadata);
  return null;
};

export default SEOComponent;
