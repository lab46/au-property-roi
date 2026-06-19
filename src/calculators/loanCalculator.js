export function calculateLoanRepayments(loanAmount, annualInterestRate, loanTermYears) {
  if (loanAmount <= 0) throw new Error('Loan amount must be greater than 0');
  if (annualInterestRate < 0 || annualInterestRate > 100) throw new Error('Interest rate must be between 0 and 100');
  if (loanTermYears <= 0 || loanTermYears > 50) throw new Error('Loan term must be between 1 and 50 years');

  const monthlyRate = (annualInterestRate / 100) / 12;
  const numberOfPayments = loanTermYears * 12;

  let monthlyRepayment;
  if (monthlyRate === 0) {
    monthlyRepayment = loanAmount / numberOfPayments;
  } else {
    const factor = Math.pow(1 + monthlyRate, numberOfPayments);
    monthlyRepayment = loanAmount * (monthlyRate * factor) / (factor - 1);
  }

  const totalRepayment = monthlyRepayment * numberOfPayments;
  const totalInterest = totalRepayment - loanAmount;
  const annualRepayment = monthlyRepayment * 12;

  return {
    loanAmount: Math.round(loanAmount),
    annualInterestRate,
    loanTermYears,
    loanType: 'principal and interest',
    monthlyRepayment: Math.round(monthlyRepayment * 100) / 100,
    annualRepayment: Math.round(annualRepayment * 100) / 100,
    totalRepayment: Math.round(totalRepayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    numberOfPayments,
  };
}

export function generateAmortizationSchedule(loanAmount, annualInterestRate, loanTermYears, yearlyInterval = 1) {
  const { monthlyRepayment } = calculateLoanRepayments(loanAmount, annualInterestRate, loanTermYears);
  const monthlyRate = (annualInterestRate / 100) / 12;

  const schedule = [];
  let remainingBalance = loanAmount;
  let totalPrincipalPaid = 0;
  let totalInterestPaid = 0;

  for (let year = 0; year <= loanTermYears; year++) {
    if (year % yearlyInterval === 0 || year === loanTermYears) {
      schedule.push({
        year,
        remainingBalance: Math.round(remainingBalance * 100) / 100,
        totalPrincipalPaid: Math.round(totalPrincipalPaid * 100) / 100,
        totalInterestPaid: Math.round(totalInterestPaid * 100) / 100,
        equityBuilt: Math.round((loanAmount - remainingBalance) * 100) / 100,
      });
    }
    for (let month = 0; month < 12 && remainingBalance > 0; month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyRepayment - interestPayment;
      remainingBalance -= principalPayment;
      totalPrincipalPaid += principalPayment;
      totalInterestPaid += interestPayment;
      if (remainingBalance < 0) remainingBalance = 0;
    }
  }

  return schedule;
}

export function calculateLVR(loanAmount, propertyValue) {
  if (propertyValue <= 0) throw new Error('Property value must be greater than 0');
  const lvr = (loanAmount / propertyValue) * 100;
  return {
    lvr: Math.round(lvr * 100) / 100,
    requiresLMI: lvr > 80,
    deposit: propertyValue - loanAmount,
    depositPercentage: Math.round(((propertyValue - loanAmount) / propertyValue) * 100 * 100) / 100,
  };
}
