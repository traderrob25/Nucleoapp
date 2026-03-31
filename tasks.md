# tasks.md — De CAOS a CEO / NucleoApp
> v1.3 · 2026-03-31 · Fase 2 parcial ✅ · TASK-011 pendiente

---

## ✅ FASE 1 COMPLETA

| Task | Descripción | Estado |
|---|---|---|
| TASK-001 | Setup Next.js 16 App Router | ✅ |
| TASK-002 | Design tokens CSS | ✅ |
| TASK-003 | Supabase schema v1 + RLS | ✅ |
| TASK-004 | Auth Magic Link + proxy.ts | ✅ |
| TASK-005 | Dashboard shell | ✅ |
| TASK-006 | Deploy → nucleoapp.vercel.app | ✅ |

---

## ✅ FASE 2 — TASKS COMPLETAS

| Task | Descripción | Commit | Estado |
|---|---|---|---|
| TASK-007 | IntakeForm Server Action → leads | feat: IntakeForm Server Action → leads con Zod v4 | ✅ |
| TASK-008 | LeadsTable con datos reales | feat: LeadsTable con datos reales | ✅ |
| TASK-009 | PipelineStages con conteos reales | feat: PipelineStages con conteos reales | ✅ |
| TASK-010 | KpiCards con métricas reales | feat: KpiCards con métricas reales | ✅ |

**Notas técnicas Fase 2:**
- Zod v4: `.issues` en lugar de `.errors` (fix aplicado en TASK-007)
- Auto-provision de account con tier 'parche' si no existe
- Promise.all para queries paralelas en TASK-010
- Libro Express migrado a hexada-prod — ScalingUp exclusivo para NucleoApp
- Supabase Site URL actualizada a nucleoapp.vercel.app

---

## 🔴 TAREA ACTIVA — TASK-011

**Make.com Scenario 1 — Velocity Agent scoring**

```
PREREQUISITOS (hacer antes de abrir IDX):
  1. Cuenta en make.com activa
  2. ANTHROPIC_API_KEY disponible
  3. Agregar a Vercel env vars:
     ANTHROPIC_API_KEY=
     MAKE_WEBHOOK_INTAKE=  (se obtiene al crear el scenario)

ARCHIVOS A CREAR:
  src/app/api/leads/webhook/route.ts
  src/lib/api/velocity.ts

FLUJO MAKE.COM:
  Trigger: Watch New Row en tabla leads (Supabase)
  → HTTP POST a /api/leads/webhook
    body: { lead_id, name, service, budget, source }
  → Next.js llama Claude API con prompt de scoring
  → Score 0-100 generado
  → UPDATE leads SET score = $score WHERE id = $lead_id
  → Supabase actualiza el registro

FLUJO NEXT.JS (webhook/route.ts):
  POST /api/leads/webhook
  → Validar body con Zod
  → Llamar lib/api/velocity.ts → Claude API
  → UPDATE leads SET score en Supabase
  → Return { success: true, score }

PROMPT DE SCORING (en velocity.ts):
  Analiza este lead de agencia digital:
  - Nombre: {name}
  - Servicio de interés: {service}
  - Presupuesto: {budget}
  - Fuente: {source}
  Devuelve SOLO un número entero entre 0 y 100
  representando la probabilidad de cierre.
  0 = muy baja, 100 = muy alta.
  Considera: presupuesto alto = más puntos,
  referido = más puntos, servicio específico = más puntos.

CRITERIO DE DONE:
  ✓ Nuevo lead registrado en IntakeForm
  ✓ Make.com detecta el nuevo registro
  ✓ /api/leads/webhook recibe el POST
  ✓ Claude API genera score
  ✓ lead.score actualizado en Supabase < 30 segundos
  ✓ LeadsTable muestra score actualizado (revalidatePath o refresh)
```

---

## 📋 BACKLOG FASE 3

### TASK-012 — intake-analyzer skill
### TASK-013 — playbook-mapper skill
### TASK-014 — proposal-writer skill

---

## 📌 Prompt de Inicio — TASK-011

```
[INICIO DE SESIÓN — Fase 2 · TASK-011]

Proyecto: NucleoApp / De CAOS a CEO
URL: nucleoapp.vercel.app
Fase actual: 2 — Make.com + Velocity Agent scoring
Tarea activa: TASK-011

Stack: Next.js 16 · Supabase · Make.com · Claude API
ANTHROPIC_API_KEY debe estar en Vercel env vars antes de empezar

Reglas:
- Plan → Confirm → Code
- Max ~300 líneas por archivo
- Make.com scenario se configura manualmente en make.com
- El webhook URL es: https://nucleoapp.vercel.app/api/leads/webhook

Lee CLAUDE.md → confirma:
"Entendido. Fase 2 · TASK-011 · Modo DEV. ¿Arrancamos?"
```

---

## 📌 Notas de Sesión

| Fecha | Nota |
|---|---|
| 2026-03-30 | Fase 1 completa. nucleoapp.vercel.app live. |
| 2026-03-31 | TASK-007–010 completas. Command Center con datos reales en producción. |
| 2026-03-31 | Libro Express migrado a hexada-prod. ScalingUp exclusivo NucleoApp. |
| — | Próxima sesión: TASK-011 Make.com + Velocity Agent |
