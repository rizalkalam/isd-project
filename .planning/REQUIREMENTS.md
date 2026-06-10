# REQUIREMENTS.md

## v1 Requirements (MVP)

### Epidemiology & Trends (EPI)
- [ ] **EPI-01**: User can view a dashboard showing the Top 10 Disease Trends based on ICD-10 codes.
- [ ] **EPI-02**: User can filter trend graphs by weekly or monthly time ranges.
- [ ] **EPI-03**: System shall roll up granular ICD-10 codes to 3-character categories for trend analysis.
- [ ] **EPI-04**: System shall aggregate data from the legacy TPS database via a decoupled analytical pipeline.
- [ ] **EPI-05**: System shall automatically redact Personal Identifiable Information (PII) like Name and NIK from all manager-facing dashboards.

### SLA & Operational Efficiency (SLA)
- [ ] **SLA-01**: System shall automatically calculate patient waiting times (delta between Check-in and Panggil Dokter).
- [ ] **SLA-02**: User can view real-time metrics for average daily waiting times.
- [ ] **SLA-03**: System shall trigger a visual alert/indicator (Red/Green) when the average waiting time exceeds 60 minutes.

### System & Access (SYS)
- [ ] **SYS-01**: System shall implement Role-Based Access Control (RBAC) for "Manajer Klinik" and "Staf Administrasi".
- [ ] **SYS-02**: System shall remain strictly read-only relative to the legacy rekam medis database (TPS).
- [ ] **SYS-03**: User can export analytical reports to PDF or Excel format.

---

## v2 Requirements (Future)

### Advanced Analytics (ADV)
- [ ] **ADV-01**: Early Warning Alerts — Automatically flag statistical spikes (e.g., >2 standard deviations) in specific disease categories.
- [ ] **ADV-02**: Wait Time Heatmaps — Visualize clinic bottleneck hours across the day/week.
- [ ] **ADV-03**: Predictive Forecasting — Forecast disease trends for the next 4-8 weeks based on historical seasonal data.

### Enhanced Surveillance (SUR)
- [ ] **SUR-01**: Syndromic Surveillance — Track symptoms/signs (fever, cough) before a formal ICD-10 diagnosis is recorded.
- [ ] **SUR-02**: Geographic Clustering — Map disease outbreaks to specific neighborhoods/regions (with k-anonymity).

---

## Out of Scope

- **Manajemen Inventaris Farmasi** — Logistics and stock management for medicines/medical supplies are excluded.
- **Logika Resep Racikan** — Complex prescription compounding logic is not handled.
- **Integrasi Pembayaran Kasir (Billing)** — Financial transactions and insurance billing are outside the surveilance scope.
- **Aplikasi Mobile Smartphone** — Development is restricted to a Desktop-First web-based dashboard.
- **Patient Record Editing** — Modifications to the original clinical data in the TPS are strictly prohibited.

---

## User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-01 | Manajer Klinik | See which diseases are spiking this week | I can order more medicines and prepare staff. |
| US-02 | Manajer Klinik | Monitor average patient wait times | I can identify bottlenecks and improve clinic service levels. |
| US-03 | Staf Administrasi | Export monthly epidemiology reports | I can submit required documentation to stakeholders without manual re-calculation. |
| US-04 | Dokter | Use standardized ICD-10 codes | My diagnoses contribute to an accurate early warning system for the clinic. |

---

## Definition of Done (DoD)

- [ ] Requirement is implemented according to the specified logic.
- [ ] Automated tests (Unit/Integration) pass with >80% coverage.
- [ ] Data privacy constraints (PII redaction) are verified.
- [ ] Dashboard responsiveness (load time < 5s) is confirmed.
- [ ] Documentation (STATE.md, README) is updated.
- [ ] User approval (or automated verifier) is obtained.

---

## Traceability

| REQ-ID | Phase | Status |
|--------|-------|--------|
| EPI-01 | TBD | — |
| EPI-02 | TBD | — |
| EPI-03 | TBD | — |
| EPI-04 | TBD | — |
| EPI-05 | TBD | — |
| SLA-01 | TBD | — |
| SLA-02 | TBD | — |
| SLA-03 | TBD | — |
| SYS-01 | TBD | — |
| SYS-02 | TBD | — |
| SYS-03 | TBD | — |

---
*Last updated: 2026-06-11 after initialization*
