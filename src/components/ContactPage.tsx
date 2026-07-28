import React, { useState } from 'react';
import { Clock, Send, MessageSquare, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import SEOManager from './calculators/shared/SEOManager';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'General Question',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch('https://formspree.io/f/xbdnpgya', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          category: formData.category,
          subject: formData.subject,
          message: formData.message
        })
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          category: 'General Question',
          subject: '',
          message: ''
        });
      } else {
        const data = await response.json().catch(() => null);
        if (data && data.errors && data.errors.length > 0) {
          setErrorMessage(data.errors.map((err: { message: string }) => err.message).join(', ') || 'Unable to send your message. Please try again later.');
        } else {
          setErrorMessage('Unable to send your message. Please try again later.');
        }
      }
    } catch {
      setErrorMessage('Unable to send your message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 space-y-10 animate-fade-in">
      <SEOManager
        title="Contact Us | Sequenxe Financial Education Platform"
        description="Get in touch with the Sequenxe team for inquiries, calculator feedback, or general questions regarding our Malaysian financial tools."
        canonicalUrl={`${origin}/contact`}
        breadcrumbs={[
          { name: 'Home', url: `${origin}/` },
          { name: 'Contact', url: `${origin}/contact` }
        ]}
      />

      {/* Header */}
      <div className="space-y-3 text-center border-b border-border-custom pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold font-mono">
          <MessageSquare className="h-4 w-4" />
          <span>Get in Touch</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl font-display">
          Contact Sequenxe
        </h1>
        <p className="text-sm sm:text-base text-text-secondary max-w-xl mx-auto leading-relaxed">
          Have feedback on our financial calculators or general questions about Sequenxe? We would love to hear from you.
        </p>
      </div>

      {/* Response Time Card */}
      <div className="bg-white p-5 rounded-2xl border border-border-custom shadow-2xs flex items-center gap-4 max-w-md mx-auto">
        <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Clock className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs font-bold text-text-secondary uppercase tracking-wider font-mono">Response Time</div>
          <p className="text-xs font-medium text-text-primary">
            Replies typically take 2–5 business days.
          </p>
        </div>
      </div>

      {/* Contact Form Container */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-border-custom shadow-2xs space-y-6">
        <h2 className="text-xl font-bold text-text-primary font-display">Send Us a Message</h2>

        {isSubmitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-3 animate-fade-in">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-emerald-900 text-base font-display">Message Sent Successfully!</h3>
            <p className="text-xs sm:text-sm text-emerald-700 max-w-md mx-auto leading-relaxed">
              Thank you for reaching out to Sequenxe. Our team has received your message and will review it shortly. Replies typically take 2–5 business days.
            </p>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setErrorMessage(null);
                setFormData({ name: '', email: '', category: 'General Question', subject: '', message: '' });
              }}
              className="mt-2 text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs font-medium text-red-700 flex items-center gap-2 animate-fade-in">
                <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-primary">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ahmad Razak"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-xl border border-border-custom bg-bg-custom/30 text-xs text-text-primary focus:border-primary focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-primary">Your Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. ahmad@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-xl border border-border-custom bg-bg-custom/30 text-xs text-text-primary focus:border-primary focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-primary">Category</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full h-10 px-3.5 rounded-xl border border-border-custom bg-bg-custom/30 text-xs text-text-primary focus:border-primary focus:bg-white focus:outline-none cursor-pointer"
              >
                <option value="General Question">General Question</option>
                <option value="Bug Report">Bug Report</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Business Inquiry">Business Inquiry</option>
                <option value="Partnership">Partnership</option>
                <option value="Advertising">Advertising</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-primary">Subject</label>
              <input
                type="text"
                required
                placeholder="e.g. Feedback on Income Tax Calculator"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full h-10 px-3.5 rounded-xl border border-border-custom bg-bg-custom/30 text-xs text-text-primary focus:border-primary focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-primary">Message</label>
              <textarea
                required
                rows={5}
                placeholder="Write your message or inquiry here..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full p-3.5 rounded-xl border border-border-custom bg-bg-custom/30 text-xs text-text-primary focus:border-primary focus:bg-white focus:outline-none leading-relaxed"
              />
            </div>

            <p className="text-[11px] text-text-secondary">
              Note: Please do not include confidential personal tax identification numbers (TIN) or bank account details in your message.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-hover transition-all cursor-pointer shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
