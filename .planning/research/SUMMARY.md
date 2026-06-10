# Project Research Summary

**Project:** Sistem Epidemiologi Klinik
**Domain:** Clinical Epidemiology & Surveillance
**Researched:** 2026-06-11
**Confidence:** HIGH

## Executive Summary

The Sistem Epidemiologi Klinik is a clinical surveillance and analytics platform designed to provide real-time epidemiological insights and operational efficiency tracking (SLA) without compromising the performance of legacy medical record systems. Experts in health IT build these systems using a **Decoupled Analytical Layer** architecture, which isolates heavy analytical workloads from the primary Transaction Processing System (TPS).

The recommended approach utilizes **Change Data Capture (CDC)** via Debezium and Apache Kafka to stream clinical events (check-ins, diagnoses) into a dedicated PostgreSQL analytical store. This ensures that the dashboard remains responsive and data is normalized for trend analysis (ICD-10 rollups) and anonymized for compliance.

Key risks include potential performance degradation of the operational TPS if analytics are run directly against it, and data quality issues stemming from inconsistent "free-text" diagnosis entries. These are mitigated by the CDC architecture and standardized ICD-10 mapping logic in the transformation layer.

## Key Findings

### Recommended Stack

The stack is designed for high-throughput data ingestion and interactive, data-heavy visualizations. It leverages Python's superior analytics libraries for backend processing and React for a responsive frontend.

**Core technologies:**
- **React 18+ / Recharts**: Frontend Dashboard — Best-in-class for interactive, data-heavy visualizations.
- **Node.js / Express**: Backend API — Fast, event-driven, handles concurrent dashboard requests well.
- **PostgreSQL 15+**: Analytical Store — Strong JSONB support for ICD-10 data and robust aggregation capabilities.
- **Debezium & Kafka**: Ingestion Layer — Decouples analytics from production TPS, ensuring zero performance impact on clinical operations.

### Expected Features

The focus is on providing epidemiological trends and operational wait-time metrics (SLA) while maintaining strict data privacy.

**Must have (table stakes):**
- **ICD-10 Trend Charting** — Core requirement for tracking disease outbreaks.
- **Wait Time (SLA) Tracking** — Essential for operational efficiency and patient satisfaction.
- **Anonymized Manager View** — Ensures HIPAA/compliance by default on all dashboard views.

**Should have (competitive):**
- **Early Warning Alerts** — Automatically flags spikes in specific ICD-10 categories using statistical thresholds.
- **Wait Time Heatmaps** — Visualizes bottleneck hours for staffing optimization.

**Defer (v2+):**
- **Patient Record Editing** — System should remain strictly read-only for analytics.
- **Billing & Payments** — Outside the scope of epidemiology and surveillance.

### Architecture Approach

The system follows a **Decoupled Analytical Layer** pattern. This ensures that the primary clinical database remains stable while providing the heavy lifting required for real-time analytics through an asynchronous ingestion pipeline.

**Major components:**
1. **Ingestion Pipeline (Debezium/Kafka)** — Extracts data via CDC from the legacy TPS.
2. **Transformation Service** — Normalizes ICD-10 codes, calculates SLA deltas, and redacts PII.
3. **Analytical Store (Postgres/Redis)** — Persistent and hot-layer storage for dashboard metrics.

### Critical Pitfalls

1. **TPS Performance Degradation** — Prevented by using Change Data Capture (CDC) instead of direct database polling.
2. **Diagnosis Inconsistency ("Free-Text")** — Mitigated by enforcing ICD-10 code standardization and 3-character rollups.
3. **PHI Leakage in Aggregates** — Avoided by implementing "Small Cell Suppression" (<5) for rare disease counts.
4. **Alert Fatigue** — Mitigated by using statistical significance logic (e.g., CUSUM) instead of simple count thresholds.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Infrastructure & Ingestion
**Rationale:** Establishing a safe, performant data pipeline is the prerequisite for all analytics.
**Delivers:** PostgreSQL + Debezium + Kafka environment and verified CDC flow from TPS to Analytical DB.
**Addresses:** Foundation for all data-driven features.
**Avoids:** Performance degradation of the production TPS.

### Phase 2: Core Analytics Engine
**Rationale:** Raw data must be transformed into epidemiological insights before visualization.
**Delivers:** ICD-10 mapping logic, SLA calculation service, and anonymization filters (ARX library).
**Uses:** Python (Pandas/NumPy) for analytics and Node.js for the service layer.
**Implements:** Transformation Service and Analytical DB schema.

### Phase 3: Monitoring Dashboard
**Rationale:** Provides the user interface for staff and managers to interact with the processed data.
**Delivers:** React dashboard with Trend Charts, SLA Tracking, and RBAC.
**Addresses:** ICD-10 Trend Charting, Time Range Filtering, Export (PDF/Excel).
**Avoids:** Visual clutter by defaulting to 3-character ICD-10 rollups.

### Phase 4: Advanced Insights & Alerts
**Rationale:** Adds high-value differentiation once the core data and UI are stable.
**Delivers:** Early Warning Alerts and Wait Time Heatmaps.
**Addresses:** Statistical threshold alerts and staffing optimization visualizations.

### Phase Ordering Rationale

- **Data First:** Ingestion must be proven before any logic or UI is built to avoid "garbage in, garbage out."
- **Read-Only Separation:** By building the Analytical Store first (Phase 1-2), we ensure the system remains strictly read-only as intended.
- **Incremental Complexity:** Basic trends and SLAs come before advanced statistical alerting to allow for baseline data accumulation.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1:** Needs research on specific TPS database engine (SQL Server/Oracle/MySQL) to select the correct Debezium connector.
- **Phase 2:** Needs research on local anonymization regulations to fine-tune ARX library rules.

Phases with standard patterns (skip research-phase):
- **Phase 3:** Visualization with Recharts is well-documented and standard.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Standard enterprise-grade CDC and analytics components. |
| Features | HIGH | Aligned with standard CDC and clinical surveillance requirements. |
| Architecture | HIGH | Follows established decoupled clinical data warehouse patterns. |
| Pitfalls | HIGH | Well-documented failures in health IT literature. |

**Overall confidence:** HIGH

### Gaps to Address

- **TPS Schema Specifics**: The exact structure of the legacy medical record system is unknown and needs mapping during Phase 1.
- **Notification Channels**: The method for delivering Early Warning Alerts (Email/SMS/In-app) needs user validation.

## Sources

### Primary (HIGH confidence)
- Clinical Surveillance Architecture - NIH/Slideshare — Core architecture patterns.
- CDC/NHSN Surveillance Definitions — Feature requirements and definitions.
- Debezium Documentation — CDC implementation details.

### Secondary (MEDIUM confidence)
- Clinical Data Warehouse Patterns (MSFT/Google) — Architectural validation.
- Health IT System Failures - NCBI — Pitfall identification.

---
*Research completed: 2026-06-11*
*Ready for roadmap: yes*
