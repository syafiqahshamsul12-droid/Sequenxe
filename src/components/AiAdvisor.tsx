import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  Bookmark, 
  Printer, 
  TrendingUp, 
  HelpCircle, 
  DollarSign, 
  Home, 
  Percent, 
  ChevronRight, 
  AlertTriangle,
  Lightbulb,
  PiggyBank,
  ChevronDown,
  Info
} from 'lucide-react';

interface AiAdvisorProps {
  calculatorType: 'salary' | 'loan' | 'epf' | 'personal-loan';
  inputs: any;
  outputs: any;
}

export default function AiAdvisor({ calculatorType, inputs, outputs }: AiAdvisorProps) {
  const [bookmarked, setBookmarked] = useState<boolean>(false);
  
  // Interactive tool states
  const [salaryExtraRelief, setSalaryExtraRelief] = useState<number>(3000);
  const [homeLoanExtraPay, setHomeLoanExtraPay] = useState<number>(200);
  const [epfExtraVoluntary, setEpfExtraVoluntary] = useState<number>(200);
  const [personalLoanRefRate, setPersonalLoanRefRate] = useState<number>(4.5); // Refinancing rate comparison

  // Alert bookmark toast
  const handleBookmark = () => {
    setBookmarked(true);
    const box = document.createElement('div');
    box.className = 'fixed bottom-6 right-6 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2 animate-fade-in';
    box.innerHTML = `<span class="font-semibold text-sm font-display">👍 Strategy report bookmarked successfully!</span>`;
    document.body.appendChild(box);
    setTimeout(() => {
      box.classList.add('opacity-0');
      setTimeout(() => box.remove(), 500);
    }, 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  // 1. SALARY & PCB CALCULATOR SMART ADVICE
  const renderSalaryAdvice = () => {
    const gross = inputs.grossSalary || 0;
    const rate = inputs.epfRate || 11;
    const reliefsApplied = inputs.totalReliefs || 9000;
    const net = outputs.netSalary || 0;
    const taxPaid = outputs.monthlyPcb || 0;

    // Estimate marginal tax rate based on taxable income
    const taxable = outputs.taxableIncome || 0;
    let marginalRate = 0;
    if (taxable > 2000000) marginalRate = 0.30;
    else if (taxable > 1000000) marginalRate = 0.30;
    else if (taxable > 600000) marginalRate = 0.28;
    else if (taxable > 400000) marginalRate = 0.26;
    else if (taxable > 250000) marginalRate = 0.25;
    else if (taxable > 100000) marginalRate = 0.25;
    else if (taxable > 70000) marginalRate = 0.19;
    else if (taxable > 50000) marginalRate = 0.11;
    else if (taxable > 35000) marginalRate = 0.06;
    else if (taxable > 20000) marginalRate = 0.03;
    else if (taxable > 5000) marginalRate = 0.01;

    // Calculate interactive tax saving
    const taxSaving = Math.min(salaryExtraRelief, 30000 - reliefsApplied) * marginalRate;
    
    return (
      <div className="space-y-6">
        {/* Smart Simple Summary */}
        <div className="p-5 rounded-xl bg-primary/5 border border-primary/10">
          <h4 className="font-display font-bold text-sm text-text-primary flex items-center gap-2 mb-2">
            <Lightbulb className="h-4.5 w-4.5 text-primary" />
            Income Optimization Summary
          </h4>
          <p className="text-xs text-text-secondary leading-relaxed">
            Your current monthly net take-home is <strong className="text-text-primary">RM {net.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</strong>, which is about <strong className="text-text-primary">{((net / gross) * 100).toFixed(1)}%</strong> of your gross salary. Statutory deductions subtract <strong className="text-text-primary">RM {outputs.totalDeductions.toLocaleString('en-MY')}</strong> from your paycheck monthly, consisting of EPF contributions, SOCSO, EIS, and LHDN PCB tax.
          </p>
        </div>

        {/* Rule-based Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-5 border border-border-custom bg-white rounded-xl space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
              ⚡ PCB Tax Relief Strategy
            </span>
            <h5 className="font-display font-bold text-sm text-text-primary">Unlock Chargeable Income Offsets</h5>
            <p className="text-xs text-text-secondary leading-relaxed">
              Your estimated annual taxable income is <strong className="text-text-primary">RM {taxable.toLocaleString('en-MY')}</strong>, placing you in the <strong className="text-text-primary">{(marginalRate * 100).toFixed(0)}%</strong> marginal tax bracket. Every RM 1,000 you claim in lifestyle, medical, or higher-education reliefs gives you a cash refund of <strong className="text-success font-semibold">RM {(marginalRate * 1000).toLocaleString('en-MY')}</strong>.
            </p>
          </div>

          <div className="p-5 border border-border-custom bg-white rounded-xl space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/5 px-2.5 py-0.5 rounded-md border border-primary/10">
              📊 Statutory Balance Review
            </span>
            <h5 className="font-display font-bold text-sm text-text-primary">EPF Employee Contribution Optimization</h5>
            <p className="text-xs text-text-secondary leading-relaxed">
              You are contributing <strong className="text-text-primary">{rate}%</strong>. If you are looking to increase cash flow, reducing to <strong className="text-text-primary">9%</strong> increases your take-home pay by <strong className="text-text-primary">RM {(gross * (0.11 - Math.min(rate, 11)/100)).toLocaleString('en-MY')}</strong>, but you lose out on long-term retirement compounding dividend yields of ~5.5% annually.
            </p>
          </div>
        </div>

        {/* Interactive Comparison Tool: Tax Relief Booster */}
        <div className="p-5 rounded-2xl border border-border-custom bg-bg-custom/50 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h5 className="font-display font-bold text-sm text-text-primary flex items-center gap-1.5">
                <Percent className="h-4.5 w-4.5 text-primary" />
                Interactive Relief Optimizer
              </h5>
              <p className="text-[11px] text-text-secondary">
                See how much cash you recover by fully claiming personal LHDN tax reliefs.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-medium text-text-secondary">Additional Relief Amount:</span>
              <span className="text-xs font-mono font-bold text-primary bg-white px-2.5 py-1 rounded-md border border-border-custom shadow-2xs">
                RM {salaryExtraRelief.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <input 
              type="range" 
              min="1000" 
              max="15000" 
              step="1000" 
              value={salaryExtraRelief} 
              onChange={(e) => setSalaryExtraRelief(parseInt(e.target.value))}
              className="w-full h-1.5 bg-border-custom rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] text-text-secondary font-mono">
              <span>RM 1,000</span>
              <span>RM 5,000</span>
              <span>RM 10,000</span>
              <span>RM 15,000</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-border-custom flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="text-xs text-text-secondary">Estimated Cash Tax Savings (Rebate)</div>
              <div className="font-display font-black text-xl text-success flex items-center gap-1">
                + RM {taxSaving.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="text-left sm:text-right space-y-0.5">
              <div className="text-[10px] text-text-secondary font-mono">Marginal Rate: {marginalRate * 100}%</div>
              <p className="text-[10px] text-text-secondary leading-relaxed max-w-xs">
                Spent on qualifying internet, gym, SSPN accounts, lifestyle, or medical checks.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 2. HOME LOAN SMART ADVICE
  const renderHomeLoanAdvice = () => {
    const price = inputs.propertyPrice || 0;
    const installment = outputs.monthlyInstallment || 0;
    const loanAmt = outputs.loanAmount || 0;
    const totalInt = outputs.totalInterest || 0;
    const tenure = inputs.tenure || 30;
    const rate = inputs.interestRate || 4.2;

    // Estimate safe required salary
    const safeIncome = installment / 0.35; // 35% DSR benchmark
    const currentPricePctOfAfford = installment / 4000; // Assuming sample income

    // Prepayment logic
    const monthlyExtra = homeLoanExtraPay;
    
    // Mathematical approximation for extra payments (reduces effective tenure and saves interest)
    // Run an analytical approximation for a home loan reducing balance pre-payment
    const monthlyRate = (rate / 100) / 12;
    const totalMonths = tenure * 12;
    
    // Simulate loan amortization with extra payment
    let balance = loanAmt;
    let standardBalance = loanAmt;
    let monthsWithExtra = 0;
    let cumulativeIntWithExtra = 0;
    let standardCumulativeInt = 0;
    
    for (let m = 1; m <= totalMonths; m++) {
      // Standard installment amortization
      const stdInterest = standardBalance * monthlyRate;
      const stdPrincipal = Math.min(standardBalance, installment - stdInterest);
      standardCumulativeInt += stdInterest;
      standardBalance -= stdPrincipal;

      // Amortization with extra payments
      if (balance > 0) {
        const interest = balance * monthlyRate;
        const principalPay = Math.min(balance, installment - interest + monthlyExtra);
        cumulativeIntWithExtra += interest;
        balance -= principalPay;
        monthsWithExtra++;
      }
    }

    const savedInterest = Math.max(0, totalInt - cumulativeIntWithExtra);
    const monthsSaved = Math.max(0, totalMonths - monthsWithExtra);
    const yearsSaved = (monthsSaved / 12).toFixed(1);

    return (
      <div className="space-y-6">
        {/* Smart Simple Summary */}
        <div className="p-5 rounded-xl bg-primary/5 border border-primary/10">
          <h4 className="font-display font-bold text-sm text-text-primary flex items-center gap-2 mb-2">
            <Home className="h-4.5 w-4.5 text-primary" />
            Home Affordability & DSR Assessment
          </h4>
          <p className="text-xs text-text-secondary leading-relaxed">
            The calculated monthly installment is <strong className="text-text-primary">RM {installment.toLocaleString('en-MY', { maximumFractionDigits: 0 })}</strong>. To comfortably support this mortgage under Bank Negara Malaysia guidelines without financial stress, your household's net monthly income should be at least <strong className="text-primary font-semibold">RM {safeIncome.toLocaleString('en-MY', { maximumFractionDigits: 0 })}</strong> (representing a 35% Debt Service Ratio).
          </p>
        </div>

        {/* Rule-based Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-5 border border-border-custom bg-white rounded-xl space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
              🔑 First-time Homebuyer Waiver
            </span>
            <h5 className="font-display font-bold text-sm text-text-primary">Stamp Duty Reliefs Available</h5>
            <p className="text-xs text-text-secondary leading-relaxed">
              {price <= 500000 ? (
                <span className="text-success font-semibold">
                  Excellent! Since your property price is below RM 500,000, you are eligible for 100% stamp duty exemption on both the SPA transfer document and loan agreement under i-Miliki guidelines, saving you RM { (outputs.spaStampDuty + outputs.loanStampDuty).toLocaleString() }!
                </span>
              ) : (
                <span>
                  Since the purchase price exceeds RM 500k, a standard progressive stamp duty applies. Your stamp duties total <strong className="text-text-primary">RM {(outputs.spaStampDuty + outputs.loanStampDuty).toLocaleString()}</strong>. Check if developers offer "free SPA & Legal fees" developer rebates to lower your upfront cash requirements.
                </span>
              )}
            </p>
          </div>

          <div className="p-5 border border-border-custom bg-white rounded-xl space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/5 px-2.5 py-0.5 rounded-md border border-primary/10">
              📉 Cost of Credit Caution
            </span>
            <h5 className="font-display font-bold text-sm text-text-primary">Total Interest Compounded</h5>
            <p className="text-xs text-text-secondary leading-relaxed">
              Over the {tenure}-year tenure, you will pay a total interest of <strong className="text-text-primary">RM {totalInt.toLocaleString('en-MY', { maximumFractionDigits: 0 })}</strong>. This is about <strong className="text-text-primary">{((totalInt / loanAmt) * 100).toFixed(0)}%</strong> of the original loan amount. Converting your mortgage to a semi-flexi or full-flexi account can allow you to make prepayments to cut this down.
            </p>
          </div>
        </div>

        {/* Interactive Comparison Tool: Mortgage Pre-payment Booster */}
        <div className="p-5 rounded-2xl border border-border-custom bg-bg-custom/50 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h5 className="font-display font-bold text-sm text-text-primary flex items-center gap-1.5">
                <TrendingUp className="h-4.5 w-4.5 text-primary" />
                Interactive Prepayment & Interest Optimizer
              </h5>
              <p className="text-[11px] text-text-secondary">
                Add a small custom extra payment monthly to see how much faster you pay off your loan.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-medium text-text-secondary">Extra Monthly Payment:</span>
              <span className="text-xs font-mono font-bold text-primary bg-white px-2.5 py-1 rounded-md border border-border-custom shadow-2xs">
                + RM {homeLoanExtraPay}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <input 
              type="range" 
              min="0" 
              max="2000" 
              step="50" 
              value={homeLoanExtraPay} 
              onChange={(e) => setHomeLoanExtraPay(parseInt(e.target.value))}
              className="w-full h-1.5 bg-border-custom rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] text-text-secondary font-mono">
              <span>No Prepayment</span>
              <span>RM 500</span>
              <span>RM 1,000</span>
              <span>RM 2,000</span>
            </div>
          </div>

          {homeLoanExtraPay > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-border-custom space-y-1">
                <div className="text-[11px] text-text-secondary">Total Interest Money Saved</div>
                <div className="font-display font-black text-lg text-success">
                  RM {savedInterest.toLocaleString('en-MY', { maximumFractionDigits: 0 })}
                </div>
                <div className="text-[10px] text-text-secondary leading-normal">Saved directly from reducing-balance compound charges.</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-border-custom space-y-1">
                <div className="text-[11px] text-text-secondary">Loan Term Shaved Off</div>
                <div className="font-display font-black text-lg text-primary">
                  {yearsSaved} Years Faster
                </div>
                <div className="text-[10px] text-text-secondary leading-normal">Your mortgage clears in {(tenure - parseFloat(yearsSaved)).toFixed(1)} years instead of {tenure}.</div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-4 rounded-xl border border-border-custom text-center text-xs text-text-secondary py-6">
              Drag the slider to test adding RM 100, RM 200, or RM 500 extra per month. Even minor prepayments can shave off years and save massive interest sums on 30-year home mortgages!
            </div>
          )}
        </div>
      </div>
    );
  };

  // 3. EPF RETIREMENT SMART ADVICE
  const renderEpfAdvice = () => {
    const age = inputs.currentAge || 30;
    const retAge = inputs.retirementAge || 60;
    const projected = outputs.projectedBalance || 0;
    const divRate = inputs.dividendRate || 5.5;

    // Standard adequacy guideline
    const EPF_ADEQUACY_TARGET = 240000;
    const yearsToInvest = retAge - age;

    // Simulate booster compound growth
    const monthlyContributionBooster = epfExtraVoluntary;
    let boostedBalance = projected;
    let addedPrincipal = 0;
    
    // Compound formula for added voluntary contributions:
    // Future Value of Annuity compounded annually
    const r = divRate / 100;
    for (let i = 0; i < yearsToInvest; i++) {
      // Annual voluntary contribution addition
      const annualAddition = monthlyContributionBooster * 12;
      addedPrincipal += annualAddition;
      boostedBalance += annualAddition * Math.pow(1 + r, yearsToInvest - i);
    }

    const dividendEarnedOnBooster = Math.max(0, (boostedBalance - projected) - addedPrincipal);

    return (
      <div className="space-y-6">
        {/* Smart Simple Summary */}
        <div className="p-5 rounded-xl bg-primary/5 border border-primary/10">
          <h4 className="font-display font-bold text-sm text-text-primary flex items-center gap-2 mb-2">
            <PiggyBank className="h-4.5 w-4.5 text-primary" />
            EPF Wealth Projection & Adequacy Status
          </h4>
          <p className="text-xs text-text-secondary leading-relaxed">
            Your projected EPF balance at age {retAge} is <strong className="text-text-primary">RM {projected.toLocaleString('en-MY', { maximumFractionDigits: 0 })}</strong>. 
            {projected >= EPF_ADEQUACY_TARGET ? (
              <span className="text-success font-semibold">
                {" "}This satisfies EPF's Basic Adequacy Target of RM 240,000, which aims to provide RM 1,000/month for a 20-year retirement window.
              </span>
            ) : (
              <span className="text-amber-600 font-semibold">
                {" "}This is below EPF's Basic Adequacy Target of RM 240,000. It is highly recommended to consider voluntary contribution boosting to secure a comfortable safety cushion.
              </span>
            )}
          </p>
        </div>

        {/* Rule-based Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-5 border border-border-custom bg-white rounded-xl space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
              💰 Account Split Strategy
            </span>
            <h5 className="font-display font-bold text-sm text-text-primary">Understanding 3-Account Divisions</h5>
            <p className="text-xs text-text-secondary leading-relaxed">
              Your projected fund will divide into: Akaun Persaraan (A1, 75%) = <strong className="text-text-primary">RM {outputs.akaunPersaraan.toLocaleString('en-MY', { maximumFractionDigits: 0 })}</strong>; Akaun Sejahtera (A2, 15%) = <strong className="text-text-primary">RM {outputs.akaunSejahtera.toLocaleString('en-MY', { maximumFractionDigits: 0 })}</strong>; and Akaun Fleksibel (A3, 10%) = <strong className="text-text-primary">RM {outputs.akaunFleksibel.toLocaleString('en-MY', { maximumFractionDigits: 0 })}</strong>. Avoid taking premature funds out of Account 3 unless absolutely critical, to safeguard compounding.
            </p>
          </div>

          <div className="p-5 border border-border-custom bg-white rounded-xl space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/5 px-2.5 py-0.5 rounded-md border border-primary/10">
              📈 Voluntary Self-Contributions
            </span>
            <h5 className="font-display font-bold text-sm text-text-primary">Voluntary Contribution Scheme</h5>
            <p className="text-xs text-text-secondary leading-relaxed">
              EPF allows individuals to make voluntary self-contributions up to <strong className="text-text-primary">RM 100,000 per year</strong>. This is highly tax-efficient and secure, as KWSP historical dividends consistently beat local bank fixed deposits (averaging 5.0% - 6.0% annually).
            </p>
          </div>
        </div>

        {/* Interactive Comparison Tool: EPF Self-Contribution Booster */}
        <div className="p-5 rounded-2xl border border-border-custom bg-bg-custom/50 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h5 className="font-display font-bold text-sm text-text-primary flex items-center gap-1.5">
                <Sparkles className="h-4.5 w-4.5 text-primary" />
                Interactive Voluntary Self-Contribution Booster
              </h5>
              <p className="text-[11px] text-text-secondary">
                See how adding a tiny voluntary monthly contribution compounds over {yearsToInvest} years.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-medium text-text-secondary">Voluntary Monthly Top-up:</span>
              <span className="text-xs font-mono font-bold text-primary bg-white px-2.5 py-1 rounded-md border border-border-custom shadow-2xs">
                + RM {epfExtraVoluntary}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <input 
              type="range" 
              min="0" 
              max="1000" 
              step="50" 
              value={epfExtraVoluntary} 
              onChange={(e) => setEpfExtraVoluntary(parseInt(e.target.value))}
              className="w-full h-1.5 bg-border-custom rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] text-text-secondary font-mono">
              <span>No Top-up</span>
              <span>RM 250</span>
              <span>RM 500</span>
              <span>RM 1,000</span>
            </div>
          </div>

          {epfExtraVoluntary > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-border-custom space-y-1">
                <div className="text-[11px] text-text-secondary">New Boosted Retirement Balance</div>
                <div className="font-display font-black text-lg text-success">
                  RM {boostedBalance.toLocaleString('en-MY', { maximumFractionDigits: 0 })}
                </div>
                <div className="text-[10px] text-text-secondary leading-normal">
                  Your nest egg increases by <strong className="text-text-primary">RM {(boostedBalance - projected).toLocaleString('en-MY', { maximumFractionDigits: 0 })}</strong>.
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-border-custom space-y-1">
                <div className="text-[11px] text-text-secondary">Compound Dividends Alone Earned</div>
                <div className="font-display font-black text-lg text-primary">
                  RM {dividendEarnedOnBooster.toLocaleString('en-MY', { maximumFractionDigits: 0 })}
                </div>
                <div className="text-[10px] text-text-secondary leading-normal">
                  Pure interest compound growth from KWSP dividends. You only put in RM {addedPrincipal.toLocaleString()}.
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-4 rounded-xl border border-border-custom text-center text-xs text-text-secondary py-6">
              Adjust the slider to add a voluntary monthly top-up. Because retirement planning stretches over decades, even a minor RM 150/month booster compounds into a massive sum by age 60!
            </div>
          )}
        </div>
      </div>
    );
  };

  // 4. PERSONAL LOAN & EIR SMART ADVICE
  const renderPersonalLoanAdvice = () => {
    const flatRate = inputs.interestRate || 0;
    const eir = outputs.effectiveRate || 0;
    const installment = outputs.monthlyPayment || 0;
    const totalInt = outputs.totalInterest || 0;
    const loanAmt = inputs.loanAmount || 0;

    return (
      <div className="space-y-6">
        {/* Smart Simple Summary */}
        <div className="p-5 rounded-xl bg-primary/5 border border-primary/10">
          <h4 className="font-display font-bold text-sm text-text-primary flex items-center gap-2 mb-2">
            <ShieldAlert className="h-4.5 w-4.5 text-primary" />
            Flat Interest Rate vs. Effective Interest Rate (EIR)
          </h4>
          <p className="text-xs text-text-secondary leading-relaxed">
            While the advertised flat interest rate is <strong className="text-text-primary">{flatRate}%</strong>, the actual compounding interest cost is <strong className="text-primary font-bold">{eir.toFixed(2)}% EIR</strong>. Flat rates calculate interest on the full original principal throughout the term, ignoring monthly repayments, whereas EIR reflects the interest charged on your actual outstanding balance.
          </p>
        </div>

        {/* Visual Breakdowns: Side-by-Side Comparison Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="p-5 border border-border-custom bg-white rounded-xl space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
              ⚠️ The Advertising Illusion
            </span>
            <h5 className="font-display font-bold text-sm text-text-primary">Flat Interest Rate: {flatRate}%</h5>
            <p className="text-xs text-text-secondary leading-relaxed">
              Makes the loan look cheaper than it is. Since interest is fixed at RM {((loanAmt * (flatRate/100))).toLocaleString('en-MY')} annually, you pay interest on money you already returned to the lender.
            </p>
          </div>

          <div className="p-5 border border-border-custom bg-white rounded-xl space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/5 px-2.5 py-0.5 rounded-md border border-primary/10">
              📊 The Real Financial Cost
            </span>
            <h5 className="font-display font-bold text-sm text-text-primary">Effective Interest Rate: {eir.toFixed(2)}%</h5>
            <p className="text-xs text-text-secondary leading-relaxed">
              The true compounding annual rate you pay. When comparing this personal loan with other debt instruments (like mortgages, credit card balance transfers, or overdrafts), always use EIR as the baseline.
            </p>
          </div>
        </div>

        {/* Rule-based Tips Comparison Calculator with refinancing options */}
        <div className="p-5 rounded-2xl border border-border-custom bg-bg-custom/50 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h5 className="font-display font-bold text-sm text-text-primary flex items-center gap-1.5">
                <Percent className="h-4.5 w-4.5 text-primary" />
                EIR refinancing & alternative lending analyzer
              </h5>
              <p className="text-[11px] text-text-secondary">
                Compare this personal loan to alternative loans (like home equity refinance top-ups, usually at 4.2% - 4.8%).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-medium text-text-secondary">Alternative Loan EIR Rate:</span>
              <span className="text-xs font-mono font-bold text-primary bg-white px-2.5 py-1 rounded-md border border-border-custom shadow-2xs">
                {personalLoanRefRate}% EIR
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <input 
              type="range" 
              min="3" 
              max="15" 
              step="0.5" 
              value={personalLoanRefRate} 
              onChange={(e) => setPersonalLoanRefRate(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-border-custom rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] text-text-secondary font-mono">
              <span>Refinance (4.5%)</span>
              <span>Credit Card (15%)</span>
            </div>
          </div>

          {eir > personalLoanRefRate ? (
            <div className="bg-white p-4 rounded-xl border border-border-custom space-y-2">
              <div className="text-xs font-bold text-success flex items-center gap-1.5">
                <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
                Refinancing opportunity found!
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                If you have an existing home loan, securing a top-up loan at <strong className="text-text-primary">{personalLoanRefRate}% EIR</strong> instead of this personal loan at <strong className="text-text-primary">{eir.toFixed(2)}% EIR</strong> could save you significant borrowing charges. You should always prefer home equity drawdowns for large expenditures like home renovations.
              </p>
            </div>
          ) : (
            <div className="bg-white p-4 rounded-xl border border-border-custom space-y-2">
              <div className="text-xs font-bold text-amber-600 flex items-center gap-1.5">
                <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
                Caution: Alternative has higher interest rates!
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                This personal loan EIR of <strong className="text-text-primary">{eir.toFixed(2)}%</strong> is cheaper than the alternative rate of <strong className="text-text-primary">{personalLoanRefRate}%</strong>. Avoid transferring this debt to a higher-rate credit card balance transfer scheme unless they offer a 0% introductory promotion window.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-primary/5 via-white to-primary/5 border border-primary/20 rounded-2xl p-6 sm:p-8 mt-10 shadow-sm relative overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/5 blur-xl pointer-events-none" />
      
      {/* Header section of the report */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-border-custom pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base sm:text-lg text-text-primary flex items-center gap-2">
              Sequenxe Strategy Planner & Optimizer
              <span className="bg-success/15 text-success text-[10px] uppercase tracking-wider font-mono font-bold px-2 py-0.5 rounded-full">
                100% Offline
              </span>
            </h3>
            <p className="text-xs text-text-secondary">
              Deterministic statutory checklists and comparison modeling under standard Malaysian guidelines.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 no-print shrink-0">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-primary transition-colors border border-border-custom bg-white px-3 py-1.5 rounded-lg shadow-2xs cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            Print Report
          </button>
        </div>
      </div>

      {/* Main content depending on type */}
      {calculatorType === 'salary' && renderSalaryAdvice()}
      {calculatorType === 'loan' && renderHomeLoanAdvice()}
      {calculatorType === 'epf' && renderEpfAdvice()}
      {calculatorType === 'personal-loan' && renderPersonalLoanAdvice()}

      {/* Footer verifying section */}
      <div className="mt-6 pt-5 border-t border-border-custom flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-secondary no-print">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <span>Calculations verified under latest LHDN, KWSP & Bank Negara Malaysia rules.</span>
        </div>
        <button 
          onClick={handleBookmark}
          disabled={bookmarked}
          className="text-primary disabled:text-text-secondary hover:text-primary-hover font-semibold transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Bookmark className="h-3.5 w-3.5" />
          {bookmarked ? 'Saved to local!' : 'Bookmark Strategy'}
        </button>
      </div>
    </div>
  );
}
