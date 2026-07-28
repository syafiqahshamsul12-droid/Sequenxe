import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  FileText, 
  Percent, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Receipt,
  BookmarkCheck
} from 'lucide-react';
import { IncomeTaxInputs, IncomeTaxOutputs } from '../../types';
import { calculateIncomeTaxCalculation } from '../../utils/formulas';
import { useSaveConfig } from '../../hooks/useSaveConfig';
import SEOManager from './shared/SEOManager';
import { 
  Breadcrumb, 
  CalculatorHero, 
  SectionHeader, 
  ExportButtons, 
  InsightCards, 
  FormulaExplanation, 
  FAQSection, 
  Disclaimer 
} from './shared/CommonComponents';

const DEFAULT_INPUTS: IncomeTaxInputs = {
  monthlySalary: 8000,
  annualBonus: 8000,
  epfRate: 11,
  maritalStatus: 'single',
  isTaxResident: true,
  childrenCount: 0,
  childrenTertiaryCount: 0,
  zakat: 0,
  reliefs: {
    lifestyle: 2500,
    lifeInsurance: 3000,
    medicalSelf: 1000,
    parentMedical: 0,
    educationSelf: 0,
    sspnSavings: 2000
  }
};

export default function IncomeTaxCalculator() {
  const { values: inputs, setValues: setInputs, resetConfig, hasSavedIndicator } = useSaveConfig<IncomeTaxInputs>('income_tax', DEFAULT_INPUTS);
  const [outputs, setOutputs] = useState<IncomeTaxOutputs | null>(null);
  const [showReliefs, setShowReliefs] = useState<boolean>(true);

  useEffect(() => {
    const results = calculateIncomeTaxCalculation(inputs);
    setOutputs(results);
  }, [inputs]);

  if (!outputs) return null;

  const handleReset = () => {
    resetConfig();
  };


  const navigateTo = (viewId: string) => {
    const navEvent = new CustomEvent('change-view', { detail: viewId });
    window.dispatchEvent(navEvent);
  };

  const handleReliefChange = (field: keyof IncomeTaxInputs['reliefs'], val: number) => {
    setInputs(prev => ({
      ...prev,
      reliefs: {
        ...prev.reliefs,
        [field]: val
      }
    }));
  };

  const handleExportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Financial Item,Amount (RM)\n"
      + `Annual Gross Income,${outputs.annualGross.toFixed(2)}\n`
      + `Total Tax Reliefs Claimed,${outputs.totalReliefsClaimed.toFixed(2)}\n`
      + `Annual Chargeable Income,${outputs.chargeableIncome.toFixed(2)}\n`
      + `Estimated Annual Tax Payable,${outputs.annualTaxPayable.toFixed(2)}\n`
      + `Effective Tax Rate,${outputs.effectiveTaxRate}%\n`
      + `Marginal Tax Bracket,${outputs.applicableTaxRate}%\n`
      + `Monthly PCB Equivalent,${outputs.monthlyPcbEquivalent.toFixed(2)}\n`
      + `Estimated Tax Cash Saved,${outputs.taxSavingsFromReliefs.toFixed(2)}`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "income_tax_report_ya2026.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyMarkdown = () => {
    const summaryText = `### Personal Income Tax Report (Malaysia YA 2026)
- **Annual Gross Income**: RM ${outputs.annualGross.toLocaleString('en-MY')}
- **Total Tax Reliefs Claimed**: RM ${outputs.totalReliefsClaimed.toLocaleString('en-MY')}
- **Annual Chargeable Income**: RM ${outputs.chargeableIncome.toLocaleString('en-MY')}
- **Estimated Annual Tax Payable**: RM ${outputs.annualTaxPayable.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
- **Effective Tax Rate**: ${outputs.effectiveTaxRate}%
- **Tax Cash Savings From Reliefs**: RM ${outputs.taxSavingsFromReliefs.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
- **Monthly PCB Equivalent**: RM ${outputs.monthlyPcbEquivalent.toLocaleString('en-MY', { minimumFractionDigits: 2 })}`;

    navigator.clipboard.writeText(summaryText);
  };

  const insights = [
    {
      type: 'success' as const,
      title: "Direct Cash Tax Savings",
      text: `By claiming RM ${outputs.totalReliefsClaimed.toLocaleString('en-MY')} in verified personal reliefs, you save an estimated RM ${outputs.taxSavingsFromReliefs.toLocaleString('en-MY', { minimumFractionDigits: 2 })} in cash tax payable!`
    },
    {
      type: 'info' as const,
      title: "Effective Tax Rate Advantage",
      text: `Your overall effective tax rate is only ${outputs.effectiveTaxRate}% of your total gross income (RM ${outputs.annualGross.toLocaleString('en-MY')}), even though your top marginal tax rate tier is ${outputs.applicableTaxRate}%.`
    },
    {
      type: 'warning' as const,
      title: "LHDN 7-Year Receipt Audit Rule",
      text: "LHDN requires retaining all original physical or digital payment receipts for lifestyle, medical, education, and SSPN claims for at least 7 years."
    }
  ];

  const faqs = [
    {
      question: "What is chargeable income?",
      answer: "Chargeable income is the net portion of your total annual income that is actually subject to tax after subtracting non-taxable allowances, statutory EPF contributions, and verified personal tax reliefs."
    },
    {
      question: "How do progressive tax brackets work in Malaysia?",
      answer: "Malaysia uses a progressive tax system where higher income portions are taxed at higher tier rates. Your entire income is not taxed at one rate; only the portion falling within each specific bracket is taxed at that bracket's percentage."
    },
    {
      question: "What is the difference between tax deduction/relief and tax rebate?",
      answer: "Tax reliefs reduce your chargeable income before tax rate brackets are calculated. Tax rebates (such as the RM 400 rebate for chargeable income <= RM 35,000 or Zakat payments) subtract directly from the final tax payable amount."
    },
    {
      question: "When and how do I file my annual income tax return?",
      answer: "Salaried employees submit Borang BE via LHDN's online MyTax portal annually between 1 March and 15 May for the preceding Year of Assessment."
    },
    {
      question: "What happens if my monthly PCB exceeded my final computed tax?",
      answer: "If your employer withheld more PCB during the year than your actual final computed tax (e.g. because you claimed extra reliefs on your BE form), LHDN will issue a direct refund to your registered bank account!"
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <SEOManager 
        title="Income Tax Calculator Malaysia YA 2026 | Tax Reliefs & Bracket Breakdown"
        description="Calculate annual Malaysian personal income tax payable, chargeable income, and tax savings from claimable LHDN reliefs for YA 2026 in plain language."
        canonicalUrl="https://sequenxe.com/income-tax-calculator"
        calculatorId="income-tax-calculator"
        faqs={faqs}
        breadcrumbs={[
          { name: 'Home', url: 'https://sequenxe.com/' },
          { name: 'Income Tax Calculator Malaysia', url: 'https://sequenxe.com/income-tax-calculator' }
        ]}
      />

      {/* Breadcrumb & Hero (web-only) */}
      <div className="no-print">
        <Breadcrumb 
          items={[
            { label: 'Home', href: 'home' },
            { label: 'Salary & Tax', href: 'home' },
            { label: 'Income Tax Calculator Malaysia' }
          ]} 
        />

        <CalculatorHero 
          title="Income Tax Calculator Malaysia (YA 2026)"
          description="User-friendly personal income tax estimator for Malaysian taxpayers. Calculate chargeable income, compare progressive tax brackets, and maximize cash tax savings from LHDN reliefs."
          estimatedTime="2 mins"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Input Panel */}
        <div className="lg:col-span-5 bg-white border border-border-custom rounded-2xl p-6 sm:p-8 shadow-xs space-y-5 no-print">
          <div className="flex justify-between items-center border-b border-border-custom pb-3">
            <h2 className="font-display font-bold text-base text-text-primary uppercase tracking-wide flex items-center gap-2">
              <Receipt className="h-4 w-4 text-primary" />
              Annual Income & Reliefs
            </h2>
            <div className="flex items-center gap-3">
              {hasSavedIndicator && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 animate-pulse">
                  <BookmarkCheck className="h-3 w-3" /> Auto-Saved
                </span>
              )}
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-primary transition-colors cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Reset
              </button>
            </div>
          </div>

          {/* Income Inputs */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="monthlySalaryTax" className="text-xs font-semibold text-text-primary block">
                Monthly Gross Base Salary (RM)
              </label>
              <div className="relative">
                <span className="absolute top-3 left-3 text-xs font-semibold text-text-secondary">RM</span>
                <input
                  id="monthlySalaryTax"
                  type="number"
                  min="0"
                  step="200"
                  value={inputs.monthlySalary}
                  onChange={(e) => setInputs(prev => ({ ...prev, monthlySalary: Math.max(0, parseFloat(e.target.value) || 0) }))}
                  className="h-10 w-full rounded-xl border border-border-custom bg-bg-custom pl-10 pr-3 text-xs font-semibold text-text-primary focus:border-primary focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="annualBonus" className="text-xs font-semibold text-text-primary block">
                Annual Bonus / Other Taxable Income (RM)
              </label>
              <div className="relative">
                <span className="absolute top-3 left-3 text-xs font-semibold text-text-secondary">RM</span>
                <input
                  id="annualBonus"
                  type="number"
                  min="0"
                  step="500"
                  value={inputs.annualBonus}
                  onChange={(e) => setInputs(prev => ({ ...prev, annualBonus: Math.max(0, parseFloat(e.target.value) || 0) }))}
                  className="h-10 w-full rounded-xl border border-border-custom bg-bg-custom pl-10 pr-3 text-xs font-semibold text-text-primary focus:border-primary focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="p-3 bg-bg-custom rounded-xl border border-border-custom flex justify-between items-center text-xs">
              <span className="font-semibold text-text-secondary">Total Annual Gross Income:</span>
              <span className="font-mono font-bold text-primary">RM {outputs.annualGross.toLocaleString('en-MY')}</span>
            </div>
          </div>

          {/* Marital & Children */}
          <div className="space-y-3 pt-2 border-t border-border-custom">
            <label className="text-xs font-semibold text-text-primary block">Marital & Family Category</label>
            <select
              value={inputs.maritalStatus}
              onChange={(e) => setInputs(prev => ({ ...prev, maritalStatus: e.target.value as any }))}
              className="w-full h-10 rounded-xl border border-border-custom bg-bg-custom text-xs font-semibold px-3 text-text-primary"
            >
              <option value="single">Single / Married (Spouse Working)</option>
              <option value="married_non_working_spouse">Married (Spouse Not Working - RM 4,000 Relief)</option>
            </select>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-text-primary block mb-1">Children &lt;18</label>
                <select
                  value={inputs.childrenCount}
                  onChange={(e) => setInputs(prev => ({ ...prev, childrenCount: parseInt(e.target.value) || 0 }))}
                  className="w-full h-9 rounded-lg border border-border-custom bg-bg-custom text-xs font-semibold px-2"
                >
                  {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} ({n * 2000})</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-text-primary block mb-1">Tertiary Edu</label>
                <select
                  value={inputs.childrenTertiaryCount}
                  onChange={(e) => setInputs(prev => ({ ...prev, childrenTertiaryCount: parseInt(e.target.value) || 0 }))}
                  className="w-full h-9 rounded-lg border border-border-custom bg-bg-custom text-xs font-semibold px-2"
                >
                  {[0, 1, 2, 3, 4].map(n => <option key={n} value={n}>{n} ({n * 8000})</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Collapsible Tax Reliefs Section */}
          <div className="border border-border-custom rounded-xl overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => setShowReliefs(!showReliefs)}
              className="w-full bg-bg-custom/80 p-3.5 flex justify-between items-center text-left hover:bg-bg-custom transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold text-text-primary">Claimable Tax Reliefs (YA 2026)</span>
              </div>
              {showReliefs ? <ChevronUp className="h-4 w-4 text-text-secondary" /> : <ChevronDown className="h-4 w-4 text-text-secondary" />}
            </button>

            {showReliefs && (
              <div className="p-4 bg-white border-t border-border-custom space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Lifestyle & Technology (Max RM 2,500)</span>
                    <span className="font-mono text-primary">RM {inputs.reliefs.lifestyle}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2500"
                    step="100"
                    value={inputs.reliefs.lifestyle}
                    onChange={(e) => handleReliefChange('lifestyle', parseInt(e.target.value) || 0)}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5 pt-2 border-t border-border-custom">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Life Insurance (Max RM 3,000)</span>
                    <span className="font-mono text-primary">RM {inputs.reliefs.lifeInsurance}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="3000"
                    step="100"
                    value={inputs.reliefs.lifeInsurance}
                    onChange={(e) => handleReliefChange('lifeInsurance', parseInt(e.target.value) || 0)}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5 pt-2 border-t border-border-custom">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>SSPN Net Savings (Max RM 8,000)</span>
                    <span className="font-mono text-primary">RM {inputs.reliefs.sspnSavings}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="8000"
                    step="500"
                    value={inputs.reliefs.sspnSavings}
                    onChange={(e) => handleReliefChange('sspnSavings', parseInt(e.target.value) || 0)}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5 pt-2 border-t border-border-custom">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Medical Expenses Self/Spouse (Max RM 10,000)</span>
                    <span className="font-mono text-primary">RM {inputs.reliefs.medicalSelf}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="500"
                    value={inputs.reliefs.medicalSelf}
                    onChange={(e) => handleReliefChange('medicalSelf', parseInt(e.target.value) || 0)}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
          {/* Mandatory Disclaimer */}
          <Disclaimer />
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex justify-end no-print">
            <ExportButtons 
              onCopyMarkdown={handleCopyMarkdown} 
              onExportCsv={handleExportCsv} 
              title="Income Tax Summary"
            />
          </div>
          
          {/* Primary Result Card */}
          <div className="bg-gradient-to-br from-[#8B1A34] via-[#6D1026] to-[#4F0B1B] text-white rounded-2xl p-6 sm:p-8 shadow-xl shadow-[#6D1026]/20 relative overflow-hidden border border-white/20 backdrop-blur-md">
            <div className="absolute -top-12 -right-12 w-72 h-72 bg-rose-300/15 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
            
            <span className="text-xs uppercase font-mono font-bold tracking-widest text-rose-100/80 block mb-1">
              ESTIMATED ANNUAL INCOME TAX PAYABLE
            </span>
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <h2 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-white">
                RM {outputs.annualTaxPayable.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="text-sm font-normal text-rose-100/80 ml-2">/year</span>
              </h2>
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold text-emerald-200 border border-emerald-400/30 w-fit shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
                Saved RM {outputs.taxSavingsFromReliefs.toLocaleString('en-MY')}!
              </span>
            </div>

            <div className="mt-6 pt-5 border-t border-white/15 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-rose-100/70 block text-[11px] font-medium">Chargeable Income</span>
                <span className="font-mono font-bold text-sm sm:text-base text-white">RM {outputs.chargeableIncome.toLocaleString('en-MY')}</span>
              </div>
              <div>
                <span className="text-rose-100/70 block text-[11px] font-medium">Effective Tax Rate</span>
                <span className="font-mono font-bold text-sm sm:text-base text-white">{outputs.effectiveTaxRate}%</span>
              </div>
              <div>
                <span className="text-rose-100/70 block text-[11px] font-medium">Monthly PCB Equivalent</span>
                <span className="font-mono font-bold text-sm sm:text-base text-rose-200">RM {outputs.monthlyPcbEquivalent.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Tax Reliefs Claimed & Savings Highlight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-border-custom rounded-2xl p-5 shadow-xs space-y-1">
              <span className="text-xs font-bold text-text-secondary block">Total Tax Reliefs Claimed</span>
              <span className="font-display font-bold text-2xl text-text-primary">
                RM {outputs.totalReliefsClaimed.toLocaleString('en-MY')}
              </span>
              <p className="text-[11px] text-text-secondary">Deducted from gross income before applying tax rate brackets.</p>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-500/20 rounded-2xl p-5 shadow-xs space-y-1">
              <span className="text-xs font-bold text-emerald-900 block">Estimated Cash Tax Saved</span>
              <span className="font-display font-bold text-2xl text-emerald-800">
                RM {outputs.taxSavingsFromReliefs.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
              </span>
              <p className="text-[11px] text-emerald-900">Direct cash money saved due to your claimed reliefs.</p>
            </div>
          </div>

          {/* Progressive Tax Bracket Breakdown Table */}
          <div className="bg-white border border-border-custom rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-border-custom pb-3">
              <div>
                <h3 className="font-display font-bold text-sm text-text-primary uppercase tracking-wide">
                  Progressive Tax Bracket Breakdown
                </h3>
                <p className="text-[11px] text-text-secondary">Shows how much of your chargeable income falls into each tax tier.</p>
              </div>
              <ExportButtons 
                onCopyMarkdown={handleCopyMarkdown}
                onExportCsv={handleExportCsv}
                title="Tax Bracket Breakdown"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border-custom bg-bg-custom text-text-secondary">
                    <th className="py-2 px-3 font-semibold">Tax Bracket Tier</th>
                    <th className="py-2 px-3 font-semibold text-center">Rate (%)</th>
                    <th className="py-2 px-3 font-semibold text-right">Taxable Amount in Tier</th>
                    <th className="py-2 px-3 font-semibold text-right">Tax Payable in Tier</th>
                  </tr>
                </thead>
                <tbody>
                  {outputs.bracketBreakdown.map((tier, idx) => (
                    <tr key={idx} className="border-b border-bg-custom hover:bg-bg-custom/50">
                      <td className="py-2 px-3 font-medium text-text-primary">{tier.rangeLabel}</td>
                      <td className="py-2 px-3 text-center font-mono font-bold text-primary">{tier.ratePercent}%</td>
                      <td className="py-2 px-3 text-right font-mono text-text-secondary">RM {tier.taxableInTier.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-text-primary">RM {tier.taxInTier.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                  <tr className="bg-primary/5 font-bold">
                    <td colSpan={3} className="py-2.5 px-3 text-primary uppercase">Total Computed Annual Tax</td>
                    <td className="py-2.5 px-3 text-right font-mono text-primary">RM {outputs.annualTaxPayable.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* Financial Insights */}
      <div className="space-y-4 no-print">
        <SectionHeader title="Tax Optimization Insights" badge="Rules-Based" />
        <InsightCards insights={insights} />
      </div>

      {/* Formula Explanation */}
      <div className="no-print">
        <FormulaExplanation 
          what="Personal income tax is calculated on Chargeable Income using progressive LHDN tax bracket rates."
          formula={
            <div className="space-y-1 font-mono text-[11px] text-primary">
              <div>Chargeable Income = Annual Gross Income - Total Verified Tax Reliefs</div>
              <div>Annual Tax Payable = Progressive Tier Taxes - Applicable Rebates (RM 400 / Zakat)</div>
            </div>
          }
          why="Maximizing eligible tax reliefs lowers your effective tax bracket, directly increasing your annual net savings."
        />
      </div>

      {/* FAQs */}
      <div className="space-y-4 no-print">
        <SectionHeader title="Frequently Asked Questions" badge="FAQ" />
        <FAQSection faqs={faqs} />
      </div>


    </div>
  );
}
