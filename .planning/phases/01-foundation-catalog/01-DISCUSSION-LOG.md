# Phase 01 Discussion Log

## Overview
- **Phase**: 01 - Foundation & Catalog
- **Date**: 2026-06-11
- **Participants**: User, Gemini CLI

## Decisions

### 1. Title vs Copy Data Model
- **Question**: How should we handle Title vs Copy separation?
- **Options Presented**:
    - Strict Separation (Explicit Title and Copy tables)
    - Simplified Tracking (Combined table)
- **Selection**: **Strict Separation**
- **Rationale**: Better for tracking individual physical books and their unique history.

### 2. JWT Storage Strategy
- **Question**: Where should we store the JWT tokens?
- **Options Presented**:
    - High Security Split (HTTPOnly Refresh + In-Memory Access)
    - Standard LocalStorage
- **Selection**: **High Security Split**
- **Rationale**: Recommended security best practice for university environments to mitigate XSS risks.

### 3. Initial Librarian Setup
- **Question**: How should the first Librarian account be created?
- **Options Presented**:
    - Registration + Seed Promotion
    - Invitation Only
- **Selection**: **Registration + Seed Promotion**
- **Rationale**: Allows standard registration flow with a manual/automated promotion step for the first admin.

### 4. Librarian CRUD UI Style
- **Question**: What UI style should the Librarian's Book Management dashboard use?
- **Options Presented**:
    - Table-First Grid (Dense)
    - Visual Card Gallery
- **Selection**: **Visual Card Gallery**
- **Rationale**: User prefers a modern, visual experience for managing the collection.

## Deferred Ideas
- None captured in this session.
