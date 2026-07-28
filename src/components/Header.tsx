import { useNavigate } from 'react-router-dom';
import React, { useState, useRef } from 'react';
import { Search, Globe, Sun, Moon, Calculator, ChevronDown, Menu, X, ArrowRight, BookOpen } from 'lucide-react';
import { CALCULATORS, CATEGORIES } from '../data/calculators';
import Logo from './Logo';

interface HeaderProps {
  onSearchFocus?: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Header({ onSearchFocus, activeView, setActiveView, searchQuery, setSearchQuery }: HeaderProps) {
  const navigate = useNavigate();
  const [country, setCountry] = useState('MY');
  const [isDark, setIsDark] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnterDropdown = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setIsDropdownOpen(true);
  };

  const handleMouseLeaveDropdown = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
  };

  const isHomeActive = activeView === 'home' && searchQuery === '';
  const isBlogActive = activeView === 'blog' || activeView.startsWith('blog-');
  const isCalculatorsActive = !isHomeActive && !isBlogActive;


  React.useEffect(() => {
    const savedTheme = localStorage.getItem('sequenxe_theme') || localStorage.getItem('sequence_theme');
  
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCountry(e.target.value);
  };

  const toggleDarkMode = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sequenxe_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sequenxe_theme', 'light');
    }
  };

  const filteredSuggestions = searchQuery.trim() === '' ? [] : CALCULATORS.filter(calc => 
    calc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    calc.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectView = (viewId: string) => {
    const routes: Record<string, string> = {
      home: '/',
      blog: '/blog',
      about: '/about',
      contact: '/contact',
      'salary-calculator': '/salary-calculator',
      'pcb-calculator': '/pcb-calculator',
      'income-tax-calculator': '/income-tax-calculator',
      'epf-calculator': '/epf-calculator',
      'epf-contribution-calculator': '/epf-calculator',
      'socso-calculator': '/socso-calculator',
      'eis-calculator': '/eis-calculator',
      'home-loan-calculator': '/home-loan-calculator',
      'stamp-duty-calculator': '/stamp-duty-calculator',
      'loan-eligibility-calculator': '/loan-eligibility-calculator',
      'personal-loan-calculator': '/personal-loan-calculator',
      'epf-retirement-calculator': '/epf-retirement-calculator',
      'privacy-policy': '/privacy-policy',
      'cookie-policy': '/cookie-policy',
      'terms': '/terms',
      'disclaimer': '/disclaimer',
    };
  
    navigate(routes[viewId] || '/');
  
    setActiveView(viewId);
    setSearchQuery('');
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border-custom bg-white/95 backdrop-blur-md no-print">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => handleSelectView('home')}
            className="group text-left cursor-pointer shrink-0 transition-transform hover:scale-102"
            id="header-logo"
          >
            <Logo size="md" />
          </button>
 
          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-2 whitespace-nowrap">
            {/* 1. Home */}
            <button 
              onClick={() => handleSelectView('home')}
              className={`text-sm font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                isHomeActive ? 'text-primary bg-primary/5 font-bold' : 'text-text-secondary hover:text-text-primary hover:bg-bg-custom'
              }`}
            >
              Home
            </button>

            {/* 2. Calculators Dropdown */}
            <div 
              className="relative"
              onMouseEnter={handleMouseEnterDropdown}
              onMouseLeave={handleMouseLeaveDropdown}
            >
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`text-sm font-semibold transition-colors cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-lg ${
                  isCalculatorsActive 
                    ? 'bg-primary/10 text-primary font-bold' 
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-custom'
                }`}
              >
                <span>Calculators</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180 text-primary' : ''}`} />
              </button>

              {/* Grouped Dropdown Menu */}
              {isDropdownOpen && (
                <div 
                  className="absolute left-0 top-10 z-50 w-[580px] rounded-2xl border border-border-custom bg-white p-4 shadow-2xl animate-fade-in grid grid-cols-12 gap-4"
                  onMouseEnter={handleMouseEnterDropdown}
                  onMouseLeave={handleMouseLeaveDropdown}
                >
                  <div className="col-span-12 pb-2 border-b border-border-custom flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary font-mono">
                      Malaysian Financial Calculators
                    </span>
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {CALCULATORS.length} Tools
                    </span>
                  </div>

                  {/* Group 1: Salary & Tax (col-span-7) */}
                  <div className="col-span-7 space-y-1.5">
                    <div className="text-xs font-bold text-text-primary uppercase tracking-wider font-mono flex items-center gap-1.5 px-2 py-1 text-primary">
                      <span>💼 Salary & Tax</span>
                    </div>
                    <div className="space-y-0.5">
                      {CALCULATORS.filter(c => c.category === 'salary').map(calc => (
                        <button
                          key={calc.id}
                          onClick={() => handleSelectView(calc.id)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-all flex items-center justify-between cursor-pointer group ${
                            activeView === calc.id ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-bg-custom text-text-primary'
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <div className="text-xs font-semibold truncate group-hover:text-primary transition-colors">
                              {calc.title}
                            </div>
                            <div className="text-[10px] text-text-secondary truncate leading-tight">
                              {calc.shortDescription}
                            </div>
                          </div>
                          {activeView === calc.id && (
                            <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Group 2 & 3: Home & Property + Retirement (col-span-5) */}
                  <div className="col-span-5 space-y-4 border-l border-border-custom pl-4">
                    {/* Home & Property */}
                    <div className="space-y-1.5">
                      <div className="text-xs font-bold text-text-primary uppercase tracking-wider font-mono px-2 py-0.5 text-primary">
                        🏠 Home & Property
                      </div>
                      <div className="space-y-0.5">
                        {CALCULATORS.filter(c => c.category === 'property').map(calc => (
                          <button
                            key={calc.id}
                            onClick={() => handleSelectView(calc.id)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-all flex items-center justify-between cursor-pointer group ${
                              activeView === calc.id ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-bg-custom text-text-primary'
                            }`}
                          >
                            <div className="min-w-0">
                              <div className="text-xs font-semibold group-hover:text-primary transition-colors">
                                {calc.title}
                              </div>
                              <div className="text-[10px] text-text-secondary truncate leading-tight">
                                {calc.shortDescription}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Retirement */}
                    <div className="space-y-1.5 pt-2 border-t border-border-custom">
                      <div className="text-xs font-bold text-text-primary uppercase tracking-wider font-mono px-2 py-0.5 text-primary">
                        💰 Retirement
                      </div>
                      <div className="space-y-0.5">
                        {CALCULATORS.filter(c => c.category === 'retirement').map(calc => (
                          <button
                            key={calc.id}
                            onClick={() => handleSelectView(calc.id)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-all flex items-center justify-between cursor-pointer group ${
                              activeView === calc.id ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-bg-custom text-text-primary'
                            }`}
                          >
                            <div className="min-w-0">
                              <div className="text-xs font-semibold group-hover:text-primary transition-colors">
                                {calc.title}
                              </div>
                              <div className="text-[10px] text-text-secondary truncate leading-tight">
                                {calc.shortDescription}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* 3. Blog */}
            <button 
              onClick={() => navigate('/blog')}
              className={`text-sm font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                isBlogActive ? 'text-primary bg-primary/5 font-bold' : 'text-text-secondary hover:text-text-primary hover:bg-bg-custom'
              }`}
            >
              Blog
            </button>

            {/* 4. About */}
            <button 
              onClick={() => handleSelectView('about')}
              className={`text-sm font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeView === 'about' ? 'text-primary bg-primary/5 font-bold' : 'text-text-secondary hover:text-text-primary hover:bg-bg-custom'
              }`}
            >
              About
            </button>

            {/* 5. Contact */}
            <button 
              onClick={() => handleSelectView('contact')}
              className={`text-sm font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeView === 'contact' ? 'text-primary bg-primary/5 font-bold' : 'text-text-secondary hover:text-text-primary hover:bg-bg-custom'
              }`}
            >
              Contact
            </button>
          </nav>
        </div>

        {/* Search Bar & Toolbar */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Desktop Header Search Input */}
          <div className="relative hidden lg:block w-60">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-text-secondary font-semibold" />
            <input
              type="text"
              placeholder="Search calculator..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                setIsSearchFocused(true);
                if (onSearchFocus) onSearchFocus();
              }}
              onBlur={() => {
                setTimeout(() => setIsSearchFocused(false), 200);
              }}
              className="h-9 w-full rounded-xl border border-border-custom bg-bg-custom pl-9 pr-3 text-xs font-semibold text-text-primary transition-all focus:border-primary focus:bg-white focus:outline-none"
            />

            {/* Smart suggestions popover overlay */}
            {isSearchFocused && searchQuery.trim() !== '' && (
              <div className="absolute top-11 right-0 z-50 w-80 rounded-xl border border-border-custom bg-white p-2 shadow-xl animate-fade-in">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-text-secondary border-b border-border-custom mb-1 font-mono">
                  Matched Calculators ({filteredSuggestions.length})
                </div>
                {filteredSuggestions.length > 0 ? (
                  <div className="max-h-64 overflow-y-auto space-y-1">
                    {filteredSuggestions.map((calc) => (
                      <button
                        key={calc.id}
                        onMouseDown={() => handleSelectView(calc.id)}
                        className="w-full text-left p-2 rounded-lg hover:bg-bg-custom transition-colors flex items-start gap-2 group cursor-pointer"
                      >
                        <div className="h-6 w-6 bg-primary/5 rounded-md flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors text-primary mt-0.5">
                          <Calculator className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors truncate">
                            {calc.title}
                          </div>
                          <div className="text-[10px] text-text-secondary truncate leading-tight">
                            {calc.shortDescription}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 text-center text-xs text-text-secondary">
                    No matching calculators found.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Country Selector */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-xl border border-border-custom px-2.5 py-1.5 bg-white shadow-2xs">
            <Globe className="h-3.5 w-3.5 text-text-secondary" />
            <select 
              value={country} 
              onChange={(e) => {
                if (e.target.value !== 'MY') return;
                handleCountryChange(e);
              }}
              className="bg-transparent text-xs font-semibold text-text-primary focus:outline-none cursor-pointer"
              aria-label="Select Country"
            >
              <option value="MY">Malaysia (RM)</option>
              <option value="SG" disabled>Singapore (SGD) — Coming Soon</option>
              <option value="UK" disabled>Global (USD) — Coming Soon</option>
            </select>
          </div>

          {/* Dark Mode Switcher */}
          <button
            onClick={toggleDarkMode}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border-custom bg-white text-text-secondary transition-colors hover:bg-bg-custom hover:text-text-primary cursor-pointer"
            title="Toggle dark mode"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-border-custom bg-white text-text-primary hover:bg-bg-custom transition-colors cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5 text-primary" /> : <Menu className="h-5 w-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer/Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border-custom bg-white px-4 pt-3 pb-6 space-y-4 animate-fade-in shadow-xl">
          
          {/* Mobile Search Input */}
          <div className="relative">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-text-secondary font-semibold" />
            <input
              type="text"
              placeholder="Search calculator..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-xl border border-border-custom bg-bg-custom pl-9 pr-3 text-xs font-semibold text-text-primary focus:border-primary focus:bg-white focus:outline-none"
            />
          </div>

          {/* Main Mobile Navigation Links */}
          <div className="space-y-1">
            <button
              onClick={() => handleSelectView('home')}
              className={`w-full text-left px-3 py-2.5 rounded-xl font-bold text-sm transition-colors cursor-pointer flex items-center justify-between ${
                isHomeActive ? 'bg-primary text-white' : 'text-text-primary hover:bg-bg-custom'
              }`}
            >
              <span>Home</span>
            </button>

            {/* Calculators Grouped in Mobile */}
            <div className="pt-2 pb-1 space-y-3 border-t border-border-custom my-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-text-secondary px-3 font-mono">
                Calculators
              </div>

              {/* Salary & Tax */}
              <div className="space-y-1 pl-2">
                <div className="text-xs font-bold text-primary px-2 py-1 flex items-center gap-1.5">
                  <span>💼 Salary & Tax</span>
                </div>
                {CALCULATORS.filter(c => c.category === 'salary').map(calc => (
                  <button
                    key={calc.id}
                    onClick={() => handleSelectView(calc.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center justify-between ${
                      activeView === calc.id ? 'bg-primary/10 text-primary font-bold' : 'text-text-primary hover:bg-bg-custom'
                    }`}
                  >
                    <span>{calc.title}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-text-secondary" />
                  </button>
                ))}
              </div>

              {/* Home & Property */}
              <div className="space-y-1 pl-2 pt-1">
                <div className="text-xs font-bold text-primary px-2 py-1 flex items-center gap-1.5">
                  <span>🏠 Home & Property</span>
                </div>
                {CALCULATORS.filter(c => c.category === 'property').map(calc => (
                  <button
                    key={calc.id}
                    onClick={() => handleSelectView(calc.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center justify-between ${
                      activeView === calc.id ? 'bg-primary/10 text-primary font-bold' : 'text-text-primary hover:bg-bg-custom'
                    }`}
                  >
                    <span>{calc.title}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-text-secondary" />
                  </button>
                ))}
              </div>

              {/* Retirement */}
              <div className="space-y-1 pl-2 pt-1">
                <div className="text-xs font-bold text-primary px-2 py-1 flex items-center gap-1.5">
                  <span>💰 Retirement</span>
                </div>
                {CALCULATORS.filter(c => c.category === 'retirement').map(calc => (
                  <button
                    key={calc.id}
                    onClick={() => handleSelectView(calc.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center justify-between ${
                      activeView === calc.id ? 'bg-primary/10 text-primary font-bold' : 'text-text-primary hover:bg-bg-custom'
                    }`}
                  >
                    <span>{calc.title}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-text-secondary" />
                  </button>
                ))}
              </div>
            </div>

            {/* Blog Link */}
            <button
              onClick={() => handleSelectView('blog')}
              className={`w-full text-left px-3 py-2.5 rounded-xl font-bold text-sm transition-colors cursor-pointer flex items-center justify-between border-t border-border-custom pt-3 ${
                isBlogActive ? 'bg-primary text-white' : 'text-text-primary hover:bg-bg-custom'
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Blog & Guides</span>
              </div>
            </button>

            {/* About Link */}
            <button
              onClick={() => handleSelectView('about')}
              className={`w-full text-left px-3 py-2 rounded-xl font-bold text-sm transition-colors cursor-pointer flex items-center justify-between ${
                activeView === 'about' ? 'bg-primary text-white' : 'text-text-primary hover:bg-bg-custom'
              }`}
            >
              <span>About Sequenxe</span>
            </button>

            {/* Contact Link */}
            <button
              onClick={() => handleSelectView('contact')}
              className={`w-full text-left px-3 py-2 rounded-xl font-bold text-sm transition-colors cursor-pointer flex items-center justify-between ${
                activeView === 'contact' ? 'bg-primary text-white' : 'text-text-primary hover:bg-bg-custom'
              }`}
            >
              <span>Contact Us</span>
            </button>
          </div>

        </div>
      )}
    </header>
  );
}

