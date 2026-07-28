import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  HelpCircle, 
  CheckCircle2, 
  Info, 
  PieChart as PieIcon,
  ShieldCheck,
  FileText,
  Calculator,
  ArrowRight,
  BookmarkCheck
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PcbInputs, PcbOutputs } from '../../types';
import { calculatePcbCalculation } from '../../utils/formulas';
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

const DEFAULT_INPUTS: PcbInputs = {
  monthlySalary: 7500,
  bonus: 0,
  epfRate: 11,
  maritalStatus: 'single',
  isTaxResident: true,
  childrenCount: 0,
  monthlyZakat: 0,
  additionalReliefs: 0
};

export default function PcbCalculator() {
  const { values: inputs, setValues: setInputs, resetConfig, hasSavedIndicator } = useSaveConfig<PcbInputs>('pcb', DEFAULT_INPUTS);
  const [outputs, setOutputs] = useState<PcbOutputs | null>(null);

  useEffect(() => {
    const results = calculatePcbCalculation(inputs);
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

  const handleExportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Amount (RM)\n"
      + `Monthly Base Salary,${inputs.monthlySalary.toFixed(2)}\n`
      + `Monthly Bonus/Allowance,${inputs.bonus.toFixed(2)}\n`
      + `Estimated Monthly PCB Tax,${outputs.monthlyPcb.toFixed(2)}\n`
      + `Annual PCB Tax,${outputs.annualPcb.toFixed(2)}\n`
      + `Employee EPF (${inputs.epfRate}%),${outputs.epfEmployee.toFixed(2)}\n`
      + `Employee SOCSO,${outputs.socsoEmployee.toFixed(2)}\n`
      + `Employee EIS,${outputs.eisEmployee.toFixed(2)}\n`
      + `Estimated Monthly Net Take-Home,${outputs.netSalary.toFixed(2)}\n`
      + `Annual Chargeable Taxable Income,${outputs.taxableIncome.toFixed(2)}\n`
      + `Effective Tax Rate,${outputs.effectiveTaxRate}%`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "pcb_tax_deduction_report_2026.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyMarkdown = () => {
    const summaryText = `### LHDN PCB (Monthly Tax Deduction) Report (2026)
- **Monthly Gross Salary**: RM ${(inputs.monthlySalary + inputs.bonus).toLocaleString('en-MY', { minimumFractionDigits: 2 })}
- **Estimated Monthly PCB (MTD)**: RM ${outputs.monthlyPcb.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
- **Annual Estimated PCB Tax**: RM ${outputs.annualPcb.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
- **Monthly Statutory Deductions**:
  - EPF (${inputs.epfRate}%): RM ${outputs.epfEmployee.toFixed(2)}
  - SOCSO: RM ${outputs.socsoEmployee.toFixed(2)}
  - EIS: RM ${outputs.eisEmployee.toFixed(2)}
  - Total Deductions: RM ${outputs.totalDeductions.toFixed(2)}
- **Monthly Net Take-Home**: RM ${outputs.netSalary.toLocaleString('en-MY', { minimumFractionDigits: 2 })}`;

    navigator.clipboard.writeText(summaryText);
  };

  const pieChartData = [
    { name: 'Monthly Net Take-Home', value: outputs.netSalary, color: '#7A2436' },
    { name: 'Monthly PCB (LHDN Tax)', value: outputs.monthlyPcb, color: '#D97706' },
    { name: 'EPF Employee', value: outputs.epfEmployee, color: '#B15066' },
    { name: 'SOCSO & EIS', value: outputs.socsoEmployee + outputs.eisEmployee, color: '#2563EB' }
  ].filter(item => item.value > 0);

  const insights = [
    {
      type: 'success' as const,
      title: "e-PCB Computerised Annualization Method",
      text: `Your PCB of RM ${outputs.monthlyPcb.toFixed(2)} is computed by annualizing your current monthly remuneration (RM ${inputs.monthlySalary + inputs.bonus}/mo = RM ${outputs.annualGross.toLocaleString('en-MY')}/yr), applying statutory reliefs, and dividing by 12.`
    },
    {
      type: 'info' as const,
      title: "Effective Tax Rate vs Marginal Bracket",
      text: `Although your top marginal tax bracket is ${outputs.applicableTaxRate}%, your actual effective tax rate is only ${outputs.effectiveTaxRate}% of your total gross income due to progressive bracket structuring.`
    },
    {
      type: 'warning' as const,
      title: "Submit Form TP1 for Mid-Year Reliefs",
      text: "If you purchase books, tech items, medical insurance, or make SSPN deposits during the year, submit LHDN Form TP1 to your HR department to reduce your monthly PCB deduction immediately!"
    }
  ];

  const faqs = [
    {
      question: "What is PCB (Potongan Cukai Berjadual)?",
      answer: "PCB (Monthly Tax Deduction or MTD) is a statutory mechanism under Malaysian tax law where employers deduct income tax directly from employees' monthly salaries and remit it to LHDN to prevent a heavy lump-sum tax bill at year-end."
    },
    {
      question: "How is PCB calculated by employers?",
      answer: "Employers use LHDN's e-PCB Computerised Calculation Method. It multiplies monthly remuneration by 12 to project annual gross income, subtracts allowable statutory EPF reliefs and personal reliefs, calculates annual tax using progressive brackets, and divides by 12."
    },
    {
      question: "Why does PCB change when I get a bonus or overtime?",
      answer: "Under LHDN rules, additional remuneration like bonuses or commissions is treated as additional annual income. The employer calculates annual tax on (Salary + Bonus) minus annual tax on (Salary only), so the entire incremental tax on the bonus is deducted in that single bonus month."
    },
    {
      question: "What is the difference between PCB and final tax payable?",
      answer: "PCB is an estimated monthly advance payment toward your tax. When you file your annual BE form between March and May, your final actual tax is computed. If your total annual PCB exceeds your actual tax payable, LHDN refunds the excess directly to your bank account!"
    },
    {
      question: "Does Zakat reduce my PCB payment?",
      answer: "Yes! Monthly Zakat paid via official state zakat boards or salary deduction acts as an instant 1-to-1 tax rebate that directly reduces your monthly PCB amount."
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <SEOManager 
        title="PCB Calculator Malaysia 2026 | Monthly Tax Deduction (MTD) e-PCB"
        description="Estimate exact LHDN Potongan Cukai Berjadual (PCB/MTD) monthly tax deduction in Malaysia using official e-PCB computerised rules."
        canonicalUrl="https://sequenxe.com/pcb-calculator"
        calculatorId="pcb-calculator"
        faqs={faqs}
        breadcrumbs={[
          { name: 'Home', url: 'https://sequenxe.com/' },
          { name: 'PCB Calculator Malaysia', url: 'https://sequenxe.com/pcb-calculator' }
        ]}
      />

      {/* Breadcrumb & Hero (web-only) */}
      <div className="no-print">
        <Breadcrumb 
          items={[
            { label: 'Home', href: 'home' },
            { label: 'Salary & Tax', href: 'home' },
            { label: 'PCB Calculator Malaysia' }
          ]} 
        />

        <CalculatorHero 
          title="PCB Calculator Malaysia (Monthly Tax Deduction)"
          description="Estimate your exact LHDN Potongan Cukai Berjadual (PCB / MTD) monthly tax withholding using official LHDN computerised calculation principles."
          estimatedTime="1 min"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Input Panel */}
        <div className="lg:col-span-5 bg-white border border-border-custom rounded-2xl p-6 sm:p-8 shadow-xs space-y-5 no-print">
          <div className="flex justify-between items-center border-b border-border-custom pb-3">
            <h2 className="font-display font-bold text-base text-text-primary uppercase tracking-wide flex items-center gap-2">
              <Calculator className="h-4 w-4 text-primary" />
              PCB Calculation Inputs
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

          {/* Monthly Base Salary */}
          <div className="space-y-2">
            <label htmlFor="monthlySalary" className="text-sm font-semibold text-text-primary block">
              Monthly Gross Salary (RM)
            </label>
            <div className="relative">
              <span className="absolute top-3.5 left-4 text-sm font-semibold text-text-secondary">RM</span>
              <input
                id="monthlySalary"
                type="number"
                min="0"
                step="100"
                value={inputs.monthlySalary}
                onChange={(e) => setInputs(prev => ({ ...prev, monthlySalary: Math.max(0, parseFloat(e.target.value) || 0) }))}
                className="h-12 w-full rounded-xl border border-border-custom bg-bg-custom pl-11 pr-4 text-sm font-semibold text-text-primary focus:border-primary focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Monthly Bonus or Allowance */}
          <div className="space-y-2">
            <label htmlFor="bonus" className="text-sm font-semibold text-text-primary block">
              Bonus / Additional Remuneration in Current Month (RM)
            </label>
            <div className="relative">
              <span className="absolute top-3.5 left-4 text-sm font-semibold text-text-secondary">RM</span>
              <input
                id="bonus"
                type="number"
                min="0"
                step="500"
                value={inputs.bonus}
                onChange={(e) => setInputs(prev => ({ ...prev, bonus: Math.max(0, parseFloat(e.target.value) || 0) }))}
                className="h-12 w-full rounded-xl border border-border-custom bg-bg-custom pl-11 pr-4 text-sm font-semibold text-text-primary focus:border-primary focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Tax Resident Status */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-primary block">Tax Residency Status</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setInputs(prev => ({ ...prev, isTaxResident: true }))}
                className={`py-2.5 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  inputs.isTaxResident 
                    ? 'border-primary bg-primary/5 text-primary shadow-xs' 
                    : 'border-border-custom bg-white text-text-secondary hover:border-text-secondary/20'
                }`}
              >
                Resident (&gt;182 days)
              </button>
              <button
                type="button"
                onClick={() => setInputs(prev => ({ ...prev, isTaxResident: false }))}
                className={`py-2.5 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  !inputs.isTaxResident 
                    ? 'border-primary bg-primary/5 text-primary shadow-xs' 
                    : 'border-border-custom bg-white text-text-secondary hover:border-text-secondary/20'
                }`}
              >
                Non-Resident (30% Flat)
              </button>
            </div>
          </div>

          {/* Marital Status & Children */}
          {inputs.isTaxResident && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary block">Marital & Spouse Category</label>
                <select
                  value={inputs.maritalStatus}
                  onChange={(e) => setInputs(prev => ({ ...prev, maritalStatus: e.target.value as any }))}
                  className="w-full h-11 rounded-xl border border-border-custom bg-bg-custom text-xs font-semibold px-3 text-text-primary focus:border-primary focus:bg-white focus:outline-none"
                >
                  <option value="single">Single / Married (Spouse Working)</option>
                  <option value="married_non_working_spouse">Married (Spouse Not Working - RM 4,000 Relief)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-text-primary block mb-1">Number of Children</label>
                  <select
                    value={inputs.childrenCount}
                    onChange={(e) => setInputs(prev => ({ ...prev, childrenCount: parseInt(e.target.value) || 0 }))}
                    className="w-full h-10 rounded-xl border border-border-custom bg-bg-custom text-xs font-semibold px-3"
                  >
                    {[0, 1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'child' : 'children'}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-primary block mb-1">Monthly Zakat (RM)</label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={inputs.monthlyZakat}
                    onChange={(e) => setInputs(prev => ({ ...prev, monthlyZakat: Math.max(0, parseFloat(e.target.value) || 0) }))}
                    className="w-full h-10 rounded-xl border border-border-custom bg-bg-custom text-xs font-semibold px-3"
                  />
                </div>
              </div>
            </>
          )}
          {/* Mandatory Disclaimer */}
          <Disclaimer />
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-7 space-y-6">
          {/* Primary PCB Result Card */}
          <div className="bg-gradient-to-br from-[#8B1A34] via-[#6D1026] to-[#4F0B1B] text-white rounded-2xl p-6 sm:p-8 shadow-xl shadow-[#6D1026]/20 relative overflow-hidden border border-white/20 backdrop-blur-md">
            <div className="absolute -top-12 -right-12 w-72 h-72 bg-rose-300/15 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
            
            <span className="text-xs uppercase font-mono font-bold tracking-widest text-rose-100/80 block mb-1">
              ESTIMATED MONTHLY PCB (MTD)
            </span>
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <h2 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-white">
                RM {outputs.monthlyPcb.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="text-sm font-normal text-rose-100/80 ml-2">/month</span>
              </h2>
              <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold text-white/90 border border-white/20 w-fit shadow-xs">
                LHDN e-PCB YA 2026
              </span>
            </div>

            <div className="mt-6 pt-5 border-t border-white/15 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-rose-100/70 block text-[11px] font-medium">Annual PCB Total</span>
                <span className="font-mono font-bold text-sm sm:text-base text-rose-200">RM {outputs.annualPcb.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</span>
              </div>
              <div>
                <span className="text-rose-100/70 block text-[11px] font-medium">Effective Tax Rate</span>
                <span className="font-mono font-bold text-sm sm:text-base text-white">{outputs.effectiveTaxRate}%</span>
              </div>
              <div>
                <span className="text-rose-100/70 block text-[11px] font-medium">Marginal Tax Bracket</span>
                <span className="font-mono font-bold text-sm sm:text-base text-white">{outputs.applicableTaxRate}%</span>
              </div>
            </div>
          </div>

          {/* Concise Monthly Contribution Summary */}
          <div className="bg-white border border-border-custom rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-border-custom pb-3">
              <h3 className="font-display font-bold text-sm text-text-primary uppercase tracking-wide">
                Monthly Net Remuneration Summary
              </h3>
              <ExportButtons 
                onCopyMarkdown={handleCopyMarkdown}
                onExportCsv={handleExportCsv}
                title="PCB Breakdown"
              />
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <tbody>
                <tr className="border-b border-bg-custom">
                  <td className="py-2 text-text-secondary">Gross Base Remuneration</td>
                  <td className="py-2 font-mono font-bold text-right text-text-primary">RM {(inputs.monthlySalary + inputs.bonus).toFixed(2)}</td>
                </tr>
                <tr className="border-b border-bg-custom">
                  <td className="py-2 text-text-secondary">EPF Employee Share ({inputs.epfRate}%)</td>
                  <td className="py-2 font-mono text-right">- RM {outputs.epfEmployee.toFixed(2)}</td>
                </tr>
                <tr className="border-b border-bg-custom">
                  <td className="py-2 text-text-secondary">SOCSO & EIS Employee Share</td>
                  <td className="py-2 font-mono text-right">- RM {(outputs.socsoEmployee + outputs.eisEmployee).toFixed(2)}</td>
                </tr>
                <tr className="border-b border-bg-custom bg-amber-50/50">
                  <td className="py-2 font-bold text-amber-900">LHDN PCB Tax Withholding</td>
                  <td className="py-2 font-mono font-bold text-right text-amber-800">- RM {outputs.monthlyPcb.toFixed(2)}</td>
                </tr>
                <tr className="bg-primary/5 font-bold">
                  <td className="py-2.5 p-2 text-primary">Estimated Net Monthly Take-Home</td>
                  <td className="py-2.5 p-2 font-mono text-right text-primary">RM {outputs.netSalary.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Annual Projection Table */}
          <div className="bg-white border border-border-custom rounded-2xl p-6 shadow-xs space-y-4">
            <SectionHeader title="Annual Tax & Remuneration Projection" subtitle="12-month aggregated figures." />
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              <div className="bg-bg-custom p-3.5 rounded-xl">
                <span className="text-[11px] text-text-secondary block mb-1">Annual Gross</span>
                <span className="font-display font-bold text-sm text-text-primary">RM {outputs.annualGross.toLocaleString('en-MY')}</span>
              </div>
              <div className="bg-bg-custom p-3.5 rounded-xl">
                <span className="text-[11px] text-text-secondary block mb-1">Annual Net Pay</span>
                <span className="font-display font-bold text-sm text-primary">RM {outputs.annualNet.toLocaleString('en-MY')}</span>
              </div>
              <div className="bg-bg-custom p-3.5 rounded-xl">
                <span className="text-[11px] text-text-secondary block mb-1">Annual Total EPF</span>
                <span className="font-display font-bold text-sm text-text-primary">RM {outputs.annualEpf.toLocaleString('en-MY')}</span>
              </div>
              <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200">
                <span className="text-[11px] text-amber-900 block mb-1">Annual PCB Tax</span>
                <span className="font-display font-bold text-sm text-amber-800">RM {outputs.annualPcb.toLocaleString('en-MY')}</span>
              </div>
            </div>
          </div>

          {/* Income Allocation Chart */}
          <div className="bg-white border border-border-custom rounded-2xl p-6 shadow-xs space-y-4">
            <SectionHeader title="Gross Income Distribution Chart" />
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-44 h-44 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={50} outerRadius={68} paddingAngle={4} dataKey="value">
                      {pieChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(val: any) => [`RM ${parseFloat(val).toFixed(2)}`, 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 w-full space-y-2 text-xs">
                {pieChartData.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-text-secondary font-medium">{item.name}</span>
                    </div>
                    <span className="font-mono font-bold text-text-primary">RM {item.value.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Insights */}
      <div className="space-y-4 no-print">
        <SectionHeader title="Tax Withholding Insights" badge="Rules-Based" />
        <InsightCards insights={insights} />
      </div>

      {/* Formula Explanation */}
      <div className="no-print">
        <FormulaExplanation 
          what="PCB calculation uses the official LHDN Computerised Calculation Method (e-PCB)."
          formula={
            <div className="space-y-1 font-mono text-[11px] text-primary">
              <div>Annual Taxable = (Monthly Remuneration × 12) - Statutory EPF - Claimed Personal Reliefs</div>
              <div>Monthly PCB = Max(Annual Tax Payable - Annual Zakat, 0) / 12</div>
            </div>
          }
          why="This prevents massive year-end tax liabilities and ensures compliance with Malaysian Income Tax Act 1967."
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
