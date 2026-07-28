/**
 * EIS / SIP Statutory Contribution Rules & Schedules (Act 800 - Employment Insurance System Act 2017)
 * Official statutory wage schedule up to the RM 6,000 salary ceiling.
 */

export interface EisBracket {
  minSalary: number;
  maxSalary: number;
  employee: number; // Employee contribution (RM)
  employer: number; // Employer contribution (RM)
}

/**
 * Official EIS Schedule (Jadual Caruman SIP/EIS)
 */
export const EIS_RATES_TABLE: EisBracket[] = [
  { minSalary: 0, maxSalary: 30, employee: 0.05, employer: 0.05 },
  { minSalary: 30, maxSalary: 50, employee: 0.10, employer: 0.10 },
  { minSalary: 50, maxSalary: 70, employee: 0.10, employer: 0.10 },
  { minSalary: 70, maxSalary: 100, employee: 0.20, employer: 0.20 },
  { minSalary: 100, maxSalary: 140, employee: 0.20, employer: 0.20 },
  { minSalary: 140, maxSalary: 200, employee: 0.35, employer: 0.35 },
  { minSalary: 200, maxSalary: 300, employee: 0.50, employer: 0.50 },
  { minSalary: 300, maxSalary: 400, employee: 0.70, employer: 0.70 },
  { minSalary: 400, maxSalary: 500, employee: 0.90, employer: 0.90 },
  { minSalary: 500, maxSalary: 600, employee: 1.10, employer: 1.10 },
  { minSalary: 600, maxSalary: 700, employee: 1.30, employer: 1.30 },
  { minSalary: 700, maxSalary: 800, employee: 1.50, employer: 1.50 },
  { minSalary: 800, maxSalary: 900, employee: 1.70, employer: 1.70 },
  { minSalary: 900, maxSalary: 1000, employee: 1.90, employer: 1.90 },
  { minSalary: 1000, maxSalary: 1100, employee: 2.10, employer: 2.10 },
  { minSalary: 1100, maxSalary: 1200, employee: 2.30, employer: 2.30 },
  { minSalary: 1200, maxSalary: 1300, employee: 2.50, employer: 2.50 },
  { minSalary: 1300, maxSalary: 1400, employee: 2.70, employer: 2.70 },
  { minSalary: 1400, maxSalary: 1500, employee: 2.90, employer: 2.90 },
  { minSalary: 1500, maxSalary: 1600, employee: 3.10, employer: 3.10 },
  { minSalary: 1600, maxSalary: 1700, employee: 3.30, employer: 3.30 },
  { minSalary: 1700, maxSalary: 1800, employee: 3.50, employer: 3.50 },
  { minSalary: 1800, maxSalary: 1900, employee: 3.70, employer: 3.70 },
  { minSalary: 1900, maxSalary: 2000, employee: 3.90, employer: 3.90 },
  { minSalary: 2000, maxSalary: 2100, employee: 4.10, employer: 4.10 },
  { minSalary: 2100, maxSalary: 2200, employee: 4.30, employer: 4.30 },
  { minSalary: 2200, maxSalary: 2300, employee: 4.50, employer: 4.50 },
  { minSalary: 2300, maxSalary: 2400, employee: 4.70, employer: 4.70 },
  { minSalary: 2400, maxSalary: 2500, employee: 4.90, employer: 4.90 },
  { minSalary: 2500, maxSalary: 2600, employee: 5.10, employer: 5.10 },
  { minSalary: 2600, maxSalary: 2700, employee: 5.30, employer: 5.30 },
  { minSalary: 2700, maxSalary: 2800, employee: 5.50, employer: 5.50 },
  { minSalary: 2800, maxSalary: 2900, employee: 5.70, employer: 5.70 },
  { minSalary: 2900, maxSalary: 3000, employee: 5.90, employer: 5.90 },
  { minSalary: 3000, maxSalary: 3100, employee: 6.10, employer: 6.10 },
  { minSalary: 3100, maxSalary: 3200, employee: 6.30, employer: 6.30 },
  { minSalary: 3200, maxSalary: 3300, employee: 6.50, employer: 6.50 },
  { minSalary: 3300, maxSalary: 3400, employee: 6.70, employer: 6.70 },
  { minSalary: 3400, maxSalary: 3500, employee: 6.90, employer: 6.90 },
  { minSalary: 3500, maxSalary: 3600, employee: 7.10, employer: 7.10 },
  { minSalary: 3600, maxSalary: 3700, employee: 7.30, employer: 7.30 },
  { minSalary: 3700, maxSalary: 3800, employee: 7.50, employer: 7.50 },
  { minSalary: 3800, maxSalary: 3900, employee: 7.70, employer: 7.70 },
  { minSalary: 3900, maxSalary: 4000, employee: 7.90, employer: 7.90 },
  { minSalary: 4000, maxSalary: 4100, employee: 8.10, employer: 8.10 },
  { minSalary: 4100, maxSalary: 4200, employee: 8.30, employer: 8.30 },
  { minSalary: 4200, maxSalary: 4300, employee: 8.50, employer: 8.50 },
  { minSalary: 4300, maxSalary: 4400, employee: 8.70, employer: 8.70 },
  { minSalary: 4400, maxSalary: 4500, employee: 8.90, employer: 8.90 },
  { minSalary: 4500, maxSalary: 4600, employee: 9.10, employer: 9.10 },
  { minSalary: 4600, maxSalary: 4700, employee: 9.30, employer: 9.30 },
  { minSalary: 4700, maxSalary: 4800, employee: 9.50, employer: 9.50 },
  { minSalary: 4800, maxSalary: 4900, employee: 9.70, employer: 9.70 },
  { minSalary: 4900, maxSalary: 5000, employee: 9.90, employer: 9.90 },
  { minSalary: 5000, maxSalary: 5100, employee: 10.10, employer: 10.10 },
  { minSalary: 5100, maxSalary: 5200, employee: 10.30, employer: 10.30 },
  { minSalary: 5200, maxSalary: 5300, employee: 10.50, employer: 10.50 },
  { minSalary: 5300, maxSalary: 5400, employee: 10.70, employer: 10.70 },
  { minSalary: 5400, maxSalary: 5500, employee: 10.90, employer: 10.90 },
  { minSalary: 5500, maxSalary: 5600, employee: 11.10, employer: 11.10 },
  { minSalary: 5600, maxSalary: 5700, employee: 11.30, employer: 11.30 },
  { minSalary: 5700, maxSalary: 5800, employee: 11.50, employer: 11.50 },
  { minSalary: 5800, maxSalary: 5900, employee: 11.70, employer: 11.70 },
  { minSalary: 5900, maxSalary: Infinity, employee: 11.90, employer: 11.90 }
];

export interface EisResult {
  employee: number;
  employer: number;
  cappedSalary: number;
  wageBracket: string;
}

/**
 * Perform Table Lookup for EIS (SIP) Contribution
 */
export function calculateEisByTable(salary: number): EisResult {
  if (salary <= 0) {
    return {
      employee: 0,
      employer: 0,
      cappedSalary: 0,
      wageBracket: 'RM 0'
    };
  }

  const cappedSalary = Math.min(salary, 6000);

  const bracket = EIS_RATES_TABLE.find(b => cappedSalary > b.minSalary && cappedSalary <= b.maxSalary)
    || EIS_RATES_TABLE[EIS_RATES_TABLE.length - 1];

  const wageBracket = bracket.maxSalary === Infinity 
    ? 'Above RM 5,900' 
    : `> RM ${bracket.minSalary.toLocaleString()} to RM ${bracket.maxSalary.toLocaleString()}`;

  return {
    employee: bracket.employee,
    employer: bracket.employer,
    cappedSalary,
    wageBracket
  };
}
