# Phase 02 Discussion Log

## Overview
- **Phase**: 02 - Borrowing & Discovery
- **Date**: 2026-06-11
- **Participants**: User, Gemini CLI

## Decisions

### 1. Catalog Search Implementation
- **Question**: How should we implement the catalog search (CAT-03)?
- **Options Presented**:
    - Basic SQL Search (ILIKE queries)
    - Full-Text Search (PostgreSQL specific)
- **Selection**: **Basic SQL Search**
- **Rationale**: Simpler to implement and perfectly sufficient for the MVP scale.

### 2. Real-Time Availability
- **Question**: How should we handle "real-time availability" (CAT-04)?
- **Options Presented**:
    - Dynamic Calculation (Subqueries/views)
    - Cached Counter (Stored on Title model)
- **Selection**: **Dynamic Calculation**
- **Rationale**: Prioritizes accuracy and avoids the complexity of maintaining cache invalidation hooks.

### 3. Borrow Request Transactions
- **Question**: How should we handle atomic transactions for borrow requests (CIRC-04)?
- **Options Presented**:
    - Pessimistic Locking (SELECT FOR UPDATE)
    - Standard Validation (Application level)
- **Selection**: **Pessimistic Locking**
- **Rationale**: Safest approach to strictly prevent double-booking of physical copies under concurrent load.

## Structural Notes
- We explicitly defined the `Loan` state machine: `PENDING` -> `APPROVED`/`REJECTED` -> `ACTIVE` -> `RETURNED`.

## Deferred Ideas
- Waitlists for unavailable books.
- Self-checkout via barcode scanning.
