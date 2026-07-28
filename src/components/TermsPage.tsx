import React from 'react';
import { FileText, Scale, ShieldCheck, Globe, AlertCircle, RefreshCw, MessageSquare } from 'lucide-react';
import SEOManager from './calculators/shared/SEOManager';

export default function TermsPage() {
  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-10 animate-fade-in">
      <SEOManager
        title="Terms & Conditions | Sequenxe Financial Platform"
        description="Read the Terms and Conditions for accessing and using Sequenxe educational financial calculators, guides, and services."
        canonicalUrl={`${origin}/terms`}
        breadcrumbs={[
          { name: 'Home', url: `${origin}/` },
          { name: 'Terms & Conditions', url: `${origin}/terms` }
        ]}
      />

      {/* Header */}
      <div className="space-y-3 border-b border-border-custom pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold font-mono">
          <Scale className="h-4 w-4" />
          <span>User Terms</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl font-display">
          Terms & Conditions
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary">
          Last Updated: January 2026 • Sequenxe Educational Platform
        </p>
      </div>

      <div className="space-y-8 bg-white p-6 sm:p-10 rounded-2xl border border-border-custom shadow-2xs text-xs sm:text-sm text-text-primary leading-relaxed">
        
        {/* Section 1: Acceptance */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-text-primary font-display flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>1. Acceptance of Terms</span>
          </h2>
          <p className="text-text-secondary leading-relaxed">
            By accessing or using the Sequenxe platform ("Sequenxe", "website", or "service"), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you should immediately cease using our website and tools.
          </p>
        </section>

        {/* Section 2: Website Usage */}
        <section className="space-y-3 border-t border-border-custom/60 pt-6">
          <h2 className="text-lg font-bold text-text-primary font-display flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <span>2. Permitted Website Usage</span>
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Sequenxe grants you a non-exclusive, non-transferable, revocable license to access and use our interactive financial calculators and educational guides for personal, non-commercial purposes. You agree not to attempt to reverse engineer, scrape, distribute, or exploit our calculator codebase or content without prior written permission.
          </p>
        </section>

        {/* Section 3: Intellectual Property */}
        <section className="space-y-3 border-t border-border-custom/60 pt-6">
          <h2 className="text-lg font-bold text-text-primary font-display flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span>3. Intellectual Property Rights</span>
          </h2>
          <p className="text-text-secondary leading-relaxed">
            All text, graphics, logos, calculator user interfaces, design elements, algorithms, and educational articles on Sequenxe are protected by copyright, trademark, and intellectual property laws. "Sequenxe" and "Powered by Nusora" are trademarks or registered identifiers of their respective owners.
          </p>
        </section>

        {/* Section 4: No Warranties */}
        <section className="space-y-3 border-t border-border-custom/60 pt-6">
          <h2 className="text-lg font-bold text-text-primary font-display flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            <span>4. No Warranties</span>
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Sequenxe is provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied. While we take reasonable care to maintain calculation accuracy aligned with Malaysian regulations (LHDN, EPF, SOCSO, Bank Negara), we do not guarantee uninterrupted uptime, bug-free execution, or complete mathematical perfection under all custom user scenarios.
          </p>
        </section>

        {/* Section 5: Limitation of Liability */}
        <section className="space-y-3 border-t border-border-custom/60 pt-6">
          <h2 className="text-lg font-bold text-text-primary font-display flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            <span>5. Limitation of Liability</span>
          </h2>
          <p className="text-text-secondary leading-relaxed">
            To the maximum extent permitted by law, Sequenxe, its operators, or affiliates shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your reliance on any calculators, articles, or services provided through this website.
          </p>
        </section>

        {/* Section 6: External Links */}
        <section className="space-y-3 border-t border-border-custom/60 pt-6">
          <h2 className="text-lg font-bold text-text-primary font-display flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <span>6. External Links & References</span>
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Sequenxe contains links to external government portals (e.g. LHDN, KWSP, PERKESO) and third-party resources for informational reference. We do not endorse or assume responsibility for the content, privacy practices, or availability of external websites.
          </p>
        </section>

        {/* Section 7: Changes to Terms */}
        <section className="space-y-3 border-t border-border-custom/60 pt-6">
          <h2 className="text-lg font-bold text-text-primary font-display flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary" />
            <span>7. Changes to These Terms</span>
          </h2>
          <p className="text-text-secondary leading-relaxed">
            We reserve the right to modify these Terms and Conditions at any time. Any changes will be posted directly on this page with an updated revision date. Your continued use of Sequenxe constitutes acceptance of the modified terms.
          </p>
        </section>

        {/* Section 8: Governing Law */}
        <section className="space-y-3 border-t border-border-custom/60 pt-6">
          <h2 className="text-lg font-bold text-text-primary font-display flex items-center gap-2">
            <Scale className="h-5 w-5 text-emerald-600" />
            <span>8. Governing Law & Jurisdiction</span>
          </h2>
          <p className="text-text-secondary leading-relaxed">
            These Terms and Conditions shall be governed by and construed in accordance with the laws of Malaysia. Any disputes arising from or related to the use of Sequenxe shall be subject to the exclusive jurisdiction of the courts of Malaysia.
          </p>
        </section>

        {/* Contact */}
        <section className="space-y-3 border-t border-border-custom/60 pt-6">
          <h2 className="text-lg font-bold text-text-primary font-display flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <span>9. Contact Us</span>
          </h2>
          <p className="text-text-secondary leading-relaxed">
            If you have questions regarding these Terms & Conditions, please reach out to us using our online Contact Form.
          </p>
        </section>

      </div>
    </div>
  );
}
