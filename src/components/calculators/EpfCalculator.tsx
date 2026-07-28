import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  RefreshCw, 
  TrendingUp, 
  BookmarkCheck,
  Target,
  Award,
  Clock,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Zap,
  CalendarCheck
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { EpfInputs, EpfOutputs } from '../../types';
import { calculateEpfProjection } from '../../utils/formulas';
import { calculateEpfReadinessScore } from '../../utils/epfReadiness';
import { useSaveConfig } from '../../hooks/useSaveConfig';
import SEOManager from './shared/SEOManager';
import { 
  Breadcrumb, 
  CalculatorHero, 
  SectionHeader, 
  SummaryCard, 
  ExportButtons, 
  InsightCards, 
  FormulaExplanation, 
  FAQSection, 
  Disclaimer,
  Tooltip as AppTooltip
} from './shared/CommonComponents';

const DEFAULT_INPUTS: EpfInputs = {
  currentAge: 25,
  retirementAge: 55,
  currentBalance: 15000,
  salary: 4500,
  salaryIncrement: 4,
  employeeRate: 11,
  employerRate: 13,
  dividendRate: 5.4
};

export default function EpfCalculator() {
  const { values: inputs, setValues: setInputs, resetConfig, hasSavedIndicator } = useSaveConfig<EpfInputs>('epf_retirement', DEFAULT_INPUTS);
  const [outputs, setOutputs] = useState<EpfOutputs | null>(null);
  const [activeTab, setActiveTab] = useState<'distribution' | 'growth' | 'breakdown'>('distribution');
  const [withdrawalYears, setWithdrawalYears] = useState<20 | 25 | 30>(20);

  useEffect(() => {
    const results = calculateEpfProjection(inputs);
    setOutputs(results);
  }, [inputs]);

  if (!outputs) return null;

  const handleReset = () => {
    resetConfig();
    setActiveTab('distribution');
    setWithdrawalYears(20);
  };

  const handleInputChange = (field: keyof EpfInputs, value: any) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Recharts Pie Chart data
  const chartData = [
    { name: 'Akaun Persaraan (75%)', value: outputs.accountBreakdown.akaunPersaraan, color: '#7A2436' },
    { name: 'Akaun Sejahtera (15%)', value: outputs.accountBreakdown.akaunSejahtera, color: '#B15066' },
    { name: 'Akaun Fleksibel (10%)', value: outputs.accountBreakdown.akaunFleksibel, color: '#C28A00' }
  ];

  // 1. Multi-factor Weighted Retirement Readiness Score (0-100)
  const readiness = calculateEpfReadinessScore(inputs, outputs);
  const readinessScore = readiness.overallScore;
  const readinessStatus = {
    label: readiness.statusLabel,
    color: readiness.statusColor,
    barColor: readiness.barColor,
    desc: readiness.statusDescription
  };

  // 2. Estimated Monthly Retirement Income
  const monthlyIncome = Math.round(outputs.projectedBalance / (withdrawalYears * 12));

  // 3. Progress toward RM240,000 Target
  const targetBasicSavings = 240000; // KWSP Basic Savings benchmark at age 55
  const targetProgressPercent = Math.min(100, Math.round((outputs.projectedBalance / targetBasicSavings) * 100));

  // 4. Financial Breakdown Calculations
  const totalFutureContributions = Math.round(outputs.yearlyGrowth.reduce((acc, row) => acc + row.employeeContrib + row.employerContrib, 0));
  const totalDividendsEarned = Math.round(outputs.yearlyGrowth.reduce((acc, row) => acc + row.dividends, 0));

  // Copy Summary text to Clipboard
  const handleCopyMarkdown = () => {
    const summaryText = `### EPF (KWSP) Retirement Calculation Report
- **Current Age**: ${inputs.currentAge} years old
- **Target Retirement Age**: ${inputs.retirementAge} years old
- **Projected EPF Balance at retirement**: RM ${outputs.projectedBalance.toLocaleString('en-MY', { maximumFractionDigits: 0 })}
- **Overall Readiness Score**: ${readiness.overallScore}/100 (${readiness.statusLabel})
- **Score Breakdown**:
  - Real Income Adequacy: ${readiness.factors.realIncomeAdequacy.score}/${readiness.factors.realIncomeAdequacy.maxScore}
  - Contribution Rate: ${readiness.factors.contributionRate.score}/${readiness.factors.contributionRate.maxScore}
  - Years Until Retirement: ${readiness.factors.yearsToRetire.score}/${readiness.factors.yearsToRetire.maxScore}
  - Salary Growth Assumption: ${readiness.factors.salaryGrowth.score}/${readiness.factors.salaryGrowth.maxScore}
  - Dividend & Inflation Realism: ${readiness.factors.dividendAssumption.score}/${readiness.factors.dividendAssumption.maxScore}
- **Estimated Monthly Income (${withdrawalYears} Yrs)**: RM ${monthlyIncome.toLocaleString('en-MY', { maximumFractionDigits: 0 })}/month
- **3-Account Division**:
  - Akaun Persaraan (Account 1 - 75%): RM ${outputs.accountBreakdown.akaunPersaraan.toLocaleString('en-MY', { maximumFractionDigits: 0 })}
  - Akaun Sejahtera (Account 2 - 15%): RM ${outputs.accountBreakdown.akaunSejahtera.toLocaleString('en-MY', { maximumFractionDigits: 0 })}
  - Akaun Fleksibel (Account 3 - 10%): RM ${outputs.accountBreakdown.akaunFleksibel.toLocaleString('en-MY', { maximumFractionDigits: 0 })}
- **Underlying Assumptions**:
  - Current Salary: RM ${inputs.salary.toLocaleString('en-MY')}/month
  - Average Dividend: ${inputs.dividendRate}% per annum
  - Average Salary Increment: ${inputs.salaryIncrement}% per annum`;

    navigator.clipboard.writeText(summaryText);
  };

  // 6. Milestone Timeline
  const milestones = [
    { target: 100000, label: 'RM 100k' },
    { target: 250000, label: 'RM 250k' },
    { target: 500000, label: 'RM 500k' },
    { target: 1000000, label: 'RM 1M' }
  ];

  const milestoneResults = milestones.map(m => {
    const found = outputs.yearlyGrowth.find(r => r.balance >= m.target);
    return {
      ...m,
      reached: !!found,
      age: found ? found.age : null,
      year: found ? found.year : null
    };
  });

  // Rule-based insights
  const insights = [
    {
      type: (outputs.projectedBalance >= targetBasicSavings ? 'success' : 'warning') as 'success' | 'warning',
      title: "KWSP Basic Adequacy Benchmark",
      text: outputs.projectedBalance >= targetBasicSavings
        ? `Exceeds the Malaysian KWSP basic savings adequacy benchmark of RM ${targetBasicSavings.toLocaleString('en-MY')} by RM ${(outputs.projectedBalance - targetBasicSavings).toLocaleString('en-MY', { maximumFractionDigits: 0 })}.`
        : `Below the KWSP standard recommended basic retirement target of RM ${targetBasicSavings.toLocaleString('en-MY')}. Consider raising your savings rate.`
    },
    {
      type: 'success' as const,
      title: "Dividend Compounding Power",
      text: `Dividends will generate RM ${totalDividendsEarned.toLocaleString('en-MY')} (${Math.round((totalDividendsEarned / outputs.projectedBalance) * 100)}% of your final nest egg) at ${inputs.dividendRate}% p.a.`
    },
    {
      type: 'info' as const,
      title: "Akaun Fleksibel (Account 3)",
      text: `Your Akaun Fleksibel portion will accumulate RM ${outputs.accountBreakdown.akaunFleksibel.toLocaleString('en-MY', { maximumFractionDigits: 0 })} (10%). Minimizing withdrawals protects compounding.`
    },
    {
      type: 'info' as const,
      title: "Voluntary Self-Contributions",
      text: "You can self-contribute up to RM 100,000 annually into EPF tax-free, earning full dividends to boost your retirement pool."
    }
  ];

  // FAQ structured dataset
  const faqs = [
    {
      question: "How is the EPF Retirement Readiness Score calculated?",
      answer: "The readiness score uses a multi-factor weighted scoring model (0–100) combining 5 core factors: Projected EPF balance vs KWSP Basic Savings benchmark (50 pts max), Employee and Employer contribution rates (20 pts max), Years remaining until retirement / compounding horizon (15 pts max), Annual salary growth rate (10 pts max), and EPF dividend rate assumption (5 pts max). Scores are categorized into 5 status tiers: Critical (0-39), Needs Improvement (40-59), Good (60-79), Very Good (80-94), and Excellent (95-100)."
    },
    {
      question: "What is the KWSP basic savings target of RM 240,000?",
      answer: "KWSP sets a minimum basic savings benchmark of RM 240,000 at age 55, designed to support a minimum basic RM 1,000 monthly stipend over a 20-year post-retirement lifespan."
    },
    {
      question: "How does EPF dividend compounding work?",
      answer: "EPF dividends are accrued daily and credited annually. Over 20–30 years, compound interest generates a huge portion of your final balance — often exceeding your total actual monthly cash deposits."
    },
    {
      question: "How does the 3-Account EPF structure work?",
      answer: "Contributions are split as follows: 75% to Akaun Persaraan (Account 1 - locked for retirement), 15% to Akaun Sejahtera (Account 2 - housing/medical/education), and 10% to Akaun Fleksibel (Account 3 - flexible daily withdrawals)."
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <SEOManager 
        title="EPF Retirement Calculator"
        description="Project your future EPF (KWSP) retirement savings balance, retirement readiness score, monthly retirement income, and 3-account distribution."
        canonicalUrl="https://sequenxe.com/epf-retirement-calculator"
        calculatorId="epf-retirement-calculator"
        faqs={faqs}
        breadcrumbs={[
          { name: 'Home', url: 'https://sequenxe.com/' },
          { name: 'Savings & Retirement', url: 'https://sequenxe.com/' },
          { name: 'EPF Retirement Calculator', url: 'https://sequenxe.com/epf-retirement-calculator' }
        ]}
      />

      {/* 1. Breadcrumb & Hero */}
      <div className="no-print">
        <Breadcrumb 
          currentName="EPF Retirement Calculator" 
          onHomeClick={() => {
            const navEvent = new CustomEvent('change-view', { detail: 'home' });
            window.dispatchEvent(navEvent);
          }} 
        />

        <CalculatorHero 
          title="EPF Retirement Calculator"
          description="Project your future KWSP retirement balance at age 55/60. Calculate retirement readiness, estimated monthly income, milestone targets, and 3-account splits."
          estimatedTime="3 mins"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Column */}
        <div className="lg:col-span-5 bg-white border border-border-custom rounded-2xl p-6 sm:p-8 shadow-xs space-y-5 no-print">
          <div className="flex justify-between items-center border-b border-border-custom pb-3">
            <h2 className="font-display font-bold text-base text-text-primary uppercase tracking-wide">
              Retirement Variables
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
                title="Reset form variables to default"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Reset
              </button>
            </div>
          </div>

          {/* Current & Retirement Age */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <label htmlFor="currentAge" className="text-sm font-semibold text-text-primary">
                  Current Age
                </label>
                <AppTooltip content="Your current chronological age (16–100)." />
              </div>
              <input
                id="currentAge"
                type="number"
                min="16"
                max="100"
                value={inputs.currentAge}
                onChange={(e) => handleInputChange('currentAge', Math.max(16, parseInt(e.target.value) || 16))}
                className="h-11 w-full rounded-xl border border-border-custom bg-bg-custom px-4 text-sm font-semibold text-text-primary focus:border-primary focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <label htmlFor="retirementAge" className="text-sm font-semibold text-text-primary">
                  Retirement Age
                </label>
                <AppTooltip content="Target retirement age (KWSP standard full withdrawal starts at age 55)." />
              </div>
              <select
                id="retirementAge"
                value={inputs.retirementAge}
                onChange={(e) => handleInputChange('retirementAge', parseInt(e.target.value) || 55)}
                className="h-11 w-full rounded-xl border border-border-custom bg-bg-custom px-4 text-sm font-semibold text-text-primary focus:border-primary focus:outline-none cursor-pointer"
              >
                {[50, 55, 60, 65].map((age) => (
                  <option key={age} value={age}>Age {age} (Target)</option>
                ))}
              </select>
            </div>
          </div>

          {/* Current EPF Balance */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <label htmlFor="currentBalance" className="text-sm font-semibold text-text-primary">
                Current EPF Balance (RM)
              </label>
              <AppTooltip content="Combined savings inside your existing EPF Accounts 1, 2, and 3." />
            </div>
            <div className="relative">
              <span className="absolute top-3 left-4 text-sm font-semibold text-text-secondary">RM</span>
              <input
                id="currentBalance"
                type="number"
                min="0"
                step="1000"
                value={inputs.currentBalance}
                onChange={(e) => handleInputChange('currentBalance', Math.max(0, parseFloat(e.target.value) || 0))}
                className="h-11 w-full rounded-xl border border-border-custom bg-bg-custom pl-11 pr-4 text-sm font-semibold text-text-primary focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Monthly Gross Salary */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <label htmlFor="salary" className="text-sm font-semibold text-text-primary">
                Monthly Gross Salary (RM)
              </label>
              <AppTooltip content="Basic monthly salary used for statutory EPF contributions." />
            </div>
            <div className="relative">
              <span className="absolute top-3 left-4 text-sm font-semibold text-text-secondary">RM</span>
              <input
                id="salary"
                type="number"
                min="0"
                step="500"
                value={inputs.salary}
                onChange={(e) => handleInputChange('salary', Math.max(0, parseFloat(e.target.value) || 0))}
                className="h-11 w-full rounded-xl border border-border-custom bg-bg-custom pl-11 pr-4 text-sm font-semibold text-text-primary focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Employee & Employer Rates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <label htmlFor="employeeRate" className="text-xs font-bold text-text-primary block">
                  Employee Rate (%)
                </label>
              </div>
              <div className="relative">
                <span className="absolute top-3 right-3 text-xs font-semibold text-text-secondary">%</span>
                <input
                  id="employeeRate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={inputs.employeeRate}
                  onChange={(e) => handleInputChange('employeeRate', Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                  className="h-11 w-full rounded-xl border border-border-custom bg-bg-custom pl-3 pr-7 text-xs font-semibold text-text-primary focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <label htmlFor="employerRate" className="text-xs font-bold text-text-primary block">
                  Employer Rate (%)
                </label>
              </div>
              <div className="relative">
                <span className="absolute top-3 right-3 text-xs font-semibold text-text-secondary">%</span>
                <input
                  id="employerRate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={inputs.employerRate}
                  onChange={(e) => handleInputChange('employerRate', Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                  className="h-11 w-full rounded-xl border border-border-custom bg-bg-custom pl-3 pr-7 text-xs font-semibold text-text-primary focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Increments & Dividends */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <label htmlFor="salaryIncrement" className="text-xs font-bold text-text-primary block">
                  Annual Raise (%)
                </label>
              </div>
              <div className="relative">
                <span className="absolute top-3 right-3 text-xs font-semibold text-text-secondary">%</span>
                <input
                  id="salaryIncrement"
                  type="number"
                  min="0"
                  max="30"
                  step="0.5"
                  value={inputs.salaryIncrement}
                  onChange={(e) => handleInputChange('salaryIncrement', Math.max(0, parseFloat(e.target.value) || 0))}
                  className="h-11 w-full rounded-xl border border-border-custom bg-bg-custom pl-3 pr-7 text-xs font-semibold text-text-primary focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <label htmlFor="dividendRate" className="text-xs font-bold text-text-primary block">
                  EPF Dividend (%)
                </label>
              </div>
              <div className="relative">
                <span className="absolute top-3 right-3 text-xs font-semibold text-text-secondary">%</span>
                <input
                  id="dividendRate"
                  type="number"
                  min="1"
                  max="15"
                  step="0.1"
                  value={inputs.dividendRate}
                  onChange={(e) => handleInputChange('dividendRate', Math.max(1, parseFloat(e.target.value) || 1))}
                  className="h-11 w-full rounded-xl border border-border-custom bg-bg-custom pl-3 pr-7 text-xs font-semibold text-text-primary focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          <Disclaimer />
        </div>

        {/* Live Results Column */}
        <div className="lg:col-span-7 space-y-6">

          {/* Feature 1 & 2: Retirement Readiness Score & Estimated Monthly Income */}
          <div className="bg-gradient-to-br from-[#8B1A34] via-[#6D1026] to-[#4F0B1B] text-white rounded-2xl p-6 shadow-xl space-y-6 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-rose-300/15 rounded-full blur-2xl pointer-events-none" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
              {/* Readiness Score */}
              <div className="space-y-2 border-b sm:border-b-0 sm:border-r border-white/15 pb-4 sm:pb-0 sm:pr-4">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-rose-200" />
                  <span className="text-xs uppercase font-mono tracking-wider text-rose-100/80 font-bold">Readiness Score</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="font-display font-black text-4xl text-white tracking-tight">
                    {readinessScore}
                  </span>
                  <span className="text-xs text-rose-200 font-mono font-bold">/ 100</span>
                  <span className={`text-[10px] uppercase font-mono font-extrabold px-2.5 py-0.5 rounded-md border ${readinessStatus.color}`}>
                    {readinessStatus.label}
                  </span>
                </div>
                <p className="text-[11px] text-rose-100/80 leading-relaxed">
                  {readinessStatus.desc}
                </p>
              </div>

              {/* Estimated Monthly Income */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-rose-200" />
                    <span className="text-xs uppercase font-mono tracking-wider text-rose-100/80 font-bold">Est. Monthly Payout</span>
                  </div>
                  {/* Withdrawal Option Buttons */}
                  <div className="flex items-center bg-black/20 p-0.5 rounded-lg border border-white/10 text-[10px] font-mono">
                    {[20, 25, 30].map(y => (
                      <button
                        key={y}
                        onClick={() => setWithdrawalYears(y as any)}
                        className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${withdrawalYears === y ? 'bg-white text-primary font-bold' : 'text-rose-200 hover:text-white'}`}
                      >
                        {y}y
                      </button>
                    ))}
                  </div>
                </div>

                <div className="font-display font-black text-3xl text-white tracking-tight">
                  RM {monthlyIncome.toLocaleString('en-MY')} <span className="text-xs font-normal text-rose-200">/ mo</span>
                </div>
                <p className="text-[11px] text-rose-100/80 leading-relaxed">
                  {withdrawalYears}-yr horizon (age {inputs.retirementAge}–{inputs.retirementAge + withdrawalYears}).
                </p>
              </div>
            </div>

            {/* Feature 3: Progress Bar toward Target Aligned with Readiness Score */}
            <div className="border-t border-white/15 pt-4 space-y-2 relative z-10">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-rose-100 flex items-center gap-1.5">
                  <Target className="h-4 w-4 text-rose-300" />
                  Target Progress (KWSP Basic RM240,000)
                </span>
                <span className="font-mono text-white font-bold">{readinessScore}%</span>
              </div>
              <div className="h-3 w-full bg-black/30 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    readinessScore >= 80 ? 'bg-emerald-400' :
                    readinessScore >= 60 ? 'bg-emerald-400' :
                    readinessScore >= 40 ? 'bg-amber-400' : 'bg-rose-400'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, readinessScore))}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-rose-200/80 font-mono">
                <span>Projected: RM {outputs.projectedBalance.toLocaleString('en-MY', { maximumFractionDigits: 0 })}</span>
                <span>KWSP Benchmark: RM 240,000</span>
              </div>
            </div>
          </div>

          {/* Feature 4: Key Financial Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SummaryCard 
              label="Current EPF Balance" 
              value={`RM ${inputs.currentBalance.toLocaleString('en-MY')}`}
              description="Starting savings balance"
              tooltip="Your existing accumulated EPF balance."
            />
            <SummaryCard 
              label="Future Contributions" 
              value={`RM ${totalFutureContributions.toLocaleString('en-MY')}`}
              description="Total employee + employer deposits"
              tooltip="Cumulative future monthly deposits from employee and employer until retirement."
            />
            <SummaryCard 
              label="Total Dividends Earned" 
              value={`RM ${totalDividendsEarned.toLocaleString('en-MY')}`}
              description="Compounded interest earned"
              success
              tooltip="Total interest generated by annual compounding dividends over time."
            />
          </div>

          {/* Summary Tab / Growth Schedule / Score Breakdown Switcher */}
          <div className="flex border-b border-border-custom no-print overflow-x-auto">
            <button
              onClick={() => setActiveTab('distribution')}
              className={`pb-3 text-xs font-extrabold tracking-wider uppercase border-b-2 transition-all px-4 cursor-pointer whitespace-nowrap ${
                activeTab === 'distribution' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              Account splits
            </button>
            <button
              onClick={() => setActiveTab('growth')}
              className={`pb-3 text-xs font-extrabold tracking-wider uppercase border-b-2 transition-all px-4 cursor-pointer whitespace-nowrap ${
                activeTab === 'growth' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              Yearly growth Log
            </button>
            <button
              onClick={() => setActiveTab('breakdown')}
              className={`pb-3 text-xs font-extrabold tracking-wider uppercase border-b-2 transition-all px-4 cursor-pointer whitespace-nowrap ${
                activeTab === 'breakdown' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              Score breakdown
            </button>
          </div>

          {activeTab === 'breakdown' ? (
            <div className="space-y-6 animate-fade-in">
              {/* Inflation & Real Income Purchasing Power Evaluation Card */}
              <div className="bg-white dark:bg-card-custom border border-border-custom rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-border-custom pb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-text-secondary font-bold">
                      Real Income Purchasing Power Evaluation
                    </span>
                    <h3 className="font-display font-black text-lg text-text-primary flex items-center gap-2 mt-0.5">
                      Inflation Adjustment (3.0% p.a. Inflation)
                    </h3>
                  </div>
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold shrink-0">
                    Overall Readiness: <span className="text-primary font-extrabold text-sm">{readiness.overallScore}/100</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  <div className="bg-bg-custom border border-border-custom p-3.5 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase font-mono text-text-secondary font-bold block">Real Nest Egg (Today's RM)</span>
                    <div className="font-display font-black text-sm text-text-primary">
                      RM {Math.round(readiness.inflationDetails.realProjectedBalance).toLocaleString('en-MY')}
                    </div>
                    <p className="text-[10px] text-text-secondary">
                      Nominal: RM {outputs.projectedBalance.toLocaleString('en-MY', { maximumFractionDigits: 0 })} (Discounted over {readiness.inflationDetails.yearsToRetire}y)
                    </p>
                  </div>

                  <div className="bg-bg-custom border border-border-custom p-3.5 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase font-mono text-text-secondary font-bold block">Real Monthly Payout</span>
                    <div className="font-display font-black text-sm text-primary">
                      RM {Math.round(readiness.inflationDetails.realMonthlyIncome).toLocaleString('en-MY')} <span className="text-[10px] font-normal text-text-secondary">/ mo</span>
                    </div>
                    <p className="text-[10px] text-text-secondary">
                      Target: RM {Math.round(readiness.inflationDetails.targetMonthlyIncome).toLocaleString('en-MY')}/mo (65% replacement rate)
                    </p>
                  </div>

                  <div className="bg-bg-custom border border-border-custom p-3.5 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase font-mono text-text-secondary font-bold block">Real Target Coverage</span>
                    <div className={`font-display font-black text-sm ${readiness.inflationDetails.replacementRatio >= 1.0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {(readiness.inflationDetails.replacementRatio * 100).toFixed(0)}%
                    </div>
                    <p className="text-[10px] text-text-secondary">
                      {readiness.inflationDetails.replacementRatio >= 1.0 ? 'Meets real income target' : 'Shortfall in real purchasing power'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Detailed Factor Score Breakdown Card */}
              <div className="bg-white border border-border-custom rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-border-custom pb-4">
                  <div>
                    <h3 className="font-display font-bold text-base text-text-primary uppercase tracking-wide flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Detailed Factor Score Allocation
                    </h3>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Weighted scoring model (0–100) combining 5 core income adequacy and sustainability factors
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-xl text-xs font-mono font-black shrink-0">
                    Score: {readiness.overallScore}/100
                  </div>
                </div>

                {/* Factor breakdown rows */}
                <div className="space-y-4">
                  {readiness.factorList.map((factor) => (
                    <div key={factor.id} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-text-primary">{factor.label}</span>
                          <span className="text-[11px] font-normal text-text-secondary hidden sm:inline">
                            ({factor.note})
                          </span>
                        </div>
                        <span className="font-mono font-bold text-primary shrink-0 ml-2 text-right">
                          {factor.score}/{factor.maxScore}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2.5 flex-1 bg-bg-custom rounded-full overflow-hidden border border-border-custom">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              factor.percentage >= 85 ? 'bg-emerald-500' :
                              factor.percentage >= 70 ? 'bg-blue-500' :
                              factor.percentage >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${Math.min(100, Math.max(0, factor.percentage))}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-text-secondary w-10 text-right">
                          {factor.percentage}%
                        </span>
                      </div>
                      <p className="text-[10px] text-text-secondary sm:hidden">
                        {factor.note}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Score Summary Footer */}
                <div className="pt-3 border-t border-border-custom flex flex-col sm:flex-row justify-between items-center gap-3 bg-bg-custom/50 p-3.5 rounded-xl text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-text-primary">Status Tier:</span>
                    <span className={`text-[11px] uppercase font-mono font-extrabold px-2.5 py-0.5 rounded-md border ${readiness.statusColor}`}>
                      {readiness.statusLabel}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-text-primary">
                    Overall Score: <span className="text-primary font-black text-sm">{readiness.overallScore}/100</span>
                  </span>
                </div>
              </div>
            </div>
          ) : activeTab === 'distribution' ? (
            <div className="space-y-6 animate-fade-in">
              {/* Interactive Charts */}
              <div className="bg-white border border-border-custom rounded-2xl p-6 shadow-xs">
                <SectionHeader title="New 3-Account Splits (KWSP Restructuring)" subtitle="Mandatory distribution of your projected balance according to KWSP policies." />
                <div className="flex flex-col md:flex-row items-center gap-6 pt-2">
                  <div className="w-44 h-44 shrink-0 relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={75}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: any) => [`RM ${value.toLocaleString('en-MY', { maximumFractionDigits: 0 })}`, 'Amount']} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    
                    {/* Center Label */}
                    <div className="absolute text-center flex flex-col justify-center">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-text-secondary leading-none">Akaun 1 (75%)</span>
                      <span className="font-display font-black text-sm text-primary mt-1">
                        {((outputs.accountBreakdown.akaunPersaraan / outputs.projectedBalance) * 100 || 0).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  {/* Chart Legend list */}
                  <div className="flex-1 w-full space-y-3.5">
                    {chartData.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-md shrink-0" style={{ backgroundColor: item.color }} />
                          <span className="font-semibold text-text-secondary">{item.name}</span>
                        </div>
                        <span className="font-mono font-bold text-text-primary">
                          RM {item.value.toLocaleString('en-MY', { maximumFractionDigits: 0 })}
                        </span>
                      </div>
                    ))}
                    <div className="h-px bg-border-custom pt-1" />
                    <div className="flex justify-between items-center text-xs font-extrabold text-text-primary">
                      <span>Total Nest Egg</span>
                      <span className="font-mono text-primary">RM {outputs.projectedBalance.toLocaleString('en-MY', { maximumFractionDigits: 0 })}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Breakdown Cards */}
              <div className="bg-white border border-border-custom rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
                <SectionHeader title="KWSP Account Breakdown Descriptions" subtitle="Detailed roles and liquidity restrictions on each account division." />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3 border border-border-custom bg-bg-custom/40 rounded-xl space-y-1">
                    <span className="text-[9px] font-extrabold uppercase text-text-secondary">Akaun Persaraan (75%)</span>
                    <span className="block font-display font-black text-xs text-text-primary">
                      RM {outputs.accountBreakdown.akaunPersaraan.toLocaleString('en-MY', { maximumFractionDigits: 0 })}
                    </span>
                    <p className="text-[9px] text-text-secondary leading-normal">Locked strictly for retirement payout needs.</p>
                  </div>
                  <div className="p-3 border border-border-custom bg-bg-custom/40 rounded-xl space-y-1">
                    <span className="text-[9px] font-extrabold uppercase text-text-secondary">Akaun Sejahtera (15%)</span>
                    <span className="block font-display font-black text-xs text-text-primary">
                      RM {outputs.accountBreakdown.akaunSejahtera.toLocaleString('en-MY', { maximumFractionDigits: 0 })}
                    </span>
                    <p className="text-[9px] text-text-secondary leading-normal">For housing, medical, education withdrawals.</p>
                  </div>
                  <div className="p-3 border border-border-custom bg-bg-custom/40 rounded-xl space-y-1">
                    <span className="text-[9px] font-extrabold uppercase text-text-secondary">Akaun Fleksibel (10%)</span>
                    <span className="block font-display font-black text-xs text-amber-600">
                      RM {outputs.accountBreakdown.akaunFleksibel.toLocaleString('en-MY', { maximumFractionDigits: 0 })}
                    </span>
                    <p className="text-[9px] text-text-secondary leading-normal">Offers high-liquidity flexible daily withdrawals.</p>
                  </div>
                </div>
              </div>

              {/* Feature 6: Milestone Timeline */}
              <div className="bg-white border border-border-custom rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
                <SectionHeader title="Retirement Savings Milestone Timeline" subtitle="Estimated age when your EPF balance reaches major wealth milestones." />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {milestoneResults.map((m, idx) => (
                    <div 
                      key={idx}
                      className={`p-4 rounded-xl border text-center space-y-1 transition-all ${
                        m.reached 
                          ? 'bg-emerald-50/40 border-emerald-200' 
                          : 'bg-bg-custom/50 border-border-custom opacity-70'
                      }`}
                    >
                      <span className="text-[10px] font-extrabold font-mono uppercase text-text-secondary block">
                        {m.label}
                      </span>
                      {m.reached ? (
                        <>
                          <span className="font-display font-black text-sm text-emerald-800 block">
                            Age {m.age}
                          </span>
                          <span className="text-[9px] text-emerald-600 font-mono block">
                            In {m.year} {m.year === 1 ? 'year' : 'years'}
                          </span>
                        </>
                      ) : (
                        <span className="text-[10px] text-text-secondary italic block pt-1">
                          Not reached by {inputs.retirementAge}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Feature 5: Personalized Recommendations */}
              <div className="bg-white border border-border-custom rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
                <SectionHeader 
                  title="Personalized Action Recommendations" 
                  subtitle="Targeted strategies generated based on your lowest-scoring readiness factors." 
                />
                <div className={`grid grid-cols-1 ${
                  readiness.recommendations.length === 1 ? 'max-w-xl mx-auto' :
                  readiness.recommendations.length === 2 ? 'md:grid-cols-2' :
                  'md:grid-cols-2 lg:grid-cols-3'
                } gap-5 items-stretch`}>
                  {readiness.recommendations.map((rec, idx) => (
                    <div key={idx} className="p-5 rounded-2xl border border-border-custom bg-white hover:border-primary/40 hover:shadow-md transition-all space-y-4 flex flex-col justify-between h-full">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2.5 pb-3 border-b border-border-custom/80">
                          <div className="flex items-start gap-2.5">
                            <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                              rec.priority === 'high' ? 'bg-rose-50 text-rose-600 border border-rose-200/60' :
                              rec.priority === 'medium' ? 'bg-amber-50 text-amber-600 border border-amber-200/60' :
                              'bg-emerald-50 text-emerald-600 border border-emerald-200/60'
                            }`}>
                              {rec.priority === 'high' ? (
                                <Zap className="h-4 w-4" />
                              ) : rec.priority === 'medium' ? (
                                <TrendingUp className="h-4 w-4" />
                              ) : (
                                <ShieldCheck className="h-4 w-4" />
                              )}
                            </div>
                            <h4 className="text-sm font-bold text-text-primary font-display leading-snug">
                              {rec.title}
                            </h4>
                          </div>
                          <span className={`text-[10px] uppercase font-mono font-extrabold px-2 py-0.5 rounded-md shrink-0 border ${
                            rec.priority === 'high' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                            rec.priority === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>
                            {rec.priority}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed">
                          {rec.action}
                        </p>
                      </div>

                      <div className="mt-auto pt-2">
                        <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
                          <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono font-bold text-emerald-800 tracking-wider">
                            <TrendingUp className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                            <span>Estimated Impact</span>
                          </div>
                          <p className="text-xs font-mono font-bold text-emerald-900 leading-snug">
                            {rec.impactText}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            /* Tables - EPF Growth Schedule & Growth Chart */
            <div className="space-y-6 animate-fade-in">
              {/* Closing Balance Growth Line Chart */}
              <div className="bg-white border border-border-custom rounded-2xl p-6 shadow-xs space-y-3">
                <SectionHeader 
                  title="Closing Balance Growth Trajectory" 
                  subtitle="Visualizing cumulative EPF balance growth over time up to target retirement age."
                  badge="Growth Chart"
                />
                <div className="h-60 sm:h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={outputs.yearlyGrowth} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="epfGrowthGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B1A34" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#8B1A34" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis 
                        dataKey="age" 
                        tickFormatter={(value) => `Age ${value}`}
                        tick={{ fontSize: 11, fill: '#64748B' }}
                        axisLine={{ stroke: '#CBD5E1' }}
                      />
                      <YAxis 
                        tickFormatter={(value) => `RM ${(value / 1000).toFixed(0)}k`}
                        tick={{ fontSize: 11, fill: '#64748B' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip 
                        formatter={(value: any) => [`RM ${Number(value).toLocaleString('en-MY', { maximumFractionDigits: 0 })}`, 'Closing Balance']}
                        labelFormatter={(label: any) => `Age ${label} years old`}
                        contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="balance" 
                        stroke="#8B1A34" 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#epfGrowthGradient)" 
                        name="Closing Balance"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Table Ledger */}
              <div className="bg-white border border-border-custom rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-border-custom pb-3">
                  <div>
                    <h3 className="font-display font-bold text-sm text-text-primary uppercase tracking-wide">
                      EPF Savings Growth Projections
                    </h3>
                    <p className="text-[10px] text-text-secondary mt-0.5">
                      Yearly ledger of employee-employer contributions and annual dividend compounds.
                    </p>
                  </div>
                  <ExportButtons 
                    onCopyMarkdown={handleCopyMarkdown} 
                    title="EPF Growth Schedule"
                  />
                </div>
                
                <div className="overflow-x-auto max-h-[440px]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-bg-custom border-b border-border-custom sticky top-0">
                        <th className="p-3 font-semibold text-text-primary">Age</th>
                        <th className="p-3 font-semibold text-text-primary">Employee Share</th>
                        <th className="p-3 font-semibold text-text-primary">Employer Share</th>
                        <th className="p-3 font-semibold text-text-primary text-emerald-600">Annual Dividend</th>
                        <th className="p-3 font-semibold text-text-primary text-right">Closing Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {outputs.yearlyGrowth.map((row) => (
                        <tr key={row.age} className="border-b border-bg-custom hover:bg-bg-custom/40">
                          <td className="p-3 font-bold text-text-primary font-mono">{row.age} yrs</td>
                          <td className="p-3 font-mono">RM {row.employeeContrib.toLocaleString('en-MY')}</td>
                          <td className="p-3 font-mono">RM {row.employerContrib.toLocaleString('en-MY')}</td>
                          <td className="p-3 font-mono text-emerald-600">RM {row.dividends.toLocaleString('en-MY')}</td>
                          <td className="p-3 font-mono text-text-primary text-right font-semibold">RM {row.balance.toLocaleString('en-MY')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Feature 7: Concise Insight Cards */}
      <div className="space-y-4 no-print">
        <SectionHeader title="KWSP Growth Insights & Recommendations" badge="Rules-Based" />
        <InsightCards insights={insights} />
      </div>

      {/* Task 3: Collapsible Formula Explanation Accordion titled "How is this calculated?" */}
      <div className="no-print">
        <FormulaExplanation 
          what="KWSP retirement growth is driven by compounded interest. Every month, both you and your employer make statutory cash deposits into your EPF account. These funds accrue daily dividends, compounding annually."
          formula={
            <div className="space-y-1">
              <code className="block font-mono bg-bg-custom p-2 rounded-md text-[10px] text-primary">
                Closing Balance = [Opening Balance + Monthly Deposits] × (1 + r)
              </code>
              <code className="block font-mono bg-bg-custom p-2 rounded-md text-[10px] text-primary mt-1">
                Where r = Annual EPF Dividend Rate (e.g. 5.4%)
              </code>
            </div>
          }
          why="Forecasting your balance at retirement allows you to take early action (such as voluntary self-contributions or career salary planning) to achieve financial independence."
        />
      </div>

      {/* FAQ */}
      <div className="space-y-4 no-print">
        <SectionHeader title="Frequently Asked Questions (FAQ)" badge="KWSP Rules" />
        <FAQSection faqs={faqs} />
      </div>

    </div>
  );
}
