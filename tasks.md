# tasks.md — De CAOS a CEO / NucleoApp
> v1.6 · 2026-04-01 · Fase 3 ✅ COMPLETA · Fase 4 abierta

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
| TASK-015 | ProposalViewer UI | 6332cc0 | ✅ |

**Confirmación en producción:**
```
Skills ejecutados para Claudio (8e9dcb5f):
  intake-analyzer  ✅ tier: parche · score: 25
  playbook-mapper  ✅ Velocity Agent → Quote Engine
  proposal-writer  ✅ propuesta markdown generada

ProposalViewer:
  ✅ Renderizado markdown (H1, H2 teal, listas, bold)
  ✅ Botón "Copiar propuesta" → "✓ Copiado"
  ✅ Botón "Cerrar" funcional
  ✅ Test page eliminada antes del commit
```

**Flujo completo Fase 3 en producción:**
```
LeadsTable → click "⚡ Propuesta"
  → loading state por fila
  → POST /api/skills/proposal-writer { lead_id }
  → intake-analyzer + playbook-mapper + proposal-writer en cadena
  → ProposalViewer con markdown renderizado
  → Copiar o cerrar
```

---

## 🔴 TAREA ACTIVA — TASK-016

**Quote Engine — Panel de propuestas**

```
Objetivo: Gestionar propuestas formales (quotes) con
          seguimiento de estado y view tracking.

Archivos a crear:
  src/app/(dashboard)/quotes/page.tsx
  src/components/dashboard/QuotePanel/
    QuotePanel.tsx
    QuotePanel.module.css

Flujo:
  1. Desde ProposalViewer → botón "Guardar como Quote"
     → INSERT quotes (client_name, service, amount, status: 'borrador')
  2. /dashboard/quotes → lista de quotes con status y view_count
  3. View tracking: cada vez que el lead abre el link
     → view_count +1 → alerta en dashboard

Criterio de done:
  ✓ Quote creado desde propuesta
  ✓ Lista de quotes visible
  ✓ Status actualizable (borrador → enviada → vista → cerrada)
```

---

## 📋 BACKLOG FASE 4

### TASK-017 — account-snapshot skill (cliente)
### TASK-018 — roadmap-generator skill (cliente)
### TASK-019 — Panel cliente NucleoApp
### TASK-020 — AlertFeed con alertas reales

---

## 📌 Prompt de Inicio — TASK-016

```
[INICIO DE SESIÓN — Fase 4 · TASK-016]

Proyecto: NucleoApp / De CAOS a CEO
URL: nucleoapp.vercel.app
Fase actual: 4 — Quote Engine
Tarea activa: TASK-016 — Quote Engine panel

Stack: Next.js 16 · Supabase · CSS Modules
Tabla quotes ya existe en Supabase ✅

Reglas:
- Plan → Confirm → Code
- Max ~300 líneas por archivo
- CSS Module por componente

Lee CLAUDE.md → confirma:
"Entendido. Fase 4 · TASK-016 · Modo DEV. ¿Arrancamos?"
```

---

## 📌 Notas de Sesión

| Fecha | Nota |
|---|---|
| 2026-03-30 | Fase 1 completa. |
| 2026-03-31 | Fase 2 completa. Velocity Agent activo. |
| 2026-04-01 | Fase 3 completa. 3 Skills IA + ProposalViewer en producción. |
| — | Próxima sesión: TASK-016 — Quote Engine |
