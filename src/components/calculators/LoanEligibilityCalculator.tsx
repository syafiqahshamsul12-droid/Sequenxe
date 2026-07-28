import React, { useState, useEffect } from 'react';
import { Landmark, Percent, HelpCircle, RefreshCw, CheckCircle2, ShieldAlert, BookmarkCheck } from 'lucide-react';
import { LoanEligibilityInputs, LoanEligibilityOutputs } from '../../types';
import { calculateLoanEligibility } from '../../utils/formulas';
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

const DEFAULT_INPUTS: LoanEligibilityInputs = {
  grossMonthlyIncome: 6500,
  existingCommitments: 1200,
  targetPropertyPrice: 500000,
  tenureYears: 35,
  interestRate: 4.2
};

export default function LoanEligibilityCalculator() {
  const { values: inputs, setValues: setInputs, resetConfig, hasSavedIndicator } = useSaveConfig<LoanEligibilityInputs>('dsr_loan_eligibility', DEFAULT_INPUTS);
  const [outputs, setOutputs] = useState<LoanEligibilityOutputs | null>(null);

  useEffect(() => {
    const results = calculateLoanEligibility(inputs);
    setOutputs(results);
  }, [inputs]);

  if (!outputs) return null;

  const handleReset = () => {
    resetConfig();
  };


  const handleInputChange = (field: keyof LoanEligibilityInputs, value: any) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\n"
      + `Gross Monthly Income,RM ${inputs.grossMonthlyIncome}\n`
      + `Existing Monthly Financial Commitments,RM ${inputs.existingCommitments}\n`
      + `Maximum Allowed DSR,${outputs.maxAllowedDsr}%\n`
      + `Current DSR Ratio,${outputs.currentDsr.toFixed(1)}%\n`
      + `Maximum Eligible Housing Loan,RM ${outputs.maxLoanAmount.toFixed(0)}\n`
      + `Maximum Affordable Property Price,RM ${outputs.maxPropertyPrice.toFixed(0)}\n`
      + `Estimated Monthly Housing Installment,RM ${outputs.maxMonthlyInstallment.toFixed(2)}`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "loan_eligibility_and_dsr_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyMarkdown = () => {
    const summaryText = `### Bank Loan Eligibility & DSR Assessment Report
- **Gross Monthly Income**: RM ${inputs.grossMonthlyIncome.toLocaleString('en-MY')}
- **Existing Monthly Commitments**: RM ${inputs.existingCommitments.toLocaleString('en-MY')}
- **Calculated DSR Ratio**: ${outputs.currentDsr.toFixed(1)}% (Maximum Allowed Bank Limit: ${outputs.maxAllowedDsr}%)
- **Maximum Eligible Home Loan Amount**: RM ${outputs.maxLoanAmount.toLocaleString('en-MY', { maximumFractionDigits: 0 })}
- **Maximum Affordable Property Price (90% Margin)**: RM ${outputs.maxPropertyPrice.toLocaleString('en-MY', { maximumFractionDigits: 0 })}
- **Maximum Eligible Monthly Installment**: RM ${outputs.maxMonthlyInstallment.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    navigator.clipboard.writeText(summaryText);
  };

  const insights = [
    {
      type: (outputs.currentDsr <= outputs.maxAllowedDsr ? 'success' : 'warning') as 'success' | 'warning',
      title: "Debt Service Ratio (DSR) Assessment",
      text: outputs.currentDsr <= outputs.maxAllowedDsr
        ? `Healthy DSR! Your debt service ratio of ${outputs.currentDsr.toFixed(1)}% is comfortably below Bank Negara Malaysia guidelines (${outputs.maxAllowedDsr}%). Bank loan approval probability is high!`
        : `DSR Alert: Your calculated DSR of ${outputs.currentDsr.toFixed(1)}% exceeds the tier limit of ${outputs.maxAllowedDsr}%. Consider paying down existing credit card or car loans before applying.`
    },
    {
      type: 'info' as const,
      title: "How Banks Calculate DSR",
      text: "DSR = (Total Monthly Debt Obligations ÷ Net Monthly Salary) × 100%. Maintaining DSR under 60% ensures fast approval across Maybank, CIMB, RHB, and Public Bank."
    }
  ];

  const faqs = [
    {
      question: "What is Debt Service Ratio (DSR) in Malaysia?",
      answer: "DSR is a core ratio used by Malaysian banks (like Maybank, Public Bank, CIMB) to calculate whether a borrower can afford a loan. DSR = (Total Monthly Debt Commitments ÷ Net Income) × 100%."
    },
    {
      question: "What is the maximum acceptable DSR limit for home loan approval?",
      answer: "For net monthly incomes below RM 3,000, most banks cap DSR at 60%. For incomes above RM 5,000, top banks allow DSR up to 70% or 75%."
    },
    {
      question: "Which commitments are included in DSR calculations?",
      answer: "Banks include all CCRIS / CTOS debt commitments: existing housing loans, car financing, personal loans, PTPTN student loans, and 5% of outstanding credit card balances."
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <SEOManager 
        title="Loan Eligibility & DSR Calculator Malaysia - Home Loan Borrowing Capacity"
        description="Calculate your Debt Service Ratio (DSR) and maximum housing loan eligibility across Malaysian banks (Maybank, Public Bank, CIMB, RHB)."
        canonicalUrl="https://sequenxe.com/my/loan-eligibility-calculator"
        calculatorId="loan-eligibility-calculator"
        faqs={faqs}
        breadcrumbs={[
          { name: 'Home', url: 'https://sequenxe.com/my' },
          { name: 'Home & Property', url: 'https://sequenxe.com/my/property' },
          { name: 'Loan Eligibility Calculator', url: 'https://sequenxe.com/my/loan-eligibility-calculator' }
        ]}
      />

      {/* Breadcrumb & Hero (web-only) */}
      <div className="no-print">
        <Breadcrumb 
          currentName="Loan Eligibility & DSR Calculator Malaysia" 
          onHomeClick={() => {
            const navEvent = new CustomEvent('change-view', { detail: 'home' });
            window.dispatchEvent(navEvent);
          }} 
        />

        <CalculatorHero 
          title="🏦 Loan Eligibility & DSR Calculator Malaysia"
          description="Find out your maximum housing loan borrowing capacity and Debt Service Ratio (DSR) based on Bank Negara Malaysia and commercial bank lending benchmarks."
          estimatedTime="2 mins"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 bg-white border border-border-custom rounded-2xl p-6 sm:p-8 shadow-xs space-y-5 no-print">
          <div className="flex justify-between items-center border-b border-border-custom pb-3">
            <h2 className="font-display font-bold text-base text-text-primary uppercase tracking-wide">
              Income & Debt Inputs
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

          <div className="space-y-2">
            <label htmlFor="grossMonthlyIncomeDsr" className="text-sm font-semibold text-text-primary">
              Gross Monthly Salary (RM)
            </label>
            <div className="relative">
              <span className="absolute top-3.5 left-4 text-sm font-semibold text-text-secondary">RM</span>
              <input
                id="grossMonthlyIncomeDsr"
                type="number"
                min="0"
                step="500"
                value={inputs.grossMonthlyIncome}
                onChange={(e) => handleInputChange('grossMonthlyIncome', Math.max(0, parseFloat(e.target.value) || 0))}
                className="h-12 w-full rounded-xl border border-border-custom bg-bg-custom pl-11 pr-4 text-sm font-semibold text-text-primary focus:border-primary focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="existingCommitmentsDsr" className="text-sm font-semibold text-text-primary">
              Existing Monthly Commitments (RM)
            </label>
            <div className="relative">
              <span className="absolute top-3.5 left-4 text-sm font-semibold text-text-secondary">RM</span>
              <input
                id="existingCommitmentsDsr"
                type="number"
                min="0"
                step="100"
                value={inputs.existingCommitments}
                onChange={(e) => handleInputChange('existingCommitments', Math.max(0, parseFloat(e.target.value) || 0))}
                className="h-12 w-full rounded-xl border border-border-custom bg-bg-custom pl-11 pr-4 text-sm font-semibold text-text-primary focus:border-primary focus:bg-white focus:outline-none"
              />
            </div>
            <p className="text-[10px] text-text-secondary">Include car loans, personal loans, PTPTN, credit card min payments.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="tenureYearsDsr" className="text-xs font-bold text-text-primary block">
                Tenure (Years)
              </label>
              <select
                id="tenureYearsDsr"
                value={inputs.tenureYears}
                onChange={(e) => handleInputChange('tenureYears', parseInt(e.target.value) || 35)}
                className="h-11 w-full rounded-xl border border-border-custom bg-bg-custom px-3 text-xs font-semibold text-text-primary focus:border-primary focus:outline-none cursor-pointer"
              >
                {[15, 20, 25, 30, 35].map(yr => (
                  <option key={yr} value={yr}>{yr} Years</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="interestRateDsr" className="text-xs font-bold text-text-primary block">
                Interest Rate (%)
              </label>
              <div className="relative">
                <span className="absolute top-3 right-3 text-xs font-semibold text-text-secondary">%</span>
                <input
                  id="interestRateDsr"
                  type="number"
                  min="2"
                  max="10"
                  step="0.1"
                  value={inputs.interestRate}
                  onChange={(e) => handleInputChange('interestRate', parseFloat(e.target.value) || 4.2)}
                  className="h-11 w-full rounded-xl border border-border-custom bg-bg-custom pl-3 pr-7 text-xs font-semibold text-text-primary focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>
          {/* Mandatory Disclaimer */}
          <Disclaimer />
        </div>

        <div className="lg:col-span-7 space-y-6">
          <SectionHeader title="Loan Capacity Results" badge="BNM Guidelines" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SummaryCard 
              label="Max Eligible Home Loan" 
              value={`RM ${outputs.maxLoanAmount.toLocaleString('en-MY', { maximumFractionDigits: 0 })}`}
              description={`Max Monthly Installment: RM ${outputs.maxMonthlyInstallment.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              accent
            />
            <SummaryCard 
              label="Calculated DSR Ratio" 
              value={`${outputs.currentDsr.toFixed(1)}%`}
              description={`Maximum Allowed Bank DSR Threshold: ${outputs.maxAllowedDsr}%`}
              success={outputs.currentDsr <= outputs.maxAllowedDsr}
            />
          </div>

          <div className="bg-white border border-border-custom rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-border-custom pb-3">
              <h3 className="font-display font-bold text-sm text-text-primary uppercase tracking-wide">
                Borrowing Assessment Report
              </h3>
              <ExportButtons 
                onCopyMarkdown={handleCopyMarkdown} 
                onExportCsv={handleExportCsv} 
                title="Loan Eligibility Report"
              />
            </div>

            <table className="w-full text-left border-collapse text-xs">
              <tbody>
                <tr className="border-b border-bg-custom">
                  <td className="p-2.5 font-semibold text-text-primary">Max Affordable Property Price (90% Loan Margin)</td>
                  <td className="p-2.5 font-mono text-right font-bold text-primary">RM {outputs.maxPropertyPrice.toLocaleString('en-MY', { maximumFractionDigits: 0 })}</td>
                </tr>
                <tr className="border-b border-bg-custom">
                  <td className="p-2.5 font-semibold text-text-primary">Max Housing Principal Loan Amount</td>
                  <td className="p-2.5 font-mono text-right font-bold">RM {outputs.maxLoanAmount.toLocaleString('en-MY', { maximumFractionDigits: 0 })}</td>
                </tr>
                <tr className="border-b border-bg-custom">
                  <td className="p-2.5 font-semibold text-text-primary">Max Allowable Monthly Mortgage Installment</td>
                  <td className="p-2.5 font-mono text-right font-bold text-emerald-700">RM {outputs.maxMonthlyInstallment.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr className="bg-primary/5">
                  <td className="p-2.5 font-bold text-primary">Calculated DSR vs Bank Ceiling</td>
                  <td className="p-2.5 font-mono font-bold text-right text-primary">{outputs.currentDsr.toFixed(1)}% / {outputs.maxAllowedDsr}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="space-y-4 no-print">
        <SectionHeader title="DSR Insights" badge="Rules-Based" />
        <InsightCards insights={insights} />
      </div>

      <div className="no-print">
        <FormulaExplanation 
          what="Debt Service Ratio (DSR) compares your total monthly debt obligations against your net income to establish home loan safety margins."
          formula={
            <code className="block font-mono bg-bg-custom p-2.5 rounded-md text-[11px] text-primary">
              DSR = [(Existing Debt + New Housing Loan Installment) ÷ Net Salary] × 100%
            </code>
          }
          why="Maintaining your DSR under 60% guarantees maximum home loan approval odds across all major Malaysian retail banks."
        />
      </div>

      <div className="space-y-4 no-print">
        <SectionHeader title="Frequently Asked Questions (FAQ)" badge="Borrowing" />
        <FAQSection faqs={faqs} />
      </div>
    </div>
  );
}
