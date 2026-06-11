# Phase 01: Foundation & Catalog - Pattern Map

**Mapped:** 2026-06-11
**Files analyzed:** 13
**Analogs found:** 0 / 13 (Foundation phase - no existing app code)

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `backend/app/main.py` | config | request-response | N/A | no-analog |
| `backend/app/models/user.py` | model | N/A | N/A | no-analog |
| `backend/app/models/title.py` | model | N/A | N/A | no-analog |
| `backend/app/models/copy.py` | model | N/A | N/A | no-analog |
| `backend/app/api/v1/endpoints/auth.py` | controller | request-response | N/A | no-analog |
| `backend/app/api/v1/endpoints/titles.py` | controller | CRUD | N/A | no-analog |
| `backend/app/core/security.py` | utility | request-response | N/A | no-analog |
| `backend/app/core/config.py` | config | N/A | N/A | no-analog |
| `backend/app/db/session.py` | service | N/A | N/A | no-analog |
| `frontend/src/api/client.ts` | service | request-response | N/A | no-analog |
| `frontend/src/features/auth/hooks/useAuth.ts` | hook | request-response | N/A | no-analog |
| `frontend/src/features/catalog/components/BookCard.tsx` | component | transform | N/A | no-analog |
| `frontend/src/pages/admin/Inventory.tsx` | component | request-response | N/A | no-analog |

## Pattern Assignments

### Backend - Models (SQLModel)
**Reference:** `.planning/research/STACK.md`

**Core Pattern:** Unified schema for DB and API using SQLModel.
```python
from typing import Optional
from sqlmodel import Field, SQLModel, Relationship

class TitleBase(SQLModel):
    title: str = Field(index=True)
    author: str = Field(index=True)
    isbn: str = Field(unique=True, index=True)

class Title(TitleBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    # Relationships
    copies: list["Copy"] = Relationship(back_populates="title")
```

---

### Backend - Controllers (FastAPI)
**Reference:** `.planning/research/SUMMARY.md` (Architecture Patterns)

**Core Pattern:** Router-based endpoints with dependency injection for DB sessions.
```python
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.db.session import get_session
from app.models.title import Title

router = APIRouter()

@router.get("/", response_model=list[Title])
def read_titles(session: Session = Depends(get_session)):
    titles = session.exec(select(Title)).all()
    return titles
```

---

### Backend - Security (JWT Split)
**Reference:** `.planning/research/STACK.md` (Security Rationale)

**Pattern:** Split token storage strategy.
- Access Token: Returned in JSON body (for in-memory storage).
- Refresh Token: Set in HTTPOnly Cookie.
```python
@router.post("/login")
def login(response: Response, form_data: OAuth2PasswordRequestForm = Depends()):
    # ... verify user ...
    access_token = create_access_token(data={"sub": user.username})
    refresh_token = create_refresh_token(data={"sub": user.username})
    
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="strict"
    )
    return {"access_token": access_token, "token_type": "bearer"}
```

---

### Frontend - API Client
**Reference:** `.planning/research/STACK.md` (Supporting Libraries)

**Pattern:** Axios/Fetch interceptor for JWT handling and error catching.
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = getAccessTokenFromMemory();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

### Frontend - Component (shadcn/ui Card)
**Reference:** `.planning/phases/01-foundation-catalog/01-CONTEXT.md` (Management UI)

**Pattern:** Visual Card Gallery for items.
```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function BookCard({ title, author, isbn, coverUrl }: BookProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <img src={coverUrl} alt={title} className="h-48 w-full object-cover" />
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{author}</p>
      </CardHeader>
      <CardContent>
        <span className="text-xs font-mono">{isbn}</span>
      </CardContent>
    </Card>
  )
}
```

## Shared Patterns

### Authentication
**Source:** `.planning/research/STACK.md`
**Apply to:** All protected backend endpoints and frontend admin routes.
- Use `Depends(get_current_user)` in FastAPI.
- Use `ProtectedRoute` wrapper in React Router.

### Database Session
**Source:** `.planning/research/STACK.md`
**Apply to:** All CRUD service/endpoints.
- Context manager or `Depends` for `sqlmodel.Session`.

### Error Handling
**Source:** `CONVENTIONS.md` (from codebase root)
**Apply to:** All service and controller layers.
- FastAPI: `HTTPException` with clear detail messages.
- React: Toast notifications for API errors.

## No Analog Found

Files with no close match in the codebase (using RESEARCH.md patterns):

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| All app files | mixed | mixed | This is the initial foundation phase of the application. |

## Metadata

**Analog search scope:** Project root, `sample-project/`
**Files scanned:** 200+
**Pattern extraction date:** 2026-06-11
