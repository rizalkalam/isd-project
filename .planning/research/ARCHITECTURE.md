# Architecture Patterns: Clinical Epidemiology System

**Domain:** Clinical Epidemiology & Surveillance
**Researched:** 2026-06-11

## Recommended Architecture

The system follows a **Decoupled Analytical Layer** architecture. This ensures that the primary Transaction Processing System (TPS) remains stable while providing the heavy lifting required for real-time epidemiological analytics.

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| **Legacy TPS** | Operational clinical database (Rekam Medis). | Debezium (Source) |
| **Ingestion Pipeline** | Extracts data via CDC (Debezium) and pushes to Kafka. | Legacy TPS, Kafka |
| **Transformation Service** | Normalizes ICD-10 data, de-identifies PHI, calculates SLA deltas. | Kafka, PostgreSQL, Redis |
| **Analytical DB (Postgres)** | Stores historical trends, SLA metrics, and aggregated counts. | Transformation Service, API Backend |
| **Hot Layer (Redis)** | Stores real-time counters and active wait-time trackers. | Transformation Service, API Backend |
| **API Backend (Node.js)** | Serves dashboard data, handles RBAC, and report generation. | PostgreSQL, Redis, React Frontend |
| **Dashboard (React)** | Visualizes trends and SLA alerts for Managers and Staff. | API Backend |

### Data Flow

1.  **Ingestion:** Patient check-in or diagnosis entry in **TPS** triggers a log entry. **Debezium** captures this change and streams it to **Kafka**.
2.  **Processing:** The **Transformation Service** consumes the stream.
    *   **Diagnosis:** Maps granular ICD-10 to 3-character categories.
    *   **SLA:** Detects status transitions (e.g., `Arrived` timestamp vs `Doctor-Called` timestamp) and calculates the delta.
    *   **Anonymization:** Redacts PII (Name, NIK) and generalizes age.
3.  **Persistence:** Normalized data is stored in **PostgreSQL** for historical reporting and **Redis** for real-time dashboard updates.
4.  **Presentation:** The **React Dashboard** polls or receives updates from the **API**, presenting anonymized visualizations to the user.

## Patterns to Follow

### Pattern 1: Change Data Capture (CDC)
**What:** Reading database transaction logs instead of querying tables directly.
**When:** Integrating with legacy databases where you cannot modify the schema or risk performance degradation.
**Example:**
```json
// Example Kafka Message from Debezium
{
  "op": "u",
  "before": { "id": 101, "status": "Arrived", "diagnosis": null },
  "after": { "id": 101, "status": "Consulting", "diagnosis": "A15.0" },
  "ts_ms": 1623345600000
}
```

### Pattern 2: ICD-10 Hierarchical Aggregation
**What:** Rolling up specific codes into parent categories for cleaner trends.
**When:** Visualizing population-level epidemiology.
**Logic:**
```typescript
function rollUpICD10(code: string): string {
  // Take first 3 characters (e.g., A15.0 -> A15)
  return code.substring(0, 3);
}
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Real-time Joins on TPS
**What:** Querying the production rekam medis database directly for dashboard filters.
**Why bad:** High risk of locking operational tables, causing "Check-in" or "Diagnosis Entry" to hang during clinical peak hours.
**Instead:** Sync data to an analytical store (PostgreSQL) and query that.

### Anti-Pattern 2: PHI Leakage in Aggregates
**What:** Showing exact counts for rare diseases in small populations (e.g., "1 patient with Disease X in Ward Y").
**Why bad:** Allows for easy re-identification of patients.
**Instead:** Apply "Small Cell Suppression" logic; display "<5" for low counts.

## Scalability Considerations

| Concern | At 100 users/day | At 10K users/day | At 1M patients/year |
|---------|--------------|--------------|-------------|
| **Ingestion** | Simple polling. | CDC + Kafka (Required). | Partitioned Kafka topics. |
| **Storage** | Single Postgres instance. | Read replicas for Dashboard. | TimescaleDB extension for time-series. |
| **Dashboards** | Direct API calls. | Cached Redis aggregates. | Pre-calculated daily/weekly materialized views. |

## Build Order (Dependencies)

1.  **Phase 1 (Infrastructure):** Setup PostgreSQL + Debezium + Kafka. Verify data flow from TPS dummy to Postgres.
2.  **Phase 2 (Logic):** Implement ICD-10 mapping and SLA calculation engine in the Transformation Service.
3.  **Phase 3 (Frontend):** Build React dashboard components using mocked data from the Logic phase.
4.  **Phase 4 (Security):** Layer in RBAC and Anonymization filters.

## Sources

- [Clinical Data Warehouse Patterns - Microsoft/Google Healthcare Cloud]
- [HL7 FHIR Measure Resource for KPIs]
- [CDC Design Patterns for Surveillance Systems]
