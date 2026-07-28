/**
 * SOCSO / PERKESO Statutory Contribution Rules & Schedules (Act 4 - Employees' Social Security Act 1969)
 * Official updated wage bands up to the RM 6,000 salary ceiling.
 */

export interface SocsoBracket {
  minSalary: number; // Excluded (greater than minSalary)
  maxSalary: number; // Included (up to maxSalary)
  employee: number; // Employee share (RM) for Category 1
  employerCat1: number; // Employer share (RM) for Category 1 (Employment Injury & Invalidity)
  employerCat2: number; // Employer share (RM) for Category 2 (Employment Injury Scheme only - Age 60+)
}

/**
 * Official PERKESO Schedule (Jadual Caruman PERKESO)
 */
export const SOCSO_RATES_TABLE: SocsoBracket[] = [
  { minSalary: 0, maxSalary: 30, employee: 0.10, employerCat1: 0.40, employerCat2: 0.30 },
  { minSalary: 30, maxSalary: 50, employee: 0.20, employerCat1: 0.70, employerCat2: 0.50 },
  { minSalary: 50, maxSalary: 70, employee: 0.30, employerCat1: 1.10, employerCat2: 0.80 },
  { minSalary: 70, maxSalary: 100, employee: 0.40, employerCat1: 1.50, employerCat2: 1.10 },
  { minSalary: 100, maxSalary: 140, employee: 0.60, employerCat1: 2.10, employerCat2: 1.50 },
  { minSalary: 140, maxSalary: 200, employee: 0.85, employerCat1: 2.95, employerCat2: 2.10 },
  { minSalary: 200, maxSalary: 300, employee: 1.25, employerCat1: 4.35, employerCat2: 3.10 },
  { minSalary: 300, maxSalary: 400, employee: 1.75, employerCat1: 6.15, employerCat2: 4.40 },
  { minSalary: 400, maxSalary: 500, employee: 2.25, employerCat1: 7.85, employerCat2: 5.60 },
  { minSalary: 500, maxSalary: 600, employee: 2.75, employerCat1: 9.65, employerCat2: 6.90 },
  { minSalary: 600, maxSalary: 700, employee: 3.25, employerCat1: 11.45, employerCat2: 8.20 },
  { minSalary: 700, maxSalary: 800, employee: 3.75, employerCat1: 13.15, employerCat2: 9.40 },
  { minSalary: 800, maxSalary: 900, employee: 4.25, employerCat1: 14.95, employerCat2: 10.70 },
  { minSalary: 900, maxSalary: 1000, employee: 4.75, employerCat1: 16.75, employerCat2: 12.00 },
  { minSalary: 1000, maxSalary: 1100, employee: 5.25, employerCat1: 18.45, employerCat2: 13.20 },
  { minSalary: 1100, maxSalary: 1200, employee: 5.75, employerCat1: 20.25, employerCat2: 14.50 },
  { minSalary: 1200, maxSalary: 1300, employee: 6.25, employerCat1: 22.05, employerCat2: 15.80 },
  { minSalary: 1300, maxSalary: 1400, employee: 6.75, employerCat1: 23.75, employerCat2: 17.00 },
  { minSalary: 1400, maxSalary: 1500, employee: 7.25, employerCat1: 25.55, employerCat2: 18.30 },
  { minSalary: 1500, maxSalary: 1600, employee: 7.75, employerCat1: 27.35, employerCat2: 19.60 },
  { minSalary: 1600, maxSalary: 1700, employee: 8.25, employerCat1: 29.15, employerCat2: 20.90 },
  { minSalary: 1700, maxSalary: 1800, employee: 8.75, employerCat1: 30.85, employerCat2: 22.10 },
  { minSalary: 1800, maxSalary: 1900, employee: 9.25, employerCat1: 32.65, employerCat2: 23.40 },
  { minSalary: 1900, maxSalary: 2000, employee: 9.75, employerCat1: 34.45, employerCat2: 24.70 },
  { minSalary: 2000, maxSalary: 2100, employee: 10.25, employerCat1: 36.15, employerCat2: 25.90 },
  { minSalary: 2100, maxSalary: 2200, employee: 10.75, employerCat1: 37.95, employerCat2: 27.20 },
  { minSalary: 2200, maxSalary: 2300, employee: 11.25, employerCat1: 39.75, employerCat2: 28.50 },
  { minSalary: 2300, maxSalary: 2400, employee: 11.75, employerCat1: 41.45, employerCat2: 29.70 },
  { minSalary: 2400, maxSalary: 2500, employee: 12.25, employerCat1: 43.25, employerCat2: 31.00 },
  { minSalary: 2500, maxSalary: 2600, employee: 12.75, employerCat1: 45.05, employerCat2: 32.30 },
  { minSalary: 2600, maxSalary: 2700, employee: 13.25, employerCat1: 46.75, employerCat2: 33.50 },
  { minSalary: 2700, maxSalary: 2800, employee: 13.75, employerCat1: 48.55, employerCat2: 34.80 },
  { minSalary: 2800, maxSalary: 2900, employee: 14.25, employerCat1: 50.35, employerCat2: 36.10 },
  { minSalary: 2900, maxSalary: 3000, employee: 14.75, employerCat1: 52.05, employerCat2: 37.30 },
  { minSalary: 3000, maxSalary: 3100, employee: 15.25, employerCat1: 53.85, employerCat2: 38.60 },
  { minSalary: 3100, maxSalary: 3200, employee: 15.75, employerCat1: 55.65, employerCat2: 39.90 },
  { minSalary: 3200, maxSalary: 3300, employee: 16.25, employerCat1: 57.35, employerCat2: 41.10 },
  { minSalary: 3300, maxSalary: 3400, employee: 16.75, employerCat1: 59.15, employerCat2: 42.40 },
  { minSalary: 3400, maxSalary: 3500, employee: 17.25, employerCat1: 60.95, employerCat2: 43.70 },
  { minSalary: 3500, maxSalary: 3600, employee: 17.75, employerCat1: 62.65, employerCat2: 44.90 },
  { minSalary: 3600, maxSalary: 3700, employee: 18.25, employerCat1: 64.45, employerCat2: 46.20 },
  { minSalary: 3700, maxSalary: 3800, employee: 18.75, employerCat1: 66.25, employerCat2: 47.50 },
  { minSalary: 3800, maxSalary: 3900, employee: 19.25, employerCat1: 67.95, employerCat2: 48.70 },
  { minSalary: 3900, maxSalary: 4000, employee: 19.75, employerCat1: 69.75, employerCat2: 50.00 },
  { minSalary: 4000, maxSalary: 4100, employee: 20.25, employerCat1: 71.55, employerCat2: 51.30 },
  { minSalary: 4100, maxSalary: 4200, employee: 20.75, employerCat1: 73.25, employerCat2: 52.50 },
  { minSalary: 4200, maxSalary: 4300, employee: 21.25, employerCat1: 75.05, employerCat2: 53.80 },
  { minSalary: 4300, maxSalary: 4400, employee: 21.75, employerCat1: 76.85, employerCat2: 55.10 },
  { minSalary: 4400, maxSalary: 4500, employee: 22.25, employerCat1: 78.55, employerCat2: 56.30 },
  { minSalary: 4500, maxSalary: 4600, employee: 22.75, employerCat1: 80.35, employerCat2: 57.60 },
  { minSalary: 4600, maxSalary: 4700, employee: 23.25, employerCat1: 82.15, employerCat2: 58.90 },
  { minSalary: 4700, maxSalary: 4800, employee: 23.75, employerCat1: 83.85, employerCat2: 60.10 },
  { minSalary: 4800, maxSalary: 4900, employee: 24.25, employerCat1: 85.65, employerCat2: 61.40 },
  { minSalary: 4900, maxSalary: 5000, employee: 24.75, employerCat1: 87.45, employerCat2: 62.70 },
  { minSalary: 5000, maxSalary: 5100, employee: 25.25, employerCat1: 89.15, employerCat2: 63.90 },
  { minSalary: 5100, maxSalary: 5200, employee: 25.75, employerCat1: 90.95, employerCat2: 65.20 },
  { minSalary: 5200, maxSalary: 5300, employee: 26.25, employerCat1: 92.75, employerCat2: 66.50 },
  { minSalary: 5300, maxSalary: 5400, employee: 26.75, employerCat1: 94.45, employerCat2: 67.70 },
  { minSalary: 5400, maxSalary: 5500, employee: 27.25, employerCat1: 96.25, employerCat2: 69.00 },
  { minSalary: 5500, maxSalary: 5600, employee: 27.75, employerCat1: 98.05, employerCat2: 70.30 },
  { minSalary: 5600, maxSalary: 5700, employee: 28.25, employerCat1: 99.75, employerCat2: 71.50 },
  { minSalary: 5700, maxSalary: 5800, employee: 28.75, employerCat1: 101.55, employerCat2: 72.80 },
  { minSalary: 5800, maxSalary: 5900, employee: 29.25, employerCat1: 103.35, employerCat2: 74.10 },
  { minSalary: 5900, maxSalary: Infinity, employee: 29.75, employerCat1: 104.15, employerCat2: 74.35 }
];

export interface SocsoResult {
  employee: number;
  employer: number;
  cappedSalary: number;
  wageBracket: string;
  category: 1 | 2;
}

/**
 * Perform Table Lookup for SOCSO (PERKESO) Contribution
 */
export function calculateSocsoByTable(salary: number, preferredCategory: 1 | 2 = 1, age?: number): SocsoResult {
  if (salary <= 0) {
    return {
      employee: 0,
      employer: 0,
      cappedSalary: 0,
      wageBracket: 'RM 0',
      category: preferredCategory
    };
  }

  // Employees 60+ fall under Category 2 (Employment Injury Scheme only - employee pays RM 0)
  const category: 1 | 2 = (age !== undefined && age >= 60) ? 2 : preferredCategory;
  const cappedSalary = Math.min(salary, 6000);

  // Find statutory bracket
  const bracket = SOCSO_RATES_TABLE.find(b => cappedSalary > b.minSalary && cappedSalary <= b.maxSalary) 
    || SOCSO_RATES_TABLE[SOCSO_RATES_TABLE.length - 1];

  const employee = category === 2 ? 0 : bracket.employee;
  const employer = category === 2 ? bracket.employerCat2 : bracket.employerCat1;
  const wageBracket = bracket.maxSalary === Infinity 
    ? 'Above RM 5,900' 
    : `> RM ${bracket.minSalary.toLocaleString()} to RM ${bracket.maxSalary.toLocaleString()}`;

  return {
    employee,
    employer,
    cappedSalary,
    wageBracket,
    category
  };
}
