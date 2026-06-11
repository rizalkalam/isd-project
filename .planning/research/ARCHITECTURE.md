# Architecture Patterns: Library Management System

**Domain:** Management Information System (Library)
**Researched:** 2026-06-11

## Recommended Architecture

The system follows a **Separated Frontend and Backend (Headless)** architecture. Communication is strictly via a RESTful API.

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| **Frontend (React)** | UI/UX, client-side routing, state management, barcode processing. | Backend API |
| **Backend (FastAPI)** | Business logic, validation, authentication, PDF generation. | Frontend API, PostgreSQL |
| **Database (Postgres)**| Relational data storage, indexing, constraints. | Backend API |

### Data Flow

1. **Client Action:** Librarian scans a book barcode.
2. **Frontend:** `Html5-qrcode` decodes the string → sends request to `/api/books/scan/{id}`.
3. **Backend:** FastAPI validates scan → SQLModel fetches book → updates status to "Borrowed" → persists to DB.
4. **Backend Response:** Returns updated book object + Success signal.
5. **Frontend:** TanStack Query invalidates cache → Table re-fetches or updates optimistically.

## Patterns to Follow

### Pattern 1: Repository / Service Layer
**What:** Decouple FastAPI route handlers from business logic and database access.
**When:** To maintain testability and clean code as the borrowing logic grows complex.
**Example:**
```python
class BookService:
    def __init__(self, db: Session):
        self.db = db
    
    async def process_borrow(self, book_id: int, user_id: int):
        # Business logic here
        pass
```

### Pattern 2: Component-Based UI (Atomic Design)
**What:** Use shadcn components as the "atoms" and build "molecules" like `BookCard` and "organisms" like `BorrowForm`.
**When:** Always. Keeps the UI consistent and maintainable.

## Anti-Patterns to Avoid

### Anti-Pattern 1: "Smart" Components
**What:** Putting complex data-fetching or business logic directly inside React UI components.
**Why bad:** Makes components hard to reuse and test.
**Instead:** Use custom hooks (e.g., `useBookDetails`) to wrap TanStack Query logic.

### Anti-Pattern 2: N+1 Database Queries
**What:** Fetching a list of books and then performing a separate query for every author/category in that list.
**Why bad:** Severe performance degradation as the catalog grows.
**Instead:** Use SQLModel's `selectinload` or `joinedload` to fetch related data in a single query.

## Scalability Considerations

| Concern | At 100 users | At 10K users | At 1M users |
|---------|--------------|--------------|-------------|
| **DB Load** | Single instance | Index optimization | Read replicas |
| **Search** | `ILIKE` on Postgres | GIN Indexes / FTS | Elasticsearch / Meilisearch |
| **Auth** | In-memory tokens | Distributed cache (Redis) | Distributed cache (Redis) |

## Sources
- FastAPI Project Generation Patterns (Tiangolo)
- Bulletproof React Architecture (Github/alan2207)
- PostgreSQL High Performance Guide (2025 updates)
