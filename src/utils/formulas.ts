import { 
  SalaryInputs, 
  SalaryOutputs, 
  PcbInputs,
  PcbOutputs,
  IncomeTaxInputs,
  IncomeTaxOutputs,
  TaxBracketTier,
  HomeLoanInputs, 
  HomeLoanOutputs, 
  EpfInputs, 
  EpfOutputs, 
  PersonalLoanInputs, 
  PersonalLoanOutputs,
  StampDutyInputs,
  StampDutyOutputs,
  LoanEligibilityInputs,
  LoanEligibilityOutputs
} from '../types';

import { calculateSocsoByTable } from './socso-rules';
import { calculateEisByTable } from './eis-rules';
import { calculateEpfContributions, determineEmployerEpfRate } from './epf-rules';
import { calculatePcb } from './pcb-rules';

export * from './socso-rules';
export * from './eis-rules';
export * from './epf-rules';
export * from './pcb-rules';

/**
 * Calculates Malaysian SOCSO (PERKESO) employee and employer contribution via statutory table lookup.
 * Ceiling salary is RM 6,000.
 */
export function calculateSocso(salary: number): { employee: number; employer: number } {
  const result = calculateSocsoByTable(salary, 1);
  return {
    employee: result.employee,
    employer: result.employer
  };
}

/**
 * Calculates Malaysian EIS (SIP) contribution via statutory table lookup.
 * Ceiling salary is RM 6,000.
 */
export function calculateEis(salary: number): { employee: number; employer: number } {
  const result = calculateEisByTable(salary);
  return {
    employee: result.employee,
    employer: result.employer
  };
}

/**
 * Calculates Malaysian Income Tax (PCB) and full payroll deductions for Year 2026.
 */
export function calculateSalaryTax(inputs: SalaryInputs): SalaryOutputs {
  const { grossSalary, epfRate, employerEpfOverrideRate, reliefs } = inputs;
  
  const monthlyGross = grossSalary;
  const annualGross = grossSalary * 12;
  
  // 1. Calculate statutory EPF amounts using official EPF rules
  const epfRes = calculateEpfContributions(monthlyGross, epfRate, employerEpfOverrideRate);
  
  // 2. Table-based statutory SOCSO and EIS
  const socsoResult = calculateSocsoByTable(monthlyGross, 1);
  const eisResult = calculateEisByTable(monthlyGross);
  
  // 3. LHDN Monthly Tax Deduction (PCB) calculation using official PCB rules
  const pcbRes = calculatePcb(monthlyGross, epfRes.employeeAmount, reliefs);
  
  const totalEmployeeDeductions = epfRes.employeeAmount + socsoResult.employee + eisResult.employee + pcbRes.monthlyPcb;
  const netSalary = monthlyGross - totalEmployeeDeductions;
  
  const totalEmployerContribution = epfRes.employerAmount + socsoResult.employer + eisResult.employer;
  const totalEmploymentCost = monthlyGross + totalEmployerContribution;

  return {
    grossMonthly: monthlyGross,
    grossAnnual: annualGross,
    epfEmployee: Number(epfRes.employeeAmount.toFixed(2)),
    epfEmployer: Number(epfRes.employerAmount.toFixed(2)),
    socso: socsoResult.employee,
    socsoEmployee: socsoResult.employee,
    socsoEmployer: socsoResult.employer,
    eis: eisResult.employee,
    eisEmployee: eisResult.employee,
    eisEmployer: eisResult.employer,
    monthlyPcb: Number(pcbRes.monthlyPcb.toFixed(2)),
    annualPcb: Number(pcbRes.annualNetTax.toFixed(2)),
    totalDeductions: Number(totalEmployeeDeductions.toFixed(2)),
    totalEmployeeDeductions: Number(totalEmployeeDeductions.toFixed(2)),
    totalEmployerContribution: Number(totalEmployerContribution.toFixed(2)),
    totalEmploymentCost: Number(totalEmploymentCost.toFixed(2)),
    netSalary: Number(netSalary.toFixed(2)),
    taxableIncome: Number(pcbRes.chargeableIncome.toFixed(2)),
    totalReliefsClaimed: pcbRes.totalReliefsClaimed,
    applicableTaxRate: pcbRes.marginalTaxRate * 100,
    effectiveTaxRate: Number(pcbRes.effectiveTaxRate.toFixed(2)),
    totalAnnualTaxPayable: Number(pcbRes.annualNetTax.toFixed(2)),
    annualGross,
    annualNet: Number((netSalary * 12).toFixed(2)),
    annualEmployeeDeductions: Number((totalEmployeeDeductions * 12).toFixed(2)),
    annualEmployerContributions: Number((totalEmployerContribution * 12).toFixed(2))
  };
}

/**
 * PCB (Monthly Tax Deduction) Calculator according to LHDN Computerised Calculation Method.
 */
export function calculatePcbCalculation(inputs: PcbInputs): PcbOutputs {
  const {
    monthlySalary,
    bonus = 0,
    epfRate,
    maritalStatus,
    isTaxResident,
    childrenCount,
    monthlyZakat = 0,
    additionalReliefs = 0
  } = inputs;

  const annualSalary = monthlySalary * 12;
  const annualGross = annualSalary + bonus;

  // Monthly statutory employee deductions
  const epfRes = calculateEpfContributions(monthlySalary, epfRate);
  const epfEmployee = epfRes.employeeAmount;
  const socsoResult = calculateSocsoByTable(monthlySalary);
  const eisResult = calculateEisByTable(monthlySalary);

  if (!isTaxResident) {
    // Non-resident flat 30% rate without reliefs or rebates
    const annualPcb = annualGross * 0.30;
    const monthlyPcb = annualPcb / 12;
    const totalDeductions = epfEmployee + socsoResult.employee + eisResult.employee + monthlyPcb;
    const netSalary = (monthlySalary + bonus) - totalDeductions;

    return {
      monthlySalary,
      bonus,
      monthlyPcb: Number(monthlyPcb.toFixed(2)),
      annualPcb: Number(annualPcb.toFixed(2)),
      epfEmployee: Number(epfEmployee.toFixed(2)),
      socsoEmployee: socsoResult.employee,
      eisEmployee: eisResult.employee,
      totalDeductions: Number(totalDeductions.toFixed(2)),
      netSalary: Number(netSalary.toFixed(2)),
      annualGross,
      annualNet: Number((netSalary * 12).toFixed(2)),
      annualEpf: Number((epfEmployee * 12).toFixed(2)),
      taxableIncome: annualGross,
      effectiveTaxRate: 30.0,
      applicableTaxRate: 30.0
    };
  }

  // Resident Tax Calculation using PCB Rules
  const spouseVal = maritalStatus === 'married_non_working_spouse' ? 4000 : 0;
  const childVal = childrenCount * 2000;
  const reliefsObj = {
    individual: 9000,
    spousesRelief: spouseVal,
    childOrdinary: childVal,
    lifestyle: additionalReliefs
  };

  const pcbRes = calculatePcb(monthlySalary + (bonus / 12), epfEmployee, reliefsObj);
  const annualZakat = monthlyZakat * 12;
  const finalAnnualTax = Math.max(pcbRes.annualNetTax - annualZakat, 0);
  const monthlyPcb = finalAnnualTax / 12;

  const totalDeductions = epfEmployee + socsoResult.employee + eisResult.employee + monthlyPcb;
  const netSalary = (monthlySalary + bonus) - totalDeductions;

  return {
    monthlySalary,
    bonus,
    monthlyPcb: Number(monthlyPcb.toFixed(2)),
    annualPcb: Number(finalAnnualTax.toFixed(2)),
    epfEmployee: Number(epfEmployee.toFixed(2)),
    socsoEmployee: socsoResult.employee,
    eisEmployee: eisResult.employee,
    totalDeductions: Number(totalDeductions.toFixed(2)),
    netSalary: Number(netSalary.toFixed(2)),
    annualGross,
    annualNet: Number((netSalary * 12).toFixed(2)),
    annualEpf: Number((epfEmployee * 12).toFixed(2)),
    taxableIncome: Number(pcbRes.chargeableIncome.toFixed(2)),
    effectiveTaxRate: Number(pcbRes.effectiveTaxRate.toFixed(2)),
    applicableTaxRate: pcbRes.marginalTaxRate * 100
  };
}

/**
 * Income Tax Calculation for YA 2026 with progressive tax bracket breakdown and tax savings.
 */
export function calculateIncomeTaxCalculation(inputs: IncomeTaxInputs): IncomeTaxOutputs {
  const {
    monthlySalary,
    annualBonus = 0,
    epfRate,
    maritalStatus,
    isTaxResident,
    childrenCount,
    childrenTertiaryCount,
    zakat = 0,
    reliefs
  } = inputs;

  const annualGross = (monthlySalary * 12) + annualBonus;
  const epfRes = calculateEpfContributions(monthlySalary, epfRate);
  const annualEpf = epfRes.employeeAmount * 12;

  if (!isTaxResident) {
    const taxPayable = annualGross * 0.30;
    return {
      annualGross,
      totalReliefsClaimed: 0,
      chargeableIncome: annualGross,
      annualTaxPayable: Number(taxPayable.toFixed(2)),
      effectiveTaxRate: 30.0,
      applicableTaxRate: 30.0,
      monthlyPcbEquivalent: Number((taxPayable / 12).toFixed(2)),
      taxSavingsFromReliefs: 0,
      bracketBreakdown: [
        {
          rangeLabel: 'Flat Non-Resident Rate (All Income)',
          ratePercent: 30,
          taxableInTier: annualGross,
          taxInTier: taxPayable
        }
      ]
    };
  }

  // Resident Reliefs
  const fullReliefs = {
    ...reliefs,
    spousesRelief: maritalStatus === 'married_non_working_spouse' ? 4000 : 0,
    childOrdinary: childrenCount,
    childTertiary: childrenTertiaryCount
  };

  const pcbRes = calculatePcb(annualGross / 12, epfRes.employeeAmount, fullReliefs);
  const finalAnnualTax = Math.max(pcbRes.annualNetTax - zakat, 0);

  // Progressive Tax Bracket Tiers Breakdown
  const bracketRanges = [
    { label: 'RM 0 – RM 5,000', min: 0, max: 5000, rate: 0 },
    { label: 'RM 5,001 – RM 20,000', min: 5000, max: 20000, rate: 0.01 },
    { label: 'RM 20,001 – RM 35,000', min: 20000, max: 35000, rate: 0.03 },
    { label: 'RM 35,001 – RM 50,000', min: 35000, max: 50000, rate: 0.06 },
    { label: 'RM 50,001 – RM 70,000', min: 50000, max: 70000, rate: 0.11 },
    { label: 'RM 70,001 – RM 100,000', min: 70000, max: 100000, rate: 0.19 },
    { label: 'RM 100,001 – RM 250,000', min: 100000, max: 250000, rate: 0.25 },
    { label: 'RM 250,001 – RM 400,000', min: 250000, max: 400000, rate: 0.25 },
    { label: 'RM 400,001 – RM 600,000', min: 400000, max: 600000, rate: 0.26 },
    { label: 'RM 600,001 – RM 1,000,000', min: 600000, max: 1000000, rate: 0.28 },
    { label: 'Above RM 1,000,000', min: 1000000, max: Infinity, rate: 0.30 }
  ];

  const bracketBreakdown: TaxBracketTier[] = [];
  for (const b of bracketRanges) {
    if (pcbRes.chargeableIncome > b.min) {
      const taxableInTier = Math.min(pcbRes.chargeableIncome - b.min, b.max - b.min);
      const taxInTier = taxableInTier * b.rate;

      bracketBreakdown.push({
        rangeLabel: b.label,
        ratePercent: b.rate * 100,
        taxableInTier: Number(taxableInTier.toFixed(2)),
        taxInTier: Number(taxInTier.toFixed(2))
      });
    }
  }

  // Tax savings calculation
  const basicPcbRes = calculatePcb(annualGross / 12, epfRes.employeeAmount, { individual: 9000 });
  const taxSavingsFromReliefs = Math.max(basicPcbRes.annualNetTax - finalAnnualTax, 0);

  return {
    annualGross,
    totalReliefsClaimed: pcbRes.totalReliefsClaimed,
    chargeableIncome: Number(pcbRes.chargeableIncome.toFixed(2)),
    annualTaxPayable: Number(finalAnnualTax.toFixed(2)),
    effectiveTaxRate: Number(pcbRes.effectiveTaxRate.toFixed(2)),
    applicableTaxRate: pcbRes.marginalTaxRate * 100,
    monthlyPcbEquivalent: Number((finalAnnualTax / 12).toFixed(2)),
    taxSavingsFromReliefs: Number(taxSavingsFromReliefs.toFixed(2)),
    bracketBreakdown
  };
}

/**
 * Calculates Malaysian Home Loan, SPA & Loan stamp duties, and monthly installments.
 */
export function calculateHomeLoan(inputs: HomeLoanInputs): HomeLoanOutputs {
  const { propertyPrice, downPayment, interestRate, tenure, isFirstTimeBuyer } = inputs;
  
  const loanAmount = Math.max(propertyPrice - downPayment, 0);
  
  const r = (interestRate / 100) / 12;
  const n = tenure * 12;
  
  let monthlyInstallment = 0;
  if (loanAmount > 0) {
    if (r === 0) {
      monthlyInstallment = loanAmount / n;
    } else {
      monthlyInstallment = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
  }
  
  const totalRepayment = monthlyInstallment * n;
  const totalInterest = Math.max(totalRepayment - loanAmount, 0);
  
  let spaStampDuty = 0;
  if (propertyPrice <= 100000) {
    spaStampDuty = propertyPrice * 0.01;
  } else if (propertyPrice <= 500000) {
    spaStampDuty = (100000 * 0.01) + ((propertyPrice - 100000) * 0.02);
  } else if (propertyPrice <= 1000000) {
    spaStampDuty = (100000 * 0.01) + (400000 * 0.02) + ((propertyPrice - 500000) * 0.03);
  } else {
    spaStampDuty = (100000 * 0.01) + (400000 * 0.02) + (500000 * 0.03) + ((propertyPrice - 1000000) * 0.04);
  }
  
  let loanStampDuty = loanAmount * 0.005;
  
  if (isFirstTimeBuyer && propertyPrice <= 500000) {
    spaStampDuty = 0;
    loanStampDuty = 0;
  }
  
  const totalInitialCost = downPayment + spaStampDuty + loanStampDuty;
  
  const amortizationSchedule = [];
  let remainingBalance = loanAmount;
  let cumulativeInterest = 0;
  
  for (let year = 1; year <= tenure; year++) {
    let interestPaidYearly = 0;
    let principalPaidYearly = 0;
    
    for (let month = 1; month <= 12; month++) {
      const interestMonth = remainingBalance * r;
      const principalMonth = monthlyInstallment - interestMonth;
      
      interestPaidYearly += interestMonth;
      principalPaidYearly += principalMonth;
      remainingBalance = Math.max(remainingBalance - principalMonth, 0);
    }
    
    cumulativeInterest += interestPaidYearly;
    
    amortizationSchedule.push({
      year,
      interestPaid: Number(interestPaidYearly.toFixed(2)),
      principalPaid: Number(principalPaidYearly.toFixed(2)),
      remainingBalance: Number(remainingBalance.toFixed(2)),
      cumulativeInterest: Number(cumulativeInterest.toFixed(2))
    });
  }
  
  return {
    loanAmount: Number(loanAmount.toFixed(2)),
    monthlyInstallment: Number(monthlyInstallment.toFixed(2)),
    totalInterest: Number(totalInterest.toFixed(2)),
    totalRepayment: Number(totalRepayment.toFixed(2)),
    spaStampDuty: Number(spaStampDuty.toFixed(2)),
    loanStampDuty: Number(loanStampDuty.toFixed(2)),
    totalInitialCost: Number(totalInitialCost.toFixed(2)),
    amortizationSchedule
  };
}

/**
 * Calculates Malaysian EPF (KWSP) growth projection and division into Accounts 1, 2, and 3.
 */
export function calculateEpfProjection(inputs: EpfInputs): EpfOutputs {
  const {
    currentAge,
    retirementAge,
    currentBalance,
    salary,
    salaryIncrement,
    employeeRate,
    employerRate,
    dividendRate
  } = inputs;
  
  const yearsToRetire = Math.max(retirementAge - currentAge, 0);
  const yearlyGrowth = [];
  
  let balance = currentBalance;
  let totalEmployeeContrib = 0;
  let totalEmployerContrib = 0;
  let totalDividends = 0;
  let currentSalary = salary;
  
  const divRateDecimal = dividendRate / 100;
  
  for (let year = 1; year <= yearsToRetire; year++) {
    const age = currentAge + year;
    
    let yearlyEmployeeContrib = 0;
    let yearlyEmployerContrib = 0;
    let yearlyDividends = 0;
    
    const monthlySalary = currentSalary;
    const epfRes = calculateEpfContributions(monthlySalary, employeeRate, employerRate);
    const monthlyEmployeeContrib = epfRes.employeeAmount;
    const monthlyEmployerContrib = epfRes.employerAmount;
    const totalMonthlyContrib = monthlyEmployeeContrib + monthlyEmployerContrib;
    
    for (let month = 1; month <= 12; month++) {
      balance += totalMonthlyContrib;
      yearlyEmployeeContrib += monthlyEmployeeContrib;
      yearlyEmployerContrib += monthlyEmployerContrib;
      
      const dividendAccrued = balance * (divRateDecimal / 12);
      yearlyDividends += dividendAccrued;
    }
    
    balance += yearlyDividends;
    
    totalEmployeeContrib += yearlyEmployeeContrib;
    totalEmployerContrib += yearlyEmployerContrib;
    totalDividends += yearlyDividends;
    
    yearlyGrowth.push({
      year,
      age,
      employeeContrib: Number(yearlyEmployeeContrib.toFixed(2)),
      employerContrib: Number(yearlyEmployerContrib.toFixed(2)),
      dividends: Number(yearlyDividends.toFixed(2)),
      balance: Number(balance.toFixed(2))
    });
    
    currentSalary = currentSalary * (1 + (salaryIncrement / 100));
  }
  
  const akaunPersaraan = balance * 0.75;
  const akaunSejahtera = balance * 0.15;
  const akaunFleksibel = balance * 0.10;
  
  let adequacyStatus: 'adequate' | 'moderate' | 'insufficient' = 'insufficient';
  if (balance >= 500000) {
    adequacyStatus = 'adequate';
  } else if (balance >= 240000) {
    adequacyStatus = 'moderate';
  }
  
  const monthlyPayoutRetired = balance / (20 * 12);
  
  return {
    projectedBalance: Number(balance.toFixed(2)),
    totalContributions: Number((totalEmployeeContrib + totalEmployerContrib).toFixed(2)),
    totalDividends: Number(totalDividends.toFixed(2)),
    monthlyPayoutRetired: Number(monthlyPayoutRetired.toFixed(2)),
    adequacyStatus,
    accountBreakdown: {
      akaunPersaraan: Number(akaunPersaraan.toFixed(2)),
      akaunSejahtera: Number(akaunSejahtera.toFixed(2)),
      akaunFleksibel: Number(akaunFleksibel.toFixed(2))
    },
    yearlyGrowth
  };
}

/**
 * Calculates Personal Loan details, comparing flat interest rate and effective interest rate (EIR).
 */
export function calculatePersonalLoan(inputs: PersonalLoanInputs): PersonalLoanOutputs {
  const { loanAmount, interestRate, tenure } = inputs;
  
  const totalInterest = loanAmount * (interestRate / 100) * tenure;
  const totalRepayment = loanAmount + totalInterest;
  const months = tenure * 12;
  const monthlyPayment = totalRepayment / months;
  
  let low = 0;
  let high = 1.0;
  const targetPV = loanAmount;
  const PMT = monthlyPayment;
  
  for (let iter = 0; iter < 40; iter++) {
    const mid = (low + high) / 2;
    let pv = 0;
    if (mid === 0) {
      pv = PMT * months;
    } else {
      pv = PMT * (1 - Math.pow(1 + mid, -months)) / mid;
    }
    
    if (pv > targetPV) {
      low = mid;
    } else {
      high = mid;
    }
  }
  
  const r_approx = (low + high) / 2;
  const annualEir = r_approx * 12 * 100;
  
  return {
    monthlyPayment: Number(monthlyPayment.toFixed(2)),
    totalInterest: Number(totalInterest.toFixed(2)),
    totalRepayment: Number(totalRepayment.toFixed(2)),
    effectiveRate: Number(annualEir.toFixed(2))
  };
}

/**
 * Calculates Stamp Duty for SPA and Loan Agreement in Malaysia.
 */
export function calculateStampDuty(inputs: StampDutyInputs): StampDutyOutputs {
  const { propertyPrice, loanAmount, isFirstTimeBuyer } = inputs;

  let spaStampDuty = 0;
  if (propertyPrice <= 100000) {
    spaStampDuty = propertyPrice * 0.01;
  } else if (propertyPrice <= 500000) {
    spaStampDuty = (100000 * 0.01) + ((propertyPrice - 100000) * 0.02);
  } else if (propertyPrice <= 1000000) {
    spaStampDuty = (100000 * 0.01) + (400000 * 0.02) + ((propertyPrice - 500000) * 0.03);
  } else {
    spaStampDuty = (100000 * 0.01) + (400000 * 0.02) + (500000 * 0.03) + ((propertyPrice - 1000000) * 0.04);
  }

  let loanStampDuty = loanAmount * 0.005;

  if (isFirstTimeBuyer && propertyPrice <= 500000) {
    spaStampDuty = 0;
    loanStampDuty = 0;
  }

  let estimatedLegalFees = 0;
  if (propertyPrice <= 500000) {
    estimatedLegalFees = propertyPrice * 0.01;
  } else {
    estimatedLegalFees = (500000 * 0.01) + ((propertyPrice - 500000) * 0.008);
  }
  estimatedLegalFees = Math.max(estimatedLegalFees, 500);

  const totalDisbursementAndFees = spaStampDuty + loanStampDuty + estimatedLegalFees;
  const effectiveDutyRate = propertyPrice > 0 ? ((spaStampDuty + loanStampDuty) / propertyPrice) * 100 : 0;

  return {
    spaStampDuty: Number(spaStampDuty.toFixed(2)),
    loanStampDuty: Number(loanStampDuty.toFixed(2)),
    estimatedLegalFees: Number(estimatedLegalFees.toFixed(2)),
    totalDisbursementAndFees: Number(totalDisbursementAndFees.toFixed(2)),
    effectiveDutyRate: Number(effectiveDutyRate.toFixed(2))
  };
}

/**
 * Calculates Loan Eligibility and Debt Service Ratio (DSR) for Malaysian commercial banks.
 */
export function calculateLoanEligibility(inputs: LoanEligibilityInputs): LoanEligibilityOutputs {
  const grossMonthlyIncome = inputs.grossMonthlyIncome || 0;
  const fixedMonthlyDeductions = inputs.fixedMonthlyDeductions ?? (grossMonthlyIncome * 0.15);
  const existingMonthlyCommitments = inputs.existingMonthlyCommitments ?? (inputs.existingCommitments ?? 0);
  const interestRate = inputs.interestRate || 4.2;
  const tenure = inputs.tenure ?? (inputs.tenureYears ?? 35);
  const maxDsrLimit = inputs.maxDsrLimit || 70;

  const netMonthlyIncome = Math.max(grossMonthlyIncome - fixedMonthlyDeductions, 0);
  const maxAllowableCommitment = netMonthlyIncome * (maxDsrLimit / 100);
  const maxNewInstallment = Math.max(maxAllowableCommitment - existingMonthlyCommitments, 0);

  const r = (interestRate / 100) / 12;
  const n = tenure * 12;
  
  let maxEstimatedLoanAmount = 0;
  if (r > 0 && n > 0 && maxNewInstallment > 0) {
    maxEstimatedLoanAmount = (maxNewInstallment * (1 - Math.pow(1 + r, -n))) / r;
  } else if (r === 0 && n > 0) {
    maxEstimatedLoanAmount = maxNewInstallment * n;
  }

  const currentDsr = netMonthlyIncome > 0 ? (existingMonthlyCommitments / netMonthlyIncome) * 100 : 0;

  let status: 'eligible' | 'warning' | 'over_limit' = 'eligible';
  if (currentDsr >= maxDsrLimit) {
    status = 'over_limit';
  } else if (currentDsr >= maxDsrLimit - 15) {
    status = 'warning';
  }

  const maxPropertyPrice = maxEstimatedLoanAmount / 0.9;

  return {
    netMonthlyIncome: Number(netMonthlyIncome.toFixed(2)),
    maxAllowableCommitment: Number(maxAllowableCommitment.toFixed(2)),
    maxNewInstallment: Number(maxNewInstallment.toFixed(2)),
    maxMonthlyInstallment: Number(maxNewInstallment.toFixed(2)),
    maxEstimatedLoanAmount: Number(maxEstimatedLoanAmount.toFixed(2)),
    maxLoanAmount: Number(maxEstimatedLoanAmount.toFixed(2)),
    maxPropertyPrice: Number(maxPropertyPrice.toFixed(2)),
    currentDsr: Number(currentDsr.toFixed(2)),
    maxAllowedDsr: maxDsrLimit,
    status
  };
}
