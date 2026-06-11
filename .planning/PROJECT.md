# Library Management System (LMS)

## What This Is

A web-based Library Management System for Universitas XYZ. It allows students to search the catalog and request borrows, while librarians manage the collection, approve requests, and monitor overdue items via a dashboard.

## Core Value

Centralizing library operations to replace paper-based logs with an efficient, transparent, and mobile-responsive digital system.

## Requirements

### Validated

- [x] **F01**: User registration & login (Students/Librarians) — *Validated in Phase 1: Foundation & Catalog*
- [x] **F07**: Book management CRUD for librarians — *Validated in Phase 1: Foundation & Catalog*

### Active

- [ ] **F02**: Book catalog search and filtering
- [ ] **F03**: Borrow request submission and approval/rejection
- [ ] **F04**: Return tracking and availability updates
- [ ] **F05**: Overdue alerts for late returns
- [ ] **F06**: Librarian dashboard for loans and requests

### Out of Scope

- **Online Payments**: Fines are tracked but payments are handled elsewhere. — Simplify initial scope.
- **Inter-library Loans**: Restricted to Universitas XYZ only. — Outside university mandate.
- **Digital Content**: Physical books only, no e-books. — Focus on physical collection management.
- **Native Mobile Apps**: Use responsive web design instead. — Lower development and maintenance cost.

## Context

The system now has a functional "Walking Skeleton" with secure JWT authentication and core collection management (Titles and physical Copies). The university's paper-based logs can now be digitally represented.

## Constraints

- **Tech Stack**: FastAPI (Python) backend, React frontend, PostgreSQL database. — Team preference and university infrastructure.
- **Infra**: Must be deployable via Docker to university servers. — Existing deployment standard.
- **Performance**: Page and search responses must be under 2 seconds. — User experience requirement.
- **Security**: Authentication and authorization enforced via JWT. — Data protection requirement.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Follow sample spec exactly | User wants to follow the built-in tutorial project spec for LMS. | ✓ Validated |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-06-11 after Phase 1 Completion*
