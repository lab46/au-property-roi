import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function InfoTooltip({ content }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative inline-block ml-1">
      <button
        type="button"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onClick={() => setVisible(!visible)}
        className="text-gray-400 hover:text-gray-600 focus:outline-none"
        aria-label="More information"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      </button>
      {visible && (
        <div className="absolute z-50 w-64 p-2 text-xs text-white bg-gray-900 rounded-lg shadow-lg -top-2 left-6">
          <div className="whitespace-normal">{content}</div>
          <div className="absolute top-3 -left-1 w-2 h-2 bg-gray-900 transform rotate-45" />
        </div>
      )}
    </div>
  );
}

function ResultsDisplay({ results, inputData, onReset, onEdit }) {
  const [cashFlowPeriod, setCashFlowPeriod] = useState('annual');

  const fmt = (v) => new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);
  const fmtPct = (v) => `${Number(v).toFixed(2)}%`;

  const getCashFlow = () => {
    const annual = results.cashFlow.cashFlow.annual;
    const map = { weekly: annual / 52, fortnightly: annual / 26, monthly: annual / 12, annual };
    return { value: map[cashFlowPeriod], label: cashFlowPeriod.charAt(0).toUpperCase() + cashFlowPeriod.slice(1) };
  };

  const divide = (v) => {
    const d = { weekly: 52, fortnightly: 26, monthly: 12, annual: 1 };
    return v / (d[cashFlowPeriod] || 1);
  };

  const loanTerm = results.loanDetails.loanTermYears;
  const lastYear = results.projection?.[loanTerm];
  const cashFlowImpact = lastYear ? { totalCashFlow: lastYear.cumulativeCashFlow, isNegative: lastYear.cumulativeCashFlow < 0, loanTerm } : null;

  const netProfit = (() => {
    if (!lastYear) return null;
    const initialInvestment = results.summary.depositAmount + (results.stampDuty?.total || 0) + results.summary.additionalCosts;
    const totalCapitalDeployed = initialInvestment + Math.abs(Math.min(0, lastYear.cumulativeCashFlow));
    const netPosition = lastYear.propertyValue - totalCapitalDeployed;
    return {
      initialInvestment, finalPropertyValue: lastYear.propertyValue,
      remainingLoan: lastYear.remainingLoan || 0,
      cumulativeCashFlow: lastYear.cumulativeCashFlow,
      netPosition, totalCapitalDeployed,
      roi: (netPosition / totalCapitalDeployed) * 100,
      loanTerm,
    };
  })();

  const projectionChartData = results.projection
    ?.filter((_, i) => i % 5 === 0 || i === results.projection.length - 1)
    .map(item => ({ year: item.year, 'Property Value': item.propertyValue, 'Equity': item.equity, 'Remaining Loan': item.remainingLoan }));

  const cashFlowChartData = results.projection
    ?.filter((_, i) => i % 5 === 0 || i === results.projection.length - 1)
    .map(item => ({ year: item.year, 'Annual Cash Flow': item.annualCashFlow, 'Cumulative Cash Flow': item.cumulativeCashFlow }));

  return (
    <div className="space-y-6">
      {/* Address header */}
      {inputData?.propertyAddress && (
        <div className="card bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏠</span>
            <div>
              <h2 className="text-2xl font-bold">{inputData.propertyAddress}</h2>
              <p className="text-indigo-100 text-sm">{inputData.state || ''}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <button onClick={onReset} className="btn-secondary">← Calculate Another Property</button>
        <button onClick={onEdit} className="btn-secondary">✏️ Edit This Property</button>
      </div>

      {/* Executive Summary */}
      <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">📊</span>
          <h2 className="text-2xl font-bold">Investment Summary</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1 flex items-center">Purchase Price <InfoTooltip content="The property's purchase price as entered in your calculation." /></div>
            <div className="text-2xl font-bold">{fmt(results.summary.purchasePrice)}</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1 flex items-center">Loan Amount <InfoTooltip content={`LVR: ${fmtPct(results.loanDetails.lvr)}`} /></div>
            <div className="text-2xl font-bold text-blue-600">{fmt(results.summary.loanAmount)}</div>
            <div className="text-xs text-gray-600 mt-1">LVR: {fmtPct(results.loanDetails.lvr)}</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1 flex items-center">Monthly Repayment <InfoTooltip content={`Your monthly loan repayment calculated using the standard mortgage formula: P × [r(1+r)^n]/[(1+r)^n-1], where P = loan amount, r = monthly interest rate, n = number of months. This is a ${results.loanDetails.loanType || 'principal and interest'} loan.`} /></div>
            <div className="text-2xl font-bold text-orange-600">{fmt(results.loanDetails.monthlyRepayment)}</div>
            <div className="text-xs text-gray-600 mt-1">{fmt(results.loanDetails.monthlyRepayment / 4.33)}/week</div>
          </div>
          {results.cashFlow && (
            <div className={`bg-white rounded-lg p-4 shadow-sm ${results.cashFlow.isPositive ? 'ring-2 ring-green-300' : 'ring-2 ring-red-300'}`}>
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1 flex items-center">Monthly Cash Flow <InfoTooltip content={`Monthly cash flow = Monthly Rental Income - Monthly Holding Costs. ${results.cashFlow.isPositive ? 'Positive means the property generates more income than expenses.' : 'Negative means you need to pay out of pocket each year to cover the shortfall.'}`} /></div>
              <div className={`text-2xl font-bold ${results.cashFlow.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {fmt(results.cashFlow.cashFlow.annual / 12)}/mo
              </div>
              <div className="text-xs text-gray-600 mt-1">{results.cashFlow.isPositive ? '✅ Positive' : '⚠️ Negative'}</div>
            </div>
          )}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1 flex items-center">Total Interest ({loanTerm}y) <InfoTooltip content={`Total interest you'll pay over ${results.loanDetails.loanTermYears} years at ${fmtPct(results.loanDetails.annualInterestRate)} interest rate. Calculated as: (Monthly Payment × 12 × ${results.loanDetails.loanTermYears}) - Loan Amount.`} /></div>
            <div className="text-2xl font-bold text-red-600">{fmt(results.loanDetails.totalInterest)}</div>
          </div>
          {netProfit && (
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1 flex items-center">Est. Value (Year {loanTerm}) <InfoTooltip content={`Estimated property value after ${netProfit.loanTerm} years, calculated as: ${fmt(results.summary.purchasePrice)} × (1 + ${inputData?.capitalGrowthRate || 5}%)^${netProfit.loanTerm}. Based on your capital growth assumption of ${inputData?.capitalGrowthRate || 5}% per year.`} /></div>
              <div className="text-2xl font-bold text-green-600">{fmt(netProfit.finalPropertyValue)}</div>
            </div>
          )}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Gross Rental Yield</div>
            <div className="text-2xl font-bold text-primary-600">{fmtPct(results.yields.gross.grossYield)}</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Net Rental Yield</div>
            <div className="text-2xl font-bold text-primary-600">{fmtPct(results.yields.net.netYield)}</div>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="mt-6 pt-6 border-t border-blue-200 grid md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-lg">💵</span>
            <div>
              <div className="font-semibold flex items-center">Initial Investment <InfoTooltip content="Total upfront capital required = Deposit + Stamp Duty + Additional Costs (LMI, legal fees, etc.)" /></div>
              <div>{fmt(results.summary.depositAmount + (results.stampDuty?.total || 0) + results.summary.additionalCosts)}</div>
              <div className="text-xs text-gray-500">Deposit + Stamp Duty + Costs</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-lg">📈</span>
            <div>
              <div className="font-semibold flex items-center">Growth Assumptions <InfoTooltip content="Annual growth rates used in projections. Capital growth affects property value, rental growth affects income, and holding cost growth affects expenses over time." /></div>
              <div>Capital: {inputData?.capitalGrowthRate || 5}%/yr · Rental: {inputData?.rentalGrowthRate || 3}%/yr · Holding Costs: {inputData?.holdingCostGrowthRate || 3}%/yr</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-lg">{results.cashFlow.isPositive ? '✅' : '⚠️'}</span>
            <div>
              <div className="font-semibold flex items-center">Cash Flow Status <InfoTooltip content={`Year 1 cash flow = Rental Income - (Loan Repayments + All Expenses). ${results.cashFlow.isPositive ? 'Positive means the property pays for itself.' : 'Negative means you need to cover the shortfall from your own funds.'}`} /></div>
              <div className={results.cashFlow.isPositive ? 'text-green-600' : 'text-red-600'}>
                {results.cashFlow.isPositive ? 'Positive' : 'Negative'} [{fmt(results.cashFlow.cashFlow.annual)}/yr]
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upfront Costs */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4 flex items-center">Upfront Costs <InfoTooltip content="All costs you need to pay upfront when purchasing the property, including stamp duty and other transaction costs. Your deposit reduces what you need to pay from cash on hand." /></h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 flex items-center">Purchase Price <InfoTooltip content="The agreed sale price of the property." /></span>
            <span className="font-semibold">{fmt(results.summary.purchasePrice)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 flex items-center">Stamp Duty (approx.) <InfoTooltip content={`Approximate government tax on property transfer. ${results.stampDuty?.concessionApplied ? `You received a ${results.stampDuty.concessionType} saving ${fmt(results.stampDuty.savingsAmount)}.` : ''} ⚠️ This is an estimate only - actual stamp duty may vary. Verify with your state revenue office.`} /></span>
            <span className="font-semibold text-right">
              {fmt(results.stampDuty?.total || 0)}
              {results.stampDuty?.concessionApplied && <span className="block text-xs text-green-600">{results.stampDuty.concessionType} — Saved {fmt(results.stampDuty.savingsAmount)}</span>}
              {!results.stampDuty?.concessionApplied && <span className="block text-xs text-gray-500">⚠️ Estimate only</span>}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 flex items-center">Additional Costs <InfoTooltip content="Other upfront costs including legal fees, building inspection, conveyancing, and any Lenders Mortgage Insurance (LMI) if LVR > 80%." /></span>
            <span className="font-semibold text-right">{fmt(results.summary.additionalCosts)}<span className="block text-xs text-gray-500">LMI, legal, inspection, other</span></span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 flex items-center">Your Deposit <InfoTooltip content="Your cash deposit paid upfront, reducing the loan amount needed." /></span>
            <span className="font-semibold text-red-600">-{fmt(results.summary.depositAmount)}</span>
          </div>
          <div className="border-t pt-3 flex justify-between text-lg">
            <span className="font-bold flex items-center">Total Upfront (excl. deposit) <InfoTooltip content="Total cash needed at settlement = Purchase Price + Stamp Duty + Additional Costs - Deposit. This is what you pay from your own funds (excluding the loan)." /></span>
            <span className="font-bold">{fmt(results.summary.stampDuty + results.summary.additionalCosts)}</span>
          </div>
        </div>
      </div>

      {/* Loan Details */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4 flex items-center">Loan Details <InfoTooltip content="Summary of your loan structure including amount borrowed, interest rate, repayment details, and total interest cost over the loan term." /></h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-gray-600 flex items-center">Loan Amount <InfoTooltip content="Total amount borrowed from the bank = Purchase Price - Deposit" /></span><span className="font-semibold">{fmt(results.summary.loanAmount)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600 flex items-center">Interest Rate <InfoTooltip content="Annual interest rate on your loan. This is used to calculate your monthly repayments." /></span><span className="font-semibold">{fmtPct(results.loanDetails.annualInterestRate)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600 flex items-center">Loan Term <InfoTooltip content="Number of years you'll take to repay the loan if you make minimum repayments." /></span><span className="font-semibold">{results.loanDetails.loanTermYears} years</span></div>
            <div className="flex justify-between"><span className="text-gray-600 flex items-center">LVR <InfoTooltip content="Loan to Value Ratio = (Loan Amount / Property Value) × 100. Banks typically require LMI if LVR > 80%." /></span><span className="font-semibold">{fmtPct(results.loanDetails.lvr)}</span></div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-gray-600 flex items-center">Monthly Repayment <InfoTooltip content="Your fixed monthly loan repayment calculated using standard mortgage formula. This stays constant if interest rate doesn't change." /></span><span className="font-semibold">{fmt(results.loanDetails.monthlyRepayment)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600 flex items-center">Total Repayment <InfoTooltip content={`Total you'll pay back to the bank = Monthly Repayment × 12 × ${results.loanDetails.loanTermYears} years = ${fmt(results.loanDetails.totalRepayment)}`} /></span><span className="font-semibold">{fmt(results.loanDetails.totalRepayment)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600 flex items-center">Total Interest <InfoTooltip content="Total interest cost = Total Repayment - Loan Amount. This is the cost of borrowing money." /></span><span className="font-semibold text-red-600">{fmt(results.loanDetails.totalInterest)}</span></div>
          </div>
        </div>
      </div>

      {/* Cash Flow */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center">Cash Flow Analysis <InfoTooltip content="Year 1 cash flow breakdown showing rental income minus all expenses and loan repayments. Select different periods to view weekly, fortnightly, monthly, or annual figures." /></h2>
          <select value={cashFlowPeriod} onChange={e => setCashFlowPeriod(e.target.value)} className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" aria-label="Cash flow period">
            {['weekly', 'fortnightly', 'monthly', 'annual'].map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
          </select>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-green-600">
            <span>Rental Income</span>
            <span className="font-semibold">+{fmt(divide(results.cashFlow.income.annual))}</span>
          </div>
          <div className="text-xs text-gray-500">Based on {inputData?.weeksRented || 48} weeks rented per year</div>
          <div className="border-t pt-3 space-y-2 text-red-600">
            <div className="flex justify-between"><span>Loan Repayments</span><span className="font-semibold">-{fmt(divide(results.cashFlow.costs.loanRepayment))}</span></div>
            {Object.entries(results.cashFlow.costs.breakdown)
              .filter(([, v]) => v > 0)
              .map(([k, v]) => (
                <div key={k} className="flex justify-between pl-4 text-sm">
                  <span>{k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</span>
                  <span>-{fmt(divide(v))}</span>
                </div>
              ))}
          </div>
          <div className="border-t pt-3 flex justify-between text-lg">
            <span className="font-bold">Net Cash Flow ({getCashFlow().label})</span>
            <span className={`font-bold ${results.cashFlow.isPositive ? 'text-green-600' : 'text-red-600'}`}>{fmt(getCashFlow().value)}</span>
          </div>
        </div>
      </div>

      {/* Cash Flow Impact */}
      {cashFlowImpact && (
        <div className={`card ${cashFlowImpact.isNegative ? 'bg-red-50 border-2 border-red-200' : 'bg-green-50 border-2 border-green-200'}`}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">{cashFlowImpact.isNegative ? '⚠️' : '✅'} Cash Flow Impact Over {loanTerm} Years <InfoTooltip content={`Total cumulative cash flow over ${cashFlowImpact.loanTerm} years = Sum of (Rental Income - All Expenses - Loan Repayments) for each year. ${cashFlowImpact.isNegative ? 'Negative means you need to fund the shortfall from your own savings.' : 'Positive means the property generates surplus income.'}`} /></h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">{cashFlowImpact.isNegative ? 'Total Out-of-Pocket Cost' : 'Total Cash Generated'}</div>
              <div className={`text-3xl font-bold ${cashFlowImpact.isNegative ? 'text-red-600' : 'text-green-600'}`}>{fmt(Math.abs(cashFlowImpact.totalCashFlow))}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1 flex items-center">Average Annual {cashFlowImpact.isNegative ? 'Cost' : 'Income'} <InfoTooltip content={`This is the average across all ${cashFlowImpact.loanTerm} years, accounting for rental growth and expense increases each year. Year 1 cash flow is ${fmt(results.cashFlow.cashFlow.annual)}/year, but later years differ due to growth rates.`} /></div>
              <div className={`text-2xl font-bold ${cashFlowImpact.isNegative ? 'text-red-600' : 'text-green-600'}`}>{fmt(Math.abs(cashFlowImpact.totalCashFlow) / loanTerm)}</div>
              <div className="text-sm text-gray-500">{fmt(Math.abs(cashFlowImpact.totalCashFlow) / loanTerm / 12)}/month avg</div>
            </div>
          </div>
        </div>
      )}

      {/* Net Investment Return */}
      {netProfit && (
        <div className="card bg-blue-50 border-2 border-blue-200">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">💰 Net Investment Return ({loanTerm} Years) <InfoTooltip content={`Your net profit = Property Value (${fmt(netProfit.finalPropertyValue)}) - Total Capital Deployed (${fmt(netProfit.totalCapitalDeployed)}). Total Capital = Initial Investment + Out-of-Pocket Costs from negative cashflow. ROI of ${netProfit.roi.toFixed(1)}% is calculated on total capital deployed.`} /></h2>
          <div className="bg-white rounded-lg p-4 border border-blue-300">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {[
                ['Initial Investment', fmt(netProfit.initialInvestment), 'Deposit + Stamp Duty + Costs'],
                ['Total Capital Deployed', fmt(netProfit.totalCapitalDeployed), 'Initial + Out-of-Pocket Costs'],
                ['Final Property Value', fmt(netProfit.finalPropertyValue), `After ${loanTerm} years growth`],
                ['Cumulative Cash Flow', fmt(netProfit.cumulativeCashFlow), 'Rental Income − All Costs', netProfit.cumulativeCashFlow < 0],
              ].map(([l, v, note, isRed]) => (
                <div key={l}>
                  <div className="text-sm text-gray-600 mb-1">{l}</div>
                  <div className={`text-lg font-semibold ${isRed ? 'text-red-600' : 'text-green-600'}`}>{v}</div>
                  <div className="text-xs text-gray-500">{note}</div>
                </div>
              ))}
            </div>
            <div className="border-t-2 border-blue-200 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-bold">Net Profit / Loss</span>
                <span className={`text-3xl font-bold ${netProfit.netPosition >= 0 ? 'text-green-600' : 'text-red-600'}`}>{fmt(netProfit.netPosition)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Return on Investment (ROI)</span>
                <span className={`text-xl font-bold ${netProfit.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>{netProfit.roi.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stress Tests */}
      {results.stressTests && (
        <div className="card">
          <h2 className="text-xl font-bold mb-4 flex items-center">Interest Rate Stress Tests <InfoTooltip content="Shows how your monthly repayment and cash flow would change if interest rates increase. Use this to assess your ability to handle rate rises." /></h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Rate Increase</th>
                  <th className="text-left py-3 px-4">New Rate</th>
                  <th className="text-left py-3 px-4">Monthly Repayment</th>
                  <th className="text-left py-3 px-4">Annual Cash Flow</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b bg-gray-50">
                  <td className="py-3 px-4 font-medium">Current</td>
                  <td className="py-3 px-4">{fmtPct(results.loanDetails.annualInterestRate)}</td>
                  <td className="py-3 px-4">{fmt(results.loanDetails.monthlyRepayment)}</td>
                  <td className="py-3 px-4">{fmt(results.cashFlow.cashFlow.annual)}</td>
                </tr>
                {results.stressTests.map((t, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-3 px-4">+{fmtPct(t.rateIncrease)}</td>
                    <td className="py-3 px-4">{fmtPct(t.newRate)}</td>
                    <td className="py-3 px-4 text-red-600">{fmt(t.monthlyRepayment)}</td>
                    <td className={`py-3 px-4 ${t.annualCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>{fmt(t.annualCashFlow)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Charts */}
      {projectionChartData && (
        <div className="card">
          <h2 className="text-xl font-bold mb-4 flex items-center">30-Year Property Value &amp; Equity <InfoTooltip content={`Visual projection showing: Property Value (growing at ${inputData?.capitalGrowthRate || 5}%/year), Equity (Property Value - Loan), and Remaining Loan (decreasing as you pay it off). The gap between property value and loan balance is your equity.`} /></h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={projectionChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
              <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={v => fmt(v)} />
              <Legend />
              <Line type="monotone" dataKey="Property Value" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="Equity" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="Remaining Loan" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {cashFlowChartData && (
        <div className="card">
          <h2 className="text-xl font-bold mb-4 flex items-center">Cash Flow Over Time <InfoTooltip content="Annual Cash Flow (income minus expenses each year) and Cumulative Cash Flow (running total). Negative cumulative shows total out-of-pocket costs; positive shows total profit from operations." /></h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={cashFlowChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
              <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={v => fmt(v)} />
              <Legend />
              <Bar dataKey="Annual Cash Flow" fill="#3b82f6" />
              <Bar dataKey="Cumulative Cash Flow" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Key Milestones */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Key Investment Milestones</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[10, 20, 30].map(year => {
            const m = results.projection?.[year];
            if (!m) return null;
            const usableEquity = m.equity * 0.8;
            return (
              <div key={year} className="border rounded-lg p-4">
                <h3 className="font-bold text-lg mb-3">Year {year}</h3>
                <div className="space-y-2 text-sm">
                  {[
                    ['Property Value', fmt(m.propertyValue)],
                    ['Equity', fmt(m.equity)],
                    ['Usable Equity (80%)', fmt(usableEquity)],
                    ['Equity %', `${m.equityPercentage}%`],
                    ['Remaining Loan', fmt(m.remainingLoan)],
                    ['Cumulative Cash Flow', fmt(m.cumulativeCashFlow), m.cumulativeCashFlow < 0],
                  ].map(([l, v, isRed]) => (
                    <div key={l} className="flex justify-between">
                      <span className="text-gray-600">{l}</span>
                      <span className={`font-semibold ${isRed ? 'text-red-600' : ''}`}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Year-by-Year */}
      {results.yearByYear && <YearByYearTable data={results.yearByYear} fmt={fmt} />}
    </div>
  );
}

function YearByYearTable({ data, fmt }) {
  const [showAll, setShowAll] = useState(false);
  if (!data?.yearlyData) return null;
  const rows = showAll ? data.yearlyData : data.yearlyData.slice(0, 10);

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-4">Year-by-Year Analysis</h2>

      {data.summary.selfSufficientYear && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 text-sm text-green-900">
          🎉 Property becomes <strong>cash flow positive</strong> in <strong>Year {data.summary.selfSufficientYear}</strong>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {[
                ['Year', null],
                ['Property Value', 'Property value at end of this year, growing at your capital growth rate.'],
                ['Loan Balance', 'Remaining loan amount after this year\'s repayments.'],
                ['Equity', 'Your ownership = Property Value - Loan Balance.'],
                ['Equity %', 'Percentage of property you own = (Equity / Property Value) × 100.'],
                ['Monthly Rent', 'Monthly rental income for this year, growing at your rental growth rate.'],
                ['Monthly Cash Flow', 'Monthly profit/loss = Rent - (Loan Payment + Expenses). Green is positive, red is negative.'],
                ['Cumulative Cash Flow', 'Running total of all cash flow to date. Shows total profit or out-of-pocket costs over time.'],
                ['Status', 'Shows if cash flow is positive (✓) or negative for this year.'],
              ].map(([h, tip]) => (
                <th key={h} className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span className="flex items-center gap-0.5">{h}{tip && <InfoTooltip content={tip} />}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map(r => (
              <tr key={r.year} className={r.isSelfSufficient ? 'bg-green-50' : ''}>
                <td className="px-2 py-2 font-medium text-sm">{r.year}</td>
                <td className="px-2 py-2 text-sm">{fmt(r.propertyValue)}</td>
                <td className="px-2 py-2 text-sm">{fmt(r.loanBalance)}</td>
                <td className="px-2 py-2 font-medium text-sm">{fmt(r.equity)}</td>
                <td className="px-2 py-2 text-sm text-gray-600">{r.equityPercentage}%</td>
                <td className="px-2 py-2 text-sm">{fmt(r.monthlyRent)}</td>
                <td className={`px-2 py-2 font-medium text-sm ${r.monthlyCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>{fmt(r.monthlyCashFlow)}</td>
                <td className={`px-2 py-2 font-medium text-sm ${(r.cumulativeCashFlow || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>{fmt(r.cumulativeCashFlow || 0)}</td>
                <td className="px-2 py-2">
                  {r.isSelfSufficient
                    ? <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">✓ Positive</span>
                    : <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-800">Negative</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.yearlyData.length > 10 && (
        <div className="mt-4 text-center">
          <button onClick={() => setShowAll(!showAll)} className="btn-secondary">
            {showAll ? 'Show Less' : `Show All ${data.yearlyData.length} Years`}
          </button>
        </div>
      )}
    </div>
  );
}

export default ResultsDisplay;
