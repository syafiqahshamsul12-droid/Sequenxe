import { useEffect } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SEOManagerProps {
  title: string;
  description: string;
  canonicalUrl: string;
  calculatorId?: string;
  faqs?: FAQItem[];
  breadcrumbs?: BreadcrumbItem[];
  countryCode?: 'MY' | 'SG' | 'AU' | 'UK' | 'US';
}

export default function SEOManager({
  title,
  description,
  canonicalUrl,
  calculatorId,
  faqs = [],
  breadcrumbs = [],
  countryCode = 'MY',
}: SEOManagerProps) {
  useEffect(() => {
    // 1. Title Tag
    const fullTitle = `${title} | Sequenxe ${countryCode}`;
    document.title = fullTitle;

    // Helper to set/create meta tag
    const setMetaTag = (attribute: string, attrValue: string, contentValue: string) => {
      let element = document.querySelector(`meta[${attribute}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentValue);
    };

    // Helper to set/create link tag
    const setLinkTag = (rel: string, hrefValue: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', hrefValue);
    };

    // 2. Meta Description
    setMetaTag('name', 'description', description);

    // 3. Canonical URL
    setLinkTag('canonical', canonicalUrl);

    // 4. Open Graph Tags
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', calculatorId ? 'article' : 'website');
    setMetaTag('property', 'og:site_name', `Sequenxe ${countryCode}`);
    setMetaTag('property', 'og:locale', countryCode === 'MY' ? 'en_MY' : 'en_US');

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);

    // 6. Structured Data (JSON-LD)
    // Clear any previous JSON-LD scripts we created
    const existingScripts = document.querySelectorAll('script[data-seo="sequenxe-jsonld"]');
    existingScripts.forEach((script) => script.remove());

    const schemas: any[] = [];

    // A. Organization Schema
    const orgSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': 'https://sequenxe.com/#organization',
      'name': 'Sequenxe',
      'url': 'https://sequenxe.com',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://sequenxe.com/logo.png',
        'caption': 'Sequenxe Logo',
      },
    };
    schemas.push(orgSchema);

    // B. WebPage Schema
    const webPageSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
      'url': canonicalUrl,
      'name': fullTitle,
      'description': description,
      'isPartOf': { '@id': 'https://sequenxe.com/#website' },
      'inLanguage': 'en-MY',
    };
    schemas.push(webPageSchema);

    // C. SoftwareApplication Schema (for Calculators)
    if (calculatorId) {
      const softwareSchema = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        '@id': `${canonicalUrl}#software`,
        'name': title,
        'operatingSystem': 'All',
        'applicationCategory': 'FinanceApplication',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': countryCode === 'MY' ? 'MYR' : 'SGD',
        },
      };
      schemas.push(softwareSchema);
    }

    // D. Breadcrumb Schema
    if (breadcrumbs.length > 0) {
      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': breadcrumbs.map((crumb, idx) => ({
          '@type': 'ListItem',
          'position': idx + 1,
          'name': crumb.name,
          'item': crumb.url,
        })),
      };
      schemas.push(breadcrumbSchema);
    }

    // E. FAQ Schema
    if (faqs.length > 0) {
      const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': faqs.map((faq) => ({
          '@type': 'Question',
          'name': faq.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': faq.answer,
          },
        })),
      };
      schemas.push(faqSchema);
    }

    // Inject all compiled schemas as a single structured block
    schemas.forEach((schema, idx) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo', 'sequenxe-jsonld');
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    return () => {
      // Optional cleanups on unmount if needed
    };
  }, [title, description, canonicalUrl, calculatorId, faqs, breadcrumbs, countryCode]);

  return null;
}
