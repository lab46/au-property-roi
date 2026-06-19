import { useState } from 'react';

const FAQS = [
  {
    q: 'What is a good ROI for an investment property in Australia?',
    a: 'A good ROI for an Australian investment property is generally 7–10% per year combining rental yield and capital growth. A gross rental yield of 4–6% is typical in major cities, while regional areas may offer 6–8%. Capital growth has historically averaged 5–7% per year in major Australian cities over the long term.',
  },
  {
    q: 'How is rental yield calculated?',
    a: 'Gross rental yield = (Annual Rent ÷ Purchase Price) × 100. Net rental yield subtracts all property expenses (council rates, insurance, maintenance, property management fees) before dividing by the purchase price. This calculator computes both automatically.',
  },
  {
    q: 'What upfront costs should I budget for when buying an investment property?',
    a: 'Key upfront costs include: stamp duty (varies by state and property value — the biggest cost), legal/conveyancing fees ($1,500–$3,000), building and pest inspection ($500–$1,000), lenders mortgage insurance (if deposit is under 20%), and loan application fees. Use this calculator to estimate all these costs together.',
  },
  {
    q: 'How does capital growth affect property investment returns?',
    a: 'Capital growth compounds your property value over time. At 5% annual capital growth, a $500,000 property becomes approximately $2.16 million in 30 years. This growth is typically the dominant driver of long-term property investment returns in Australia, even for cash flow-negative properties.',
  },
  {
    q: 'What is negative gearing in property investment?',
    a: 'Negative gearing occurs when your rental income is less than your property expenses and loan repayments, resulting in a net loss. This loss can be offset against your taxable income in Australia, reducing your tax bill. Many investors accept short-term negative cash flow in exchange for expected long-term capital growth.',
  },
  {
    q: 'How much deposit do I need for an investment property in Australia?',
    a: 'Most lenders require a minimum 20% deposit for an investment property to avoid Lenders Mortgage Insurance (LMI). With a 20% deposit on a $500,000 property, you need $100,000 plus stamp duty and other costs. Some lenders may accept 10–15% deposits with LMI. Enter your deposit amount and the calculator will warn you if LMI applies.',
  },
  {
    q: 'What is Lenders Mortgage Insurance (LMI)?',
    a: 'LMI is a one-off insurance premium charged by the lender when you borrow more than 80% of the property value (LVR above 80%). It protects the lender — not you — if you default. LMI can range from a few thousand dollars to over $15,000 depending on the loan amount and LVR.',
  },
  {
    q: 'How accurate are these property investment calculations?',
    a: 'This calculator provides estimates based on the values you enter. Stamp duty figures are approximations — always verify with your state revenue office. Projections use compound growth assumptions which may not match actual market performance. Results are for educational purposes and should not replace advice from a qualified financial adviser or mortgage broker.',
  },
];

function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <section className="bg-white border-t border-gray-200 py-12" aria-label="Frequently asked questions about property investment ROI">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-2">Property Investment FAQ</h2>
        <p className="text-center text-gray-600 mb-8">Common questions about calculating property ROI, rental yield, and investment returns in Australia</p>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                className="w-full flex justify-between items-center px-5 py-4 text-left font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span>{faq.q}</span>
                <span className={`ml-4 flex-shrink-0 text-primary-600 transition-transform ${open === i ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {open === i && (
                <div className="px-5 pb-4 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* SEO text block */}
        <div className="mt-12 prose prose-sm max-w-none text-gray-600">
          <h3 className="text-xl font-bold text-gray-800 mb-3">About This Property ROI Calculator</h3>
          <p>
            This free Australian property investment calculator helps investors calculate the return on investment (ROI)
            for any residential investment property. Enter the purchase price, deposit, loan details, rental income, and
            ongoing expenses to instantly see rental yield, cash flow, stamp duty, and 30-year investment projections.
          </p>
          <p className="mt-3">
            The calculator covers all Australian states and territories for stamp duty calculations — NSW, VIC, QLD, SA, WA,
            TAS, NT, and ACT — including first home buyer concessions. It also includes interest rate stress testing to help
            you assess how your investment performs if rates rise by 0.25%, 0.50%, or 1.00%.
          </p>
          <p className="mt-3">
            All calculations are performed locally in your browser. No data is sent to any server, and no login is required.
            This tool is designed for educational purposes to help Australian property investors make more informed decisions.
          </p>
        </div>
      </div>
    </section>
  );
}

export default FAQ;
