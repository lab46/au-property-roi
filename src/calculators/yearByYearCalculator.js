export function calculateYearByYear({ purchasePrice, loanAmount, interestRate, loanTerm, initialMonthlyRent, monthlyExpenses, capitalGrowthRate, rentalGrowthRate }) {
  const monthlyInterestRate = interestRate / 100 / 12;
  const totalPayments = loanTerm * 12;

  let monthlyPayment;
  if (monthlyInterestRate === 0) {
    monthlyPayment = loanAmount / totalPayments;
  } else {
    monthlyPayment = loanAmount *
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments)) /
      (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);
  }

  let remainingBalance = loanAmount;
  let currentPropertyValue = purchasePrice;
  let currentMonthlyRent = initialMonthlyRent;
  let selfSufficientYear = null;
  let cumulativeCashFlow = 0;
  const yearlyData = [];

  for (let year = 1; year <= loanTerm; year++) {
    const yearStartMonthlyRent = currentMonthlyRent;

    for (let month = 1; month <= 12; month++) {
      if (remainingBalance > 0) {
        const interestPayment = remainingBalance * monthlyInterestRate;
        const principalPayment = monthlyPayment - interestPayment;
        remainingBalance -= principalPayment;
        if (remainingBalance < 0) remainingBalance = 0;
      }
    }

    currentPropertyValue *= (1 + capitalGrowthRate / 100);
    currentMonthlyRent *= (1 + rentalGrowthRate / 100);

    const equity = currentPropertyValue - remainingBalance;
    const equityPercentage = (equity / currentPropertyValue) * 100;
    const annualRent = yearStartMonthlyRent * 12;
    const annualExpenses = monthlyExpenses * 12;
    const annualLoanPayment = monthlyPayment * 12;
    const annualCashFlow = annualRent - annualExpenses - annualLoanPayment;
    const monthlyCashFlow = annualCashFlow / 12;
    cumulativeCashFlow += annualCashFlow;

    if (!selfSufficientYear && annualCashFlow >= 0) selfSufficientYear = year;

    yearlyData.push({
      year,
      propertyValue: Math.round(currentPropertyValue),
      loanBalance: Math.round(remainingBalance),
      equity: Math.round(equity),
      equityPercentage: Math.round(equityPercentage * 100) / 100,
      monthlyRent: Math.round(yearStartMonthlyRent),
      annualRent: Math.round(annualRent),
      monthlyCashFlow: Math.round(monthlyCashFlow),
      annualCashFlow: Math.round(annualCashFlow),
      cumulativeCashFlow: Math.round(cumulativeCashFlow),
      isSelfSufficient: annualCashFlow >= 0,
    });
  }

  return {
    yearlyData,
    selfSufficientYear,
    summary: {
      totalYears: loanTerm,
      finalPropertyValue: Math.round(currentPropertyValue),
      finalEquity: Math.round(currentPropertyValue),
      finalMonthlyRent: Math.round(currentMonthlyRent),
      selfSufficientYear,
      yearsUntilSelfSufficient: selfSufficientYear || 'Never',
    },
  };
}
