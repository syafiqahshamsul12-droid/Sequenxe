import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  CheckCircle, 
  Clock, 
  Download, 
  Upload, 
  RotateCcw, 
  Lock, 
  Search, 
  X, 
  ArrowLeft, 
  Sparkles, 
  BookOpen, 
  Save, 
  ExternalLink,
  ShieldCheck,
  Tag,
  HelpCircle,
  Link as LinkIcon,
  Layers,
  FileCode,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { BlogPost, BlogPostFAQ, OfficialSource } from '../data/blogPosts';
import { CALCULATORS } from '../data/calculators';
import { 
  useCmsBlogPosts, 
  saveCmsBlogPost, 
  deleteCmsBlogPost, 
  resetCmsPostsToDefault, 
  exportCmsPostsToJson, 
  importCmsPostsFromJson 
} from '../lib/cmsStore';
import { 
  loginAdminServer, 
  logoutAdminServer, 
  getStoredAdminUser, 
  verifyAdminSession 
} from '../lib/adminAuth';
import MarkdownContent from './shared/MarkdownContent';

interface CmsAdminPageProps {
  onNavigateBlog: (slug?: string) => void;
}

export default function CmsAdminPage({ onNavigateBlog }: CmsAdminPageProps) {
  // Passcode & Backend Server Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!getStoredAdminUser();
  });
  const [email, setEmail] = useState('');
  const [passcode, setPasscode] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  useEffect(() => {
    verifyAdminSession().then((isValid) => {
      setIsAuthenticated(isValid);
    });
  }, []);

  // CMS List & Filter State
  const allPosts = useCmsBlogPosts(true); // include drafts
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Active Editor State
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState<'content' | 'seo' | 'relations' | 'faqs'>('content');
  const [contentPreviewMode, setContentPreviewMode] = useState(false);

  // Backup / Import Modal
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [jsonMessage, setJsonMessage] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setAuthError('Please enter admin passcode.');
      return;
    }
    setIsAuthLoading(true);
    setAuthError('');

    const res = await loginAdminServer(email, passcode, mfaCode);
    setIsAuthLoading(false);

    if (res.success) {
      setIsAuthenticated(true);
      setPasscode('');
      setMfaCode('');
      setAuthError('');
      showToast('Admin session unlocked securely!');
    } else {
      setAuthError(res.error || 'Authentication failed.');
    }
  };

  const handleLogout = async () => {
    await logoutAdminServer();
    setIsAuthenticated(false);
    showToast('Admin session ended.');
  };

  // Filter posts
  const filteredPosts = allPosts.filter(post => {
    const postStatus = post.status || 'published';
    const matchesStatus = statusFilter === 'all' || postStatus === statusFilter;
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const handleCreateNew = () => {
    const newSlug = `new-article-${Date.now().toString().slice(-4)}`;
    const newPost: BlogPost = {
      id: `post-${Date.now()}`,
      slug: newSlug,
      title: 'Untitled Article Title',
      category: 'Salary & Tax',
      readTime: '5 mins read',
      publishDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      author: 'Sequenxe Research Team',
      excerpt: 'Provide a concise 1-2 sentence executive summary of this article.',
      keyTakeaways: ['Key takeaway point 1', 'Key takeaway point 2'],
      content: '### Introduction\n\nWrite your article content here using standard Markdown formatting.\n\n### Key Highlights\n\n* Highlight 1\n* Highlight 2\n',
      relatedCalculatorIds: ['pcb-calculator', 'salary-calculator'],
      relatedArticleSlugs: [],
      officialSources: [
        { name: 'LHDN Malaysia Official Portal', url: 'https://www.hasil.gov.my', description: 'Inland Revenue Board of Malaysia' }
      ],
      faqs: [
        { question: 'Frequently Asked Question 1?', answer: 'Answer to FAQ 1.' }
      ],
      status: 'draft',
      seoTitle: 'SEO Optimized Title | Sequenxe',
      seoDescription: 'Meta description for search engines.',
      keywords: ['malaysia tax', 'salary calculator']
    };
    setEditingPost(newPost);
    setIsCreatingNew(true);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost({ ...post });
    setIsCreatingNew(false);
  };

  const handleSavePost = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingPost) return;

    if (!editingPost.title.trim() || !editingPost.slug.trim()) {
      showToast('Error: Title and Slug are required!');
      return;
    }

    saveCmsBlogPost(editingPost);
    showToast(`Article "${editingPost.title}" saved successfully!`);
    setEditingPost(null);
    setIsCreatingNew(false);
  };

  const handleToggleStatus = (post: BlogPost) => {
    const newStatus = (post.status || 'published') === 'published' ? 'draft' : 'published';
    const updated = { ...post, status: newStatus as 'draft' | 'published' };
    saveCmsBlogPost(updated);
    showToast(`Article status updated to ${newStatus.toUpperCase()}`);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteCmsBlogPost(id);
      showToast(`Deleted article: ${title}`);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all CMS articles back to default initial articles? Any custom created articles will be replaced.')) {
      resetCmsPostsToDefault();
      showToast('Restored initial default articles!');
    }
  };

  const handleExportJson = () => {
    const jsonStr = exportCmsPostsToJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sequence_cms_articles_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    showToast('Exported articles JSON backup!');
  };

  const handleImportJson = () => {
    if (!jsonInput.trim()) return;
    const success = importCmsPostsFromJson(jsonInput);
    if (success) {
      setJsonMessage('Articles imported successfully!');
      setTimeout(() => {
        setShowJsonModal(false);
        setJsonInput('');
        setJsonMessage('');
        showToast('CMS database updated from imported JSON!');
      }, 1200);
    } else {
      setJsonMessage('Error: Invalid JSON format!');
    }
  };

  // Helper for slug generation
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 animate-fade-in">
        <div className="max-w-md w-full bg-white rounded-3xl border border-border-custom p-8 shadow-xl text-center space-y-6">
          <div className="h-16 w-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto">
            <Lock className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black font-display text-text-primary">Sequenxe Admin Portal</h2>
            <p className="text-xs text-text-secondary mt-1">
              Backend-Verified CMS. Credentials are encrypted and verified server-side.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                Admin Email
              </label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter admin email"
                className="w-full px-4 py-3 border border-border-custom rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                Admin Passcode
              </label>
              <input 
                type="password" 
                value={passcode} 
                onChange={(e) => setPasscode(e.target.value)} 
                placeholder="Enter passcode"
                className="w-full px-4 py-3 border border-border-custom rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                MFA Code <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input 
                type="text" 
                value={mfaCode} 
                onChange={(e) => setMfaCode(e.target.value)} 
                placeholder="Enter MFA code if enabled"
                className="w-full px-4 py-3 border border-border-custom rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            {authError && (
              <div className="text-xs font-bold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <button 
              type="submit"
              disabled={isAuthLoading}
              className="w-full py-3 px-4 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary-dark transition-all cursor-pointer shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isAuthLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verifying Server-Side...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  <span>Unlock Admin Portal</span>
                </>
              )}
            </button>
          </form>

          <p className="text-[11px] text-text-secondary">
            Protected by backend rate-limiting &amp; session tokens. Passcode is never stored in browser bundles.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold border border-slate-700 animate-slide-up">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Navigation Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-extrabold text-amber-400 uppercase tracking-widest">
            <BookOpen className="h-4 w-4" />
            <span>Headless Content Management System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display">Sequenxe Article Manager</h1>
          <p className="text-xs text-slate-300">
            {allPosts.length} Total Articles ({allPosts.filter(p => (p.status || 'published') === 'published').length} Published, {allPosts.filter(p => p.status === 'draft').length} Drafts)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button 
            onClick={() => onNavigateBlog()}
            className="flex-1 md:flex-none px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
          >
            <Eye className="h-4 w-4 text-slate-400" />
            <span>View Public Blog</span>
          </button>
          <button 
            onClick={handleExportJson}
            className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
            title="Backup articles to JSON file"
          >
            <Download className="h-4 w-4 text-emerald-400" />
            <span>Export</span>
          </button>
          <button 
            onClick={() => setShowJsonModal(true)}
            className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
            title="Import articles from JSON file"
          >
            <Upload className="h-4 w-4 text-sky-400" />
            <span>Import</span>
          </button>
          <button 
            onClick={handleLogout}
            className="px-3 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-rose-500/30 transition-all cursor-pointer"
          >
            <Lock className="h-4 w-4" />
            <span>Lock</span>
          </button>
        </div>
      </div>

      {/* Editor View OR List View */}
      {editingPost ? (
        <div className="bg-white rounded-3xl border border-border-custom p-6 sm:p-8 shadow-sm space-y-6">
          {/* Editor Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-custom">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setEditingPost(null)}
                className="p-2 rounded-xl bg-bg-custom text-text-secondary hover:text-text-primary hover:bg-slate-200 transition-all cursor-pointer"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-text-secondary block">
                  {isCreatingNew ? 'Create New Article' : 'Editing Article'}
                </span>
                <h2 className="text-xl font-black font-display text-text-primary truncate max-w-xl">
                  {editingPost.title || 'Untitled Article'}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  const updated = { ...editingPost, status: 'draft' as const };
                  setEditingPost(updated);
                  saveCmsBlogPost(updated);
                  showToast('Saved as Draft!');
                  setEditingPost(null);
                }}
                className="px-4 py-2.5 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Clock className="h-4 w-4" />
                <span>Save Draft</span>
              </button>

              <button 
                onClick={() => {
                  const updated = { ...editingPost, status: 'published' as const };
                  setEditingPost(updated);
                  saveCmsBlogPost(updated);
                  showToast('Published Article!');
                  setEditingPost(null);
                }}
                className="px-5 py-2.5 bg-primary text-white hover:bg-primary-dark rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-primary/20"
              >
                <Save className="h-4 w-4" />
                <span>Save & Publish</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs for Editor */}
          <div className="flex border-b border-border-custom overflow-x-auto gap-2 scrollbar-none">
            <button 
              onClick={() => setActiveEditorTab('content')}
              className={`pb-3 px-4 text-xs font-extrabold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeEditorTab === 'content'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Article & Content</span>
            </button>
            <button 
              onClick={() => setActiveEditorTab('seo')}
              className={`pb-3 px-4 text-xs font-extrabold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeEditorTab === 'seo'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              <Tag className="h-4 w-4" />
              <span>SEO & Meta Fields</span>
            </button>
            <button 
              onClick={() => setActiveEditorTab('relations')}
              className={`pb-3 px-4 text-xs font-extrabold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeEditorTab === 'relations'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              <LinkIcon className="h-4 w-4" />
              <span>Related Calculators & Articles</span>
            </button>
            <button 
              onClick={() => setActiveEditorTab('faqs')}
              className={`pb-3 px-4 text-xs font-extrabold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeEditorTab === 'faqs'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              <HelpCircle className="h-4 w-4" />
              <span>FAQs & Official Sources</span>
            </button>
          </div>

          {/* TAB 1: Content & Basic Fields */}
          {activeEditorTab === 'content' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">Article Title *</label>
                  <input 
                    type="text" 
                    value={editingPost.title} 
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      setEditingPost(prev => prev ? {
                        ...prev, 
                        title: newTitle,
                        slug: prev.slug || generateSlug(newTitle)
                      } : null);
                    }} 
                    className="w-full px-3.5 py-2.5 border border-border-custom rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1 flex items-center justify-between">
                    <span>URL Slug *</span>
                    <button 
                      type="button" 
                      onClick={() => setEditingPost(prev => prev ? { ...prev, slug: generateSlug(prev.title) } : null)}
                      className="text-[10px] text-primary hover:underline"
                    >
                      Auto-generate
                    </button>
                  </label>
                  <input 
                    type="text" 
                    value={editingPost.slug} 
                    onChange={(e) => setEditingPost(prev => prev ? { ...prev, slug: e.target.value } : null)} 
                    className="w-full px-3.5 py-2.5 border border-border-custom rounded-xl text-sm font-mono font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">Category</label>
                  <select 
                    value={editingPost.category} 
                    onChange={(e) => setEditingPost(prev => prev ? { ...prev, category: e.target.value as any } : null)}
                    className="w-full px-3.5 py-2.5 border border-border-custom rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    <option value="Salary & Tax">Salary & Tax</option>
                    <option value="Savings & Retirement">Savings & Retirement</option>
                    <option value="Home & Property">Home & Property</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">Author Name</label>
                  <input 
                    type="text" 
                    value={editingPost.author} 
                    onChange={(e) => setEditingPost(prev => prev ? { ...prev, author: e.target.value } : null)} 
                    className="w-full px-3.5 py-2.5 border border-border-custom rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">Estimated Read Time</label>
                  <input 
                    type="text" 
                    value={editingPost.readTime} 
                    onChange={(e) => setEditingPost(prev => prev ? { ...prev, readTime: e.target.value } : null)} 
                    placeholder="e.g. 6 mins read"
                    className="w-full px-3.5 py-2.5 border border-border-custom rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">Publish Date String</label>
                  <input 
                    type="text" 
                    value={editingPost.publishDate} 
                    onChange={(e) => setEditingPost(prev => prev ? { ...prev, publishDate: e.target.value } : null)} 
                    placeholder="e.g. 15 Jul 2026"
                    className="w-full px-3.5 py-2.5 border border-border-custom rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">Excerpt / Short Summary</label>
                <textarea 
                  value={editingPost.excerpt} 
                  onChange={(e) => setEditingPost(prev => prev ? { ...prev, excerpt: e.target.value } : null)}
                  rows={2}
                  className="w-full px-3.5 py-2.5 border border-border-custom rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              {/* Key Takeaways List Editor */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Key Takeaways Banner Points</span>
                  <button 
                    type="button" 
                    onClick={() => setEditingPost(prev => prev ? { ...prev, keyTakeaways: [...prev.keyTakeaways, 'New takeaway point'] } : null)}
                    className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-bold text-primary flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Point</span>
                  </button>
                </div>
                {editingPost.keyTakeaways.map((point, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={point} 
                      onChange={(e) => {
                        const updated = [...editingPost.keyTakeaways];
                        updated[idx] = e.target.value;
                        setEditingPost(prev => prev ? { ...prev, keyTakeaways: updated } : null);
                      }}
                      className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                    <button 
                      type="button" 
                      onClick={() => {
                        const updated = editingPost.keyTakeaways.filter((_, i) => i !== idx);
                        setEditingPost(prev => prev ? { ...prev, keyTakeaways: updated } : null);
                      }}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Main Markdown Content Editor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                    Article Body Content (Markdown Format)
                  </label>
                  <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                    <button 
                      type="button" 
                      onClick={() => setContentPreviewMode(false)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                        !contentPreviewMode ? 'bg-white text-primary shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Editor
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setContentPreviewMode(true)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                        contentPreviewMode ? 'bg-white text-primary shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Live Preview
                    </button>
                  </div>
                </div>

                {contentPreviewMode ? (
                  <div className="p-6 border border-border-custom rounded-2xl bg-white min-h-[350px]">
                    <MarkdownContent content={editingPost.content} />
                  </div>
                ) : (
                  <textarea 
                    value={editingPost.content} 
                    onChange={(e) => setEditingPost(prev => prev ? { ...prev, content: e.target.value } : null)}
                    rows={16}
                    className="w-full p-4 border border-border-custom rounded-2xl font-mono text-xs text-text-primary focus:ring-2 focus:ring-primary focus:outline-none leading-relaxed"
                  />
                )}
              </div>
            </div>
          )}

          {/* TAB 2: SEO Settings */}
          {activeEditorTab === 'seo' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">
                    SEO Meta Title
                  </label>
                  <input 
                    type="text" 
                    value={editingPost.seoTitle || editingPost.title} 
                    onChange={(e) => setEditingPost(prev => prev ? { ...prev, seoTitle: e.target.value } : null)}
                    placeholder="e.g. PCB Calculator Malaysia 2026 | Comprehensive MTD Guide"
                    className="w-full px-3.5 py-2.5 border border-border-custom rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                  <p className="text-[11px] text-text-secondary mt-1">
                    Recommended length: 50-60 characters. Appears as search result title in Google.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">
                    SEO Meta Description
                  </label>
                  <textarea 
                    value={editingPost.seoDescription || editingPost.excerpt} 
                    onChange={(e) => setEditingPost(prev => prev ? { ...prev, seoDescription: e.target.value } : null)}
                    rows={3}
                    placeholder="Provide a compelling 150-160 character meta description for search engine snippets."
                    className="w-full px-3.5 py-2.5 border border-border-custom rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">
                    Target SEO Keywords (Comma Separated)
                  </label>
                  <input 
                    type="text" 
                    value={(editingPost.keywords || []).join(', ')} 
                    onChange={(e) => {
                      const kwList = e.target.value.split(',').map(k => k.trim()).filter(Boolean);
                      setEditingPost(prev => prev ? { ...prev, keywords: kwList } : null);
                    }}
                    placeholder="pcb calculator 2026, pcb calculator, income tax malaysia, salary calculator"
                    className="w-full px-3.5 py-2.5 border border-border-custom rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {(editingPost.keywords || []).map((kw, i) => (
                      <span key={i} className="px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-xs font-bold border border-primary/20">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">
                    Optional Cover Image URL
                  </label>
                  <input 
                    type="text" 
                    value={editingPost.coverImage || ''} 
                    onChange={(e) => setEditingPost(prev => prev ? { ...prev, coverImage: e.target.value } : null)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3.5 py-2.5 border border-border-custom rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Relations */}
          {activeEditorTab === 'relations' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-extrabold text-text-primary mb-3 uppercase tracking-wider">
                  Link Related Interactive Calculators
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {CALCULATORS.map((calc) => {
                    const isChecked = editingPost.relatedCalculatorIds?.includes(calc.id);
                    return (
                      <label 
                        key={calc.id} 
                        className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                          isChecked ? 'bg-primary/5 border-primary text-primary font-bold' : 'bg-white border-border-custom hover:bg-slate-50'
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={(e) => {
                            const current = editingPost.relatedCalculatorIds || [];
                            const updated = e.target.checked
                              ? [...current, calc.id]
                              : current.filter(id => id !== calc.id);
                            setEditingPost(prev => prev ? { ...prev, relatedCalculatorIds: updated } : null);
                          }}
                          className="h-4 w-4 rounded text-primary focus:ring-primary"
                        />
                        <span className="text-xs font-semibold text-text-primary">{calc.title}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-border-custom">
                <h3 className="text-sm font-extrabold text-text-primary mb-3 uppercase tracking-wider">
                  Link Related Articles
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {allPosts.filter(p => p.id !== editingPost.id).map((otherPost) => {
                    const isChecked = editingPost.relatedArticleSlugs?.includes(otherPost.slug);
                    return (
                      <label 
                        key={otherPost.id} 
                        className={`p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                          isChecked ? 'bg-primary/5 border-primary font-bold' : 'bg-white border-border-custom hover:bg-slate-50'
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={(e) => {
                            const current = editingPost.relatedArticleSlugs || [];
                            const updated = e.target.checked
                              ? [...current, otherPost.slug]
                              : current.filter(s => s !== otherPost.slug);
                            setEditingPost(prev => prev ? { ...prev, relatedArticleSlugs: updated } : null);
                          }}
                          className="h-4 w-4 rounded text-primary focus:ring-primary mt-0.5"
                        />
                        <div>
                          <span className="text-xs font-bold text-text-primary block">{otherPost.title}</span>
                          <span className="text-[10px] text-text-secondary block">{otherPost.category}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FAQs & Official Sources */}
          {activeEditorTab === 'faqs' && (
            <div className="space-y-8">
              {/* FAQs Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-text-primary uppercase tracking-wider">
                    Frequently Asked Questions (FAQs)
                  </h3>
                  <button 
                    type="button" 
                    onClick={() => {
                      const currentFaqs = editingPost.faqs || [];
                      setEditingPost(prev => prev ? { ...prev, faqs: [...currentFaqs, { question: '', answer: '' }] } : null);
                    }}
                    className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add FAQ Item</span>
                  </button>
                </div>

                {(editingPost.faqs || []).map((faq, i) => (
                  <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 relative">
                    <button 
                      type="button" 
                      onClick={() => {
                        const updated = editingPost.faqs.filter((_, idx) => idx !== i);
                        setEditingPost(prev => prev ? { ...prev, faqs: updated } : null);
                      }}
                      className="absolute top-3 right-3 p-1 text-rose-500 hover:bg-rose-100 rounded-lg cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Question #{i + 1}</label>
                      <input 
                        type="text" 
                        value={faq.question} 
                        onChange={(e) => {
                          const updated = [...editingPost.faqs];
                          updated[i] = { ...updated[i], question: e.target.value };
                          setEditingPost(prev => prev ? { ...prev, faqs: updated } : null);
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Answer #{i + 1}</label>
                      <textarea 
                        value={faq.answer} 
                        onChange={(e) => {
                          const updated = [...editingPost.faqs];
                          updated[i] = { ...updated[i], answer: e.target.value };
                          setEditingPost(prev => prev ? { ...prev, faqs: updated } : null);
                        }}
                        rows={2}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Official Sources Section */}
              <div className="space-y-4 pt-6 border-t border-border-custom">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-text-primary uppercase tracking-wider">
                    Official Reference Sources
                  </h3>
                  <button 
                    type="button" 
                    onClick={() => {
                      const currentSources = editingPost.officialSources || [];
                      setEditingPost(prev => prev ? { ...prev, officialSources: [...currentSources, { name: '', url: 'https://', description: '' }] } : null);
                    }}
                    className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Reference Source</span>
                  </button>
                </div>

                {(editingPost.officialSources || []).map((source, i) => (
                  <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-3 relative">
                    <button 
                      type="button" 
                      onClick={() => {
                        const updated = editingPost.officialSources.filter((_, idx) => idx !== i);
                        setEditingPost(prev => prev ? { ...prev, officialSources: updated } : null);
                      }}
                      className="absolute top-2 right-2 p-1 text-rose-500 hover:bg-rose-100 rounded-lg cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Source Name</label>
                      <input 
                        type="text" 
                        value={source.name} 
                        onChange={(e) => {
                          const updated = [...editingPost.officialSources];
                          updated[i] = { ...updated[i], name: e.target.value };
                          setEditingPost(prev => prev ? { ...prev, officialSources: updated } : null);
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Official URL</label>
                      <input 
                        type="text" 
                        value={source.url} 
                        onChange={(e) => {
                          const updated = [...editingPost.officialSources];
                          updated[i] = { ...updated[i], url: e.target.value };
                          setEditingPost(prev => prev ? { ...prev, officialSources: updated } : null);
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Description</label>
                      <input 
                        type="text" 
                        value={source.description} 
                        onChange={(e) => {
                          const updated = [...editingPost.officialSources];
                          updated[i] = { ...updated[i], description: e.target.value };
                          setEditingPost(prev => prev ? { ...prev, officialSources: updated } : null);
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="space-y-6">
          {/* Action & Filter Bar */}
          <div className="bg-white rounded-3xl border border-border-custom p-6 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-1 max-w-md bg-bg-custom px-3.5 py-2.5 rounded-2xl border border-border-custom">
                <Search className="h-4 w-4 text-text-secondary" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, slug, or author..."
                  className="bg-transparent text-xs font-medium text-text-primary focus:outline-none w-full"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 bg-white border border-border-custom rounded-xl text-xs font-bold text-text-secondary focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Drafts</option>
                </select>

                <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-white border border-border-custom rounded-xl text-xs font-bold text-text-secondary focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  <option value="Salary & Tax">Salary & Tax</option>
                  <option value="Savings & Retirement">Savings & Retirement</option>
                  <option value="Home & Property">Home & Property</option>
                </select>

                <button 
                  onClick={handleCreateNew}
                  className="px-4 py-2.5 bg-primary text-white hover:bg-primary-dark rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-primary/20"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create New Article</span>
                </button>
              </div>
            </div>
          </div>

          {/* Article Table / Cards */}
          <div className="bg-white rounded-3xl border border-border-custom overflow-hidden shadow-2xs">
            <div className="divide-y divide-border-custom">
              {filteredPosts.length === 0 ? (
                <div className="p-12 text-center text-text-secondary space-y-3">
                  <FileText className="h-10 w-10 mx-auto text-text-secondary/40" />
                  <p className="text-sm font-bold">No articles match your filters.</p>
                </div>
              ) : (
                filteredPosts.map((post) => {
                  const isPublished = (post.status || 'published') === 'published';
                  return (
                    <div 
                      key={post.id} 
                      className="p-5 sm:p-6 hover:bg-slate-50/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                            isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {isPublished ? 'Published' : 'Draft'}
                          </span>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-bold">
                            {post.category}
                          </span>
                          <span className="text-[11px] text-text-secondary">
                            {post.publishDate} • {post.readTime}
                          </span>
                        </div>

                        <h3 className="text-base font-extrabold text-text-primary font-display">
                          {post.title}
                        </h3>
                        <p className="text-xs text-text-secondary line-clamp-1 font-mono">
                          /blog/{post.slug}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-center">
                        <button 
                          onClick={() => handleToggleStatus(post)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            isPublished 
                              ? 'border-amber-300 text-amber-700 hover:bg-amber-50' 
                              : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                          }`}
                        >
                          {isPublished ? 'Unpublish' : 'Publish'}
                        </button>

                        <button 
                          onClick={() => handleEdit(post)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </button>

                        <button 
                          onClick={() => onNavigateBlog(post.slug)}
                          className="p-2 text-text-secondary hover:text-primary hover:bg-primary/5 rounded-xl transition-all cursor-pointer"
                          title="Preview article page"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button 
                          onClick={() => handleDelete(post.id, post.title)}
                          className="p-2 text-text-secondary hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                          title="Delete article"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              onClick={handleResetDefaults}
              className="text-xs text-text-secondary hover:text-rose-600 font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset CMS Store to Initial Default Articles</span>
            </button>
          </div>
        </div>
      )}

      {/* Backup / Import JSON Modal */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-border-custom space-y-4">
            <div className="flex items-center justify-between border-b border-border-custom pb-3">
              <h3 className="text-base font-extrabold text-text-primary flex items-center gap-2">
                <Upload className="h-5 w-5 text-sky-500" />
                <span>Import Articles JSON</span>
              </h3>
              <button 
                onClick={() => setShowJsonModal(false)}
                className="p-1 text-text-secondary hover:text-text-primary rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              Paste a valid JSON array of article objects exported from Sequenxe CMS to restore or update your article library.
            </p>

            <textarea 
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste JSON array here..."
              rows={8}
              className="w-full p-3 border border-border-custom rounded-2xl font-mono text-xs focus:ring-2 focus:ring-primary focus:outline-none"
            />

            {jsonMessage && (
              <p className={`text-xs font-bold ${jsonMessage.includes('Error') ? 'text-rose-600' : 'text-emerald-600'}`}>
                {jsonMessage}
              </p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => setShowJsonModal(false)}
                className="px-4 py-2 border border-border-custom rounded-xl text-xs font-bold text-text-secondary hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleImportJson}
                className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-dark cursor-pointer"
              >
                Import Articles
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
