import React, { useState, useEffect } from 'react';
import { 
  Percent, 
  Shield, 
  HelpCircle, 
  RefreshCw, 
  ArrowRight, 
  CheckCircle2, 
  Info, 
  HeartPulse, 
  Users, 
  Coins, 
  AlertCircle,
  BookmarkCheck
} from 'lucide-react';
import { calculateSocso } from '../../utils/formulas';
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

interface SocsoCalcState {
  grossSalary: number;
}

const DEFAULT_STATE: SocsoCalcState = {
  grossSalary: 4500
};

export default function SocsoCalculator() {
  const { values, setValues, resetConfig, hasSavedIndicator } = useSaveConfig<SocsoCalcState>('socso', DEFAULT_STATE);
  const grossSalary = values.grossSalary;

  const [socsoResult, setSocsoResult] = useState<{ employee: number; employer: number }>({ employee: 0, employer: 0 });

  useEffect(() => {
    setSocsoResult(calculateSocso(grossSalary));
  }, [grossSalary]);

  const handleReset = () => {
    resetConfig();
  };

  const handleSalaryChange = (val: number) => {
    setValues({ grossSalary: val });
  };


  const socso = socsoResult.employee;
  const employerSocso = socsoResult.employer;
  const totalMonthlySocso = socso + employerSocso;

  const annualEmployeeSocso = socso * 12;
  const annualEmployerSocso = employerSocso * 12;
  const annualTotalSocso = totalMonthlySocso * 12;

  const cappedSalary = Math.min(grossSalary, 6000);

  const navigateTo = (viewId: string) => {
    const navEvent = new CustomEvent('change-view', { detail: viewId });
    window.dispatchEvent(navEvent);
  };

  const handleExportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Monthly (RM),Annual (RM)\n"
      + `Gross Salary,${grossSalary},${grossSalary * 12}\n`
      + `Effective Salary Capped,${cappedSalary},${cappedSalary * 12}\n`
      + `Employee SOCSO Share (~0.5%),${socso.toFixed(2)},${annualEmployeeSocso.toFixed(2)}\n`
      + `Employer SOCSO Share (~1.75%),${employerSocso.toFixed(2)},${annualEmployerSocso.toFixed(2)}\n`
      + `Total Monthly Protection Pool,${totalMonthlySocso.toFixed(2)},${annualTotalSocso.toFixed(2)}`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "socso_contributions_report_malaysia.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [copied, setCopied] = useState(false);

  const handleCopyMarkdown = () => {
    const summaryText = `### SOCSO (PERKESO) Statutory Report Malaysia
- **Gross Monthly Salary**: RM ${grossSalary.toLocaleString('en-MY')}
- **Salary Ceiling Applied**: RM ${cappedSalary.toLocaleString('en-MY')} (Max RM 6,000)
- **Employee Share Deduction**: RM ${socso.toFixed(2)}/month (Annual: RM ${annualEmployeeSocso.toFixed(2)})
- **Employer Share Contribution**: RM ${employerSocso.toFixed(2)}/month (Annual: RM ${annualEmployerSocso.toFixed(2)})
- **Total Statutory Protection**: RM ${totalMonthlySocso.toFixed(2)}/month (Annual: RM ${annualTotalSocso.toFixed(2)})`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const insights = [
    {
      type: 'success' as const,
      title: "Revised RM 6,000 Monthly Salary Ceiling",
      text: "PERKESO has increased the statutory wage cap from RM 5,000 to RM 6,000. For employees earning RM 6,000 or above, monthly benefits for workplace disability and pensions now payout at higher tier allowances."
    },
    {
      type: 'info' as const,
      title: "24-Hour Invalidity Scheme Protection",
      text: "Unlike standard commercial insurance, SOCSO's Invalidity Scheme provides 24-hour round-the-clock invalidity pensions and survivor death benefits regardless of whether the illness or accident occurred at work."
    }
  ];

  const faqs = [
    {
      question: "What is SOCSO (PERKESO) in Malaysia?",
      answer: "SOCSO (Pertubuhan Keselamatan Sosial / PERKESO) is Malaysia's government agency enforcing social security protection under the Employees' Social Security Act 1969. It provides medical treatment, disability pensions, and death benefits for workplace injuries and permanent invalidity."
    },
    {
      question: "What is the maximum SOCSO contribution in Malaysia?",
      answer: "The monthly salary ceiling for SOCSO contributions is RM 6,000. Employees earning RM 6,000 or more pay a fixed maximum deduction of RM 29.75 per month, while employers contribute a maximum of RM 104.15 per month."
    },
    {
      question: "What is the difference between Category 1 and Category 2 SOCSO?",
      answer: "Category 1 covers both Employment Injury and Invalidity schemes for employees aged below 60 (joint employee and employer contribution). Category 2 covers Employment Injury only for employees aged 60 and above, paid 100% by the employer."
    },
    {
      question: "Are foreign workers eligible for SOCSO coverage in Malaysia?",
      answer: "Yes, all foreign workers holding valid employment permits in Malaysia must be registered under SOCSO Employment Injury Scheme, paid by employers at 1.25% of monthly salary."
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <SEOManager 
        title="SOCSO Calculator Malaysia | PERKESO Contribution Rates"
        description="Lookup statutory PERKESO (SOCSO) employee (~0.5%) and employer (~1.75%) contribution rates up to the RM 6,000 monthly salary cap. View annual projections & benefits breakdown."
        canonicalUrl="https://sequenxe.com/socso-calculator"
        calculatorId="socso-calculator"
        faqs={faqs}
        breadcrumbs={[
          { name: 'Home', url: 'https://sequenxe.com/' },
          { name: 'SOCSO Calculator Malaysia', url: 'https://sequenxe.com/socso-calculator' }
        ]}
      />

      {/* Breadcrumb & Hero (web-only) */}
      <div className="no-print">
        <Breadcrumb 
          items={[
            { label: 'Home', href: 'home' },
            { label: 'Salary & Tax', href: 'home' },
            { label: 'SOCSO Calculator Malaysia' }
          ]} 
        />

        <CalculatorHero 
          title="SOCSO Calculator Malaysia"
          description="Calculate official statutory PERKESO employee (~0.5%) and employer (~1.75%) contribution rates for Category 1 and Category 2 based on the revised RM 6,000 monthly wage ceiling."
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
              <label htmlFor="grossSalarySocso" className="text-xs font-semibold text-text-primary">
                Gross Monthly Salary (RM)
              </label>
              <div className="relative">
                <span className="absolute top-3 left-4 text-xs font-semibold text-text-secondary">RM</span>
                <input
                  id="grossSalarySocso"
                  type="number"
                  min="0"
                  step="100"
                  value={grossSalary}
                  onChange={(e) => handleSalaryChange(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="h-11 w-full rounded-xl border border-border-custom bg-bg-custom pl-11 pr-4 text-xs font-bold text-text-primary focus:border-primary focus:bg-white focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-text-secondary">
                Calculations automatically cap at the statutory RM 6,000 monthly wage threshold.
              </p>
            </div>

            <div className="p-4 bg-bg-custom rounded-xl border border-border-custom space-y-2">
              <span className="text-[10px] font-bold uppercase text-text-secondary font-mono block">
                Statutory Wage Threshold
              </span>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary">Monthly Salary Entered:</span>
                <span className="font-mono font-bold text-text-primary">RM {grossSalary.toLocaleString('en-MY')}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary">Effective Wage Capped:</span>
                <span className="font-mono font-bold text-primary">RM {cappedSalary.toLocaleString('en-MY')}</span>
              </div>
            </div>
          </div>
          {/* Mandatory Disclaimer */}
          <Disclaimer />
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          <SectionHeader title="PERKESO Contribution Summary" badge="Official Rates" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SummaryCard 
              label="Employee Share Deduction" 
              value={`RM ${socso.toFixed(2)}`}
              description={`Deducted monthly (~0.5%). Annual: RM ${annualEmployeeSocso.toFixed(2)}`}
              accent
            />
            <SummaryCard 
              label="Employer Share Contribution" 
              value={`RM ${employerSocso.toFixed(2)}`}
              description={`Contributed by employer (~1.75%). Annual: RM ${annualEmployerSocso.toFixed(2)}`}
              success
            />
          </div>

          {/* Monthly & Annual Projection Schedule Table */}
          <div className="bg-white border border-border-custom rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-border-custom pb-3">
              <h3 className="font-display font-bold text-sm text-text-primary uppercase tracking-wide">
                SOCSO Contribution & Annual Projection
              </h3>
              <ExportButtons 
                onCopyMarkdown={handleCopyMarkdown} 
                onExportCsv={handleExportCsv} 
                title="SOCSO Report"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border-custom bg-bg-custom/80 font-mono text-[10px] text-text-secondary uppercase">
                    <th className="p-2.5 font-bold">Contribution Component</th>
                    <th className="p-2.5 text-right font-bold">Monthly (RM)</th>
                    <th className="p-2.5 text-right font-bold">Annual (RM)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-bg-custom">
                    <td className="p-2.5 font-semibold text-text-primary">Employee Share (~0.5%)</td>
                    <td className="p-2.5 font-mono text-right text-primary font-bold">RM {socso.toFixed(2)}</td>
                    <td className="p-2.5 font-mono text-right text-primary">RM {annualEmployeeSocso.toFixed(2)}</td>
                  </tr>
                  <tr className="border-b border-bg-custom">
                    <td className="p-2.5 font-semibold text-text-primary">Employer Share (~1.75%)</td>
                    <td className="p-2.5 font-mono text-right text-emerald-700 font-bold">RM {employerSocso.toFixed(2)}</td>
                    <td className="p-2.5 font-mono text-right text-emerald-700">RM {annualEmployerSocso.toFixed(2)}</td>
                  </tr>
                  <tr className="bg-primary/5">
                    <td className="p-2.5 font-bold text-primary">Total Statutory Protection Pool</td>
                    <td className="p-2.5 font-mono font-bold text-right text-primary">RM {totalMonthlySocso.toFixed(2)}</td>
                    <td className="p-2.5 font-mono font-bold text-right text-primary">RM {annualTotalSocso.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* Educational Sections (Collapsible Accordions) */}
      <div className="space-y-6 no-print">
        {/* Key Benefits Covered Under SOCSO */}
        <CollapsibleBox 
          title="Key Benefits Covered Under SOCSO (PERKESO)"
          subtitle="PERKESO administers two statutory protection schemes for Malaysian employees"
          icon={<HeartPulse className="h-4 w-4" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Scheme 1 */}
            <div className="p-5 rounded-xl border border-border-custom bg-bg-custom/40 space-y-3">
              <div className="flex items-center justify-between border-b border-border-custom pb-2">
                <h4 className="text-xs font-bold text-primary font-mono uppercase">
                  1. Employment Injury Scheme
                </h4>
                <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">
                  Workplace & Commuting
                </span>
              </div>
              <p className="text-xs text-text-secondary">
                Protects employees against accidents occurring while working or travelling during work hours:
              </p>
              <ul className="text-xs text-text-secondary space-y-1.5 list-disc pl-4">
                <li><strong>Medical Benefit</strong>: Free treatment at PERKESO panel clinics or government hospitals.</li>
                <li><strong>Temporary Disablement Benefit</strong>: 80% of average daily wage during sick leave.</li>
                <li><strong>Permanent Disablement Benefit</strong>: Up to 90% daily wage payout for permanent injuries.</li>
                <li><strong>Constant Attendance Allowance</strong>: Fixed monthly allowance for severe paralysis.</li>
                <li><strong>Funeral Benefit</strong>: Up to RM 3,000 claimable by dependants.</li>
              </ul>
            </div>

            {/* Scheme 2 */}
            <div className="p-5 rounded-xl border border-border-custom bg-bg-custom/40 space-y-3">
              <div className="flex items-center justify-between border-b border-border-custom pb-2">
                <h4 className="text-xs font-bold text-emerald-800 font-mono uppercase">
                  2. Invalidity Scheme
                </h4>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  24-Hour Coverage
                </span>
              </div>
              <p className="text-xs text-text-secondary">
                Provides 24-hour protection against chronic illness or permanent disability due to any cause:
              </p>
              <ul className="text-xs text-text-secondary space-y-1.5 list-disc pl-4">
                <li><strong>Invalidity Pension</strong>: Monthly lifetime payout (50% to 65% of average salary).</li>
                <li><strong>Survivor's Pension</strong>: Paid to widow/widower and children upon employee's death.</li>
                <li><strong>Dialysis & Medical Supplies</strong>: Fully funded hemodialysis treatment.</li>
                <li><strong>Physical Rehabilitation</strong>: Prosthetics, wheelchairs, and physiotherapy.</li>
              </ul>
            </div>

          </div>
        </CollapsibleBox>

        {/* Educational: Salary Ceiling & Eligibility */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Salary Ceiling Explanation */}
          <CollapsibleBox 
            title="Explanation of the RM 6,000 Salary Ceiling"
            icon={<Coins className="h-4 w-4" />}
          >
            <p className="text-xs text-text-secondary leading-relaxed">
              Effective October 2024, the Malaysian government updated the statutory monthly wage ceiling under Act 4 from RM 5,000 to <strong>RM 6,000</strong>.
            </p>
            <ul className="text-xs text-text-secondary space-y-2 list-disc pl-4 pt-1">
              <li>For salaries above RM 6,000, contribution rates stop increasing and remain capped at <strong>RM 29.75</strong> (employee) and <strong>RM 104.15</strong> (employer).</li>
              <li>This increase boosts the maximum temporary disablement benefit payout from RM 133.33/day to <strong>RM 160.00/day</strong>.</li>
            </ul>
          </CollapsibleBox>

          {/* Who is Required to Contribute */}
          <CollapsibleBox 
            title="Who is Required to Contribute to SOCSO?"
            icon={<Users className="h-4 w-4" />}
          >
            <p className="text-xs text-text-secondary leading-relaxed">
              Under Malaysian labor regulations, contribution rules depend on employment type and age:
            </p>
            <ul className="text-xs text-text-secondary space-y-2 list-disc pl-4 pt-1">
              <li><strong>Malaysian Employees &lt; 60 years</strong>: Mandatory Category 1 (Employment Injury + Invalidity Scheme).</li>
              <li><strong>Employees ≥ 60 years</strong>: Category 2 (Employment Injury Scheme only; employer pays ~1.25%, employee pays RM 0).</li>
              <li><strong>Foreign Workers</strong>: Mandatory coverage under Employment Injury Scheme.</li>
              <li><strong>Exempted Groups</strong>: Pensionable government servants, domestic helpers, and self-employed workers (covered separately under SKSPS).</li>
            </ul>
          </CollapsibleBox>

        </div>
      </div>

      <div className="space-y-4 no-print">
        <SectionHeader title="SOCSO Highlights" badge="Rules-Based" />
        <InsightCards insights={insights} />
      </div>

      <div className="no-print">
        <FormulaExplanation 
          what="SOCSO (PERKESO) contributions are fixed statutory schedule amounts based on gross monthly salary, capped at the RM 6,000 monthly wage ceiling."
          formula={
            <code className="block font-mono bg-bg-custom p-2.5 rounded-md text-[11px] text-primary">
              Capped Wage = Min(Gross Salary, RM 6,000)
            </code>
          }
          why="SOCSO provides lifelong disability, medical, and accident protection for all Malaysian workforce members."
        />
      </div>

      <div className="space-y-4 no-print">
        <SectionHeader title="Frequently Asked Questions (FAQ)" badge="PERKESO" />
        <FAQSection faqs={faqs} />
      </div>
    </div>
  );
}

