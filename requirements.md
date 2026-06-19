# Property ROI Calculator — Utility Site Requirements

## Overview

Convert the existing `property-estimator-site` React app into a **standalone, single-page, zero-backend ROI calculator** that is publicly hostable, Google AdSense monetised, and SEO-optimised to rank on the first page of Google for property investment search terms.

All calculation logic already exists client-side in the `calculators/` directory and must be preserved with all existing fields and default values intact.

---

## Source Project

- **Source:** `/property-estimator-project/property-estimator-site`
- **Tech Stack:** React 18, Vite 7, Tailwind CSS v3, Recharts, React Router DOM v6
- **Calculation Engine:** 100% client-side (stamp duty, loan repayments, cash flow, year-by-year projection, ROI/CAGR, stress tests)

---

## Step 1 — Strip Backend & Auth Dependencies

- Remove `@auth0/auth0-react` and all Auth0 configuration from `src/main.jsx` and `.env`
- Remove `axios` and the entire `src/services/apiService.js` file (or gut it to a no-op)
- Remove `src/services/propertyService.js` backend calls (save, fetch, delete property)
- Remove `SavedPropertiesPage` and `ComparePage` pages and their routes from `App.jsx`
- Remove `@auth0/auth0-react` and `axios` from `package.json` dependencies
- Keep all calculator files in `src/calculators/` and `src/services/calculationService.js` untouched

## Step 2 — Collapse to Single Page

- Make `CalculatorPage.jsx` the root `/` route
- Optionally keep a short hero/landing section above the calculator form (good for SEO copy)
- Remove React Router entirely or simplify to a single route (no multi-page navigation needed)
- Delete or stub out `ComparePage.jsx` and `SavedPropertiesPage.jsx`
- Update `Layout.jsx` to remove nav links to removed pages

## Step 3 — Add Google AdSense

- Insert the AdSense `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js">` tag in `index.html` with the publisher ID
- Create a reusable `AdUnit.jsx` component wrapping `<ins class="adsbygoogle">`
- Place ad units in the following positions without disrupting UX:
  - Header banner (below the page title, above the form)
  - Between the input form and results section in `ResultsDisplay.jsx`
  - Footer leaderboard unit
- Use responsive ad sizes (`data-ad-format="auto"`)
- Ensure ads do not render until AdSense script is loaded (avoid layout shift)

## Step 4 — SEO Optimisation

### `index.html` meta tags
- `<title>` — e.g. `Property ROI Calculator | Free Investment Property Return Calculator`
- `<meta name="description">` — 150–160 chars covering keywords: property ROI, rental yield, investment property calculator, Australia
- Open Graph tags: `og:title`, `og:description`, `og:url`, `og:image`, `og:type`
- Twitter Card tags
- `<link rel="canonical" href="https://yourdomain.com/">`
- Google Search Console verification meta tag (placeholder)

### Structured Data (JSON-LD in `index.html`)
- `SoftwareApplication` schema: name, description, applicationCategory, operatingSystem, offers (free)
- `FAQPage` schema with 5–8 common questions about property ROI, rental yield, stamp duty, etc.

### On-page SEO copy
- Add a keyword-rich H1 heading on the page: e.g. "Free Property ROI & Rental Yield Calculator"
- Add a short 2–3 sentence description below the H1 with target keywords
- Add a brief FAQ section below the results (collapsible accordion) with questions like:
  - "What is a good ROI for an investment property?"
  - "How is rental yield calculated?"
  - "What upfront costs should I budget for?"
  - "How does capital growth affect property returns?"
- Add keyword-rich `aria-label` and `label` text on all form fields in `PropertyForm.jsx`

### Files to add
- `public/robots.txt` — allow all, point to sitemap
- `public/sitemap.xml` — single URL entry for the root page with `lastmod` and `changefreq: weekly`
- `public/og-image.png` — 1200×630 social share image (placeholder or generated)

## Step 5 — Static Hosting Configuration

### Vite config (`vite.config.js`)
- Set `base: '/'`
- Set `build.outDir: 'dist'`
- Ensure `build.rollupOptions` produces a single optimised bundle

### Netlify (primary target)
- Add `public/_redirects` file with: `/* /index.html 200` (SPA fallback)
- Add `netlify.toml` with build command `npm run build`, publish dir `dist`, and custom headers for caching static assets

### Vercel (alternative)
- Add `vercel.json` with rewrite rule: `{ "source": "/(.*)", "destination": "/index.html" }`

### GitHub Pages (alternative)
- Install `vite-plugin-gh-pages` or use `gh-pages` npm package
- Add `deploy` script to `package.json`: `"deploy": "npm run build && gh-pages -d dist"`
- Add `public/CNAME` file with the custom domain

### Custom Domain
- Add `public/CNAME` file (GitHub Pages) or configure via hosting platform dashboard
- Ensure HTTPS is enforced (handled automatically by Netlify/Vercel/GitHub Pages)

## Step 6 — Remove Secrets & Harden Config

- Remove all Auth0 and API URL env vars from `.env`
- Add `.env.example` with empty placeholders and comments (no secrets)
- Add `.env` to `.gitignore` if not already present
- Ensure no API keys, tokens, or credentials remain in any source file

---

## All Preserved Fields & Default Values

The following fields must remain exactly as-is in `PropertyForm.jsx`:

### Property Details
| Field | Default |
|---|---|
| Property Address | `'Property Address'` |
| Purchase Price | `500000` |
| Deposit Amount | `100000` |
| Deposit Percentage | `20%` |
| LMI | `0` |
| Legal / Conveyancing Fees | `2000` |
| Building Inspection | `880` |
| Other Upfront Costs | `1000` |
| State | dropdown (all 8 AU states) |
| First Home Buyer | `false` |

### Loan Details
| Field | Default |
|---|---|
| Interest Rate | `6.5%` |
| Loan Term | `30` years |

### Income
| Field | Default |
|---|---|
| Weekly Rent | `$400` |
| Weeks Rented | `48` |
| Property Management Fee | `8%` |

### Expenses (each with frequency selector)
| Field | Default Amount | Default Frequency |
|---|---|---|
| Council Rates | `2000` | yearly |
| Water Rates | `800` | yearly |
| Insurance | `2000` | yearly |
| Repairs & Maintenance | `2000` | yearly |
| Strata/Body Corporate | `0` | yearly |
| Landlord Insurance | `0` | yearly |
| Depreciation | `0` | — |
| Accounting Fees | `0` | quarterly |

### Growth Assumptions
| Field | Default |
|---|---|
| Capital Growth Rate | `5%` per year |
| Rental Growth Rate | `3%` per year |
| Holding Cost Growth | `3%` per year |

### Options
| Field | Default |
|---|---|
| Include Stress Test | `false` |

---

## Target Keywords (SEO)

Primary:
- property ROI calculator
- investment property return on investment calculator
- rental property calculator Australia
- rental yield calculator

Secondary:
- how to calculate property ROI
- property investment calculator free
- gross yield vs net yield calculator
- stamp duty calculator Australia
- 30 year property projection calculator
- capital growth calculator property

---

## Acceptance Criteria

- [ ] App runs with `npm run dev` and builds with `npm run build` without any backend or Auth0 environment variables
- [ ] All form fields present with correct default values
- [ ] ROI, cash flow, gross/net yield, 30-year projection, and stress test results display correctly
- [ ] No network requests made to any backend API
- [ ] Google AdSense script integrated (publisher ID placeholder if not yet approved)
- [ ] `index.html` contains title, meta description, OG tags, canonical URL, and JSON-LD structured data
- [ ] FAQ section visible on page below the results
- [ ] `robots.txt` and `sitemap.xml` present in `public/`
- [ ] `_redirects` (Netlify) or `vercel.json` present for SPA routing fallback
- [ ] No Auth0 or API secrets in any committed file
- [ ] Lighthouse SEO score ≥ 90
- [ ] Lighthouse Performance score ≥ 85
