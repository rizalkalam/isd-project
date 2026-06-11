# Phase 3: Management & Monitoring - Context

**Gathered:** 2026-06-11
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase delivers operational oversight for the Library Management System: a librarian dashboard with key metrics and loan management, automatic overdue detection, and basic student loan status notifications. It does NOT add new borrowing flows — it surfaces data from the existing Loan lifecycle built in Phase 2.

</domain>

<decisions>
## Implementation Decisions

### Librarian Dashboard (NOTIF-02)
- **D-01:** Summary section shows **4 metric cards** at the top: Active Loans, Pending Requests, Overdue Items, Total Loans. Reuse existing `card.tsx` component.
- **D-02:** Below the cards: a **single loans table with status filter**. Columns: Student, Book Title, Status, Due Date, Actions. Filter options: ALL / PENDING / ACTIVE / OVERDUE.
- **D-03:** Overdue rows are highlighted in **amber/red within the table**, and the Overdue summary card shows a badge count. No separate overdue page needed.

### Overdue Detection (NOTIF-01)
- **D-04 (Claude's Discretion):** Add `due_date: datetime` field to the `Loan` model. `due_date` is set at ACTIVE transition (when librarian marks the loan as Active/picked up), defaulting to **14 days** from that timestamp.
- **D-05 (Claude's Discretion):** Overdue is determined **on-query** — loans where `status = ACTIVE AND due_date < now()`. No background scheduler for MVP. A new GET `/api/v1/loans/overdue` endpoint returns these loans.

### Student Loan Status (NOTIF-03)
- **D-06 (Claude's Discretion):** **No notification feed**. Instead, the student's existing page shows their current loan status prominently (status badge + due date). A dedicated `/student/loans` page lists all their loans with status history. "Notifications" = clear status visibility, not a push/polling feed.

### Claude's Discretion
- Loan period: 14 days (set at ACTIVE transition)
- Overdue check: on-query, no scheduler
- Student notifications: status display only, no in-app feed
- Dashboard route: `/admin/dashboard` (new page, not replacing existing `/admin/loans`)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Foundation
- `.planning/PROJECT.md` — Core project spec, tech stack, constraints
- `.planning/ROADMAP.md` — Phase 3 goal and success criteria
- `.planning/REQUIREMENTS.md` — NOTIF-01, NOTIF-02, NOTIF-03 traceability

### Existing Code (read before touching)
- `backend/app/models/loan.py` — Loan model and LoanStatus enum (due_date must be added here)
- `backend/app/api/v1/endpoints/loans.py` — Existing loan endpoints and state machine transitions
- `frontend/src/components/ui/card.tsx` — Reuse for dashboard metric cards
- `frontend/src/components/ui/badge.tsx` — Reuse for status badges and overdue highlights
- `frontend/src/pages/admin/Loans.tsx` — Existing admin loans page (dashboard supplements this)
- `frontend/src/pages/student/Discovery.tsx` — Existing student page (loan status section to add here)
- `frontend/src/api/client.ts` — Pre-configured Axios instance for new API calls

### Phase 2 Decisions
- `.planning/phases/02-borrowing-discovery/02-CONTEXT.md` — Loan lifecycle decisions, established patterns

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `frontend/src/components/ui/card.tsx`: Use for the 4 metric cards on the dashboard
- `frontend/src/components/ui/badge.tsx`: Use for loan status labels and overdue highlighting
- `frontend/src/api/client.ts`: Pre-configured Axios with auth headers — use for all new API calls
- `backend/app/api/deps.py`: `check_role()` dependency — use to guard librarian-only endpoints

### Established Patterns
- **ORM**: SQLModel async — new `due_date` field follows same pattern as `created_at`/`updated_at`
- **Loan state machine**: `_VALID_TRANSITIONS` dict in `loans.py` — add `due_date` assignment in ACTIVE transition
- **Role-based access**: `check_role(UserRole.LIBRARIAN)` / `check_role(UserRole.STUDENT)` pattern from existing endpoints
- **Frontend pages**: `admin/` and `student/` directories under `pages/` — new pages follow same location

### Integration Points
- `Loan` model: add `due_date: Optional[datetime]` field (nullable until loan becomes ACTIVE)
- ACTIVE transition in `loans.py`: set `loan.due_date = datetime.utcnow() + timedelta(days=14)`
- New backend endpoint: `GET /api/v1/loans/overdue` — queries `status=ACTIVE AND due_date < now()`
- New backend endpoint: `GET /api/v1/loans/dashboard-stats` — returns counts for 4 metric cards
- New frontend page: `frontend/src/pages/admin/Dashboard.tsx`
- Student loans list: add section to `frontend/src/pages/student/Discovery.tsx` or new `student/Loans.tsx`

</code_context>

<specifics>
## Specific Ideas

- Dashboard is a **new page** at `/admin/dashboard`, accessible from librarian nav. Existing `/admin/loans` page remains untouched.
- Overdue rows in the table use amber background or red text — consistent with badge.tsx variants already used for loan status.
- Student loan status page should show: Book Title, Status badge, Due Date (if active), and request date.

</specifics>

<deferred>
## Deferred Ideas

- **Email/SMS notifications**: Out of scope for MVP — NOTIF-03 means in-app status only.
- **Fine tracking**: REQUIREMENTS.md explicitly defers this to v2.
- **Overdue scheduler/background job**: On-query detection is sufficient for MVP; a cron job can be added in v2.
- **Waitlist**: Still out of MVP scope (noted in Phase 2).

</deferred>

---

*Phase: 03-management-monitoring*
*Context gathered: 2026-06-11*
