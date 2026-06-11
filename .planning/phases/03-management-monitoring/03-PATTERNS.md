# Phase 3: Management & Monitoring — Pattern Map

**Mapped:** 2026-06-11
**Files analyzed:** 7 new/modified files
**Analogs found:** 7 / 7

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `backend/app/models/loan.py` | model | CRUD | same file (modify) | exact |
| `backend/app/api/v1/endpoints/loans.py` | controller | request-response | same file (modify) | exact |
| `frontend/src/features/loans/api/loans.ts` | service | request-response | same file (modify) | exact |
| `frontend/src/pages/admin/Dashboard.tsx` | component/page | request-response | `frontend/src/pages/admin/Loans.tsx` | exact role-match |
| `frontend/src/pages/student/Loans.tsx` | component/page | request-response | `frontend/src/pages/student/Discovery.tsx` | role-match |
| `frontend/src/components/ui/badge.tsx` | utility/component | — | same file (modify) | exact |
| `frontend/src/App.tsx` | config/routing | — | same file (modify) | exact |

---

## Pattern Assignments

### `backend/app/models/loan.py` (model, CRUD — modify)

**Analog:** same file

**Current `due_date`-less `Loan` table model** (lines 49–53):
```python
class Loan(LoanBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

**Pattern to follow — add `due_date` after `updated_at`, same nullable Optional style:**
```python
class Loan(LoanBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    due_date: Optional[datetime] = Field(default=None)
```

**Also update `LoanRead` and `LoanReadWithDetails`** (lines 30–47) — add `due_date: Optional[datetime]` to both read schemas so endpoints return it to the frontend.

**Import needed:** `timedelta` is used in the endpoint, not the model — no import change here.

---

### `backend/app/api/v1/endpoints/loans.py` (controller, request-response — modify)

**Analog:** same file

**Imports pattern** (lines 1–12):
```python
from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from app.db.session import get_session
from app.api import deps
from app.models.loan import Loan, LoanCreate, LoanRead, LoanStatus, LoanStatusUpdate, LoanReadWithDetails
from app.models.copy import Copy, CopyStatus
from app.models.title import Title
from app.models.user import User, UserRole
```

**Add `timedelta` to the datetime import line:**
```python
from datetime import datetime, timedelta
```

**Auth/guard pattern** (lines 28, 66, 100):
```python
current_user: User = Depends(deps.check_role(UserRole.LIBRARIAN))
# or for student endpoints:
current_user: User = Depends(deps.check_role(UserRole.STUDENT))
```

**ACTIVE transition — where to inject `due_date` assignment** (lines 107–128):
```python
# Find the block after: loan.status = new_status
# Add before: loan.updated_at = datetime.utcnow()
if new_status == LoanStatus.ACTIVE:
    loan.due_date = datetime.utcnow() + timedelta(days=14)
loan.status = new_status
loan.updated_at = datetime.utcnow()
```

**New `GET /overdue` endpoint — follow the pattern of `GET /`** (lines 62–91):
```python
@router.get("/overdue", response_model=List[LoanReadWithDetails])
async def list_overdue_loans(
    *,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(deps.check_role(UserRole.LIBRARIAN)),
):
    now = datetime.utcnow()
    result = await session.exec(
        select(Loan).where(
            Loan.status == LoanStatus.ACTIVE,
            Loan.due_date < now,
        )
    )
    loans = result.all()
    # enrich with title/user details — same loop as list_loans (lines 72–90)
    ...
```

**New `GET /dashboard-stats` endpoint — same auth guard, returns plain dict:**
```python
@router.get("/dashboard-stats")
async def get_dashboard_stats(
    *,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(deps.check_role(UserRole.LIBRARIAN)),
):
    now = datetime.utcnow()
    # Use session.exec(select(func.count(Loan.id)).where(...)) or fetch-all + len()
    # Return: { active, pending, overdue, total }
```

**Error handling pattern** (lines 104–115):
```python
result = await session.exec(select(Loan).where(Loan.id == loan_id))
loan = result.first()

if not loan:
    raise HTTPException(status_code=404, detail="Loan not found")

new_status = status_update.status
allowed = _VALID_TRANSITIONS.get(loan.status, set())
if new_status not in allowed:
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=f"Cannot transition from {loan.status} to {new_status}.",
    )
```

**Route ordering note:** Place `/overdue` and `/dashboard-stats` routes BEFORE `/{loan_id}/status` to prevent FastAPI treating "overdue" and "dashboard-stats" as path parameters.

---

### `frontend/src/features/loans/api/loans.ts` (service, request-response — modify)

**Analog:** same file

**Import pattern** (line 1):
```typescript
import api from '../../../api/client';
```

**Existing function pattern to copy for new functions** (lines 24–35):
```typescript
export const getLoans = async (): Promise<LoanReadWithDetails[]> => {
  const response = await api.get('/loans/');
  return response.data;
};

export const updateLoanStatus = async (
  loanId: number,
  status: LoanRead['status'],
): Promise<LoanRead> => {
  const response = await api.put(`/loans/${loanId}/status`, { status });
  return response.data;
};
```

**Add `due_date` to existing interfaces** (lines 2–17):
```typescript
export interface LoanRead {
  // existing fields...
  due_date: string | null;   // add this field
}

export interface DashboardStats {
  active: number;
  pending: number;
  overdue: number;
  total: number;
}
```

**New functions to add — follow same pattern:**
```typescript
export const getOverdueLoans = async (): Promise<LoanReadWithDetails[]> => {
  const response = await api.get('/loans/overdue');
  return response.data;
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get('/loans/dashboard-stats');
  return response.data;
};

export const getMyLoans = async (): Promise<LoanReadWithDetails[]> => {
  const response = await api.get('/loans/my');
  return response.data;
};
```

---

### `frontend/src/pages/admin/Dashboard.tsx` (component/page, request-response — new)

**Analog:** `frontend/src/pages/admin/Loans.tsx`

**Imports pattern** (Loans.tsx lines 1–4, extend for Dashboard):
```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLoans, updateLoanStatus, LoanReadWithDetails, LoanRead } from "../../features/loans/api/loans";
import { Badge } from "../../components/ui/badge";
// Add for Dashboard:
import { useState } from "react";
import { getDashboardStats, getOverdueLoans } from "../../features/loans/api/loans";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { BookOpen, Clock, AlertTriangle, Library } from "lucide-react";
```

**STATUS_BADGE_VARIANT map — extend from Loans.tsx** (lines 21–27), add `warning` for OVERDUE:
```typescript
const STATUS_BADGE_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline" | "warning"> = {
  PENDING: "secondary",
  APPROVED: "default",
  ACTIVE: "default",
  REJECTED: "destructive",
  RETURNED: "outline",
  OVERDUE: "warning",   // new
};
```

**STATUS_TRANSITIONS and STATUS_LABELS — copy verbatim from Loans.tsx** (lines 5–19):
```typescript
const STATUS_TRANSITIONS: Record<LoanRead["status"], LoanRead["status"] | null> = {
  PENDING: "APPROVED",
  APPROVED: "ACTIVE",
  ACTIVE: "RETURNED",
  REJECTED: null,
  RETURNED: null,
};

const STATUS_LABELS: Record<LoanRead["status"], string> = {
  PENDING: "Approve",
  APPROVED: "Mark Active",
  ACTIVE: "Mark Returned",
  REJECTED: "",
  RETURNED: "",
};
```

**useQuery pattern — copy from Loans.tsx** (lines 32–35):
```typescript
const { data: loans, isLoading, error } = useQuery({
  queryKey: ["loans"],
  queryFn: getLoans,
});
// Add second query for stats:
const { data: stats } = useQuery({
  queryKey: ["dashboard-stats"],
  queryFn: getDashboardStats,
});
```

**useMutation pattern — copy from Loans.tsx** (lines 37–46):
```typescript
const statusMutation = useMutation({
  mutationFn: ({ loanId, status }: { loanId: number; status: LoanRead["status"] }) =>
    updateLoanStatus(loanId, status),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["loans"] }),
});
const rejectMutation = useMutation({
  mutationFn: (loanId: number) => updateLoanStatus(loanId, "REJECTED"),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["loans"] }),
});
```

**Loading state — copy verbatim from Loans.tsx** (lines 48–54):
```tsx
if (isLoading) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900" />
    </div>
  );
}
```

**Page container and header — copy structure from Loans.tsx** (lines 65–69), adjust copy:
```tsx
<div className="container mx-auto p-6 max-w-6xl">
  <header className="mb-8">
    <h1 className="text-3xl font-semibold text-slate-900">Library Dashboard</h1>
    <p className="text-sm text-slate-500">Monitor loans, requests, and overdue items across the library.</p>
  </header>
```
Note: Use `font-semibold` not `font-bold` per UI-SPEC typography contract.

**Metric cards grid — new pattern using card.tsx:**
```tsx
<section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
  <Card>
    <CardHeader>
      <CardDescription className="flex items-center gap-2">
        <BookOpen className="h-4 w-4" /> Active Loans
      </CardDescription>
      <CardTitle className="text-xl font-semibold">
        {stats?.active ?? "—"}
      </CardTitle>
    </CardHeader>
  </Card>
  {/* repeat for Pending (Clock), Overdue (AlertTriangle, amber text when >0), Total (Library) */}
</section>
```
Overdue card title color rule: `className={stats?.overdue > 0 ? "text-xl font-semibold text-amber-600" : "text-xl font-semibold"}`

**Filter tabs — new pattern (client-side state):**
```tsx
const [filter, setFilter] = useState<"ALL" | "PENDING" | "ACTIVE" | "OVERDUE">("ALL");
// ...
<div className="flex gap-2 mb-4">
  {(["ALL", "PENDING", "ACTIVE", "OVERDUE"] as const).map((f) => (
    <button
      key={f}
      onClick={() => setFilter(f)}
      className={filter === f
        ? "bg-slate-900 text-white rounded-md px-3 py-1 text-sm font-medium"
        : "border border-slate-200 text-slate-600 rounded-md px-3 py-1 text-sm font-medium hover:bg-slate-50"}
    >
      {f.charAt(0) + f.slice(1).toLowerCase()}
    </button>
  ))}
</div>
```

**Overdue row detection — client-side:**
```typescript
const isOverdue = (loan: LoanReadWithDetails) =>
  loan.status === "ACTIVE" && !!loan.due_date && new Date(loan.due_date) < new Date();
```

**Table row — extend Loans.tsx row** (lines 94–129), add overdue highlight and due_date column:
```tsx
<tr
  key={loan.id}
  className={`border-b last:border-0 transition-colors ${
    isOverdue(loan)
      ? "bg-amber-50 border-l-4 border-amber-400 hover:bg-amber-100"
      : "hover:bg-slate-50"
  }`}
  aria-label={isOverdue(loan) ? "This loan is overdue" : undefined}
>
  {/* ...existing cells... */}
  <td className="px-4 py-3 text-slate-500">
    {loan.due_date ? new Date(loan.due_date).toLocaleDateString() : "—"}
  </td>
  {/* actions cell — copy verbatim from Loans.tsx lines 108–129 */}
</tr>
```

**Empty state — copy from Loans.tsx** (lines 71–74), adjust copy:
```tsx
<div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed">
  <p className="text-slate-500">No loans yet. Approved requests will appear here.</p>
</div>
```

**Error state pattern — copy from Loans.tsx** (lines 56–60):
```tsx
if (error) {
  return (
    <div className="p-8 text-center text-red-600">
      Could not load loans. Please refresh the page or contact support if the problem persists.
    </div>
  );
}
```

---

### `frontend/src/pages/student/Loans.tsx` (component/page, request-response — new)

**Analog:** `frontend/src/pages/student/Discovery.tsx`

**Imports pattern** (Discovery.tsx lines 1–8):
```typescript
import { useQuery } from "@tanstack/react-query";
import { Badge } from "../../components/ui/badge";
import { getMyLoans, LoanReadWithDetails } from "../../features/loans/api/loans";
```

**useQuery pattern — from Discovery.tsx** (lines 14–17):
```typescript
const { data: loans, isLoading, error } = useQuery({
  queryKey: ["my-loans"],
  queryFn: getMyLoans,
});
```

**Skeleton loading — from Discovery.tsx** (lines 62–65), adapted to list style per UI-SPEC:
```tsx
<div className="space-y-3 animate-pulse">
  {[...Array(3)].map((_, i) => (
    <div key={i} className="h-16 bg-slate-100 rounded-lg" />
  ))}
</div>
```

**Page header — from Discovery.tsx pattern** (lines 34–38), no search bar:
```tsx
<div className="container mx-auto p-6 max-w-4xl">
  <header className="mb-8">
    <h1 className="text-3xl font-semibold text-slate-900">My Loans</h1>
    <p className="text-sm text-slate-500">Track your current and past borrow requests.</p>
  </header>
```

**Loan row — card-list style (NOT a table):**
```tsx
<div className="space-y-3">
  {loans.map((loan: LoanReadWithDetails) => {
    const overdue = loan.status === "ACTIVE" && !!loan.due_date && new Date(loan.due_date) < new Date();
    return (
      <div
        key={loan.id}
        className={`flex items-center justify-between px-4 py-3 rounded-lg border ${
          overdue
            ? "bg-amber-50 border-amber-200"
            : "bg-white border-slate-100"
        }`}
      >
        <div>
          <p className="font-medium text-slate-900">{loan.book_title}</p>
          <p className="text-xs text-slate-500">{loan.book_author}</p>
        </div>
        <Badge variant={overdue ? "warning" : STATUS_BADGE_VARIANT[loan.status]}>
          {overdue ? "OVERDUE" : loan.status}
        </Badge>
        <p className="text-sm text-slate-600">
          {loan.due_date ? `Due: ${new Date(loan.due_date).toLocaleDateString()}` : "—"}
        </p>
      </div>
    );
  })}
</div>
```

**Empty state — from Discovery.tsx** (lines 89–91), adapted:
```tsx
<div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed">
  <p className="text-slate-500">You have no loan history yet.</p>
  <a href="/student/discovery" className="mt-4 inline-block text-sm text-indigo-600 hover:underline">
    Browse the catalog to request a book
  </a>
</div>
```

**Feedback banner pattern — from Discovery.tsx** (lines 51–59): Available if error state needs a dismissable banner, but static error div (same as Dashboard) is sufficient for MVP.

---

### `frontend/src/components/ui/badge.tsx` (utility, — modify)

**Analog:** same file

**Current `BadgeProps` interface** (lines 3–5):
```typescript
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success';
}
```

**Current variants map** (lines 8–13):
```typescript
const variants = {
  default: 'bg-slate-900 text-slate-50 hover:bg-slate-900/80',
  secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-100/80',
  destructive: 'bg-red-500 text-slate-50 hover:bg-red-500/80',
  outline: 'text-slate-950 border border-slate-200 hover:bg-slate-100',
  success: 'bg-green-500 text-slate-50 hover:bg-green-500/80',
};
```

**Changes — add `warning` in both places:**
```typescript
// interface change:
variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';

// variants map addition:
warning: 'bg-amber-500 text-slate-50 hover:bg-amber-500/80',
```

---

### `frontend/src/App.tsx` (config/routing — modify)

**Analog:** same file

**Current routes** (lines 3–7, 15–20):
```typescript
import Inventory from './pages/admin/Inventory';
import Loans from './pages/admin/Loans';
import Discovery from './pages/student/Discovery';
// ...
<Route path="/admin/inventory" element={<Inventory />} />
<Route path="/admin/loans" element={<Loans />} />
<Route path="/student/discovery" element={<Discovery />} />
```

**Pattern to follow — add new imports + routes in same style:**
```typescript
import Dashboard from './pages/admin/Dashboard';
import StudentLoans from './pages/student/Loans';
// ...
<Route path="/admin/dashboard" element={<Dashboard />} />
<Route path="/student/loans" element={<StudentLoans />} />
```

---

## Shared Patterns

### Authentication Guard (Backend)
**Source:** `backend/app/api/deps.py` (lines 35–43)
**Apply to:** All new backend endpoints (`/overdue`, `/dashboard-stats`, `/my`)
```python
def check_role(role: UserRole):
    def role_checker(user: User = Depends(get_current_user)):
        if user.role != role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="The user does not have enough privileges",
            )
        return user
    return role_checker
```
Usage: `current_user: User = Depends(deps.check_role(UserRole.LIBRARIAN))` for `/overdue`, `/dashboard-stats`; `deps.check_role(UserRole.STUDENT)` for `/my`.

### API Client (Frontend)
**Source:** `frontend/src/api/client.ts` (lines 1–30)
**Apply to:** All new API functions in `frontend/src/features/loans/api/loans.ts`

The Axios instance automatically attaches the Bearer token via interceptor (lines 14–18). No manual auth header needed in API functions — just call `api.get(...)` / `api.post(...)` / `api.put(...)`.

### React Query Data Fetching
**Source:** `frontend/src/pages/admin/Loans.tsx` (lines 32–46)
**Apply to:** Dashboard.tsx, student/Loans.tsx
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ["unique-key"],
  queryFn: apiFn,
});
```
Cache invalidation on mutations: `queryClient.invalidateQueries({ queryKey: ["loans"] })`.

### Loading / Error / Empty State Trio
**Source:** `frontend/src/pages/admin/Loans.tsx` (lines 48–74)
**Apply to:** Dashboard.tsx, student/Loans.tsx — implement all three states in every page component.

### Overdue Detection (Client-side)
**Source:** UI-SPEC Interaction Contract
**Apply to:** Dashboard.tsx table rows, student/Loans.tsx list rows
```typescript
const isOverdue = (loan: LoanReadWithDetails): boolean =>
  loan.status === "ACTIVE" && !!loan.due_date && new Date(loan.due_date) < new Date();
```

---

## No Analog Found

All files have direct analogs in the codebase. No files require falling back to external reference patterns.

---

## Metadata

**Analog search scope:** `backend/app/models/`, `backend/app/api/v1/endpoints/`, `backend/app/api/`, `frontend/src/pages/`, `frontend/src/features/`, `frontend/src/components/ui/`, `frontend/src/api/`
**Files scanned:** 9
**Pattern extraction date:** 2026-06-11
