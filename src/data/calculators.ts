import { CalculatorMetadata } from '../types';

export const CALCULATORS: CalculatorMetadata[] = [
  // 1. Salary & Tax
  {
    id: 'salary-calculator',
    title: 'Salary Calculator Malaysia ⭐',
    shortDescription: 'Estimate complete monthly take-home salary after EPF, SOCSO, EIS, and PCB (Monthly Tax Deduction).',
    description: 'The flagship Malaysian payroll calculator. Computes gross monthly income, statutory EPF, SOCSO, EIS deductions, LHDN PCB tax withholding, annual tax payable, net take-home pay, and visualizes deductions with interactive pie charts and breakdown schedules.',
    category: 'salary',
    estimatedTime: '2 mins',
    trending: true,
    popular: true,
    iconName: 'Percent'
  },
  {
    id: 'pcb-calculator',
    title: 'PCB Calculator Malaysia',
    shortDescription: 'Calculate Potongan Cukai Berjadual (PCB) monthly tax deductions according to LHDN rules.',
    description: 'A dedicated Monthly Tax Deduction (PCB) estimator for Malaysian taxpayers. Computes your precise monthly LHDN tax withholding based on marital status, number of children, EPF deductions, and declared tax reliefs.',
    category: 'salary',
    estimatedTime: '1 min',
    trending: true,
    popular: true,
    iconName: 'Percent'
  },
  {
    id: 'income-tax-calculator',
    title: 'Income Tax Calculator Malaysia',
    shortDescription: 'Estimate annual income tax, chargeable income, and claimable tax reliefs for YA 2026.',
    description: 'Calculate your annual Malaysian personal income tax payable. Inputs lifestyle, medical, parental, educational, and child tax reliefs to find your exact taxable bracket and net tax liability.',
    category: 'salary',
    estimatedTime: '2 mins',
    trending: true,
    popular: true,
    iconName: 'Percent'
  },
  {
    id: 'epf-calculator',
    title: 'EPF Calculator Malaysia',
    shortDescription: 'Calculate monthly KWSP employee (11%/9%) and employer (13%/12%) statutory contributions.',
    description: 'Determine exact monthly employee and employer EPF (KWSP) statutory contributions according to Malaysian labor law salary tiers and contribution rate settings.',
    category: 'salary',
    estimatedTime: '1 min',
    trending: false,
    popular: true,
    iconName: 'TrendingUp'
  },
  {
    id: 'socso-calculator',
    title: 'SOCSO Calculator',
    shortDescription: 'Lookup employee (~0.5%) and employer (~1.75%) PERKESO contributions up to RM6,000 ceiling.',
    description: 'Check official statutory SOCSO (PERKESO) contribution rates for Employment Injury and Invalidity schemes based on the RM6,000 monthly salary cap.',
    category: 'salary',
    estimatedTime: '1 min',
    trending: false,
    popular: false,
    iconName: 'Percent'
  },
  {
    id: 'eis-calculator',
    title: 'EIS Calculator',
    shortDescription: 'Calculate Employment Insurance System 0.2% employee and employer contributions.',
    description: 'Compute statutory Employment Insurance System (Sistem Insurans Pekerjaan - SIP) contributions capped at RM11.90/month for both employee and employer.',
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
    shortDescription: 'Calculate monthly mortgage payments, interest rates, tenure, and full amortization schedules.',
    description: 'Estimate your monthly home loan installments, total interest charges, and total repayment cost in Malaysia. Features full yearly amortization tables and customizable interest rates.',
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
    shortDescription: 'Project future KWSP balance at age 55/60 and visualize Akaun 1, 2, and 3 splits.',
    description: 'Project your future EPF (KWSP) savings balance based on salary growth, dividend compounding, and annual contributions. Divides retirement balance into Akaun Persaraan (75%), Akaun Sejahtera (15%), and Akaun Fleksibel (10%).',
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
    description: 'Calculate net income, PCB, income tax, EPF, SOCSO, and EIS.',
    count: 6
  },
  {
    id: 'property',
    title: '🏠 Home & Property',
    description: 'Calculate monthly home loan installments, interest, and amortization.',
    count: 1
  },
  {
    id: 'retirement',
    title: '💰 Savings & Retirement',
    description: 'Plan your retirement with KWSP projections and Akaun 1, 2, 3 splits.',
    count: 1
  }
];

export const TRENDING_TOOLS_IDS = ['salary-calculator', 'pcb-calculator', 'home-loan-calculator', 'epf-retirement-calculator'];

export const FEATURED_GUIDES = [
  {
    id: 'pcb-guide',
    slug: 'understanding-pcb-malaysia-guide',
    title: 'Understanding PCB (Monthly Tax Deduction) & How to Lower It Legally',
    excerpt: 'How LHDN calculates your monthly tax withholding, why it fluctuates, and how Borang TP1 helps you keep more cash in your pocket every month.',
    category: 'Salary & Tax',
    readTime: '6 mins'
  },
  {
    id: 'epf-3-account-guide',
    slug: 'epf-kwsp-account-system-dividends-guide',
    title: 'How EPF (KWSP) Works: 3-Account System, Dividend Compounding & Voluntary Savings',
    excerpt: 'Complete breakdown of KWSP: How the 3-Account structure works, how compound dividends grow your money, and voluntary self-contributions.',
    category: 'Savings & Retirement',
    readTime: '7 mins'
  },
  {
    id: 'home-loan-stamp-duty-guide',
    slug: 'first-time-homebuyer-malaysia-guide',
    title: 'First-Time Homebuyer Guide in Malaysia: Downpayment, Loan Approval & Hidden Costs',
    excerpt: 'Navigating mortgages in Malaysia: Loan-to-value limits, legal fees, valuation costs, stamp duty exemptions, and EPF Account 2 withdrawals.',
    category: 'Home & Property',
    readTime: '8 mins'
  }
];
