import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Percent, 
  Shield, 
  Sparkles, 
  HelpCircle, 
  RefreshCw, 
  CheckCircle2, 
  DollarSign, 
  Table,
  BookmarkCheck
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { HomeLoanInputs, HomeLoanOutputs } from '../../types';
import { calculateHomeLoan } from '../../utils/formulas';
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
import HomeLoanComparison from './HomeLoanComparison';

const DEFAULT_INPUTS: HomeLoanInputs = {
  propertyPrice: 450000,
  downPayment: 45000,
  downPaymentPercent: 10,
  interestRate: 4.15,
  tenure: 30,
  isFirstTimeBuyer: true
};

export default function HomeLoanCalculator() {
  const { values: inputs, setValues: setInputs, resetConfig, hasSavedIndicator } = useSaveConfig<HomeLoanInputs>('home_loan', DEFAULT_INPUTS);
  const [outputs, setOutputs] = useState<HomeLoanOutputs | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'amortization' | 'comparison'>('summary');

  useEffect(() => {
    const results = calculateHomeLoan(inputs);
    setOutputs(results);
  }, [inputs]);

  if (!outputs) return null;

  const handleReset = () => {
    resetConfig();
    setActiveTab('summary');
  };


  const handlePriceChange = (price: number) => {
    // Maintain constant down payment percentage on purchase price adjust
    const dp = (price * inputs.downPaymentPercent) / 100;
    setInputs(prev => ({
      ...prev,
      propertyPrice: price,
      downPayment: dp
    }));
  };

  const handleDpValueChange = (dpValue: number) => {
    const price = inputs.propertyPrice;
    const dpPercent = price > 0 ? (dpValue / price) * 100 : 0;
    setInputs(prev => ({
      ...prev,
      downPayment: dpValue,
      downPaymentPercent: Number(dpPercent.toFixed(1))
    }));
  };

  const handleDpPercentChange = (dpPercent: number) => {
    const price = inputs.propertyPrice;
    const dpValue = (price * dpPercent) / 100;
    setInputs(prev => ({
      ...prev,
      downPaymentPercent: dpPercent,
      downPayment: dpValue
    }));
  };

  const handleInputChange = (field: keyof HomeLoanInputs, value: any) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Recharts Pie Chart Data
  const chartData = [
    { name: 'Principal Loan Amount', value: outputs.loanAmount, color: 'var(--primary)' }, // Primary Accent
    { name: 'Total Interest Charge', value: outputs.totalInterest, color: '#C28A00' } // Amber/Warning
  ];

  // Export Data as CSV
  const handleExportCsv = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Year,Principal Paid (RM),Interest Paid (RM),Cumulative Interest (RM),Remaining Balance (RM)\n";
    
    outputs.amortizationSchedule.forEach((row) => {
      csvContent += `${row.year},${row.principalPaid},${row.interestPaid},${row.cumulativeInterest},${row.remainingBalance}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "mortgage_amortization_schedule.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy Summary text to Clipboard
  const handleCopyMarkdown = () => {
    const summaryText = `### Mortgage & Stamp Duty Calculation Report
- **Property Price**: RM ${inputs.propertyPrice.toLocaleString('en-MY')}
- **Downpayment**: RM ${inputs.downPayment.toLocaleString('en-MY')} (${inputs.downPaymentPercent}%)
- **Loan Financed**: RM ${outputs.loanAmount.toLocaleString('en-MY')} at ${inputs.interestRate}% p.a.
- **Estimated Monthly repayment**: RM ${outputs.monthlyInstallment.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
- **Upfront Initial Cash Required**:
  - Downpayment: RM ${inputs.downPayment.toLocaleString('en-MY')}
  - SPA Stamp Duty: ${outputs.spaStampDuty === 0 ? 'EXEMPT' : `RM ${outputs.spaStampDuty.toLocaleString('en-MY')}`}
  - Loan Stamp Duty: ${outputs.loanStampDuty === 0 ? 'EXEMPT' : `RM ${outputs.loanStampDuty.toLocaleString('en-MY')}`}
  - Total Upfront Cash: RM ${outputs.totalInitialCost.toLocaleString('en-MY')}
- **Lifetime Financial Cost**:
  - Total Interest Paid: RM ${outputs.totalInterest.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
  - Total Repayable (Principal + Interest): RM ${outputs.totalRepayment.toLocaleString('en-MY', { minimumFractionDigits: 2 })}`;

    navigator.clipboard.writeText(summaryText);
  };

  // Rule-based insights (maximum 5 items)
  const insights = [
    {
      type: 'success' as const,
      title: "First-Time Homebuyer Stamp Duty Waiver",
      text: inputs.isFirstTimeBuyer && inputs.propertyPrice <= 500000
        ? "Congratulations! You qualify for LHDN's 100% stamp duty exemption waiver on your SPA & Loan agreements. This saves you RM " + (outputs.spaStampDuty === 0 ? "thousands" : outputs.spaStampDuty.toLocaleString('en-MY')) + " in immediate upfront transaction cash."
        : "Properties priced below RM500,000 qualify for a full stamp duty waiver. For houses above RM500,000, standard progressive stamp duty scales are applied."
    },
    {
      type: 'info' as const,
      title: "Tenure Optimization",
      text: "Reducing your mortgage tenure from " + inputs.tenure + " years to " + Math.max(5, inputs.tenure - 5) + " years increases your monthly installment moderately, but eliminates tens of thousands of Ringgit in pure compounding bank interest charges."
    },
    {
      type: 'warning' as const,
      title: "Total Interest Proportion",
      text: "Over your selected " + inputs.tenure + " years tenure, total interest charges (RM " + outputs.totalInterest.toLocaleString('en-MY', { maximumFractionDigits: 0 }) + ") amount to " + ((outputs.totalInterest / outputs.loanAmount) * 100).toFixed(0) + "% of your original borrowed principal!"
    },
    {
      type: 'success' as const,
      title: "Equity Protection Margin",
      text: inputs.downPaymentPercent >= 10 
        ? "Your 10%+ down payment of RM " + inputs.downPayment.toLocaleString('en-MY') + " is excellent! It avoids negative equity risks and qualifies you for competitive interest tier pricing from commercial lenders."
        : "Consider raising your downpayment to at least 10% to meet standard credit assessment ratios and lower your borrowing size."
    },
    {
      type: 'info' as const,
      title: "Debt Service Ratio Check",
      text: "Ensure your monthly installment of RM " + outputs.monthlyInstallment.toLocaleString('en-MY', { maximumFractionDigits: 0 }) + " does not exceed 30% to 40% of your household net monthly income to comfortably pass bank compliance audits."
    }
  ];

  // FAQ structured dataset
  const faqs = [
    {
      question: "How are monthly repayments calculated?",
      answer: "Monthly repayments are calculated using the standard reducing-balance loan amortization formula: P × r × (1 + r)^n / [(1 + r)^n - 1], where P is loan principal, r is monthly interest rate, and n is total tenure in months."
    },
    {
      question: "Does this include interest?",
      answer: "Yes, monthly installments combine both principal repayment and bank interest charges. This calculator also provides a complete amortization schedule and lifetime interest total."
    },
    {
      question: "What is the difference between principal and interest?",
      answer: "Principal is the actual amount borrowed from the bank to purchase the property. Interest is the fee charged by the lender for borrowing that money over time."
    },
    {
      question: "How does the tenure impact total interest paid?",
      answer: "A longer loan tenure (e.g. 35 years vs 25 years) lowers your monthly payment but significantly increases total lifetime interest paid due to compounding over a longer duration."
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <SEOManager 
        title="Home Loan Calculator Malaysia"
        description="Calculate monthly mortgage repayments, interest breakdown, and SPA and loan agreement stamp duty costs for buying property in Malaysia."
        canonicalUrl="https://sequenxe.com/home-loan-calculator"
        calculatorId="home-loan-calculator"
        faqs={faqs}
        breadcrumbs={[
          { name: 'Home', url: 'https://sequenxe.com/' },
          { name: 'Home Loan Calculator Malaysia', url: 'https://sequenxe.com/home-loan-calculator' }
        ]}
      />
      {/* 1. Breadcrumb & Hero (web-only) */}
      <div className="no-print">
        <Breadcrumb 
          items={[
            { label: 'Home', href: 'home' },
            { label: 'Loans & Housing', href: 'home' },
            { label: 'Home Loan Calculator Malaysia' }
          ]}
        />

        <CalculatorHero 
          title="Home Loan Calculator Malaysia"
          description="Estimate monthly mortgage payments, upfront SPA and loan stamp duty fees, first-time buyer exemptions, and total lifetime interest charges."
          estimatedTime="3 mins"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* 4. Calculator Form */}
        <div className="lg:col-span-5 bg-white border border-border-custom rounded-2xl p-6 sm:p-8 shadow-xs space-y-5 no-print">
          <div className="flex justify-between items-center border-b border-border-custom pb-3">
            <h2 className="font-display font-bold text-base text-text-primary uppercase tracking-wide">
              Property Inputs
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

          {/* Property Price */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <label htmlFor="propertyPrice" className="text-sm font-semibold text-text-primary">
                Property Purchase Price (RM)
              </label>
              <div className="group relative inline-block">
                <HelpCircle className="h-3.5 w-3.5 text-text-secondary hover:text-primary transition-colors cursor-help" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-950 text-white text-[11px] rounded-lg p-2.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl leading-relaxed font-normal normal-case pointer-events-none">
                  <span className="font-bold block text-primary mb-1">Property Purchase Price</span>
                  The total purchase cost of the residential property. Progressive SPA stamp duties are assessed directly on this valuation.
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-950"></div>
                </div>
              </div>
            </div>
            <div className="relative">
              <span className="absolute top-3 left-4 text-sm font-semibold text-text-secondary">RM</span>
              <input
                id="propertyPrice"
                type="number"
                min="0"
                step="10000"
                value={inputs.propertyPrice}
                onChange={(e) => handlePriceChange(Math.max(0, parseFloat(e.target.value) || 0))}
                className="h-11 w-full rounded-xl border border-border-custom bg-bg-custom pl-11 pr-4 text-sm font-semibold text-text-primary focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Down Payment dual-sync */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <label htmlFor="downPaymentVal" className="text-sm font-semibold text-text-primary">
                  Down Payment (RM)
                </label>
                <div className="group relative inline-block">
                  <HelpCircle className="h-3.5 w-3.5 text-text-secondary hover:text-primary transition-colors cursor-help" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-slate-950 text-white text-[11px] rounded-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl leading-relaxed font-normal normal-case pointer-events-none">
                    Upfront cash equity. Commercial bank guidelines recommend a minimum of 10% down payment.
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-950"></div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <span className="absolute top-3 left-3 text-xs font-semibold text-text-secondary">RM</span>
                <input
                  id="downPaymentVal"
                  type="number"
                  min="0"
                  step="1000"
                  value={inputs.downPayment}
                  onChange={(e) => handleDpValueChange(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="h-11 w-full rounded-xl border border-border-custom bg-bg-custom pl-9 pr-2 text-sm font-semibold text-text-primary focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <label htmlFor="downPaymentPercent" className="text-sm font-semibold text-text-primary">
                  Down Payment (%)
                </label>
                <div className="group relative inline-block">
                  <HelpCircle className="h-3.5 w-3.5 text-text-secondary hover:text-primary transition-colors cursor-help" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-slate-950 text-white text-[11px] rounded-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl leading-relaxed font-normal normal-case pointer-events-none">
                    Your down payment size as a percentage of the purchase price.
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-950"></div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <span className="absolute top-3 right-3 text-xs font-semibold text-text-secondary">%</span>
                <input
                  id="downPaymentPercent"
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={inputs.downPaymentPercent}
                  onChange={(e) => handleDpPercentChange(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="h-11 w-full rounded-xl border border-border-custom bg-bg-custom pl-3 pr-8 text-sm font-semibold text-text-primary focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Interest Rate & Tenure */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <label htmlFor="interestRate" className="text-sm font-semibold text-text-primary">
                  Interest Rate (%)
                </label>
                <div className="group relative inline-block">
                  <HelpCircle className="h-3.5 w-3.5 text-text-secondary hover:text-primary transition-colors cursor-help" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-slate-950 text-white text-[11px] rounded-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl leading-relaxed font-normal normal-case pointer-events-none">
                    Annual mortgage interest rate (p.a.). Floating home loan interest in Malaysia typically hovers between 3.8% and 4.5%.
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-950"></div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <span className="absolute top-3 right-3 text-xs font-semibold text-text-secondary">%</span>
                <input
                  id="interestRate"
                  type="number"
                  min="0.1"
                  max="25"
                  step="0.05"
                  value={inputs.interestRate}
                  onChange={(e) => handleInputChange('interestRate', Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                  className="h-11 w-full rounded-xl border border-border-custom bg-bg-custom pl-3 pr-8 text-sm font-semibold text-text-primary focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <label htmlFor="tenure" className="text-sm font-semibold text-text-primary">
                  Tenure (Years)
                </label>
                <div className="group relative inline-block">
                  <HelpCircle className="h-3.5 w-3.5 text-text-secondary hover:text-primary transition-colors cursor-help" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-slate-950 text-white text-[11px] rounded-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl leading-relaxed font-normal normal-case pointer-events-none">
                    Repayment tenure. Bank Negara limits Malaysian residential mortgage tenures to a maximum of 35 years.
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-950"></div>
                  </div>
                </div>
              </div>
              <select
                id="tenure"
                value={inputs.tenure}
                onChange={(e) => handleInputChange('tenure', parseInt(e.target.value) || 30)}
                className="h-11 w-full rounded-xl border border-border-custom bg-bg-custom px-3 text-sm font-semibold text-text-primary focus:border-primary focus:outline-none cursor-pointer"
              >
                {[5, 10, 15, 20, 25, 30, 35].map((yrs) => (
                  <option key={yrs} value={yrs}>{yrs} Years</option>
                ))}
              </select>
            </div>
          </div>

          {/* First Time Buyer Checkbox */}
          <div className="bg-bg-custom/60 rounded-xl p-4 border border-border-custom flex items-start gap-3">
            <input
              id="isFirstTimeBuyer"
              type="checkbox"
              checked={inputs.isFirstTimeBuyer}
              onChange={(e) => handleInputChange('isFirstTimeBuyer', e.target.checked)}
              className="mt-1 h-4.5 w-4.5 rounded border-border-custom text-primary focus:ring-primary accent-primary cursor-pointer"
            />
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <label htmlFor="isFirstTimeBuyer" className="text-xs font-bold text-text-primary cursor-pointer">
                  First-time Malaysian homebuyer
                </label>
                <div className="group relative inline-block">
                  <HelpCircle className="h-3 w-3 text-text-secondary hover:text-primary transition-colors cursor-help" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-950 text-white text-[11px] rounded-lg p-2.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl leading-relaxed font-normal normal-case pointer-events-none">
                    <span className="font-bold block text-primary mb-1">First-Time Buyer Exemption</span>
                    Qualified first-time Malaysian residential buyers get a 100% stamp duty waiver for homes priced up to RM500,000.
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-950"></div>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-text-secondary mt-0.5 leading-normal">
                Applies 100% stamp duty exemptions on property values below RM 500,000.
              </p>
            </div>
          </div>
          {/* Market Interest Rate Trend Indicator */}
          <MarketInterestRateTrend type="home-loan" />

          {/* Mandatory Disclaimer */}
          <Disclaimer />
        </div>

        {/* Right Column: Live Results */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Summary Tab / Amortization / Comparison Switcher */}
          <div className="flex border-b border-border-custom no-print overflow-x-auto">
            <button
              onClick={() => setActiveTab('summary')}
              className={`pb-3 text-xs font-extrabold tracking-wider uppercase border-b-2 transition-all px-4 cursor-pointer whitespace-nowrap ${
                activeTab === 'summary' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              Loan Summary
            </button>
            <button
              onClick={() => setActiveTab('amortization')}
              className={`pb-3 text-xs font-extrabold tracking-wider uppercase border-b-2 transition-all px-4 cursor-pointer whitespace-nowrap ${
                activeTab === 'amortization' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              Amortization Schedule
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`pb-3 text-xs font-extrabold tracking-wider uppercase border-b-2 transition-all px-4 cursor-pointer whitespace-nowrap ${
                activeTab === 'comparison' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              Compare Scenarios
            </button>
          </div>

          {activeTab === 'summary' ? (
            <div className="space-y-6 animate-fade-in">
              {/* 5. Live Summary */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <SectionHeader title="Monthly Mortgage Commitment" badge="Real-Time" />
                  <ExportButtons 
                    onCopyMarkdown={handleCopyMarkdown} 
                    onExportCsv={handleExportCsv} 
                    title="Home Loan Summary"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SummaryCard 
                    label="Monthly Repayment" 
                    value={`RM ${outputs.monthlyInstallment.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    description={`Calculated monthly payment over a period of ${inputs.tenure} years.`}
                    accent
                    tooltip="The amortized monthly installment combining principal reduction and bank interest accrued, calculated via standard compound mortgage formulas."
                  />
                  <SummaryCard 
                    label="Upfront Capital Needed" 
                    value={`RM ${outputs.totalInitialCost.toLocaleString('en-MY', { maximumFractionDigits: 0 })}`}
                    description="Standard 10% downpayment plus mandatory stamp duties."
                    success={outputs.spaStampDuty === 0}
                    tooltip="Total upfront cash required to close the property transaction. Includes the down payment, legal fees, loan agreement stamp duties, and SPA stamp duties."
                  />
                </div>
              </div>

              {/* 6. Interactive Charts */}
              <div className="bg-white border border-border-custom rounded-2xl p-6 shadow-xs">
                <SectionHeader title="Lifetime Loan Proportions" subtitle="Distribution of principal debt size compared to cumulative interest." />
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
                    
                    {/* Center Interest Label */}
                    <div className="absolute text-center flex flex-col justify-center">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-text-secondary leading-none">Interest Portion</span>
                      <span className="font-display font-black text-base text-amber-600 mt-1">
                        {((outputs.totalInterest / outputs.totalRepayment) * 100 || 0).toFixed(1)}%
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
                      <span>Total Repayable Cost</span>
                      <span className="font-mono text-primary">RM {outputs.totalRepayment.toLocaleString('en-MY', { maximumFractionDigits: 0 })}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 7. Detailed Breakdown */}
              <div className="bg-white border border-border-custom rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
                <SectionHeader title="Upfront Fee Breakdowns" subtitle="A breakdown of statutory LHDN duties and immediate transaction cash parameters." />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 border border-border-custom bg-bg-custom/40 rounded-xl space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-text-secondary">SPA Stamp Duty (LHDN)</span>
                    <span className={`block font-display font-black text-sm ${outputs.spaStampDuty === 0 ? 'text-success' : 'text-text-primary'}`}>
                      {outputs.spaStampDuty === 0 ? 'EXEMPT (RM 0)' : `RM ${outputs.spaStampDuty.toLocaleString('en-MY')}`}
                    </span>
                  </div>
                  <div className="p-3 border border-border-custom bg-bg-custom/40 rounded-xl space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-text-secondary">Loan Agreement Stamp Duty</span>
                    <span className={`block font-display font-black text-sm ${outputs.loanStampDuty === 0 ? 'text-success' : 'text-text-primary'}`}>
                      {outputs.loanStampDuty === 0 ? 'EXEMPT (RM 0)' : `RM ${outputs.loanStampDuty.toLocaleString('en-MY')}`}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs pt-2">
                  <div className="flex justify-between border-b border-bg-custom pb-2">
                    <span className="text-text-secondary font-medium">Financed Loan Size (Principal)</span>
                    <span className="font-semibold text-text-primary font-mono">RM {outputs.loanAmount.toLocaleString('en-MY')}</span>
                  </div>
                  <div className="flex justify-between border-b border-bg-custom pb-2">
                    <span className="text-text-secondary font-medium">Total Interest over tenure</span>
                    <span className="font-semibold text-amber-600 font-mono">RM {outputs.totalInterest.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-text-primary font-bold">Lifetime Mortgage Commitment</span>
                    <span className="font-extrabold text-primary font-mono">RM {outputs.totalRepayment.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'amortization' ? (
            /* 8. Tables - Amortization Schedule */
            <div className="bg-white border border-border-custom rounded-2xl p-6 sm:p-8 shadow-xs space-y-4 animate-fade-in print-card">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-border-custom pb-3">
                <div>
                  <h3 className="font-display font-bold text-sm text-text-primary uppercase tracking-wide">
                    Amortization Table (Yearly)
                  </h3>
                  <p className="text-[10px] text-text-secondary mt-0.5">
                    Year-by-year amortization depicting decreasing principal and compiled interest.
                  </p>
                </div>
                <ExportButtons 
                  onPrint={() => window.print()} 
                  onCopyMarkdown={handleCopyMarkdown} 
                  onExportCsv={handleExportCsv} 
                  title="Amortization Schedule"
                />
              </div>
              
              <div className="overflow-x-auto max-h-[440px]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-bg-custom border-b border-border-custom sticky top-0">
                      <th className="p-3 font-semibold text-text-primary">Year</th>
                      <th className="p-3 font-semibold text-text-primary">Principal Repaid</th>
                      <th className="p-3 font-semibold text-text-primary">Interest Repaid</th>
                      <th className="p-3 font-semibold text-text-primary">Cumulative Interest</th>
                      <th className="p-3 font-semibold text-text-primary text-right">Remaining Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outputs.amortizationSchedule.map((row) => (
                      <tr key={row.year} className="border-b border-bg-custom hover:bg-bg-custom/40">
                        <td className="p-3 font-bold text-text-primary font-mono">Yr {row.year}</td>
                        <td className="p-3 font-mono">RM {row.principalPaid.toLocaleString('en-MY')}</td>
                        <td className="p-3 font-mono text-amber-600">RM {row.interestPaid.toLocaleString('en-MY')}</td>
                        <td className="p-3 font-mono text-text-secondary">RM {row.cumulativeInterest.toLocaleString('en-MY')}</td>
                        <td className="p-3 font-mono text-text-primary text-right font-semibold">RM {row.remainingBalance.toLocaleString('en-MY')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* 8b. Compare Scenarios */
            <HomeLoanComparison currentInputs={inputs} />
          )}

        </div>
      </div>

      {/* 9. Rule-Based Insights */}
      <div className="space-y-4 no-print">
        <SectionHeader title="Statutory Insights & Mortgage Strategy" badge="Rules-Based" />
        <InsightCards insights={insights} />
      </div>

      {/* 10. Formula Explanation */}
      <div className="no-print">
        <FormulaExplanation 
          what="A home loan is paid using an amortized reducing-balance interest mechanism. While your monthly installment remains fixed, the ratio representing your interest charge decreases each month as your underlying outstanding loan principal is repaid."
          formula={
            <div className="space-y-1">
              <code className="block font-mono bg-bg-custom p-2 rounded-md text-[10px] text-primary">
                Monthly Repayment = [P × r × (1 + r)^n] / [(1 + r)^n - 1]
              </code>
              <code className="block font-mono bg-bg-custom p-2 rounded-md text-[10px] text-primary mt-1">
                Where P = Loan Amount, r = Monthly Interest Rate, n = Total Months
              </code>
            </div>
          }
          why="Understanding these figures empowers you to negotiate better borrowing rates with banking institutions and optimize your downpayment to safeguard against paying astronomical compounding interest over 30 to 35 years."
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
