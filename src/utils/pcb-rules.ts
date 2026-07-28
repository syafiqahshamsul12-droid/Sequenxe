/**
 * PCB (Monthly Tax Deduction / Potongan Cukai Bulanan) & Personal Income Tax Rules (LHDN Malaysia 2026)
 * Based on LHDN Computerised Calculation Method & Progressive Tax Brackets.
 */

export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
  baseTax: number;
}

/**
 * LHDN Progressive Tax Brackets for Resident Individuals (YA 2026)
 */
export const TAX_BRACKETS_2026: TaxBracket[] = [
  { min: 0, max: 5000, rate: 0, baseTax: 0 },
  { min: 5000, max: 20000, rate: 0.01, baseTax: 0 },
  { min: 20000, max: 35000, rate: 0.03, baseTax: 150 },
  { min: 35000, max: 50000, rate: 0.06, baseTax: 600 },
  { min: 50000, max: 70000, rate: 0.11, baseTax: 1500 },
  { min: 70000, max: 100000, rate: 0.19, baseTax: 3700 },
  { min: 100000, max: 250000, rate: 0.25, baseTax: 9400 },
  { min: 250000, max: 400000, rate: 0.25, baseTax: 46900 },
  { min: 400000, max: 600000, rate: 0.26, baseTax: 84400 },
  { min: 600000, max: 1000000, rate: 0.28, baseTax: 136400 },
  { min: 1000000, max: Infinity, rate: 0.30, baseTax: 248400 }
];

export interface TaxReliefInputs {
  individual?: number;
  lifestyle?: number;
  medicalSelf?: number;
  parentMedical?: number;
  educationSelf?: number;
  childOrdinary?: number; // count or amount
  childTertiary?: number; // count or amount
  disabledIndividual?: number;
  spousesRelief?: number;
  lifeInsurance?: number;
  sspnSavings?: number;
}

/**
 * Statutory Relief Maximum Caps (YA 2026)
 */
export const RELIEF_CAPS = {
  INDIVIDUAL: 9000,
  LIFESTYLE: 2500,
  MEDICAL_SELF: 10000,
  PARENT_MEDICAL: 8000,
  EDUCATION_SELF: 7000,
  CHILD_ORDINARY_PER_CHILD: 2000,
  CHILD_TERTIARY_PER_CHILD: 8000,
  DISABLED_INDIVIDUAL: 6000,
  SPOUSE_RELIEF: 4000,
  EPF_RELIEF_CAP: 4000,
  LIFE_INSURANCE_CAP: 3000,
  SSPN_SAVINGS: 8000
};

export interface PcbCalculationResult {
  annualGross: number;
  annualEpfRelief: number;
  totalReliefsClaimed: number;
  chargeableIncome: number;
  annualTaxBeforeRebate: number;
  rebateAmount: number;
  annualNetTax: number;
  monthlyPcb: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
}

/**
 * Calculate Annual Tax and Monthly PCB (MTD) based on LHDN Computerised Calculation Rules
 */
export function calculatePcb(
  grossMonthlySalary: number,
  employeeEpfMonthly: number,
  reliefs: TaxReliefInputs = {}
): PcbCalculationResult {
  if (grossMonthlySalary <= 0) {
    return {
      annualGross: 0,
      annualEpfRelief: 0,
      totalReliefsClaimed: RELIEF_CAPS.INDIVIDUAL,
      chargeableIncome: 0,
      annualTaxBeforeRebate: 0,
      rebateAmount: 0,
      annualNetTax: 0,
      monthlyPcb: 0,
      effectiveTaxRate: 0,
      marginalTaxRate: 0
    };
  }

  const annualGross = grossMonthlySalary * 12;

  // Capped Annual EPF Deduction Relief (Max RM 4,000)
  const annualEpfRelief = Math.min(employeeEpfMonthly * 12, RELIEF_CAPS.EPF_RELIEF_CAP);

  // Parse child count or direct amount
  const childOrdinaryVal = (reliefs.childOrdinary || 0) <= 10 
    ? (reliefs.childOrdinary || 0) * RELIEF_CAPS.CHILD_ORDINARY_PER_CHILD 
    : (reliefs.childOrdinary || 0);

  const childTertiaryVal = (reliefs.childTertiary || 0) <= 10 
    ? (reliefs.childTertiary || 0) * RELIEF_CAPS.CHILD_TERTIARY_PER_CHILD 
    : (reliefs.childTertiary || 0);

  const individualRelief = reliefs.individual !== undefined ? reliefs.individual : RELIEF_CAPS.INDIVIDUAL;
  const lifestyleRelief = Math.min(reliefs.lifestyle || 0, RELIEF_CAPS.LIFESTYLE);
  const medicalSelfRelief = Math.min(reliefs.medicalSelf || 0, RELIEF_CAPS.MEDICAL_SELF);
  const parentMedicalRelief = Math.min(reliefs.parentMedical || 0, RELIEF_CAPS.PARENT_MEDICAL);
  const educationSelfRelief = Math.min(reliefs.educationSelf || 0, RELIEF_CAPS.EDUCATION_SELF);
  const disabledRelief = Math.min(reliefs.disabledIndividual || 0, RELIEF_CAPS.DISABLED_INDIVIDUAL);
  const spouseRelief = Math.min(reliefs.spousesRelief || 0, RELIEF_CAPS.SPOUSE_RELIEF);
  const lifeInsuranceRelief = Math.min(reliefs.lifeInsurance || 0, RELIEF_CAPS.LIFE_INSURANCE_CAP);
  const sspnRelief = Math.min(reliefs.sspnSavings || 0, RELIEF_CAPS.SSPN_SAVINGS);

  const totalReliefsClaimed = individualRelief + annualEpfRelief + lifestyleRelief + medicalSelfRelief
    + parentMedicalRelief + educationSelfRelief + childOrdinaryVal + childTertiaryVal
    + disabledRelief + spouseRelief + lifeInsuranceRelief + sspnRelief;

  // Chargeable Income (Income Tax Act Section 45)
  const chargeableIncome = Math.max(0, annualGross - totalReliefsClaimed);

  // Progressive Tax Calculation
  let annualTaxBeforeRebate = 0;
  let marginalTaxRate = 0;

  for (const bracket of TAX_BRACKETS_2026) {
    if (chargeableIncome > bracket.min) {
      if (chargeableIncome <= bracket.max) {
        annualTaxBeforeRebate = bracket.baseTax + (chargeableIncome - bracket.min) * bracket.rate;
        marginalTaxRate = bracket.rate;
        break;
      }
    }
  }

  // Individual Tax Rebate under Section 6A (RM 400 rebate if Chargeable Income <= RM 35,000)
  let rebateAmount = 0;
  if (chargeableIncome > 0 && chargeableIncome <= 35000) {
    rebateAmount = 400;
  }

  const annualNetTax = Math.max(0, annualTaxBeforeRebate - rebateAmount);
  const monthlyPcb = Math.round((annualNetTax / 12) * 100) / 100;
  const effectiveTaxRate = annualGross > 0 ? (annualNetTax / annualGross) * 100 : 0;

  return {
    annualGross,
    annualEpfRelief,
    totalReliefsClaimed,
    chargeableIncome,
    annualTaxBeforeRebate,
    rebateAmount,
    annualNetTax,
    monthlyPcb,
    effectiveTaxRate,
    marginalTaxRate
  };
}
