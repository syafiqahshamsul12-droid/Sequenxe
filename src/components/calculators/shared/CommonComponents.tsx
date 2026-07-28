import React, { useState } from 'react';
import { 
  Calculator, 
  HelpCircle, 
  ArrowRight, 
  Clock, 
  Calendar, 
  ChevronRight, 
  Printer, 
  FileDown,
  Copy, 
  Download, 
  CheckCircle2, 
  BookOpen, 
  Sparkles,
  Info
} from 'lucide-react';
import { CALCULATORS, FEATURED_GUIDES } from '../../../data/calculators';

// 1. Breadcrumb Component
interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  currentName?: string;
  onHomeClick?: () => void;
  items?: BreadcrumbItem[];
}

export function Breadcrumb({ currentName, onHomeClick, items }: BreadcrumbProps) {
  if (items && items.length > 0) {
    return (
      <nav className="flex items-center gap-2 text-xs font-semibold text-text-secondary mb-5 no-print" aria-label="Breadcrumb">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-text-secondary font-mono">/</span>}
              {isLast ? (
                <span className="text-text-primary truncate" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <button
                  onClick={() => {
                    const navEvent = new CustomEvent('change-view', { detail: item.href || 'home' });
                    window.dispatchEvent(navEvent);
                  }}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-2 text-xs font-semibold text-text-secondary mb-5 no-print" aria-label="Breadcrumb">
      <button 
        onClick={onHomeClick || (() => {
          const navEvent = new CustomEvent('change-view', { detail: 'home' });
          window.dispatchEvent(navEvent);
        })}
        className="hover:text-primary transition-colors cursor-pointer"
      >
        Home
      </button>
      <span className="text-text-secondary font-mono">/</span>
      <span className="text-text-primary truncate" aria-current="page">
        {currentName || 'Calculator'}
      </span>
    </nav>
  );
}

// 2. Calculator Hero Component (Title, Simple Description, Meta)
interface CalculatorHeroProps {
  title: string;
  description: string;
  estimatedTime?: string;
  lastUpdated?: string;
  badge?: string;
  icon?: React.ComponentType<any>;
}

export function CalculatorHero({ title, description, estimatedTime = '2 mins', lastUpdated = 'July 2026', badge, icon: Icon }: CalculatorHeroProps) {
  return (
    <div className="border-b border-border-custom pb-5 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Icon className="h-5 w-5" />
            </div>
          )}
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary flex items-center gap-2">
              {title}
              {badge && (
                <span className="bg-primary/10 text-primary border border-primary/20 text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-md">
                  {badge}
                </span>
              )}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-semibold text-text-secondary bg-white border border-border-custom px-3 py-1.5 rounded-full shadow-2xs shrink-0 w-fit no-print">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-primary" />
            {estimatedTime}
          </span>
          <span className="h-3 w-px bg-border-custom" />
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            Updated {lastUpdated}
          </span>
        </div>
      </div>
      <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
        {description}
      </p>
    </div>
  );
}

// 3. Section Header Component
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
}

export function SectionHeader({ title, subtitle, badge }: SectionHeaderProps) {
  return (
    <div className="border-b border-border-custom pb-3 mb-4">
      <div className="flex items-center gap-2">
        <h2 className="font-display font-extrabold text-lg sm:text-xl text-text-primary tracking-tight">
          {title}
        </h2>
        {badge && (
          <span className="bg-primary/5 text-primary border border-primary/10 text-[9px] uppercase tracking-wider font-mono font-bold px-2 py-0.5 rounded-md">
            {badge}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// 3.5 Reusable Interactive Tooltip Component
export interface TooltipProps {
  content: string | React.ReactNode;
  iconClassName?: string;
  position?: 'top' | 'bottom';
}

export function Tooltip({ content, iconClassName, position = 'top' }: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="group relative inline-flex items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className="p-0.5 -m-0.5 rounded focus:outline-none focus:ring-1 focus:ring-primary inline-flex items-center cursor-pointer"
        aria-label="Information tooltip"
      >
        <HelpCircle className={iconClassName || "h-3.5 w-3.5 text-text-secondary hover:text-primary transition-colors"} />
      </button>

      <div 
        className={`absolute ${
          position === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2'
        } left-1/2 -translate-x-1/2 w-64 sm:w-72 bg-slate-900 border border-slate-700 text-slate-100 text-[11px] rounded-xl p-3 shadow-2xl leading-relaxed font-normal normal-case z-50 transition-all duration-200 pointer-events-auto ${
          isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {content}
        <div className={`absolute left-1/2 -translate-x-1/2 border-4 border-transparent ${
          position === 'bottom' ? 'bottom-full border-b-slate-900' : 'top-full border-t-slate-900'
        }`}></div>
      </div>
    </div>
  );
}

// 4. Summary / Result Cards Component
interface SummaryCardProps {
  label?: string;
  title?: string;
  value: string | number;
  description?: string;
  subtitle?: string;
  accent?: boolean;
  highlight?: boolean;
  success?: boolean;
  tooltip?: string;
}

export function SummaryCard({ label, title, value, description, subtitle, accent = false, highlight = false, success = false, tooltip }: SummaryCardProps) {
  const cardLabel = label || title || '';
  const cardDesc = description || subtitle;
  const isAccent = accent || highlight;

  return (
    <div 
      className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-visible z-10 hover:z-30 ${
        isAccent 
          ? 'bg-gradient-to-br from-[#8B1A34] via-[#6D1026] to-[#4F0B1B] text-white border-white/20 shadow-xl shadow-[#6D1026]/20 backdrop-blur-md' 
          : success
            ? 'bg-emerald-50/30 border-emerald-500/20 hover:border-emerald-500/40 dark:bg-emerald-950/20 dark:border-emerald-500/30'
            : 'bg-white dark:bg-card-custom border-border-custom hover:border-text-secondary/20 shadow-2xs'
      }`}
    >
      {isAccent && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-rose-300/15 rounded-full blur-2xl" />
          <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent" />
        </div>
      )}
      <div className="flex items-center gap-1.5 mb-1 relative z-20">
        <span className={`text-[11px] font-extrabold uppercase tracking-wider block ${isAccent ? 'text-rose-100/80 font-mono' : 'text-text-secondary'}`}>
          {cardLabel}
        </span>
        {tooltip && (
          <Tooltip 
            content={tooltip} 
            position="top"
            iconClassName={isAccent ? 'text-rose-200/80 hover:text-white' : 'text-text-secondary hover:text-primary'}
          />
        )}
      </div>
      <div 
        className={`font-display font-black text-xl sm:text-2xl tracking-tight truncate relative z-10 ${
          isAccent 
            ? 'text-white' 
            : success
              ? 'text-success'
              : 'text-text-primary'
        }`}
      >
        {value}
      </div>
      {cardDesc && (
        <p className={`text-[10px] mt-1.5 leading-relaxed relative z-10 ${isAccent ? 'text-rose-100/70' : 'text-text-secondary'}`}>
          {cardDesc}
        </p>
      )}
    </div>
  );
}

// 5. Export / Action Buttons Component
interface ExportButtonsProps {
  onCopyMarkdown?: () => void;
  onExportCsv?: () => void;
  onPrint?: () => void;
  title?: string;
}

export function ExportButtons({ 
  onCopyMarkdown, 
  onExportCsv, 
  onPrint,
  title = "Report" 
}: ExportButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onCopyMarkdown) {
      onCopyMarkdown();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 no-print">
      {onCopyMarkdown && (
        <button 
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-primary transition-colors border border-border-custom bg-white dark:bg-card-custom px-3 py-2 rounded-xl shadow-2xs hover:shadow-xs cursor-pointer"
          title="Copy data summary to clipboard"
        >
          <Copy className="h-4 w-4" />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      )}

      {onExportCsv && (
        <button 
          type="button"
          onClick={(e) => { e.preventDefault(); onExportCsv(); }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-primary transition-colors border border-border-custom bg-white dark:bg-card-custom px-3 py-2 rounded-xl shadow-2xs hover:shadow-xs cursor-pointer"
          title="Download schedule log as CSV file"
        >
          <Download className="h-4 w-4" />
          CSV
        </button>
      )}

      {onPrint && (
        <button 
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-primary transition-colors border border-border-custom bg-white dark:bg-card-custom px-3 py-2 rounded-xl shadow-2xs hover:shadow-xs cursor-pointer"
          title="Print calculation report"
        >
          <Printer className="h-4 w-4" />
          Print
        </button>
      )}
    </div>
  );
}

// 6. Smart Rule-Based Insights Component (Maximum 5 recommendations)
interface InsightItem {
  type: 'info' | 'warning' | 'success';
  title: string;
  text: string | React.ReactNode;
}

interface InsightCardsProps {
  insights: InsightItem[];
}

export function InsightCards({ insights }: InsightCardsProps) {
  return (
    <div className="bg-gradient-to-br from-primary/5 via-white to-primary/5 border border-primary/20 rounded-2xl p-6 sm:p-8 mt-4 shadow-2xs">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm shadow-primary/10">
          <Sparkles className="h-4.5 w-4.5" />
        </div>
        <div>
          <h3 className="font-display font-extrabold text-sm sm:text-base text-text-primary">
            Deterministic Statutory Insights & Optimization
          </h3>
          <p className="text-[10px] sm:text-xs text-text-secondary">
            Actionable financial checks compiled in accordance with standard Malaysian regulations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.slice(0, 5).map((insight, idx) => (
          <div 
            key={idx} 
            className={`p-4 border rounded-xl space-y-2 bg-white transition-all duration-300 hover:shadow-2xs ${
              insight.type === 'warning' 
                ? 'border-amber-200/80 hover:border-amber-400/40' 
                : insight.type === 'success'
                  ? 'border-emerald-200/80 hover:border-emerald-400/40'
                  : 'border-border-custom hover:border-primary/25'
            }`}
          >
            <div className="flex items-center gap-2">
              <span 
                className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                  insight.type === 'warning'
                    ? 'text-amber-700 bg-amber-50/50 border-amber-200'
                    : insight.type === 'success'
                      ? 'text-emerald-700 bg-emerald-50/50 border-emerald-200'
                      : 'text-primary bg-primary/5 border-primary/10'
                }`}
              >
                {insight.type === 'warning' ? 'Warning' : insight.type === 'success' ? 'Optimization' : 'Advice'}
              </span>
            </div>
            <h4 className="font-display font-bold text-xs sm:text-sm text-text-primary">
              {insight.title}
            </h4>
            <div className="text-[11px] sm:text-xs text-text-secondary leading-relaxed">
              {insight.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 7. Formula Explanation Accordion Component
interface FormulaExplanationProps {
  what: string | React.ReactNode;
  formula: string | React.ReactNode;
  why: string | React.ReactNode;
}

export function FormulaExplanation({ what, formula, why }: FormulaExplanationProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white border border-border-custom rounded-2xl overflow-hidden shadow-2xs transition-all duration-200">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full p-5 sm:p-6 flex items-center justify-between text-left cursor-pointer hover:bg-bg-custom/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Info className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-base sm:text-lg text-text-primary tracking-tight">
              How is this calculated?
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              {isOpen ? 'Click to collapse calculation details' : 'Click to view calculation breakdown, formulas, and methodology'}
            </p>
          </div>
        </div>
        <ChevronRight className={`h-5 w-5 text-text-secondary transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-90 text-primary' : ''}`} />
      </button>

      <div className={isOpen ? 'p-6 sm:p-8 pt-0 border-t border-border-custom block' : 'hidden'}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="space-y-2">
            <h4 className="font-display font-bold text-sm text-text-primary flex items-center gap-1.5 border-b border-border-custom pb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              What is being calculated?
            </h4>
            <div className="text-xs text-text-secondary leading-relaxed">
              {what}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-display font-bold text-sm text-text-primary flex items-center gap-1.5 border-b border-border-custom pb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Which formula is used?
            </h4>
            <div className="text-xs text-text-secondary leading-relaxed">
              {formula}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-display font-bold text-sm text-text-primary flex items-center gap-1.5 border-b border-border-custom pb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Why the results matter?
            </h4>
            <div className="text-xs text-text-secondary leading-relaxed">
              {why}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 8. Collapsible Information Box Component
interface CollapsibleBoxProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function CollapsibleBox({ 
  title, 
  subtitle, 
  icon, 
  badge, 
  defaultOpen = false, 
  children,
  className = "" 
}: CollapsibleBoxProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`bg-white border border-border-custom rounded-2xl overflow-hidden shadow-2xs transition-all duration-200 ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full p-5 sm:p-6 flex items-center justify-between text-left cursor-pointer hover:bg-bg-custom/40 transition-colors group"
      >
        <div className="flex items-center gap-3 pr-2">
          {icon && (
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
              {icon}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display font-bold text-sm sm:text-base text-text-primary tracking-wide uppercase">
                {title}
              </h3>
              {badge && (
                <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full font-mono shrink-0">
                  {badge}
                </span>
              )}
            </div>
            {subtitle ? (
              <p className="text-xs text-text-secondary mt-0.5">
                {subtitle}
              </p>
            ) : (
              <p className="text-[11px] text-text-secondary mt-0.5">
                {isOpen ? 'Click to hide details' : 'Click dropdown arrow to expand details'}
              </p>
            )}
          </div>
        </div>
        <div className="h-8 w-8 rounded-full bg-bg-custom group-hover:bg-primary/10 flex items-center justify-center shrink-0 transition-colors">
          <ChevronRight className={`h-4 w-4 text-text-secondary transition-transform duration-300 ${isOpen ? 'rotate-90 text-primary' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="p-5 sm:p-6 pt-0 border-t border-border-custom/80 animate-fade-in">
          <div className="pt-4 space-y-3">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

// 9. FAQ Section with Schema integration
interface FaqItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FaqItem[];
}

export function FAQSection({ faqs }: FAQSectionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  // Generate FAQ Schema JSON-LD for SEO friendliness
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="space-y-4">
      {/* FAQ Schema Injector */}
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} 
      />

      <div className="space-y-3 max-w-4xl">
        {faqs.map((faq, index) => {
          const isOpen = openIdx === index;
          return (
            <div 
              key={index} 
              className="bg-white border border-border-custom rounded-xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : index)}
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
    </div>
  );
}

// 9. Related Tools Component (Recommends 4-8 tools as premium cards)
interface RelatedToolsProps {
  currentId: string;
  onSelectTool: (id: string) => void;
}

export function RelatedTools({ currentId, onSelectTool }: RelatedToolsProps) {
  // Exclude current calculator and list the rest
  const tools = CALCULATORS.filter(t => t.id !== currentId);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 no-print">
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => onSelectTool(tool.id)}
          className="bg-white border border-border-custom rounded-2xl p-5 shadow-2xs hover:shadow-md hover:border-primary/40 text-left transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between h-full group cursor-pointer"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-9 w-9 rounded-xl bg-primary/5 text-primary flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-white">
                <Calculator className="h-4.5 w-4.5" />
              </div>
              <span className="text-[10px] font-mono font-medium text-text-secondary bg-bg-custom px-2 py-0.5 rounded-md border border-border-custom">
                {tool.estimatedTime}
              </span>
            </div>
            <h4 className="font-display font-bold text-sm text-text-primary group-hover:text-primary transition-colors">
              {tool.title}
            </h4>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              {tool.shortDescription}
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-primary mt-4 group-hover:translate-x-1 transition-transform">
            <span>Launch Tool</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </button>
      ))}
    </div>
  );
}

// 10. Related Guides Component
export function RelatedGuides() {
  const handleOpenGuide = (slug: string) => {
    window.dispatchEvent(new CustomEvent('change-view', { detail: `blog-${slug}` }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 no-print">
      {FEATURED_GUIDES.map((guide, idx) => (
        <div 
          key={idx}
          onClick={() => handleOpenGuide(guide.slug)}
          className="bg-white border border-border-custom rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all duration-300 hover:border-primary/30 flex flex-col justify-between cursor-pointer group"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary bg-primary/5 px-2.5 py-0.5 rounded-full border border-primary/10">
                {guide.category}
              </span>
              <span className="text-[10px] font-mono text-text-secondary">
                {guide.readTime}
              </span>
            </div>
            <h4 className="font-display font-extrabold text-sm text-text-primary group-hover:text-primary transition-colors">
              {guide.title}
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
              {guide.excerpt}
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary mt-4 group-hover:translate-x-1 transition-transform">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Read Educational Guide</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// 11. Calculator Disclaimer Component
export function Disclaimer() {
  return (
    <div className="bg-white/80 border border-border-custom rounded-xl p-4 text-xs text-text-secondary leading-relaxed my-4 shadow-2xs backdrop-blur-sm no-print">
      <p>
        <strong className="font-semibold text-text-primary">Disclaimer:</strong> This calculator is offered for informational and reference purposes only. Calculations are not meant to supplant or serve as a substitute for professional guidance or official calculations provided by relevant authorities.
      </p>
    </div>
  );
}


