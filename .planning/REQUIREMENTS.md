# Requirements

## v1 Requirements

### Authentication
- [ ] **AUTH-01**: Users can register and login securely (JWT).
- [ ] **AUTH-02**: Differentiation between Student and Librarian roles.
- [ ] **AUTH-03**: Secure logout and session management.

### Catalog Management
- [ ] **CAT-01**: Librarians can Create, Read, Update, and Delete (CRUD) book titles.
- [ ] **CAT-02**: Separation of logical "Titles" and physical "Copies" (Inventory).
- [ ] **CAT-03**: Search catalog by title, author, or ISBN.
- [ ] **CAT-04**: Real-time availability status for each book.

### Circulation
- [ ] **CIRC-01**: Students can submit borrow requests for available books.
- [ ] **CIRC-02**: Librarians can approve or reject borrow requests.
- [ ] **CIRC-03**: Librarians can record book returns.
- [ ] **CIRC-04**: Atomic transactions to prevent double-borrowing.

### Notifications & Admin
- [ ] **NOTIF-01**: System identifies overdue books based on due dates.
- [ ] **NOTIF-02**: Dashboard for librarians to monitor loans and requests.
- [ ] **NOTIF-03**: Basic notifications for students regarding their loan status.

## v2 / Deferred

- **Advanced Search**: Faceted filtering and advanced query syntax.
- **Fine Tracking**: Recording and displaying fines for overdue items.

## Out of Scope

- **Online Payments**: Fines are tracked but not payable through the system.
- **Digital Content**: System manages physical inventory only.
- **Mobile Apps**: System is web-based with responsive design.

## Traceability

| REQ-ID | Phase | Plan | Status |
|--------|-------|------|--------|
| AUTH-01 | Phase 1 | — | Pending |
| AUTH-02 | Phase 1 | — | Pending |
| AUTH-03 | Phase 1 | — | Pending |
| CAT-01 | Phase 1 | — | Pending |
| CAT-02 | Phase 1 | — | Pending |
| CAT-03 | Phase 2 | — | Pending |
| CAT-04 | Phase 2 | — | Pending |
| CIRC-01 | Phase 2 | — | Pending |
| CIRC-02 | Phase 2 | — | Pending |
| CIRC-03 | Phase 2 | — | Pending |
| CIRC-04 | Phase 2 | — | Pending |
| NOTIF-01 | Phase 3 | — | Pending |
| NOTIF-02 | Phase 3 | — | Pending |
| NOTIF-03 | Phase 3 | — | Pending |
