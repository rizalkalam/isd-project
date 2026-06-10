# Phase 1: Foundation & Data Pipeline - Research

**Researched:** 2026-06-11
**Domain:** Clinical Data Ingestion & Anonymization
**Confidence:** HIGH

## Summary

Phase 1 focuses on establishing the core data infrastructure for the Clinical Epidemiology Analytics System. Following the locked decisions from the Discuss Phase, the system will implement a **push-based API ingestion** model where external facilities (Puskesmas) send clinical data via a REST API. This phase is critical for ensuring data privacy through real-time anonymization (redacting PII and hashing identifiers) before storage in a dedicated analytical PostgreSQL database.

**Primary recommendation:** Use a Node.js/Express API with Zod for robust input validation and the built-in `crypto` module for high-performance SHA-256 pseudonymization with system-wide salt and pepper.

## User Constraints (from CONTEXT.md)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Ingestion Method**: API Ingestion (Webhook) — Puskesmas melakukan "push" data ke endpoint REST API.
- **Database**: PostgreSQL — Digunakan sebagai analytical store.
- **Read-Only Constraint**: Sistem analitik bersifat read-only terhadap database operasional; akses ke database analitik sendiri untuk dashboard nantinya akan menggunakan read-only user.
- **Entitas Pasien**: `id_pasien_hash` (PK), `tahun_lahir`. (NIK dan Nama dibuang di level API).
- **Entitas Kunjungan**: `id_kunjungan` (PK), `id_pasien_hash` (FK), `waktu_check_in`, `status`.
- **Entitas Rekam_Medis**: `id_rm` (PK), `id_kunjungan` (FK), `kode_diagnosis` (ICD-10), `tanggal_periksa`.
- **Field Nama dan NIK**: Harus dibuang dari payload sebelum disimpan (redaction di level memori).
- **id_pasien**: Di-hash (misal menggunakan SHA-256 dengan salt) untuk menjaga konsistensi pelacakan tanpa mengungkap identitas.
- **Tanggal Lahir**: Dikonversi menjadi `Tahun Lahir` saja.
- **Performance**: Agregasi >10.000 baris data harus selesai dalam < 5 detik. Strategi: B-Tree Indexing pada kolom `tanggal_periksa` dan `kode_diagnosis`.

### the agent's Discretion
- Pemilihan framework API (Node.js/Express direkomendasikan).
- Struktur payload JSON untuk ingestion.
- Mekanisme autentikasi API Key untuk Puskesmas.

### Deferred Ideas (OUT OF SCOPE)
- UI Dashboard (Fase 2).
- Kalkulasi metrik SLA kompleks (Fase 2).
- Notifikasi Alerting (Fase 2).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| EPI-04 | Aggregate data from legacy TPS database via decoupled analytical pipeline. | API Ingestion (Webhook) identified as the primary decoupled mechanism. |
| EPI-05 | Automatically redact PII (Name, NIK) from manager-facing dashboards. | In-memory redaction logic researched for Node.js `crypto` and mapping. |
| SYS-02 | Strictly read-only relative to legacy rekam medis database (TPS). | Decoupled architecture ensures the analytical system never writes to the source TPS. |
</phase_requirements>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| API Ingestion | API / Backend | — | Receives external data, validates structure, and authorizes requests. |
| Data Redaction & Hashing | API / Backend | — | PII (Name/NIK) must be removed in memory *before* persistence. |
| Analytical Data Store | Database | — | PostgreSQL stores transformed, anonymized records optimized for analytics. |
| Data Deduplication | Database | API / Backend | Uses `UPSERT` (ON CONFLICT) to handle repeated data pushes safely. |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Node.js | v26.3.0 | Runtime | High-concurrency support for ingestion endpoints. |
| Express | 5.2.1 | API Framework | Minimalist, fast, and recommended in discretion. |
| PostgreSQL | 15+ | Database | Robust analytical capabilities and standard indexing. |
| Prisma | 7.8.0 | ORM | Type-safe database interactions and migrations. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Zod | 4.4.3 | Validation | Ensuring incoming clinical data matches the expected schema. |
| Helmet | 8.2.0 | Security | Secure Express headers (XSS, Clickjacking protection). |
| Dotenv | 17.4.2 | Config | Managing environment variables (DB URLs, Salts). |
| Crypto | (Built-in) | Anonymization | SHA-256 hashing for Patient IDs. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Prisma | Drizzle ORM | Drizzle is lighter, but Prisma has better DX for rapid scaffolding. |
| Express | Fastify | Fastify is faster, but Express is the project's recommended framework. |

**Version verification:**
- `npm view express version`: 5.2.1 (latest)
- `npm view prisma version`: 7.8.0
- `npm view zod version`: 4.4.3

## Package Legitimacy Audit

| Package | Registry | Age | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|-------------|---------|-------------|
| express | npm | 14 yrs | 33M/wk | github.com/expressjs/express | [OK] | Approved |
| prisma | npm | 6 yrs | 3.5M/wk | github.com/prisma/prisma | [OK] | Approved |
| zod | npm | 4 yrs | 14M/wk | github.com/colinhacks/zod | [OK] | Approved |
| helmet | npm | 12 yrs | 3M/wk | github.com/helmetjs/helmet | [OK] | Approved |

## Architecture Patterns

### System Architecture Diagram
```text
[Puskesmas] --(Push JSON via HTTPS)--> [Express API]
                                          |
                                          |-- 1. Auth Check (API Key)
                                          |-- 2. Validation (Zod)
                                          |-- 3. Redact (Drop Name, NIK)
                                          |-- 4. Hash (ID + Salt + Pepper)
                                          |-- 5. Transform (DOB -> Year)
                                          |
                                          v
                                     [PostgreSQL] (Analytical Store)
                                     (Tables: Pasien, Kunjungan, RM)
```

### Recommended Project Structure
```
src/
├── api/             # Express routes and controllers
├── middleware/      # Auth and Validation logic
├── services/        # Anonymization and Hashing logic
├── schema/          # Zod and Prisma schemas
└── scripts/         # DB seed or maintenance scripts
```

### Pattern 1: Deterministic Pseudonymization
**What:** Using SHA-256 with a system-wide secret (pepper) and a per-record salt (or a derived salt) to replace sensitive IDs.
**When to use:** When you need to link records for the same patient across multiple visits without storing their identity.
**Example:**
```typescript
// Source: WebSearch best practices
import crypto from 'crypto';

export function hashPatientId(id: string, salt: string, pepper: string): string {
  return crypto
    .createHash('sha256')
    .update(id + salt + pepper)
    .digest('hex');
}
```

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Ingestion Security | Custom Header Auth | API Key + Helmet | Helmet handles common headers (HSTS, etc.) standardly. |
| Schema Validation | Hand-rolled `if/else` | Zod | Zod handles complex nested clinical data structures safely. |
| Duplicate Pushes | `SELECT` then `INSERT` | `UPSERT` (SQL) | Avoids race conditions and improves performance. |

## Common Pitfalls

### Pitfall 1: Salt Reuse / No Pepper
**What goes wrong:** If the salt is fixed or compromised, an attacker can use rainbow tables to re-identify patients.
**How to avoid:** Use a system-wide `PEPPER` stored in environment variables (not DB) and a unique per-patient `SALT`.

### Pitfall 2: Sensitive Data in Logs
**What goes wrong:** Logging the entire request body for debugging can leak Name/NIK into persistent logs.
**How to avoid:** Implement a redaction middleware for the logger (e.g., `morgan` custom format) to exclude sensitive fields.

## Code Examples

### Zod Schema for Clinical Ingestion
```typescript
import { z } from 'zod';

export const IngestionSchema = z.object({
  id_pasien: z.string(),
  nama: z.string(), // To be redacted
  nik: z.string(),  // To be redacted
  dob: z.string().datetime(), // To be transformed
  kunjungan: z.object({
    id_kunjungan: z.string(),
    waktu_check_in: z.string().datetime(),
    status: z.string()
  }),
  rekam_medis: z.array(z.object({
    id_rm: z.string(),
    kode_diagnosis: z.string(), // ICD-10
    tanggal_periksa: z.string().datetime()
  }))
});
```

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Puskesmas can provide ISO 8601 datetimes. | Code Examples | Parsing errors if data is in a different format. |
| A2 | API Key is sufficient for Puskesmas auth. | Implementation | May need more complex OAuth if security requirements change. |

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | API Runtime | ✓ | v26.3.0 | — |
| npm | Package Management | ✓ | 11.16.0 | — |
| PostgreSQL | Data Store | ✗ | — | Needs installation or Docker setup |
| Docker | DB Containerization | ✗ | — | Install Docker or local Postgres |

**Missing dependencies with no fallback:**
- **PostgreSQL**: The plan MUST include a task to set up the database environment.

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V5 Input Validation | Yes | Zod schema enforcement for all ingestion payloads. |
| V13 API Security | Yes | API Key authentication and HTTPS enforcement. |
| V8 Data Protection | Yes | Redaction and hashing before storage. |

### Known Threat Patterns for Node.js API

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Insecure Direct Object Reference | Information Disclosure | RBAC and Hash-based IDs to prevent ID walking. |
| Denial of Service (DoS) | Availability | `express-rate-limit` to prevent flooding the ingestion endpoint. |

## Sources

### Primary (HIGH confidence)
- `crypto` documentation (Node.js) - SHA-256 implementation.
- `express` documentation - REST API routing.
- `zod` documentation - Schema validation.

### Secondary (MEDIUM confidence)
- Google Web Search - Healthcare data anonymization best practices.
- PostgreSQL Indexing - ICD-10 analysis patterns.

---
**Research date:** 2026-06-11
**Valid until:** 2026-07-11
