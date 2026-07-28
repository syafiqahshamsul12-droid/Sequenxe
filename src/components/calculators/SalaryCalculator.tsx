import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw, 
  FileText,
  Building2,
  UserCheck,
  CreditCard,
  PieChart as PieIcon,
  ShieldCheck,
  ArrowRight,
  Printer,
  CheckCircle2,
  Info,
  Settings2,
  BookmarkCheck
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { SalaryInputs, SalaryOutputs } from '../../types';
import { calculateSalaryTax, determineEmployerEpfRate } from '../../utils/formulas';
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

const DEFAULT_INPUTS: SalaryInputs = {
  grossSalary: 6500,
  epfRate: 11,
  employerEpfOverrideRate: undefined,
  isBumiputera: false,
  reliefs: {
    individual: 9000,
    lifestyle: 1500,
    medicalSelf: 0,
    parentMedical: 0,
    educationSelf: 0,
    childOrdinary: 0,
    childTertiary: 0,
    disabledIndividual: 0,
    spousesRelief: 0,
    lifeInsurance: 1000,
    sspnSavings: 0
  }
};

export default function SalaryCalculator() {
  const { values: inputs, setValues: setInputs, resetConfig: handleResetConfig, hasSavedIndicator } = useSaveConfig<SalaryInputs>('salary', DEFAULT_INPUTS);
  const [outputs, setOutputs] = useState<SalaryOutputs | null>(null);
  const [showReliefs, setShowReliefs] = useState<boolean>(false);
  const [showAdvancedEpf, setShowAdvancedEpf] = useState<boolean>(false);

  useEffect(() => {
    const results = calculateSalaryTax(inputs);
    setOutputs(results);
  }, [inputs]);

  if (!outputs) return null;

  const handleReset = () => {
    handleResetConfig();
    setShowReliefs(false);
    setShowAdvancedEpf(false);
  };

  const handleInputChange = (field: keyof SalaryInputs, value: any) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReliefChange = (reliefField: keyof SalaryInputs['reliefs'], value: number) => {
    setInputs(prev => ({
      ...prev,
      reliefs: {
        ...prev.reliefs,
        [reliefField]: value
      }
    }));
  };

  const employerEpfInfo = determineEmployerEpfRate(inputs.grossSalary, inputs.employerEpfOverrideRate);

  // Internal navigation dispatch
  const navigateTo = (viewId: string) => {
    const navEvent = new CustomEvent('change-view', { detail: viewId });
    window.dispatchEvent(navEvent);
  };


  // Pie chart data: Net Salary, EPF, SOCSO, EIS, PCB
  const pieChartData = [
    { name: 'Net Take-Home Salary', value: outputs.netSalary, color: '#7A2436' }, // Primary Wine
    { name: 'EPF Employee (11%)', value: outputs.epfEmployee, color: '#B15066' }, // Light Wine
    { name: 'Monthly PCB Tax', value: outputs.monthlyPcb, color: '#D97706' }, // Amber Gold
    { name: 'SOCSO (PERKESO)', value: outputs.socsoEmployee, color: '#2563EB' }, // Royal Blue
    { name: 'EIS (SIP)', value: outputs.eisEmployee, color: '#4B5563' } // Slate Gray
  ].filter(item => item.value > 0);

  const handleExportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Financial Category,Monthly (RM),Annual (RM)\n"
      + `Gross Salary,${inputs.grossSalary.toFixed(2)},${outputs.annualGross.toFixed(2)}\n`
      + `Net Take-Home Salary,${outputs.netSalary.toFixed(2)},${outputs.annualNet.toFixed(2)}\n`
      + `Employee EPF (${inputs.epfRate}%),${outputs.epfEmployee.toFixed(2)},${(outputs.epfEmployee * 12).toFixed(2)}\n`
      + `Employee SOCSO,${outputs.socsoEmployee.toFixed(2)},${(outputs.socsoEmployee * 12).toFixed(2)}\n`
      + `Employee EIS,${outputs.eisEmployee.toFixed(2)},${(outputs.eisEmployee * 12).toFixed(2)}\n`
      + `Monthly PCB Tax,${outputs.monthlyPcb.toFixed(2)},${outputs.annualPcb.toFixed(2)}\n`
      + `Total Employee Deductions,${outputs.totalEmployeeDeductions.toFixed(2)},${outputs.annualEmployeeDeductions.toFixed(2)}\n`
      + `Employer EPF,${outputs.epfEmployer.toFixed(2)},${(outputs.epfEmployer * 12).toFixed(2)}\n`
      + `Employer SOCSO,${outputs.socsoEmployer.toFixed(2)},${(outputs.socsoEmployer * 12).toFixed(2)}\n`
      + `Employer EIS,${outputs.eisEmployer.toFixed(2)},${(outputs.eisEmployer * 12).toFixed(2)}\n`
      + `Total Employer Contribution,${outputs.totalEmployerContribution.toFixed(2)},${outputs.annualEmployerContributions.toFixed(2)}\n`
      + `Total Employment Cost,${outputs.totalEmploymentCost.toFixed(2)},${(outputs.totalEmploymentCost * 12).toFixed(2)}`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "malaysia_salary_breakdown_2026.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyMarkdown = () => {
    const summaryText = `### Salary Breakdown Report (Malaysia 2026)
- **Gross Monthly Salary**: RM ${inputs.grossSalary.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
- **Net Take-Home Pay**: RM ${outputs.netSalary.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
- **Employee Deductions**:
  - KWSP EPF (${inputs.epfRate}%): RM ${outputs.epfEmployee.toFixed(2)}
  - PERKESO SOCSO: RM ${outputs.socsoEmployee.toFixed(2)}
  - SIP EIS: RM ${outputs.eisEmployee.toFixed(2)}
  - LHDN PCB Tax: RM ${outputs.monthlyPcb.toFixed(2)}
  - Total Employee Deductions: RM ${outputs.totalEmployeeDeductions.toFixed(2)}
- **Employer Contributions**:
  - Employer EPF: RM ${outputs.epfEmployer.toFixed(2)}
  - Employer SOCSO: RM ${outputs.socsoEmployer.toFixed(2)}
  - Employer EIS: RM ${outputs.eisEmployer.toFixed(2)}
  - Total Employer Contribution: RM ${outputs.totalEmployerContribution.toFixed(2)}
- **Total Monthly Employment Cost**: RM ${outputs.totalEmploymentCost.toFixed(2)}`;

    navigator.clipboard.writeText(summaryText);
  };

  // Rule-based financial insights
  const insights = [
    {
      type: 'success' as const,
      title: "Take-Home Ratio & Budgeting",
      text: `Your net take-home salary represents ${((outputs.netSalary / inputs.grossSalary) * 100).toFixed(1)}% of your gross earnings. Following the 50/30/20 budget rule, allocate up to RM ${(outputs.netSalary * 0.5).toLocaleString('en-MY', { maximumFractionDigits: 0 })} for needs and RM ${(outputs.netSalary * 0.2).toLocaleString('en-MY', { maximumFractionDigits: 0 })} for savings.`
    },
    {
      type: 'info' as const,
      title: "Employer Contribution Value",
      text: `Your employer contributes an additional RM ${outputs.totalEmployerContribution.toLocaleString('en-MY', { minimumFractionDigits: 2 })} monthly on top of your base salary. Your total monthly employment package is RM ${outputs.totalEmploymentCost.toLocaleString('en-MY', { minimumFractionDigits: 2 })}.`
    },
    {
      type: 'warning' as const,
      title: "Tax Relief Optimization",
      text: outputs.totalReliefsClaimed < 15000 
        ? `You have claimed RM ${outputs.totalReliefsClaimed.toLocaleString('en-MY')} in tax reliefs. Submitting Form TP1 to your HR for medical or lifestyle expenses can reduce monthly PCB and increase take-home pay immediately.`
        : `Great job! Your claimed reliefs of RM ${outputs.totalReliefsClaimed.toLocaleString('en-MY')} keep your annual PCB optimized at RM ${outputs.monthlyPcb.toFixed(2)} per month.`
    },
    {
      type: 'success' as const,
      title: "Statutory Social Safety Net",
      text: `Both employee and employer contributions to PERKESO SOCSO (RM ${outputs.socsoEmployee + outputs.socsoEmployer}/mo) and SIP EIS (RM ${outputs.eisEmployee + outputs.eisEmployer}/mo) ensure statutory medical, invalidity, and retrenchment coverage.`
    }
  ];

  const faqs = [
    {
      question: "How is take-home salary calculated in Malaysia?",
      answer: "Take-home salary (Net Pay) is calculated as Gross Monthly Salary minus compulsory employee statutory deductions: Employees Provident Fund (EPF 11%), SOCSO (~0.5% capped at RM6,000 salary), EIS (0.2% capped at RM6,000 salary), and LHDN PCB (Monthly Tax Deduction)."
    },
    {
      question: "What do EPF, SOCSO, EIS, and PCB mean for my payroll?",
      answer: "EPF (KWSP) is compulsory retirement savings (11% employee, 12-13% employer). SOCSO (PERKESO) provides workplace injury and disability coverage (~0.5% capped at RM6,000 salary). EIS (SIP) provides job loss safety net benefits (0.2% capped at RM6,000 salary). PCB is LHDN monthly tax withholding."
    },
    {
      question: "What is the difference between employee and employer contributions?",
      answer: "Employee contributions are deducted directly from your gross salary before it reaches your bank account. Employer contributions are paid separately by your company into your EPF, SOCSO, and EIS accounts and do not reduce your gross salary."
    },
    {
      question: "What is the SOCSO and EIS ceiling salary cap?",
      answer: "Under current PERKESO regulations, the maximum salary ceiling for SOCSO and EIS contributions is capped at RM 6,000 per month. Any salary portion above RM 6,000 is not subject to additional SOCSO/EIS fees."
    },
    {
      question: "Why does my actual payslip differ slightly from this calculation?",
      answer: "Slight variations can occur if your employer provides non-taxable allowances, OT payments, claims, or applies specific tax relief declarations (Form TP1) during mid-year payroll cycles."
    },
    {
      question: "How does EPF employer contribution rate work?",
      answer: "In Malaysia, employers contribute 13% for employees earning RM 5,000 or less per month, and 12% for employees earning above RM 5,000 per month."
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <SEOManager 
        title="Salary Calculator Malaysia 2026 | Net Take-Home, EPF, SOCSO & PCB"
        description="Calculate exact monthly take-home salary in Malaysia after EPF, SOCSO, EIS, and LHDN PCB deductions. View detailed employee & employer contribution breakdown."
        canonicalUrl="https://sequenxe.com/salary-calculator"
        calculatorId="salary-calculator"
        faqs={faqs}
        breadcrumbs={[
          { name: 'Home', url: 'https://sequenxe.com/' },
          { name: 'Salary Calculator Malaysia', url: 'https://sequenxe.com/salary-calculator' }
        ]}
      />

      {/* Breadcrumbs & Hero (web-only) */}
      <div className="no-print">
        <Breadcrumb 
          items={[
            { label: 'Home', href: 'home' },
            { label: 'Salary & Tax', href: 'home' },
            { label: 'Salary Calculator Malaysia' }
          ]}
        />

        <CalculatorHero 
          title="Salary Calculator Malaysia"
          description="Flagship payroll calculator for Malaysian employees & HR. Calculate net take-home salary, employee deductions, employer statutory shares, annual projections, and preview official monthly payslips."
          estimatedTime="2 mins"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Inputs Form */}
        <div className="lg:col-span-5 bg-white border border-border-custom rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 no-print">
          <div className="flex justify-between items-center border-b border-border-custom pb-3">
            <h2 className="font-display font-bold text-base text-text-primary uppercase tracking-wide flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              Salary Details
            </h2>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-primary transition-colors cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>

          {/* Gross Monthly Salary */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="grossSalary" className="text-sm font-semibold text-text-primary">
                Gross Monthly Salary (RM)
              </label>
              <span className="text-xs font-mono font-medium text-primary bg-primary/5 px-2.5 py-1 rounded-md border border-primary/10">
                RM {(inputs.grossSalary * 12).toLocaleString('en-MY')} / yr
              </span>
            </div>
            <div className="relative">
              <span className="absolute top-3.5 left-4 text-sm font-semibold text-text-secondary">RM</span>
              <input
                id="grossSalary"
                type="number"
                min="0"
                step="100"
                value={inputs.grossSalary}
                onChange={(e) => handleInputChange('grossSalary', Math.max(0, parseFloat(e.target.value) || 0))}
                className="h-12 w-full rounded-xl border border-border-custom bg-bg-custom pl-11 pr-4 text-sm font-semibold text-text-primary focus:border-primary focus:bg-white focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-text-secondary">Base monthly income before statutory EPF, SOCSO, EIS & tax deductions.</p>
          </div>

          {/* EPF Rate Choice & Auto Employer Determination */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-text-primary block">
                Employee EPF Contribution Rate (%)
              </label>
              {hasSavedIndicator && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 animate-pulse">
                  <BookmarkCheck className="h-3 w-3" /> Auto-Saved
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[11, 9, 0].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => handleInputChange('epfRate', rate)}
                  className={`py-2.5 px-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    inputs.epfRate === rate 
                      ? 'border-primary bg-primary/5 text-primary shadow-xs' 
                      : 'border-border-custom bg-white text-text-secondary hover:border-text-secondary/20 hover:text-text-primary'
                  }`}
                >
                  {rate === 0 ? '0% (Exempt)' : `${rate}% Rate`}
                </button>
              ))}
            </div>

            {/* Auto Employer Rate Summary Badge */}
            <div className="bg-bg-custom/80 border border-border-custom rounded-xl p-3 flex justify-between items-center text-xs">
              <span className="text-text-secondary">Auto-Applied Employer EPF:</span>
              <span className={`font-mono font-bold px-2 py-0.5 rounded-md ${
                employerEpfInfo.isOverridden 
                  ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              }`}>
                {employerEpfInfo.rate}% {employerEpfInfo.isOverridden ? '(Overridden)' : '(Statutory)'}
              </span>
            </div>

            {/* Advanced Settings Accordion for Employer EPF Override */}
            <div className="border border-border-custom rounded-xl overflow-hidden shadow-2xs">
              <button
                type="button"
                onClick={() => setShowAdvancedEpf(!showAdvancedEpf)}
                className="w-full bg-bg-custom/50 p-3 flex justify-between items-center text-left hover:bg-bg-custom/80 transition-colors cursor-pointer text-xs font-bold text-text-primary"
              >
                <div className="flex items-center gap-2">
                  <Settings2 className="h-3.5 w-3.5 text-primary" />
                  <span>Advanced Settings: Custom Employer EPF Rate</span>
                </div>
                {showAdvancedEpf ? <ChevronUp className="h-3.5 w-3.5 text-text-secondary" /> : <ChevronDown className="h-3.5 w-3.5 text-text-secondary" />}
              </button>

              {showAdvancedEpf && (
                <div className="p-4 bg-white border-t border-border-custom space-y-3 text-xs">
                  <p className="text-[11px] text-text-secondary leading-relaxed">
                    By default, employers contribute 13% for salaries &le; RM 5,000 and 12% for &gt; RM 5,000. Use this setting if your employer provides higher benefit rates (e.g. 15%, 17%, 19%).
                  </p>
                  
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label htmlFor="employerEpfOverride" className="font-semibold text-text-primary">
                        Employer Contribution Override (%)
                      </label>
                      {inputs.employerEpfOverrideRate !== undefined && (
                        <button
                          type="button"
                          onClick={() => handleInputChange('employerEpfOverrideRate', undefined)}
                          className="text-[10px] text-primary hover:underline font-semibold"
                        >
                          Clear Override (Use Statutory)
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-4 gap-2 pt-1">
                      {[12, 13, 15, 17].map((override) => (
                        <button
                          key={override}
                          type="button"
                          onClick={() => handleInputChange('employerEpfOverrideRate', override)}
                          className={`py-1.5 px-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                            inputs.employerEpfOverrideRate === override 
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
          </div>

          {/* Collapsible Tax Relief Claims */}
          <div className="border border-border-custom rounded-xl overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => setShowReliefs(!showReliefs)}
              className="w-full bg-bg-custom/65 p-4 flex justify-between items-center text-left hover:bg-bg-custom/90 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold text-text-primary">Monthly PCB Tax Reliefs (Optional)</span>
              </div>
              {showReliefs ? <ChevronUp className="h-4 w-4 text-text-secondary" /> : <ChevronDown className="h-4 w-4 text-text-secondary" />}
            </button>

            {showReliefs && (
              <div className="p-4 bg-white border-t border-border-custom space-y-4 max-h-[350px] overflow-y-auto">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Lifestyle & Tech (Max RM 2,500)</span>
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

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border-custom">
                  <div>
                    <label className="text-[11px] font-semibold text-text-primary block mb-1">Children &lt;18</label>
                    <select
                      value={inputs.reliefs.childOrdinary}
                      onChange={(e) => handleReliefChange('childOrdinary', parseInt(e.target.value) || 0)}
                      className="w-full h-8 rounded-lg border border-border-custom bg-bg-custom text-xs px-2 focus:outline-none"
                    >
                      {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} child ({n * 2000})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-text-primary block mb-1">Higher Education</label>
                    <select
                      value={inputs.reliefs.childTertiary}
                      onChange={(e) => handleReliefChange('childTertiary', parseInt(e.target.value) || 0)}
                      className="w-full h-8 rounded-lg border border-border-custom bg-bg-custom text-xs px-2 focus:outline-none"
                    >
                      {[0, 1, 2, 3, 4].map(n => <option key={n} value={n}>{n} child ({n * 8000})</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Mandatory Disclaimer */}
          <Disclaimer />
        </div>

        {/* Right Output Dashboard */}
        <div className="lg:col-span-7 space-y-8">

          {/* Primary Take-Home Result Card */}
          <div className="bg-gradient-to-br from-[#8B1A34] via-[#6D1026] to-[#4F0B1B] text-white rounded-2xl p-6 sm:p-8 shadow-xl shadow-[#6D1026]/20 relative overflow-hidden border border-white/20 backdrop-blur-md">
            <div className="absolute -top-12 -right-12 w-72 h-72 bg-rose-300/15 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
            
            <span className="text-xs uppercase font-mono font-bold tracking-widest text-rose-100/80 block mb-1">
              PRIMARY MONTHLY TAKE-HOME RESULT
            </span>
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <h2 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-white">
                RM {outputs.netSalary.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="text-sm font-normal text-rose-100/80 ml-2">/month</span>
              </h2>
              <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold text-white/90 border border-white/20 w-fit shadow-xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Net Cash Credit
              </span>
            </div>

            <div className="mt-6 pt-5 border-t border-white/15 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-rose-100/70 block text-[11px] font-medium">Gross Salary</span>
                <span className="font-mono font-bold text-sm sm:text-base text-white">RM {inputs.grossSalary.toLocaleString('en-MY')}</span>
              </div>
              <div>
                <span className="text-rose-100/70 block text-[11px] font-medium">Total Deductions</span>
                <span className="font-mono font-bold text-sm sm:text-base text-rose-200">- RM {outputs.totalEmployeeDeductions.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</span>
              </div>
              <div>
                <span className="text-rose-100/70 block text-[11px] font-medium">Annual Net Total</span>
                <span className="font-mono font-bold text-sm sm:text-base text-white">RM {outputs.annualNet.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Contribution Summaries (Side by Side or Stacked) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Employee Contribution Summary */}
            <div className="bg-white border border-border-custom rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-border-custom pb-3">
                <UserCheck className="h-4.5 w-4.5 text-primary" />
                <h3 className="font-display font-bold text-sm text-text-primary uppercase tracking-wide">
                  Employee Deductions
                </h3>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-bg-custom">
                  <span className="text-text-secondary">EPF Employee ({inputs.epfRate}%)</span>
                  <span className="font-mono font-bold text-text-primary">RM {outputs.epfEmployee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-bg-custom">
                  <span className="text-text-secondary">SOCSO (PERKESO)</span>
                  <span className="font-mono font-bold text-text-primary">RM {outputs.socsoEmployee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-bg-custom">
                  <span className="text-text-secondary">EIS (SIP)</span>
                  <span className="font-mono font-bold text-text-primary">RM {outputs.eisEmployee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-bg-custom">
                  <span className="text-text-secondary">PCB Monthly Tax</span>
                  <span className="font-mono font-bold text-amber-600">RM {outputs.monthlyPcb.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 font-bold text-xs border-t border-border-custom">
                  <span className="text-text-primary uppercase">Total Deductions</span>
                  <span className="font-mono text-primary">RM {outputs.totalEmployeeDeductions.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Employer Contribution Summary */}
            <div className="bg-white border border-border-custom rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-border-custom pb-3">
                <Building2 className="h-4.5 w-4.5 text-emerald-700" />
                <h3 className="font-display font-bold text-sm text-text-primary uppercase tracking-wide">
                  Employer Contributions
                </h3>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-bg-custom">
                  <span className="text-text-secondary">Employer EPF ({inputs.grossSalary <= 5000 ? '13%' : '12%'})</span>
                  <span className="font-mono font-bold text-emerald-700">RM {outputs.epfEmployer.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-bg-custom">
                  <span className="text-text-secondary">Employer SOCSO</span>
                  <span className="font-mono font-bold text-emerald-700">RM {outputs.socsoEmployer.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-bg-custom">
                  <span className="text-text-secondary">Employer EIS</span>
                  <span className="font-mono font-bold text-emerald-700">RM {outputs.eisEmployer.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-bg-custom font-semibold">
                  <span className="text-text-primary">Total Employer Share</span>
                  <span className="font-mono text-emerald-800">RM {outputs.totalEmployerContribution.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 font-bold text-xs border-t border-border-custom bg-emerald-50/50 p-2 rounded-lg">
                  <span className="text-emerald-900 uppercase">Total Employment Cost</span>
                  <span className="font-mono text-emerald-800">RM {outputs.totalEmploymentCost.toFixed(2)}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Income Allocation Pie Chart */}
          <div className="bg-white border border-border-custom rounded-2xl p-6 shadow-xs space-y-4">
            <SectionHeader 
              title="Income Allocation Breakdown" 
              subtitle="Distribution of gross monthly earnings into net salary and statutory accounts." 
            />
            
            <div className="flex flex-col md:flex-row items-center gap-6 pt-2">
              <div className="w-48 h-48 shrink-0 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val: any) => [`RM ${parseFloat(val).toFixed(2)}`, 'Amount']}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute text-center flex flex-col justify-center">
                  <span className="text-[10px] uppercase font-mono text-text-secondary">Take-Home</span>
                  <span className="font-display font-black text-xl text-primary mt-0.5">
                    {((outputs.netSalary / inputs.grossSalary) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <div className="flex-1 w-full space-y-2.5">
                {pieChartData.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-md shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="font-semibold text-text-secondary">{item.name}</span>
                    </div>
                    <span className="font-mono font-bold text-text-primary">
                      RM {item.value.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Annual Projection Section */}
          <div className="bg-white border border-border-custom rounded-2xl p-6 shadow-xs space-y-4">
            <SectionHeader title="Annual Financial Projection" subtitle="Yearly totals for financial planning and budgeting." />
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-bg-custom p-4 rounded-xl space-y-1">
                <span className="text-[11px] font-semibold text-text-secondary block">Annual Gross Salary</span>
                <span className="font-display font-bold text-base text-text-primary">RM {outputs.annualGross.toLocaleString('en-MY')}</span>
              </div>
              <div className="bg-primary/5 border border-primary/15 p-4 rounded-xl space-y-1">
                <span className="text-[11px] font-semibold text-primary block">Annual Net Take-Home</span>
                <span className="font-display font-bold text-base text-primary">RM {outputs.annualNet.toLocaleString('en-MY')}</span>
              </div>
              <div className="bg-bg-custom p-4 rounded-xl space-y-1">
                <span className="text-[11px] font-semibold text-text-secondary block">Annual Employee Deductions</span>
                <span className="font-display font-bold text-base text-text-primary">RM {outputs.annualEmployeeDeductions.toLocaleString('en-MY')}</span>
              </div>
              <div className="bg-emerald-50/60 border border-emerald-500/20 p-4 rounded-xl space-y-1">
                <span className="text-[11px] font-semibold text-emerald-800 block">Annual Employer Contributions</span>
                <span className="font-display font-bold text-base text-emerald-800">RM {outputs.annualEmployerContributions.toLocaleString('en-MY')}</span>
              </div>
              <div className="bg-bg-custom p-4 rounded-xl space-y-1">
                <span className="text-[11px] font-semibold text-text-secondary block">Annual PCB Tax Paid</span>
                <span className="font-display font-bold text-base text-amber-700">RM {outputs.annualPcb.toLocaleString('en-MY')}</span>
              </div>
              <div className="bg-bg-custom p-4 rounded-xl space-y-1">
                <span className="text-[11px] font-semibold text-text-secondary block">Annual Total EPF (Emp+Emp)</span>
                <span className="font-display font-bold text-base text-text-primary">RM {((outputs.epfEmployee + outputs.epfEmployer) * 12).toLocaleString('en-MY')}</span>
              </div>
            </div>
          </div>

          {/* Professional Monthly Payslip Preview */}
          <div className="bg-white border-2 border-border-custom rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 relative print:border-none">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b-2 border-slate-900 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-text-secondary">Official Draft</span>
                <h3 className="font-display font-black text-xl text-text-primary uppercase tracking-tight">
                  Monthly Payslip Preview
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold bg-bg-custom px-3 py-1 rounded-md text-text-secondary border border-border-custom">
                  Period: Current Month
                </span>
                <ExportButtons 
                  onCopyMarkdown={handleCopyMarkdown}
                  onExportCsv={handleExportCsv}
                  title="Payslip"
                />
              </div>
            </div>

            {/* Payslip Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Gross Earnings */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider border-b border-border-custom pb-2">
                  Earnings & Allowances
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Basic Base Salary</span>
                    <span className="font-mono font-semibold">RM {inputs.grossSalary.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-bg-custom font-bold">
                    <span>Total Gross Earnings</span>
                    <span className="font-mono text-text-primary">RM {inputs.grossSalary.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider border-b border-border-custom pb-2">
                  Employee Statutory Deductions
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">KWSP EPF Employee ({inputs.epfRate}%)</span>
                    <span className="font-mono">RM {outputs.epfEmployee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">PERKESO SOCSO Employee</span>
                    <span className="font-mono">RM {outputs.socsoEmployee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">SIP EIS Employee</span>
                    <span className="font-mono">RM {outputs.eisEmployee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">LHDN PCB Income Tax</span>
                    <span className="font-mono text-amber-700">RM {outputs.monthlyPcb.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-bg-custom font-bold text-primary">
                    <span>Total Employee Deductions</span>
                    <span className="font-mono">RM {outputs.totalEmployeeDeductions.toFixed(2)}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Payslip Footer Net Pay Box */}
            <div className="bg-bg-custom border border-border-custom rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary block">Net Amount Payable To Bank</span>
                <span className="text-xs text-text-secondary">Credited via Direct Giro / Bank Transfer</span>
              </div>
              <div className="text-right">
                <span className="font-display font-black text-2xl text-primary">
                  RM {outputs.netSalary.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Employer Summary Ribbon */}
            <div className="text-[11px] text-text-secondary border-t border-border-custom pt-3 flex flex-wrap justify-between gap-2">
              <span>Employer KWSP: <strong>RM {outputs.epfEmployer.toFixed(2)}</strong></span>
              <span>Employer SOCSO: <strong>RM {outputs.socsoEmployer.toFixed(2)}</strong></span>
              <span>Employer EIS: <strong>RM {outputs.eisEmployer.toFixed(2)}</strong></span>
              <span>Total Employment Package: <strong className="text-emerald-800">RM {outputs.totalEmploymentCost.toFixed(2)}</strong></span>
            </div>
          </div>

        </div>
      </div>

      {/* Financial Insights */}
      <div className="space-y-4 no-print">
        <SectionHeader title="Rule-Based Financial Insights" badge="Rules-Based" />
        <InsightCards insights={insights} />
      </div>

      {/* How it Works & Official References */}
      <div className="no-print">
        <FormulaExplanation 
          what="Calculations adhere strictly to official Malaysian statutory frameworks including the EPF Act 1991, Employees' Social Security Act 1969 (PERKESO), Employment Insurance System Act 2017 (EIS), and LHDN Income Tax Act 1967."
          formula={
            <div className="space-y-1 font-mono text-[11px] text-primary">
              <div>1. Net Take-Home Salary = Gross Salary - (Employee EPF + SOCSO + EIS + PCB)</div>
              <div>2. Total Employment Cost = Gross Salary + (Employer EPF + SOCSO + EIS)</div>
            </div>
          }
          why="All statutory limits incorporate the latest RM 6,000 PERKESO salary ceiling cap and progressive LHDN personal tax brackets for 2026."
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
