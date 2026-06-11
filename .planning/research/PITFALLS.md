# Domain Pitfalls: Library Management System

**Domain:** Management Information System (Library)
**Researched:** 2026-06-11

## Critical Pitfalls

### Pitfall 1: XSS Token Theft
**What goes wrong:** Storing JWTs in `localStorage` allows a single XSS vulnerability to steal user sessions.
**Why it happens:** Developer convenience; `localStorage` is easier to use than cookies.
**Consequences:** Complete account takeover of student or librarian accounts.
**Prevention:** Use **HTTPOnly Cookies** for refresh tokens and in-memory storage for access tokens.
**Detection:** Regular dependency audits and CSP (Content Security Policy) headers.

### Pitfall 2: Race Conditions in Borrowing
**What goes wrong:** Two users request the same book simultaneously, and both get approved.
**Why it happens:** Lack of atomic operations or row-level locking during the "check availability and reserve" phase.
**Consequences:** Physical book is over-committed, leading to user frustration.
**Prevention:** Use PostgreSQL **SELECT FOR UPDATE** or atomic status updates (`UPDATE books SET status = 'borrowed' WHERE id = X AND status = 'available'`).

## Moderate Pitfalls

### Pitfall 1: Brittle PDF Layouts
**What goes wrong:** PDF reports look broken on different servers.
**Prevention:** Use `WeasyPrint` with standard CSS and bundle your fonts within the Docker container to ensure consistent rendering.

### Pitfall 2: Camera Permission Fatigue
**What goes wrong:** The browser-based barcode scanner repeatedly asks for permission or fails on non-HTTPS origins.
**Prevention:** Ensure the app is served over **HTTPS** (mandatory for camera API). Use a clear UI flow to explain why camera access is needed.

## Minor Pitfalls

### Pitfall 1: Search Performance
**What goes wrong:** Large catalogs (50k+ books) slow down on simple `ILIKE` queries.
**Prevention:** Implement PostgreSQL Full Text Search (FTS) indexes early in the database design.

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| **Auth Setup** | CORS Misconfiguration | Explicitly allow credentials and specific origins in FastAPI middleware. |
| **Catalog CRUD** | Data consistency | Use Pydantic schemas to strictly validate ISBN formats and date fields. |
| **Loan Logic** | Timezone mismatches | Store all timestamps in **UTC** and convert to local time on the frontend. |

## Sources
- OWASP Top Ten (Broken Access Control)
- Real-world LMS post-mortems (OpenBiblio / Evergreen)
- FastAPI Community Discussions (Common pitfalls with SQLModel)
