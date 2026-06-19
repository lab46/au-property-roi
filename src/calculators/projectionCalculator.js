import { generateAmortizationSchedule } from './loanCalculator.js';

export function calculate30YearProjection(params) {
  const {
    purchasePrice, annualRent, loanDetails, annualExpenses,
    capitalGrowthRate, rentalGrowthRate, holdingCostGrowthRate = 3,
  } = params;

  const projectionYears = 30;
  const amortization = generateAmortizationSchedule(
    loanDetails.loanAmount, loanDetails.annualInterestRate, loanDetails.loanTermYears, 1
  );
  const totalAnnualExpenses = Object.values(annualExpenses).reduce((sum, e) => sum + e, 0);

  let cumulativeCashFlow = 0, cumulativeRent = 0, cumulativeExpenses = 0, cumulativeLoanRepayments = 0;
  const projection = [];

  for (let year = 0; year <= projectionYears; year++) {
    const propertyValue = purchasePrice * Math.pow(1 + capitalGrowthRate / 100, year);
    const rentThisYear = annualRent * Math.pow(1 + rentalGrowthRate / 100, year);
    const expensesThisYear = totalAnnualExpenses * Math.pow(1 + holdingCostGrowthRate / 100, year);
    const loanYear = amortization.find(e => e.year === year) || amortization[amortization.length - 1];
    const remainingLoanBalance = year < loanDetails.loanTermYears ? loanYear.remainingBalance : 0;
    const equity = propertyValue - remainingLoanBalance;
    const loanRepaymentThisYear = year < loanDetails.loanTermYears ? loanDetails.annualRepayment : 0;
    const cashFlowThisYear = rentThisYear - loanRepaymentThisYear - expensesThisYear;

    if (year > 0) {
      cumulativeCashFlow += cashFlowThisYear;
      cumulativeRent += rentThisYear;
      cumulativeExpenses += expensesThisYear;
      cumulativeLoanRepayments += loanRepaymentThisYear;
    }

    projection.push({
      year,
      propertyValue: Math.round(propertyValue),
      equity: Math.round(equity),
      equityPercentage: Math.round((equity / propertyValue) * 100 * 10) / 10,
      remainingLoan: Math.round(remainingLoanBalance),
      annualRent: Math.round(rentThisYear),
      annualExpenses: Math.round(expensesThisYear),
      annualLoanRepayment: Math.round(loanRepaymentThisYear),
      annualCashFlow: Math.round(cashFlowThisYear),
      cumulativeCashFlow: Math.round(cumulativeCashFlow),
      cumulativeRent: Math.round(cumulativeRent),
      cumulativeExpenses: Math.round(cumulativeExpenses),
      cumulativeLoanRepayments: Math.round(cumulativeLoanRepayments),
      netWorth: Math.round(equity + cumulativeCashFlow),
    });
  }

  return projection;
}

export function calculateInvestmentMetrics(projection, initialInvestment) {
  if (!projection || projection.length === 0) throw new Error('Projection data is required');
  const finalYear = projection[projection.length - 1];
  const year10 = projection[10] || finalYear;
  const year20 = projection[20] || finalYear;
  const totalReturn = finalYear.netWorth - initialInvestment;
  const returnOnInvestment = initialInvestment > 0 ? (totalReturn / initialInvestment) * 100 : 0;
  const years = projection.length - 1;
  let cagr = 0;
  if (initialInvestment > 0 && finalYear.netWorth > 0 && years > 0) {
    cagr = (Math.pow(finalYear.netWorth / initialInvestment, 1 / years) - 1) * 100;
  }
  return {
    initialInvestment: Math.round(initialInvestment),
    finalNetWorth: finalYear.netWorth,
    totalReturn: Math.round(totalReturn),
    returnOnInvestment: Math.round(returnOnInvestment * 10) / 10,
    averageAnnualReturn: Math.round(cagr * 10) / 10,
    milestones: {
      year10: { netWorth: year10.netWorth, equity: year10.equity, propertyValue: year10.propertyValue, cumulativeCashFlow: year10.cumulativeCashFlow },
      year20: { netWorth: year20.netWorth, equity: year20.equity, propertyValue: year20.propertyValue, cumulativeCashFlow: year20.cumulativeCashFlow },
      year30: { netWorth: finalYear.netWorth, equity: finalYear.equity, propertyValue: finalYear.propertyValue, cumulativeCashFlow: finalYear.cumulativeCashFlow },
    },
    totalRentReceived: finalYear.cumulativeRent,
    totalExpensesPaid: finalYear.cumulativeExpenses,
    totalLoanRepayments: finalYear.cumulativeLoanRepayments,
  };
}
