import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const iconSizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl'
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Icon Badge with mathematical symbols (+ − ÷ = ∑) */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#8B1A34] via-[#6D1026] to-[#4F0B1B] text-white shadow-md shadow-[#6D1026]/25 border border-white/20 overflow-hidden shrink-0 ${iconSizes[size]}`}>
        {/* Subtle glass reflection highlight */}
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-white/20 rounded-full blur-sm pointer-events-none" />
        
        {/* Modern Fintech Math Sequence SVG Logo */}
        <svg viewBox="0 0 32 32" fill="none" className="h-5 w-5 text-white/95 drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
          {/* Stylized Summation ∑ symbol combining with equality = sequence */}
          <path d="M8 8H24L15.5 16L24 24H8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Plus symbol node */}
          <circle cx="24" cy="8" r="1.5" fill="#FDA4AF" />
          {/* Financial Sequence Line */}
          <path d="M11 16H18" stroke="#FDA4AF" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {showText && (
        <span className={`font-display font-bold tracking-tight text-text-primary ${textSizes[size]}`}>
          Sequenxe
        </span>
      )}
    </div>
  );
}
