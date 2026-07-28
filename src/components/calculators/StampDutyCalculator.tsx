import React, { useState, useEffect } from 'react';
import { Home, Percent, HelpCircle, RefreshCw, CheckCircle2, BookmarkCheck } from 'lucide-react';
import { StampDutyInputs, StampDutyOutputs } from '../../types';
import { calculateStampDuty } from '../../utils/formulas';
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

const DEFAULT_INPUTS: StampDutyInputs = {
  propertyPrice: 450000,
  loanAmount: 405000,
  isFirstTimeBuyer: true
};

export default function StampDutyCalculator() {
  const { values: inputs, setValues: setInputs, resetConfig, hasSavedIndicator } = useSaveConfig<StampDutyInputs>('stamp_duty', DEFAULT_INPUTS);
  const [outputs, setOutputs] = useState<StampDutyOutputs | null>(null);

  useEffect(() => {
    const results = calculateStampDuty(inputs);
    setOutputs(results);
  }, [inputs]);

  if (!outputs) return null;

  const handleReset = () => {
    resetConfig();
  };


  const handleInputChange = (field: keyof StampDutyInputs, value: any) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Fee Category,Amount (RM)\n"
      + `Property Price,${inputs.propertyPrice}\n`
      + `Housing Loan Amount,${inputs.loanAmount}\n`
      + `SPA Stamp Duty (Tiered),${outputs.spaStampDuty.toFixed(2)}\n`
      + `Loan Agreement Stamp Duty (0.5%),${outputs.loanStampDuty.toFixed(2)}\n`
      + `Estimated Legal Fees,${outputs.estimatedLegalFees.toFixed(2)}\n`
      + `Total Upfront Stamp Duty & Legal Fees,${outputs.totalDisbursementAndFees.toFixed(2)}\n`
      + `First Time Homebuyer Exemption,${inputs.isFirstTimeBuyer && inputs.propertyPrice <= 500000 ? 'YES (100% Waived)' : 'NO'}`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "stamp_duty_and_legal_fees_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyMarkdown = () => {
    const summaryText = `### Malaysian Stamp Duty & Legal Fees Report
- **Property Price**: RM ${inputs.propertyPrice.toLocaleString('en-MY')}
- **Loan Amount**: RM ${inputs.loanAmount.toLocaleString('en-MY')}
- **First-Time Homebuyer Exemption**: ${inputs.isFirstTimeBuyer && inputs.propertyPrice <= 500000 ? '100% Waiver Exemption Applied' : 'Standard Rate'}
- **SPA Tier Stamp Duty**: RM ${outputs.spaStampDuty.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
- **Loan Agreement Stamp Duty**: RM ${outputs.loanStampDuty.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
- **Estimated Legal Fees**: RM ${outputs.estimatedLegalFees.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
- **Total Upfront Legal & Duty Cash Needed**: RM ${outputs.totalDisbursementAndFees.toLocaleString('en-MY', { minimumFractionDigits: 2 })}`;

    navigator.clipboard.writeText(summaryText);
  };

  const insights = [
    {
      type: (inputs.isFirstTimeBuyer && inputs.propertyPrice <= 500000 ? 'success' : 'info') as 'success' | 'info',
      title: "First-Time Homebuyer 100% Exemption",
      text: inputs.isFirstTimeBuyer && inputs.propertyPrice <= 500000
        ? `Congratulations! As a first-time Malaysian homebuyer purchasing a residential property under RM 500,000, you save RM ${(outputs.spaStampDuty + outputs.loanStampDuty).toLocaleString('en-MY')} via 100% stamp duty waiver exemptions!`
        : "First-time buyers purchasing properties priced up to RM 500,000 enjoy 100% exemption on both SPA and Loan agreement stamp duties."
    },
    {
      type: 'warning' as const,
      title: "Disbursement & Valuer Fees",
      text: "Besides stamp duty and scale legal fees, budget an additional RM 1,500 - RM 3,000 for valuer reports, bank processing fees, and land search disbursements."
    }
  ];

  const faqs = [
    {
      question: "What are the stamp duty rates for SPA in Malaysia?",
      answer: "Property Sale and Purchase Agreement (SPA) stamp duty follows a progressive tier: 1% on the first RM100,000; 2% on RM100,001 to RM500,000; 3% on RM500,001 to RM1,000,000; and 4% on any amount exceeding RM1,000,000."
    },
    {
      question: "How is loan agreement stamp duty calculated?",
      answer: "Loan agreement stamp duty in Malaysia is calculated at a flat 0.5% (RM 5 per RM 1,000) of the total home loan principal amount."
    },
    {
      question: "Are first-time buyers exempt from stamp duty in 2026?",
      answer: "Yes, under current government initiatives, first-time Malaysian homebuyers are entitled to a 100% stamp duty waiver on both the Instrument of Transfer (SPA) and Loan Agreement for residential properties valued up to RM 500,000."
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <SEOManager 
        title="Stamp Duty Calculator Malaysia - Property & Loan Agreement Duties"
        description="Calculate Malaysian SPA & Loan agreement stamp duty fees, scale legal fees, and check first-time homebuyer 100% stamp duty waiver exemptions."
        canonicalUrl="https://sequenxe.com/my/stamp-duty-calculator"
        calculatorId="stamp-duty-calculator"
        faqs={faqs}
        breadcrumbs={[
          { name: 'Home', url: 'https://sequenxe.com/my' },
          { name: 'Home & Property', url: 'https://sequenxe.com/my/property' },
          { name: 'Stamp Duty Calculator', url: 'https://sequenxe.com/my/stamp-duty-calculator' }
        ]}
      />

      {/* Breadcrumb & Hero (web-only) */}
      <div className="no-print">
        <Breadcrumb 
          currentName="Stamp Duty Calculator Malaysia" 
          onHomeClick={() => {
            const navEvent = new CustomEvent('change-view', { detail: 'home' });
            window.dispatchEvent(navEvent);
          }} 
        />

        <CalculatorHero 
          title="🏠 Stamp Duty Calculator Malaysia"
          description="Estimate progressive SPA Instrument of Transfer stamp duty, 0.5% loan agreement duty, legal fee scale rates, and first-time homebuyer waiver exemptions."
          estimatedTime="2 mins"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 bg-white border border-border-custom rounded-2xl p-6 sm:p-8 shadow-xs space-y-5 no-print">
          <div className="flex justify-between items-center border-b border-border-custom pb-3">
            <h2 className="font-display font-bold text-base text-text-primary uppercase tracking-wide">
              Property Details
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
            <label htmlFor="propertyPriceStamp" className="text-sm font-semibold text-text-primary">
              Property Purchase Price (RM)
            </label>
            <div className="relative">
              <span className="absolute top-3.5 left-4 text-sm font-semibold text-text-secondary">RM</span>
              <input
                id="propertyPriceStamp"
                type="number"
                min="50000"
                step="10000"
                value={inputs.propertyPrice}
                onChange={(e) => {
                  const val = Math.max(0, parseFloat(e.target.value) || 0);
                  setInputs(prev => ({
                    ...prev,
                    propertyPrice: val,
                    loanAmount: Math.round(val * 0.9)
                  }));
                }}
                className="h-12 w-full rounded-xl border border-border-custom bg-bg-custom pl-11 pr-4 text-sm font-semibold text-text-primary focus:border-primary focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="loanAmountStamp" className="text-sm font-semibold text-text-primary">
              Home Loan Principal Amount (RM)
            </label>
            <div className="relative">
              <span className="absolute top-3.5 left-4 text-sm font-semibold text-text-secondary">RM</span>
              <input
                id="loanAmountStamp"
                type="number"
                min="0"
                step="10000"
                value={inputs.loanAmount}
                onChange={(e) => handleInputChange('loanAmount', Math.max(0, parseFloat(e.target.value) || 0))}
                className="h-12 w-full rounded-xl border border-border-custom bg-bg-custom pl-11 pr-4 text-sm font-semibold text-text-primary focus:border-primary focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-bg-custom/60 rounded-xl p-4 border border-border-custom flex items-start gap-3">
            <input
              id="isFirstTimeBuyerStamp"
              type="checkbox"
              checked={inputs.isFirstTimeBuyer}
              onChange={(e) => handleInputChange('isFirstTimeBuyer', e.target.checked)}
              className="mt-1 h-4.5 w-4.5 rounded border-border-custom text-primary focus:ring-primary accent-primary cursor-pointer"
            />
            <div className="flex-1">
              <label htmlFor="isFirstTimeBuyerStamp" className="text-xs font-bold text-text-primary cursor-pointer">
                First-Time Homebuyer
              </label>
              <p className="text-[10px] text-text-secondary mt-0.5 leading-normal">
                100% stamp duty waiver exemption for residential properties priced up to RM 500,000.
              </p>
            </div>
          </div>
          {/* Mandatory Disclaimer */}
          <Disclaimer />
        </div>

        <div className="lg:col-span-7 space-y-6">
          <SectionHeader title="Upfront Fee Summary" badge="Real-Time" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SummaryCard 
              label="SPA Instrument Stamp Duty" 
              value={`RM ${outputs.spaStampDuty.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              description={inputs.isFirstTimeBuyer && inputs.propertyPrice <= 500000 ? '100% Waived (First-Time Buyer)' : 'Tiered progressive rates (1% to 4%)'}
              accent={outputs.spaStampDuty > 0}
              success={outputs.spaStampDuty === 0}
            />
            <SummaryCard 
              label="Loan Agreement Stamp Duty" 
              value={`RM ${outputs.loanStampDuty.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              description={inputs.isFirstTimeBuyer && inputs.propertyPrice <= 500000 ? '100% Waived (First-Time Buyer)' : 'Flat 0.5% of loan principal'}
              success={outputs.loanStampDuty === 0}
            />
          </div>

          <div className="bg-white border border-border-custom rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-border-custom pb-3">
              <h3 className="font-display font-bold text-sm text-text-primary uppercase tracking-wide">
                Upfront Cash Outlay Breakdown
              </h3>
              <ExportButtons 
                onCopyMarkdown={handleCopyMarkdown} 
                onExportCsv={handleExportCsv} 
                title="Stamp Duty Report"
              />
            </div>

            <table className="w-full text-left border-collapse text-xs">
              <tbody>
                <tr className="border-b border-bg-custom">
                  <td className="p-2.5 font-semibold text-text-primary">Property Price</td>
                  <td className="p-2.5 font-mono text-right">RM {inputs.propertyPrice.toLocaleString('en-MY')}</td>
                </tr>
                <tr className="border-b border-bg-custom">
                  <td className="p-2.5 font-semibold text-text-primary">SPA Tier Stamp Duty</td>
                  <td className="p-2.5 font-mono text-right font-bold text-primary">
                    {outputs.spaStampDuty === 0 ? 'RM 0 (Waived)' : `RM ${outputs.spaStampDuty.toLocaleString('en-MY', { minimumFractionDigits: 2 })}`}
                  </td>
                </tr>
                <tr className="border-b border-bg-custom">
                  <td className="p-2.5 font-semibold text-text-primary">Loan Agreement Stamp Duty (0.5%)</td>
                  <td className="p-2.5 font-mono text-right font-bold text-primary">
                    {outputs.loanStampDuty === 0 ? 'RM 0 (Waived)' : `RM ${outputs.loanStampDuty.toLocaleString('en-MY', { minimumFractionDigits: 2 })}`}
                  </td>
                </tr>
                <tr className="border-b border-bg-custom">
                  <td className="p-2.5 font-semibold text-text-primary">Estimated Scale Legal Fees</td>
                  <td className="p-2.5 font-mono text-right">RM {outputs.estimatedLegalFees.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr className="bg-primary/5">
                  <td className="p-2.5 font-bold text-primary">Total Upfront Duties & Legal Fees</td>
                  <td className="p-2.5 font-mono font-bold text-right text-primary">RM {outputs.totalDisbursementAndFees.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="space-y-4 no-print">
        <SectionHeader title="Stamp Duty Insights" badge="Rules-Based" />
        <InsightCards insights={insights} />
      </div>

      <div className="no-print">
        <FormulaExplanation 
          what="SPA Stamp duty in Malaysia is calculated on a tiered scale: 1% for first RM100k, 2% for next RM400k, 3% for next RM500k, and 4% above RM1 million. Loan agreement stamp duty is a flat 0.5%."
          formula={
            <code className="block font-mono bg-bg-custom p-2.5 rounded-md text-[11px] text-primary">
              Loan Duty = Loan Amount × 0.5%
            </code>
          }
          why="Knowing your exact stamp duty and legal fees prevents cash flow surprises during property transfers."
        />
      </div>

      <div className="space-y-4 no-print">
        <SectionHeader title="Frequently Asked Questions (FAQ)" badge="Stamp Duty" />
        <FAQSection faqs={faqs} />
      </div>
    </div>
  );
}
