# Roadmap

## Phases

- [x] **Phase 1: Foundation & Catalog** - Establish secure access and collection management. (completed 2026-06-11)
- [ ] **Phase 2: Borrowing & Discovery** - Implement the core borrowing lifecycle and search.
- [ ] **Phase 3: Management & Monitoring** - Provide operational oversight and user notifications.

## Phase Details

### Phase 1: Foundation & Catalog

**Goal**: Establish secure access and collection management.
**Mode**: mvp
**Depends on**: Nothing
**Requirements**: AUTH-01, AUTH-02, AUTH-03, CAT-01, CAT-02
**Success Criteria** (what must be TRUE):

  1. User can register as a student or librarian and log in securely.
  2. Librarian can add a new book title and manage multiple physical copies of that title.
  3. User is correctly redirected based on their role after login and can log out.

**Plans**: 3 plans
**UI hint**: yes
Plans:
**Wave 1**

- [x] 01-01-PLAN.md — Foundation & Auth Skeleton

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 01-02-PLAN.md — Catalog & Inventory Slice

**Wave 3** *(Gap Closure)*

- [x] 01-03-PLAN.md — Title Update/Delete (CAT-01 Gap)

### Phase 2: Borrowing & Discovery

**Goal**: Implement the core borrowing lifecycle and search.
**Mode**: mvp
**Depends on**: Phase 1
**Requirements**: CAT-03, CAT-04, CIRC-01, CIRC-02, CIRC-03, CIRC-04
**Success Criteria** (what must be TRUE):

  1. Student can search the catalog by title, author, or ISBN and see real-time availability.
  2. Student can submit a borrow request, and atomic transactions prevent double-borrowing of the same copy.
  3. Librarian can approve/reject requests and record returns, with availability updating instantly.

**Plans**: TBD
**UI hint**: yes

### Phase 3: Management & Monitoring

**Goal**: Provide operational oversight and user notifications.
**Mode**: mvp
**Depends on**: Phase 2
**Requirements**: NOTIF-01, NOTIF-02, NOTIF-03
**Success Criteria** (what must be TRUE):

  1. Librarian can view a dashboard with key metrics: active loans, pending requests, and overdue items.
  2. System automatically identifies and flags overdue books for librarian attention.
  3. Student can view their current loan status and receive basic notifications on request updates.

**Plans**: TBD
**UI hint**: yes

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Catalog | 3/3 | Complete   | 2026-06-11 |
| 2. Borrowing & Discovery | 0/0 | Not started | - |
| 3. Management & Monitoring | 0/0 | Not started | - |
