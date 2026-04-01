# tasks.md — De CAOS a CEO / NucleoApp
> v1.5 · 2026-04-01 · Fase 3 Skills IA ✅ COMPLETA · Fase 4 abierta

---

## ✅ FASE 1 COMPLETA · 2026-03-30
## ✅ FASE 2 COMPLETA · 2026-03-31

---

## ✅ FASE 3 COMPLETA · 2026-04-01

| Task | Descripción | Commit | Estado |
|---|---|---|---|
| TASK-012 | intake-analyzer skill | aaaeffa | ✅ |
| TASK-013 | playbook-mapper skill | aaaeffa | ✅ |
| TASK-014 | proposal-writer skill | aaaeffa | ✅ |

**Confirmación en producción:**
```
lead_id: 8e9dcb5f-c5a1-4307-a486-fa1e853f18d2 (Claudio)

skill_outputs:
  intake-analyzer  → 2026-04-01 19:21:10 ✅
  playbook-mapper  → 2026-04-01 19:21:17 ✅
  proposal-writer  → 2026-04-01 19:21:31 ✅

Propuesta generada:
  Tier: parche ($497/mes)
  Playbooks: Velocity Agent → Quote Engine
  CTA: llamada 30 min
```

**Notas técnicas Fase 3:**
- Cadena secuencial: intake-analyzer → playbook-mapper → proposal-writer
- Si skill anterior no existe → se ejecuta automáticamente en cadena
- Output en markdown limpio — strip de backticks aplicado
- Guardado versionado en skill_outputs (version: 1)
- SUPABASE_SERVICE_ROLE_KEY para writes de sistema

**Flujo completo en producción:**
```
POST /api/skills/proposal-writer { lead_id }
  → lee/ejecuta intake-analyzer
  → lee/ejecuta playbook-mapper
  → genera propuesta markdown
  → guarda 3 filas en skill_outputs
  → retorna { success: true, proposal: { markdown, lead_name } }
```

---

## 🔴 TAREA ACTIVA — TASK-015

**UI de Skills — mostrar propuesta en el dashboard**

```
Objetivo: El dueño de agencia puede generar y ver la propuesta
          desde el dashboard sin usar curl.

Archivos a crear:
  src/components/command-center/ProposalViewer/
    ProposalViewer.tsx
    ProposalViewer.module.css

Actualizar:
  src/app/(dashboard)/overview/page.tsx
  → Agregar botón "Generar Propuesta" en cada fila de LeadsTable
  → Al hacer click → POST /api/skills/proposal-writer
  → Mostrar resultado en ProposalViewer (modal o sección expandible)

ProposalViewer:
  - Renderizar markdown como HTML (usar marked o similar)
  - Botón "Copiar propuesta"
  - Botón "Nueva propuesta" (regenerar)
  - Dark theme consistente con variables.css

Criterio de done:
  ✓ Click en lead → genera propuesta → se muestra en UI
  ✓ Sin errores TypeScript
  ✓ Build limpio
```

---

## 📋 BACKLOG FASE 4

### TASK-016 — Quote Engine (Panel de propuestas)
### TASK-017 — account-snapshot skill (cliente)
### TASK-018 — roadmap-generator skill (cliente)
### TASK-019 — Panel cliente NucleoApp

---

## 📌 Prompt de Inicio — TASK-015

```
[INICIO DE SESIÓN — Fase 3 · TASK-015]

Proyecto: NucleoApp / De CAOS a CEO
URL: nucleoapp.vercel.app
Fase actual: 3 — Skills IA · UI de propuesta
Tarea activa: TASK-015 — ProposalViewer en dashboard

Stack: Next.js 16 · Supabase · CSS Modules · Claude API
Skills en producción: intake-analyzer ✅ playbook-mapper ✅ proposal-writer ✅

Reglas:
- Plan → Confirm → Code
- Max ~300 líneas por archivo
- CSS Module por componente
- 'use client' solo donde sea necesario

Lee CLAUDE.md → confirma:
"Entendido. Fase 3 · TASK-015 · Modo DEV. ¿Arrancamos?"
```

---

## 📌 Notas de Sesión

| Fecha | Nota |
|---|---|
| 2026-03-30 | Fase 1 completa. nucleoapp.vercel.app live. |
| 2026-03-31 | Fase 2 completa. Command Center + Velocity Agent. |
| 2026-04-01 | Fase 3 completa. 3 Skills IA en producción. |
| — | Próxima sesión: TASK-015 — ProposalViewer en UI |
