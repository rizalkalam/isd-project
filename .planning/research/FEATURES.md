# Feature Landscape: Library Management System

**Domain:** Management Information System (Library)
**Researched:** 2026-06-11

## Table Stakes

Features users expect in a modern LMS.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Instant Search** | Users expect "type-to-filter" behavior for the catalog. | Low | Use TanStack Table on frontend. |
| **Mobile-Responsive UI** | Students search for books on their phones. | Low | Tailwind CSS / shadcn handles this. |
| **Status Indicators** | Immediate visual of "Available", "Borrowed", "Reserved". | Low | Real-time DB check. |
| **Secure Authentication** | Librarian actions must be protected. | Medium | Use JWT with secure cookie strategy. |
| **Data Export** | Librarians need Excel/CSV exports for reporting. | Low | Native TanStack Table export or CSV response. |

## Differentiators

Features that set this LMS apart and add significant value.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **In-Browser Scanning** | Turn any phone/laptop camera into a barcode scanner. | Medium | Use `Html5-qrcode`. Saves hardware costs. |
| **PDF Borrow Slips** | Professional receipts for borrow confirmation. | Medium | Use `WeasyPrint` for templated PDFs. |
| **Visual Dashboard** | Analytics on most borrowed books, overdue trends. | Medium | Use `Recharts` with shadcn. |
| **Optimistic UI** | Borrow requests feel instant; UI updates before server confirmation. | Medium | Handled by TanStack Query. |

## Anti-Features

Features to explicitly NOT build to maintain focus and security.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Social Media Auth** | Security risk for university data; not professional. | Use standard Email/Pass or LDAP. |
| **In-App Chat** | High maintenance; distracting. | Use university's existing email/messaging. |
| **Digital Library (E-books)**| Copyright/storage complexity exceeds scope. | Focus on physical inventory management. |
| **Global Search** | No need to search outside Universitas XYZ. | Index local PostgreSQL catalog efficiently. |

## Feature Dependencies

```mermaid
User Auth → Book Catalog CRUD
Book Catalog → Borrowing Workflow
Borrowing Workflow → Overdue Alerts
Borrowing Workflow → Librarian Dashboard
```

## MVP Recommendation

Prioritize:
1. **F01 & F07**: User auth and Book CRUD (Management foundation).
2. **F02**: Search & Filtering (Public value).
3. **F03 & F04**: Borrow/Return core logic.
4. **F06**: Basic Librarian Dashboard.

Defer:
- **F05 (Overdue Alerts)**: Can be handled manually by librarians via the dashboard in the very first release.
- **Advanced Analytics**: Focus on operational tracking first.

## Sources
- Competitive analysis of OpenBiblio, Koha (LMS industry standards).
- 2025 UX trends for management dashboards.
