import React from 'react';
import { Target, Compass, Award, ShieldCheck, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import SEOManager from './calculators/shared/SEOManager';

export default function AboutPage() {
  const faqs = [
    {
      question: "What is Sequenxe?",
      answer: "Sequenxe is a modern educational financial platform offering precise calculators and easy-to-understand guides tailored specifically to Malaysian tax, mortgage, salary, and retirement regulations."
    },
    {
      question: "Are the calculations updated for 2026?",
      answer: "Yes, all tax reliefs, PCB schedules, EPF contribution caps, SOCSO/EIS rates, and stamp duty waivers are updated in line with latest government rules for Year of Assessment 2026."
    }
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-12 animate-fade-in">
      <SEOManager
        title="About Sequenxe | Modern Financial Calculators & Educational Guides"
        description="Sequenxe is an educational platform providing accurate Malaysian financial calculators and easy-to-understand financial guides for tax, home loans, EPF, and salary planning."
        canonicalUrl="https://sequenxe.com/about"
        faqs={faqs}
        breadcrumbs={[
          { name: 'Home', url: 'https://sequenxe.com/' },
          { name: 'About Sequenxe', url: 'https://sequenxe.com/about' }
        ]}
      />

      {/* Header Banner */}
      <div className="space-y-4 text-center border-b border-border-custom pb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase font-mono">
          <Compass className="h-4 w-4" />
          <span>Educational Platform</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl lg:text-5xl font-display leading-tight">
          About Sequenxe
        </h1>
        <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed font-medium">
          Empowering everyday Malaysians with crystal-clear financial tools, statutory calculators, and actionable guides to make informed money decisions.
        </p>
      </div>

      {/* Our Mission Section */}
      <section className="space-y-4 bg-white p-6 sm:p-8 rounded-2xl border border-border-custom shadow-2xs">
        <div className="flex items-center gap-3 text-primary font-bold text-xl font-display">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <Target className="h-6 w-6 text-primary" />
          </div>
          <h2>Our Mission</h2>
        </div>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          At Sequenxe, our mission is to demystify complex Malaysian personal finance regulations. From navigating monthly LHDN tax deductions (PCB) and statutory EPF/SOCSO contributions to estimating home mortgage affordability and property stamp duty waivers, we transform opaque legal formulas into simple, instant, and visual interactive tools.
        </p>
      </section>

      {/* What We Offer Section */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-text-primary font-display">What We Offer</h2>
          <p className="text-xs sm:text-sm text-text-secondary max-w-xl mx-auto">
            Everything you need to plan personal finances in Malaysia with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-border-custom shadow-2xs space-y-3">
            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-text-primary text-base font-display">1. Statutory Calculators</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Calculators for Net Take-Home Salary, PCB, Income Tax (YA 2026), EPF Akaun 1/2/3, SOCSO, and EIS.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-border-custom shadow-2xs space-y-3">
            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-text-primary text-base font-display">2. Home & Debt Planning</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Mortgage repayment schedules, Debt Service Ratio (DSR) limits, Stamp Duty fee waivers, and Personal Loan EIR conversions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-border-custom shadow-2xs space-y-3">
            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-text-primary text-base font-display">3. Educational Guides</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              In-depth articles explaining tax optimization strategies, Bank Negara OPR interest rate changes, and retirement planning.
            </p>
          </div>
        </div>
      </section>

      {/* Why We Built Sequenxe Section */}
      <section className="space-y-4 bg-white p-6 sm:p-8 rounded-2xl border border-border-custom shadow-2xs">
        <h2 className="text-xl sm:text-2xl font-bold text-text-primary font-display">Why We Built Sequenxe</h2>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          Malaysian tax schedules and banking rules are constantly evolving. Finding reliable, zero-clutter calculators that adhere strictly to official government standards (LHDN, KWSP, PERKESO, Bank Negara Malaysia) can be frustrating. We built Sequenxe to fill this gap with a clean, fast, privacy-focused experience.
        </p>
      </section>

      {/* Accuracy, Transparency & Educational Purpose */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white p-6 rounded-2xl border border-border-custom shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-primary font-bold text-lg font-display">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <h3>Accuracy & Transparency</h3>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            Our models are regularly benchmarked against official government gazettes, LHDN PCB software specifications, EPF dividend announcements, and Bank Negara guidelines.
          </p>
        </section>

        <section className="bg-white p-6 rounded-2xl border border-border-custom shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-primary font-bold text-lg font-display">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <h3>Educational Purpose</h3>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            Sequenxe is strictly designed as an educational tool. We empower users with knowledge so they can have informed discussions with licensed accountants, tax agents, or loan officers.
          </p>
        </section>
      </div>
    </div>
  );
}
