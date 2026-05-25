# EDUSPARK - Production Launch QA & Verification Checklist

Review this pre-flight check list prior to official dns mapping. All core technical fixes and structural improvements have been completed.

---

## 1. Automated Quality Assurance

### Code and Type Integrity
- [x] **TypeScript Compliance**: Verified that compile-time type-safety is completely intact.
  - Command: `npx tsc --noEmit` -> **Passes with 0 errors**.
- [x] **Next.js Production Build**: Ensures bundle compiles correctly for Vercel production edge servers.
  - Command: `npm run build` -> **Builds successfully**.
- [x] **Lint Integrity**: Confirmed all custom modified files (`Navbar.tsx`, `Footer.tsx`, `Notices.tsx`, `Hero.tsx`, `DailyQuiz.tsx`, `DemoForm.tsx`, etc.) are completely free of ESLint compile warnings.

---

## 2. Technical Feature Audit

### Mobile Responsive & UI Layout
- [x] **Student Success Timeline**: Standardized spacing separators (`space-y-12 lg:space-y-20`), aligned background vertical connect lines on all screen sizes, and configured single-column stacked cards for centered mobile reading.
- [x] **Notice Board Cards**: Scaled block padding (`p-6 sm:p-8`), fine-tuned layout typography parameters, and resolved items-end wrapping bounds.
- [x] **Safe-Area Gutters**: Adjusted floating WhatsApp button with responsive sizing (`w-12 h-12` -> `w-16 h-16`) and margins to avoid overlaying paragraph components.
- [x] **Section Padding Standard**: Changed section padding scales from hardcoded `py-24` to responsive `py-16 sm:py-24` on all viewports, clearing out empty spaces and layout offsets.

---

## 3. SEO, Schema, & Assets

- [x] **Local Business Rich Snippets**: Double JSON-LD schema integrations (`EducationalOrganization` + `CourseList`) injected dynamically inside the main document body.
- [x] **LCP Speed Optimization**: Legitimate Next.js image loading (`priority={true}`) and pre-fetched dimensions applied to the hero visual asset, boosting Google Lighthouse performance scores.
- [x] **Search Bot Rules**: Stored static [robots.txt](file:///Users/sidharthdeora/Desktop/coaching/public/robots.txt) and [sitemap.xml](file:///Users/sidharthdeora/Desktop/coaching/public/sitemap.xml) inside Vercel's public build target folders.
- [x] **Favicon App Icons**: Configured `/src/app/icon.png` using the high-resolution crest logo, prompting Next.js to auto-generate all touch-icons.

---

## 4. Live Integrations Verification

- [x] **Web3Forms Submissions**: Fully connected lead booking pipeline using `fetch` API, FormData, and client-side access key environments.
- [x] **Interactive Maps**: Loaded fully responsive inline Google Maps iframe pointing to Gaushala Road complex, overlaid with a premium HUD glassmorphic card.
- [x] **Directions Button Navigation**: Anchored Google Maps directions routing API to trigger in a new tab:
  - Destination: `Krishna Prime Complex, Sheoganj`.
- [x] **Instagram Brand Link**: Mapped official `@edusparksheoganj` social connection in the footer with custom Lucide-styled SVG tags, targets `_blank`, and safe `rel` attributes.
