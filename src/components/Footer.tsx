import { useNavigate } from 'react-router-dom';
import React from 'react';
import Logo from './Logo';

export default function Footer() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-border-custom mt-20 no-print" id="app-footer">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand block */}
          <div className="md:col-span-4 space-y-4">
            <button
              onClick={() => navigate('/')}
              className="text-left cursor-pointer transition-transform hover:scale-102 inline-block"
            >
            <Logo size="md" />
            </button>

            <p className="text-xs sm:text-sm text-text-secondary max-w-sm leading-relaxed font-medium">
            Free Malaysian financial calculators for salary, PCB, income tax, EPF, SOCSO, EIS and home loans.
            </p>
          </div>

          {/* Navigation */}
<div className="md:col-span-8 grid grid-cols-2 gap-8">

{/* Navigation */}
<div className="space-y-4">
  <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary font-mono">
    Navigation
  </h3>

  <ul className="space-y-2.5 text-sm">
    <li>
      <button onClick={() => navigate('/')} className="text-text-secondary hover:text-primary transition-colors cursor-pointer">
        Calculators
      </button>
    </li>

    <li>
      <button onClick={() => navigate('/blog')} className="text-text-secondary hover:text-primary transition-colors cursor-pointer">
        Blog
      </button>
    </li>

    <li>
      <button onClick={() => navigate('/about')} className="text-text-secondary hover:text-primary transition-colors cursor-pointer">
        About
      </button>
    </li>

    <li>
      <button onClick={() => navigate('/contact')} className="text-text-secondary hover:text-primary transition-colors cursor-pointer">
        Contact
      </button>
    </li>
  </ul>
</div>

{/* Legal */}
<div className="space-y-4">
  <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary font-mono">
    Legal
  </h3>

  <ul className="space-y-2.5 text-sm">
    <li>
      <button onClick={() => navigate('/privacy-policy')} className="text-text-secondary hover:text-primary transition-colors cursor-pointer">
        Privacy Policy
      </button>
    </li>

    <li>
      <button onClick={() => navigate('/terms')} className="text-text-secondary hover:text-primary transition-colors cursor-pointer">
        Terms & Conditions
      </button>
    </li>

    <li>
      <button onClick={() => navigate('/disclaimer')} className="text-text-secondary hover:text-primary transition-colors cursor-pointer">
        Disclaimer
      </button>
    </li>
  </ul>
</div>

</div>

        </div>

        {/* Bottom Bar displaying Powered by Nusora */}
        <div className="mt-12 border-t border-border-custom pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-text-secondary">
          &copy; {currentYear} Sequenxe. All rights reserved.
        </p>
        </div>

      </div>
    </footer>
  );
}
