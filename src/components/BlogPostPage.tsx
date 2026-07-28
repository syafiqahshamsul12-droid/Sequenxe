import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { 
  ArrowLeft, Clock, Calendar, User, Tag, Calculator, 
  CheckCircle2, Share2, BookOpen, ExternalLink, HelpCircle, 
  ChevronDown, ChevronUp, ChevronRight, ShieldCheck, Check
} from 'lucide-react';
import { BlogPost } from '../data/blogPosts';
import { CALCULATORS } from '../data/calculators';
import { useCmsBlogPosts } from '../lib/cmsStore';
import SEOManager from './calculators/shared/SEOManager';
import MarkdownContent from './shared/MarkdownContent';

interface BlogPostPageProps {
  slug: string;
  onBackToBlog: () => void;
  onSelectCalculator: (calculatorId: string) => void;
}

export default function BlogPostPage({ slug, onBackToBlog, onSelectCalculator }: BlogPostPageProps) {
  const navigate = useNavigate();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const allPosts = useCmsBlogPosts(true); // include published & preview drafts
  const post = allPosts.find(p => p.slug === slug) || allPosts[0];

  // Find related calculators
  const relatedCalcs = CALCULATORS.filter(c => post.relatedCalculatorIds?.includes(c.id));

  // Find related articles
  const relatedArticles = allPosts.filter(p => post.relatedArticleSlugs?.includes(p.slug));

  const handleShareArticle = async () => {
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://sequenxe.com';
    const fullArticleUrl = `${origin}/blog/${post.slug}`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: post.seoTitle || post.title,
          text: post.seoDescription || post.excerpt,
          url: fullArticleUrl,
        });
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
      }
    }

    // Clipboard fallback
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fullArticleUrl);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = fullArticleUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {
      console.error('Clipboard copy error:', err);
    }
  };

  const handleNavigateArticle = (targetSlug: string) => {
    window.dispatchEvent(new CustomEvent('change-view', { detail: `blog-${targetSlug}` }));
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      <SEOManager
        title={post.seoTitle || post.title}
        description={post.seoDescription || post.excerpt}
        canonicalUrl={`https://sequenxe.com/blog/${post.slug}`}
        breadcrumbs={[
          { name: 'Home', url: 'https://sequenxe.com/' },
          { name: 'Blog', url: 'https://sequenxe.com/blog' },
          { name: post.title, url: `https://sequenxe.com/blog/${post.slug}` }
        ]}
      />

      {/* Back Button & Admin Badge */}
      <div className="flex items-center justify-between no-print">
        <button
          onClick={onBackToBlog}
          className="inline-flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Articles</span>
        </button>

        {post.status === 'draft' && (
          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-extrabold text-[10px] rounded-lg uppercase tracking-wider">
            Draft Preview Mode
          </span>
        )}
      </div>

      {/* Article Header */}
      <div className="space-y-4 border-b border-border-custom pb-6">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1 font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
            <Tag className="h-3 w-3" />
            {post.category}
          </span>
          <span className="flex items-center gap-1 text-text-secondary font-mono">
            <Clock className="h-3.5 w-3.5" />
            {post.readTime}
          </span>
          <span className="flex items-center gap-1 text-text-secondary">
            <Calendar className="h-3.5 w-3.5" />
            {post.publishDate}
          </span>
          <span className="flex items-center gap-1 text-text-secondary">
            <User className="h-3.5 w-3.5" />
            {post.author}
          </span>
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl lg:text-4xl font-display leading-tight">
          {post.title}
        </h1>

        <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-medium">
          {post.excerpt}
        </p>

        <div className="flex items-center gap-2 pt-2 no-print">
          <button
            onClick={handleShareArticle}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border border-border-custom bg-white hover:bg-bg-custom text-text-primary transition-colors cursor-pointer shadow-2xs"
          >
            {copiedLink ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-600 font-bold">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4 text-primary" />
                <span>Share Article</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Key Takeaways Box */}
      {post.keyTakeaways && post.keyTakeaways.length > 0 && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 space-y-3">
          <div className="flex items-center gap-2 text-primary font-bold text-sm font-display">
            <CheckCircle2 className="h-5 w-5" />
            <span>Key Takeaways at a Glance</span>
          </div>
          <ul className="space-y-2">
            {post.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-text-primary font-medium leading-relaxed">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Interactive Related Calculators Banner (Hidden on Print) */}
      {relatedCalcs.length > 0 && (
        <div className="space-y-3 no-print">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary font-mono">
            Interactive Tools for This Topic
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedCalcs.map((calc) => (
              <div 
                key={calc.id}
                className="rounded-2xl border border-accent-gold/40 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-4 flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary p-2.5 text-white shrink-0 shadow-sm">
                    <Calculator className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-text-primary font-display">
                      {calc.title}
                    </h4>
                    <p className="text-[11px] text-text-secondary line-clamp-1">
                      {calc.shortDescription}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/${calc.id}`)}
                  className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-primary-dark transition-all cursor-pointer whitespace-nowrap"
                >
                  Calculate →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Article Body */}
      <article className="prose prose-sm max-w-none text-text-primary leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-border-custom shadow-2xs">
        <MarkdownContent content={post.content} />
      </article>

      {/* Official Sources Citation Section */}
      {post.officialSources && post.officialSources.length > 0 && (
        <div className="rounded-2xl border border-border-custom bg-bg-custom/50 p-6 space-y-4">
          <div className="flex items-center gap-2 text-text-primary font-bold text-sm font-display">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <span>Official Regulatory Sources & References</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {post.officialSources.map((source, idx) => (
              <a
                key={idx}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col justify-between p-3.5 rounded-xl bg-white border border-border-custom hover:border-primary/40 hover:shadow-xs transition-all group"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-primary group-hover:text-primary-dark">
                    <span>{source.name}</span>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                  </div>
                  <p className="text-[11px] text-text-secondary leading-relaxed">
                    {source.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* FAQ Accordion Section */}
      {post.faqs && post.faqs.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-border-custom">
          <div className="flex items-center gap-2 text-text-primary font-bold text-lg font-display">
            <HelpCircle className="h-5 w-5 text-primary" />
            <span>Frequently Asked Questions</span>
          </div>

          <div className="space-y-3">
            {post.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-xl border border-border-custom bg-white overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-text-primary hover:bg-bg-custom/40 transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp className="h-4 w-4 text-primary shrink-0" /> : <ChevronDown className="h-4 w-4 text-text-secondary shrink-0" />}
                  </button>
                  <div className={`px-4 pb-4 text-xs text-text-secondary leading-relaxed border-t border-border-custom/40 pt-3 bg-bg-custom/20 ${isOpen ? 'block' : 'hidden faq-answer-print'}`}>
                    {faq.answer}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Internal Articles Linking (Hidden on Print) */}
      {relatedArticles.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-border-custom no-print">
          <h3 className="text-base font-bold text-text-primary font-display">
            Recommended Next Articles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedArticles.map((relArt) => (
              <div
                key={relArt.id}
                onClick={() => handleNavigateArticle(relArt.slug)}
                className="group p-5 rounded-2xl border border-border-custom bg-white hover:border-primary/40 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-md">
                    {relArt.category}
                  </span>
                  <h4 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors font-display leading-snug">
                    {relArt.title}
                  </h4>
                  <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                    {relArt.excerpt}
                  </p>
                </div>
                <div className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform pt-2">
                  <span>Read Guide</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer CTA (Hidden on Print) */}
      <div className="rounded-2xl border border-border-custom bg-bg-custom p-6 text-center space-y-3 no-print">
        <BookOpen className="mx-auto h-8 w-8 text-primary" />
        <h3 className="text-sm font-bold text-text-primary font-display">Need precise financial numbers?</h3>
        <p className="text-xs text-text-secondary max-w-md mx-auto">
          Calculate your exact statutory salary deductions, EPF compounding projections, or home mortgage affordability in seconds.
        </p>
        <button
          onClick={onBackToBlog}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Explore All Articles</span>
        </button>
      </div>
    </div>
  );
}
