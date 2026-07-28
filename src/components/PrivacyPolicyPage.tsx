import React from 'react';
import { Shield, FileText, Lock, Eye, Cookie, Server, UserCheck, MessageSquare } from 'lucide-react';
import SEOManager from './calculators/shared/SEOManager';

export default function PrivacyPolicyPage() {
  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-10 animate-fade-in">
      <SEOManager
        title="Privacy Policy | Sequenxe Financial Platform"
        description="Read the Privacy Policy for Sequenxe. Learn how we handle cookies, Google Analytics, Google AdSense, data protection, and user privacy."
        canonicalUrl={`${origin}/privacy-policy`}
        breadcrumbs={[
          { name: 'Home', url: `${origin}/` },
          { name: 'Privacy Policy', url: `${origin}/privacy-policy` }
        ]}
      />

      {/* Header */}
      <div className="space-y-3 border-b border-border-custom pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold font-mono">
          <Shield className="h-4 w-4" />
          <span>Legal Compliance</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl font-display">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary">
          Last Updated: January 2026 • Sequenxe Educational Platform
        </p>
      </div>

      <div className="space-y-8 bg-white p-6 sm:p-10 rounded-2xl border border-border-custom shadow-2xs text-xs sm:text-sm text-text-primary leading-relaxed">
        
        {/* Section 1: Overview */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-text-primary font-display flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>1. Overview & Commitment</span>
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Sequenxe ("we", "our", or "us") is dedicated to providing privacy-first financial educational tools and calculators. This Privacy Policy outlines the types of information collected when you access and use Sequenxe, how that information is processed, and the measures we take to protect your data.
          </p>
        </section>

        {/* Section 2: Information Collected */}
        <section className="space-y-3 border-t border-border-custom/60 pt-6">
          <h2 className="text-lg font-bold text-text-primary font-display flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            <span>2. Information We Collect</span>
          </h2>
          <p className="text-text-secondary leading-relaxed">
            We prioritize user privacy. The financial inputs you enter into our calculators (e.g. salary amounts, loan tenures, EPF balances) are calculated locally in your web browser. <strong>We do not collect, store, or transmit your sensitive personal financial numbers to any central server database.</strong>
          </p>
          <div className="bg-bg-custom/50 p-4 rounded-xl border border-border-custom/70 space-y-2 text-xs">
            <p className="font-bold text-text-primary">Types of Non-Personal Data Processed:</p>
            <ul className="list-disc list-inside space-y-1 text-text-secondary">
              <li>Device & Browser Metadata (browser type, operating system, language)</li>
              <li>Anonymized IP Address & General Geographic Location (Country level)</li>
              <li>Page Interaction Metrics (pages visited, calculator usage frequency)</li>
            </ul>
          </div>
        </section>

        {/* Section 3: Cookies & Tracking Technologies */}
        <section className="space-y-3 border-t border-border-custom/60 pt-6">
          <h2 className="text-lg font-bold text-text-primary font-display flex items-center gap-2">
            <Cookie className="h-5 w-5 text-primary" />
            <span>3. Cookies & Local Storage</span>
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Sequenxe uses standard cookies and browser local storage to save your session preferences (such as custom tax relief inputs or active calculator settings) so you can resume your session seamlessly. You can manage or block cookies at any time via your web browser settings.
          </p>
        </section>

        {/* Section 4: Google Analytics */}
        <section className="space-y-3 border-t border-border-custom/60 pt-6">
          <h2 className="text-lg font-bold text-text-primary font-display flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            <span>4. Google Analytics</span>
          </h2>
          <p className="text-text-secondary leading-relaxed">
            We use Google Analytics to analyze website traffic and optimize our educational user experience. Google Analytics collects anonymized usage statistics without identifying individual users. For more details on Google's privacy practices, please review the Google Privacy & Terms policy.
          </p>
        </section>

        {/* Section 5: Google AdSense */}
        <section className="space-y-3 border-t border-border-custom/60 pt-6">
          <h2 className="text-lg font-bold text-text-primary font-display flex items-center gap-2">
            <Server className="h-5 w-5 text-primary" />
            <span>5. Google AdSense & Third-Party Advertising</span>
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Sequenxe may display non-intrusive advertisements served by Google AdSense and third-party vendor networks to support our free educational platform. Third-party vendors, including Google, use cookies to serve ads based on prior visits to our website or other websites on the internet.
          </p>
          <p className="text-text-secondary leading-relaxed">
            Users may opt out of personalized advertising by visiting Google Ad Settings or www.aboutads.info.
          </p>
        </section>

        {/* Section 6: Data Retention & Security */}
        <section className="space-y-3 border-t border-border-custom/60 pt-6">
          <h2 className="text-lg font-bold text-text-primary font-display flex items-center gap-2">
            <Lock className="h-5 w-5 text-emerald-600" />
            <span>6. Data Security & Retention</span>
          </h2>
          <p className="text-text-secondary leading-relaxed">
            We implement industry-standard encryption (HTTPS/TLS) across all website connections. Because calculator inputs remain strictly local to your browser, no financial profile data is stored on remote servers.
          </p>
        </section>

        {/* Section 7: User Rights */}
        <section className="space-y-3 border-t border-border-custom/60 pt-6">
          <h2 className="text-lg font-bold text-text-primary font-display flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            <span>7. Your Rights</span>
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Under applicable data protection laws (including the Malaysian Personal Data Protection Act 2010), you have the right to request clarification on any data collected, clear your browser cookies and local storage at any time, or request deletion of any communications sent via our contact forms.
          </p>
        </section>

        {/* Section 8: Contact */}
        <section className="space-y-3 border-t border-border-custom/60 pt-6">
          <h2 className="text-lg font-bold text-text-primary font-display flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <span>8. Contact Information</span>
          </h2>
          <p className="text-text-secondary leading-relaxed">
            If you have questions regarding this Privacy Policy or data privacy practices on Sequenxe, please reach out to us using our online Contact Form.
          </p>
        </section>

      </div>
    </div>
  );
}
