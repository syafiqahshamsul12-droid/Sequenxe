import { CalculatorMetadata } from '../types';

export const CALCULATORS: CalculatorMetadata[] = [
  // 1. Salary & Tax
  {
    id: 'salary-calculator',
    title: 'Salary Calculator Malaysia',
    shortDescription: 'Estimate your monthly take-home salary after EPF, SOCSO, EIS, and PCB deductions.',
    description: 'Calculate your monthly salary breakdown based on Malaysian payroll rules. See your gross salary, EPF, SOCSO, EIS, PCB deductions, annual income tax estimate, and net take-home pay in one place.',
    category: 'salary',
    estimatedTime: '2 mins',
    trending: true,
    popular: true,
    iconName: 'Percent'
  },,
  {
    id: 'pcb-calculator',
    title: 'PCB Calculator Malaysia',
    shortDescription: 'Estimate your monthly PCB (Potongan Cukai Berjadual) based on LHDN guidelines.',
    description: 'Calculate your monthly PCB deduction using the latest LHDN guidelines. Include your salary, EPF contribution, tax reliefs, marital status, and number of children for a more accurate estimate.',
    category: 'salary',
    estimatedTime: '1 min',
    trending: true,
    popular: true,
    iconName: 'Percent'
  },
  {
    id: 'income-tax-calculator',
    title: 'Income Tax Calculator Malaysia',
    shortDescription: 'Estimate your annual income tax based on chargeable income and tax reliefs.',
    description: 'Estimate your annual Malaysian income tax by entering your employment income and eligible tax reliefs. The calculator helps you understand your chargeable income and expected tax payable.',
    category: 'salary',
    estimatedTime: '2 mins',
    trending: true,
    popular: true,
    iconName: 'Percent'
  },
  {
    id: 'epf-calculator',
    title: 'EPF Calculator Malaysia',
    shortDescription: 'Calculate monthly employee and employer EPF (KWSP) contributions.',
    description: 'Calculate monthly EPF (KWSP) contributions for both employees and employers based on current contribution rates in Malaysia.',
    category: 'salary',
    estimatedTime: '1 min',
    trending: false,
    popular: true,
    iconName: 'TrendingUp'
  },
  {
    id: 'socso-calculator',
    title: 'SOCSO Calculator',
    shortDescription: 'Calculate SOCSO (PERKESO) contributions based on your monthly salary.',
    description: 'Estimate employee and employer SOCSO contributions using the latest PERKESO contribution table.',
    category: 'salary',
    estimatedTime: '1 min',
    trending: false,
    popular: false,
    iconName: 'Percent'
  },
  {
    id: 'eis-calculator',
    title: 'EIS Calculator',
    shortDescription: 'Calculate Employment Insurance System (EIS) contributions.',
    description: 'Estimate monthly Employment Insurance System (EIS) contributions for employees and employers according to Malaysia contribution schedule.',
    category: 'salary',
    estimatedTime: '1 min',
    trending: false,
    popular: false,
    iconName: 'Percent'
  },

  // 2. Home & Property
  {
    id: 'home-loan-calculator',
    title: 'Home Loan Calculator Malaysia',
    shortDescription: 'Estimate monthly home loan repayments and total borrowing costs.',
    description: 'Calculate your monthly home loan instalment, total interest paid, and repayment schedule based on the loan amount, interest rate, and repayment period.',
    category: 'property',
    estimatedTime: '2 mins',
    trending: true,
    popular: true,
    iconName: 'Home'
  },

  // 3. Savings & Retirement
  {
    id: 'epf-retirement-calculator',
    title: 'EPF Retirement Calculator',
    shortDescription: 'Estimate how much your EPF savings could grow by retirement.',
    description: 'Project your future EPF savings using your salary, contribution rate, annual salary growth, and expected dividend rate. View the estimated balance across EPF Account 1, Account 2, and Account 3.',
    category: 'retirement',
    estimatedTime: '3 mins',
    trending: true,
    popular: true,
    iconName: 'TrendingUp'
  }
];

export const COMING_SOON_TOOLS = [
  { id: 'stamp-duty-calculator', title: 'Stamp Duty Calculator', category: 'property', description: 'Malaysian SPA & Loan agreement stamp duty fees.' },
  { id: 'loan-eligibility-calculator', title: 'Loan Eligibility & DSR Calculator', category: 'property', description: 'Bank borrowing capacity & Debt Service Ratio.' },
  { id: 'personal-loan-calculator', title: 'Personal Loan Calculator', category: 'loans', description: 'Monthly payments and Effective Interest Rates (EIR).' },
  { id: 'bonus-calculator', title: 'Bonus Calculator', category: 'salary', description: 'Net bonus after PCB & EPF withholding.' },
  { id: 'overtime-calculator', title: 'Overtime Calculator', category: 'salary', description: 'Malaysian Employment Act OT rate calculator.' },
  { id: 'car-loan-calculator', title: 'Car Loan Calculator', category: 'loans', description: 'Vehicle hire purchase loan & interest calculator.' }
];

export const CATEGORIES = [
  {
    id: 'salary',
    title: '💼 Salary & Tax',
    description: 'Salary, income tax, EPF, SOCSO, EIS, and PCB calculators.',
    count: 6
  },
  {
    id: 'property',
    title: '🏠 Home & Property',
    description: 'Home loan and property-related calculators.',
    count: 1
  },
  {
    id: 'retirement',
    title: '💰 Savings & Retirement',
    description: 'Plan your retirement with EPF savings projections.',
    count: 1
  }
];

export const TRENDING_TOOLS_IDS = ['salary-calculator', 'pcb-calculator', 'home-loan-calculator', 'epf-retirement-calculator'];

export const FEATURED_GUIDES = [
  {
    id: 'pcb-guide',
    slug: 'understanding-pcb-malaysia-guide',
    title: 'Understanding PCB (Monthly Tax Deduction) & How to Lower It Legally',
    excerpt: 'Learn how PCB is calculated, why the amount changes from month to month, and how tax reliefs can reduce your monthly deduction.',    category: 'Salary & Tax',
    readTime: '6 mins'
  },
  {
    id: 'epf-3-account-guide',
    slug: 'epf-kwsp-account-system-dividends-guide',
    title: 'How EPF (KWSP) Works: 3-Account System, Dividend Compounding & Voluntary Savings',
    excerpt: 'Understand how the EPF 3-account system works, how dividends are calculated, and when voluntary contributions may be useful.',    category: 'Savings & Retirement',
    readTime: '7 mins'
  },
  {
    id: 'home-loan-stamp-duty-guide',
    slug: 'first-time-homebuyer-malaysia-guide',
    title: 'First-Time Homebuyer Guide in Malaysia: Downpayment, Loan Approval & Hidden Costs',
    excerpt: 'Everything first-time homebuyers should know, including down payments, loan approval, legal fees, stamp duty, and other buying costs.',    category: 'Home & Property',
    readTime: '8 mins'
  }
];
