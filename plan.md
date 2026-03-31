# plan.md — De CAOS a CEO / NucleoApp
> v1.2 · 2026-03-30 · Fase 1 cerrada · Fase 2 abierta

---

## Estado Actual

**Fase activa:** 2 — Command Center + Pipeline con datos reales
**URL producción:** nucleoapp.vercel.app
**Próxima acción:** TASK-007 en Claude Code / Google IDX

---

## Fase 0 — Gobernanza ✅ COMPLETA
- [x] Prototipo HTML/CSS v3
- [x] 5 archivos de gobernanza
- [x] Decisiones técnicas confirmadas
- [x] Skills analizados y priorizados

---

## Fase 1 — Shell + Auth ✅ COMPLETA · 2026-03-30

**Criterio cumplido:** Usuario hace login con Magic Link y ve el dashboard shell con tier desde Supabase.

- [x] TASK-001: Next.js 16 App Router en Google IDX
- [x] TASK-002: Design tokens CSS
- [x] TASK-003: Supabase schema v1 (4 tablas + RLS)
- [x] TASK-004: Auth Magic Link (proxy.ts + /auth/confirm)
- [x] TASK-005: Dashboard shell (Topbar, Sidebar, RightPanel)
- [x] TASK-006: Deploy → nucleoapp.vercel.app

**Notas:**
- Next.js 16 (versión actual, no 14)
- proxy.ts en lugar de middleware.ts
- Supabase proyecto reutilizado (ScalingUp) — límite free tier
- Resend SMTP configurado para eliminar rate limit de emails

---

## Fase 2 — Command Center + Pipeline 🔴 EN CURSO

**Criterio de éxito:** Registro un lead desde el dashboard y aparece en el pipeline con datos reales de Supabase.

- [ ] TASK-007: IntakeForm Server Action → INSERT leads
- [ ] TASK-008: LeadsTable con datos reales
- [ ] TASK-009: PipelineStages con conteos reales
- [ ] TASK-010: KpiCards con métricas reales
- [ ] TASK-011: Make.com Scenario 1 — score automático vía Velocity Agent

---

## Fase 3 — Velocity Agent + Skills IA

**Criterio de éxito:** Lead registrado → calificado por Claude API < 30 segundos.

- [ ] `intake-analyzer` skill — score + tier recomendado
- [ ] `playbook-mapper` skill — priorización de playbooks
- [ ] `proposal-writer` skill — diagnóstico + propuesta 1 pág
- [ ] VelocityPanel con stats reales
- [ ] Make.com Scenario 2: follow-up WhatsApp automático

---

## Fase 4 — Quote Engine + Skills Externos

**Criterio de éxito:** Propuesta generada, cliente la ve en su panel NucleoApp.

- [ ] `account-snapshot` skill — diagnóstico inicial cliente
- [ ] `roadmap-generator` skill — plan 90 días por tier
- [ ] `playbook-explainer` skill — fichas de playbooks
- [ ] QuotePanel con generación real (Claude API)
- [ ] PDF export de propuesta
- [ ] View tracking con alerta

---

## Fase 5 — Polish + Go-to-Market

- [ ] Onboarding flow
- [ ] Billing manual documentado (3 pilotos)
- [ ] Health ring con métricas reales
- [ ] Landing page (repo separado)
- [ ] Dominio propio (pendiente decisión)
- [ ] `client-qa` skill

---

## Métricas de Éxito — 30 días post-lanzamiento

| Métrica | Target |
|---|---|
| Agencias piloto usando Velocity Agent | 3 |
| Propuestas generadas con Quote Engine | 5+ |
| 1 deal cerrado usando el sistema | ✓ |
| Skills internos en producción | intake-analyzer + proposal-writer |
| Churn pilotos | 0 |
