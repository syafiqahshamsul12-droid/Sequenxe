import React from 'react';
import { Cookie, Settings, CheckCircle, BarChart3, ShieldAlert, MessageSquare } from 'lucide-react';
import SEOManager from './calculators/shared/SEOManager';

export default function CookiePolicyPage() {
  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-10 animate-fade-in">
      <SEOManager
        title="Cookie Policy | Sequenxe Financial Platform"
        description="Understand how Sequenxe uses essential, analytics, and advertising cookies to power financial tools and customize your browsing experience."
        canonicalUrl={`${origin}/cookie-policy`}
        breadcrumbs={[
          { name: 'Home', url: `${origin}/` },
          { name: 'Cookie Policy', url: `${origin}/cookie-policy` }
        ]}
      />

      {/* Header */}
      <div className="space-y-3 border-b border-border-custom pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold font-mono">
          <Cookie className="h-4 w-4" />
          <span>Transparency Guidelines</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl font-display">
          Cookie Policy
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary">
          Last Updated: January 2026 • Sequenxe Educational Platform
        </p>
      </div>

      <div className="space-y-8 bg-white p-6 sm:p-10 rounded-2xl border border-border-custom shadow-2xs text-xs sm:text-sm text-text-primary leading-relaxed">
        
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-text-primary font-display flex items-center gap-2">
            <Cookie className="h-5 w-5 text-primary" />
            <span>1. What Are Cookies?</span>
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Cookies are small text files placed on your device by websites you visit. They are widely used to make websites work efficiently, store user preferences locally, and provide traffic insights to platform operators.
          </p>
        </section>

        {/* Essential Cookies */}
        <section className="space-y-3 border-t border-border-custom/60 pt-6">
          <h2 className="text-lg font-bold text-text-primary font-display flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <span>2. Essential Cookies</span>
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Essential cookies are strictly necessary for the core operation of Sequenxe. These cookies enable core functionality such as saving your custom tax relief selections or mortgage calculation parameters locally in your browser session. The platform cannot function properly without these cookies.
          </p>
        </section>

        {/* Analytics Cookies */}
        <section className="space-y-3 border-t border-border-custom/60 pt-6">
          <h2 className="text-lg font-bold text-text-primary font-display flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span>3. Analytics Cookies</span>
          </h2>
          <p className="text-text-secondary leading-relaxed">
            We use analytics cookies (e.g., Google Analytics) to help us understand how visitors interact with our calculators and articles. These cookies gather aggregated, non-identifiable statistical information about page views, bounce rates, and popular tools, allowing us to continuously refine our educational content.
          </p>
        </section>

        {/* Advertising & Google AdSense Cookies */}
        <section className="space-y-3 border-t border-border-custom/60 pt-6">
          <h2 className="text-lg font-bold text-text-primary font-display flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-primary" />
            <span>4. Advertising & Google AdSense Cookies</span>
          </h2>
          <p className="text-text-secondary leading-relaxed">
            To support our free financial tools, Sequenxe may display advertisements provided by Google AdSense and third-party advertising networks. Google uses cookies (such as the DoubleClick cookie) to serve relevant ads based on a user's visit to our site or other sites on the web.
          </p>
          <ul className="list-disc list-inside space-y-1 text-text-secondary pl-2">
            <li>Third-party vendors use cookies to serve ads based on prior web visits.</li>
            <li>You can opt out of personalized advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Ad Settings</a>.</li>
          </ul>
        </section>

        {/* Managing Cookies */}
        <section className="space-y-3 border-t border-border-custom/60 pt-6">
          <h2 className="text-lg font-bold text-text-primary font-display flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <span>5. Managing Cookies in Browser Settings</span>
          </h2>
          <p className="text-text-secondary leading-relaxed">
            You can control, block, or delete cookies at any time by modifying your web browser settings. Most browsers allow you to decline all cookies, accept only first-party cookies, or clear cookies when closing your browser. Note that disabling essential cookies may impact certain interactive calculator persistence features.
          </p>
        </section>

        {/* Contact */}
        <section className="space-y-3 border-t border-border-custom/60 pt-6">
          <h2 className="text-lg font-bold text-text-primary font-display flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <span>6. Questions About Our Cookie Policy</span>
          </h2>
          <p className="text-text-secondary leading-relaxed">
            If you have questions regarding our use of cookies or local storage technologies, please reach out to us using our online Contact Form.
          </p>
        </section>

      </div>
    </div>
  );
}
