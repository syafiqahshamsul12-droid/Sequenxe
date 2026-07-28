import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Percent, 
  Shield, 
  Sparkles, 
  HelpCircle, 
  RefreshCw, 
  CheckCircle2, 
  TrendingUp, 
  AlertTriangle,
  BookmarkCheck
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PersonalLoanInputs, PersonalLoanOutputs } from '../../types';
import { calculatePersonalLoan } from '../../utils/formulas';
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
  Disclaimer 
} from './shared/CommonComponents';
import { MarketInterestRateTrend } from './shared/MarketInterestRateTrend';

const DEFAULT_INPUTS: PersonalLoanInputs = {
  loanAmount: 20000,
  interestRate: 4.99,
  tenure: 5
};

export default function PersonalLoanCalculator() {
  const { values: inputs, setValues: setInputs, resetConfig, hasSavedIndicator } = useSaveConfig<PersonalLoanInputs>('personal_loan', DEFAULT_INPUTS);
  const [outputs, setOutputs] = useState<PersonalLoanOutputs | null>(null);

  useEffect(() => {
    const results = calculatePersonalLoan(inputs);
    setOutputs(results);
  }, [inputs]);

  if (!outputs) return null;

  const handleReset = () => {
    resetConfig();
  };


  const handleInputChange = (field: keyof PersonalLoanInputs, value: any) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Recharts Chart Data
  const chartData = [
    { name: 'Original Principal', value: inputs.loanAmount, color: '#7A2436' }, // Primary Wine
    { name: 'Total flat Interest Charges', value: outputs.totalInterest, color: '#C28A00' } // Amber/Warning
  ];

  // Export Data as CSV
  const handleExportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value (RM)\n"
      + `Borrowed Loan Principal,${inputs.loanAmount}\n`
      + `Advertised Flat Interest Rate,${inputs.interestRate}% p.a.\n`
      + `Effective Interest Rate (EIR),${outputs.effectiveRate}%\n`
      + `Loan Tenure,${inputs.tenure} Years (${inputs.tenure * 12} installments)\n`
      + `Estimated Monthly Installment,${outputs.monthlyPayment.toFixed(2)}\n`
      + `Total Cumulative Interest Charges,${outputs.totalInterest.toFixed(2)}\n`
      + `Total Repayable Lifetime Cost,${outputs.totalRepayment.toFixed(2)}`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "personal_loan_eir_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy Summary text to Clipboard
  const handleCopyMarkdown = () => {
    const summaryText = `### Personal Loan & EIR Calculation Report
- **Borrowed Principal size**: RM ${inputs.loanAmount.toLocaleString('en-MY')}
- **Advertised Flat Interest**: ${inputs.interestRate}% p.a.
- **True Effective Interest Rate (EIR)**: ${outputs.effectiveRate}% p.a.
- **Estimated Monthly repayment**: RM ${outputs.monthlyPayment.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
- **Tenure**: ${inputs.tenure} Years (${inputs.tenure * 12} months)
- **Financial Aggregates**:
  - Total Interest Charges: RM ${outputs.totalInterest.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
  - Total Repayable Lifetime Cost: RM ${outputs.totalRepayment.toLocaleString('en-MY', { minimumFractionDigits: 2 })}`;

    navigator.clipboard.writeText(summaryText);
  };

  // Rule-based insights (maximum 5 items)
  const insights = [
    {
      type: 'warning' as const,
      title: "Flat vs Effective Interest Discrepancy",
      text: "The true Effective Interest Rate (EIR) is " + outputs.effectiveRate + "%, which is nearly double your advertised flat rate of " + inputs.interestRate + "%. This is because interest is computed on the full principal size despite you reducing the debt balance monthly."
    },
    {
      type: 'info' as const,
      title: "Bank Negara Tenure Guidelines",
      text: "Under Bank Negara Malaysia (BNM) regulations, commercial personal loan tenures are strictly capped at a maximum of 10 years to prevent consumers from sinking into long-term unsecured debt cycles."
    },
    {
      type: 'success' as const,
      title: "Debt Service Ratio Protection",
      text: "Ensure your monthly personal loan repayment of RM " + outputs.monthlyPayment.toLocaleString('en-MY', { maximumFractionDigits: 0 }) + " combined with other liabilities doesn't exceed 30% of your net household salary to retain a pristine credit score."
    },
    {
      type: 'info' as const,
      title: "Prepayment / Early Settlement Penalties",
      text: "Many Malaysian banks charge an early exit settlement fee (commonly 1% to 3% of the outstanding balance) if you pay off your personal loan ahead of the agreed " + inputs.tenure + "-year tenure."
    },
    {
      type: 'success' as const,
      title: "CCRIS/CTOS Rating Impact",
      text: "Having a stable repayment record for this RM " + inputs.loanAmount.toLocaleString('en-MY') + " loan establishes a solid CCRIS credit profile, qualifying you for much lower rates on future mortgages or car loans."
    }
  ];

  // FAQ structured dataset
  const faqs = [
    {
      question: "What is the difference between flat rate and Effective Interest Rate (EIR)?",
      answer: "A Flat Interest Rate calculates interest on your original borrowed amount for the entire tenure. An Effective Interest Rate (EIR) takes into account that your outstanding balance decreases as you pay it off monthly, reflecting the actual compound interest you pay."
    },
    {
      question: "Why is EIR almost double the flat interest rate?",
      answer: "Because you pay interest on money you have already paid back in previous months! As the outstanding loan principal reduces, a flat-interest charge remains unchanged, making the true annualized rate of interest (EIR) significantly higher."
    },
    {
      question: "How does Bank Negara Malaysia protect consumers regarding personal loans?",
      answer: "Bank Negara regulates commercial financial lenders by enforcing a maximum 10-year tenure cap on unsecured personal loans and requiring clear prominent disclosure of the nominal Effective Interest Rate (EIR) in all marketing brochures."
    },
    {
      question: "Can I pay off my Malaysian personal loan early?",
      answer: "Yes, you are legally entitled to settle your loan early. Under standard banking rules, you will receive an interest rebate (commonly utilizing the 'Rule of 78' formula), though some lenders may levy a minor flat administrative early settlement penalty."
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <SEOManager 
        title="Personal Loan & EIR Calculator"
        description="Convert flat interest rates into Effective Interest Rates (EIR) and calculate repayments under BNM rules."
        canonicalUrl="https://sequenxe.com/my/personal-loan-calculator"
        calculatorId="personal-loan"
        faqs={faqs}
        breadcrumbs={[
          { name: 'Home', url: 'https://sequenxe.com/my' },
          { name: 'Loans & Debt', url: 'https://sequenxe.com/my/loans' },
          { name: 'Personal Loan Calculator', url: 'https://sequenxe.com/my/personal-loan-calculator' }
        ]}
      />
      {/* 1. Breadcrumb & Hero (web-only) */}
      <div className="no-print">
        <Breadcrumb 
          currentName="Personal Loan & EIR Calculator" 
          onHomeClick={() => {
            const navEvent = new CustomEvent('change-view', { detail: 'home' });
            window.dispatchEvent(navEvent);
          }} 
        />

        <CalculatorHero 
          title="💳 Personal Loan & EIR Calculator"
          description="Convert advertised flat interest rates into true nominal Effective Interest Rates (EIR) instantly. Accurately estimate monthly payments, aggregate lifetime interest costs, and total repayment sums in accordance with Bank Negara standard guidelines."
          estimatedTime="2 mins"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* 4. Calculator Form */}
        <div className="lg:col-span-5 bg-white border border-border-custom rounded-2xl p-6 sm:p-8 shadow-xs space-y-5 no-print">
          <div className="flex justify-between items-center border-b border-border-custom pb-3">
            <h2 className="font-display font-bold text-base text-text-primary uppercase tracking-wide">
              Loan Variables
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

          {/* Loan Amount */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <label htmlFor="loanAmount" className="text-sm font-semibold text-text-primary">
                Desired Loan Principal (RM)
              </label>
              <div className="group relative inline-block">
                <HelpCircle className="h-3.5 w-3.5 text-text-secondary hover:text-primary transition-colors cursor-help" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-950 text-white text-[11px] rounded-lg p-2.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl leading-relaxed font-normal normal-case pointer-events-none">
                  <span className="font-bold block text-primary mb-1">Loan Principal</span>
                  The initial net cash borrowed from the commercial bank before deducting any processing or stamp duty fees.
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-950"></div>
                </div>
              </div>
            </div>
            <div className="relative">
              <span className="absolute top-3 left-4 text-sm font-semibold text-text-secondary">RM</span>
              <input
                id="loanAmount"
                type="number"
                min="1000"
                max="500000"
                step="1000"
                value={inputs.loanAmount}
                onChange={(e) => handleInputChange('loanAmount', Math.max(1000, parseFloat(e.target.value) || 1000))}
                className="h-11 w-full rounded-xl border border-border-custom bg-bg-custom pl-11 pr-4 text-sm font-semibold text-text-primary focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Flat Interest Rate */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <label htmlFor="interestRate" className="text-sm font-semibold text-text-primary">
                Flat Interest Rate (% p.a.)
              </label>
              <div className="group relative inline-block">
                <HelpCircle className="h-3.5 w-3.5 text-text-secondary hover:text-primary transition-colors cursor-help" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-950 text-white text-[11px] rounded-lg p-2.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl leading-relaxed font-normal normal-case pointer-events-none">
                  <span className="font-bold block text-primary mb-1">Flat Interest Rate</span>
                  Advertised flat percentage applied directly to your starting principal. Unlike reducing balance mortgages, interest does not drop as you pay off the debt.
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-950"></div>
                </div>
              </div>
            </div>
            <div className="relative">
              <span className="absolute top-3 right-4 text-sm font-semibold text-text-secondary">% Flat</span>
              <input
                id="interestRate"
                type="number"
                min="0.1"
                max="30"
                step="0.05"
                value={inputs.interestRate}
                onChange={(e) => handleInputChange('interestRate', Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                className="h-11 w-full rounded-xl border border-border-custom bg-bg-custom pl-4 pr-16 text-sm font-semibold text-text-primary focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Tenure */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <label htmlFor="tenure" className="text-sm font-semibold text-text-primary">
                Loan Tenure (Years)
              </label>
              <div className="group relative inline-block">
                <HelpCircle className="h-3.5 w-3.5 text-text-secondary hover:text-primary transition-colors cursor-help" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-slate-950 text-white text-[11px] rounded-lg p-2.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl leading-relaxed font-normal normal-case pointer-events-none">
                  Length of the personal financing agreement. Typically ranges from 1 to 10 years maximum in Malaysia.
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-950"></div>
                </div>
              </div>
            </div>
            <select
              id="tenure"
              value={inputs.tenure}
              onChange={(e) => handleInputChange('tenure', parseInt(e.target.value) || 5)}
              className="h-11 w-full rounded-xl border border-border-custom bg-bg-custom px-4 text-sm font-semibold text-text-primary focus:border-primary focus:outline-none cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 7, 10].map((yrs) => (
                <option key={yrs} value={yrs}>{yrs} Year{yrs > 1 ? 's' : ''} ({yrs * 12} installments)</option>
              ))}
            </select>
          </div>
          {/* Market Interest Rate Trend Indicator */}
          <MarketInterestRateTrend type="personal-loan" />

          {/* Mandatory Disclaimer */}
          <Disclaimer />
        </div>

        {/* Right Column: Live Results */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 5. Live Summary */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <SectionHeader title="Monthly Cost Commitment" badge="Real-Time" />
              <ExportButtons 
                onCopyMarkdown={handleCopyMarkdown} 
                onExportCsv={handleExportCsv} 
                title="Personal Loan Summary"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SummaryCard 
                label="Monthly repayment" 
                value={`RM ${outputs.monthlyPayment.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                description={`Fixed monthly payment installment size over ${inputs.tenure} years.`}
                accent
                tooltip="The monthly amount paid back to the bank. Interest is calculated as flat-rate upfront, making this fixed throughout the entire tenure."
              />
              <SummaryCard 
                label="True Effective Rate (EIR)" 
                value={`${outputs.effectiveRate}% p.a.`}
                description="The true interest rate of loan balance reducing monthly."
                tooltip="Effective Interest Rate (EIR). Because you pay down your loan balance monthly, the actual interest rate on your outstanding balance is higher than the advertised flat interest rate."
              />
            </div>
          </div>

          {/* 6. Interactive Charts */}
          <div className="bg-white border border-border-custom rounded-2xl p-6 shadow-xs">
            <SectionHeader title="Lifetime Interest vs Principal Proportion" subtitle="Compares your borrowed cash principal against cumulative charges paid to the bank." />
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
                  <span className="text-[9px] font-mono uppercase tracking-wider text-text-secondary leading-none">Interest Portion</span>
                  <span className="font-display font-black text-xs text-amber-600 mt-1">
                    {((outputs.totalInterest / outputs.totalRepayment) * 100 || 0).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Legend List */}
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
                  <span>Total Loan Liability</span>
                  <span className="font-mono text-primary">RM {outputs.totalRepayment.toLocaleString('en-MY', { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 7. Detailed Breakdown Card */}
          <div className="bg-white border border-border-custom rounded-2xl p-6 sm:p-8 shadow-xs">
            <SectionHeader title="Loan Financial Projections" subtitle="Projections of flat versus reducing metrics for comparison." />
            <div className="space-y-3.5 text-xs pt-2">
              <div className="flex justify-between border-b border-bg-custom pb-2">
                <span className="text-text-secondary font-medium">Flat Rate Advertised</span>
                <span className="font-semibold text-text-primary font-mono">{inputs.interestRate}% p.a.</span>
              </div>
              <div className="flex justify-between border-b border-bg-custom pb-2">
                <span className="text-text-secondary font-medium">True Effective Rate (EIR)</span>
                <span className="font-bold text-amber-600 font-mono">{outputs.effectiveRate}% p.a.</span>
              </div>
              <div className="flex justify-between border-b border-bg-custom pb-2">
                <span className="text-text-secondary font-medium">Total Lifetime Interest</span>
                <span className="font-semibold text-text-primary font-mono">RM {outputs.totalInterest.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-primary font-bold">Total Repayable Lifetime Cost</span>
                <span className="font-extrabold text-primary font-mono">RM {outputs.totalRepayment.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* 8. Tables - Repayment Details */}
          <div className="bg-white border border-border-custom rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-border-custom pb-3">
              <div>
                <h3 className="font-display font-bold text-sm text-text-primary uppercase tracking-wide">
                  Repayment Comparisons Table
                </h3>
                <p className="text-[10px] text-text-secondary mt-0.5">
                  Comparative summary table of your selected personal loan aggregates.
                </p>
              </div>
              <ExportButtons 
                onPrint={() => window.print()} 
                onCopyMarkdown={handleCopyMarkdown} 
                onExportCsv={handleExportCsv} 
                title="Personal Loan Repayment Report"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-bg-custom border-b border-border-custom">
                    <th className="p-3 font-semibold text-text-primary">Calculation Metric</th>
                    <th className="p-3 font-semibold text-text-primary">Flat Value</th>
                    <th className="p-3 font-semibold text-text-primary text-right">EIR Equivalent</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-bg-custom">
                    <td className="p-3 font-semibold text-text-primary">Stated Interest Rate</td>
                    <td className="p-3 font-mono">{inputs.interestRate}% p.a.</td>
                    <td className="p-3 font-mono text-right font-bold text-amber-600">{outputs.effectiveRate}% p.a.</td>
                  </tr>
                  <tr className="border-b border-bg-custom">
                    <td className="p-3 font-semibold text-text-primary">Monthly Repayment Amount</td>
                    <td className="p-3 font-mono">RM {outputs.monthlyPayment.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</td>
                    <td className="p-3 font-mono text-right">RM {outputs.monthlyPayment.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr className="border-b border-bg-custom">
                    <td className="p-3 font-semibold text-text-primary">Total Aggregated Interest Cost</td>
                    <td className="p-3 font-mono text-amber-600">RM {outputs.totalInterest.toLocaleString('en-MY')}</td>
                    <td className="p-3 font-mono text-right text-amber-600">RM {outputs.totalInterest.toLocaleString('en-MY')}</td>
                  </tr>
                  <tr className="bg-primary/5">
                    <td className="p-3 font-bold text-primary">Total Repayable Lifetime Cost</td>
                    <td className="p-3 font-mono font-bold text-primary">RM {outputs.totalRepayment.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</td>
                    <td className="p-3 font-mono text-right font-bold text-primary">RM {outputs.totalRepayment.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* 9. Rule-Based Insights */}
      <div className="space-y-4 no-print">
        <SectionHeader title="Statutory Insights & Debt Strategy" badge="Rules-Based" />
        <InsightCards insights={insights} />
      </div>

      {/* 10. Formula Explanation */}
      <div className="no-print">
        <FormulaExplanation 
          what="A flat interest rate charges interest on your full original borrowed principal size for the entire loan duration. The actual Effective Interest Rate (EIR) is solved through binary convergence to accurately compute reducing monthly interest charges."
          formula={
            <div className="space-y-1">
              <code className="block font-mono bg-bg-custom p-2 rounded-md text-[10px] text-primary">
                Flat Interest = Principal × Flat Rate × Tenure (Yrs)
              </code>
              <code className="block font-mono bg-bg-custom p-2 rounded-md text-[10px] text-primary mt-1">
                Monthly Installment = [Principal + Flat Interest] / [Tenure × 12]
              </code>
            </div>
          }
          why="Converting Flat Rate to EIR reveals the true compounding bank rate you are paying as you reduce the debt balance, allowing for transparent comparison across mortgage, credit-card, and personal loan facilities."
        />
      </div>

      {/* 11. FAQ */}
      <div className="space-y-4 no-print">
        <SectionHeader title="Frequently Asked Questions (FAQ)" badge="Compliant" />
        <FAQSection faqs={faqs} />
      </div>
    </div>
  );
}
