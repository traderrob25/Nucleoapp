# tasks.md — De CAOS a CEO / NucleoApp
> v1.3 · 2026-03-31 · Fase 1 ✅ COMPLETA · Fase 2 en progreso

---

## ✅ FASE 1 COMPLETA

| Task | Descripción | Estado |
|---|---|---|
| TASK-001 | Setup Next.js 16 App Router en Google IDX | ✅ |
| TASK-002 | Design tokens CSS (variables, tiers, globals) | ✅ junto con 001 |
| TASK-003 | Supabase schema v1 + RLS en 4 tablas | ✅ |
| TASK-004 | Auth Magic Link + proxy.ts + /auth/confirm | ✅ |
| TASK-005 | Dashboard shell: Topbar, Sidebar, RightPanel | ✅ |
| TASK-006 | Deploy Vercel → nucleoapp.vercel.app | ✅ |

**Notas técnicas Fase 1:**
- Versión real: Next.js 16 (no 14 — versión actual al scaffold)
- proxy.ts en lugar de middleware.ts (deprecation fix Next.js 16)
- Supabase reutilizado: proyecto ScalingUp (límite 2 proyectos free tier)
- SMTP custom configurado: Resend · onboarding@resend.dev
- Rate limit Supabase email resuelto con Resend API key
- RESEND_API_KEY agregada a Vercel + .env.local

---

## ✅ FASE 2 — COMPLETADAS

| Task | Descripción | Estado |
|---|---|---|
| TASK-007 | IntakeForm Server Action → tabla leads | ✅ |
| TASK-008 | LeadsTable con datos reales desde Supabase | ✅ |

**Notas técnicas Fase 2:**
- /dev-login agregado (bypass Magic Link rate limit para testing)
- Supabase Email Provider: Email+Password habilitado, Confirm email desactivado
- Libro Express migrado a hexada-prod (ainebmbluocoxlyvctej)
- ScalingUp exclusivo para NucleoApp desde 2026-03-31
- --info: #3B82F6 agregado a variables.css
- src/types/lead.ts creado con tipo Lead

---

## 🔴 TAREA ACTIVA — TASK-009

### TASK-009 — PipelineStages con conteos reales
```
src/components/dashboard/PipelineStages/PipelineStages.tsx + .module.css

Query: SELECT status, COUNT(*) as count
       FROM leads
       WHERE account_id = $1
       GROUP BY status

Criterio: 5 etapas con conteos correctos desde Supabase
```

### TASK-010 — KpiCards con métricas reales
```
src/components/dashboard/KpiCard/KpiCard.tsx + .module.css

4 métricas:
  1. Leads esta semana  (created_at >= now() - interval 7 days)
  2. Propuestas abiertas (quotes WHERE status NOT IN cerrada,perdida)
  3. Tasa de cierre     (leads cerrados / total leads * 100)
  4. Clientes activos   (leads WHERE status = cerrado)

Criterio: 4 KPIs con datos reales, skeleton loader mientras carga
```

### TASK-011 — Make.com Scenario 1 (Velocity Agent scoring)
```
src/app/api/leads/webhook/route.ts
src/lib/api/velocity.ts

Flujo Make.com:
  Watch: nuevo lead en Supabase
  → HTTP POST /api/leads/webhook con { lead_id, name, service, budget }
  → Claude API → score 0-100
  → UPDATE leads SET score = $score WHERE id = $lead_id

Criterio: Lead registrado → score actualizado < 30 seg
NOTA: Requiere Make.com configurado + ANTHROPIC_API_KEY activa
```

---

## 📌 Prompt de Inicio — Fase 2

Copia esto en IDX al abrir la próxima sesión:

```
[INICIO DE SESIÓN — Fase 2 · TASK-007]

Proyecto: NucleoApp / De CAOS a CEO
URL producción: nucleoapp.vercel.app
Fase actual: 2 — Command Center + Pipeline con datos reales
Tarea activa: TASK-007 — IntakeForm Server Action → tabla leads

Stack: Next.js 16 · Supabase · CSS Modules · Vercel
Sin Tailwind · Sin Shadcn · CSS Modules puro
Validación con Zod

Reglas activas:
- Plan → Confirm → Code
- Max ~300 líneas por archivo
- CSS Module por componente (.module.css junto al .tsx)
- Tier se lee SOLO desde Supabase
- Make.com en TASK-011 (no antes)

Lee CLAUDE.md → confirma:
"Entendido. Fase 2 · TASK-007 · Modo DEV. ¿Arrancamos?"
```

---

## 📌 Notas de Sesión

| Fecha | Nota |
|---|---|
| 2026-03-30 | Fase 1 completa. nucleoapp.vercel.app live. |
| 2026-03-30 | Magic Link funcionando vía Resend SMTP. |
| 2026-03-30 | Fase 2 desbloqueada. Próxima sesión: TASK-007. |
