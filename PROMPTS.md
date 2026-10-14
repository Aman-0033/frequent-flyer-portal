# Engineering Traceability & Prompt Documentation: `PROMPTS.md`

## 1. Ticket Metadata
- **Ticket ID:** `ENG-163087`
- **Owner / Assignee:** `Aman Saini [PDIT-INT-1252]`
- **Epic:** `Core Infrastructure Overhaul`
- **Component:** `End-to-End Frequent Flyer Portal (Airline Floor Operations)`
- **Tech Stack:** React 18, Vite 6, Tailwind CSS 3, Vitest 2, React Testing Library, Lucide React
- **Status:** **Code Freeze Complete (Capstone 4 Sign-Off) — 100% Tests Passing (20/20)**

---

## 2. Prompt Traceability Log

### Phase 1: Strict TDD Scaffolding & Failing Test Suite
**Role / Intent:** Principal Frontend Architect & QA Lead  
**Prompt Text:**
> Act as a Principal Frontend Architect and QA Lead. We are building an enterprise-grade, digital **End-to-End Frequent Flyer Portal** (Ticket ID: ENG-163087) for airline floor staff to replace manual paper and Excel workflows.
> 
> **CRITICAL WORKFLOW INSTRUCTION (STRICT TDD):** 
> Do NOT write the final UI application code yet. Under our strict Test-Driven Development (TDD) workflow, your task in this step is ONLY to:
> 1. Initialize a clean React + Vite + Tailwind CSS project structure with Vitest and React Testing Library configured.
> 2. Create the stub/skeleton files so imports resolve.
> 3. Write a comprehensive, failing unit and integration test suite (`src/__tests__/FrequentFlyerPortal.test.jsx`) that verifies every single requirement below.
> 
> *(Domain Context, Happy Path, Unhappy Path, NFRs)*

**Phase 1 Deliverables & Outcomes:**
- Scaffolded project structure: `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `index.html`, `src/setupTests.js`, `src/index.css`, `src/main.jsx`.
- Created skeleton/stub files: `FrequentFlyerPortal.jsx`, `sanitizer.js`, `telemetry.js`.
- Authored comprehensive test suite: `src/__tests__/FrequentFlyerPortal.test.jsx` (20 tests covering all functional and non-functional requirements).
- Executed initial test run (`npm test`) confirming 20 / 20 red/failing tests under strict TDD protocol.

---

### Phase 2: Production-Ready Full Implementation
**Role / Intent:** Lead Full-Stack / Frontend Engineer  
**Prompt Text:**
> Now that our TDD test suite is in place, act as a Lead Full-Stack/Frontend Engineer and write the complete, production-ready implementation of the **End-to-End Frequent Flyer Portal** (Ticket ID: ENG-163087) so that 100% of our tests pass.
> 
> **Strict Architectural & Design Constraints:**
> 1. **Monochromatic Corporate Design System:** Clean, high-contrast monochromatic palette (`slate-950`, `slate-900`, `slate-800`, `slate-600`, `slate-200`, `slate-100`, `white`). Semantic red (`red-600` / `red-50`) EXCLUSIVELY for invalid input error states. Strict `16px` (`p-4`, `gap-4`) and `32px` (`p-8`, `gap-8`) spacing steps.
> 2. **Core Floor-Staff Features:** Pre-populated 6 records with `localStorage` persistence, instant search & tier filter with `"No data found"` empty state, Enroll & Log Miles forms with validation, Spotty connection / 3G simulator with loading indicator (`role="status"`, `aria-busy="true"`), XSS Sanitization utility (`src/utils/sanitize.js`), and Telemetry Logger (`src/utils/telemetry.js`) with live telemetry inspection drawer.

**Phase 2 Deliverables & Outcomes:**
- Implemented `src/utils/sanitizer.js` with regex-based tag, script, and style stripping.
- Implemented `src/utils/telemetry.js` with console logging (`[Analytics] User interacted with End-to-End Frequent Flyer Portal`) and reactive event subscription.
- Implemented `src/components/FrequentFlyerPortal.jsx` with full state persistence, responsive roster, search/filter, dual forms, offline queue, and live telemetry inspection drawer.
- Verified test suite: 20 / 20 tests passing.

---

### Phase 3: Final Polish (Capstone 4) & Code Freeze
**Role / Intent:** Principal QA Lead & Frontend Architect  
**Prompt Text:**
> We are entering the **Final Polish (Capstone 4) Code Freeze** for Ticket ID: `ENG-163087` (Assigned to: Aman Saini `[PDIT-INT-1252]`).
> Execute the following final verification and documentation tasks:
> 1. **Linter & Build Audit:** Check all files for any unused imports, missing React keys, prop issues, or ESLint warnings. Run the production build (`npm run build`) and test suite (`npm test`) to confirm zero fatal errors.
> 2. **Accessibility (a11y) Audit:** Verify every `<input>`, `<select>`, and `<button>` has an explicit `aria-label` or bound `<label htmlFor="...">`, proper `aria-invalid` and `aria-describedby` bindings for red error states, and `aria-live="polite"` on the `"No data found"` empty state and loading indicators.
> 3. **Generate `PROMPTS.md` in the Root Directory:** Create a comprehensive, well-structured `PROMPTS.md` file in the repository root documenting Ticket Metadata, Prompt Traceability Log, and Architectural Verification Matrix.

**Phase 3 Deliverables & Outcomes:**
- Cleaned unused imports in `src/components/FrequentFlyerPortal.jsx`.
- Verified explicit accessibility bindings (`aria-label`, `<label htmlFor>`, `aria-describedby`, `aria-invalid`, `aria-live="polite"`).
- Production build succeeded (`npm run build` in 4.59s).
- Vitest suite passed 100% (20 / 20 tests passing).
- Generated complete `PROMPTS.md` sign-off documentation.

---

## 3. Architectural Verification Matrix

| TRD Requirement | Design & Architectural Implementation | File Location | Function / Component | Test Case in Test Suite | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **Enterprise Header & Branding** | Header with `role="banner"`, ticket ID badge `ENG-163087`, and floor operations title | `src/components/FrequentFlyerPortal.jsx` | `<header role="banner">` | `renders the portal header with enterprise branding and ticket ID reference` | **PASS** |
| **Summary Metrics Cards** | 4-card metric grid: Total Members, Platinum Members, Gold Members, and Total Miles Logged | `src/components/FrequentFlyerPortal.jsx` | `<section role="region" aria-label="Summary Metrics">` | `renders summary metrics: Total Members, Active Platinum/Gold counts, and Total Miles Logged` | **PASS** |
| **Roster Data Table** | Semantic `<table>` with headers: Member ID, Full Name, FF Number, Tier Status, Points Balance, Last Flight Code | `src/components/FrequentFlyerPortal.jsx` | `<table role="table" aria-label="Frequent Flyer Roster">` | `renders member data table with all required columns and initial floor roster` | **PASS** |
| **Real-Time Search** | Case-insensitive instant filtering by passenger name or frequent flyer number | `src/components/FrequentFlyerPortal.jsx` | `handleSearchChange()` | `filters member roster immediately when floor staff types into search bar` | **PASS** |
| **Tier Status Filter** | Dropdown filtering by `All`, `Silver`, `Gold`, `Platinum` with `data-testid="tier-badge"` | `src/components/FrequentFlyerPortal.jsx` | `handleTierChange()` | `filters member roster immediately by Tier Status dropdown` | **PASS** |
| **Member Enrollment** | Validated passenger onboarding form; adds to state & `localStorage`, logs telemetry | `src/components/FrequentFlyerPortal.jsx` | `handleEnrollSubmit()` | `successfully enrolls a new Frequent Flyer member and updates roster and summary metrics` | **PASS** |
| **Mileage Crediting** | Passenger selection, positive integer validation, updates balance & latest flight code | `src/components/FrequentFlyerPortal.jsx` | `handleLogMilesSubmit()` | `successfully logs miles to an existing member and reflects updated points balance and total miles` | **PASS** |
| **Local Persistence** | `localStorage` read/write synchronization under key `frequent_flyer_roster` | `src/components/FrequentFlyerPortal.jsx` | `saveMembersToStorage()` | `persists data to localStorage to support floor Wi-Fi reconnection/reloads` | **PASS** |
| **Empty State ("No data found")** | Accessible `role="status"` empty state with `aria-live="polite"` and "Reset Filters" action | `src/components/FrequentFlyerPortal.jsx` | Empty state container | `renders an accessible "No data found" empty state when search matches no members` & `renders an accessible empty state when the roster is completely empty` | **PASS** |
| **Network Simulator & Async Loader** | Network mode selector (`online`, `slow-3g`, `offline`), loading indicator (`role="status"`, `aria-busy="true"`, `aria-live="polite"`) | `src/components/FrequentFlyerPortal.jsx` | `handleRefresh()` / `handleNetworkChange()` | `displays visible loading indicator with role="status" and aria-busy="true" during network operations` | **PASS** |
| **Offline Queue Mode** | Catches operations during floor Wi-Fi disconnect, saves locally, displays `Saved locally (queued for sync)` | `src/components/FrequentFlyerPortal.jsx` | `offlineQueue` state / alert banner | `gracefully handles offline state and queues updates without crashing` | **PASS** |
| **Input Error States (Semantic Red)** | Highlights invalid inputs with `border-red-600 bg-red-50/10`, sets `aria-invalid="true"`, binds `aria-describedby` error text | `src/components/FrequentFlyerPortal.jsx` | `handleEnrollSubmit()` / `handleLogMilesSubmit()` | `prevents form submission and marks empty required inputs with border-red-600 and aria-invalid="true"` | **PASS** |
| **FF Number Format Validation** | Enforces regex `/^FF-\d{4,5}$/i`, displays contextual error feedback | `src/components/FrequentFlyerPortal.jsx` | `handleEnrollSubmit()` | `rejects invalid FF Number format and highlights field with border-red-600` | **PASS** |
| **Negative Mileage Prevention** | Rejects non-positive or NaN values with `Miles must be a positive number` | `src/components/FrequentFlyerPortal.jsx` | `handleLogMilesSubmit()` | `rejects negative miles and displays validation error` | **PASS** |
| **Accessibility (a11y) 100% Compliance** | Explicit `aria-label` and `<label htmlFor>` on all controls, high-contrast keyboard focus rings | `src/components/FrequentFlyerPortal.jsx` | All JSX controls | `Accessibility (a11y): all interactive controls have explicit aria-label and proper label association` | **PASS** |
| **Keyboard Navigability** | Seamless tab sequence (Searchbox directly into Tier Filter dropdown) | `src/components/FrequentFlyerPortal.jsx` | Search and Filter section | `Accessibility (a11y): supports full keyboard navigability for floor staff` | **PASS** |
| **Telemetry Simulation (Console & UI)** | Dispatches `[Analytics] User interacted with End-to-End Frequent Flyer Portal` with action metadata; live UI feed | `src/utils/telemetry.js` | `logTelemetry()` | `Telemetry Simulation: triggers console.log on primary user interactions with metadata` | **PASS** |
| **XSS Sanitization Engine** | Strips `<script>`, `<style>`, and raw HTML tags/event handlers before state persistence | `src/utils/sanitizer.js` | `sanitizeInput()` | `Security (XSS Sanitization): strips malicious HTML and script tags from text inputs before saving` & unit test | **PASS** |
| **Monochromatic Design System** | Palette restricted to `slate-950` through `slate-100` and `white`; strict `16px` (`p-4`) / `32px` (`p-8`) spacing steps | `src/components/FrequentFlyerPortal.jsx` & `tailwind.config.js` | Tailwind utility classes | Visual inspection & TRD design compliance | **PASS** |

---

## 4. Final Code Freeze Sign-Off
- **Test Suite Result:** 20 passed (100% pass rate) in 6.86s.
- **Production Build:** Vite production bundle built in 4.59s with zero fatal errors or bundle warnings.
- **Verification Sign-Off:** All functional, non-functional, security, accessibility, and architectural requirements for Ticket `ENG-163087` have been satisfied.
