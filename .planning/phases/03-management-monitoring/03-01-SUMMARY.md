---
phase: 03-management-monitoring
plan: "01"
subsystem: backend-api, frontend-service
tags: [loan-model, due-date, overdue, dashboard-stats, api-endpoints, typescript]
dependency_graph:
  requires: [02-02, 02-03]
  provides: [due_date field on Loan, /overdue endpoint, /dashboard-stats endpoint, /my endpoint, DashboardStats type, getOverdueLoans, getDashboardStats, getMyLoans]
  affects: [backend/app/models/loan.py, backend/app/api/v1/endpoints/loans.py, frontend/src/features/loans/api/loans.ts]
tech_stack:
  added: []
  patterns: [SQLModel Optional field, FastAPI role-guard, Axios api.get pattern]
key_files:
  created: []
  modified:
    - backend/app/models/loan.py
    - backend/app/api/v1/endpoints/loans.py
    - frontend/src/features/loans/api/loans.ts
decisions:
  - "due_date set server-side only at ACTIVE transition — never read from client request body"
  - "Static routes /overdue, /dashboard-stats, /my placed before /{loan_id}/status to prevent FastAPI path shadowing"
  - "dashboard-stats uses fetch-all + Python list comprehension (no func.count) for MVP simplicity"
  - "[Rule 2] Propagated due_date in existing list_loans enrichment loop for consistency"
metrics:
  duration: "~10 minutes"
  completed: "2026-06-11T15:47:47Z"
  tasks_completed: 3
  tasks_total: 3
  files_modified: 3
---

# Phase 03 Plan 01: Loan Data Foundation for Management Features Summary

**One-liner:** JWT-guarded due_date field + three new loan endpoints (/overdue, /dashboard-stats, /my) with matching TypeScript service layer.

## What Was Built

Delivered the backend data foundation for Phase 3 management features:

1. **Loan model due_date field** — `Optional[datetime]` field added to `Loan` table class, `LoanRead`, and `LoanReadWithDetails` schemas. Null by default; set to `utcnow() + 14 days` when the loan transitions to ACTIVE status.

2. **Three new API endpoints:**
   - `GET /api/v1/loans/overdue` (LIBRARIAN) — queries `status=ACTIVE AND due_date < now()`, returns `List[LoanReadWithDetails]`
   - `GET /api/v1/loans/dashboard-stats` (LIBRARIAN) — returns `{active, pending, overdue, total}` integer counts computed in Python
   - `GET /api/v1/loans/my` (STUDENT) — returns the authenticated student's own loans ordered by `created_at desc`

3. **Frontend loans.ts updates** — `LoanRead` gains `due_date: string | null`, new `DashboardStats` interface, and three new exported async functions (`getOverdueLoans`, `getDashboardStats`, `getMyLoans`).

## Tasks Completed

| Task | Name | Commit | Files Modified |
|------|------|--------|----------------|
| 1 | Add due_date to Loan model and ACTIVE transition | 3ea7837 | backend/app/models/loan.py, backend/app/api/v1/endpoints/loans.py |
| 2 | Add /overdue, /dashboard-stats, /my endpoints | 09aadfd | backend/app/api/v1/endpoints/loans.py |
| 3 | Update frontend loans.ts API service | c82e5d2 | frontend/src/features/loans/api/loans.ts |

## Verification Results

- Python AST syntax check on both backend files: PASSED
- `due_date` present in `Loan`, `LoanRead`, `LoanReadWithDetails`: PASSED
- `timedelta` imported and ACTIVE transition sets `loan.due_date`: PASSED
- Route ordering verified — all three static routes appear before `/{loan_id}/status`: PASSED
- Frontend node check for all required symbols (`due_date`, `DashboardStats`, `getOverdueLoans`, `getDashboardStats`, `getMyLoans`): PASSED

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing critical data] Propagated due_date in existing list_loans enrichment loop**
- **Found during:** Task 2
- **Issue:** The existing `list_loans` endpoint built `LoanReadWithDetails` objects without passing `due_date`. After Task 1 added `due_date` to the schema, the field would silently return `null` from the existing `/` endpoint even for active loans that have a due date set.
- **Fix:** Added `due_date=loan.due_date` to the `LoanReadWithDetails(...)` constructor in the `list_loans` enrichment loop.
- **Files modified:** `backend/app/api/v1/endpoints/loans.py`
- **Commit:** 09aadfd

## Security Coverage (Threat Model)

| Threat ID | Mitigation | Status |
|-----------|-----------|--------|
| T-03-01 | `deps.check_role(UserRole.LIBRARIAN)` on `/overdue` | Applied |
| T-03-02 | `deps.check_role(UserRole.LIBRARIAN)` on `/dashboard-stats` | Applied |
| T-03-03 | `Loan.user_id == current_user.id` filter + `deps.check_role(UserRole.STUDENT)` on `/my` | Applied |
| T-03-04 | `due_date` absent from `LoanCreate` and `LoanStatusUpdate`; set only by server at ACTIVE transition | Applied |
| T-03-05 | Covered by existing `get_current_user` dependency chain | Accepted |

## Known Stubs

None. All fields are wired to real data sources. The `due_date` field is `null` for loans not yet in ACTIVE status — this is intentional behavior, not a stub.

## Threat Flags

None. No new network endpoints or auth patterns were introduced beyond those defined in the plan's threat model.

## Self-Check: PASSED

- backend/app/models/loan.py: FOUND
- backend/app/api/v1/endpoints/loans.py: FOUND
- frontend/src/features/loans/api/loans.ts: FOUND
- Commit 3ea7837: FOUND
- Commit 09aadfd: FOUND
- Commit c82e5d2: FOUND
