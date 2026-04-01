# tasks.md — De CAOS a CEO / NucleoApp
> v1.7 · 2026-04-01 · Fase 4 ✅ COMPLETA · Fase 5 abierta

---

## ✅ FASE 1 COMPLETA · 2026-03-30
## ✅ FASE 2 COMPLETA · 2026-03-31
## ✅ FASE 3 COMPLETA · 2026-04-01

---

## ✅ FASE 4 COMPLETA · 2026-04-01

| Task | Descripción | Commit | Estado |
|---|---|---|---|
| TASK-016 | Quote Engine panel + view tracking | 848c91f | ✅ |
| TASK-017 | account-snapshot skill | edcd229 | ✅ |
| TASK-018 | roadmap-generator skill | 8a3e063 | ✅ |
| TASK-019 | Panel cliente /dashboard/mi-plan | 8a3e063 | ✅ |

**Confirmación en producción:**
```
/dashboard/quotes:
  ✅ Crear quote desde ProposalViewer
  ✅ Status tracking (borrador → enviada → vista → cerrada)
  ✅ View tracking: GET /api/quotes/view?id=UUID → view_count +1
  ✅ "Copiar link" → URL de tracking para el cliente

/dashboard/mi-plan:
  ✅ SnapshotCard: fase CAOS · 3 cuellos · 3 quick wins
  ✅ HealthMeter: nivel_salud 15% (rojo — Claudio con datos reales)
  ✅ RoadmapView: "Escalando tu Agencia" · 6 períodos · 3 hitos
  ✅ roadmap-generator en skill_outputs (14377e4f)
```

**Skills en producción — mapa completo:**
```
Internos (Command Center):
  intake-analyzer   ✅ tier + score + diagnóstico
  playbook-mapper   ✅ 4 playbooks priorizados
  proposal-writer   ✅ propuesta markdown

Externos (Panel cliente):
  account-snapshot  ✅ fase + salud + cuellos + quick wins
  roadmap-generator ✅ plan 90 días por tier
```

---

## 🔴 TAREA ACTIVA — TASK-020

**Fase 5 — Polish + Go-to-Market**

```
Prioridad 1 — AlertFeed con alertas reales:
  src/components/command-center/AlertFeed/
    AlertFeed.tsx (actualizar — datos reales)
  Query: quotes con view_count > 0 recientes
         leads sin actividad > 48h
         quotes en status 'vista'

Prioridad 2 — Onboarding flow:
  src/app/(dashboard)/onboarding/page.tsx
  → Primer login → completar perfil de agencia
  → agency_name en tabla accounts
  → Redirige a /dashboard/overview

Prioridad 3 — Health ring con métricas reales:
  Conectar HealthMeter del overview con datos reales
  (nivel_salud del account-snapshot)
```

---

## 📋 BACKLOG FASE 5

### TASK-020 — AlertFeed con alertas reales
### TASK-021 — Onboarding flow
### TASK-022 — Health ring overview con datos reales
### TASK-023 — playbook-explainer skill
### TASK-024 — Landing page (repo separado)
### TASK-025 — Billing manual documentado (3 pilotos)

---

## 📌 Prompt de Inicio — Fase 5

```
[INICIO DE SESIÓN — Fase 5 · TASK-020]

Proyecto: NucleoApp / De CAOS a CEO
URL: nucleoapp.vercel.app
Fase actual: 5 — Polish + Go-to-Market
Tarea activa: TASK-020 — AlertFeed con alertas reales

Stack: Next.js 16 · Supabase · CSS Modules
Todo el sistema en producción ✅

Reglas:
- Plan → Confirm → Code
- Max ~300 líneas por archivo
- CSS Module por componente

Lee CLAUDE.md → confirma:
"Entendido. Fase 5 · TASK-020 · Modo DEV. ¿Arrancamos?"
```

---

## 📌 Notas de Sesión

| Fecha | Nota |
|---|---|
| 2026-03-30 | Fase 1 completa. nucleoapp.vercel.app live. |
| 2026-03-31 | Fase 2 completa. Velocity Agent activo. |
| 2026-04-01 | Fase 3 completa. 3 Skills IA + ProposalViewer. |
| 2026-04-01 | Fase 4 completa. Quote Engine + Panel cliente. |
| — | Próxima sesión: TASK-020 — AlertFeed + Onboarding |
