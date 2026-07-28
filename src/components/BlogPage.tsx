import React, { useState, useEffect } from 'react';
import { BookOpen, Search, ArrowRight, Clock, Calendar, User, Tag, ChevronRight, Settings } from 'lucide-react';
import { BlogPost } from '../data/blogPosts';
import { useCmsBlogPosts } from '../lib/cmsStore';
import SEOManager from './calculators/shared/SEOManager';
import { BlogCardSkeletonGrid } from './common/Skeletons';

interface BlogPageProps {
  onSelectArticle: (slug: string) => void;
  onSelectCalculator: (calculatorId: string) => void;
}

export default function BlogPage({ onSelectArticle, onSelectCalculator }: BlogPageProps) {
  const blogPosts = useCmsBlogPosts(false); // published posts only
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Salary & Tax', 'Home & Property', 'Savings & Retirement'];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const navigateToAdmin = () => {
    window.dispatchEvent(new CustomEvent('change-view', { detail: 'admin' }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      <SEOManager
        title="Malaysia Financial Guides & Tax Tips 2026"
        description="Comprehensive guides on Malaysian PCB tax deductions, EPF contribution rules, home loan interest rates, and personal finance optimization."
        canonicalUrl="https://sequenxe.com/blog"
      />

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#8B1A34] via-[#6D1026] to-[#4F0B1B] p-8 md:p-12 text-white shadow-xl shadow-[#6D1026]/20 border border-white/20 backdrop-blur-md">
        <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-accent backdrop-blur-md border border-white/15">
            <BookOpen className="h-4 w-4" />
            <span>Sequenxe Financial Academy</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl font-display text-balance leading-tight">
            Malaysia Personal Finance, Payroll & Tax Guides
          </h1>
          <p className="text-sm sm:text-base text-gray-100 max-w-2xl leading-relaxed">
            Practical, rules-based guides written for Malaysian taxpayers, home buyers, and workers. Master PCB deductions, EPF growth, and mortgage calculations.
          </p>

          {/* Search Bar */}
          <div className="pt-2 max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles (e.g., PCB, EPF, Tax Relief, Home Loan)..."
                className="w-full rounded-2xl bg-white py-3 pl-11 pr-4 text-sm font-medium text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Decorative Circles */}
        <div className="absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute right-32 top-0 h-40 w-40 rounded-full bg-accent/20 blur-xl" />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
              selectedCategory === cat
                ? 'bg-primary text-white border-primary shadow-md'
                : 'bg-white text-text-secondary border-border-custom hover:bg-bg-custom hover:text-text-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Blog Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            onClick={() => onSelectArticle(post.slug)}
            className="group flex flex-col justify-between rounded-2xl border border-border-custom bg-white p-6 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 cursor-pointer"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1 font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                  <Tag className="h-3 w-3" />
                  {post.category}
                </span>
                <span className="flex items-center gap-1 text-text-secondary font-mono">
                  <Clock className="h-3.5 w-3.5 text-text-secondary" />
                  {post.readTime}
                </span>
              </div>

              <h2 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors leading-snug font-display">
                {post.title}
              </h2>

              <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
            </div>

            <div className="pt-6 mt-4 border-t border-border-custom/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-text-secondary font-medium">
                <Calendar className="h-3.5 w-3.5" />
                <span>{post.publishDate}</span>
              </div>
              <span className="inline-flex items-center gap-1 font-bold text-primary group-hover:translate-x-1 transition-transform">
                <span>Read Article</span>
                <ChevronRight className="h-4 w-4" />
              </span>
            </div>
          </article>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-border-custom space-y-3">
          <BookOpen className="mx-auto h-12 w-12 text-text-secondary/40" />
          <h3 className="text-lg font-bold text-text-primary">No articles found</h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto">
            Try adjusting your search query or switching category filters.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
