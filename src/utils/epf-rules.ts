/**
 * EPF / KWSP Statutory Contribution Rules (Employees Provident Fund Act 1991 - Third Schedule)
 * Standard Rates:
 * Employee: 11% (default statutory), 9% (reduced rate), or custom %.
 * Employer:
 * - Gross salary <= RM 5,000: 13% statutory rate
 * - Gross salary > RM 5,000: 12% statutory rate
 * - Optional override for companies providing enhanced benefits (e.g., 15%, 17%, 19%).
 */

export interface EmployerEpfRateInfo {
  rate: number;
  isOverridden: boolean;
  label: string;
}

/**
 * Determine statutory or overridden Employer EPF contribution rate based on gross salary.
 */
export function determineEmployerEpfRate(grossSalary: number, overrideRate?: number): EmployerEpfRateInfo {
  if (overrideRate !== undefined && overrideRate > 0) {
    return {
      rate: overrideRate,
      isOverridden: true,
      label: `Custom Overridden (${overrideRate}%)`
    };
  }

  if (grossSalary <= 5000) {
    return {
      rate: 13,
      isOverridden: false,
      label: 'Statutory Schedule 13% (Salary ≤ RM 5,000)'
    };
  }

  return {
    rate: 12,
    isOverridden: false,
    label: 'Statutory Schedule 12% (Salary > RM 5,000)'
  };
}

export interface EpfContributionResult {
  employeeAmount: number;
  employerAmount: number;
  employerRate: number;
  isEmployerOverridden: boolean;
  employerLabel: string;
  totalContribution: number;
  accountBreakdown: {
    akaunPersaraan: number; // Account 1 (75%)
    akaunSejahtera: number; // Account 2 (15%)
    akaunFleksibel: number; // Account 3 (10%)
  };
}

/**
 * Calculate exact statutory EPF contribution amounts according to KWSP rules.
 */
export function calculateEpfContributions(
  grossSalary: number,
  employeeRate: number = 11,
  employerOverrideRate?: number
): EpfContributionResult {
  if (grossSalary <= 0) {
    return {
      employeeAmount: 0,
      employerAmount: 0,
      employerRate: 13,
      isEmployerOverridden: false,
      employerLabel: 'RM 0',
      totalContribution: 0,
      accountBreakdown: { akaunPersaraan: 0, akaunSejahtera: 0, akaunFleksibel: 0 }
    };
  }

  // Statutory rounding under KWSP Third Schedule
  const employeeAmount = Math.ceil(grossSalary * (employeeRate / 100));
  const rateInfo = determineEmployerEpfRate(grossSalary, employerOverrideRate);
  const employerAmount = Math.ceil(grossSalary * (rateInfo.rate / 100));

  const totalContribution = employeeAmount + employerAmount;

  // New 3-Account Distribution (2024 policy): 75% / 15% / 10%
  const akaunPersaraan = Math.round(totalContribution * 0.75 * 100) / 100;
  const akaunSejahtera = Math.round(totalContribution * 0.15 * 100) / 100;
  const akaunFleksibel = Math.round((totalContribution - akaunPersaraan - akaunSejahtera) * 100) / 100;

  return {
    employeeAmount,
    employerAmount,
    employerRate: rateInfo.rate,
    isEmployerOverridden: rateInfo.isOverridden,
    employerLabel: rateInfo.label,
    totalContribution,
    accountBreakdown: {
      akaunPersaraan,
      akaunSejahtera,
      akaunFleksibel
    }
  };
}
