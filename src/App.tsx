import { Routes, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
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
  const location = useLocation();
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

  const AppRoutes = () => {
    return (
      <Routes>
  
        <Route 
          path="/" 
          element={
            <Homepage 
              setActiveView={setActiveView}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          } 
        />
  
        <Route 
          path="/salary-calculator" 
          element={<SalaryCalculator />} 
        />
  
        <Route 
          path="/pcb-calculator" 
          element={<PcbCalculator />} 
        />
  
        <Route 
          path="/income-tax-calculator" 
          element={<IncomeTaxCalculator />} 
        />
  
        <Route 
          path="/epf-calculator" 
          element={<EpfContributionCalculator />} 
        />
  
        <Route 
          path="/socso-calculator" 
          element={<SocsoCalculator />} 
        />
  
        <Route 
          path="/eis-calculator" 
          element={<EisCalculator />} 
        />
  
        <Route 
          path="/home-loan-calculator" 
          element={<HomeLoanCalculator />} 
        />
  
        <Route 
          path="/blog" 
          element={
            <BlogPage 
              onSelectArticle={(slug) => window.location.href = `/blog/${slug}`}
              onSelectCalculator={(id) => window.location.href = `/${id}`}
            />
          } 
        />
        <Route
          path="/blog/:slug"
          element={
            <BlogPostPage
              slug={window.location.pathname.split('/')[2]}
              onBackToBlog={() => window.location.href = '/blog'}
              onSelectCalculator={(id) => window.location.href = `/${id}`}
            />
          }
        />
  
        <Route 
          path="/about" 
          element={<AboutPage />} 
        />
  
        <Route 
          path="/contact" 
          element={<ContactPage />} 
        />
  
        <Route 
          path="/privacy-policy" 
          element={<PrivacyPolicyPage />} 
        />
  
        <Route 
          path="/terms" 
          element={<TermsPage />} 
        />
  
        <Route 
          path="/disclaimer" 
          element={<DisclaimerPage />} 
        />
        
        <Route
          path="/cookie-policy"
          element={<CookiePolicyPage />}
        />
  
      </Routes>
    );
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
          <AppRoutes />
        </div>

      </main>

      {/* 3. Footer */}
      <Footer setActiveView={setActiveView} />
      
    </div>
  );
}
