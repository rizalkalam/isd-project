# Walking Skeleton: Library Management System

This document records the architectural baseline and "thin thread" implementation for the Library Management System.

## Stack Baseline

- **Backend**: FastAPI (Python 3.12+)
- **Frontend**: React 19 (Vite, TypeScript)
- **Database**: PostgreSQL 16
- **ORM**: SQLModel (SQLAlchemy 2.0 + Pydantic 2.0)
- **Styling**: Tailwind CSS + shadcn/ui
- **Auth**: JWT (Access: In-memory, Refresh: HTTPOnly Cookie)

## Directory Layout

```text
/
├── backend/
│   ├── app/
│   │   ├── api/          # Route handlers
│   │   ├── core/         # Security, Config
│   │   ├── db/           # Session management
│   │   └── models/       # SQLModel definitions
│   ├── migrations/       # Alembic
│   ├── tests/
│   └── main.py           # App entry
├── frontend/
│   ├── src/
│   │   ├── api/          # Axios/Fetch client
│   │   ├── components/   # Shared UI (shadcn)
│   │   ├── features/     # Feature-sliced logic
│   │   └── pages/        # Route components
│   └── public/
├── docker-compose.yml
└── .env.example
```

## "Thin Thread" Path

The Walking Skeleton demonstrates the following end-to-end flow:
1. **User Auth**: Registration -> Login (JWT Set) -> Protected Page Access -> Logout.
2. **Data Flow**: React (Fetch) -> FastAPI (SQLModel) -> PostgreSQL (CRUD).

## Deployment Baseline

- **Containerization**: Multi-stage Docker builds for Backend and Frontend.
- **Orchestration**: Docker Compose for local development and initial staging.

## Verification

- `GET /health` returns 200 OK.
- `POST /api/v1/auth/login` returns JWT and sets HTTPOnly cookie.
- React app loads and communicates with Backend API via Docker network.
