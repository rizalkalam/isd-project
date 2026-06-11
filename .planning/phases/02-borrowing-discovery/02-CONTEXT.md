# Phase 02: Borrowing & Discovery

## Domain

This phase implements the core business value of the Library Management System: allowing students to find and request books, and enabling librarians to fulfill those requests. It establishes the `Loan` lifecycle.

## Decisions

### Search & Discovery (CAT-03, CAT-04)
- **Search Mechanism**: **Basic SQL Search**. We will use standard SQL `ILIKE` queries for searching by title, author, or ISBN. This is sufficient for the MVP scale.
- **Availability Calculation**: **Dynamic Calculation**. "Real-time availability" will be calculated on-the-fly using subqueries or database views rather than maintaining a cached counter on the Title model. This ensures absolute accuracy and eliminates cache-invalidation bugs.

### Circulation & Transactions (CIRC-01 to CIRC-04)
- **Concurrency Control**: **Pessimistic Locking**. To satisfy CIRC-04 (Atomic transactions to prevent double-borrowing), we will use SQLModel/SQLAlchemy transaction blocks with `SELECT FOR UPDATE` when allocating a physical copy to a borrow request.
- **Loan State Machine**: The loan lifecycle will have explicit states: `PENDING` (Student requested), `APPROVED` (Librarian allocated a copy, ready for pickup), `REJECTED` (Librarian denied), `ACTIVE` (Student picked up), and `RETURNED` (Librarian recorded return).

## Code Context

### Reusable Assets
- `frontend/src/api/client.ts`: Pre-configured Axios instance with auth headers.
- `frontend/src/features/catalog/components/BookCard.tsx`: Can be adapted for the student search view.
- `frontend/src/components/ui/badge.tsx`: Used for loan status displays.

### Established Patterns
- **Tech Stack**: FastAPI (Backend) + React/Vite (Frontend) + PostgreSQL.
- **ORM**: SQLModel.

## Canonical Refs

- `.planning/PROJECT.md`: Core project specification.
- `.planning/ROADMAP.md`: Phase definition.
- `.planning/REQUIREMENTS.md`: Traceability.

## Deferred Ideas

- **Advanced Search**: (Faceted filtering) remains deferred.
- **Waitlists**: If a book is unavailable, students currently cannot join a waitlist (Out of MVP Scope).
- **Self-Checkout**: Students must physically collect the book from a librarian (No barcode scanning yet).

---
*Last updated: 2026-06-11 after Phase 2 Discussion*
