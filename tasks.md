# tasks.md — De CAOS a CEO / NucleoApp
> v1.4 · 2026-03-31 · Fase 2 ✅ COMPLETA · Fase 3 abierta

---

## ✅ FASE 1 COMPLETA · 2026-03-30

| Task | Descripción | Estado |
|---|---|---|
| TASK-001 | Setup Next.js 16 App Router | ✅ |
| TASK-002 | Design tokens CSS | ✅ |
| TASK-003 | Supabase schema v1 + RLS | ✅ |
| TASK-004 | Auth Magic Link + proxy.ts | ✅ |
| TASK-005 | Dashboard shell | ✅ |
| TASK-006 | Deploy → nucleoapp.vercel.app | ✅ |

---

## ✅ FASE 2 COMPLETA · 2026-03-31

| Task | Descripción | Commit | Estado |
|---|---|---|---|
| TASK-007 | IntakeForm Server Action → leads | feat: IntakeForm Server Action | ✅ |
| TASK-008 | LeadsTable con datos reales | feat: LeadsTable datos reales | ✅ |
| TASK-009 | PipelineStages con conteos reales | feat: PipelineStages conteos reales | ✅ |
| TASK-010 | KpiCards con 4 métricas reales | feat: KpiCards métricas reales | ✅ |
| TASK-011 | Velocity Agent → Claude API scoring | feat: Velocity Agent webhook + Claude API scoring (09d183a) | ✅ |

**Notas técnicas Fase 2:**
- Zod v4: `.issues` en lugar de `.errors`
- Auto-provision account con tier 'parche' en Server Action
- Promise.all para queries paralelas en KpiCards
- Libro Express migrado a hexada-prod — ScalingUp exclusivo NucleoApp
- Velocity Agent: score calculado por Claude API (claude-sonnet-4-20250514)
- Supabase webhook → Make.com → /api/leads/webhook → UPDATE score
- Score de Claudio confirmado: 25 (Referido +25, presupuesto < $5k +0)
- Make.com scenario: activar toggle ON para scoring automático

**Flujo Velocity Agent en producción:**
```
IntakeForm submit
→ INSERT leads (score=0)
→ Supabase pg_net → Make.com webhook
→ Make.com POST /api/leads/webhook
→ Claude API genera score 0-100
→ UPDATE leads SET score
→ LeadsTable muestra score real
```

---

## 🔴 TAREA ACTIVA — TASK-012

**intake-analyzer skill — Claude API + Supabase**

```
Fase: 3 — Skills IA (internos)

Archivos a crear:
  src/lib/skills/intake-analyzer.ts
  src/app/api/skills/intake-analyzer/route.ts

Función:
  Leer datos completos de un lead desde Supabase
  → Analizar con Claude API
  → Retornar:
    {
      tier_recomendado: 'parche' | 'operador' | 'ceo',
      score: number,
      razon: string,
      puntos_fuertes: string[],
      puntos_debiles: string[],
      siguiente_accion: string
    }
  → Guardar en skill_outputs (tabla ya existe en Supabase)

Criterio de done:
  ✓ POST /api/skills/intake-analyzer con lead_id → análisis completo
  ✓ Output guardado en skill_outputs
  ✓ Sin errores TypeScript
```

---

## 📋 BACKLOG FASE 3

### TASK-013 — playbook-mapper skill
```
Input: output de intake-analyzer
Output: lista priorizada de playbooks con justificación
```

### TASK-014 — proposal-writer skill
```
Input: tier + playbooks + precios
Output: diagnóstico narrativo + propuesta 1 página (markdown)
Guardar en skill_outputs
```

---

## 📌 Prompt de Inicio — Fase 3

```
[INICIO DE SESIÓN — Fase 3 · TASK-012]

Proyecto: NucleoApp / De CAOS a CEO
URL: nucleoapp.vercel.app
Fase actual: 3 — Skills IA internos
Tarea activa: TASK-012 — intake-analyzer skill

Stack: Next.js 16 · Supabase · Claude API (claude-sonnet-4-20250514)
ANTHROPIC_API_KEY ya está en Vercel env vars ✅

Reglas:
- Plan → Confirm → Code
- Max ~300 líneas por archivo
- Output de skills se guarda en tabla skill_outputs
- Usar SUPABASE_SERVICE_ROLE_KEY para writes de sistema

Lee CLAUDE.md → confirma:
"Entendido. Fase 3 · TASK-012 · Modo DEV. ¿Arrancamos?"
```

---

## 📌 Notas de Sesión

| Fecha | Nota |
|---|---|
| 2026-03-30 | Fase 1 completa. nucleoapp.vercel.app live. |
| 2026-03-31 | Fase 2 completa. Command Center + Velocity Agent en producción. |
| 2026-03-31 | Make.com scenario configurado. Activar toggle ON para scoring automático. |
| — | Próxima sesión: TASK-012 — intake-analyzer skill |
