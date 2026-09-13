# 🚀 SIH26092 — Complete Production Build Roadmap (Updated)
**Project:** AI-Driven Scheme Matching for Marginalized Entrepreneurs  
**Status:** Fully completed production project  
**Timeline:** Sept 14 (00:00) → Sept 15 (08:00 AM) — **32 hours**  
**Stack:** MongoDB + Express + React (Vite) + Node.js | Tailwind CSS v3 | TanStack Query v5

---

## 🔑 Key Change: Automated Scheme Data from Government Websites

> [!IMPORTANT]
> **No hardcoded seed data.** Schemes are fetched automatically from official government websites using a 3-stage pipeline.

### Why No Public Government API Exists
After thorough research, here's the reality:

| Source | Status |
|--------|--------|
| myScheme.gov.in | Next.js SSR, **no public API** — data is rendered server-side |
| API Setu (apisetu.gov.in) | Only document verification APIs, **no scheme data** |
| data.gov.in | Has datasets but **no structured eligibility rules** |
| Individual portals (mudra.org.in, etc.) | **Static HTML pages**, no APIs |

### Our Solution: 3-Stage Auto-Ingestion Pipeline

```
┌─────────────────────┐     ┌──────────────────────┐     ┌───────────────────────┐
│  Stage 1: SCRAPER   │────▶│  Stage 2: AI PARSER  │────▶│  Stage 3: ADMIN       │
│                     │     │                      │     │  REVIEW               │
│  Crawl official     │     │  Gemini API converts │     │                       │
│  govt websites:     │     │  raw HTML/text into  │     │  Admin sees parsed    │
│  • myscheme.gov.in  │     │  structured JSON:    │     │  scheme data, edits   │
│  • nsfdc.nic.in     │     │  • eligibility rules │     │  if needed, approves  │
│  • mudra.org.in     │     │  • benefits/amounts  │     │  → saved to MongoDB   │
│  • standupmitra.in  │     │  • documents needed  │     │  with version history │
│  • nhfdc.nic.in     │     │  • application links │     │                       │
│  • Any URL admin    │     │                      │     │  ✅ Human-in-the-loop │
│    provides         │     │  ⚠️ AI only EXTRACTS │     │  keeps "no AI in      │
│                     │     │  data, never decides │     │  eligibility" promise  │
│  Extract raw HTML   │     │  eligibility         │     │                       │
└─────────────────────┘     └──────────────────────┘     └───────────────────────┘
```

**Why this is a killer feature for judges:**
- "We don't hardcode schemes — we have an automated pipeline that scrapes official portals"
- "AI extracts structured data from government pages, but a human admin always verifies"
- "This means any new scheme published on myScheme.gov.in can be ingested in minutes"
- "The AI only EXTRACTS data — it NEVER decides eligibility. That stays deterministic."

### How Each Stage Works

#### Stage 1: Web Scraper (`backend/src/services/schemeScraper.js`)
```javascript
// Supported sources:
const SOURCES = {
  myscheme: {
    baseUrl: 'https://www.myscheme.gov.in',
    searchUrl: '/search',
    schemePattern: '/schemes/{slug}',
    // Crawl scheme listing pages, extract individual scheme URLs
  },
  nsfdc: { baseUrl: 'https://nsfdc.nic.in', /* ... */ },
  nhfdc: { baseUrl: 'https://nhfdc.nic.in', /* ... */ },
  mudra: { baseUrl: 'https://www.mudra.org.in', /* ... */ },
  standup: { baseUrl: 'https://www.standupmitra.in', /* ... */ },
  custom: null // Admin can paste any URL
};

// Functions:
scrapeSchemeUrl(url)     → raw HTML/text content
scrapeMySchemeList()     → array of scheme URLs from myscheme.gov.in
batchScrape(urls)        → array of { url, rawContent, scrapedAt }
```

Uses: `cheerio` (HTML parser) + `axios` for HTTP requests. No headless browser needed — keeps it lightweight.

#### Stage 2: AI Parser (`backend/src/services/schemeParser.js`)
```javascript
// Uses Google Gemini API to convert raw HTML → structured scheme data
// The prompt is tightly constrained to ONLY extract, never generate

const PARSE_PROMPT = `
You are a data extraction assistant. Given raw HTML content from an Indian 
government scheme page, extract ONLY the following structured data. Do NOT 
invent or assume any information — if a field is not clearly stated, set 
it to null.

Return JSON matching this exact schema:
{
  name: string,
  nameHi: string | null,
  sponsoringBody: string,
  level: "central" | "state",
  state: string | null,
  description: string,
  eligibilityRules: [
    { field: string, operator: string, value: any, 
      ruleType: "hard"|"soft", label: string, labelHi: string|null }
  ],
  benefits: { type: string, amount: number|null, ceiling: number|null,
              subsidyPercent: number|null, description: string },
  documentsRequired: [{ name: string, nameHi: string|null, mandatory: boolean }],
  applicationLink: string | null,
  sourceUrl: string
}

Field mapping for eligibility rules:
- "category" → SC/ST/OBC/EWS/General
- "gender" → male/female/other  
- "isPwD" → true/false
- "isTransgender" → true/false
- "age" → number
- "annualIncome" → number in INR
- "businessStage" → idea/startup_less_1yr/early_1_3yr/established
- "sector" → manufacturing/services/trading/agriculture/artisan/other
- "state" → state name if state-specific
- "ruralOrUrban" → rural/urban

Operators: eq, neq, in, notIn, lte, gte, lt, gt, between, exists
`;

parseSchemeContent(rawHtml, sourceUrl) → structured scheme JSON
batchParse(scrapedResults)            → array of parsed schemes
```

#### Stage 3: Admin Review UI (Frontend)
- Admin clicks **"Fetch New Schemes"** → triggers scraper
- Or Admin pastes a **specific URL** → scrapes just that page
- Parsed results appear in a **review queue** with status: `pending_review`
- Admin can **edit any field** before approving
- On approve → scheme goes live in the corpus with `version: 1`
- On reject → scheme is discarded

### Admin Panel Flow for Auto-Fetch

```
┌──────────────────────────────────────────────────────────────────┐
│  ADMIN PANEL                                                      │
│                                                                    │
│  ┌─── Fetch Schemes ─────────────────────────────────────────┐   │
│  │                                                            │   │
│  │  Option A: 🔍 Fetch from myScheme.gov.in                  │   │
│  │            [Fetch All Entrepreneurship Schemes]            │   │
│  │                                                            │   │
│  │  Option B: 🔗 Fetch from URL                              │   │
│  │            [https://nsfdc.nic.in/schemes/...]  [Fetch]     │   │
│  │                                                            │   │
│  │  Option C: 📋 Bulk URL Import                             │   │
│  │            [Paste multiple URLs, one per line]  [Fetch All]│   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                    │
│  ┌─── Review Queue (3 pending) ──────────────────────────────┐   │
│  │                                                            │   │
│  │  ⏳ Stand-Up India  |  Source: myscheme.gov.in  | [Review] │   │
│  │  ⏳ PMEGP           |  Source: kviconline.gov.in | [Review] │   │
│  │  ⏳ MUDRA Shishu    |  Source: mudra.org.in     | [Review] │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                    │
│  ┌─── Review: Stand-Up India ────────────────────────────────┐   │
│  │                                                            │   │
│  │  Name: [Stand-Up India                          ]          │   │
│  │  Name (Hindi): [स्टैंड-अप इंडिया                  ]          │   │
│  │  Sponsoring Body: [Dept of Financial Services   ]          │   │
│  │  Level: [Central ▼]  State: [N/A              ]           │   │
│  │                                                            │   │
│  │  Eligibility Rules (AI-extracted):                         │   │
│  │  ┌─────────┬──────────┬──────────────┬──────┐             │   │
│  │  │ Field   │ Operator │ Value        │ Type │             │   │
│  │  ├─────────┼──────────┼──────────────┼──────┤             │   │
│  │  │category │ in       │ [SC,ST]      │ hard │  [✏️] [🗑️] │   │
│  │  │gender   │ eq       │ female       │ hard │  [✏️] [🗑️] │   │
│  │  │age      │ gte      │ 18           │ hard │  [✏️] [🗑️] │   │
│  │  │loan amt │ between  │ [10L, 1Cr]   │ hard │  [✏️] [🗑️] │   │
│  │  └─────────┴──────────┴──────────────┴──────┘             │   │
│  │  [+ Add Rule]                                              │   │
│  │                                                            │   │
│  │  Benefits: Loan ₹10L - ₹1Cr | Subsidy: N/A               │   │
│  │  Documents: [Caste cert ✓] [Business plan ✓] [ID ✓]      │   │
│  │  Source: https://myscheme.gov.in/schemes/stand-up-india    │   │
│  │                                                            │   │
│  │  [✅ Approve & Publish]    [✏️ Edit More]    [❌ Reject]    │   │
│  └────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Full Architecture (Updated)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        USER DEVICES                                      │
│  📱 Cheap Android (360px)  │  💻 Desktop  │  🎤 Voice (22 languages)    │
└──────────────┬──────────────────────────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────────────────────────┐
│                    FRONTEND (Vite + React + Tailwind)                     │
│                                                                          │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────┐  ┌────────────────┐  │
│  │ Conversational│  │ Results Page  │  │ Tracker   │  │ Admin Panel    │  │
│  │ Intake Wizard │  │ Ranked Cards  │  │ Pipeline  │  │ + Auto-Fetch   │  │
│  │ (12 steps)   │  │ Why-Matched   │  │ Saved →   │  │ + AI Parse     │  │
│  │ + Voice 🎤   │  │ Doc Checklist │  │ Applied → │  │ + Review Queue │  │
│  │ + Hindi/Eng  │  │ Near-miss     │  │ Approved  │  │ + Rule Builder │  │
│  └──────┬──────┘  └──────┬───────┘  └─────┬─────┘  └───────┬────────┘  │
│         │                │                 │                │            │
│  ┌──────▼────────────────▼─────────────────▼────────────────▼────────┐  │
│  │              TanStack Query v5 (Cache + Mutations + Offline)       │  │
│  └──────────────────────────────┬────────────────────────────────────┘  │
└─────────────────────────────────┼───────────────────────────────────────┘
                                  │ REST API
┌─────────────────────────────────▼───────────────────────────────────────┐
│                    BACKEND (Express + Node.js)                           │
│                                                                          │
│  ┌──────────────┐  ┌─────────────────┐  ┌────────────────────────────┐  │
│  │ Auth Layer   │  │ Rule Engine     │  │ Auto-Ingestion Pipeline    │  │
│  │ JWT + bcrypt │  │ (DETERMINISTIC) │  │                            │  │
│  │ User/Admin   │  │ NO AI — ever    │  │ 1. Scraper (cheerio+axios) │  │
│  │ roles        │  │ 10 operators    │  │ 2. AI Parser (Gemini API)  │  │
│  └──────┬──────┘  └────────┬────────┘  │ 3. Review Queue            │  │
│         │                  │            └─────────────┬──────────────┘  │
│  ┌──────▼──────────────────▼──────────────────────────▼──────────────┐  │
│  │                    MongoDB Atlas                                   │  │
│  │  Schemes │ Users │ Profiles │ Saved │ Versions │ PendingSchemes   │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Complete File Structure

```
Udyam/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                      # MongoDB connection
│   │   ├── models/
│   │   │   ├── Scheme.js                  # Active scheme corpus
│   │   │   ├── PendingScheme.js           # AI-parsed, awaiting admin review
│   │   │   ├── User.js                    # Auth + roles
│   │   │   ├── UserProfile.js             # 12-field entrepreneur profile
│   │   │   ├── SavedScheme.js             # Bookmarked + tracker
│   │   │   └── SchemeVersionHistory.js    # Audit trail
│   │   ├── services/
│   │   │   ├── ruleEngine.js              # CORE: deterministic matching
│   │   │   ├── schemeScraper.js           # NEW: web scraper for govt sites
│   │   │   └── schemeParser.js            # NEW: Gemini AI data extractor
│   │   ├── middleware/
│   │   │   ├── auth.js                    # JWT verify + role guard
│   │   │   └── errorHandler.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── profile.js
│   │   │   ├── match.js
│   │   │   ├── schemes.js
│   │   │   ├── admin.js                   # Includes fetch/parse/review endpoints
│   │   │   └── saved.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── profileController.js
│   │   │   ├── matchController.js
│   │   │   ├── schemeController.js
│   │   │   ├── adminController.js         # Includes ingestion pipeline
│   │   │   └── savedController.js
│   │   └── tests/
│   │       ├── ruleEngine.test.js
│   │       └── schemeParser.test.js
│   └── .gitignore
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env.example
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── api/
│   │   │   ├── queryClient.js
│   │   │   ├── queryKeys.js
│   │   │   ├── apiClient.js
│   │   │   └── hooks/
│   │   │       ├── useAuth.js
│   │   │       ├── useProfile.js
│   │   │       ├── useMatches.js
│   │   │       ├── useSchemes.js
│   │   │       ├── useSaved.js
│   │   │       └── useAdmin.js            # Includes fetch/parse/review hooks
│   │   ├── i18n/
│   │   │   ├── strings.js                 # EN + HI translations
│   │   │   └── voiceLanguages.js          # 22 Indian language configs
│   │   ├── hooks/
│   │   │   ├── useTranslation.js
│   │   │   └── useVoiceInput.js           # Web Speech API (22 languages)
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Layout.jsx
│   │   │   │   └── MobileNav.jsx
│   │   │   ├── intake/
│   │   │   │   ├── IntakeWizard.jsx
│   │   │   │   ├── IntakeStep.jsx
│   │   │   │   ├── RadioCardGroup.jsx
│   │   │   │   ├── NumberInput.jsx
│   │   │   │   ├── StateSelector.jsx
│   │   │   │   ├── ProgressBar.jsx
│   │   │   │   ├── VoiceButton.jsx
│   │   │   │   └── ReviewScreen.jsx
│   │   │   ├── results/
│   │   │   │   ├── ResultsPage.jsx
│   │   │   │   ├── SchemeCard.jsx
│   │   │   │   ├── MatchBadge.jsx
│   │   │   │   ├── WhyMatched.jsx
│   │   │   │   ├── DocumentChecklist.jsx
│   │   │   │   ├── FilterBar.jsx
│   │   │   │   └── NoResults.jsx
│   │   │   ├── tracker/
│   │   │   │   ├── TrackerPage.jsx
│   │   │   │   ├── TrackerCard.jsx
│   │   │   │   └── StatusBadge.jsx
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── SchemeTable.jsx
│   │   │   │   ├── SchemeForm.jsx
│   │   │   │   ├── RuleBuilder.jsx
│   │   │   │   ├── VersionHistory.jsx
│   │   │   │   ├── FetchSchemesPanel.jsx  # NEW: URL input + batch fetch
│   │   │   │   ├── ReviewQueue.jsx        # NEW: pending scheme review
│   │   │   │   ├── SchemeReviewCard.jsx   # NEW: review individual parsed scheme
│   │   │   │   └── AnalyticsPanel.jsx
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   ├── RegisterPage.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   └── ui/
│   │   │       ├── Button.jsx
│   │   │       ├── Card.jsx
│   │   │       ├── Modal.jsx
│   │   │       ├── Input.jsx
│   │   │       ├── Select.jsx
│   │   │       ├── Skeleton.jsx
│   │   │       ├── Toast.jsx
│   │   │       └── OfflineBanner.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── IntakePage.jsx
│   │   │   ├── ResultsPage.jsx
│   │   │   ├── TrackerPage.jsx
│   │   │   ├── AdminPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   └── utils/
│   │       ├── formatCurrency.js
│   │       ├── constants.js
│   │       └── voiceMapper.js
│   └── .gitignore
│
├── README.md
└── roadmap.md
```

---

## 🔌 Complete API Contract (Updated)

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | None | Register user |
| POST | `/api/auth/login` | None | Login → JWT |
| GET | `/api/auth/me` | User | Current user |

### Profile & Matching
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/profile` | User | Create/update profile |
| GET | `/api/profile` | User | Get profile |
| GET | `/api/match` | User | Run rule engine → ranked results |

### Schemes (Public)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/schemes` | None | List active schemes |
| GET | `/api/schemes/:id` | None | Scheme detail |

### Saved/Tracker
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/saved` | User | Bookmark scheme |
| GET | `/api/saved` | User | List saved |
| PUT | `/api/saved/:id` | User | Update tracker status |
| DELETE | `/api/saved/:id` | User | Remove saved |

### Admin — Scheme Management
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/schemes` | Admin | List all schemes (incl. inactive) |
| POST | `/api/admin/schemes` | Admin | Create scheme manually |
| PUT | `/api/admin/schemes/:id` | Admin | Edit scheme (auto-versions) |
| PATCH | `/api/admin/schemes/:id/toggle` | Admin | Toggle active/inactive |
| GET | `/api/admin/schemes/:id/history` | Admin | Version history |

### Admin — Auto-Ingestion Pipeline (NEW)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/admin/fetch-url` | Admin | Scrape + AI-parse a single URL |
| POST | `/api/admin/fetch-batch` | Admin | Scrape + AI-parse multiple URLs |
| POST | `/api/admin/fetch-myscheme` | Admin | Crawl myScheme.gov.in for entrepreneurship schemes |
| GET | `/api/admin/pending` | Admin | List pending review queue |
| GET | `/api/admin/pending/:id` | Admin | Get single pending scheme |
| PUT | `/api/admin/pending/:id` | Admin | Edit pending scheme |
| POST | `/api/admin/pending/:id/approve` | Admin | Approve → moves to live corpus |
| DELETE | `/api/admin/pending/:id` | Admin | Reject/discard |
| GET | `/api/admin/analytics` | Admin | Match stats, near-miss reasons |

---

## ⚙️ Rule Engine (Unchanged — Still 100% Deterministic)

The rule engine remains **completely deterministic** with zero AI involvement:

| Operator | Example | Meaning |
|----------|---------|---------|
| `eq` | `gender == female` | Exact match |
| `neq` | `category != General` | Not equal |
| `in` | `category IN [SC, ST]` | Value in list |
| `notIn` | `sector NOT IN [trading]` | Not in list |
| `lte` | `annualIncome <= 300000` | ≤ threshold |
| `gte` | `age >= 18` | ≥ threshold |
| `lt` / `gt` | `age < 60` | Strict comparison |
| `between` | `age BETWEEN [18, 45]` | Inclusive range |
| `exists` | `isPwD == true` | Boolean check |

**Soft vs Hard rules:**
- **Hard:** category, gender, isPwD, isTransgender (must pass exactly)
- **Soft:** income (10% margin → partial match), age (2-year margin → partial)

**Explainability:** Every result includes human-readable reasons in EN + HI.

---

## 🎤 Voice Input — 22+ Indian Languages

Using **Web Speech API** — built into Chrome/Android, free, no API key:

| Hindi `hi-IN` | Tamil `ta-IN` | Bengali `bn-IN` | Gujarati `gu-IN` |
|---|---|---|---|
| Telugu `te-IN` | Kannada `kn-IN` | Marathi `mr-IN` | Punjabi `pa-IN` |
| Malayalam `ml-IN` | Odia `or-IN` | Assamese `as-IN` | Urdu `ur-IN` |
| Nepali `ne-IN` | Konkani `kok-IN` | Maithili `mai-IN` | Sanskrit `sa-IN` |
| Sindhi `sd-IN` | Dogri `doi-IN` | Bodo `brx-IN` | Manipuri `mni-IN` |
| Santhali `sat-IN` | English `en-IN` | | |

Voice mapper converts spoken words → structured values (e.g. "अनुसूचित जाति" → `SC`).

---

## 🎨 Design System

- **Palette:** Deep Navy `#1e3a5f` + Saffron `#ff6f00` + Green `#2e7d32` (dark mode)
- **Font:** Inter (Google Fonts)
- **Style:** Glassmorphism cards, micro-animations, skeleton loading
- **Mobile-first:** 360px viewport, large tap targets

---

## 🔨 Build Phases (Execution Order)

### Phase 1: Backend Foundation (~1.5 hours)
All Mongoose models (Scheme, PendingScheme, User, UserProfile, SavedScheme, SchemeVersionHistory), DB connection, Express config, JWT auth middleware, error handler

### Phase 2: Rule Engine + Tests (~1.5 hours)
Pure functions: `evaluateRule`, `evaluateScheme`, `matchAllSchemes`. 10 operators, soft/hard rules. Jest test suite with 10+ cases.

### Phase 3: Auto-Ingestion Pipeline (~2.5 hours)
- `schemeScraper.js` — cheerio + axios HTML scraper
- `schemeParser.js` — Gemini API integration for data extraction
- `PendingScheme` model for review queue
- Admin routes for fetch/parse/review/approve flow

### Phase 4: Remaining API Routes (~1.5 hours)
Profile, matching, schemes, saved/tracker, admin CRUD + versioning

### Phase 5: Frontend Foundation (~1.5 hours)
Vite + React + Tailwind + TanStack Query + i18n + routing + Layout

### Phase 6: Frontend Core Pages (~5 hours)
Intake wizard (12 steps) + Voice input + Results page + All components

### Phase 7: Admin Panel + Tracker + Auth (~4 hours)
Admin dashboard, fetch panel, review queue, rule builder, version history, scheme table, tracker, login/register

### Phase 8: Polish + Mobile + Final (~2 hours)
Animations, responsive audit, skeletons, error states, offline banner, README

**Total: ~20 hours** (with ~12 hours buffer)

---

## 🎯 Demo Script (Updated — The "Killer Moments")

### Moment 1: Auto-Fetch (WOW factor)
1. Admin pastes `https://www.myscheme.gov.in/schemes/stand-up-india`
2. System scrapes the page → AI extracts structured data → shows in review queue
3. Admin reviews, tweaks one rule, approves → scheme is LIVE instantly
4. "We can ingest any new government scheme in under 2 minutes"

### Moment 2: User Voice Flow
5. User opens app on mobile → taps 🎤 → speaks "अनुसूचित जाति" in Hindi
6. Auto-fills SC category → completes full intake in 60 seconds
7. Ranked results with "Why you matched" explanations

### Moment 3: Live Admin Update
8. Admin changes NSFDC income limit from ₹3L → ₹2.5L
9. Re-run user profile → NSFDC flips from "Matched" to "Close Match"
10. "Every change is versioned and auditable"

### Moment 4: Architecture Defense
11. "AI extracts data from government pages but NEVER decides eligibility"
12. "The rule engine is 100% deterministic — no hallucination risk"
13. "Every scheme traces to an official government source URL"

---

## ⚠️ Requirements

> [!IMPORTANT]
> **Gemini API Key needed.** The AI parser stage requires a Google Gemini API key. You'll need to get one from [ai.google.dev](https://ai.google.dev) (free tier is sufficient for the demo). Set it as `GEMINI_API_KEY` in your `.env`.

> [!IMPORTANT]
> **MongoDB Atlas connection string needed.** Set as `MONGODB_URI` in `.env`.

---

## ✅ Pre-Submission Checklist

- [ ] Auto-fetch pipeline works (URL → scrape → parse → review → approve)
- [ ] Rule engine passes all Jest tests
- [ ] End-to-end user flow works (register → intake → match → save → track)
- [ ] Admin flow works (fetch URL → review → approve → edit → version history)
- [ ] Voice input works on Chrome (Hindi + English minimum)
- [ ] Hindi/English toggle works on all pages
- [ ] Mobile responsive at 360px
- [ ] Deployed to public URLs (Render + Vercel)
- [ ] README with setup + architecture + design rationale
- [ ] Backup demo video recorded
