# Technology Stack

**Project:** Sistem Epidemiologi Klinik
**Researched:** 2026-06-11

## Recommended Stack

### Core Framework
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| React | 18+ | Frontend Dashboard | Best-in-class for interactive, data-heavy visualizations. |
| Node.js / Express | 20+ | Backend API | Fast, event-driven, handles concurrent dashboard requests well. |
| Python (Pandas/NumPy) | 3.11+ | Analytics Engine | Superior libraries for epidemiological trend analysis and data processing. |

### Database
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| PostgreSQL | 15+ | Analytical Store | Strong JSONB support for ICD-10 data and robust aggregation capabilities. |
| Redis | 7.0+ | Hot Aggregates | Real-time counters for "Live" dashboard metrics and caching. |

### Infrastructure
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Debezium | Latest | CDC Ingestion | Extracts data from TPS logs without affecting production performance. |
| Apache Kafka | Latest | Message Broker | Decouples the ingestion layer from the transformation layer for reliability. |
| Docker / K8s | - | Containerization | Ensures consistency across development and clinical environments. |

### Supporting Libraries
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Recharts | Latest | Visualization | Primary charting library for trend and SLA graphs. |
| date-fns | Latest | Date Manipulation | Handling weekly/monthly clinical data windows. |
| ARX Library | Latest | Anonymization | Implementing K-Anonymity and de-identification rules. |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Ingestion | CDC (Debezium) | Polling ETL | Polling the TPS every minute causes unnecessary load and latency. |
| Database | PostgreSQL | MongoDB | Postgres provides better relational integrity for clinical records and faster aggregations for large datasets. |
| Visualization | Recharts | D3.js | D3 has a steeper learning curve; Recharts provides sufficient power for standard clinical charts. |

## Installation

```bash
# Core Backend
npm install express pg redis kafka-node

# Analytics (Python)
pip install pandas numpy flask

# Frontend
npm install react react-dom recharts date-fns
```

## Sources

- [Clinical Surveillance Architecture - NIH/Slideshare]
- [Debezium Documentation]
- [React/Recharts Documentation]
