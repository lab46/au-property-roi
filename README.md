# PropertyROI.com.au — Deployment Guide

Free Australian property ROI calculator. Static React/Vite app — no backend, no server, no database.

---

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ installed
- A [GitHub](https://github.com) account
- A [Netlify](https://netlify.com) **or** [Vercel](https://vercel.com) account (both are free)
- Your custom domain (e.g. `propertyroi.com.au`) registered and accessible via your domain registrar

---

## Step 1 — Push to GitHub

1. Create a new repository on GitHub (e.g. `property-roi-calculator`). Set it to **Private** or **Public** as preferred.

2. In your terminal, from this folder:

   ```bash
   cd /Users/Shared/property-estimator-project/property-estimator-utility-site
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/property-roi-calculator.git
   git branch -M main
   git push -u origin main
   ```

---

## Option A — Deploy via Netlify (Recommended)

The `netlify.toml` file at the root of this project is pre-configured.

### 1. Connect the Repository

1. Go to [app.netlify.com](https://app.netlify.com) and log in.
2. Click **Add new site → Import an existing project**.
3. Choose **GitHub** and authorise Netlify to access your repositories.
4. Select the `property-roi-calculator` repository.

### 2. Configure Build Settings

Netlify should auto-detect these from `netlify.toml`, but verify:

| Setting | Value |
|---|---|
| Base directory | *(leave blank)* |
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | `18` (set under Site settings → Environment → NODE_VERSION = 18) |

Click **Deploy site**. Your first build will take ~1 minute.

### 3. Add a Custom Domain

1. In your Netlify site dashboard, go to **Domain management → Add a domain**.
2. Enter `propertyroi.com.au` and click **Verify**.
3. Netlify will show you DNS records to add. Go to your domain registrar and add:
   - **A record**: `@` → Netlify's load balancer IP (shown on screen, e.g. `75.2.60.5`)
   - **CNAME record**: `www` → `YOUR-SITE-NAME.netlify.app`
4. Wait for DNS propagation (up to 24–48 hours, usually under 1 hour).
5. Once the domain is verified, click **Enable HTTPS** — Netlify provisions a free SSL certificate via Let's Encrypt automatically.

### 4. Add Google AdSense

Once your AdSense account is approved and the site is live:

1. Open `index.html` and replace:
   ```html
   data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
   ```
   with your real publisher ID, e.g.:
   ```html
   data-ad-client="ca-pub-1234567890123456"
   ```

2. Open `src/App.jsx` and replace the two ad slot IDs:
   ```jsx
   data-ad-slot="1111111111"   ← top banner slot
   data-ad-slot="2222222222"   ← mid-page slot
   ```
   with your real slot IDs from your AdSense account.

3. Commit and push — Netlify will auto-redeploy.

### 5. Add Google Search Console

1. Go to [search.google.com/search-console](https://search.google.com/search-console).
2. Add property → choose **URL prefix** → enter `https://propertyroi.com.au/`.
3. Choose **HTML tag** verification. Copy the `<meta>` tag, e.g.:
   ```html
   <meta name="google-site-verification" content="XXXXXXXXXXXXXXXX" />
   ```
4. Open `index.html` and paste it inside `<head>`, below the existing meta tags.
5. Commit and push, then click **Verify** in Search Console.
6. Submit your sitemap: in Search Console go to **Sitemaps** and enter `sitemap.xml`.

---

## Option B — Deploy via Vercel

The `vercel.json` file at the root of this project is pre-configured.

### 1. Connect the Repository

1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **Add New → Project**.
3. Import your GitHub repository.

### 2. Configure Build Settings

Vercel should auto-detect Vite. Confirm:

| Setting | Value |
|---|---|
| Framework Preset | `Vite` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Install command | `npm install` |

Click **Deploy**.

### 3. Add a Custom Domain

1. In your Vercel project dashboard, go to **Settings → Domains**.
2. Enter `propertyroi.com.au` and click **Add**.
3. Vercel will show DNS records. At your domain registrar, add:
   - **A record**: `@` → `76.76.21.21`
   - **CNAME record**: `www` → `cname.vercel-dns.com`
4. Wait for DNS propagation. Vercel provisions HTTPS automatically once the domain resolves.

### 4. AdSense & Search Console

Follow the same steps as in **Option A — Steps 4 and 5** above.

---

## Redeployment (Future Updates)

Both Netlify and Vercel watch your `main` branch. Any `git push` to `main` triggers an automatic rebuild and redeploy — no manual steps needed.

```bash
# Make your changes, then:
git add .
git commit -m "Update calculator / content"
git push
```

---

## Local Development

```bash
npm install          # first time only
npm run dev          # starts dev server at http://localhost:3002
npm run build        # production build → dist/
npm run preview      # preview the production build locally
```

---

## Files to Update Before Going Live

| File | What to update |
|---|---|
| `index.html` | Replace `ca-pub-XXXXXXXXXXXXXXXX` with real AdSense publisher ID |
| `src/App.jsx` | Replace ad slot IDs `1111111111` and `2222222222` |
| `index.html` | Add Google Search Console `<meta>` verification tag |
| `public/sitemap.xml` | Update `lastmod` date on each redeploy |
| `public/CNAME` | Already set to `propertyroi.com.au` — update if domain changes |
| `public/og-image.png` | Add a real 1200×630 image for social sharing previews |
