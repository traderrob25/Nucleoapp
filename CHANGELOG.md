# CHANGELOG.md — De CAOS a CEO / NucleoApp
> Formato: Conventional Commits · Keep a Changelog

---

## [Unreleased] — Fase 2 en curso

### En progreso
- TASK-007: IntakeForm Server Action → tabla leads
- TASK-008: LeadsTable con datos reales
- TASK-009: PipelineStages con conteos reales
- TASK-010: KpiCards con métricas reales
- TASK-011: Make.com Scenario 1 — Velocity Agent scoring

---

## [0.3.0] — 2026-03-30 · Fase 1 completa ✅

### Added
- `feat: setup Next.js 16 App Router con design tokens`
- `feat: supabase schema v1 con RLS en 4 tablas`
- `feat: auth Magic Link con proxy.ts`
- `feat: dashboard shell Topbar Sidebar RightPanel`
- Deploy productivo en nucleoapp.vercel.app
- Resend SMTP configurado (onboarding@resend.dev)

### Fixed
- proxy.ts en lugar de middleware.ts (deprecation Next.js 16)
- Rate limit Supabase email resuelto con Resend custom SMTP

### Technical Notes
- Next.js 16 (no 14 — versión actual al scaffold con create-next-app)
- Supabase proyecto reutilizado: ScalingUp (límite 2 proyectos free tier)
- RESEND_API_KEY en Vercel env vars + .env.local

---

## [0.2.0] — 2026-03-30 · Gobernanza v1.1

### Added
- ARCHITECTURE.md v1.1: decisiones confirmadas + Skills architecture
- plan.md, tasks.md, CLAUDE.md, CHANGELOG.md
- 5 decisiones técnicas confirmadas
- 10 skills analizados, 6 priorizados en Fases 3–4

---

## [0.1.0] — 2026-03-30 · Prototipo HTML

### Added
- Dashboard v1, v2, v3 (HTML/CSS/JS multi-archivo)
- Teal Ocean color system (#0891B2)
- Tier system: Parche / Operador / CEO Mode
