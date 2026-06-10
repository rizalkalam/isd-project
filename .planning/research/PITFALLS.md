# Domain Pitfalls: Clinical Epidemiology

**Domain:** Clinical Epidemiology & Surveillance
**Researched:** 2026-06-11

## Critical Pitfalls

Mistakes that cause rewrites or major clinical issues.

### Pitfall 1: Performance Degradation of Operational TPS
**What goes wrong:** Frequent dashboard refreshes or large range queries lock tables in the medical records database.
**Why it happens:** Attempting to run analytics on the same database used for patient check-ins and diagnosis.
**Consequences:** Doctors and staff cannot enter data, leading to clinical delays and data entry errors.
**Prevention:** Use Change Data Capture (CDC) or a read-only replica for all analytics.
**Detection:** Monitor DB lock wait times and API latency on the TPS.

### Pitfall 2: Diagnosis Inconsistency (The "Free-Text" Trap)
**What goes wrong:** Trends show a "decrease" in a disease simply because staff started using a different name or shorthand.
**Why it happens:** Allowing free-text entry instead of forcing ICD-10 code selection.
**Consequences:** Inaccurate outbreak detection; management makes poor staffing/logistics decisions.
**Prevention:** Implement an auto-suggest ICD-10 search in the TPS and validate codes before sync.
**Detection:** High percentage of "Unspecified" or "Unknown" categories in the dashboard.

## Moderate Pitfalls

### Pitfall 1: Alert Fatigue
**What goes wrong:** Staff ignore visual alerts because they trigger too often for non-critical spikes.
**Prevention:** Use statistical significance (e.g., CUSUM algorithm) rather than simple count thresholds.

### Pitfall 2: Timezone Mismatches
**What goes wrong:** Weekly trends appear shifted or data is "missing" during early morning hours.
**Prevention:** Standardize all clinical timestamps to UTC at the ingestion layer.

## Minor Pitfalls

### Pitfall 1: Browser Memory Leaks
**What goes wrong:** Dashboard crashes after being left open on a nursing station PC for 24 hours.
**Prevention:** Use efficient React component lifecycles and avoid storing massive raw patient arrays in state.

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Ingestion (Phase 1) | TPS schema changes break CDC. | Use schema-registry and implement data contract tests. |
| SLA Logic (Phase 2) | Missing "Check-in" timestamps. | Implement fallback logic; flag encounters with incomplete workflow data. |
| Dashboard (Phase 3) | Visual clutter from too many ICD-10 codes. | Default to 3-character rollup; allow drill-down only on request. |

## Sources

- [Post-mortem: Health IT System Failures - NCBI]
- [Designing for Patient Safety: Alert Fatigue - AHRQ]
- [Debezium User Guide: Handling Schema Changes]
