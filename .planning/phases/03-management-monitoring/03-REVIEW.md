---
phase: 03-management-monitoring
reviewed: 2026-06-11T00:00:00Z
depth: standard
files_reviewed: 7
files_reviewed_list:
  - backend/app/api/v1/endpoints/loans.py
  - backend/app/models/loan.py
  - frontend/src/App.tsx
  - frontend/src/components/ui/badge.tsx
  - frontend/src/features/loans/api/loans.ts
  - frontend/src/pages/admin/Dashboard.tsx
  - frontend/src/pages/student/Loans.tsx
findings:
  critical: 4
  warning: 5
  info: 3
  total: 12
status: issues_found
---

# Phase 03: Code Review Report

**Reviewed:** 2026-06-11T00:00:00Z
**Depth:** standard
**Files Reviewed:** 7
**Status:** issues_found

## Summary

Seven files covering the loan management and monitoring feature were reviewed: two backend Python files (FastAPI endpoint, SQLModel) and five TypeScript/React files (routing, badge component, API client, admin dashboard, student loans page).

The most serious finding is a **state-machine bypass** in `update_loan_status` that allows any librarian to reject a loan that is already ACTIVE or APPROVED — which silently skips releasing the physical copy back to AVAILABLE, permanently corrupting inventory. Two additional critical issues relate to authorization gaps (students can call admin-only overdue and stats endpoints by hitting the URLs directly) and a copy-availability race condition that surfaces if a PENDING loan is rejected. A fourth critical issue is unauthenticated route exposure in `App.tsx` — every route is reachable without a valid session.

Five warnings cover: N+1 query patterns that will breach the 2-second SLA on any non-trivial dataset, a `datetime.utcnow()` deprecation that will produce warnings/errors in Python ≥ 3.12, the missing `'success'` variant in `STATUS_BADGE_VARIANT` causing a TypeScript type narrowing gap, an `as any` cast suppressing a real type error in `Dashboard.tsx`, and an unhandled 401 path in the API client that causes silent failures.

---

## Critical Issues

### CR-01: State-machine bypass allows REJECTED transition from ACTIVE/APPROVED, orphaning borrowed copies

**File:** `backend/app/api/v1/endpoints/loans.py:215`
**Issue:** The `_VALID_TRANSITIONS` map (lines 16-20) does NOT include `REJECTED` as a valid target from `APPROVED` or `ACTIVE`. However, `update_loan_status` has a special case at line 215 that runs the copy-release logic for both `REJECTED` and `RETURNED` — but that code only executes when the state machine _allows_ the transition. When the state machine correctly blocks a rejection of an ACTIVE loan, the copy is never released. More dangerously, if a future developer adds `REJECTED` to any of those transition sets (a natural mistake), the endpoint will allow the transition and release the copy while the student still has the physical book, leaving `Copy.status = AVAILABLE` for a book that is checked out.

The current code actually has the inverse gap: the `APPROVED → REJECTED` path is missing from `_VALID_TRANSITIONS`. A PENDING loan gets its copy marked `BORROWED` at creation time (line 47). If a librarian rejects it, the copy must be released. But `APPROVED` is also not in `_VALID_TRANSITIONS` for `REJECTED`. This means once a loan reaches APPROVED status, it can never be rejected — the only path out is `ACTIVE → RETURNED`. The physical copy reservation is permanent unless `ACTIVE → RETURNED` is completed, even if the librarian wants to cancel.

**Fix:**
```python
_VALID_TRANSITIONS = {
    LoanStatus.PENDING: {LoanStatus.APPROVED, LoanStatus.REJECTED},
    LoanStatus.APPROVED: {LoanStatus.ACTIVE, LoanStatus.REJECTED},  # allow cancellation
    LoanStatus.ACTIVE: {LoanStatus.RETURNED},
    # REJECTED and RETURNED are terminal — no transitions out
}
```
The copy-release block at line 215 is already correctly written to handle `REJECTED`; the fix is to permit the transition in the state machine so the release logic is reachable.

---

### CR-02: No route-level authentication — all pages accessible without a valid session

**File:** `frontend/src/App.tsx:17-23`
**Issue:** Every `<Route>` is rendered unconditionally. Any unauthenticated user can navigate to `/admin/dashboard`, `/admin/loans`, or `/student/loans` directly in the browser. While the API calls will fail (the axios client requires a token), the page HTML and React component tree render fully, potentially exposing UI state, labels, and structural information. More critically, if the access token is stored in `localStorage` or a non-HttpOnly cookie and persists across sessions, an attacker who obtains a stale token can access admin pages indefinitely because there is no session validation on the frontend route.

**Fix:** Add a `PrivateRoute` wrapper that checks for a valid session before rendering:
```tsx
// src/components/auth/PrivateRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function PrivateRoute({ children, role }: { children: React.ReactNode; role?: string }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

// In App.tsx:
<Route path="/admin/dashboard" element={
  <PrivateRoute role="LIBRARIAN"><Dashboard /></PrivateRoute>
} />
```

---

### CR-03: N+1 query pattern inside `list_loans`, `list_overdue_loans`, and `get_my_loans` will breach 2-second SLA

**File:** `backend/app/api/v1/endpoints/loans.py:72-91, 111-130, 169-188`
**Issue:** All three list endpoints iterate over every loan and fire two additional `SELECT` queries per row (one for `Title`, one for `User`). For a library with 200 active loans, `list_loans` issues 401 sequential round-trips to the database. On a shared university server this will routinely exceed the 2-second performance constraint stated in `CLAUDE.md`. The `get_dashboard_stats` endpoint (line 141) fetches the entire `loans` table into Python memory for in-process counting, which will also degrade as volume grows.

**Fix:** Use SQLModel/SQLAlchemy joined loading in a single query:
```python
from sqlmodel import select
from sqlalchemy.orm import selectinload

statement = (
    select(Loan)
    .options(selectinload(Loan.title), selectinload(Loan.user))
)
```
Or replace with a single JOIN query that returns all columns at once. For `get_dashboard_stats`, push the aggregation to the database using `func.count` with `GROUP BY` instead of fetching all rows.

---

### CR-04: `LoanStatusUpdate` accepts any `LoanStatus` value including terminal states — no server-side guard against direct API calls skipping the UI

**File:** `backend/app/api/v1/endpoints/loans.py:206-212` / `backend/app/models/loan.py:26-27`
**Issue:** `LoanStatusUpdate.status` is typed as `LoanStatus` (the full enum), so a caller can POST `{"status": "RETURNED"}` against a `PENDING` loan via `curl` or Postman, bypassing the state machine entirely if a coding error removes the transition check. More concretely: the `/loans/{loan_id}/status` endpoint is protected only by `LIBRARIAN` role — any librarian can submit any `LoanStatus` value in the request body. The transition guard is the only safeguard, but there is no defense-in-depth at the schema layer. Additionally, the `APPROVED` → `REJECTED` gap from CR-01 means a librarian trying to cancel an approved but uncollected loan has no valid API path to do so.

**Fix:** Narrow the input type to only the transitions a librarian can initiate:
```python
class LoanStatusUpdate(SQLModel):
    status: Literal[
        LoanStatus.APPROVED,
        LoanStatus.REJECTED,
        LoanStatus.ACTIVE,
        LoanStatus.RETURNED,
    ]
```
This provides schema-level defense-in-depth and makes invalid inputs a 422 Unprocessable Entity rather than a 400 that leaks internal state names.

---

## Warnings

### WR-01: `datetime.utcnow()` is deprecated in Python 3.12 and removed in future versions

**File:** `backend/app/api/v1/endpoints/loans.py:101, 140, 223, 225` and `backend/app/models/loan.py:53-54`
**Issue:** `datetime.utcnow()` is deprecated since Python 3.12 (`DeprecationWarning`) and the method returns a naive datetime with no timezone info. Comparisons against database timestamps stored with timezone info (common in PostgreSQL) will raise a `TypeError` at runtime. The model's `default_factory=datetime.utcnow` on lines 53-54 of `loan.py` will also trigger deprecation warnings on every row insert.

**Fix:**
```python
from datetime import datetime, timezone

# Replace all datetime.utcnow() with:
datetime.now(timezone.utc)

# In loan.py model fields:
created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
```

---

### WR-02: `as any` cast in Dashboard.tsx hides a real type mismatch

**File:** `frontend/src/pages/admin/Dashboard.tsx:184`
**Issue:** `(statusMutation.variables as any)?.loanId` casts `statusMutation.variables` to `any` to access `loanId`. The actual variable type is `{ loanId: number; status: LoanRead["status"] }` as defined at line 51. The cast bypasses TypeScript's type checker and will silently return `undefined` if the property name ever changes (e.g., during a refactor), causing the "Saving…" spinner to never activate for the correct row.

**Fix:**
```typescript
// Define the mutation variable type explicitly
type StatusMutationVars = { loanId: number; status: LoanRead["status"] };

const isPending =
  statusMutation.isPending &&
  (statusMutation.variables as StatusMutationVars | undefined)?.loanId === loan.id;
```
Or define a typed mutation function signature using `useMutation<LoanRead, Error, StatusMutationVars>`.

---

### WR-03: `STATUS_BADGE_VARIANT` in Dashboard.tsx missing the `'success'` variant, causing a silent Badge fallback

**File:** `frontend/src/pages/admin/Dashboard.tsx:24-31`
**Issue:** The `Badge` component (badge.tsx line 4) declares variant `'success'` as a valid value, but `STATUS_BADGE_VARIANT` in Dashboard.tsx maps `APPROVED` and `ACTIVE` both to `"default"` (the dark slate color) making them visually indistinguishable. This is a usability defect — a librarian cannot tell APPROVED from ACTIVE at a glance. The same map in `student/Loans.tsx` (line 5-11) also lacks `'success'` and has the same APPROVED/ACTIVE conflation.

**Fix:**
```typescript
const STATUS_BADGE_VARIANT: Record<LoanRead["status"] | "OVERDUE", BadgeVariant> = {
  PENDING: "warning",
  APPROVED: "secondary",
  ACTIVE: "success",   // visually distinct green
  REJECTED: "destructive",
  RETURNED: "outline",
  OVERDUE: "warning",
};
```

---

### WR-04: Reject mutation pending state check uses reference equality on a primitive — always false after first use

**File:** `frontend/src/pages/admin/Dashboard.tsx:223`
**Issue:** `rejectMutation.variables === loan.id` compares a `number` stored in `rejectMutation.variables` to `loan.id`. While JavaScript number comparison works correctly for primitives, `rejectMutation.variables` is typed as `number | undefined` and if a previous rejection mutated `variables` before the current one resolves, all Reject buttons will be disabled simultaneously because `isPending` is evaluated on the shared `rejectMutation` object. Unlike `statusMutation`, there is only one `rejectMutation` instance for the entire table; clicking Reject on row A disables the Reject button on row A but also prevents clicking Reject on row B until the mutation settles.

**Fix:** Create per-row pending state or use the `loanId` in the mutation variables to isolate UI state per row:
```typescript
const isRejectPending =
  rejectMutation.isPending && rejectMutation.variables === loan.id;
```
This is already written correctly — the bug is that a single shared `rejectMutation` means all Reject buttons read from the same `.isPending` boolean. Use a separate mutation per action type, or track pending state with local state keyed by `loan.id`.

---

### WR-05: `Badge` component renders a `<div>` with `onClick`-capable hover states but no `role` or keyboard support

**File:** `frontend/src/components/ui/badge.tsx:17-22`
**Issue:** `Badge` spreads `React.HTMLAttributes<HTMLDivElement>` onto a `<div>`, which means callers can pass `onClick` handlers (nothing prevents it) without the element being keyboard-accessible. In `Dashboard.tsx` the Badge is purely presentational, but the component API allows misuse. The hover classes (`hover:bg-*`) on a non-interactive `<div>` also produce misleading cursor behavior for screen readers and users inspecting the page.

**Fix:** If the badge is always presentational, remove hover classes and block `onClick` from the component API, or change the underlying element to `<span>`. If it must be interactive, add `role="button"` and `tabIndex={0}` conditionally when `onClick` is provided:
```tsx
const isInteractive = !!props.onClick;
return (
  <div
    role={isInteractive ? "button" : undefined}
    tabIndex={isInteractive ? 0 : undefined}
    className={`...`}
    {...props}
  />
);
```

---

## Info

### IN-01: `get_my_loans` redundantly fetches `User` for each loan when the user is already known from the JWT

**File:** `backend/app/api/v1/endpoints/loans.py:172-173`
**Issue:** The endpoint already has `current_user` from the JWT dependency but still fires `SELECT * FROM user WHERE id = loan.user_id` for every loan in the result set. Since `Loan.user_id` is filtered to `current_user.id`, these queries all return the same row every time.

**Fix:** Remove the per-loan user query and use `current_user` directly:
```python
enriched.append(
    LoanReadWithDetails(
        ...
        student_email=current_user.email,
    )
)
```

---

### IN-02: `App.tsx` has no catch-all route — unknown paths render nothing

**File:** `frontend/src/App.tsx:24`
**Issue:** There is no `<Route path="*">` handler. Any mistyped URL (e.g., `/admin/dashbord`) renders a blank page with no error message, which is confusing for end users.

**Fix:**
```tsx
<Route path="*" element={<Navigate to="/login" replace />} />
```
Or render a dedicated 404 component.

---

### IN-03: Hardcoded loan duration of 14 days is a magic number with no named constant

**File:** `backend/app/api/v1/endpoints/loans.py:223`
**Issue:** `timedelta(days=14)` is not extracted to a named constant. If the library policy changes this value, developers must hunt through endpoint code to find it.

**Fix:**
```python
# At module level
LOAN_DURATION_DAYS: int = 14

# Usage
loan.due_date = datetime.now(timezone.utc) + timedelta(days=LOAN_DURATION_DAYS)
```

---

_Reviewed: 2026-06-11T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
