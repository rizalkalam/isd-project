# Sistem Epidemiologi (Prediksi Tren Penyakit)

## What This Is

Sistem Epidemiologi Klinik adalah aplikasi berbasis web yang membantu klinik memprediksi tren penyakit pasien berdasarkan data pemeriksaan dan riwayat kasus. Aplikasi ini menganalisis lonjakan penyakit endemis musiman sehingga manajemen klinik dapat melakukan penanganan, persiapan logistik, dan pengaturan SDM lebih cepat dan proaktif.

## Core Value

Mengubah data rekam medis mentah menjadi sistem kewaspadaan dini yang akurat untuk mencegah keterlambatan respon terhadap lonjakan kasus penyakit.

## Requirements

### Validated

- ✓ Integrasi dengan data rekam medis (TPS) — existing codebase baseline
- ✓ Standarisasi diagnosis berbasis ICD-10 — existing codebase baseline

### Active

- [ ] Dasbor Analitik Tren Penyakit (Filter Mingguan/Bulanan)
- [ ] Perhitungan otomatis SLA Waktu Tunggu (Check-in s/d Panggil Dokter)
- [ ] Role-Based Access Control (Manajer dan Staf)
- [ ] Export laporan analitik ke format PDF/Excel
- [ ] Notifikasi/Alert visual untuk tren waktu tunggu yang melampaui ambang batas (> 60 menit)

### Out of Scope

- Manajemen Inventaris Farmasi (Stok obat/alkes) — Fokus pada analitik epidemiologi, bukan logistik gudang.
- Logika Resep Racikan — Terlalu kompleks untuk tahap awal analitik.
- Integrasi Pembayaran Kasir (Billing) — Diluar lingkup surveilans klinis.
- Aplikasi Mobile Smartphone — Optimasi saat ini fokus pada tampilan Desktop/PC untuk visualisasi data yang padat.

## Context

- Klinik sering terlambat merespons lonjakan penyakit musiman (DBD, ISPA, Tifoid) karena data masih manual/terfragmentasi.
- Terjadi data silo antara diagnosis klinis dan stok obat yang menyebabkan stockout.
- Sistem saat ini menggunakan free-text untuk diagnosis, menyebabkan inkonsistensi data (misal: "DBD" vs "Dengue").

## Constraints

- **Data Privacy**: Data yang ditampilkan di Dasbor MIS Manajer harus anonim (tidak menampilkan identitas pribadi seperti Nama atau NIK).
- **Access Control**: Sistem MIS hanya bersifat read-only terhadap tabel operasional; tidak boleh mengubah data rekam medis asli.
- **Platform**: Desktop-First Dashboard untuk optimalisasi visualisasi grafik yang padat.
- **Data Source**: Diasumsikan staf disiplin memasukkan data secara real-time ke sistem basis data utama (TPS).

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Desktop-First | Visualisasi grafik data padat membutuhkan layar lebar untuk keterbacaan. | — Pending |
| Read-Only Access | Menjaga integritas data rekam medis asli di database operasional. | — Pending |
| ICD-10 Standardization | Mencegah inkonsistensi data diagnosis untuk akurasi laporan tren. | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-06-11 after initialization*
