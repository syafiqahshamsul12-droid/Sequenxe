# Sequenxe Core Architecture Developer Guide

Welcome to the **Sequence** developer documentation! This guide defines our enterprise-grade architecture designed by Principal Software Engineers to support scaling from 4 to 500+ financial calculators across multiple regions (Malaysia, Singapore, Australia, UK, US, Canada) with minimal boilerplate, robust performance, and absolute separation of concerns.

---

## 1. Directory Structure

To support hundreds of calculators without clutter or organization fatigue, the codebase is structured strictly by functional boundaries:

```text
/src
  ├── /components
  │     ├── /calculators           # Highly interactive calculations
  │     │     ├── /shared          # Shared UI widgets (SummaryCard, InsightCards, Hero)
  │     │     │     └── SEOManager.tsx # Programmatic SEO & JSON-LD schema injector
  │     │     ├── SalaryCalculator.tsx
  │     │     ├── EpfCalculator.tsx
  │     │     ├── HomeLoanCalculator.tsx
  │     │     └── PersonalLoanCalculator.tsx
  │     ├── Header.tsx             # Universal Header Navigation
  │     ├── Footer.tsx             # Universal Footer & Disclaimers
  │     └── Homepage.tsx           # Dashboard / Tools Explorer
  ├── /data
  │     └── calculators.ts         # Static metadata, categories, and educational guides
  ├── /utils
  │     └── formulas.ts            # Pure, isolated deterministic financial engines
  ├── types.ts                     # Strict TypeScript interfaces and configurations
  └── App.tsx                      # View Router and responsive frame layout
```

---



## 2. Shared Financial Formula Engine (`/src/utils/formulas.ts`)



### Pure Calculation Philosophy

Calculation logic is **strictly forbidden** inside React components. All formulas must be pure functions that take inputs, apply deterministic math (e.g., compound interest, progressive tax brackets), and return strict outputs.

#### Progressive Tier Engine Example (Tax & Stamp Duty)

```typescript
/**
 * Generic progressive rate engine used for Personal Income Tax & Property Stamp Duty.
 * Avoids hardcoding brackets directly into components.
 */
export function calculateProgressiveTier(amount: number, brackets: Array<{ upTo: number; rate: number; baseCharge?: number }>): number {
  let chargeable = amount;
  let accumulated = 0;
  
  for (let i = 0; i < brackets.length; i++) {
    const prevLimit = i === 0 ? 0 : brackets[i - 1].upTo;
    const currentLimit = brackets[i].upTo;
    const rate = brackets[i].rate;
    
    if (chargeable > currentLimit) {
      accumulated += (currentLimit - prevLimit) * rate;
    } else {
      accumulated += (chargeable - prevLimit) * rate;
      break;
    }
  }
  return accumulated;
}
```

---



## 3. Reusable SEO & Rich Schemas (`SEOManager.tsx`)

Our custom `<SEOManager />` component is mounted at the top of every calculator view. It dynamically manages document metadata and auto-injects **JSON-LD rich schemas** into the document header on page transition:

- **BreadcrumbList Schema**: Links the visitor's path cleanly.
- **FAQPage Schema**: Converts in-page FAQs into search engine rich snippets.
- **SoftwareApplication Schema**: Signals a free financial tool to search engines.
- **Organization Schema**: Establishes branding authority.



### Usage in Components

```tsx
import SEOManager from './shared/SEOManager';

// Inside Calculator component
return (
  <div className="space-y-8 animate-fade-in">
    <SEOManager 
      title="EPF (KWSP) Retirement Planner"
      description="Project your future EPF (KWSP) savings balance based on compound dividends."
      canonicalUrl="https://ringgitmind.com/my/epf-calculator"
      calculatorId="epf-retirement"
      faqs={faqs}
      breadcrumbs={[
        { name: 'Home', url: 'https://ringgitmind.com/my' },
        { name: 'EPF Calculator', url: 'https://ringgitmind.com/my/epf-calculator' }
      ]}
    />
    {/* Page Layout */}
  </div>
);
```

---



## 4. Multi-Region Extension Guide (`Country Architecture`)

The platform is designed to scale internationally. To add a new country (e.g., Singapore `SG` or Australia `AU`), implement a new **Country Rule** file under `/src/config/countries/` with the following contract:

```typescript
export interface RegionConfig {
  countryCode: string;
  currencySymbol: string;
  dateFormat: string;
  locale: string;
  statutoryRates: {
    baseTaxRules: Array<any>;
    mandatoryContributionRate: number;
  };
  terminology: {
    retirementFundName: string; // "EPF" in Malaysia, "CPF" in Singapore, "Super" in Australia
    withholdingTaxName: string; // "PCB" in Malaysia, "PAYE" in Australia, "IRAS" in Singapore
  };
}
```

---



## 5. Adding a New Calculator in 3 Steps

To add the **5th Calculator** (e.g. Car Loan Calculator):

1. **Define Types & Formulas**:
  - Add `CarLoanInputs` and `CarLoanOutputs` interfaces inside `/src/types.ts`.
  - Write a pure function `calculateCarLoan(inputs: CarLoanInputs): CarLoanOutputs` in `/src/utils/formulas.ts`.
2. **Add Metadata**:
  - Register the calculator description, categories, and meta tag descriptions in `/src/data/calculators.ts`.
3. **Build UI Component**:
  - Create `/src/components/calculators/CarLoanCalculator.tsx`.
  - Import and use shared UI elements: `<Breadcrumb>`, `<CalculatorHero>`, `<SEOManager>`, `<SummaryCard>`, `<ExportButtons>`, `<InsightCards>`, and the unified `<FAQSection>`.
  - Wire the component up inside `App.tsx`'s view manager state.

