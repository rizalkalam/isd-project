# Feature Landscape

**Domain:** Clinical Epidemiology & Surveillance
**Researched:** 2026-06-11

## Table Stakes

Features users expect in any clinical surveillance tool.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| ICD-10 Trend Charting | Core requirement for tracking disease outbreaks. | Medium | Requires clean data mapping. |
| Time Range Filtering | Epidemiologists need to compare weeks/months. | Low | Standard date range queries. |
| Wait Time (SLA) Tracking | Essential for operational efficiency and patient satisfaction. | Medium | Requires capturing transition timestamps. |
| Export (PDF/Excel) | Clinical reports must be shareable and archivable. | Low | Use standard libraries (jsPDF/xlsx). |
| RBAC | Sensitive clinical data access must be controlled. | Low | Role-based logic for Managers vs Staff. |

## Differentiators

Features that add high value beyond the basics.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Early Warning Alerts | Automatically flags spikes in specific ICD-10 categories. | High | Requires statistical threshold logic (e.g., 2 standard deviations). |
| Wait Time Heatmaps | Visualizes bottleneck hours for staffing optimization. | Medium | Grouping SLA data by hour of day. |
| Automated Anonymization | Ensures HIPAA compliance by default on all dashboard views. | Medium | Integration with ARX or custom de-identification pipeline. |

## Anti-Features

Features to explicitly NOT build to avoid scope creep.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Patient Record Editing | Risk of data integrity issues in the TPS. | Keep the analytics system strictly read-only. |
| Billing & Payments | Outside the scope of epidemiology and surveillance. | Focus on clinical diagnosis trends. |
| Complex Rx Logic | Drug-drug interaction checking is a separate domain. | Focus on ICD-10 codes, not pharmacy prescriptions. |

## Feature Dependencies

```
CDC Pipeline (Data) → ICD-10 Aggregation → Trend Dashboards
Encounter Status Tracking → Wait Time Calculation → SLA Alerts
```

## MVP Recommendation

Prioritize:
1. **ICD-10 Trend Dashboards** (3-character rollup)
2. **SLA Wait Time Tracking** (Basic Arrived-to-Panggil delta)
3. **Anonymized Manager View** (RBAC foundation)

Defer: **Statistical Alerting** (Phase 2+), **Predictive Modeling** (Future).

## Sources

- [CDC/NHSN Surveillance Definitions]
- [Hospital Management Information Systems (HMIS) best practices]
