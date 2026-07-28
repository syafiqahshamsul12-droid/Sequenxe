import React, { useState, useEffect } from 'react';
import { 
  Percent, 
  Shield, 
  HelpCircle, 
  RefreshCw, 
  ArrowRight, 
  Briefcase, 
  CheckCircle2, 
  XCircle, 
  Coins, 
  GraduationCap, 
  FileText,
  BookmarkCheck
} from 'lucide-react';
import { calculateEis } from '../../utils/formulas';
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
  CollapsibleBox,
  FAQSection, 
  Disclaimer 
} from './shared/CommonComponents';

interface EisCalcState {
  grossSalary: number;
}

const DEFAULT_STATE: EisCalcState = {
  grossSalary: 4500
};

export default function EisCalculator() {
  const { values, setValues, resetConfig, hasSavedIndicator } = useSaveConfig<EisCalcState>('eis', DEFAULT_STATE);
  const grossSalary = values.grossSalary;

  const [eisResult, setEisResult] = useState<{ employee: number; employer: number }>({ employee: 0, employer: 0 });

  useEffect(() => {
    setEisResult(calculateEis(grossSalary));
  }, [grossSalary]);

  const handleReset = () => {
    resetConfig();
  };

  const handleSalaryChange = (val: number) => {
    setValues({ grossSalary: val });
  };


  const eis = eisResult.employee;
  const employerEis = eisResult.employer;
  const totalMonthlyEis = eis + employerEis;

  const annualEmployeeEis = eis * 12;
  const annualEmployerEis = employerEis * 12;
  const annualTotalEis = totalMonthlyEis * 12;

  const cappedSalary = Math.min(grossSalary, 6000);

  const navigateTo = (viewId: string) => {
    const navEvent = new CustomEvent('change-view', { detail: viewId });
    window.dispatchEvent(navEvent);
  };

  const handleExportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Monthly (RM),Annual (RM)\n"
      + `Gross Salary,${grossSalary},${grossSalary * 12}\n`
      + `Effective Wage Capped,${cappedSalary},${cappedSalary * 12}\n`
      + `Employee EIS Share (0.2%),${eis.toFixed(2)},${annualEmployeeEis.toFixed(2)}\n`
      + `Employer EIS Share (0.2%),${employerEis.toFixed(2)},${annualEmployerEis.toFixed(2)}\n`
      + `Total Monthly EIS Fund,${totalMonthlyEis.toFixed(2)},${annualTotalEis.toFixed(2)}`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "eis_contributions_report_malaysia.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [copied, setCopied] = useState(false);

  const handleCopyMarkdown = () => {
    const summaryText = `### EIS (SIP) Employment Insurance Report Malaysia
- **Gross Monthly Salary**: RM ${grossSalary.toLocaleString('en-MY')}
- **Salary Cap Applied**: RM ${cappedSalary.toLocaleString('en-MY')} (Max RM 6,000)
- **Employee Share (0.2%)**: RM ${eis.toFixed(2)}/month (Annual: RM ${annualEmployeeEis.toFixed(2)})
- **Employer Share (0.2%)**: RM ${employerEis.toFixed(2)}/month (Annual: RM ${annualEmployerEis.toFixed(2)})
- **Total EIS Fund Contribution**: RM ${totalMonthlyEis.toFixed(2)}/month (Annual: RM ${annualTotalEis.toFixed(2)})`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const insights = [
    {
      type: 'success' as const,
      title: "Statutory Retrenchment Safety Net",
      text: "SIP / EIS provides monthly Job Search Allowances (JSA) for up to 6 months, Early Re-employment Allowances, and skills retraining stips in the event of involuntary retrenchment."
    },
    {
      type: 'info' as const,
      title: "Strict RM 11.90 Monthly Cap",
      text: "The 0.2% contribution rate caps strictly at the RM 6,000 monthly wage ceiling. High earners pay a maximum of RM 11.90/month, matched equally by RM 11.90 from the employer."
    }
  ];

  const faqs = [
    {
      question: "What is EIS (SIP) in Malaysia?",
      answer: "EIS (Employment Insurance System / Sistem Insurans Pekerjaan) is a statutory protection scheme managed by PERKESO under the Employment Insurance System Act 2017. It acts as a safety net providing financial stips and re-employment placement for workers who suffer involuntary job loss."
    },
    {
      question: "What is the maximum monthly EIS contribution rate?",
      answer: "EIS is calculated at 0.2% for the employee and 0.2% for the employer on gross monthly salary capped at RM 6,000. The maximum deduction is strictly RM 11.90/month for employee and RM 11.90/month for employer."
    },
    {
      question: "What benefits can I claim if I am retrenched?",
      answer: "Retrenched employees covered by EIS can claim the Job Search Allowance (JSA - up to 6 months of financial assistance), Early Re-employment Allowance (ERA), Training Allowance (TA) with up to RM 4,000 in covered course fees, and free career placement services."
    },
    {
      question: "Can I claim EIS if I resign voluntarily?",
      answer: "No. EIS benefits apply exclusively to involuntary job loss (such as retrenchment, company bankruptcy, VSS/MSS voluntary separation schemes, or constructive dismissal). Voluntary resignations or retirements are ineligible."
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <SEOManager 
        title="EIS Calculator Malaysia | SIP Employment Insurance System"
        description="Calculate 0.2% statutory Employment Insurance System (SIP / EIS) employee and employer contributions in Malaysia capped at RM 11.90/month. View benefits & retrenchment rules."
        canonicalUrl="https://sequenxe.com/eis-calculator"
        calculatorId="eis-calculator"
        faqs={faqs}
        breadcrumbs={[
          { name: 'Home', url: 'https://sequenxe.com/' },
          { name: 'EIS Calculator Malaysia', url: 'https://sequenxe.com/eis-calculator' }
        ]}
      />

      {/* Breadcrumb & Hero (web-only) */}
      <div className="no-print">
        <Breadcrumb 
          items={[
            { label: 'Home', href: 'home' },
            { label: 'Salary & Tax', href: 'home' },
            { label: 'EIS Calculator Malaysia' }
          ]} 
        />

        <CalculatorHero 
          title="EIS Calculator Malaysia"
          description="Compute statutory Employment Insurance System (SIP / EIS) 0.2% employee and employer deductions capped at a maximum of RM 11.90/month under the RM 6,000 salary ceiling."
          estimatedTime="1 min"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Input Panel */}
        <div className="lg:col-span-5 bg-white border border-border-custom rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 no-print">
          <div className="flex justify-between items-center border-b border-border-custom pb-3">
            <SectionHeader title="Salary Inputs" />
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

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="grossSalaryEis" className="text-xs font-semibold text-text-primary">
                Gross Monthly Salary (RM)
              </label>
              <div className="relative">
                <span className="absolute top-3 left-4 text-xs font-semibold text-text-secondary">RM</span>
                <input
                  id="grossSalaryEis"
                  type="number"
                  min="0"
                  step="100"
                  value={grossSalary}
                  onChange={(e) => handleSalaryChange(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="h-11 w-full rounded-xl border border-border-custom bg-bg-custom pl-11 pr-4 text-xs font-bold text-text-primary focus:border-primary focus:bg-white focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-text-secondary">
                0.2% statutory rate automatically caps at the RM 6,000 wage ceiling (RM 11.90 max).
              </p>
            </div>

            <div className="p-4 bg-bg-custom rounded-xl border border-border-custom space-y-2">
              <span className="text-[10px] font-bold uppercase text-text-secondary font-mono block">
                Capped Contribution Rate (0.2%)
              </span>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary">Gross Wage Entered:</span>
                <span className="font-mono font-bold text-text-primary">RM {grossSalary.toLocaleString('en-MY')}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary">Capped Wage Applied:</span>
                <span className="font-mono font-bold text-primary">RM {cappedSalary.toLocaleString('en-MY')}</span>
              </div>
            </div>
          </div>
          {/* Mandatory Disclaimer */}
          <Disclaimer />
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          <SectionHeader title="EIS Contribution Summary" badge="0.2% Statutory" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SummaryCard 
              label="Employee EIS Share" 
              value={`RM ${eis.toFixed(2)}`}
              description={`0.2% monthly deduction. Annual: RM ${annualEmployeeEis.toFixed(2)}`}
              accent
            />
            <SummaryCard 
              label="Employer EIS Share" 
              value={`RM ${employerEis.toFixed(2)}`}
              description={`0.2% employer contribution. Annual: RM ${annualEmployerEis.toFixed(2)}`}
              success
            />
          </div>

          {/* Monthly & Annual EIS Breakdown Table */}
          <div className="bg-white border border-border-custom rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-border-custom pb-3">
              <h3 className="font-display font-bold text-sm text-text-primary uppercase tracking-wide">
                Annual EIS Contribution Breakdown
              </h3>
              <ExportButtons 
                onCopyMarkdown={handleCopyMarkdown} 
                onExportCsv={handleExportCsv} 
                title="EIS Report"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border-custom bg-bg-custom/80 font-mono text-[10px] text-text-secondary uppercase">
                    <th className="p-2.5 font-bold">EIS Share Component</th>
                    <th className="p-2.5 text-right font-bold">Monthly (RM)</th>
                    <th className="p-2.5 text-right font-bold">Annual (RM)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-bg-custom">
                    <td className="p-2.5 font-semibold text-text-primary">Employee Share (0.2%)</td>
                    <td className="p-2.5 font-mono text-right text-primary font-bold">RM {eis.toFixed(2)}</td>
                    <td className="p-2.5 font-mono text-right text-primary">RM {annualEmployeeEis.toFixed(2)}</td>
                  </tr>
                  <tr className="border-b border-bg-custom">
                    <td className="p-2.5 font-semibold text-text-primary">Employer Share (0.2%)</td>
                    <td className="p-2.5 font-mono text-right text-emerald-700 font-bold">RM {employerEis.toFixed(2)}</td>
                    <td className="p-2.5 font-mono text-right text-emerald-700">RM {annualEmployerEis.toFixed(2)}</td>
                  </tr>
                  <tr className="bg-primary/5">
                    <td className="p-2.5 font-bold text-primary">Total Statutory EIS Protection Fund</td>
                    <td className="p-2.5 font-mono font-bold text-right text-primary">RM {totalMonthlyEis.toFixed(2)}</td>
                    <td className="p-2.5 font-mono font-bold text-right text-primary">RM {annualTotalEis.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* Educational Sections (Collapsible Accordions) */}
      <div className="space-y-6 no-print">
        {/* Benefits Available Under EIS */}
        <CollapsibleBox 
          title="Benefits Available Under the Employment Insurance System (EIS / SIP)"
          subtitle="When an eligible worker experiences loss of employment, EIS provides five core statutory protection benefits"
          icon={<Briefcase className="h-4 w-4" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <div className="p-4 bg-bg-custom/50 border border-border-custom rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-primary font-bold text-xs">
                <Coins className="h-4 w-4" />
                <span>Job Search Allowance (JSA)</span>
              </div>
              <p className="text-[11px] text-text-secondary leading-normal">
                Monthly income replacement paid for 3 to 6 months during active job searching (80% down to 30% of average monthly wage).
              </p>
            </div>

            <div className="p-4 bg-bg-custom/50 border border-border-custom rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-primary font-bold text-xs">
                <CheckCircle2 className="h-4 w-4" />
                <span>Early Re-employment Allowance</span>
              </div>
              <p className="text-[11px] text-text-secondary leading-normal">
                Lump-sum cash bonus paid to jobseekers who secure new employment quickly while receiving JSA (25% of remaining balance).
              </p>
            </div>

            <div className="p-4 bg-bg-custom/50 border border-border-custom rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-primary font-bold text-xs">
                <GraduationCap className="h-4 w-4" />
                <span>Training Allowance & Fees</span>
              </div>
              <p className="text-[11px] text-text-secondary leading-normal">
                Up to <strong>RM 4,000</strong> in fully sponsored vocational course fees plus a daily training allowance (RM 10 to RM 20/day).
              </p>
            </div>

            <div className="p-4 bg-bg-custom/50 border border-border-custom rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-primary font-bold text-xs">
                <Shield className="h-4 w-4" />
                <span>Reduced Income Allowance</span>
              </div>
              <p className="text-[11px] text-text-secondary leading-normal">
                Financial support for workers with multiple jobs who lost one of their primary employment streams.
              </p>
            </div>

            <div className="p-4 bg-bg-custom/50 border border-border-custom rounded-xl space-y-1.5 md:col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 text-primary font-bold text-xs">
                <Briefcase className="h-4 w-4" />
                <span>Re-employment Placement & Counseling</span>
              </div>
              <p className="text-[11px] text-text-secondary leading-normal">
                Personalized career matching, resume polishing, and job interview placement assistance assigned by PERKESO officers.
              </p>
            </div>

          </div>
        </CollapsibleBox>

        {/* Educational: Eligibility Rules & RM 6,000 Ceiling */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Eligibility Overview */}
          <CollapsibleBox 
            title="Eligibility Rules for EIS Retrenchment Claims"
            icon={<CheckCircle2 className="h-4 w-4" />}
          >
            <p className="text-xs text-text-secondary leading-relaxed mb-2">
              To qualify for EIS retrenchment allowances, claimants must fulfill the following:
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-text-secondary"><strong>Eligible Scenarios</strong>: Involuntary job loss (retrenchment, company liquidation, VSS/MSS schemes, constructive dismissal).</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-text-secondary"><strong>Minimum Contribution History</strong>: Must have contributed for at least 24 specified months prior to retrenchment.</span>
              </div>
              <div className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                <span className="text-text-secondary"><strong>Ineligible Scenarios</strong>: Voluntary resignation without cause, standard retirement at age 60, contract expiry, or dismissal for serious misconduct.</span>
              </div>
            </div>
          </CollapsibleBox>

          {/* Explanation of RM6,000 Ceiling */}
          <CollapsibleBox 
            title="Explanation of the RM 6,000 EIS Wage Ceiling"
            icon={<Coins className="h-4 w-4" />}
          >
            <p className="text-xs text-text-secondary leading-relaxed">
              EIS contributions are fixed at 0.2% for employee and 0.2% for employer, capped at the statutory <strong>RM 6,000</strong> monthly wage ceiling.
            </p>
            <ul className="text-xs text-text-secondary space-y-2 list-disc pl-4 pt-1">
              <li>For monthly salaries of RM 6,000 or above, the monthly EIS deduction is capped at exactly <strong>RM 11.90</strong> for the employee and <strong>RM 11.90</strong> for the employer.</li>
              <li>The total monthly contribution per employee never exceeds <strong>RM 23.80</strong> into the national SIP fund pool.</li>
            </ul>
          </CollapsibleBox>

        </div>
      </div>

      <div className="space-y-4 no-print">
        <SectionHeader title="EIS Highlights" badge="Rules-Based" />
        <InsightCards insights={insights} />
      </div>

      <div className="no-print">
        <FormulaExplanation 
          what="EIS (SIP) is calculated as 0.2% of the employee's monthly gross salary, up to a maximum wage ceiling of RM 6,000 per month (maximum RM 11.90)."
          formula={
            <code className="block font-mono bg-bg-custom p-2.5 rounded-md text-[11px] text-primary">
              EIS Deduction = Min(Gross Salary, RM 6,000) × 0.2%
            </code>
          }
          why="EIS protects private sector employees by offering unemployment benefits and retraining stipends during retrenchments."
        />
      </div>

      <div className="space-y-4 no-print">
        <SectionHeader title="Frequently Asked Questions (FAQ)" badge="EIS FAQ" />
        <FAQSection faqs={faqs} />
      </div>

    </div>
  );
}

