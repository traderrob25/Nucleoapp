# CHANGELOG.md — De CAOS a CEO / NucleoApp
> Formato: Conventional Commits · Keep a Changelog

---

## [Unreleased] — Fase 3 en curso

### En progreso
- TASK-012: intake-analyzer skill
- TASK-013: playbook-mapper skill
- TASK-014: proposal-writer skill

---

## [0.5.0] — 2026-03-31 · Fase 2 completa ✅

### Added
- `feat: IntakeForm Server Action → leads con Zod v4`
- `feat: LeadsTable con datos reales`
- `feat: PipelineStages con conteos reales`
- `feat: KpiCards con métricas reales` (Promise.all)
- `feat: Velocity Agent webhook + Claude API scoring` (09d183a)
- Make.com scenario: NucleoApp Leads configurado
- Supabase Database Webhook: velocity-new-lead activo

### Fixed
- Zod v4: `.issues` en lugar de `.errors`
- Auto-provision account tier 'parche' en Server Action
- Libro Express migrado a hexada-prod
- Supabase Site URL → nucleoapp.vercel.app
- Score Claudio confirmado: 25 (Referido +25)

### Architecture
- Velocity Agent flujo completo en producción:
  IntakeForm → Supabase → Make.com → /api/leads/webhook → Claude API → score
- service_role_key para writes de sistema en webhook
- generateScore() en lib/api/velocity.ts aislado y reutilizable

---

## [0.4.0] — 2026-03-31 · Fase 2 parcial
## [0.3.0] — 2026-03-30 · Fase 1 completa
## [0.1.0–0.2.0] — 2026-03-30 · Prototipo + Gobernanza
