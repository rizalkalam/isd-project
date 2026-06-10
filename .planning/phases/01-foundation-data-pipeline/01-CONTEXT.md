# Phase 1: Foundation & Data Pipeline - Context

**Gathered:** 2026-06-11
**Status:** Ready for planning
**Source:** Discuss Phase (/gsd-discuss-phase)

<domain>
## Phase Boundary

Fase 1 ini berfokus pada pembangunan database dasar dan data pipeline (ingestion) untuk Sistem Analitik Epidemiologi Klinik. Sistem ini dirancang untuk menerima "lemparan" data mentah secara read-only dari Puskesmas tanpa memiliki modul operasional pendaftaran sendiri.

</domain>

<decisions>
## Implementation Decisions

### Data Architecture
- **Ingestion Method**: API Ingestion (Webhook) — Puskesmas melakukan "push" data ke endpoint REST API.
- **Database**: PostgreSQL — Digunakan sebagai analytical store.
- **Read-Only Constraint**: [LOCKED] Sistem analitik bersifat read-only terhadap database operasional; akses ke database analitik sendiri untuk dashboard nantinya akan menggunakan read-only user.

### Database Schema
- **Entitas Pasien**: `id_pasien_hash` (PK), `tahun_lahir`. (NIK dan Nama dibuang di level API).
- **Entitas Kunjungan**: `id_kunjungan` (PK), `id_pasien_hash` (FK), `waktu_check_in`, `status`.
- **Entitas Rekam_Medis**: `id_rm` (PK), `id_kunjungan` (FK), `kode_diagnosis` (ICD-10), `tanggal_periksa`.

### Anonymization Logic
- [LOCKED] Field `Nama` dan `NIK` harus dibuang dari payload sebelum disimpan (redaction di level memori).
- [LOCKED] `id_pasien` di-hash (misal menggunakan SHA-256 dengan salt) untuk menjaga konsistensi pelacakan tanpa mengungkap identitas.
- [LOCKED] `Tanggal Lahir` dikonversi menjadi `Tahun Lahir` saja.

### Performance (NFR)
- [LOCKED] Agregasi >10.000 baris data harus selesai dalam < 5 detik.
- Strategi: B-Tree Indexing pada kolom `tanggal_periksa` dan `kode_diagnosis`.

### Claude's Discretion
- Pemilihan framework API (Node.js/Express direkomendasikan).
- Struktur payload JSON untuk ingestion.
- Mekanisme autentikasi API Key untuk Puskesmas.

</decisions>

<canonical_refs>
## Canonical References

### Project Docs
- `.planning/PROJECT.md` — Project vision and core value.
- `.planning/REQUIREMENTS.md` — REQ-IDs: EPI-04, EPI-05, SYS-02.

</canonical_refs>

<specifics>
## Specific Ideas
- Gunakan `UPSERT` (ON CONFLICT) pada ingestion untuk menangani data duplikat dari push yang berulang.

</specifics>

<deferred>
## Deferred Ideas
- UI Dashboard (Fase 2).
- Kalkulasi metrik SLA kompleks (Fase 2).
- Notifikasi Alerting (Fase 2).

</deferred>

---

*Phase: 01-foundation-data-pipeline*
*Context gathered: 2026-06-11 via Discuss Phase*
