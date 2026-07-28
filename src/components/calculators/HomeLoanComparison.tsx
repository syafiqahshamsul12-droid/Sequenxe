import React, { useState } from 'react';
import { 
  ArrowRightLeft, 
  Sparkles, 
  TrendingDown, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Check, 
  ThumbsUp, 
  ThumbsDown,
  Percent,
  Clock,
  DollarSign
} from 'lucide-react';
import { HomeLoanInputs } from '../../types';
import { calculateHomeLoan } from '../../utils/formulas';

interface HomeLoanComparisonProps {
  currentInputs: HomeLoanInputs;
}

export default function HomeLoanComparison({ currentInputs }: HomeLoanComparisonProps) {
  // Scenario A defaults to current main calculator inputs
  const [scenarioA, setScenarioA] = useState<HomeLoanInputs>({ ...currentInputs });

  // Scenario B defaults to a lower rate or shorter tenure scenario for comparison
  const [scenarioB, setScenarioB] = useState<HomeLoanInputs>({
    ...currentInputs,
    interestRate: Math.max(0.1, Number((currentInputs.interestRate - 0.35).toFixed(2))),
    tenure: Math.max(5, currentInputs.tenure - 5)
  });

  const outA = calculateHomeLoan(scenarioA);
  const outB = calculateHomeLoan(scenarioB);

  // Interest to loan ratio
  const ratioA = outA.loanAmount > 0 ? (outA.totalInterest / outA.loanAmount) * 100 : 0;
  const ratioB = outB.loanAmount > 0 ? (outB.totalInterest / outB.loanAmount) * 100 : 0;

  // Differences (Scenario A - Scenario B)
  const monthlyDiff = outA.monthlyInstallment - outB.monthlyInstallment;
  const interestDiff = outA.totalInterest - outB.totalInterest;
  const totalRepaymentDiff = outA.totalRepayment - outB.totalRepayment;

  // Winners per metric
  const getWinner = (valA: number, valB: number, lowerIsBetter = true) => {
    if (Math.abs(valA - valB) < 0.01) return 'tie';
    if (lowerIsBetter) {
      return valA < valB ? 'A' : 'B';
    } else {
      return valA > valB ? 'A' : 'B';
    }
  };

  const winMonthly = getWinner(outA.monthlyInstallment, outB.monthlyInstallment, true);
  const winInterest = getWinner(outA.totalInterest, outB.totalInterest, true);
  const winTotalPaid = getWinner(outA.totalRepayment, outB.totalRepayment, true);
  const winTenure = getWinner(scenarioA.tenure, scenarioB.tenure, true);
  const winRate = getWinner(scenarioA.interestRate, scenarioB.interestRate, true);
  const winRatio = getWinner(ratioA, ratioB, true);

  const handleUpdateA = (field: keyof HomeLoanInputs, val: any) => {
    setScenarioA(prev => ({ ...prev, [field]: val }));
  };

  const handleUpdateB = (field: keyof HomeLoanInputs, val: any) => {
    setScenarioB(prev => ({ ...prev, [field]: val }));
  };

  const handlePresetScenarioB = (preset: 'lowerRate' | 'shorterTenure' | 'higherDp') => {
    if (preset === 'lowerRate') {
      setScenarioB(prev => ({
        ...prev,
        interestRate: Math.max(0.1, Number((scenarioA.interestRate - 0.5).toFixed(2)))
      }));
    } else if (preset === 'shorterTenure') {
      setScenarioB(prev => ({
        ...prev,
        tenure: Math.max(5, scenarioA.tenure - 5)
      }));
    } else if (preset === 'higherDp') {
      const newDpPercent = Math.min(50, scenarioA.downPaymentPercent + 5);
      const newDpVal = (scenarioA.propertyPrice * newDpPercent) / 100;
      setScenarioB(prev => ({
        ...prev,
        downPaymentPercent: newDpPercent,
        downPayment: newDpVal
      }));
    }
  };

  // Generate Pros and Cons dynamically
  const getProsAndCons = (isA: boolean) => {
    const pros: string[] = [];
    const cons: string[] = [];

    const myWinMonthly = isA ? winMonthly === 'A' : winMonthly === 'B';
    const myWinInterest = isA ? winInterest === 'A' : winInterest === 'B';
    const myWinTenure = isA ? winTenure === 'A' : winTenure === 'B';
    const myWinRate = isA ? winRate === 'A' : winRate === 'B';
    const myWinRatio = isA ? winRatio === 'A' : winRatio === 'B';

    // Monthly
    if (myWinMonthly) {
      pros.push(`Lower monthly payment (Saves RM ${Math.abs(monthlyDiff).toLocaleString('en-MY', { maximumFractionDigits: 0 })}/month)`);
    } else if (winMonthly !== 'tie') {
      cons.push(`Higher monthly installment (+RM ${Math.abs(monthlyDiff).toLocaleString('en-MY', { maximumFractionDigits: 0 })}/month)`);
    }

    // Interest
    if (myWinInterest) {
      pros.push(`Saves RM ${Math.abs(interestDiff).toLocaleString('en-MY', { maximumFractionDigits: 0 })} in total interest paid`);
    } else if (winInterest !== 'tie') {
      cons.push(`Higher lifetime interest cost (+RM ${Math.abs(interestDiff).toLocaleString('en-MY', { maximumFractionDigits: 0 })})`);
    }

    // Tenure
    if (myWinTenure) {
      pros.push(`Shorter loan tenure (Debt-free ${Math.abs(scenarioA.tenure - scenarioB.tenure)} years sooner)`);
    } else if (winTenure !== 'tie') {
      cons.push(`Longer loan commitment (+${Math.abs(scenarioA.tenure - scenarioB.tenure)} years)`);
    }

    // Interest Rate
    if (myWinRate) {
      pros.push(`More competitive interest rate (${isA ? scenarioA.interestRate : scenarioB.interestRate}% p.a.)`);
    } else if (winRate !== 'tie') {
      cons.push(`Higher interest rate (${isA ? scenarioA.interestRate : scenarioB.interestRate}% p.a.)`);
    }

    // Ratio
    if (myWinRatio) {
      pros.push(`Lower interest burden relative to principal (${(isA ? ratioA : ratioB).toFixed(1)}% of loan amount)`);
    }

    if (pros.length === 0) pros.push('Balanced baseline scenario');
    if (cons.length === 0) cons.push('No major disadvantages relative to comparison');

    return { pros, cons };
  };

  const prosConsA = getProsAndCons(true);
  const prosConsB = getProsAndCons(false);

  // Overall Recommendation
  const getRecommendation = () => {
    if (winInterest === 'tie' && winMonthly === 'tie') {
      return {
        title: 'Scenarios are Identical',
        desc: 'Both loan scenarios produce equal monthly payments and total interest costs. Adjust interest rate, tenure, or down payment to test differences.',
        winner: 'tie'
      };
    }

    if (winInterest === 'B' && (winMonthly === 'B' || winMonthly === 'tie')) {
      return {
        title: 'Scenario B is the Clear Winner',
        desc: `Scenario B offers a lower monthly payment (Saves RM ${Math.abs(monthlyDiff).toLocaleString('en-MY', { maximumFractionDigits: 0 })}/mo) AND saves RM ${Math.abs(interestDiff).toLocaleString('en-MY', { maximumFractionDigits: 0 })} in total interest charges over the tenure.`,
        winner: 'B'
      };
    }

    if (winInterest === 'A' && (winMonthly === 'A' || winMonthly === 'tie')) {
      return {
        title: 'Scenario A is the Clear Winner',
        desc: `Scenario A provides lower monthly payments (Saves RM ${Math.abs(monthlyDiff).toLocaleString('en-MY', { maximumFractionDigits: 0 })}/mo) AND saves RM ${Math.abs(interestDiff).toLocaleString('en-MY', { maximumFractionDigits: 0 })} in total interest costs.`,
        winner: 'A'
      };
    }

    if (winInterest === 'B' && winMonthly === 'A') {
      return {
        title: 'Scenario B Maximizes Total Interest Savings',
        desc: `Scenario B saves RM ${Math.abs(interestDiff).toLocaleString('en-MY', { maximumFractionDigits: 0 })} in total interest paid over the life of the loan. However, it requires an extra RM ${Math.abs(monthlyDiff).toLocaleString('en-MY', { maximumFractionDigits: 0 })}/month in installment. Recommended if your monthly budget allows.`,
        winner: 'B'
      };
    }

    return {
      title: 'Scenario A Maximizes Total Interest Savings',
      desc: `Scenario A saves RM ${Math.abs(interestDiff).toLocaleString('en-MY', { maximumFractionDigits: 0 })} in total interest paid over the life of the loan. However, it requires an extra RM ${Math.abs(monthlyDiff).toLocaleString('en-MY', { maximumFractionDigits: 0 })}/month in installment. Recommended if your monthly budget allows.`,
      winner: 'A'
    };
  };

  const recommendation = getRecommendation();

  return (
    <div className="bg-white border border-border-custom rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 animate-fade-in">
      
      {/* Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-custom pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-primary shrink-0" />
            <h3 className="font-display font-extrabold text-base text-text-primary uppercase tracking-wide">
              Side-by-Side Mortgage Scenario Comparison
            </h3>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Compare two home loan options side-by-side to discover lifetime interest savings, monthly payment differences, and optimal affordability.
          </p>
        </div>

        {/* Sync button */}
        <button
          onClick={() => setScenarioA({ ...currentInputs })}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/15 px-3 py-1.5 rounded-xl transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Sync Scenario A from Main Form
        </button>
      </div>

      {/* Quick Presets for Scenario B */}
      <div className="bg-bg-custom/60 rounded-xl p-3 border border-border-custom flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-bold text-text-secondary">Quick Presets for Scenario B:</span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handlePresetScenarioB('lowerRate')}
            className="px-2.5 py-1 rounded-lg bg-white border border-border-custom text-text-primary hover:border-primary hover:text-primary transition-all font-semibold cursor-pointer"
          >
            −0.50% Interest Rate
          </button>
          <button
            onClick={() => handlePresetScenarioB('shorterTenure')}
            className="px-2.5 py-1 rounded-lg bg-white border border-border-custom text-text-primary hover:border-primary hover:text-primary transition-all font-semibold cursor-pointer"
          >
            −5 Years Tenure
          </button>
          <button
            onClick={() => handlePresetScenarioB('higherDp')}
            className="px-2.5 py-1 rounded-lg bg-white border border-border-custom text-text-primary hover:border-primary hover:text-primary transition-all font-semibold cursor-pointer"
          >
            +5% Down Payment
          </button>
        </div>
      </div>

      {/* Scenario Input Forms (2 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Scenario A Card */}
        <div className="border border-border-custom rounded-2xl p-5 bg-bg-custom/30 space-y-4">
          <div className="flex items-center justify-between border-b border-border-custom pb-2">
            <span className="text-xs font-black uppercase text-primary tracking-wider flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Scenario A (Base)
            </span>
            <span className="text-[10px] font-mono font-bold bg-primary/10 text-primary px-2.5 py-0.5 rounded-md">
              RM {outA.monthlyInstallment.toLocaleString('en-MY', { maximumFractionDigits: 0 })} / mo
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-text-secondary mb-1">Property Price (RM)</label>
              <input
                type="number"
                value={scenarioA.propertyPrice}
                onChange={(e) => handleUpdateA('propertyPrice', Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full h-9 px-3 border border-border-custom rounded-xl font-mono text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-text-secondary mb-1">Down Payment (%)</label>
              <input
                type="number"
                value={scenarioA.downPaymentPercent}
                onChange={(e) => {
                  const pct = Math.max(0, parseFloat(e.target.value) || 0);
                  const dpVal = (scenarioA.propertyPrice * pct) / 100;
                  setScenarioA(prev => ({ ...prev, downPaymentPercent: pct, downPayment: dpVal }));
                }}
                className="w-full h-9 px-3 border border-border-custom rounded-xl font-mono text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-text-secondary mb-1">Interest Rate (% p.a.)</label>
              <input
                type="number"
                step="0.05"
                value={scenarioA.interestRate}
                onChange={(e) => handleUpdateA('interestRate', Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                className="w-full h-9 px-3 border border-border-custom rounded-xl font-mono text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-text-secondary mb-1">Tenure (Years)</label>
              <select
                value={scenarioA.tenure}
                onChange={(e) => handleUpdateA('tenure', parseInt(e.target.value) || 30)}
                className="w-full h-9 px-2 border border-border-custom rounded-xl font-semibold text-xs cursor-pointer"
              >
                {[5, 10, 15, 20, 25, 30, 35].map(yrs => (
                  <option key={yrs} value={yrs}>{yrs} Years</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Scenario B Card */}
        <div className="border border-emerald-500/40 rounded-2xl p-5 bg-emerald-50/20 space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
            <span className="text-xs font-black uppercase text-emerald-700 tracking-wider flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
              Scenario B (Comparison)
            </span>
            <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-md">
              RM {outB.monthlyInstallment.toLocaleString('en-MY', { maximumFractionDigits: 0 })} / mo
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-text-secondary mb-1">Property Price (RM)</label>
              <input
                type="number"
                value={scenarioB.propertyPrice}
                onChange={(e) => handleUpdateB('propertyPrice', Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full h-9 px-3 border border-border-custom rounded-xl font-mono text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-text-secondary mb-1">Down Payment (%)</label>
              <input
                type="number"
                value={scenarioB.downPaymentPercent}
                onChange={(e) => {
                  const pct = Math.max(0, parseFloat(e.target.value) || 0);
                  const dpVal = (scenarioB.propertyPrice * pct) / 100;
                  setScenarioB(prev => ({ ...prev, downPaymentPercent: pct, downPayment: dpVal }));
                }}
                className="w-full h-9 px-3 border border-border-custom rounded-xl font-mono text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-text-secondary mb-1">Interest Rate (% p.a.)</label>
              <input
                type="number"
                step="0.05"
                value={scenarioB.interestRate}
                onChange={(e) => handleUpdateB('interestRate', Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                className="w-full h-9 px-3 border border-border-custom rounded-xl font-mono text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-text-secondary mb-1">Tenure (Years)</label>
              <select
                value={scenarioB.tenure}
                onChange={(e) => handleUpdateB('tenure', parseInt(e.target.value) || 30)}
                className="w-full h-9 px-2 border border-border-custom rounded-xl font-semibold text-xs cursor-pointer"
              >
                {[5, 10, 15, 20, 25, 30, 35].map(yrs => (
                  <option key={yrs} value={yrs}>{yrs} Years</option>
                ))}
              </select>
            </div>
          </div>
        </div>

      </div>

      {/* Recommendation Summary Banner */}
      <div className="bg-gradient-to-br from-emerald-500/10 via-primary/10 to-amber-500/10 border border-border-custom rounded-2xl p-6 space-y-2">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-emerald-600 shrink-0" />
          <h4 className="font-display font-black text-sm text-text-primary uppercase tracking-wide">
            Overall Recommendation Summary
          </h4>
        </div>
        <div className="font-bold text-sm text-text-primary">{recommendation.title}</div>
        <p className="text-xs text-text-secondary leading-relaxed">{recommendation.desc}</p>
      </div>

      {/* Side-by-Side Premium Comparison Table */}
      <div className="space-y-3">
        <h4 className="font-display font-extrabold text-sm text-text-primary uppercase tracking-wide">
          Detailed Scenario Metrics Comparison
        </h4>
        <div className="overflow-x-auto border border-border-custom rounded-2xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-bg-custom border-b border-border-custom">
                <th className="p-3.5 font-bold text-text-secondary uppercase text-[10px] tracking-wider">Comparison Metric</th>
                <th className="p-3.5 font-bold text-primary uppercase text-[10px] tracking-wider w-1/3">Scenario A</th>
                <th className="p-3.5 font-bold text-emerald-700 uppercase text-[10px] tracking-wider w-1/3">Scenario B</th>
                <th className="p-3.5 font-bold text-text-secondary uppercase text-[10px] tracking-wider text-right">Difference / Variance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-custom">
              
              {/* Monthly Payment */}
              <tr className="bg-primary/5">
                <td className="p-3.5 font-bold text-text-primary">Monthly Payment</td>
                <td className="p-3.5 font-mono font-bold text-text-primary">
                  <span>RM {outA.monthlyInstallment.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  {winMonthly === 'A' && (
                    <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Best
                    </span>
                  )}
                </td>
                <td className="p-3.5 font-mono font-bold text-text-primary">
                  <span>RM {outB.monthlyInstallment.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  {winMonthly === 'B' && (
                    <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Best
                    </span>
                  )}
                </td>
                <td className="p-3.5 font-mono text-right font-bold">
                  {monthlyDiff > 0 ? (
                    <span className="text-emerald-700">Scenario B saves RM {Math.abs(monthlyDiff).toLocaleString('en-MY', { minimumFractionDigits: 2 })}/mo</span>
                  ) : monthlyDiff < 0 ? (
                    <span className="text-amber-700">Scenario A saves RM {Math.abs(monthlyDiff).toLocaleString('en-MY', { minimumFractionDigits: 2 })}/mo</span>
                  ) : (
                    <span className="text-text-secondary">Identical</span>
                  )}
                </td>
              </tr>

              {/* Total Interest Paid */}
              <tr>
                <td className="p-3.5 font-bold text-text-primary">Total Interest Paid</td>
                <td className="p-3.5 font-mono font-semibold">
                  <span>RM {outA.totalInterest.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  {winInterest === 'A' && (
                    <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Best
                    </span>
                  )}
                </td>
                <td className="p-3.5 font-mono font-semibold">
                  <span>RM {outB.totalInterest.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  {winInterest === 'B' && (
                    <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Best
                    </span>
                  )}
                </td>
                <td className="p-3.5 font-mono text-right font-semibold">
                  {interestDiff > 0 ? (
                    <span className="text-emerald-700 font-bold">−RM {Math.abs(interestDiff).toLocaleString('en-MY', { minimumFractionDigits: 2 })}</span>
                  ) : interestDiff < 0 ? (
                    <span className="text-amber-700 font-bold">+RM {Math.abs(interestDiff).toLocaleString('en-MY', { minimumFractionDigits: 2 })}</span>
                  ) : (
                    <span className="text-text-secondary">Identical</span>
                  )}
                </td>
              </tr>

              {/* Total Amount Paid */}
              <tr>
                <td className="p-3.5 font-bold text-text-primary">Total Amount Paid</td>
                <td className="p-3.5 font-mono font-semibold">
                  <span>RM {outA.totalRepayment.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  {winTotalPaid === 'A' && (
                    <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Best
                    </span>
                  )}
                </td>
                <td className="p-3.5 font-mono font-semibold">
                  <span>RM {outB.totalRepayment.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  {winTotalPaid === 'B' && (
                    <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Best
                    </span>
                  )}
                </td>
                <td className="p-3.5 font-mono text-right font-semibold text-text-secondary">
                  RM {totalRepaymentDiff.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>

              {/* Loan Tenure */}
              <tr>
                <td className="p-3.5 font-bold text-text-primary">Loan Tenure</td>
                <td className="p-3.5 font-mono font-semibold">
                  <span>{scenarioA.tenure} Years</span>
                  {winTenure === 'A' && (
                    <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Faster
                    </span>
                  )}
                </td>
                <td className="p-3.5 font-mono font-semibold">
                  <span>{scenarioB.tenure} Years</span>
                  {winTenure === 'B' && (
                    <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Faster
                    </span>
                  )}
                </td>
                <td className="p-3.5 font-mono text-right text-text-secondary">
                  {scenarioB.tenure - scenarioA.tenure} Years
                </td>
              </tr>

              {/* Interest Rate */}
              <tr>
                <td className="p-3.5 font-bold text-text-primary">Interest Rate</td>
                <td className="p-3.5 font-mono font-semibold">
                  <span>{scenarioA.interestRate}% p.a.</span>
                  {winRate === 'A' && (
                    <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Lower
                    </span>
                  )}
                </td>
                <td className="p-3.5 font-mono font-semibold">
                  <span>{scenarioB.interestRate}% p.a.</span>
                  {winRate === 'B' && (
                    <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Lower
                    </span>
                  )}
                </td>
                <td className="p-3.5 font-mono text-right text-text-secondary">
                  {(scenarioB.interestRate - scenarioA.interestRate).toFixed(2)}%
                </td>
              </tr>

              {/* Interest-to-Loan Ratio */}
              <tr>
                <td className="p-3.5 font-bold text-text-primary">Interest-to-Loan Ratio</td>
                <td className="p-3.5 font-mono font-semibold">
                  <span>{ratioA.toFixed(1)}%</span>
                  {winRatio === 'A' && (
                    <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Best
                    </span>
                  )}
                </td>
                <td className="p-3.5 font-mono font-semibold">
                  <span>{ratioB.toFixed(1)}%</span>
                  {winRatio === 'B' && (
                    <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Best
                    </span>
                  )}
                </td>
                <td className="p-3.5 font-mono text-right text-text-secondary">
                  {(ratioB - ratioA).toFixed(1)}%
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      {/* Pros & Cons Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        
        {/* Scenario A Pros & Cons */}
        <div className="border border-border-custom rounded-2xl p-5 bg-bg-custom/30 space-y-4">
          <div className="font-display font-extrabold text-sm text-primary uppercase tracking-wide border-b border-border-custom pb-2">
            Scenario A Evaluation
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                <ThumbsUp className="h-3.5 w-3.5 text-emerald-600" /> Pros
              </span>
              <ul className="space-y-1 text-xs text-text-primary">
                {prosConsA.pros.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                <ThumbsDown className="h-3.5 w-3.5 text-amber-600" /> Cons
              </span>
              <ul className="space-y-1 text-xs text-text-secondary">
                {prosConsA.cons.map((c, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <XCircle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Scenario B Pros & Cons */}
        <div className="border border-emerald-500/40 rounded-2xl p-5 bg-emerald-50/20 space-y-4">
          <div className="font-display font-extrabold text-sm text-emerald-800 uppercase tracking-wide border-b border-emerald-200/80 pb-2">
            Scenario B Evaluation
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                <ThumbsUp className="h-3.5 w-3.5 text-emerald-600" /> Pros
              </span>
              <ul className="space-y-1 text-xs text-text-primary">
                {prosConsB.pros.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                <ThumbsDown className="h-3.5 w-3.5 text-amber-600" /> Cons
              </span>
              <ul className="space-y-1 text-xs text-text-secondary">
                {prosConsB.cons.map((c, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <XCircle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
