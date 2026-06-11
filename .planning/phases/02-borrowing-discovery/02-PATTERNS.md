# Phase 02: Borrowing & Discovery - Pattern Map

**Mapped:** 2026-06-11
**Files analyzed:** 5
**Analogs found:** 5 / 5

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `backend/app/models/loan.py` | model | CRUD | `backend/app/models/title.py` | exact |
| `backend/app/api/v1/endpoints/loans.py` | controller | request-response | `backend/app/api/v1/endpoints/titles.py` | exact |
| `backend/app/api/v1/endpoints/titles.py` | controller | request-response | `backend/app/api/v1/endpoints/titles.py` | exact |
| `frontend/src/features/loans/api/loans.ts` | utility | request-response | `frontend/src/features/auth/hooks/useAuth.ts` | role-match |
| `frontend/src/pages/student/Discovery.tsx` | component | request-response | `frontend/src/pages/admin/Inventory.tsx` | exact |

## Pattern Assignments

### `backend/app/models/loan.py` (model, CRUD)

**Analog:** `backend/app/models/title.py`

**Imports pattern** (lines 1-3):
```python
from typing import Optional, List
from sqlmodel import Field, SQLModel, Relationship
```

**Core pattern - Base Class** (lines 4-9):
```python
class TitleBase(SQLModel):
    title: str = Field(index=True)
    author: str = Field(index=True)
    isbn: str = Field(unique=True, index=True)
    cover_url: Optional[str] = None
```

**Core pattern - Table Class** (lines 17-21):
```python
class Title(TitleBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Relationships
    copies: List["Copy"] = Relationship(back_populates="title", cascade_delete=True)
```

---

### `backend/app/api/v1/endpoints/loans.py` (controller, request-response)

**Analog:** `backend/app/api/v1/endpoints/titles.py`

**Imports pattern** (lines 1-7):
```python
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from app.db.session import get_session
from app.api import deps
from app.models.user import UserRole
```

**Auth pattern** (lines 20-21):
```python
    current_user = Depends(deps.check_role(UserRole.LIBRARIAN)),
```

**Core CRUD GET pattern** (lines 10-17):
```python
@router.get("/", response_model=List[Title])
async def get_titles(
    session: AsyncSession = Depends(get_session),
    skip: int = 0,
    limit: int = 100,
):
    result = await session.exec(select(Title).offset(skip).limit(limit))
    titles = result.all()
    return titles
```

**Core CRUD POST/Transaction/Error Handling pattern** (lines 23-32):
```python
    # Check if ISBN already exists
    result = await session.exec(select(Title).where(Title.isbn == title_in.isbn))
    existing_title = result.first()
    if existing_title:
        raise HTTPException(
            status_code=400,
            detail="A book with this ISBN already exists.",
        )
    
    db_obj = Title.from_orm(title_in)
    session.add(db_obj)
    await session.commit()
    await session.refresh(db_obj)
    return db_obj
```

---

### `frontend/src/features/loans/api/loans.ts` (utility, request-response)

**Analog:** `frontend/src/features/auth/hooks/useAuth.ts`

**Imports and Core API pattern** (lines 1-2, 16-17):
```typescript
import { useState } from 'react';
import api, { setAccessToken } from '../../../api/client';

// ...
      const response = await api.post('/auth/login', formData);
      const { access_token } = response.data;
```

---

### `frontend/src/pages/student/Discovery.tsx` (component, request-response)

**Analog:** `frontend/src/pages/admin/Inventory.tsx`

**Imports pattern** (lines 1-4):
```typescript
import { useQuery } from "@tanstack/react-query";
import api from "../../api/client";
import { BookCard } from "../../features/catalog/components/BookCard";
import { useState } from "react";
```

**React Query Fetching pattern** (lines 18-24):
```typescript
  const { data: titles, isLoading, error } = useQuery<Title[]>({
    queryKey: ["titles"],
    queryFn: async () => {
      const response = await api.get("/titles");
      return response.data;
    },
  });
```

**Error & Loading Handling pattern** (lines 36-48):
```typescript
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        Error loading inventory: {(error as any).message}
      </div>
    );
  }
```

---

## Shared Patterns

### Authentication & Role Guard
**Source:** `backend/app/api/deps.py`
**Apply to:** All protected controller endpoints
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

### API Client Axios configuration
**Source:** `frontend/src/api/client.ts`
**Apply to:** All frontend API calls
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  withCredentials: true,
});
```

## No Analog Found
None. All planned additions have solid existing analogs.

## Metadata

**Analog search scope:** `backend/app/**/*.py`, `frontend/src/**/*.{ts,tsx}`
**Files scanned:** 27
**Pattern extraction date:** 2026-06-11
