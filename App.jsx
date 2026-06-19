import { useState } from 'react';
import Layout from './components/Layout.jsx';
import PropertyForm from './components/PropertyForm.jsx';
import ResultsDisplay from './components/ResultsDisplay.jsx';
import FAQ from './components/FAQ.jsx';
import ContentPages from './components/ContentPages.jsx';
import { calculatePropertyInvestment } from './services/calculationService.js';

function App() {
  const [results, setResults] = useState(null);
  const [inputData, setInputData] = useState(null);
  const [savedFormState, setSavedFormState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCalculate = (formData) => {
    setLoading(true);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
    try {
      const { _rawFormState, ...calcData } = formData;
      setSavedFormState(_rawFormState || null);
      setInputData(calcData);
      const result = calculatePropertyInvestment(calcData);
      setResults(result);
    } catch (err) {
      setError(err.message || 'Failed to calculate property returns');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setInputData(null);
    setSavedFormState(null);
    setError(null);
  };

  const handleEdit = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setResults(null);
    setError(null);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-900 text-black py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold mb-4">
            Free Property ROI &amp; Rental Yield Calculator
          </h1>
          <p className="text-lg text-primary-100 max-w-3xl mx-auto">
            Calculate the return on investment, rental yield, cash flow, stamp duty and 30-year
            projections for any Australian investment property — instantly, no login required.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-primary-200">
            <span className="flex items-center gap-1">✓ Stamp Duty — all states</span>
            <span className="flex items-center gap-1">✓ Gross &amp; Net Rental Yield</span>
            <span className="flex items-center gap-1">✓ 30-Year Projection</span>
            <span className="flex items-center gap-1">✓ Interest Rate Stress Tests</span>
            <span className="flex items-center gap-1">✓ 100% Free, No Signup</span>
          </div>
        </div>
      </section>

      {/* Ad banner — top -->  */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex justify-center">
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
            data-ad-slot="1111111111"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      </div>

      {/* Calculator */}
      <div id="calculator" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 scroll-mt-20">
        {error && (
          <div className="card bg-red-50 border border-red-200 mb-6">
            <div className="flex items-start">
              <span className="text-red-600 text-xl mr-3">⚠️</span>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800">Calculation Error</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800 ml-auto">✕</button>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
          </div>
        )}

        {!loading && !results && (
          <PropertyForm onCalculate={handleCalculate} initialData={savedFormState} />
        )}

        {!loading && results && (
          <ResultsDisplay
            results={results}
            inputData={inputData}
            onReset={handleReset}
            onEdit={handleEdit}
          />
        )}
      </div>

      {/* Ad banner — mid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex justify-center">
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
            data-ad-slot="2222222222"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      </div>

      {/* FAQ — SEO content */}
      <FAQ />

      {/* In-depth guide articles — SEO content pages */}
      <ContentPages />
    </Layout>
  );
}

export default App;
