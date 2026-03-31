# CHANGELOG.md — De CAOS a CEO / NucleoApp
> Formato: Conventional Commits · Keep a Changelog

---

## [Unreleased] — TASK-011 pendiente

### En progreso
- TASK-011: Make.com Scenario 1 — Velocity Agent scoring

---

## [0.4.0] — 2026-03-31 · Fase 2 parcial ✅

### Added
- `feat: IntakeForm Server Action → leads con Zod v4`
- `feat: LeadsTable con datos reales`
- `feat: PipelineStages con conteos reales`
- `feat: KpiCards con métricas reales`
- Command Center completo en producción con datos reales

### Fixed
- Zod v4: `.issues` en lugar de `.errors`
- Libro Express migrado a hexada-prod → ScalingUp exclusivo NucleoApp
- Supabase Site URL → nucleoapp.vercel.app
- Auto-provision account con tier 'parche' en Server Action

### Infra
- Promise.all para queries paralelas en overview/page.tsx
- Orden visual: KpiCards → PipelineStages → IntakeForm → LeadsTable

---

## [0.3.0] — 2026-03-30 · Fase 1 completa ✅

### Added
- Next.js 16 App Router + design tokens
- Supabase schema v1 con RLS
- Auth Magic Link con proxy.ts
- Dashboard shell: Topbar, Sidebar, RightPanel
- Deploy → nucleoapp.vercel.app
- Resend SMTP (onboarding@resend.dev)

---

## [0.1.0–0.2.0] — 2026-03-30 · Prototipo + Gobernanza
