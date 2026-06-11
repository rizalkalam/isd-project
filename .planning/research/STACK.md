# Technology Stack: Library Management System

**Project:** Library Management System (LMS)
**Researched:** 2026-06-11
**Status:** Recommended for 2025/2026

## Recommended Stack

### Core Framework
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **FastAPI** | ^0.111.0 | Backend API | High performance, native async support, and excellent developer experience with type hints. |
| **React (Vite)** | ^5.0.0 | Frontend UI | Industry standard for SPAs. Vite provides significantly faster build and dev times than CRA. |
| **SQLModel** | ^0.0.19 | ORM | Combines SQLAlchemy 2.0 and Pydantic v2. Eliminates code duplication by using one class for both DB and API schemas. |

### Database
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **PostgreSQL** | 16+ | Data Storage | Robust relational database required for complex library associations (Authors, Books, Borrows, Users). |
| **Alembic** | ^1.13.0 | Migrations | The industry standard for Python database migrations. Reliable and battle-tested. |

### Infrastructure
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Docker** | 24+ | Containerization | Ensures consistency across development, staging, and university production servers. |
| **Docker Compose**| 2+ | Orchestration | Simplifies local development and small-scale deployment of API, DB, and Frontend containers. |

### Supporting Libraries
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **shadcn/ui** | Latest | UI Components | For rapid construction of accessible, beautiful dashboards using Radix UI and Tailwind. |
| **TanStack Query** | ^5.0.0 | Data Fetching | Manages server state, caching, and loading/error states for book lists and user data. |
| **TanStack Table** | ^8.0.0 | Data Grids | For powerful sorting, filtering, and pagination of the book catalog and loan history. |
| **Html5-qrcode** | ^2.3.0 | Barcode Scanning| Browser-based 1D/2D scanning for book check-in/check-out via mobile or webcam. |
| **WeasyPrint** | ^62.0 | PDF Generation | High-quality PDF generation for borrow slips and reports using standard HTML/CSS. |
| **PyJWT** | ^2.8.0 | Auth Tokens | For secure JWT creation and verification. |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| **ORM** | SQLModel | SQLAlchemy | SQLAlchemy is more verbose. SQLModel simplifies the FastAPI + Pydantic workflow. |
| **PDF** | WeasyPrint | ReportLab | ReportLab is too low-level and hard to style compared to HTML-to-PDF. |
| **UI** | shadcn/ui | Material UI | shadcn/ui offers better customization and "copy-paste" ownership than rigid component libraries. |
| **State** | TanStack Query | Redux | Redux is overkill for server-state management in an LMS; Query handles caching better. |

## Installation

```bash
# Backend
pip install fastapi[all] sqlmodel asyncpg alembic weasyprint pyjwt

# Frontend
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install @tanstack/react-query @tanstack/react-table lucide-react html5-qrcode
npx shadcn-ui@latest init
```

## Security Rationale: JWT Strategy
- **Access Token:** Stored in **JS Memory** (React state). Valid for 15 minutes. Prevents XSS theft.
- **Refresh Token:** Stored in **HTTPOnly, Secure, SameSite=Strict Cookie**. Valid for 7 days. Provides persistence while shielding the token from malicious scripts.

## Sources
- FastAPI Documentation (Best Practices 2024/2025)
- shadcn/ui Documentation (Dashboard Patterns)
- OWASP JWT Cheat Sheet (Modern Cookie Strategy)
- Benchmarks for HTML-to-PDF (2025 updates)
