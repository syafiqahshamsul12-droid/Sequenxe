import React from 'react';
import { Shield, FileText, Lock, Eye, Cookie, Server, UserCheck, MessageSquare, Boxes, Baby, RefreshCw } from 'lucide-react';
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
          Last Updated: August 2026
        </p>
      </div>

      <div className="space-y-8 bg-white p-6 sm:p-10 rounded-2xl border border-border-custom shadow-2xs text-xs sm:text-sm text-text-primary leading-relaxed">
        
        {/* Section 1: Overview */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-text-primary font-display flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>1. Introduction</span>
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
          Most financial information entered into our calculators (such as salary, EPF balances, loan values, or tax figures) is processed locally within your web browser. Sequenxe does not store these calculator inputs on our servers.
        </p>

        <div className="bg-bg-custom/50 p-4 rounded-xl border border-border-custom/70 space-y-2 text-xs">
        <p className="font-bold text-text-primary">
        Information that may be collected:
        </p>

        <ul className="list-disc list-inside space-y-1 text-text-secondary">
        <li>Browser and device information</li>
        <li>Pages visited and website usage statistics</li>
        <li>General location (country or region) provided by third-party analytics services</li>
        <li>Messages voluntarily submitted through our Contact page</li>
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
            Sequenxe uses cookies and browser local storage to improve your experience. These technologies may remember preferences such as your selected theme, calculator settings, or other website preferences. You can disable cookies through your browser settings, although some features may not function as intended.
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
            We may display advertisements provided by Google AdSense. Google and its advertising partners may use cookies to display ads based on your visits to this and other websites.
          </p>
          <p className="text-text-secondary leading-relaxed">
            You can manage your advertising preferences through Google Ad Settings. For more information about how Google processes data, please refer to Google's Privacy Policy.
          </p>
        </section>

        {/* Section 6: Data Retention & Security */}
        <section className="space-y-3 border-t border-border-custom/60 pt-6">
          <h2 className="text-lg font-bold text-text-primary font-display flex items-center gap-2">
            <Lock className="h-5 w-5 text-emerald-600" />
            <span>6. Data Security & Retention</span>
          </h2>
          <p className="text-text-secondary leading-relaxed">
  Sequenxe is delivered over secure HTTPS connections where supported by our hosting provider. Since calculator data is processed locally within your browser, we do not maintain a database containing your financial calculator inputs.
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

        <section className="space-y-3 border-t border-border-custom/60 pt-6">
        <h2 className="text-lg font-bold text-text-primary font-display flex items-center gap-2">
        <Boxes className="h-5 w-5 text-primary" />
        <span>9. Third-Party Services</span>
        </h2>
        <p className="text-text-secondary leading-relaxed">
         To operate and improve Sequenxe, we may use trusted third-party services, including:
        </p>

  <ul className="list-disc list-inside space-y-2 text-text-secondary">
    <li>Google Analytics</li>
    <li>Google AdSense</li>
    <li>Formspree (Contact Form)</li>
    <li>Vercel (Website Hosting)</li>
  </ul>
         </section>

        <section className="space-y-3 border-t border-border-custom/60 pt-6">
         <h2 className="text-lg font-bold text-text-primary font-display flex items-center gap-2">
           <Baby className="h-5 w-5 text-primary" />
          <span>10. Children's Privacy</span>
         </h2>

         <p className="text-text-secondary leading-relaxed">
          Sequenxe is not intended for children under the age of 13. We do not knowingly collect personal information from children.
         </p>
        </section>

        <section className="space-y-3 border-t border-border-custom/60 pt-6">
        <h2 className="text-lg font-bold text-text-primary font-display flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-primary" />
          <span>11. Changes to This Privacy Policy</span>
        </h2>

         <p className="text-text-secondary leading-relaxed">
         We may update this Privacy Policy from time to time. Any changes will be published on this page together with the updated revision date.
         </p>
        </section>

      </div>
    </div>
  );
}
