import { EpfInputs, EpfOutputs } from '../types';
import { calculateEpfProjection } from './formulas';

export interface ScoreFactor {
  id: 'realIncomeAdequacy' | 'contributionRate' | 'yearsToRetire' | 'salaryGrowth' | 'dividendAssumption';
  label: string;
  score: number;
  maxScore: number;
  percentage: number;
  note: string;
  status: 'excellent' | 'good' | 'moderate' | 'weak';
}

export interface ReadinessRecommendation {
  factorId: string;
  title: string;
  action: string;
  impactText: string;
  estimatedImpact?: number;
  priority: 'high' | 'medium' | 'low';
}

export type ReadinessStatusTier = 'Critical' | 'Needs Improvement' | 'Good' | 'Very Good' | 'Excellent';

export interface EpfReadinessResult {
  overallScore: number;
  statusTier: ReadinessStatusTier;
  statusLabel: string;
  statusColor: string;
  barColor: string;
  statusDescription: string;
  factors: {
    realIncomeAdequacy: ScoreFactor;
    contributionRate: ScoreFactor;
    yearsToRetire: ScoreFactor;
    salaryGrowth: ScoreFactor;
    dividendAssumption: ScoreFactor;
  };
  factorList: ScoreFactor[];
  recommendations: ReadinessRecommendation[];
  inflationDetails: {
    inflationRate: number;
    yearsToRetire: number;
    inflationFactor: number;
    realProjectedBalance: number;
    realMonthlyIncome: number;
    targetMonthlyIncome: number;
    replacementRatio: number;
  };
}

/**
 * Deterministically calculates a realistic, inflation-adjusted Retirement Readiness Score (0-100).
 * 
 * Key Principles:
 * 1. Evaluates balance in Today's Ringgit using a standard 3% p.a. inflation discount.
 * 2. Bases 45% of score on Real Monthly Retirement Income Adequacy relative to current salary (65% replacement target) or dignified living baseline.
 * 3. Reduces points for over-optimistic salary growth (>6%) or dividend assumptions (>6.5%).
 * 4. Reserves scores >= 95 strictly for exceptional scenarios meeting all safety & sustainability criteria.
 */
export function calculateEpfReadinessScore(
  inputs: EpfInputs,
  outputs: EpfOutputs,
  inflationRate: number = 3.0,
  withdrawalYears: number = 20
): EpfReadinessResult {
  const yearsToRetire = Math.max(0, inputs.retirementAge - inputs.currentAge);
  
  // -------------------------------------------------------------
  // Inflation Adjustment & Purchasing Power Calculations
  // -------------------------------------------------------------
  const inflationFactor = Math.pow(1 + inflationRate / 100, yearsToRetire);
  const realProjectedBalance = outputs.projectedBalance / inflationFactor;
  const realMonthlyIncome = realProjectedBalance / (withdrawalYears * 12);

  // Target monthly income in today's Ringgit:
  // Standard benchmark is 65% replacement rate of pre-retirement salary,
  // floor of RM 3,000/month for urban dignified living (KWSP Belanjawanku guide).
  const targetMonthlyIncome = Math.max(3000, inputs.salary * 0.65);
  const replacementRatio = targetMonthlyIncome > 0 ? realMonthlyIncome / targetMonthlyIncome : 0;

  // -------------------------------------------------------------
  // Factor 1: Real Retirement Income Adequacy (Max 45 pts)
  // -------------------------------------------------------------
  let incomeScore = 0;
  if (replacementRatio >= 1.5) {
    incomeScore = 45;
  } else if (replacementRatio >= 1.0) {
    incomeScore = 32 + ((replacementRatio - 1.0) / 0.5) * 13;
  } else if (replacementRatio >= 0.6) {
    incomeScore = 18 + ((replacementRatio - 0.6) / 0.4) * 14;
  } else if (replacementRatio >= 0.3) {
    incomeScore = 8 + ((replacementRatio - 0.3) / 0.3) * 10;
  } else {
    incomeScore = (replacementRatio / 0.3) * 8;
  }
  incomeScore = Math.min(45, Math.max(0, Math.round(incomeScore)));

  const incomeNote = `RM ${Math.round(realMonthlyIncome).toLocaleString('en-MY')}/mo vs RM ${Math.round(targetMonthlyIncome).toLocaleString('en-MY')}/mo target in today's RM (${(replacementRatio * 100).toFixed(0)}% coverage at ${inflationRate}% inflation)`;

  const factorRealIncomeAdequacy: ScoreFactor = {
    id: 'realIncomeAdequacy',
    label: "Real Income Adequacy (Today's RM)",
    score: incomeScore,
    maxScore: 45,
    percentage: Math.round((incomeScore / 45) * 100),
    note: incomeNote,
    status: incomeScore >= 38 ? 'excellent' : incomeScore >= 30 ? 'good' : incomeScore >= 18 ? 'moderate' : 'weak'
  };

  // -------------------------------------------------------------
  // Factor 2: Total EPF Contribution Rate (Max 20 pts)
  // -------------------------------------------------------------
  const totalRate = inputs.employeeRate + inputs.employerRate;
  let rateScore = 0;

  if (totalRate >= 30) {
    rateScore = 20; // High voluntary contribution
  } else if (totalRate >= 23) {
    rateScore = 14 + ((totalRate - 23) / 7) * 6;
  } else if (totalRate >= 15) {
    rateScore = 8 + ((totalRate - 15) / 8) * 6;
  } else {
    rateScore = (totalRate / 15) * 8;
  }
  rateScore = Math.min(20, Math.max(0, Math.round(rateScore)));

  const rateNote = `${inputs.employeeRate}% emp + ${inputs.employerRate}% empr (${totalRate}% total)`;

  const factorContributionRate: ScoreFactor = {
    id: 'contributionRate',
    label: 'Contribution Rate & Savings Rate',
    score: rateScore,
    maxScore: 20,
    percentage: Math.round((rateScore / 20) * 100),
    note: rateNote,
    status: rateScore >= 18 ? 'excellent' : rateScore >= 14 ? 'good' : rateScore >= 8 ? 'moderate' : 'weak'
  };

  // -------------------------------------------------------------
  // Factor 3: Years Until Retirement & Runway (Max 15 pts)
  // -------------------------------------------------------------
  let timeScore = 0;
  if (yearsToRetire >= 25) {
    timeScore = 15;
  } else if (yearsToRetire >= 15) {
    timeScore = 10 + ((yearsToRetire - 15) / 10) * 5;
  } else if (yearsToRetire >= 5) {
    timeScore = 5 + ((yearsToRetire - 5) / 10) * 5;
  } else {
    timeScore = (yearsToRetire / 5) * 5;
  }
  timeScore = Math.min(15, Math.max(0, Math.round(timeScore)));

  const timeNote = `${yearsToRetire} years compounding runway`;

  const factorYearsToRetire: ScoreFactor = {
    id: 'yearsToRetire',
    label: 'Years Until Retirement',
    score: timeScore,
    maxScore: 15,
    percentage: Math.round((timeScore / 15) * 100),
    note: timeNote,
    status: timeScore >= 13 ? 'excellent' : timeScore >= 10 ? 'good' : timeScore >= 5 ? 'moderate' : 'weak'
  };

  // -------------------------------------------------------------
  // Factor 4: Salary Growth Assumption Realism (Max 10 pts)
  // Moderate, realistic salary growth (2-4%) gets highest score.
  // Overly high assumption (>6%) is penalized as over-optimistic.
  // -------------------------------------------------------------
  const salaryInc = inputs.salaryIncrement;
  let growthScore = 0;

  if (salaryInc >= 2 && salaryInc <= 4) {
    growthScore = 10; // Realistic sweet spot
  } else if (salaryInc > 4 && salaryInc <= 6) {
    growthScore = 7; // Slightly optimistic
  } else if (salaryInc > 6) {
    growthScore = 4; // Penalty for speculative high wage growth
  } else if (salaryInc >= 1 && salaryInc < 2) {
    growthScore = 7; // Conservative
  } else {
    growthScore = 3; // 0% or negative real wage growth
  }
  growthScore = Math.min(10, Math.max(0, Math.round(growthScore)));

  const growthNote = `${salaryInc}% p.a. ${salaryInc > 6 ? '(over-optimistic)' : salaryInc >= 2 ? '(realistic range)' : '(conservative)'}`;

  const factorSalaryGrowth: ScoreFactor = {
    id: 'salaryGrowth',
    label: 'Salary Growth Assumption',
    score: growthScore,
    maxScore: 10,
    percentage: Math.round((growthScore / 10) * 100),
    note: growthNote,
    status: growthScore >= 9 ? 'excellent' : growthScore >= 7 ? 'good' : growthScore >= 4 ? 'moderate' : 'weak'
  };

  // -------------------------------------------------------------
  // Factor 5: Dividend vs Inflation Realism (Max 10 pts)
  // Historical KWSP 10y dividend ~5.4% p.a. (~2.4% real return over 3% inflation).
  // Overly high assumption (>6.5%) is penalized.
  // -------------------------------------------------------------
  const divRate = inputs.dividendRate;
  let dividendScore = 0;

  if (divRate >= 5.0 && divRate <= 5.8) {
    dividendScore = 10; // Realistic historical baseline
  } else if (divRate >= 4.0 && divRate < 5.0) {
    dividendScore = 8; // Conservative
  } else if (divRate > 5.8 && divRate <= 6.5) {
    dividendScore = 6; // Slightly optimistic
  } else if (divRate > 6.5) {
    dividendScore = 2; // Penalty for over-optimism
  } else {
    dividendScore = 4; // Unusually low
  }
  dividendScore = Math.min(10, Math.max(0, Math.round(dividendScore)));

  const realReturn = (divRate - inflationRate).toFixed(1);
  const dividendNote = `${divRate}% p.a. (${realReturn}% real return over ${inflationRate}% inflation)`;

  const factorDividendAssumption: ScoreFactor = {
    id: 'dividendAssumption',
    label: 'Dividend & Inflation Realism',
    score: dividendScore,
    maxScore: 10,
    percentage: Math.round((dividendScore / 10) * 100),
    note: dividendNote,
    status: dividendScore >= 9 ? 'excellent' : dividendScore >= 6 ? 'good' : 'moderate'
  };

  // -------------------------------------------------------------
  // Raw Weighted Score Sum (0-100)
  // -------------------------------------------------------------
  let rawScore = incomeScore + rateScore + timeScore + growthScore + dividendScore;

  // Reserve scores above 95 ONLY for truly exceptional readiness:
  // Must satisfy ALL strict criteria:
  // 1. Real replacement ratio >= 130%
  // 2. Total contribution rate >= 25%
  // 3. Dividend assumption <= 6.0% (not inflated by high market return hopes)
  // 4. Salary increment <= 5.0%
  if (rawScore >= 95) {
    const isExceptional = replacementRatio >= 1.3 && totalRate >= 25 && divRate <= 6.0 && salaryInc <= 5.0;
    if (!isExceptional) {
      rawScore = 94; // Cap at 94 unless truly exceptional & realistic
    }
  }

  const overallScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  // -------------------------------------------------------------
  // Status Tiers
  // -------------------------------------------------------------
  let statusTier: ReadinessStatusTier = 'Needs Improvement';
  let statusLabel = 'Needs Improvement';
  let statusColor = 'text-amber-800 bg-amber-50 border-amber-200';
  let barColor = 'bg-amber-500';
  let statusDescription = 'Below recommended real purchasing power targets. Raising contribution rates or voluntary top-ups will strengthen your nest egg.';

  if (overallScore >= 95) {
    statusTier = 'Excellent';
    statusLabel = 'Excellent';
    statusColor = 'text-emerald-900 bg-emerald-100 border-emerald-300';
    barColor = 'bg-emerald-600';
    statusDescription = 'Truly exceptional retirement readiness! Fully inflation-protected real monthly income with highly sustainable assumptions.';
  } else if (overallScore >= 80) {
    statusTier = 'Very Good';
    statusLabel = 'Very Good';
    statusColor = 'text-emerald-800 bg-emerald-50 border-emerald-200';
    barColor = 'bg-emerald-500';
    statusDescription = 'Solid financial foundation! Your inflation-adjusted monthly payout covers over 100% of your target income.';
  } else if (overallScore >= 60) {
    statusTier = 'Good';
    statusLabel = 'Good';
    statusColor = 'text-blue-800 bg-blue-50 border-blue-200';
    barColor = 'bg-blue-600';
    statusDescription = 'On track for moderate retirement comfort. Your real purchasing power provides good baseline income security.';
  } else if (overallScore >= 40) {
    statusTier = 'Needs Improvement';
    statusLabel = 'Needs Improvement';
    statusColor = 'text-amber-800 bg-amber-50 border-amber-200';
    barColor = 'bg-amber-500';
    statusDescription = 'Below ideal real income replacement. Modest voluntary contributions or working a few extra years will significantly improve security.';
  } else {
    statusTier = 'Critical';
    statusLabel = 'Critical';
    statusColor = 'text-rose-800 bg-rose-100 border-rose-300';
    barColor = 'bg-rose-600';
    statusDescription = 'Severe projected purchasing power deficit. Urgent action recommended to raise savings or extend retirement target.';
  }

  // -------------------------------------------------------------
  // Generate Targeted Recommendations
  // -------------------------------------------------------------
  const factorList: ScoreFactor[] = [
    factorRealIncomeAdequacy,
    factorContributionRate,
    factorYearsToRetire,
    factorSalaryGrowth,
    factorDividendAssumption
  ];

  const sortedFactors = [...factorList].sort((a, b) => a.percentage - b.percentage);
  const recommendations: ReadinessRecommendation[] = [];

  for (const factor of sortedFactors) {
    if (recommendations.length >= 3) break;

    if (factor.id === 'realIncomeAdequacy' && factor.percentage < 90) {
      const simVoluntary = calculateEpfProjection({ ...inputs, salary: inputs.salary + 300 }).projectedBalance;
      const boost = Math.round(simVoluntary - outputs.projectedBalance);
      recommendations.push({
        factorId: 'realIncomeAdequacy',
        title: 'Protect Real Purchasing Power via Voluntary EPF Top-Ups',
        action: 'Self-contribute RM 300/month (KWSP Self-Contribution) to combat inflation and elevate real monthly payout.',
        impactText: `+RM ${boost.toLocaleString('en-MY')} nominal nest egg boost at age ${inputs.retirementAge}`,
        estimatedImpact: boost,
        priority: factor.percentage < 60 ? 'high' : 'medium'
      });
    } else if (factor.id === 'contributionRate' && factor.percentage < 90) {
      const targetEmpRate = Math.min(15, inputs.employeeRate + 2);
      const simRate = calculateEpfProjection({ ...inputs, employeeRate: targetEmpRate }).projectedBalance;
      const boost = Math.round(simRate - outputs.projectedBalance);
      recommendations.push({
        factorId: 'contributionRate',
        title: `Raise Employee EPF Rate to ${targetEmpRate}%`,
        action: `Increase employee deduction from ${inputs.employeeRate}% to ${targetEmpRate}% via Borang KWSP 17A to accelerate compounding.`,
        impactText: `+RM ${boost.toLocaleString('en-MY')} additional accumulated savings`,
        estimatedImpact: boost,
        priority: factor.percentage < 60 ? 'high' : 'medium'
      });
    } else if (factor.id === 'yearsToRetire' && factor.percentage < 90) {
      const newRetireAge = Math.min(65, inputs.retirementAge + 3);
      if (newRetireAge > inputs.retirementAge) {
        const simDelay = calculateEpfProjection({ ...inputs, retirementAge: newRetireAge }).projectedBalance;
        const boost = Math.round(simDelay - outputs.projectedBalance);
        recommendations.push({
          factorId: 'yearsToRetire',
          title: `Extend Retirement Horizon to Age ${newRetireAge}`,
          action: `3 additional years allows compound dividends to exponentially increase your inflation-adjusted payout.`,
          impactText: `+RM ${boost.toLocaleString('en-MY')} extra balance by age ${newRetireAge}`,
          estimatedImpact: boost,
          priority: factor.percentage < 60 ? 'high' : 'medium'
        });
      }
    } else if (factor.id === 'dividendAssumption' && divRate > 6.0) {
      recommendations.push({
        factorId: 'dividendAssumption',
        title: 'Calibrate High Dividend Expectation',
        action: `Your expected dividend rate (${divRate}%) is optimistic. KWSP 10-year historical dividends average ~5.4% p.a. Adjusting downwards ensures realistic expectations.`,
        impactText: 'Ensures prudent planning aligned with official KWSP historical performance',
        priority: 'medium'
      });
    } else if (factor.id === 'salaryGrowth' && salaryInc > 6.0) {
      recommendations.push({
        factorId: 'salaryGrowth',
        title: 'Use Realistic Salary Increment Assumptions',
        action: `Assuming >6% annual raise for decades can inflate projections. A conservative 2-4% growth rate provides a safer planning baseline.`,
        impactText: 'Avoids over-reliance on aggressive future pay raises',
        priority: 'low'
      });
    }
  }

  return {
    overallScore,
    statusTier,
    statusLabel,
    statusColor,
    barColor,
    statusDescription,
    factors: {
      realIncomeAdequacy: factorRealIncomeAdequacy,
      contributionRate: factorContributionRate,
      yearsToRetire: factorYearsToRetire,
      salaryGrowth: factorSalaryGrowth,
      dividendAssumption: factorDividendAssumption
    },
    factorList,
    recommendations,
    inflationDetails: {
      inflationRate,
      yearsToRetire,
      inflationFactor,
      realProjectedBalance,
      realMonthlyIncome,
      targetMonthlyIncome,
      replacementRatio
    }
  };
}
