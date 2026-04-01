# CHANGELOG.md — De CAOS a CEO / NucleoApp
> Formato: Conventional Commits · Keep a Changelog

---

## [Unreleased] — Fase 5 en curso
- TASK-020: AlertFeed con alertas reales

---

## [0.8.0] — 2026-04-01 · Fase 4 completa ✅

### Added
- `feat: Quote Engine — gestión de propuestas con tracking` (848c91f)
- `feat: account-snapshot skill — diagnóstico ejecutivo` (edcd229)
- `feat: roadmap-generator + Panel cliente /dashboard/mi-plan` (8a3e063)
- Nueva sección "Mi Plan" en Sidebar
- SnapshotCard: fase (caos/sistema/ceo), cuellos de botella y quick wins
- RoadmapView: Plan de 90 días con períodos e hitos
- HealthMeter circular (SVG) con color dinámico por puntaje
- Endpoint `/api/quotes/view` para tracking de propuestas abiertas por el cliente
- RPC `increment_view_count` en Supabase para evitar race conditions

### Updated
- `ProposalViewer`: botón "Guardar como Quote" integrado

---

## [0.7.0] — 2026-04-01 · Fase 3 completa ✅

### Added
- `feat: ProposalViewer UI — propuesta desde LeadsTable` (6332cc0)
- Botón "⚡ Propuesta" por fila en LeadsTable
- Loading state por fila durante generación
- marked instalado para renderizado markdown → HTML
- Botón "Copiar propuesta" con feedback visual "✓ Copiado"

---

## [0.6.0] — 2026-04-01 · Skills IA en producción
- `feat: intake-analyzer + playbook-mapper + proposal-writer` (aaaeffa)

---

## [0.5.0] — 2026-03-31 · Fase 2 completa
## [0.3.0] — 2026-03-30 · Fase 1 completa
## [0.1.0–0.2.0] — 2026-03-30 · Prototipo + Gobernanza
