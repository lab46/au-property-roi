export function calculateCashFlow(annualRentalIncome, annualLoanRepayment, annualExpenses) {
  const totalExpenses = Object.values(annualExpenses).reduce((sum, expense) => sum + expense, 0);
  const totalAnnualCosts = annualLoanRepayment + totalExpenses;
  const annualCashFlow = annualRentalIncome - totalAnnualCosts;

  return {
    income: {
      annual: Math.round(annualRentalIncome * 100) / 100,
      monthly: Math.round((annualRentalIncome / 12) * 100) / 100,
      weekly: Math.round((annualRentalIncome / 52) * 100) / 100,
    },
    costs: {
      loanRepayment: Math.round(annualLoanRepayment * 100) / 100,
      expenses: Math.round(totalExpenses * 100) / 100,
      total: Math.round(totalAnnualCosts * 100) / 100,
      breakdown: {
        propertyManagement: Math.round((annualExpenses.propertyManagement || 0) * 100) / 100,
        councilRates: Math.round((annualExpenses.councilRates || 0) * 100) / 100,
        waterRates: Math.round((annualExpenses.waterRates || 0) * 100) / 100,
        insurance: Math.round((annualExpenses.insurance || 0) * 100) / 100,
        maintenance: Math.round((annualExpenses.maintenance || 0) * 100) / 100,
        emergencyServicesLevy: Math.round((annualExpenses.emergencyServicesLevy || 0) * 100) / 100,
        landTax: Math.round((annualExpenses.landTax || 0) * 100) / 100,
        wealthFee: Math.round((annualExpenses.wealthFee || 0) * 100) / 100,
        strata: Math.round((annualExpenses.strata || 0) * 100) / 100,
      },
    },
    cashFlow: {
      annual: Math.round(annualCashFlow * 100) / 100,
      monthly: Math.round((annualCashFlow / 12) * 100) / 100,
      weekly: Math.round((annualCashFlow / 52) * 100) / 100,
    },
    isPositive: annualCashFlow >= 0,
  };
}

export function calculateRentalYield(annualRentalIncome, propertyValue) {
  if (propertyValue <= 0) throw new Error('Property value must be greater than 0');
  return {
    grossYield: Math.round((annualRentalIncome / propertyValue) * 100 * 100) / 100,
    annualRent: Math.round(annualRentalIncome * 100) / 100,
    propertyValue: Math.round(propertyValue * 100) / 100,
  };
}

export function calculateNetRentalYield(annualRentalIncome, propertyValue, annualExpenses) {
  if (propertyValue <= 0) throw new Error('Property value must be greater than 0');
  const totalExpenses = Object.values(annualExpenses).reduce((sum, expense) => sum + expense, 0);
  const netIncome = annualRentalIncome - totalExpenses;
  return {
    netYield: Math.round((netIncome / propertyValue) * 100 * 100) / 100,
    netIncome: Math.round(netIncome * 100) / 100,
    totalExpenses: Math.round(totalExpenses * 100) / 100,
    propertyValue: Math.round(propertyValue * 100) / 100,
  };
}
