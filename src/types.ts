export type CategoryId = 'property' | 'salary' | 'retirement' | 'loans' | 'investment';

export interface CalculatorMetadata {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  category: CategoryId;
  estimatedTime: string;
  trending: boolean;
  popular: boolean;
  iconName: string;
}

// Salary Calculator types
export interface SalaryInputs {
  grossSalary: number;
  epfRate: number; // 9%, 11%, or custom
  employerEpfOverrideRate?: number; // Optional override e.g. 15%, 17%, 19%
  isBumiputera: boolean;
  reliefs: {
    individual: number; // Max RM 9,000
    lifestyle: number; // Max RM 2,500 (books, gym, internet)
    medicalSelf: number; // Max RM 10,000 (serious illness, full checkup etc)
    parentMedical: number; // Max RM 8,000
    educationSelf: number; // Max RM 7,000
    childOrdinary: number; // RM 2,000 per child (under 18)
    childTertiary: number; // RM 8,000 per child (in higher edu)
    disabledIndividual: number; // Max RM 6,000
    spousesRelief: number; // Max RM 4,000
    lifeInsurance: number; // Max RM 3,000
    sspnSavings: number; // Net savings in SSPN (up to RM 8,000)
  };
}

export interface SalaryOutputs {
  grossMonthly: number;
  grossAnnual: number;
  epfEmployee: number;
  epfEmployer: number;
  socso: number;
  socsoEmployee: number;
  socsoEmployer: number;
  eis: number;
  eisEmployee: number;
  eisEmployer: number;
  monthlyPcb: number;
  annualPcb: number;
  totalDeductions: number;
  totalEmployeeDeductions: number;
  totalEmployerContribution: number;
  totalEmploymentCost: number;
  netSalary: number;
  taxableIncome: number;
  totalReliefsClaimed: number;
  applicableTaxRate: number;
  effectiveTaxRate: number;
  totalAnnualTaxPayable: number;
  annualGross: number;
  annualNet: number;
  annualEmployeeDeductions: number;
  annualEmployerContributions: number;
}

// PCB Calculator types
export interface PcbInputs {
  monthlySalary: number;
  bonus: number;
  epfRate: number;
  maritalStatus: 'single' | 'married_working_spouse' | 'married_non_working_spouse';
  isTaxResident: boolean;
  childrenCount: number;
  monthlyZakat: number;
  additionalReliefs: number;
}

export interface PcbOutputs {
  monthlySalary: number;
  bonus: number;
  monthlyPcb: number;
  annualPcb: number;
  epfEmployee: number;
  socsoEmployee: number;
  eisEmployee: number;
  totalDeductions: number;
  netSalary: number;
  annualGross: number;
  annualNet: number;
  annualEpf: number;
  taxableIncome: number;
  effectiveTaxRate: number;
  applicableTaxRate: number;
}

// Income Tax Calculator types
export interface IncomeTaxInputs {
  monthlySalary: number;
  annualBonus: number;
  epfRate: number;
  maritalStatus: 'single' | 'married_working_spouse' | 'married_non_working_spouse';
  isTaxResident: boolean;
  childrenCount: number;
  childrenTertiaryCount: number;
  zakat: number;
  reliefs: {
    lifestyle: number;
    lifeInsurance: number;
    medicalSelf: number;
    parentMedical: number;
    educationSelf: number;
    sspnSavings: number;
  };
}

export interface TaxBracketTier {
  rangeLabel: string;
  ratePercent: number;
  taxableInTier: number;
  taxInTier: number;
}

export interface IncomeTaxOutputs {
  annualGross: number;
  totalReliefsClaimed: number;
  chargeableIncome: number;
  annualTaxPayable: number;
  effectiveTaxRate: number;
  applicableTaxRate: number;
  monthlyPcbEquivalent: number;
  taxSavingsFromReliefs: number;
  bracketBreakdown: TaxBracketTier[];
}

// Home Loan Calculator types
export interface HomeLoanInputs {
  propertyPrice: number;
  downPayment: number;
  downPaymentPercent: number;
  interestRate: number;
  tenure: number; // years
  isFirstTimeBuyer: boolean;
}

export interface HomeLoanOutputs {
  loanAmount: number;
  monthlyInstallment: number;
  totalInterest: number;
  totalRepayment: number;
  spaStampDuty: number;
  loanStampDuty: number;
  totalInitialCost: number; // downpayment + stamp duties
  amortizationSchedule: {
    year: number;
    interestPaid: number;
    principalPaid: number;
    remainingBalance: number;
    cumulativeInterest: number;
  }[];
}

// EPF Retirement Planner types
export interface EpfInputs {
  currentAge: number;
  retirementAge: number;
  currentBalance: number;
  salary: number;
  salaryIncrement: number; // % annual growth
  employeeRate: number; // % (default 11%)
  employerRate: number; // % (default 13% for <=RM5k, 12% for >RM5k)
  dividendRate: number; // % expected annual dividend (e.g. 5.5%)
}

export interface EpfOutputs {
  projectedBalance: number;
  totalContributions: number;
  totalDividends: number;
  monthlyPayoutRetired: number; // based on 20-year payout
  adequacyStatus: 'adequate' | 'moderate' | 'insufficient';
  accountBreakdown: {
    akaunPersaraan: number; // 75%
    akaunSejahtera: number; // 15%
    akaunFleksibel: number; // 10%
  };
  yearlyGrowth: {
    year: number;
    age: number;
    employeeContrib: number;
    employerContrib: number;
    dividends: number;
    balance: number;
  }[];
}

// Personal Loan types
export interface PersonalLoanInputs {
  loanAmount: number;
  interestRate: number; // Flat interest rate
  tenure: number; // years
}

export interface PersonalLoanOutputs {
  monthlyPayment: number;
  totalInterest: number;
  totalRepayment: number;
  effectiveRate: number; // EIR calculation (Reducing Balance equivalent)
}

// Stamp Duty Calculator types
export interface StampDutyInputs {
  propertyPrice: number;
  loanAmount: number;
  isFirstTimeBuyer: boolean;
}

export interface StampDutyOutputs {
  spaStampDuty: number;
  loanStampDuty: number;
  estimatedLegalFees: number;
  totalDisbursementAndFees: number;
  effectiveDutyRate: number;
}

// Loan Eligibility / DSR Calculator types
export interface LoanEligibilityInputs {
  grossMonthlyIncome: number;
  fixedMonthlyDeductions?: number; // EPF, SOCSO, Tax
  existingMonthlyCommitments?: number; // Car loans, personal loans, credit cards
  existingCommitments?: number; // Alias for existingMonthlyCommitments
  interestRate: number; // e.g. 4.2%
  tenure?: number; // e.g. 35 years
  tenureYears?: number; // Alias for tenure
  maxDsrLimit?: number; // e.g. 70%
  targetPropertyPrice?: number;
}

export interface LoanEligibilityOutputs {
  netMonthlyIncome: number;
  maxAllowableCommitment: number;
  maxNewInstallment: number;
  maxMonthlyInstallment: number;
  maxEstimatedLoanAmount: number;
  maxLoanAmount: number;
  maxPropertyPrice: number;
  currentDsr: number;
  maxAllowedDsr: number;
  status: 'eligible' | 'warning' | 'over_limit';
}

// AI status response
export interface AiStatus {
  enabled: boolean;
  message: string;
}
