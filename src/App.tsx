import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Homepage from './components/Homepage';
import SalaryCalculator from './components/calculators/SalaryCalculator';
import PcbCalculator from './components/calculators/PcbCalculator';
import IncomeTaxCalculator from './components/calculators/IncomeTaxCalculator';
import SocsoCalculator from './components/calculators/SocsoCalculator';
import EisCalculator from './components/calculators/EisCalculator';
import HomeLoanCalculator from './components/calculators/HomeLoanCalculator';
import EpfCalculator from './components/calculators/EpfCalculator';
import EpfContributionCalculator from './components/calculators/EpfContributionCalculator';
import StampDutyCalculator from './components/calculators/StampDutyCalculator';
import LoanEligibilityCalculator from './components/calculators/LoanEligibilityCalculator';
import PersonalLoanCalculator from './components/calculators/PersonalLoanCalculator';
import BlogPage from './components/BlogPage';
import BlogPostPage from './components/BlogPostPage';
import CmsAdminPage from './components/CmsAdminPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import CookiePolicyPage from './components/CookiePolicyPage';
import DisclaimerPage from './components/DisclaimerPage';
import TermsPage from './components/TermsPage';

export default function App() {
  const [activeView, setActiveView] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Auto-scroll to top and listen for view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView]);

  useEffect(() => {
    const handleViewChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setActiveView(customEvent.detail);
        setSearchQuery('');
      }
    };
    window.addEventListener('change-view', handleViewChange);
    return () => window.removeEventListener('change-view', handleViewChange);
  }, []);

  const renderActiveView = () => {
    if (activeView.startsWith('blog-')) {
      const slug = activeView.replace('blog-', '');
      return (
        <BlogPostPage 
          slug={slug} 
          onBackToBlog={() => setActiveView('blog')} 
          onSelectCalculator={(id) => setActiveView(id)} 
        />
      );
    }

    switch (activeView) {
      case 'home':
        return (
          <Homepage 
            setActiveView={setActiveView} 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        );
      case 'salary-tax':
      case 'salary-calculator':
      case 'salary-calculator-malaysia':
        return <SalaryCalculator />;
      case 'pcb-calculator':
        return <PcbCalculator />;
      case 'income-tax-calculator':
        return <IncomeTaxCalculator />;
      case 'epf-calculator':
      case 'epf-contribution-calculator':
        return <EpfContributionCalculator />;
      case 'socso-calculator':
        return <SocsoCalculator />;
      case 'eis-calculator':
        return <EisCalculator />;
      case 'home-loan':
      case 'home-loan-calculator':
        return <HomeLoanCalculator />;
      case 'stamp-duty-calculator':
        return <StampDutyCalculator />;
      case 'loan-eligibility-calculator':
        return <LoanEligibilityCalculator />;
      case 'personal-loan-calculator':
      case 'personal-loan':
        return <PersonalLoanCalculator />;
      case 'epf-retirement':
      case 'epf-retirement-calculator':
        return <EpfCalculator />;
      case 'blog':
        return (
          <BlogPage 
            onSelectArticle={(slug) => setActiveView(`blog-${slug}`)} 
            onSelectCalculator={(id) => setActiveView(id)} 
          />
        );
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'privacy-policy':
        return <PrivacyPolicyPage />;
      case 'cookie-policy':
        return <CookiePolicyPage />;
      case 'disclaimer':
        return <DisclaimerPage />;
      case 'terms-and-conditions':
      case 'terms':
        return <TermsPage />;
      case 'admin':
      case 'cms-admin':
        return (
          <CmsAdminPage 
            onNavigateBlog={(slug) => setActiveView(slug ? `blog-${slug}` : 'blog')} 
          />
        );
      default:
        return (
          <Homepage 
            setActiveView={setActiveView} 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        );
    }
  };

  const handleSearchFocus = () => {
    // Keep user on the current page when search is focused
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-custom antialiased font-sans">
      
      {/* 1. Header Navigation */}
      <Header 
        onSearchFocus={handleSearchFocus}
        activeView={activeView}
        setActiveView={setActiveView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* 2. Main content container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Dynamic View Injection */}
        <div className="w-full">
          {renderActiveView()}
        </div>

      </main>

      {/* 3. Footer */}
      <Footer setActiveView={setActiveView} />
      
    </div>
  );
}
