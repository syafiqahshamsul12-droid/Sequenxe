import React, { useState } from 'react';
import { 
  TrendingUp, 
  RefreshCw, 
  HelpCircle, 
  FileText, 
  PieChart as PieChartIcon, 
  ArrowRight, 
  Sparkles, 
  Info, 
  ShieldCheck, 
  Coins, 
  Layers, 
  Calendar,
  Settings2,
  BookmarkCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import SEOManager from './shared/SEOManager';
import { useSaveConfig } from '../../hooks/useSaveConfig';
import { determineEmployerEpfRate } from '../../utils/formulas';
import { 
  Breadcrumb, 
  CalculatorHero, 
  SectionHeader, 
  SummaryCard, 
  ExportButtons, 
  InsightCards, 
  FormulaExplanation, 
  CollapsibleBox,
  FAQSection, 
  Disclaimer 
} from './shared/CommonComponents';

interface EpfCalcState {
  grossSalary: number;
  employeeRate: number;
  employerOverrideRate?: number;
  voluntaryContribution: number;
  assumedDividend: number;
}

const DEFAULT_STATE: EpfCalcState = {
  grossSalary: 5000,
  employeeRate: 11,
  employerOverrideRate: undefined,
  voluntaryContribution: 0,
  assumedDividend: 5.5
};

export default function EpfContributionCalculator() {
  const { values, setValues, resetConfig, hasSavedIndicator } = useSaveConfig<EpfCalcState>('epf_contribution', DEFAULT_STATE);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const { grossSalary, employeeRate, employerOverrideRate, voluntaryContribution, assumedDividend } = values;

  // Auto-determine employer rate based on salary and optional override
  const employerEpfInfo = determineEmployerEpfRate(grossSalary, employerOverrideRate);
  const effectiveEmployerRate = employerEpfInfo.rate;

  const employeeContribution = Math.round((grossSalary * (employeeRate / 100)) * 100) / 100;
  const employerContribution = Math.round((grossSalary * (effectiveEmployerRate / 100)) * 100) / 100;
  const totalMonthlyContribution = employeeContribution + employerContribution + voluntaryContribution;
  const totalAnnualContribution = totalMonthlyContribution * 12;

  const handleReset = () => {
    resetConfig();
    setShowAdvanced(false);
  };

  const handleChange = (field: keyof EpfCalcState, val: any) => {
    setValues(prev => ({
      ...prev,
      [field]: val
    }));
  };


  // EPF 3-Account Split (75% / 15% / 10%)
  const akaunPersaraan = Math.round((totalMonthlyContribution * 0.75) * 100) / 100;
  const akaunSejahtera = Math.round((totalMonthlyContribution * 0.15) * 100) / 100;
  const akaunFleksibel = Math.round((totalMonthlyContribution * 0.10) * 100) / 100;

  // Future EPF Growth Projections (5, 10, 20 Years) assuming monthly compounding at assumedDividend
  const calculateFutureValue = (years: number) => {
    const r = (assumedDividend / 100) / 12;
    const n = years * 12;
    // Future value of an annuity formula for monthly deposits
    const fv = totalMonthlyContribution * ((Math.pow(1 + r, n) - 1) / r);
    const totalPrincipal = totalMonthlyContribution * n;
    const totalInterest = Math.max(0, fv - totalPrincipal);
    return {
      years,
      totalBalance: Math.round(fv),
      principal: Math.round(totalPrincipal),
      interest: Math.round(totalInterest)
    };
  };

  const projection5 = calculateFutureValue(5);
  const projection10 = calculateFutureValue(10);
  const projection20 = calculateFutureValue(20);

  // Employee vs Employer Chart Data
  const contribChartData = [
    { name: 'Employee Share', value: employeeContribution, color: '#7A2436' },
    { name: 'Employer Share', value: employerContribution, color: '#C28A00' },
    ...(voluntaryContribution > 0 ? [{ name: 'Voluntary Self-Add', value: voluntaryContribution, color: '#B15066' }] : [])
  ];

  // Account Split Chart Data
  const accountChartData = [
    { name: 'Akaun Persaraan (75%)', value: akaunPersaraan, color: '#7A2436' },
    { name: 'Akaun Sejahtera (15%)', value: akaunSejahtera, color: '#B15066' },
    { name: 'Akaun Fleksibel (10%)', value: akaunFleksibel, color: '#C28A00' }
  ];

  const navigateTo = (viewId: string) => {
    const navEvent = new CustomEvent('change-view', { detail: viewId });
    window.dispatchEvent(navEvent);
  };

  const handleExportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Monthly (RM),Annual (RM)\n"
      + `Gross Salary,${grossSalary},${grossSalary * 12}\n`
      + `Employee Contribution (${employeeRate}%),${employeeContribution},${employeeContribution * 12}\n`
      + `Employer Contribution (${effectiveEmployerRate}%),${employerContribution},${employerContribution * 12}\n`
      + `Voluntary Self-Contribution,${voluntaryContribution},${voluntaryContribution * 12}\n`
      + `Total Monthly Deposit,${totalMonthlyContribution},${totalAnnualContribution}\n`
      + `Akaun Persaraan (75%),${akaunPersaraan},${akaunPersaraan * 12}\n`
      + `Akaun Sejahtera (15%),${akaunSejahtera},${akaunSejahtera * 12}\n`
      + `Akaun Fleksibel (10%),${akaunFleksibel},${akaunFleksibel * 12}\n\n`
      + "Projection Period,Total Principal (RM),Interest Earned (RM),Projected Total Balance (RM)\n"
      + `5 Years,${projection5.principal},${projection5.interest},${projection5.totalBalance}\n`
      + `10 Years,${projection10.principal},${projection10.interest},${projection10.totalBalance}\n`
      + `20 Years,${projection20.principal},${projection20.interest},${projection20.totalBalance}`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "epf_contribution_report_malaysia.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [copied, setCopied] = useState(false);

  const handleCopyMarkdown = () => {
    const summaryText = `### EPF (KWSP) Contribution Report Malaysia
- **Gross Monthly Salary**: RM ${grossSalary.toLocaleString('en-MY')}
- **Employee Share (${employeeRate}%)**: RM ${employeeContribution.toLocaleString('en-MY')}/month
- **Employer Share (${effectiveEmployerRate}%)**: RM ${employerContribution.toLocaleString('en-MY')}/month
- **Voluntary Self-Contribution**: RM ${voluntaryContribution.toLocaleString('en-MY')}/month
- **Total Monthly KWSP Deposit**: RM ${totalMonthlyContribution.toLocaleString('en-MY')}/month
- **Total Annual KWSP Deposit**: RM ${totalAnnualContribution.toLocaleString('en-MY')}/year
- **Monthly Akaun 1 (Persaraan 75%)**: RM ${akaunPersaraan.toLocaleString('en-MY')}
- **Monthly Akaun 2 (Sejahtera 15%)**: RM ${akaunSejahtera.toLocaleString('en-MY')}
- **Monthly Akaun 3 (Fleksibel 10%)**: RM ${akaunFleksibel.toLocaleString('en-MY')}
- **Future Growth Projections (@ ${assumedDividend}% p.a.)**:
  - 5 Years: RM ${projection5.totalBalance.toLocaleString('en-MY')} (Interest: RM ${projection5.interest.toLocaleString('en-MY')})
  - 10 Years: RM ${projection10.totalBalance.toLocaleString('en-MY')} (Interest: RM ${projection10.interest.toLocaleString('en-MY')})
  - 20 Years: RM ${projection20.totalBalance.toLocaleString('en-MY')} (Interest: RM ${projection20.interest.toLocaleString('en-MY')})`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const insights = [
    {
      type: 'success' as const,
      title: "Immediate Employer Value Match",
      text: `Your employer adds RM ${employerContribution.toLocaleString('en-MY')} (${effectiveEmployerRate}%) directly on top of your gross wage every month. This boosts your total effective compensation by ${effectiveEmployerRate}%.`
    },
    {
      type: 'info' as const,
      title: "3-Account Restructuring Distribution",
      text: `Your RM ${totalMonthlyContribution.toLocaleString('en-MY')} monthly total deposit is split into Akaun Persaraan (75% / RM ${akaunPersaraan}), Akaun Sejahtera (15% / RM ${akaunSejahtera}), and Akaun Fleksibel (10% / RM ${akaunFleksibel}).`
    },
    {
      type: 'warning' as const,
      title: "LHDN Tax Relief Limit",
      text: "Employee EPF statutory contributions are claimable as individual income tax relief under LHDN up to RM 4,000 per assessment year."
    }
  ];

  const faqs = [
    {
      question: "How are EPF contributions calculated in Malaysia?",
      answer: "Monthly EPF (KWSP) is calculated as statutory percentages of gross monthly salary (basic salary, overtime, commissions, and bonuses). The standard employee rate is 11% (or 9% reduced option), while employers contribute 13% for salaries up to RM 5,000 and 12% for salaries above RM 5,000."
    },
    {
      question: "Why do employer EPF rates differ based on monthly salary?",
      answer: "Under Malaysian labor law (KWSP Act 1991), employers contribute 13% for monthly wages of RM 5,000 or below, and 12% for monthly wages above RM 5,000. This statutory tier is designed to provide greater relative financial protection and retirement savings support for lower and middle-income earners."
    },
    {
      question: "What items are included in gross salary for EPF calculation?",
      answer: "EPF contributions apply to basic wages, overtime pay, commissions, bonuses, and taxable allowances. Non-wage items such as travelling allowances, director fees, service charges, and gratuity payments are generally exempt."
    },
    {
      question: "How are monthly EPF deposits split into Akaun 1, 2, and 3?",
      answer: "Under the restructured 3-Account system, all incoming EPF deposits are split into Akaun Persaraan (Account 1 - 75%), Akaun Sejahtera (Account 2 - 15%), and Akaun Fleksibel (Account 3 - 10%)."
    },
    {
      question: "Can I make voluntary self-contributions to my EPF?",
      answer: "Yes! Malaysian citizens and foreign employees can make voluntary self-contributions up to a maximum of RM 100,000 per year via the i-Akaun portal, online banking, or KWSP counters."
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <SEOManager
        title="EPF Calculator Malaysia | KWSP Contribution & Growth Projection"
        description="Calculate monthly and annual EPF (KWSP) employee (11%/9%) and employer (13%/12%) statutory contributions. View 5, 10, 20 year future growth projections and 3-account distribution."
        canonicalUrl="https://sequenxe.com/epf-calculator"
        calculatorId="epf-calculator"
        faqs={faqs}
        breadcrumbs={[
          { name: 'Home', url: 'https://sequenxe.com/' },
          { name: 'EPF Calculator Malaysia', url: 'https://sequenxe.com/epf-calculator' }
        ]}
      />

      {/* Breadcrumb & Hero (web-only) */}
      <div className="no-print">
        <Breadcrumb items={[
          { label: 'Home', href: 'home' },
          { label: 'Salary & Tax', href: 'home' },
          { label: 'EPF Calculator Malaysia' }
        ]} />

        <CalculatorHero
          title="EPF Calculator Malaysia"
          description="Accurate estimator for KWSP employee (11%/9%) and employer (13%/12%) statutory contributions. Explore 5, 10, and 20-year compounding growth projections and Akaun 1, 2, 3 distribution."
          estimatedTime="2 mins"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Input Panel */}
        <div className="lg:col-span-5 space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-border-custom shadow-xs no-print">
          <div className="flex items-center justify-between border-b border-border-custom pb-4">
            <h2 className="text-base font-bold text-text-primary font-display uppercase tracking-wide">
              Salary & Rate Inputs
            </h2>
            <div className="flex items-center gap-3">
              {hasSavedIndicator && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 animate-pulse">
                  <BookmarkCheck className="h-3 w-3" /> Auto-Saved
                </span>
              )}
              <button 
                onClick={handleReset} 
                className="text-xs font-semibold text-text-secondary hover:text-primary flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">
                Gross Monthly Salary (RM)
              </label>
              <div className="relative">
                <span className="absolute top-3 left-3 text-xs font-semibold text-text-secondary">RM</span>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={grossSalary}
                  onChange={(e) => handleChange('grossSalary', Math.max(0, Number(e.target.value)))}
                  className="w-full rounded-xl border border-border-custom bg-bg-custom pl-10 pr-3 py-2.5 text-xs font-bold text-text-primary focus:border-primary focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">
                Employee EPF Rate (%)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleChange('employeeRate', 11)}
                  className={`py-2 text-xs font-bold rounded-xl border cursor-pointer transition-all ${
                    employeeRate === 11 ? 'bg-primary text-white border-primary shadow-xs' : 'bg-bg-custom text-text-primary border-border-custom hover:bg-white'
                  }`}
                >
                  11% (Standard)
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('employeeRate', 9)}
                  className={`py-2 text-xs font-bold rounded-xl border cursor-pointer transition-all ${
                    employeeRate === 9 ? 'bg-primary text-white border-primary shadow-xs' : 'bg-bg-custom text-text-primary border-border-custom hover:bg-white'
                  }`}
                >
                  9% (Reduced)
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('employeeRate', 0)}
                  className={`py-2 text-xs font-bold rounded-xl border cursor-pointer transition-all ${
                    employeeRate === 0 ? 'bg-primary text-white border-primary shadow-xs' : 'bg-bg-custom text-text-primary border-border-custom hover:bg-white'
                  }`}
                >
                  0% (Exempt)
                </button>
              </div>
            </div>

            {/* Auto Employer Rate Status Badge */}
            <div className="bg-bg-custom/80 border border-border-custom rounded-xl p-3 flex justify-between items-center text-xs">
              <span className="text-text-secondary">Auto-Applied Employer Rate:</span>
              <span className={`font-mono font-bold px-2.5 py-1 rounded-md ${
                employerEpfInfo.isOverridden 
                  ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              }`}>
                {employerEpfInfo.rate}% {employerEpfInfo.isOverridden ? '(Overridden)' : '(Statutory Schedule)'}
              </span>
            </div>

            {/* Advanced Settings Accordion */}
            <div className="border border-border-custom rounded-xl overflow-hidden shadow-2xs">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full bg-bg-custom/50 p-3 flex justify-between items-center text-left hover:bg-bg-custom/80 transition-colors cursor-pointer text-xs font-bold text-text-primary"
              >
                <div className="flex items-center gap-2">
                  <Settings2 className="h-3.5 w-3.5 text-primary" />
                  <span>Advanced Settings: Employer EPF Rate Override</span>
                </div>
                {showAdvanced ? <ChevronUp className="h-3.5 w-3.5 text-text-secondary" /> : <ChevronDown className="h-3.5 w-3.5 text-text-secondary" />}
              </button>

              {showAdvanced && (
                <div className="p-4 bg-white border-t border-border-custom space-y-3 text-xs">
                  <p className="text-[11px] text-text-secondary leading-relaxed">
                    Statutory schedule applies 13% for &le; RM 5,000 and 12% for &gt; RM 5,000. Override only if your contract grants extra benefit rates (e.g. 15%, 17%, 19%).
                  </p>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="font-semibold text-text-primary">Custom Rate Option</label>
                      {employerOverrideRate !== undefined && (
                        <button
                          type="button"
                          onClick={() => handleChange('employerOverrideRate', undefined)}
                          className="text-[10px] text-primary hover:underline font-semibold"
                        >
                          Clear Override (Use Schedule)
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-4 gap-2 pt-1">
                      {[12, 13, 15, 17].map((override) => (
                        <button
                          key={override}
                          type="button"
                          onClick={() => handleChange('employerOverrideRate', override)}
                          className={`py-1.5 px-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                            employerOverrideRate === override 
                              ? 'border-amber-500 bg-amber-50 text-amber-900 font-extrabold' 
                              : 'border-border-custom bg-white text-text-secondary hover:bg-bg-custom'
                          }`}
                        >
                          {override}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">
                Voluntary Self-Contribution (RM / Month)
              </label>
              <div className="relative">
                <span className="absolute top-3 left-3 text-xs font-semibold text-text-secondary">RM</span>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={voluntaryContribution}
                  onChange={(e) => handleChange('voluntaryContribution', Math.max(0, Number(e.target.value)))}
                  className="w-full rounded-xl border border-border-custom bg-bg-custom pl-10 pr-3 py-2.5 text-xs font-bold text-text-primary focus:border-primary focus:bg-white focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-text-secondary mt-1">
                Voluntary self-add cap is RM 100,000/year under KWSP regulations.
              </p>
            </div>

            <div className="pt-2 border-t border-border-custom">
              <label className="block text-xs font-semibold text-text-primary mb-1">
                Assumed Dividend Compounding Rate (% p.a.)
              </label>
              <div className="relative">
                <span className="absolute top-3 right-3 text-xs font-semibold text-text-secondary">%</span>
                <input
                  type="number"
                  min="1"
                  max="12"
                  step="0.1"
                  value={assumedDividend}
                  onChange={(e) => handleChange('assumedDividend', Math.max(1, Number(e.target.value)))}
                  className="w-full rounded-xl border border-border-custom bg-bg-custom pl-3 pr-7 py-2.5 text-xs font-bold text-text-primary focus:border-primary focus:bg-white focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-text-secondary mt-1">
                EPF historical dividend averages between 5.40% to 6.50% annually.
              </p>
            </div>
          </div>
          {/* Mandatory Disclaimer */}
          <Disclaimer />
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="flex justify-end no-print">
            <ExportButtons 
              onPrint={() => window.print()} 
              onCopyMarkdown={handleCopyMarkdown} 
              onExportCsv={handleExportCsv} 
              title="EPF Contribution Summary"
            />
          </div>
          
          {/* Monthly & Annual Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="bg-gradient-to-br from-[#8B1A34] via-[#6D1026] to-[#4F0B1B] text-white rounded-2xl p-6 shadow-xl shadow-[#6D1026]/20 space-y-2 border border-white/20 backdrop-blur-md relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-rose-300/15 rounded-full blur-2xl pointer-events-none"></div>
              <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-100/80 block">
                Total Monthly EPF Deposit
              </span>
              <h2 className="font-display font-black text-3xl tracking-tight text-white">
                RM {totalMonthlyContribution.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
              <div className="pt-2 border-t border-white/20 text-xs text-rose-100/90 flex justify-between items-center">
                <span>Employee: RM {employeeContribution}</span>
                <span>Employer: RM {employerContribution}</span>
              </div>
            </div>

            <div className="bg-white border border-border-custom rounded-2xl p-6 shadow-xs space-y-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-text-secondary block">
                Total Annual EPF Deposit
              </span>
              <h2 className="font-display font-bold text-3xl text-text-primary tracking-tight">
                RM {totalAnnualContribution.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
              <div className="pt-2 border-t border-border-custom text-xs text-text-secondary flex justify-between items-center">
                <span>12 Months Cumulative</span>
                <span className="font-mono font-bold text-emerald-700">Tax Shielded</span>
              </div>
            </div>
          </div>

          <ExportButtons onExportCsv={handleExportCsv} onCopyMarkdown={handleCopyMarkdown} title="EPF Report" />

          {/* Annual Contribution Breakdown Grid */}
          <div className="bg-white border border-border-custom rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-border-custom pb-3">
              <h3 className="font-display font-bold text-sm text-text-primary uppercase tracking-wide flex items-center gap-2">
                <Coins className="h-4 w-4 text-primary" />
                Annual Contribution Summary
              </h3>
              <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                1 Year Snapshot
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-bg-custom/60 border border-border-custom rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase text-text-secondary block">Employee Share ({employeeRate}%)</span>
                <span className="font-display font-bold text-base text-text-primary">
                  RM {(employeeContribution * 12).toLocaleString('en-MY')}
                </span>
                <span className="text-[10px] text-text-secondary block">RM {employeeContribution.toFixed(2)} / month</span>
              </div>

              <div className="p-3.5 bg-bg-custom/60 border border-border-custom rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase text-primary block">Employer Share ({effectiveEmployerRate}%)</span>
                <span className="font-display font-bold text-base text-primary">
                  RM {(employerContribution * 12).toLocaleString('en-MY')}
                </span>
                <span className="text-[10px] text-text-secondary block">RM {employerContribution.toFixed(2)} / month</span>
              </div>

              <div className="p-3.5 bg-bg-custom/60 border border-border-custom rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase text-amber-700 block">Total Annual Deposit</span>
                <span className="font-display font-bold text-base text-text-primary">
                  RM {totalAnnualContribution.toLocaleString('en-MY')}
                </span>
                <span className="text-[10px] text-text-secondary block">RM {totalMonthlyContribution.toFixed(2)} / month</span>
              </div>
            </div>
          </div>

          {/* Charts Section: Employee vs Employer & 3-Account Distribution */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Chart 1: Employee vs Employer */}
            <div className="bg-white border border-border-custom rounded-2xl p-5 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider font-mono border-b border-border-custom pb-2 flex items-center gap-1.5">
                <PieChartIcon className="h-3.5 w-3.5 text-primary" />
                Employee vs Employer Share
              </h4>
              <div className="h-40 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={contribChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={55}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {contribChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: number) => [`RM ${val.toLocaleString('en-MY')}`, 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between items-center text-text-secondary">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#7A2436]" />
                    Employee ({employeeRate}%)
                  </span>
                  <span className="font-mono font-bold text-text-primary">RM {employeeContribution.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-text-secondary">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#C28A00]" />
                    Employer ({effectiveEmployerRate}%)
                  </span>
                  <span className="font-mono font-bold text-primary">RM {employerContribution.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Chart 2: 3-Account Distribution */}
            <div className="bg-white border border-border-custom rounded-2xl p-5 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider font-mono border-b border-border-custom pb-2 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-primary" />
                3-Account Distribution
              </h4>
              <div className="h-40 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={accountChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={55}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {accountChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: number) => [`RM ${val.toLocaleString('en-MY')}`, 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between items-center text-text-secondary">
                  <span>Akaun Persaraan (75%)</span>
                  <span className="font-mono font-bold text-text-primary">RM {akaunPersaraan.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-text-secondary">
                  <span>Akaun Sejahtera (15%)</span>
                  <span className="font-mono font-bold text-text-primary">RM {akaunSejahtera.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-text-secondary">
                  <span>Akaun Fleksibel (10%)</span>
                  <span className="font-mono font-bold text-amber-700">RM {akaunFleksibel.toFixed(2)}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Future EPF Growth Projections (5, 10, 20 Years) */}
          <div className="bg-white border border-border-custom rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-border-custom pb-3">
              <div>
                <h3 className="font-display font-bold text-sm text-text-primary uppercase tracking-wide flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Future EPF Growth Projections
                </h3>
                <p className="text-[11px] text-text-secondary mt-0.5">
                  Estimated compounding growth assuming constant RM {totalMonthlyContribution.toLocaleString('en-MY')}/month deposit at {assumedDividend}% p.a.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* 5 Years */}
              <div className="p-4 bg-gradient-to-b from-bg-custom to-white border border-border-custom rounded-xl space-y-2">
                <div className="flex justify-between items-center border-b border-border-custom pb-1.5">
                  <span className="text-xs font-bold text-text-primary font-mono">5 Years</span>
                  <span className="text-[10px] text-primary font-bold">Medium Term</span>
                </div>
                <div>
                  <span className="text-[10px] text-text-secondary block">Projected Total</span>
                  <span className="font-display font-black text-lg text-primary">
                    RM {projection5.totalBalance.toLocaleString('en-MY')}
                  </span>
                </div>
                <div className="pt-2 border-t border-border-custom/60 text-[10px] space-y-1 text-text-secondary">
                  <div className="flex justify-between">
                    <span>Deposits:</span>
                    <span className="font-mono text-text-primary">RM {projection5.principal.toLocaleString('en-MY')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dividends Earned:</span>
                    <span className="font-mono font-bold text-emerald-700">+RM {projection5.interest.toLocaleString('en-MY')}</span>
                  </div>
                </div>
              </div>

              {/* 10 Years */}
              <div className="p-4 bg-gradient-to-b from-bg-custom to-white border border-border-custom rounded-xl space-y-2">
                <div className="flex justify-between items-center border-b border-border-custom pb-1.5">
                  <span className="text-xs font-bold text-text-primary font-mono">10 Years</span>
                  <span className="text-[10px] text-primary font-bold">Long Term</span>
                </div>
                <div>
                  <span className="text-[10px] text-text-secondary block">Projected Total</span>
                  <span className="font-display font-black text-lg text-primary">
                    RM {projection10.totalBalance.toLocaleString('en-MY')}
                  </span>
                </div>
                <div className="pt-2 border-t border-border-custom/60 text-[10px] space-y-1 text-text-secondary">
                  <div className="flex justify-between">
                    <span>Deposits:</span>
                    <span className="font-mono text-text-primary">RM {projection10.principal.toLocaleString('en-MY')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dividends Earned:</span>
                    <span className="font-mono font-bold text-emerald-700">+RM {projection10.interest.toLocaleString('en-MY')}</span>
                  </div>
                </div>
              </div>

              {/* 20 Years */}
              <div className="p-4 bg-gradient-to-b from-bg-custom to-white border border-primary/30 rounded-xl space-y-2 relative overflow-hidden">
                <div className="flex justify-between items-center border-b border-border-custom pb-1.5">
                  <span className="text-xs font-bold text-primary font-mono">20 Years</span>
                  <span className="text-[10px] bg-primary text-white font-bold px-1.5 py-0.5 rounded">Compound Power</span>
                </div>
                <div>
                  <span className="text-[10px] text-text-secondary block">Projected Total</span>
                  <span className="font-display font-black text-lg text-primary">
                    RM {projection20.totalBalance.toLocaleString('en-MY')}
                  </span>
                </div>
                <div className="pt-2 border-t border-border-custom/60 text-[10px] space-y-1 text-text-secondary">
                  <div className="flex justify-between">
                    <span>Deposits:</span>
                    <span className="font-mono text-text-primary">RM {projection20.principal.toLocaleString('en-MY')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dividends Earned:</span>
                    <span className="font-mono font-bold text-emerald-700">+RM {projection20.interest.toLocaleString('en-MY')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Educational Sections (Collapsible Accordions) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 no-print">
        
        {/* How EPF is Calculated */}
        <CollapsibleBox
          title="How EPF Contributions are Calculated"
          icon={<Info className="h-4 w-4" />}
        >
          <p className="text-xs text-text-secondary leading-relaxed">
            Statutory EPF (KWSP) contributions are computed as standard percentage rates applied to an employee's monthly gross wages:
          </p>
          <ul className="text-xs text-text-secondary space-y-2 list-disc pl-4 pt-1">
            <li><strong>Employee Contribution (11% / 9%)</strong>: Deducted directly from basic wage, overtime, allowances, and bonuses on your monthly payslip.</li>
            <li><strong>Employer Contribution (13% / 12%)</strong>: Paid directly by the employer into your EPF account without deducting from your basic wage.</li>
            <li><strong>Wage Types Covered</strong>: Basic salary, overtime payments, commissions, taxable allowances, and bonuses.</li>
          </ul>
        </CollapsibleBox>

        {/* Why Employer Contributions Differ */}
        <CollapsibleBox
          title="Why Employer Rates Differ from Employee Rates"
          icon={<ShieldCheck className="h-4 w-4" />}
        >
          <p className="text-xs text-text-secondary leading-relaxed">
            Under the Malaysian Employees Provident Fund Act 1991:
          </p>
          <ul className="text-xs text-text-secondary space-y-2 list-disc pl-4 pt-1">
            <li><strong>Salary Tier (RM 5,000 threshold)</strong>: Employers pay a higher <strong>13%</strong> rate for employees earning RM 5,000 or below, and <strong>12%</strong> for those earning above RM 5,000.</li>
            <li><strong>Social Safety Objective</strong>: The higher 13% rate provides additional statutory financial shielding for lower and middle-income workers.</li>
            <li><strong>Age-Based Tiers</strong>: Employees aged 60 and above enjoy reduced statutory rates to encourage senior workplace employment.</li>
          </ul>
        </CollapsibleBox>

      </div>

      {/* Rule-Based Insights */}
      <div className="space-y-4 no-print">
        <SectionHeader title="EPF Optimization Insights" badge="Rules-Based" />
        <InsightCards insights={insights} />
      </div>

      {/* Formula Explanation */}
      <div className="no-print">
        <FormulaExplanation 
          what="EPF combines joint employee deductions and employer contributions, compounding monthly with historical annual dividend returns."
          formula={
            <code className="block font-mono bg-bg-custom p-2.5 rounded-md text-[11px] text-primary">
              Monthly EPF Deposit = (Gross Wage × Employee Rate) + (Gross Wage × Employer Rate) + Voluntary
            </code>
          }
          why="Monthly statutory EPF deposits accumulate into a tax-shielded retirement nest egg with consistent long-term dividend returns."
        />
      </div>

      {/* FAQs */}
      <div className="space-y-4 no-print">
        <SectionHeader title="Frequently Asked Questions (FAQ)" badge="EPF FAQ" />
        <FAQSection faqs={faqs} />
      </div>

    </div>
  );
}

