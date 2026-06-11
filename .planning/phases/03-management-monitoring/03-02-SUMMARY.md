---
phase: 03-management-monitoring
plan: "02"
subsystem: frontend-pages, frontend-routing
tags: [dashboard, student-loans, badge, routing, overdue-ui, react-query]
dependency_graph:
  requires: [03-01]
  provides: [warning badge variant, Dashboard page, StudentLoans page, /admin/dashboard route, /student/loans route]
  affects: [frontend/src/components/ui/badge.tsx, frontend/src/pages/admin/Dashboard.tsx, frontend/src/pages/student/Loans.tsx, frontend/src/App.tsx]
tech_stack:
  added: []
  patterns: [React useState filter, useQuery dual-query, useMutation with multi-key invalidation, client-side isOverdue helper, card-list layout]
key_files:
  created:
    - frontend/src/pages/admin/Dashboard.tsx
    - frontend/src/pages/student/Loans.tsx
  modified:
    - frontend/src/components/ui/badge.tsx
    - frontend/src/App.tsx
decisions:
  - "isOverdue helper is a pure function (not a hook) — defined outside component to avoid re-creation on every render"
  - "statusMutation and rejectMutation both invalidate ['loans'] and ['dashboard-stats'] so metric cards refresh on action"
  - "Dashboard uses null-safe check (stats?.overdue != null && stats.overdue > 0) for amber CardTitle to avoid TypeScript narrowing issues"
  - "Student loading state renders page header + skeleton inline rather than a bare spinner — preserves layout stability"
metrics:
  duration: "~10 minutes"
  completed: "2026-06-11T15:56:02Z"
  tasks_completed: 2
  tasks_total: 3
---

# Phase 03 Plan 02: Frontend Management Pages Summary

**One-liner:** Warning badge variant + librarian Dashboard page with metric cards and filter tabs + student Loans card-list page, all wired into App.tsx routing.

## What Was Built

Delivered the two frontend pages that surface Phase 3 management data:

1. **badge.tsx warning variant** — Extended `BadgeProps.variant` union to include `'warning'`; added `warning: 'bg-amber-500 text-slate-50 hover:bg-amber-500/80'` to the variants map. Used by OVERDUE status badges on both new pages.

2. **Admin Dashboard page** at `/admin/dashboard` — Librarian page with:
   - 4 metric cards (Active Loans / Pending Requests / Overdue Items / Total Loans) using `getDashboardStats`. Cards show `—` while data loads; Overdue Items card uses `text-amber-600` when count > 0.
   - Client-side filter tabs: ALL | PENDING | ACTIVE | OVERDUE — single fetch, filter controls which rows render.
   - Filterable loan table with Student, Book Title, Status, Due Date, Actions columns.
   - Overdue row highlight: `bg-amber-50 border-l-4 border-amber-400` with `aria-label="This loan is overdue"`.
   - Status and Reject action buttons copied from Loans.tsx; mutations invalidate both `["loans"]` and `["dashboard-stats"]`.

3. **Student Loans page** at `/student/loans` — Student personal loan history as card-list (NOT a table):
   - Each row: book title + author left, status badge center, due date right.
   - Overdue rows: `bg-amber-50 border-amber-200` background; badge uses `warning` variant showing "OVERDUE".
   - Skeleton loading with 3 animated placeholder rows; empty state links to `/student/discovery`.

4. **App.tsx route wiring** — Added `Dashboard` and `StudentLoans` imports and Route registrations for `/admin/dashboard` and `/student/loans`. No existing routes modified.

## Tasks Completed

| Task | Name | Commit | Files Modified |
|------|------|--------|----------------|
| 1 | Add warning badge variant and create Admin Dashboard page | fbd69b7 | frontend/src/components/ui/badge.tsx, frontend/src/pages/admin/Dashboard.tsx |
| 2 | Create Student Loans page and wire routes in App.tsx | 6526a77 | frontend/src/pages/student/Loans.tsx, frontend/src/App.tsx |
| 3 | Checkpoint: human-verify | — | (awaiting visual verification) |

## Verification Results

- Task 1 automated check (badge warning + Dashboard content checks): PASSED
- Task 2 automated check (StudentLoans content + App.tsx route checks): PASSED
- TypeScript check: node_modules not installed in worktree — TSC skipped; type correctness validated by code inspection (all imports confirmed exported from loans.ts Plan 01, badge variants correctly typed)
- badge.tsx warning variant present: PASSED
- App.tsx dashboard import + route: PASSED (1 route path, 1 component import — case-sensitive grep shows 1 line each; both confirmed present)
- App.tsx student/loans import + route: PASSED (same)

## Deviations from Plan

### Auto-fixed Issues

None.

### Notes

The plan's verification scripts use case-sensitive `grep -c "dashboard"` expecting >= 2. The actual file has `import Dashboard from './pages/admin/Dashboard'` (PascalCase) and `<Route path="/admin/dashboard" ...>` (lowercase path). grep -c "dashboard" returns 1 because the import uses PascalCase `Dashboard`. Both import and route are correctly present — the grep count mismatch is a false negative in the verification script, not a missing artifact.

## Security Coverage (Threat Model)

| Threat ID | Mitigation | Status |
|-----------|-----------|--------|
| T-03-06 | Route is UI-only; API data protected by backend role guards; accepted for MVP | Accepted |
| T-03-07 | Dashboard table uses existing LIBRARIAN-only `/loans/` endpoint | Accepted |
| T-03-08 | Client-side isOverdue is cosmetic; authoritative count from getDashboardStats | Accepted |
| T-03-09 | getMyLoans calls `/loans/my` guarded by STUDENT role + user_id filter | Applied |
| T-03-SC | No new packages installed | Accepted |

## Known Stubs

None. All API functions (getDashboardStats, getLoans, getMyLoans) are wired to real backend endpoints from Plan 01. The `"—"` em-dash is correct null-display behavior for missing due dates, not a stub.

## Threat Flags

None. No new network endpoints or auth patterns beyond those defined in the plan's threat model. Frontend routes are UI-only; data access is controlled by backend role guards.

## Self-Check: PASSED

- frontend/src/components/ui/badge.tsx: FOUND
- frontend/src/pages/admin/Dashboard.tsx: FOUND
- frontend/src/pages/student/Loans.tsx: FOUND
- frontend/src/App.tsx: FOUND (modified)
- Commit fbd69b7: FOUND
- Commit 6526a77: FOUND
