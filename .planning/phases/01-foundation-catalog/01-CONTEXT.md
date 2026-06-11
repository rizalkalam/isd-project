# Phase 01: Foundation & Catalog

## Domain

Establishing the core data models, security infrastructure, and management UI for the Library Management System. This phase delivers the "Source of Truth" for the collection and the secure access layer for both students and librarians.

## Decisions

### Data Modeling
- **Title vs Copy**: **Strict Separation**. Metadata (Title, Author, ISBN) lives in a `titles` table. Physical books live in a `copies` table with unique IDs (e.g., barcodes) and status. This ensures we can track individual items and their unique history.

### Security & Auth
- **JWT Storage**: **High Security Split**. Refresh tokens in HTTPOnly, Secure, SameSite=Strict cookies. Access tokens in-memory (JS state). This mitigates XSS risks and follows the research recommendation.
- **Admin Bootstrapping**: **Registration + Seed Promotion**. Librarians register normally. The initial admin is promoted via a database seed or direct DB update, allowing subsequent management.

### User Experience
- **Management UI**: **Visual Card Gallery**. Librarian book management will use cards with covers and modal-based actions. This provides a modern, visual experience while maintaining functional CRUD capabilities.

## Code Context

### Reusable Assets
- None (Phase 1 is the project foundation).

### Established Patterns
- **Tech Stack**: FastAPI (Backend) + React/Vite (Frontend) + PostgreSQL.
- **ORM**: SQLModel (SQLAlchemy + Pydantic) for unified schemas.

## Canonical Refs

- `.planning/PROJECT.md`: Core project specification.
- `.planning/REQUIREMENTS.md`: v1 Requirements list.
- `.planning/research/SUMMARY.md`: Domain research findings.

## Deferred Ideas

- **Advanced Search**: Deferred to Phase 2 (Faceted filtering).
- **Barcode Scanning**: Implementation details deferred to Phase 2.

---
*Last updated: 2026-06-11 after Phase 1 Discussion*
