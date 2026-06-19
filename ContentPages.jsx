import { useState } from 'react';

function Article({ id, title, summary, children }) {
  const [open, setOpen] = useState(false);
  return (
    <article id={id} className="card mb-6 scroll-mt-20">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left flex items-start justify-between gap-4 focus:outline-none group"
        aria-expanded={open}
      >
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary-700 transition-colors">{title}</h2>
          {!open && <p className="mt-1 text-sm text-gray-500 leading-relaxed">{summary}</p>}
        </div>
        <span className="text-primary-600 text-2xl font-light mt-0.5 shrink-0">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="mt-5 prose prose-sm max-w-none text-gray-700 leading-relaxed">{children}</div>}
    </article>
  );
}

function ContentPages() {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Property Investment Guides</h2>
      <p className="text-gray-500 mb-8 text-sm">
        In-depth guides to help Australian investors understand key concepts behind property ROI,
        rental yield, stamp duty, and investment strategy.
      </p>

      {/* ── Article 1 ── */}
      <Article
        id="how-to-calculate-property-roi"
        title="How to Calculate Property ROI in Australia"
        summary="Return on investment is the single most important metric for any property investor. Learn exactly how ROI is calculated, what a good ROI looks like, and how to compare properties."
      >
        <h3 className="font-bold text-base mt-4 mb-2">What Is Property ROI?</h3>
        <p>
          Property Return on Investment (ROI) measures the total financial gain from an investment property
          relative to the total money you have put in. In Australia, a complete ROI calculation needs to
          account for capital growth, rental income, all holding costs, and upfront expenses such as stamp
          duty and legal fees.
        </p>

        <h3 className="font-bold text-base mt-5 mb-2">The ROI Formula</h3>
        <p>
          A simple cash-on-cash ROI is calculated as:
        </p>
        <div className="bg-gray-50 rounded-lg p-4 my-3 font-mono text-sm">
          ROI (%) = (Annual Net Cash Flow ÷ Total Cash Invested) × 100
        </div>
        <p>
          For a full investment ROI over a holding period, you also include capital gain:
        </p>
        <div className="bg-gray-50 rounded-lg p-4 my-3 font-mono text-sm">
          Total ROI = (Net Rent Received + Capital Gain − All Costs) ÷ Initial Cash Outlay × 100
        </div>

        <h3 className="font-bold text-base mt-5 mb-2">What Is a Good ROI on a Rental Property?</h3>
        <p>
          In Australia, a gross rental yield of <strong>4–6%</strong> is considered typical for metro areas.
          Net yields (after costs) are commonly <strong>2–4%</strong>. For total ROI including capital
          growth, many investors target <strong>8–12% per annum</strong> over a 10-year period.
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Sydney and Melbourne: lower yields (2.5–3.5%) but historically strong capital growth</li>
          <li>Brisbane and Adelaide: balanced yields (4–5%) with solid recent capital growth</li>
          <li>Perth and regional areas: higher yields (5–7%) but more price volatility</li>
        </ul>

        <h3 className="font-bold text-base mt-5 mb-2">Upfront Costs That Reduce Your ROI</h3>
        <p>
          Many first-time investors underestimate upfront costs. For a $600,000 property in NSW you
          could pay:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Stamp duty: ~$22,490</li>
          <li>Legal / conveyancing fees: ~$1,500–$2,500</li>
          <li>Building &amp; pest inspection: ~$600–$1,000</li>
          <li>Loan establishment fees: ~$500–$1,000</li>
          <li>LMI (if &lt;20% deposit): $8,000–$25,000+</li>
        </ul>
        <p className="mt-3">
          Our <a href="#calculator" className="text-primary-600 underline font-medium">free property ROI calculator</a> includes
          all of these in its upfront cost breakdown and factors them into your net investment return.
        </p>

        <h3 className="font-bold text-base mt-5 mb-2">The Impact of Leverage on ROI</h3>
        <p>
          Leverage amplifies both gains and losses. If a $500,000 property grows by 5% in one year
          ($25,000), but you only put in a $100,000 deposit, your return on equity is 25% — not 5%.
          This is why property ROI calculations should always be expressed relative to the cash you
          actually invested, not the full property value.
        </p>
      </Article>

      {/* ── Article 2 ── */}
      <Article
        id="rental-yield-guide"
        title="Gross vs Net Rental Yield: What Every Investor Must Know"
        summary="Rental yield is the annual rent as a percentage of the property's value. But gross yield and net yield tell very different stories — and confusing them is one of the most common investor mistakes."
      >
        <h3 className="font-bold text-base mt-4 mb-2">Gross Rental Yield</h3>
        <p>
          Gross rental yield ignores all expenses and is the simplest measure:
        </p>
        <div className="bg-gray-50 rounded-lg p-4 my-3 font-mono text-sm">
          Gross Yield (%) = (Annual Rent ÷ Property Value) × 100
        </div>
        <p>
          Example: A property worth $550,000 renting at $450/week earns $23,400/year.
          Gross yield = (23,400 ÷ 550,000) × 100 = <strong>4.25%</strong>.
        </p>

        <h3 className="font-bold text-base mt-5 mb-2">Net Rental Yield</h3>
        <p>
          Net yield deducts all annual holding costs from the rental income before dividing:
        </p>
        <div className="bg-gray-50 rounded-lg p-4 my-3 font-mono text-sm">
          Net Yield (%) = ((Annual Rent − Annual Costs) ÷ Property Value) × 100
        </div>
        <p>
          Using the same example with $10,000 in annual costs:
          Net yield = ((23,400 − 10,000) ÷ 550,000) × 100 = <strong>2.44%</strong>.
        </p>

        <h3 className="font-bold text-base mt-5 mb-2">Typical Annual Holding Costs</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Property management fees: 7–10% of rent (+ GST)</li>
          <li>Council rates: $1,000–$3,000/year</li>
          <li>Water rates: $600–$1,200/year</li>
          <li>Landlord insurance: $1,200–$2,500/year</li>
          <li>Maintenance &amp; repairs: 0.5–1% of property value/year</li>
          <li>Strata fees (units): $2,000–$10,000+/year</li>
          <li>Land tax (where applicable): varies by state and portfolio size</li>
        </ul>

        <h3 className="font-bold text-base mt-5 mb-2">Vacancy Rate and Weeks Rented</h3>
        <p>
          Most calculators assume 52 weeks rented, but realistic investors budget for
          <strong> 1–4 weeks vacancy per year</strong> (48–51 weeks). At $500/week, one extra vacant
          week costs you $500 in lost income. Our calculator lets you input your expected weeks rented
          so your net yield figure is realistic.
        </p>

        <h3 className="font-bold text-base mt-5 mb-2">When Is Yield More Important Than Capital Growth?</h3>
        <p>
          In a high interest rate environment — such as Australia in 2023–2025 with the RBA cash rate
          above 4% — yield matters more because negative cash flow becomes harder to sustain. Investors
          paying 6.5% on their mortgage need a net yield approaching that figure to avoid continuously
          topping up the property from their salary. High-yield properties in regional areas or large
          cities with strong rental demand can provide positive cash flow even at today's rates.
        </p>
      </Article>

      {/* ── Article 3 ── */}
      <Article
        id="stamp-duty-guide-australia"
        title="Stamp Duty Guide for Investment Properties — All Australian States"
        summary="Stamp duty is often the single largest upfront cost after your deposit. Rates vary significantly between states and whether you are a first home buyer, owner-occupier, or investor."
      >
        <h3 className="font-bold text-base mt-4 mb-2">What Is Stamp Duty?</h3>
        <p>
          Stamp duty (formally called land transfer duty or transfer duty in most states) is a state
          government tax payable when you purchase property. It is calculated as a percentage of the
          purchase price using a tiered (progressive) rate scale. For investment properties, no
          concessions typically apply — you pay the standard rate.
        </p>

        <h3 className="font-bold text-base mt-5 mb-2">Stamp Duty Rates by State (2024–25)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">State</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">$500k Property</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">$750k Property</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">FHB Concession?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                ['NSW', '~$17,990', '~$29,240', 'Yes (up to $800k)'],
                ['VIC', '~$21,970', '~$40,070', 'Yes (up to $600k)'],
                ['QLD', '~$8,750', '~$20,250', 'Yes (up to $500k)'],
                ['SA',  '~$21,330', '~$32,830', 'Yes (up to $650k)'],
                ['WA',  '~$17,765', '~$28,453', 'Yes (up to $430k)'],
                ['TAS', '~$18,247', '~$29,747', 'Yes (up to $400k)'],
                ['NT',  '~$23,928', '~$38,928', 'Yes (up to $650k)'],
                ['ACT', '~$14,831', '~$26,081', 'Yes (varies)'],
              ].map(([state, p500, p750, fhb]) => (
                <tr key={state} className="hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium">{state}</td>
                  <td className="px-3 py-2">{p500}</td>
                  <td className="px-3 py-2">{p750}</td>
                  <td className="px-3 py-2 text-xs text-gray-600">{fhb}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">Figures are approximate. Verify with your state revenue office.</p>

        <h3 className="font-bold text-base mt-5 mb-2">Foreign Investor Surcharges</h3>
        <p>
          Non-resident foreign investors face additional stamp duty surcharges in most states:
          NSW (8%), VIC (8%), QLD (7%), SA (7%), WA (7%), ACT (0%). These are in addition to standard
          rates and apply to residential property purchases.
        </p>

        <h3 className="font-bold text-base mt-5 mb-2">ACT Annual Land Tax (Alternative)</h3>
        <p>
          The ACT has replaced stamp duty with a Land Value Tax (rates system) that is paid annually
          rather than upfront. This can benefit long-term investors compared to paying a large lump sum
          at purchase, but must be factored into ongoing cash flow calculations.
        </p>

        <h3 className="font-bold text-base mt-5 mb-2">Minimising Stamp Duty</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Purchase below concession thresholds if eligible as a first home buyer</li>
          <li>Consider off-the-plan purchases in states that offer duty concessions</li>
          <li>Structure your purchase carefully — duty applies to the full purchase price</li>
          <li>Use our calculator to see the exact stamp duty for your target state and price</li>
        </ul>
      </Article>

      {/* ── Article 4 ── */}
      <Article
        id="negative-gearing-explained"
        title="Negative Gearing in Australia: Pros, Cons and Tax Implications"
        summary="Negative gearing occurs when your rental income is less than your interest and holding costs. It's one of the most debated tax strategies in Australian property investment."
      >
        <h3 className="font-bold text-base mt-4 mb-2">What Is Negative Gearing?</h3>
        <p>
          A property is <strong>negatively geared</strong> when the rental income it generates is less
          than the interest repayments and other deductible expenses. The resulting loss can be offset
          against your other taxable income (such as your salary), reducing your overall tax bill.
          This is what makes negative gearing attractive in Australia — it is perfectly legal and
          widely used.
        </p>

        <h3 className="font-bold text-base mt-5 mb-2">Positive vs Neutral vs Negative Gearing</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Positively geared:</strong> Rent &gt; All costs. You earn net income each month.
            You pay tax on the surplus, but the property funds itself (and then some).
          </li>
          <li>
            <strong>Neutrally geared:</strong> Rent ≈ All costs. Break-even cash flow.
          </li>
          <li>
            <strong>Negatively geared:</strong> Rent &lt; All costs. You top up the shortfall from your
            salary, but claim the loss as a tax deduction.
          </li>
        </ul>

        <h3 className="font-bold text-base mt-5 mb-2">The Tax Benefit Calculation</h3>
        <p>
          If your property generates an annual loss of $15,000 and you are on the 37% marginal tax rate,
          the tax saving is <strong>$15,000 × 37% = $5,550</strong>. You are still out of pocket
          $9,450/year — negative gearing only reduces the cost, it does not eliminate it.
        </p>
        <p className="mt-2">
          This strategy only makes economic sense if you expect capital growth to outweigh the cumulative
          out-of-pocket shortfall plus tax on the eventual capital gain.
        </p>

        <h3 className="font-bold text-base mt-5 mb-2">Deductible Expenses for Investment Properties</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Loan interest (not principal)</li>
          <li>Property management fees</li>
          <li>Council rates, water rates, land tax</li>
          <li>Insurance premiums</li>
          <li>Repairs and maintenance (not improvements)</li>
          <li>Depreciation on plant &amp; equipment (Schedule of Depreciation required)</li>
          <li>Building depreciation (2.5%/year for buildings built after 1985)</li>
          <li>Advertising and letting fees</li>
          <li>Accounting fees related to the investment</li>
        </ul>

        <h3 className="font-bold text-base mt-5 mb-2">Capital Gains Tax (CGT) Discount</h3>
        <p>
          When you eventually sell, any capital gain is assessable income. However, if you hold the
          property for more than 12 months, the <strong>50% CGT discount</strong> applies — you only
          pay tax on half the gain. At a 37% marginal rate, the effective CGT rate is 18.5%, making
          long-term property investment significantly more tax-efficient.
        </p>

        <h3 className="font-bold text-base mt-5 mb-2">Is Negative Gearing Right for You?</h3>
        <p>
          Negative gearing suits investors who:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Have a high marginal tax rate (32.5% or above)</li>
          <li>Have stable employment income to cover monthly shortfalls</li>
          <li>Are purchasing in a high-growth area where capital appreciation will exceed cumulative losses</li>
          <li>Have a long investment horizon (7+ years)</li>
        </ul>
        <p className="mt-3 text-sm text-red-500 italic ">
          ** Always consult a registered tax agent or financial adviser about your specific situation.
          The above is general information only and does not constitute tax advice.
        </p>
      </Article>

      {/* ── Article 5 ── */}
      <Article
        id="investment-property-checklist"
        title="Investment Property Due Diligence Checklist (Australia)"
        summary="Before making an offer, smart investors complete thorough due diligence. This checklist covers financial analysis, physical inspection, legal checks, and market research."
      >
        <h3 className="font-bold text-base mt-4 mb-2">Financial Due Diligence</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Calculate gross and net rental yield using current market rent (not asking rent)</li>
          <li>Model cash flow at current interest rates plus a 2% stress-test buffer</li>
          <li>Estimate stamp duty, legal fees, inspection costs and LMI (if applicable)</li>
          <li>Calculate total cash required including 3–6 months' holding costs as a buffer</li>
          <li>Research rental vacancy rates in the suburb (aim for &lt;3%)</li>
          <li>Confirm property management fees and what's included in their service</li>
          <li>Review strata levies, special levies and sinking fund balance (for units)</li>
          <li>Estimate depreciation schedule value with a quantity surveyor</li>
        </ul>

        <h3 className="font-bold text-base mt-5 mb-2">Physical Inspection</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Commission a professional building and pest inspection ($500–$900)</li>
          <li>Check roof condition, drainage, and signs of water ingress</li>
          <li>Inspect electrical switchboard age and condition (older homes may need rewiring)</li>
          <li>Assess hot water system, HVAC, and appliance ages</li>
          <li>Look for asbestos (common in pre-1990 builds) — requires licensed removal</li>
          <li>Assess kerb appeal and general presentation relative to street</li>
        </ul>

        <h3 className="font-bold text-base mt-5 mb-2">Legal and Title Checks</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Search title for encumbrances, easements or caveats</li>
          <li>Check zoning and planning overlays — especially flood, bushfire or heritage overlays</li>
          <li>Obtain strata records (last 2–3 years of AGM minutes) for unit purchases</li>
          <li>Verify lot size and boundaries against council records</li>
          <li>Confirm no outstanding council notices or orders against the property</li>
        </ul>

        <h3 className="font-bold text-base mt-5 mb-2">Market Research</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Analyse comparable sales in the past 3–6 months (not more)</li>
          <li>Research suburb median price growth over 5 and 10 years</li>
          <li>Check planned infrastructure (transport, schools, hospitals) that may drive growth</li>
          <li>Assess supply pipeline — new unit or house builds approved in the area</li>
          <li>Review rental listings and days on market to judge true rental demand</li>
          <li>Consider proximity to employment hubs, universities, and transport nodes</li>
        </ul>

        <div className="mt-4 p-4 bg-primary-50 rounded-lg border border-primary-100">
          <p className="text-sm font-medium text-primary-800">
            💡 Use our <a href="#calculator" className="underline">free property ROI calculator</a> to
            model all the numbers before making an offer. Enter the purchase price, your expected rent,
            and all holding costs to see exactly what your net return and cash flow will be.
          </p>
        </div>
      </Article>
    </section>
  );
}

export default ContentPages;
