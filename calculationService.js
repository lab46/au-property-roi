import { calculateStampDuty } from '../calculators/stampDuty.js';
import { calculateLoanRepayments, calculateLVR } from '../calculators/loanCalculator.js';
import { calculateCashFlow, calculateRentalYield, calculateNetRentalYield } from '../calculators/cashFlowCalculator.js';
import { calculate30YearProjection, calculateInvestmentMetrics } from '../calculators/projectionCalculator.js';
import { calculateYearByYear } from '../calculators/yearByYearCalculator.js';

export function calculatePropertyInvestment(propertyData) {
  const {
    purchasePrice, state, isFirstHomeBuyer = false,
    lmi = 0, legalFees = 0, buildingInspection = 0, otherUpfrontCosts = 0,
    depositAmount, interestRate, loanTerm,
    weeklyRent, weeksRented = 52,
    councilRatesMonthly = 0, waterRatesMonthly = 0, insuranceMonthly = 0,
    maintenanceMonthly = 0, emergencyServicesLevyMonthly = 0, landTaxMonthly = 0,
    wealthFeeMonthly = 0, strataMonthly = 0, propertyManagementFee = 0,
    capitalGrowthRate = 5, rentalGrowthRate = 3, holdingCostGrowthRate = 3,
    includeStressTests = false,
  } = propertyData;

  if (!purchasePrice || !state || !depositAmount || !interestRate || !loanTerm || !weeklyRent) {
    throw new Error('Missing required fields');
  }

  const stampDuty = calculateStampDuty(purchasePrice, state, isFirstHomeBuyer);
  const additionalUpfrontCosts = lmi + legalFees + buildingInspection + otherUpfrontCosts;
  const loanAmount = purchasePrice - depositAmount;
  const loanDetails = calculateLoanRepayments(loanAmount, interestRate, loanTerm);
  const lvrDetails = calculateLVR(loanAmount, purchasePrice);
  const totalUpfrontCosts = depositAmount + stampDuty.total + additionalUpfrontCosts;

  const annualRent = weeklyRent * weeksRented;
  const propertyManagementAnnual = (annualRent * propertyManagementFee) / 100;

  const annualExpenses = {
    propertyManagement: propertyManagementAnnual,
    councilRates: councilRatesMonthly * 12,
    waterRates: waterRatesMonthly * 12,
    insurance: insuranceMonthly * 12,
    maintenance: maintenanceMonthly * 12,
    emergencyServicesLevy: emergencyServicesLevyMonthly * 12,
    landTax: landTaxMonthly * 12,
    wealthFee: wealthFeeMonthly * 12,
    strata: strataMonthly * 12,
  };

  const cashFlow = calculateCashFlow(annualRent, loanDetails.annualRepayment, annualExpenses);
  const grossYield = calculateRentalYield(annualRent, purchasePrice);
  const netYield = calculateNetRentalYield(annualRent, purchasePrice, annualExpenses);

  const projection = calculate30YearProjection({
    purchasePrice, annualRent,
    loanDetails: { loanAmount, annualInterestRate: interestRate, loanTermYears: loanTerm, annualRepayment: loanDetails.annualRepayment },
    annualExpenses, capitalGrowthRate, rentalGrowthRate, holdingCostGrowthRate,
  });

  const investmentMetrics = calculateInvestmentMetrics(projection, totalUpfrontCosts);

  const propertyManagementMonthly = propertyManagementAnnual / 12;
  const totalMonthlyExpenses = propertyManagementMonthly + councilRatesMonthly + waterRatesMonthly +
    insuranceMonthly + maintenanceMonthly + emergencyServicesLevyMonthly + landTaxMonthly + wealthFeeMonthly + strataMonthly;
  const monthlyRent = (weeklyRent * weeksRented) / 12;

  const yearByYear = calculateYearByYear({
    purchasePrice, loanAmount, interestRate, loanTerm,
    initialMonthlyRent: monthlyRent,
    monthlyExpenses: totalMonthlyExpenses,
    capitalGrowthRate, rentalGrowthRate,
  });

  let stressTests = null;
  if (includeStressTests) {
    stressTests = [0.25, 0.5, 1.0].map(increase => {
      const newRate = interestRate + increase;
      const stressLoan = calculateLoanRepayments(loanAmount, newRate, loanTerm);
      const stressCashFlow = calculateCashFlow(annualRent, stressLoan.annualRepayment, annualExpenses);
      return {
        rateIncrease: increase, newRate,
        monthlyRepayment: stressLoan.monthlyRepayment,
        annualRepayment: stressLoan.annualRepayment,
        annualCashFlow: stressCashFlow.cashFlow.annual,
      };
    });
  }

  return {
    summary: { purchasePrice, depositAmount, loanAmount, totalUpfrontCosts, stampDuty: stampDuty.total, additionalCosts: additionalUpfrontCosts },
    stampDuty,
    loanDetails: { ...loanDetails, ...lvrDetails },
    cashFlow,
    yields: { gross: grossYield, net: netYield },
    investmentMetrics,
    projection,
    yearByYear,
    ...(stressTests && { stressTests }),
    inputs: propertyData,
  };
}
