# End-to-End Frequent Flyer Portal: Complete Walkthrough Guide
**Ticket ID:** `ENG-163087`  
**Assignee:** Aman Saini `[PDIT-INT-1252]`  
**Epic:** Core Infrastructure Overhaul  
**Live URL:** [http://127.0.0.1:5173/](http://127.0.0.1:5173/)

---

## 1. Executive Summary
The **Frequent Flyer Portal** is an enterprise-grade digital portal engineered for airline floor and gate staff. It replaces legacy manual paper records and spreadsheets with a resilient, high-contrast, accessible application capable of operating reliably on spotty airport floor Wi-Fi.

---

## 2. Interactive Feature Walkthrough

### Step 1: Floor Roster Inspection & Real-Time Metrics
1. When the portal loads, floor staff immediately see high-level summary cards at the top:
   - **Total Members:** Total loyalty passengers enrolled (pre-seeded with 6 records).
   - **Platinum Members:** High-priority tier tally.
   - **Gold Members:** Mid-tier loyalty count.
   - **Total Miles Logged:** Aggregated loyalty mileage across all active passengers (493,200 miles initial).
2. The **Roster Table** displays all passenger metadata:
   - `Member ID`, `Full Name`, `FF Number`, `Tier Status` badge, `Points Balance`, and `Last Flight Code`.

---

### Step 2: Instant Search & Tier Filtering
1. **Search by Name or FF Number:**
   - Click the search input (`Search by passenger name or frequent flyer number...`).
   - Type `FF-1001` or `John` — the table instantly filters down to John Doe.
   - Type `Sarah` or `DL-812` to search across different criteria.
2. **Filter by Loyalty Tier:**
   - Press `Tab` from the search bar to jump directly into the **Tier Status Filter** dropdown.
   - Select `Platinum` — the roster instantly updates to show only Platinum members (`John Doe` and `Elena Rostova`), with badges matching the status.
   - Select `All Tier Statuses` to restore full roster view.

---

### Step 3: "No Data Found" Empty State
1. In the search box, type a non-existent passenger name like `XYZ-9999`.
2. Notice the table gracefully transitions into an accessible empty state:
   - Displays a clean search icon with the heading **"No data found"**.
   - Helper text: *"No frequent flyer members match your search criteria. Please adjust your query or reset filters."*
   - A single-click **"Reset Filters"** button.
3. Click **"Reset Filters"** to clear the query and restore the full roster.

---

### Step 4: Enrolling a New Frequent Flyer Member
1. Scroll down to the **Enroll Frequent Flyer** card (left column).
2. **Form Validation Checks (Semantic Red State):**
   - Click **"Enroll Member"** with empty fields.
   - Offending fields (`Full Name` and `Frequent Flyer Number`) immediately display high-contrast red borders (`border-red-600 bg-red-50/10`), `aria-invalid="true"`, and clear inline validation messages.
   - Type `INVALID-123` into the FF Number input and submit. Notice the strict pattern validation triggers: *"Frequent Flyer Number must follow format FF-####"*.
3. **Valid Submission & XSS Sanitization:**
   - Enter **Full Name**: `Amelia Earhart`
   - Enter **Frequent Flyer Number**: `FF-9901`
   - Select **Tier Status**: `Gold`
   - Enter **Initial Points**: `45000`
   - Enter **Last Flight Code**: `BA-2490`
   - Click **"Enroll Member"**.
4. The new passenger is instantly prepended to the roster table, summary metrics update automatically, and state is preserved in `localStorage`.

---

### Step 5: Logging Flight Miles for Passengers
1. Locate the **Log Flight Miles** card (right column).
2. Select an existing member from the dropdown (e.g., `FF-1001 — John Doe (Platinum)`).
3. **Negative Miles Validation:**
   - Type `-500` into **Miles to Add** and click **"Log Flight Miles"**.
   - The field is flagged red with the message: *"Miles must be a positive number"*.
4. **Valid Mileage Credit:**
   - Enter **Miles to Add**: `5000`
   - Enter **New Flight Code**: `LH-400`
   - Click **"Log Flight Miles"**.
5. John Doe's mileage balance increments from `125,000 pts` to `130,000 pts`, the latest flight code updates to `LH-400`, the global **Total Miles Logged** tally increases, and a success banner appears.

---

### Step 6: Airport Wi-Fi Resilience & Offline Queue Mode
1. In the header bar, click the **Network Mode** selector.
2. **Simulate Slow 3G (800ms delay):**
   - Select `Slow 3G (800ms delay)` and click **"Refresh Floor Data"**.
   - Observe the accessible loading indicator (`role="status"`, `aria-busy="true"`, `aria-live="polite"`) with spinner animation during the async delay.
3. **Simulate Offline Ground Mode:**
   - Select `Offline Queue Mode`.
   - An alert banner displays: *"Offline Mode — Airport Wi-Fi disconnected. Actions will queue locally."*
   - Enroll a member or log miles while offline.
   - The notification confirms: *"Saved locally (queued for sync)"*, the badge shows the queued item count, and data remains persistent in `localStorage` without application crash.

---

### Step 7: Live Telemetry Inspection Drawer
1. Scroll to the footer bar at the bottom.
2. Click **"Inspect Feed"**.
3. Evaluators can view a live stream of telemetry payloads triggered by user actions (`SEARCH_MEMBERS`, `FILTER_BY_TIER`, `ENROLL_MEMBER`, `LOG_MILES`, `CONNECTIVITY_CHANGE`).
4. Every interaction simultaneously dispatches:
   ```text
   [Analytics] User interacted with End-to-End Frequent Flyer Portal
   ```
   to the developer console for backend analytics compliance.
5. Click **"Clear"** to purge the live UI feed or **"Hide Feed"** to collapse.

---

## 3. Strict Design System & Accessibility (a11y) Rules

| Constraint | Implementation Detail |
| :--- | :--- |
| **Monochromatic Palette** | Built exclusively using Tailwind's slate scale (`slate-950`, `slate-900`, `slate-800`, `slate-700`, `slate-400`, `slate-300`, `slate-100`, `white`). |
| **Semantic Red Rule** | Red (`border-red-600 bg-red-50/10 text-red-500`) is used strictly for input error boundaries. No rogue decorative colors. |
| **Spacing System** | Enforced layout steps of `16px` (`p-4`, `gap-4`) and `32px` (`p-8`, `gap-8`) across all cards, containers, and table padding. |
| **Keyboard Navigation** | Tabbing from the search input focuses directly onto the tier status dropdown. Form controls feature high-contrast visible focus rings. |
| **Screen Reader Landmarks** | Uses HTML5 landmarks (`<header role="banner">`, `<main>`, `<section role="region">`, `<table role="table">`, `<footer>`) with explicit `aria-label` tags on every control. |

---

## 4. Verification & Testing

### Running Tests
Execute the Vitest test suite from the repository root:
```bash
npm test
```

### Test Suite Results: 20 Passed / 0 Failed
```text
 ✓ src/__tests__/FrequentFlyerPortal.test.jsx (20 tests) 6.86s
   ✓ Happy Path: Enterprise branding and Ticket ENG-163087 reference
   ✓ Happy Path: Summary metrics (Total Members, Active Platinum/Gold, Total Miles Logged)
   ✓ Happy Path: Member roster table with all required columns
   ✓ Happy Path: Real-time search by passenger name and FF number
   ✓ Happy Path: Filter by tier status dropdown
   ✓ Happy Path: Enroll new member updates roster and metrics
   ✓ Happy Path: Log miles to existing member updates balance and total miles
   ✓ Happy Path: LocalStorage persistence across reloads
   ✓ Unhappy Path: Empty state "No data found" screen on search mismatch
   ✓ Unhappy Path: Empty state when roster is completely empty
   ✓ Unhappy Path: Visible loader (role="status", aria-busy="true") on Slow 3G
   ✓ Unhappy Path: Offline mode queues actions locally without crashing
   ✓ Unhappy Path: Required input validation with border-red-600 and aria-invalid="true"
   ✓ Unhappy Path: Rejects malformed FF Number (format FF-####)
   ✓ Unhappy Path: Rejects negative miles with contextual error
   ✓ NFR: 100% accessible controls with explicit aria-label and label associations
   ✓ NFR: Strict keyboard tab flow navigation
   ✓ NFR: Telemetry console simulation on primary actions
   ✓ NFR: XSS sanitization strips script/HTML tags from state
   ✓ NFR: Isolated sanitizer unit test
```

### Production Build
```bash
npm run build
```
Builds cleanly with zero ESLint or bundling errors in under 5 seconds.
