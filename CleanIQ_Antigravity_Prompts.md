# CleanIQ — Build Prompts for Antigravity (Claude Opus 4.6)

**Stack locked in:** React (Vite) + TailwindCSS · Node.js/Express + MongoDB (Mongoose) · Claude API for insights · Fake/mock payment · Mock OTP auth

Use these prompts **in order**, one at a time. Let Antigravity finish and verify each step before moving to the next — don't paste them all at once, since later prompts assume earlier code exists. Each prompt is self-contained enough to paste directly.

---

## Prompt 0 — Project Vision & Design System (paste this first, always)

This sets the aesthetic direction for everything after it. Keep it in your working context / project instructions if Antigravity supports a persistent system prompt.

```
I'm building CleanIQ — a web app where data analysts upload messy datasets 
(CSV/Excel), get an automatic data quality report (data types, null counts, 
duplicate rows, misprinted values), can edit/override the cleaning decisions, 
and then generate an AI-powered insights dashboard.

TECH STACK (do not deviate):
- Frontend: React + Vite, TailwindCSS, Framer Motion for micro-animations, 
  Recharts for charts, React Router for navigation
- Backend: Node.js + Express, MongoDB with Mongoose
- Auth: phone number + OTP (mocked for now — OTP is generated and returned 
  to frontend for display, not actually sent via SMS)
- AI: Anthropic Claude API called server-side only, never exposed to frontend
- Payments: fake/mocked subscription — no real payment gateway

DESIGN DIRECTION:
- Modern, premium SaaS aesthetic — think Linear, Vercel, or Notion's polish 
  level, not a generic Bootstrap admin template
- Full light/dark theme support with a toggle, using CSS variables / Tailwind 
  dark mode (class strategy), persisted in localStorage
- Distinct visual identity: pick a real accent color palette (not default 
  blue-600/gray-500 Tailwind defaults) and a proper type scale — suggest and 
  use a Google Font pairing (one for headings, one for body)
- Generous whitespace, soft shadows/borders instead of heavy dividers, subtle 
  hover/transition states on all interactive elements
- Fully responsive: mobile-first, test the layout logic at 375px, 768px, 
  and 1280px breakpoints
- Avoid: purple gradient hero sections, generic card grids with emoji icons, 
  centered-everything layouts — make deliberate layout choices instead

Set up the project structure now:
1. /frontend — Vite + React + Tailwind, folder structure: 
   src/components, src/pages, src/context (for theme + auth), src/api, src/hooks
2. /backend — Express + Mongoose, folder structure: 
   routes, controllers, models, middleware, config, utils
3. Configure Tailwind with a custom theme (colors, fonts, spacing) reflecting 
   the design direction above — show me the tailwind.config.js and a global 
   CSS file with the font imports and CSS variables for both themes
4. Set up a ThemeContext with light/dark toggle, wired into a floating toggle 
   button component (top-right of the nav)
5. Set up basic Express server with MongoDB connection (use a .env for 
   MONGO_URI), CORS configured for the Vite dev server, and a health-check route

Don't build any features yet — just get this foundation running cleanly and 
show me the folder tree and key config files.
```

---

## Prompt 1 — Authentication (Phone + Mock OTP)

```
Build phone number + OTP authentication for CleanIQ.

BACKEND:
- User model (Mongoose): phoneNumber (unique), createdAt, isSubscribed 
  (boolean, default false), datasetsCleanedCount (number, default 0)
- OTP model or in-memory/Redis-free approach: store a generated 6-digit OTP 
  with the phone number and a 5-minute expiry (a temporary MongoDB collection 
  is fine, no need for Redis)
- POST /api/auth/send-otp — accepts phoneNumber, generates a 6-digit OTP, 
  saves it with expiry, and returns the OTP directly in the API response 
  with a field like "devOtp" (since we're not sending real SMS — this is a 
  mocked flow for demo purposes, clearly comment this in the code)
- POST /api/auth/verify-otp — accepts phoneNumber + otp, checks match and 
  expiry, creates the user if they don't exist, issues a JWT (store in 
  httpOnly cookie or return in response — your call, but be consistent with 
  how the frontend will store it)
- Auth middleware that verifies the JWT and attaches the user to req.user

FRONTEND:
- A clean two-step auth page: phone number input → OTP input (6 separate 
  boxes with auto-advance between them, standard OTP UX)
- Since OTP is mocked, show the received devOtp in a subtle toast/banner 
  ("Demo mode: your OTP is 483920") so the flow is demonstrable without real SMS
- AuthContext that holds the current user and exposes login/logout, checks 
  auth status on app load
- Protected route wrapper component that redirects to /login if not authenticated
- Match the design system from before — same fonts, theme-aware, responsive, 
  smooth transition between the phone-entry and OTP-entry steps
```

---

## Prompt 2 — Dataset Upload & Cleaning Engine

```
Build the core data upload and cleaning feature for CleanIQ.

BACKEND:
- Dataset model: userId, originalFilename, uploadedAt, status 
  (uploaded/cleaned/insights_generated), storagePath, rowCount
- DatasetColumn model: datasetId, columnName, inferredDtype, 
  userOverrideDtype (nullable), nullCount, duplicateCount, sampleValues (array)
- POST /api/datasets/upload — multer middleware to accept CSV/XLSX, save to 
  a local /uploads folder, parse with papaparse (CSV) or the xlsx package 
  (Excel), and run analysis:
  - infer each column's data type (number, string, date, boolean) by 
    sampling values
  - count nulls/empty/NaN per column
  - detect duplicate rows (full-row duplicates) and flag them
  - detect likely "misprinted" values — e.g. a mostly-numeric column with a 
    few stray text values, or inconsistent date formats
  - save all this as DatasetColumn documents, return the full report as JSON
- Middleware: enforce the free-tier limit — check req.user.datasetsCleanedCount 
  before allowing more than 5 uploads unless isSubscribed is true, return 
  a 402 status with a clear message if exceeded
- PATCH /api/datasets/:id/columns/:columnId — let the user override a 
  column's dtype
- POST /api/datasets/:id/clean — apply the confirmed cleaning rules 
  (drop/flag duplicates, cast dtypes, handle nulls per user choice: drop row, 
  fill with mean/mode, or leave as-is), save the cleaned file, increment 
  datasetsCleanedCount, set status to "cleaned"

FRONTEND:
- A drag-and-drop upload zone (styled, with file-type validation feedback)
- After upload, show a data quality report screen:
  - Summary cards at top: total rows, total columns, total nulls, total 
    duplicates
  - A table below listing each column: name, inferred type (as an editable 
    dropdown), null count, duplicate flag count, a few sample values
  - Per-column null-handling choice (dropdown: drop rows / fill mean-mode / 
    leave as-is)
  - A sticky "Apply Cleaning" button at the bottom
- Loading states during upload/processing (skeleton loaders, not just a spinner)
- If the free-tier limit is hit, show an upgrade prompt instead of an error 
  page — this should feel like a natural upsell moment, not a dead end
- Fully responsive — the column table should become horizontally scrollable 
  or stack sensibly on mobile
```

---

## Prompt 3 — Fake Subscription / Payment

```
Build a mocked subscription flow for CleanIQ. This is intentionally fake — 
no real payment gateway — but should look and behave like a real upgrade flow.

BACKEND:
- POST /api/subscription/upgrade — takes the authenticated user, sets 
  isSubscribed to true on their User document, returns success. No payment 
  validation of any kind — comment clearly in the code that this is a mocked 
  endpoint standing in for a real gateway like Stripe/Razorpay
- POST /api/subscription/cancel — sets isSubscribed back to false, for 
  demo/testing convenience

FRONTEND:
- A pricing/upgrade page — Free tier (5 datasets, cleaning only) vs Pro tier 
  (unlimited cleaning + AI insights), styled as proper pricing cards
- Clicking "Upgrade to Pro" opens a modal with a fake payment form (card 
  number, expiry, CVV inputs — accept any input, no real validation needed, 
  maybe just require non-empty fields for UX realism)
- On "Pay Now", call the upgrade endpoint, show a success animation/toast, 
  update the AuthContext user state, redirect back to the dataset
- Add a small "Demo Mode — no real payment is processed" note somewhere 
  visible on this page, since this is a college project
```

---

## Prompt 4 — AI Insights Dashboard

```
Build the AI-powered insights dashboard for CleanIQ — this is the paid feature.

BACKEND:
- POST /api/datasets/:id/insights — protected route:
  - First check req.user.isSubscribed OR datasetsCleanedCount < 5 
    (free-tier logic already exists — reuse that gating middleware)
  - If not allowed, return 402
  - If allowed: load the cleaned dataset, compute summary statistics with 
    plain JS (column means/medians for numeric columns, top categories for 
    categorical columns, correlations if feasible) — do NOT send raw row 
    data to the AI, only the computed summary, to keep tokens low
  - Call the Anthropic API (use @anthropic-ai/sdk) with a prompt that gives 
    it the summary stats and asks for: 3-5 written insights in plain 
    language, and a JSON array of suggested chart configs (chart type, 
    which columns, a short title) that the frontend can render
  - Parse the response, save it as an Insight document (datasetId, 
    generatedText, chartConfigs, generatedAt), return it
- Insight model: datasetId, generatedText (array of strings), chartConfigs 
  (array of {type, xKey, yKey, title}), generatedAt

FRONTEND:
- A dashboard page for a cleaned dataset: 
  - Written insights displayed as a clean list/cards at the top
  - Below that, render the suggested charts using Recharts — map the 
    chartConfigs from the API to actual bar/line/pie components dynamically
  - A "Regenerate Insights" button 
  - Loading state while the AI call is in progress (this can take a few 
    seconds — show a proper loading animation, not a blank screen)
- If the user isn't subscribed and has used their free datasets, this 
  button should route them to the upgrade page from Prompt 3 instead of 
  hitting the API
- Fully responsive chart grid — charts stack on mobile, grid on desktop
```

---

## Prompt 5 — Polish Pass

```
Do a final polish pass across CleanIQ:
1. Add a proper landing/marketing page at "/" — hero section explaining the 
   product, how-it-works steps, pricing preview — this is what a logged-out 
   user sees before going to /login
2. Add a dashboard/home page after login showing the user's uploaded 
   datasets as a list/grid with status badges (uploaded/cleaned/has insights)
3. Consistent empty states (no datasets yet, no insights yet) with clear 
   calls to action instead of blank screens
4. Consistent error handling — toast notifications for API errors instead 
   of console-only errors
5. Add page transition animations with Framer Motion between routes
6. Do a full responsive audit — check every page at mobile width, fix any 
   overflow, cramped touch targets, or broken layouts
7. Add a favicon and page titles per route
```

---

### Notes for you
- Run each prompt, test the result works, **then** move to the next — don't chain them blind.
- If Antigravity's output drifts from the design direction (goes generic), re-paste the design-system paragraph from Prompt 0 as a reminder — it's common for long sessions to lose earlier style context.
- The one real external dependency is your Anthropic API key for Prompt 4 — everything else runs with just Node + MongoDB installed locally (MongoDB Atlas free tier works fine if you don't want to install it locally).
