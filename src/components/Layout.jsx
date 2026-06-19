function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="#calculator" className="flex items-center gap-2">
              <span className="text-2xl">🏠</span>
              <span className="text-xl font-bold text-primary-700">AU Property ROI</span>
            </a>
            <nav className="hidden md:flex items-center gap-5 text-sm text-gray-600">
              <a href="#calculator" className="hover:text-primary-700 font-medium">Calculator</a>
              <a href="#how-to-calculate-property-roi" className="hover:text-primary-700">ROI Guide</a>
              <a href="#rental-yield-guide" className="hover:text-primary-700">Rental Yield</a>
              <a href="#stamp-duty-guide-australia" className="hover:text-primary-700">Stamp Duty</a>
              <a href="#negative-gearing-explained" className="hover:text-primary-700">Negative Gearing</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid sm:grid-cols-3 gap-6 mb-6 text-sm text-gray-600">
            <div>
              <div className="font-semibold text-gray-800 mb-2">🏠 Property ROI Calculator</div>
              <p>Free tool for Australian property investors to calculate rental yield, cash flow, stamp duty and 30-year ROI projections.</p>
            </div>
            <div>
              <div className="font-semibold text-gray-800 mb-2">Calculators</div>
              <ul className="space-y-1">
                <li><a href="#calculator" className="hover:text-primary-700">ROI Calculator</a></li>
                <li><a href="#calculator" className="hover:text-primary-700">Rental Yield Calculator</a></li>
                <li><a href="#calculator" className="hover:text-primary-700">Stamp Duty Calculator</a></li>
                <li><a href="#calculator" className="hover:text-primary-700">Cash Flow Analysis</a></li>
                <li><a href="#calculator" className="hover:text-primary-700">30-Year Projection</a></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-gray-800 mb-2">Investment Guides</div>
              <ul className="space-y-1">
                <li><a href="#how-to-calculate-property-roi" className="hover:text-primary-700">How to Calculate Property ROI</a></li>
                <li><a href="#rental-yield-guide" className="hover:text-primary-700">Gross vs Net Rental Yield</a></li>
                <li><a href="#stamp-duty-guide-australia" className="hover:text-primary-700">Stamp Duty Guide by State</a></li>
                <li><a href="#negative-gearing-explained" className="hover:text-primary-700">Negative Gearing Explained</a></li>
                <li><a href="#investment-property-checklist" className="hover:text-primary-700">Due Diligence Checklist</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} PropertyROI.com.au — Free Australian Property Investment Calculator. For educational purposes only.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
