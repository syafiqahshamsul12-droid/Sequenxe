import { useNavigate } from 'react-router-dom';
import React from 'react';
import { Shield } from 'lucide-react';
import Logo from './Logo';

interface FooterProps {
  setActiveView: (view: string) => void;
}

export default function Footer({ setActiveView }: FooterProps) {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-border-custom mt-20 no-print" id="app-footer">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand block (col-span-12 md:col-span-4) */}
          <div className="md:col-span-4 space-y-4">
            <button 
              onClick={() => navigate('/')}
              className="text-left cursor-pointer transition-transform hover:scale-102 inline-block"
            >
              <Logo size="md" />
            </button>
            <p className="text-xs sm:text-sm text-text-secondary max-w-sm leading-relaxed font-medium">
              Malaysia's educational financial calculator platform. Providing clear tools for income tax, net salary, EPF, home loans, and personal debts.
            </p>
            <div className="flex items-center gap-2 text-xs text-text-secondary font-mono">
              <Shield className="h-4 w-4 text-primary" />
              <span>LHDN Year 2026 Compatible</span>
            </div>
          </div>

          {/* Navigation Grid (col-span-12 md:col-span-8) */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            
            {/* 1. Products */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-text-primary tracking-wider uppercase font-mono">
                Products
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
                <li>
                  <button 
                    onClick={() => navigate('/')} 
                    className="text-text-secondary hover:text-primary transition-colors cursor-pointer text-left"
                  >
                    Calculators
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/blog')} 
                    className="text-text-secondary hover:text-primary transition-colors cursor-pointer text-left"
                  >
                    Articles
                  </button>
                </li>
              </ul>
            </div>

            {/* 2. Company */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-text-primary tracking-wider uppercase font-mono">
                Company
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
                <li>
                  <button 
                    onClick={() => navigate('/about')} 
                    className="text-text-secondary hover:text-primary transition-colors cursor-pointer text-left"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/contact')}
                    className="text-text-secondary hover:text-primary transition-colors cursor-pointer text-left"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            {/* 3. Legal */}
            <div className="space-y-4 col-span-2 sm:col-span-1">
              <h3 className="text-xs font-bold text-text-primary tracking-wider uppercase font-mono">
                Legal
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
                <li>
                  <button 
                    onClick={() => navigate('/privacy-policy')} 
                    className="text-text-secondary hover:text-primary transition-colors cursor-pointer text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/cookie-policy')} 
                    className="text-text-secondary hover:text-primary transition-colors cursor-pointer text-left"
                  >
                    Cookie Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/disclaimer')} 
                    className="text-text-secondary hover:text-primary transition-colors cursor-pointer text-left"
                  >
                    Disclaimer
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/terms')} 
                    className="text-text-secondary hover:text-primary transition-colors cursor-pointer text-left"
                  >
                    Terms & Conditions
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/admin')} 
                    className="text-text-secondary/60 hover:text-primary transition-colors cursor-pointer text-left text-xs opacity-75 hover:opacity-100"
                    title="Admin Portal"
                  >
                    Admin Login
                  </button>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom Bar displaying Powered by Nusora */}
        <div className="mt-12 border-t border-border-custom pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-secondary">
            &copy; {currentYear} Sequenxe Educational Platform. All rights reserved.
          </p>
          <div className="text-xs font-bold text-text-primary tracking-tight font-display">
            <span>Powered by Nusora</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
