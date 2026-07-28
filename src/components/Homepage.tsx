import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight, Home, Percent, CreditCard, TrendingUp, ChevronRight, BookOpen, Clock, Heart, HelpCircle, Check } from 'lucide-react';
import { CALCULATORS, CATEGORIES, FEATURED_GUIDES } from '../data/calculators';
import { CalculatorMetadata, CategoryId } from '../types';

interface HomepageProps {
  setActiveView: (view: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Homepage({ setActiveView, searchQuery, setSearchQuery }: HomepageProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Filter calculators based on search query AND/OR selected category
  const filteredCalculators = CALCULATORS.filter(calc => {
    const matchesSearch = searchQuery === '' || 
      calc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      calc.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      calc.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || calc.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const popularCalculators = CALCULATORS.filter(calc => calc.popular);
  const trendingCalculators = CALCULATORS.filter(calc => calc.trending);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Percent':
        return <Percent className="h-5 w-5 text-primary" />;
      case 'Home':
        return <Home className="h-5 w-5 text-primary" />;
      case 'TrendingUp':
        return <TrendingUp className="h-5 w-5 text-primary" />;
      case 'CreditCard':
        return <CreditCard className="h-5 w-5 text-primary" />;
      default:
        return <HelpCircle className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="space-y-16 animate-fade-in">
      
      {/* 1. Large Premium Hero Search Section */}
      <section className="text-center py-12 px-4 sm:px-6 max-w-4xl mx-auto space-y-6" id="hero-search-section">
        <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-3 py-1.5 rounded-full text-xs font-semibold border border-primary/15 animate-pulse">
          <Sparkles className="h-3.5 w-3.5" />
          <span>LHDN 2026 Ready & Automated</span>
        </div>
        
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-text-primary leading-tight">
          What would you like to <span className="text-primary underline decoration-primary-light decoration-4 underline-offset-6">calculate</span> today?
        </h1>
        
        <p className="text-sm sm:text-base text-text-secondary max-w-xl mx-auto leading-relaxed">
          Navigate Malaysian income tax, mortgages, KWSP retirement allocations, and personal debts with zero jargon and full clarity.
        </p>

        {/* Large Premium Search Bar */}
        <div className="relative max-w-2xl mx-auto pt-2">
          <Search className="absolute top-5 left-5 h-5.5 w-5.5 text-text-secondary" />
          <input
            type="text"
            placeholder="Search, e.g., 'Salary tax', 'EPF', 'Home mortgage'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-14 w-full rounded-2xl border border-border-custom bg-white pl-13 pr-4 text-sm sm:text-base font-medium shadow-md shadow-primary/5 transition-all focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            aria-label="Search financial calculators"
          />
        </div>

        {/* Suggestion / Shortcut tags */}
        <div className="flex flex-wrap justify-center items-center gap-2 pt-2">
          <span className="text-xs text-text-secondary font-medium">Quick links:</span>
          {[
            { label: 'Gross Salary PCB', id: 'salary-tax' },
            { label: 'Mortgage & Stamp Duty', id: 'home-loan' },
            { label: 'KWSP 3-Account', id: 'epf-retirement' },
            { label: 'EIR Personal Debt', id: 'personal-loan' }
          ].map((tag) => (
            <button
              key={tag.id}
              onClick={() => { setActiveView(tag.id); setSearchQuery(''); }}
              className="text-xs font-medium bg-white hover:bg-primary/5 hover:text-primary hover:border-primary/20 border border-border-custom px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              {tag.label}
            </button>
          ))}
        </div>
      </section>

      {/* 2. Search results / Dynamic filtered list if searching */}
      {searchQuery !== '' && (
        <section className="space-y-6">
          <div className="border-b border-border-custom pb-3 flex items-center justify-between">
            <h2 className="font-display font-extrabold text-lg text-text-primary">
              Matched Calculators ({filteredCalculators.length})
            </h2>
            <button 
              onClick={() => setSearchQuery('')}
              className="text-xs font-bold text-primary hover:text-primary-hover cursor-pointer"
            >
              Clear search
            </button>
          </div>

          {filteredCalculators.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCalculators.map((calc) => (
                <div 
                  key={calc.id}
                  className="bg-white border border-border-custom rounded-2xl p-6 shadow-xs flex flex-col justify-between transition-all hover:border-primary/30"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 bg-primary/5 rounded-xl flex items-center justify-center">
                        {getIcon(calc.iconName)}
                      </div>
                      <span className="text-xs font-mono font-medium text-text-secondary flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {calc.estimatedTime}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-base text-text-primary">{calc.title}</h3>
                    <p className="text-xs text-text-secondary leading-relaxed">{calc.shortDescription}</p>
                  </div>
                  <button
                    onClick={() => setActiveView(calc.id)}
                    className="mt-5 w-full flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
                  >
                    <span>Open Calculator</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-border-custom">
              <p className="text-sm text-text-secondary">No calculators matched your search. Try searching "tax", "loan", or "EPF".</p>
            </div>
          )}
        </section>
      )}

      {/* 3. Popular Financial Tools (Only if not active search filter) */}
      {searchQuery === '' && (
        <section className="space-y-6">
          <div className="border-b border-border-custom pb-3">
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-text-primary tracking-tight">
              Popular Financial Tools
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              The most frequently used financial calculators by Malaysian households today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularCalculators.map((calc) => (
              <div 
                key={calc.id}
                className="bg-white border border-border-custom rounded-2xl p-6 shadow-xs flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 hover:ring-1 hover:ring-primary/10"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 bg-primary/5 rounded-xl flex items-center justify-center">
                      {getIcon(calc.iconName)}
                    </div>
                    <span className="text-xs font-mono font-medium text-text-secondary flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {calc.estimatedTime}
                    </span>
                  </div>
                  
                  <h3 className="font-display font-bold text-base text-text-primary">{calc.title}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed min-h-[48px]">{calc.shortDescription}</p>
                </div>

                <button
                  onClick={() => setActiveView(calc.id)}
                  className="mt-5 flex items-center justify-center gap-1 bg-primary hover:bg-primary-hover text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  <span>Open Tool</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Browse Categories */}
      {searchQuery === '' && (
        <section className="space-y-6">
          <div className="border-b border-border-custom pb-3">
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-text-primary tracking-tight">
              Browse by User Goals
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Organized by actual household objectives rather than complex technical financial jargon.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id as CategoryId)}
                className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-primary/5 border-primary/40 shadow-xs'
                    : 'bg-white border-border-custom hover:border-primary/20 hover:shadow-xs'
                }`}
              >
                <span className="font-display font-extrabold text-sm text-text-primary block mb-1">
                  {cat.title}
                </span>
                <p className="text-[11px] text-text-secondary leading-relaxed mb-3">
                  {cat.description}
                </p>
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className={selectedCategory === cat.id ? 'text-primary' : 'text-text-secondary'}>
                    {selectedCategory === cat.id ? 'Filter active' : 'Click to filter'}
                  </span>
                  <ChevronRight className={`h-4 w-4 transition-transform ${selectedCategory === cat.id ? 'translate-x-1 text-primary' : 'text-text-secondary'}`} />
                </div>
              </button>
            ))}
          </div>

          {/* Sub-block showing active category filter results if active */}
          {selectedCategory && (
            <div className="bg-bg-custom/50 border border-border-custom rounded-2xl p-5 space-y-4 animate-fade-in">
              <div className="flex justify-between items-center">
                <span className="text-xs text-text-secondary">
                  Showing matches for selected goal filter:
                </span>
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="text-xs font-bold text-primary hover:text-primary-hover cursor-pointer"
                >
                  Reset Filter
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCalculators.map(calc => (
                  <button
                    key={calc.id}
                    onClick={() => setActiveView(calc.id)}
                    className="bg-white border border-border-custom rounded-xl p-4 text-left transition-all hover:border-primary/30 flex justify-between items-center cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-primary/5 rounded-lg flex items-center justify-center">
                        {getIcon(calc.iconName)}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-text-primary block group-hover:text-primary transition-colors">{calc.title}</span>
                        <span className="text-[10px] text-text-secondary block">{calc.shortDescription}</span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-text-secondary group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* 5. Educational Guides Section */}
      {searchQuery === '' && (
        <section className="space-y-6">
          <div className="border-b border-border-custom pb-3">
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-text-primary tracking-tight">
              Featured Financial Guides
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Practical explanations written by tax and real estate experts to empower your financial decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURED_GUIDES.map((guide, idx) => (
              <div 
                key={idx}
                className="bg-white border border-border-custom rounded-2xl p-6 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary font-mono bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10">
                      {guide.category}
                    </span>
                    <span className="text-[10px] text-text-secondary font-medium flex items-center gap-1 font-mono">
                      <BookOpen className="h-3.5 w-3.5" />
                      {guide.readTime}
                    </span>
                  </div>
                  
                  <h3 className="font-display font-bold text-sm sm:text-base text-text-primary">{guide.title}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{guide.excerpt}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-bg-custom">
                  <button 
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('change-view', { detail: `blog-${guide.slug}` }));
                    }}
                    className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1 cursor-pointer"
                  >
                    <span>Read complete guide</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5.5 Accordion-Style FAQ Section */}
      {searchQuery === '' && (
        <section className="space-y-6">
          <div className="border-b border-border-custom pb-3">
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-text-primary tracking-tight">
              Frequently Asked Questions (FAQ)
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Clear answers to common questions about statutory contributions, mortgage duties, and personal finance rates in Malaysia.
            </p>
          </div>

          <div className="space-y-3 max-w-4xl">
            {[
              {
                question: "What is LHDN PCB tax and how is it calculated in Malaysia?",
                answer: "Potongan Cukai Berjadual (PCB) is the Monthly Tax Deduction withheld by employers to pay employees' income tax. It is calculated deterministically based on LHDN's official tax tables and formula guidelines, considering your monthly gross salary, compulsory EPF contributions, and any self-declared tax reliefs (such as lifestyle, medical, or education rebates)."
              },
              {
                question: "How is SPA and Loan stamp duty calculated for home loans?",
                answer: "In Malaysia, stamp duty is progressive: 1% on the first RM100,000 of the property value, 2% on the next RM400,000, 3% on the next RM500,000, and 4% on anything above. Loan agreement stamp duty is a flat 0.5% of the total loan amount. Note that first-time homebuyers get 100% stamp duty waiver exemptions on properties priced below RM500,000."
              },
              {
                question: "How does the new EPF (KWSP) 3-Account system work?",
                answer: "Starting May 2024, Malaysian KWSP contributions are automatically split into three accounts: 75% goes to Akaun Persaraan (Account 1, only for retirement), 15% goes to Akaun Sejahtera (Account 2, for housing, medical, or education), and 10% goes to Akaun Fleksibel (Account 3, which allows daily withdrawals at any time to assist with short-term cash flow needs)."
              },
              {
                question: "Why is the Effective Interest Rate (EIR) higher than flat interest rates?",
                answer: "Flat interest rates calculate interest based on the initial loan principal throughout the entire loan tenure, ignoring the fact that your outstanding principal decreases as you pay it off monthly. The Effective Interest Rate (EIR) reflects the actual borrowing cost on a reducing-balance basis, which is why the EIR is always significantly higher than the flat rate."
              },
              {
                question: "Are these financial calculators compliant with LHDN 2026 guidelines?",
                answer: "Yes, our calculators are updated to align with the latest Malaysian Budget announcements, incorporating the RM6,000 SOCSO salary cap revisions, current tax relief categories, and standard statutory contribution tables to ensure 100% calculation accuracy."
              }
            ].map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index} 
                  className="bg-white border border-border-custom rounded-xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-bg-custom/40 cursor-pointer"
                  >
                    <span className="font-display font-bold text-sm sm:text-base text-text-primary pr-4">
                      {faq.question}
                    </span>
                    <ChevronRight 
                      className={`h-4.5 w-4.5 text-text-secondary shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-90 text-primary' : ''}`} 
                    />
                  </button>
                  
                  {isOpen && (
                    <div className="p-4 pt-0 border-t border-bg-custom/80 text-xs sm:text-sm text-text-secondary leading-relaxed bg-bg-custom/10 animate-fade-in">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

    </div>
  );
}
