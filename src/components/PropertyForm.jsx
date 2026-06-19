import { useState } from 'react';

const AUSTRALIAN_STATES = [
  { value: 'NSW', label: 'New South Wales' },
  { value: 'VIC', label: 'Victoria' },
  { value: 'QLD', label: 'Queensland' },
  { value: 'SA', label: 'South Australia' },
  { value: 'WA', label: 'Western Australia' },
  { value: 'TAS', label: 'Tasmania' },
  { value: 'NT', label: 'Northern Territory' },
  { value: 'ACT', label: 'Australian Capital Territory' },
];

const FREQUENCIES = [
  { value: 'weekly', label: 'Weekly', multiplier: 52 / 12 },
  { value: 'fortnightly', label: 'Fortnightly', multiplier: 26 / 12 },
  { value: 'monthly', label: 'Monthly', multiplier: 1 },
  { value: 'quarterly', label: 'Quarterly', multiplier: 4 / 12 },
  { value: 'half-yearly', label: 'Half Yearly', multiplier: 2 / 12 },
  { value: 'yearly', label: 'Yearly', multiplier: 1 / 12 },
];

const DEFAULT_FORM = {
  propertyAddress: 'Property Address',
  purchasePrice: '500000',
  deposit: '100000',
  depositPercentage: '20',
  lmi: '0',
  legalFees: '2000',
  buildingInspection: '880',
  otherUpfrontCosts: '1000',
  state: 'NSW',
  isFirstHome: false,
  interestRate: '6.5',
  loanTerm: '30',
  weeklyRent: '400',
  weeksRented: '48',
  propertyManagementFee: '8',
  councilRates: '2000',
  councilRatesFreq: 'yearly',
  waterRates: '800',
  waterRatesFreq: 'yearly',
  insurance: '2000',
  insuranceFreq: 'yearly',
  maintenance: '2000',
  maintenanceFreq: 'yearly',
  emergencyServicesLevy: '0',
  emergencyServicesLevyFreq: 'yearly',
  landTax: '0',
  landTaxFreq: 'yearly',
  wealthFee: '0',
  wealthFeeFreq: 'monthly',
  strata: '0',
  strataFreq: 'quarterly',
  capitalGrowthRate: '5',
  rentalGrowthRate: '3',
  holdingCostGrowthRate: '3',
  includeStressTests: false,
};

function PropertyForm({ onCalculate, initialData }) {
  const [formData, setFormData] = useState(initialData || DEFAULT_FORM);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let updates = { [name]: type === 'checkbox' ? checked : value };

    if (name === 'deposit' && value && formData.purchasePrice) {
      const d = parseFloat(value), p = parseFloat(formData.purchasePrice);
      if (!isNaN(d) && !isNaN(p) && p > 0) updates.depositPercentage = ((d / p) * 100).toFixed(2);
    } else if (name === 'depositPercentage' && value && formData.purchasePrice) {
      const pct = parseFloat(value), p = parseFloat(formData.purchasePrice);
      if (!isNaN(pct) && !isNaN(p)) updates.deposit = ((p * pct) / 100).toFixed(0);
    } else if (name === 'purchasePrice' && value) {
      const p = parseFloat(value);
      if (!isNaN(p) && formData.depositPercentage) {
        const pct = parseFloat(formData.depositPercentage);
        if (!isNaN(pct)) updates.deposit = ((p * pct) / 100).toFixed(0);
      }
    }

    setFormData(prev => ({ ...prev, ...updates }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const convertToMonthly = (amount, frequency) => {
    const freq = FREQUENCIES.find(f => f.value === frequency);
    return amount * (freq?.multiplier || 1);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.purchasePrice || formData.purchasePrice <= 0) newErrors.purchasePrice = 'Purchase price is required';
    if (!formData.deposit || formData.deposit < 0) newErrors.deposit = 'Deposit is required';
    if (parseFloat(formData.deposit) >= parseFloat(formData.purchasePrice)) newErrors.deposit = 'Deposit must be less than purchase price';
    if (parseFloat(formData.depositPercentage) < 20 && parseFloat(formData.lmi) === 0) newErrors.lmi = 'LMI is required when deposit is less than 20%';
    if (!formData.interestRate || formData.interestRate <= 0) newErrors.interestRate = 'Interest rate is required';
    if (!formData.loanTerm || formData.loanTerm <= 0) newErrors.loanTerm = 'Loan term is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onCalculate({
      _rawFormState: { ...formData },
      propertyAddress: formData.propertyAddress,
      purchasePrice: parseFloat(formData.purchasePrice),
      depositAmount: parseFloat(formData.deposit),
      lmi: parseFloat(formData.lmi) || 0,
      legalFees: parseFloat(formData.legalFees) || 0,
      buildingInspection: parseFloat(formData.buildingInspection) || 0,
      otherUpfrontCosts: parseFloat(formData.otherUpfrontCosts) || 0,
      interestRate: parseFloat(formData.interestRate),
      loanTerm: parseInt(formData.loanTerm),
      state: formData.state,
      isFirstHomeBuyer: formData.isFirstHome,
      weeklyRent: parseFloat(formData.weeklyRent) || 0,
      weeksRented: parseInt(formData.weeksRented) || 52,
      propertyManagementFee: parseFloat(formData.propertyManagementFee) || 0,
      councilRatesMonthly: convertToMonthly(parseFloat(formData.councilRates) || 0, formData.councilRatesFreq),
      waterRatesMonthly: convertToMonthly(parseFloat(formData.waterRates) || 0, formData.waterRatesFreq),
      insuranceMonthly: convertToMonthly(parseFloat(formData.insurance) || 0, formData.insuranceFreq),
      maintenanceMonthly: convertToMonthly(parseFloat(formData.maintenance) || 0, formData.maintenanceFreq),
      emergencyServicesLevyMonthly: convertToMonthly(parseFloat(formData.emergencyServicesLevy) || 0, formData.emergencyServicesLevyFreq),
      landTaxMonthly: convertToMonthly(parseFloat(formData.landTax) || 0, formData.landTaxFreq),
      wealthFeeMonthly: convertToMonthly(parseFloat(formData.wealthFee) || 0, formData.wealthFeeFreq),
      strataMonthly: convertToMonthly(parseFloat(formData.strata) || 0, formData.strataFreq),
      capitalGrowthRate: parseFloat(formData.capitalGrowthRate) || 5,
      rentalGrowthRate: parseFloat(formData.rentalGrowthRate) || 3,
      holdingCostGrowthRate: parseFloat(formData.holdingCostGrowthRate) || 3,
      includeStressTests: formData.includeStressTests,
    });
  };

  const ExpenseRow = ({ label, nameAmount, nameFreq }) => (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-2" htmlFor={nameAmount}>{label}</label>
        <div className="relative">
          <span className="absolute left-3 top-2 text-gray-500">$</span>
          <input
            id={nameAmount}
            type="number"
            name={nameAmount}
            value={formData[nameAmount]}
            onChange={handleChange}
            className="input-field pl-8"
            placeholder="0"
            aria-label={`${label} amount`}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2" htmlFor={nameFreq}>Frequency</label>
        <select id={nameFreq} name={nameFreq} value={formData[nameFreq]} onChange={handleChange} className="input-field" aria-label={`${label} frequency`}>
          {FREQUENCIES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8" aria-label="Property ROI Calculator Form">
      {/* Property Details */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Property Details</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="propertyAddress">Property Address</label>
            <input
              id="propertyAddress"
              type="text"
              name="propertyAddress"
              value={formData.propertyAddress}
              onChange={handleChange}
              className="input-field"
              placeholder="123 Main Street, Sydney NSW 2000"
              aria-label="Property address"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="purchasePrice">Purchase Price *</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  id="purchasePrice"
                  type="number"
                  name="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={handleChange}
                  className={`input-field pl-8 ${errors.purchasePrice ? 'border-red-500' : ''}`}
                  placeholder="500000"
                  aria-label="Property purchase price in Australian dollars"
                />
              </div>
              {errors.purchasePrice && <p className="mt-1 text-sm text-red-600">{errors.purchasePrice}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Deposit *</label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="deposit"
                    value={formData.deposit}
                    onChange={handleChange}
                    className={`input-field pl-8 ${errors.deposit ? 'border-red-500' : ''}`}
                    placeholder="100000"
                    aria-label="Deposit amount in dollars"
                  />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    name="depositPercentage"
                    value={formData.depositPercentage}
                    onChange={handleChange}
                    className="input-field pr-8"
                    placeholder="20"
                    aria-label="Deposit percentage"
                  />
                  <span className="absolute right-3 top-2 text-gray-500">%</span>
                </div>
              </div>
              {errors.deposit && <p className="mt-1 text-sm text-red-600">{errors.deposit}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="lmi">LMI (Lenders Mortgage Insurance)</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  id="lmi"
                  type="number"
                  name="lmi"
                  value={formData.lmi}
                  onChange={handleChange}
                  className={`input-field pl-8 ${errors.lmi ? 'border-red-500' : ''}`}
                  placeholder="0"
                  aria-label="Lenders Mortgage Insurance amount"
                />
              </div>
              {parseFloat(formData.depositPercentage) < 20 && (
                <p className="text-xs text-amber-600 mt-1">⚠️ LMI typically required when deposit is less than 20%</p>
              )}
              {errors.lmi && <p className="mt-1 text-sm text-red-600">{errors.lmi}</p>}
            </div>
          </div>

          {/* Additional Upfront Costs */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
            <div className="flex items-start gap-2">
              <span className="text-blue-600 text-xl">ℹ️</span>
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">About Stamp Duty & Upfront Costs</p>
                <p className="text-blue-800">Stamp duty shown in results is <strong>approximate only</strong>. Verify with your state revenue office.</p>
              </div>
            </div>
            <div className="border-t border-blue-200 pt-4">
              <h3 className="font-semibold text-gray-900 mb-3">Additional Upfront Costs (Optional)</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="legalFees">Legal / Conveyancing Fees</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input id="legalFees" type="number" name="legalFees" value={formData.legalFees} onChange={handleChange} className="input-field pl-8" placeholder="2000" aria-label="Legal and conveyancing fees" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="buildingInspection">Building Inspection</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input id="buildingInspection" type="number" name="buildingInspection" value={formData.buildingInspection} onChange={handleChange} className="input-field pl-8" placeholder="880" aria-label="Building and pest inspection cost" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="otherUpfrontCosts">Other Upfront Costs</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input id="otherUpfrontCosts" type="number" name="otherUpfrontCosts" value={formData.otherUpfrontCosts} onChange={handleChange} className="input-field pl-8" placeholder="1000" aria-label="Other upfront costs such as bank fees" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="state">State / Territory *</label>
              <select id="state" name="state" value={formData.state} onChange={handleChange} className="input-field" aria-label="Australian state or territory for stamp duty calculation">
                {AUSTRALIAN_STATES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div className="flex items-center mt-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isFirstHome"
                  checked={formData.isFirstHome}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  aria-label="First home buyer stamp duty concession"
                />
                <span className="ml-2 text-sm font-medium">First Home Buyer</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Loan Details */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Loan Details</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="interestRate">Interest Rate (% p.a.) *</label>
            <div className="relative">
              <input
                id="interestRate"
                type="number"
                step="0.01"
                name="interestRate"
                value={formData.interestRate}
                onChange={handleChange}
                className={`input-field pr-8 ${errors.interestRate ? 'border-red-500' : ''}`}
                placeholder="6.5"
                aria-label="Annual interest rate percentage"
              />
              <span className="absolute right-3 top-2 text-gray-500">%</span>
            </div>
            {errors.interestRate && <p className="mt-1 text-sm text-red-600">{errors.interestRate}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="loanTerm">Loan Term (years) *</label>
            <input
              id="loanTerm"
              type="number"
              name="loanTerm"
              value={formData.loanTerm}
              onChange={handleChange}
              className={`input-field ${errors.loanTerm ? 'border-red-500' : ''}`}
              placeholder="30"
              aria-label="Loan term in years"
            />
            {errors.loanTerm && <p className="mt-1 text-sm text-red-600">{errors.loanTerm}</p>}
          </div>
        </div>
      </div>

      {/* Rental Income */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Rental Income</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="weeklyRent">Weekly Rent</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input id="weeklyRent" type="number" name="weeklyRent" value={formData.weeklyRent} onChange={handleChange} className="input-field pl-8" placeholder="400" aria-label="Weekly rental income" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="weeksRented">Weeks Rented per Year</label>
            <input id="weeksRented" type="number" name="weeksRented" value={formData.weeksRented} onChange={handleChange} className="input-field" placeholder="48" min="0" max="52" aria-label="Number of weeks rented per year" />
            <p className="text-xs text-gray-500 mt-1">Account for vacancy periods (max 52)</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="propertyManagementFee">Property Management Fee (%)</label>
            <div className="relative">
              <input id="propertyManagementFee" type="number" step="0.1" name="propertyManagementFee" value={formData.propertyManagementFee} onChange={handleChange} className="input-field pr-8" placeholder="8" aria-label="Property management fee percentage of annual rent" />
              <span className="absolute right-3 top-2 text-gray-500">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expenses */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Property Expenses</h2>
        <div className="space-y-4">
          <ExpenseRow label="Council Rates" nameAmount="councilRates" nameFreq="councilRatesFreq" />
          <ExpenseRow label="Water Rates" nameAmount="waterRates" nameFreq="waterRatesFreq" />
          <ExpenseRow label="Insurance" nameAmount="insurance" nameFreq="insuranceFreq" />
          <ExpenseRow label="Maintenance & Repairs" nameAmount="maintenance" nameFreq="maintenanceFreq" />
          <ExpenseRow label="Emergency Services Levy" nameAmount="emergencyServicesLevy" nameFreq="emergencyServicesLevyFreq" />
          <ExpenseRow label="Land Tax" nameAmount="landTax" nameFreq="landTaxFreq" />
          <ExpenseRow label="Strata / Body Corporate Fees" nameAmount="strata" nameFreq="strataFreq" />
          <ExpenseRow label="Wealth Management Fee" nameAmount="wealthFee" nameFreq="wealthFeeFreq" />
        </div>
      </div>

      {/* Growth Assumptions */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Growth Assumptions</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="capitalGrowthRate">Capital Growth Rate (% p.a.)</label>
            <div className="relative">
              <input id="capitalGrowthRate" type="number" step="0.1" name="capitalGrowthRate" value={formData.capitalGrowthRate} onChange={handleChange} className="input-field pr-8" placeholder="5" aria-label="Annual property capital growth rate percentage" />
              <span className="absolute right-3 top-2 text-gray-500">%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="rentalGrowthRate">Rental Growth Rate (% p.a.)</label>
            <div className="relative">
              <input id="rentalGrowthRate" type="number" step="0.1" name="rentalGrowthRate" value={formData.rentalGrowthRate} onChange={handleChange} className="input-field pr-8" placeholder="3" aria-label="Annual rental income growth rate percentage" />
              <span className="absolute right-3 top-2 text-gray-500">%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="holdingCostGrowthRate">Holding Cost Growth (% p.a.)</label>
            <div className="relative">
              <input id="holdingCostGrowthRate" type="number" step="0.1" name="holdingCostGrowthRate" value={formData.holdingCostGrowthRate} onChange={handleChange} className="input-field pr-8" placeholder="3" aria-label="Annual holding cost growth rate percentage" />
              <span className="absolute right-3 top-2 text-gray-500">%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Annual increase in expenses</p>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="card">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="includeStressTests"
            checked={formData.includeStressTests}
            onChange={handleChange}
            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            aria-label="Include interest rate stress tests"
          />
          <span className="ml-2 text-sm font-medium">Include interest rate stress tests (+0.25%, +0.50%, +1.00%)</span>
        </label>
      </div>

      <div className="flex justify-center">
        <button type="submit" className="btn-primary text-lg px-12 py-3">
          Calculate Investment Returns
        </button>
      </div>
    </form>
  );
}

export default PropertyForm;
