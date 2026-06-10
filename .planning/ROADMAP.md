# Roadmap: Sistem Epidemiologi Klinik

## Overview

Membangun sistem kewaspadaan dini untuk klinik dengan mengintegrasikan data rekam medis melalui pipeline analitik yang terpisah. Proyek ini akan fokus pada keamanan data (PII redaction) dan visualisasi tren penyakit (ICD-10) serta efisiensi operasional (SLA waktu tunggu).

## Phases

- [ ] **Phase 1: Foundation & Data Pipeline** - Membangun pipeline CDC read-only dengan reduksi PII otomatis.
- [ ] **Phase 2: Analytics Dashboard & Reporting** - Implementasi dashboard tren penyakit, metrik SLA, dan sistem pelaporan.

## Phase Details

### Phase 1: Foundation & Data Pipeline
**Goal**: Membangun pipeline data yang aman dan terpisah dari sistem operasional (TPS) untuk mendukung analitik tanpa mengganggu kinerja rekam medis.
**Mode**: mvp
**Depends on**: Nothing (first phase)
**Requirements**: EPI-04, EPI-05, SYS-02
**Success Criteria** (what must be TRUE):
  1. Data dari TPS lama terduplikasi ke database analitik secara near real-time via CDC.
  2. Database analitik tidak menyimpan informasi identitas pribadi (Nama/NIK) sesuai kebijakan privasi.
  3. Koneksi database ke TPS dikonfigurasi secara strictly read-only untuk menjaga integritas rekam medis.
**Plans**: 2 plans

Plans:
- [ ] 01-01-PLAN.md — Setup Analytical Infrastructure and Ingestion Pipeline skeleton
- [ ] 01-02-PLAN.md — Implement Data Privacy (PII Redaction/Hashing) and Performance Optimization

### Phase 2: Analytics Dashboard & Reporting
**Goal**: Menyajikan visualisasi tren penyakit dan efisiensi operasional kepada manajer klinik melalui dashboard interaktif.
**Mode**: mvp
**Depends on**: Phase 1
**Requirements**: EPI-01, EPI-02, EPI-03, SLA-01, SLA-02, SLA-03, SYS-01, SYS-03
**Success Criteria** (what must be TRUE):
  1. User dapat melihat grafik Top 10 Tren Penyakit dengan pengelompokan ICD-10 3-karakter.
  2. User dapat memfilter dashboard berdasarkan rentang waktu mingguan atau bulanan.
  3. Muncul indikator visual (merah) secara otomatis jika rata-rata waktu tunggu pasien > 60 menit.
  4. User dapat mengunduh laporan analitik dalam format PDF atau Excel.
  5. Sistem membedakan akses antara "Manajer Klinik" dan "Staf Administrasi" via RBAC.
**Plans**: 3 plans
**UI hint**: yes

Plans:
- [ ] 02-01: Backend API for Epidemiology and SLA Metrics
- [ ] 02-02: Interactive Dashboard Frontend with Recharts
- [ ] 02-03: RBAC and Export Functionality

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Data Pipeline | 0/2 | Not started | - |
| 2. Analytics Dashboard & Reporting | 0/3 | Not started | - |
