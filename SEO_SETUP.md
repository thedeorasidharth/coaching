# EDUSPARK - Search Engine Optimization (SEO) Setup Guide

The EDUSPARK platform has been optimized to target high-intent local search queries, achieve rich structured snippet markup, and rank successfully in the Sirohi/Sheoganj district.

---

## 1. Targets and Keywords Index
We have strategically targeted the following local search terms:
- `IIT JEE coaching in Sheoganj`
- `NEET coaching in Sheoganj`
- `Best coaching institute in Sheoganj`
- `Physics coaching in Sheoganj`
- `XI XII foundation classes`
- `Coaching near Ambuja Cement Sheoganj`
- `EDUSPARK Sheoganj`

---

## 2. Integrated SEO Architecture
- **Canonical Optimization**: Fully configured dynamic `<link rel="canonical">` to prevent duplicate tracking penalties.
- **Search Metadata**: Upgraded layout descriptors containing OpenGraph (OG) and Twitter summary cards to display rich embeds when links are shared on social platforms.
- **Timezone/Locale Agnostic Dates**: Eliminated locale discrepancies inside notices by serving deterministic dates (`20 May 2026` format), securing error-free, static-rendered SEO markup.

---

## 3. Structured Data Schema (JSON-LD)
We have injected two heavy JSON-LD schemas inside **[layout.tsx](file:///Users/sidharthdeora/Desktop/coaching/src/app/layout.tsx)**:

1. **`EducationalOrganization` Schema**:
   - Outlines center hours (3:00 PM to 7:00 PM), physical geographic coordinates (`latitude: 25.1481`, `longitude: 73.0182`), contact hotlines (`+91 9460234151`), and verified addresses for direct indexing.
2. **`Course` List Schema**:
   - Formally index courses (IIT-JEE, NEET-UG, and science board foundations) with detailed curriculum descriptions and institution bindings.

---

## 4. Google Search Console & Analytics Integration

### Step A: Claiming Domain Ownership
1. Go to [Google Search Console](https://search.google.com/search-console).
2. Input your domain `edusparksheoganj.com` under **Domain property**.
3. Copy the generated `TXT` record.
4. Go to your domain registrar's DNS settings, add a new `TXT` record, paste the value, and click **Verify**.

### Step B: Submitting Sitemap
1. Inside Search Console, click **Sitemaps** in the left navigation panel.
2. Under "Add a new sitemap", type `sitemap.xml` and click **Submit**.
3. Search Console will parse the static [sitemap.xml](file:///Users/sidharthdeora/Desktop/coaching/public/sitemap.xml) file and crawl the homepage immediately.

### Step C: Google Analytics (GA4) Setup
1. Open [Google Analytics](https://analytics.google.com).
2. Create a new GA4 web stream for `https://edusparksheoganj.com`.
3. Copy the **Measurement ID** (e.g. `G-XXXXXXXXXX`).
4. To integrate GA4, add this tracking snippet directly inside the `<head>` of your `src/app/layout.tsx`:
   ```tsx
   <script async src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}></script>
   <script dangerouslySetInnerHTML={{
     __html: `
       window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);}
       gtag('js', new Date());
       gtag('config', 'G-XXXXXXXXXX');
     `
   }} />
   ```
