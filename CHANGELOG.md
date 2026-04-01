# CHANGELOG.md — De CAOS a CEO / NucleoApp
> Formato: Conventional Commits · Keep a Changelog

---

## [Unreleased] — Fase 3 UI en curso

### En progreso
- TASK-015: ProposalViewer — UI de propuesta en dashboard

---

## [0.6.0] — 2026-04-01 · Fase 3 Skills IA ✅

### Added
- `feat: intake-analyzer + playbook-mapper + proposal-writer skills` (aaaeffa)
- Cadena secuencial de 3 skills ejecutada en un solo POST
- Propuesta generada en markdown para Claudio confirmada en producción
- 3 filas en skill_outputs: intake-analyzer, playbook-mapper, proposal-writer

### Architecture
- Skills como funciones puras en src/lib/skills/
- Routes en src/app/api/skills/[skill]/route.ts
- Cadena automática: si skill previo no existe → se ejecuta antes
- Strip de backticks en parser de Claude API response
- service_role_key para writes en skill_outputs

### Confirmado en producción
- lead_id: 8e9dcb5f (Claudio)
- Tier detectado: parche — $497/mes
- Playbooks: Velocity Agent → Quote Engine
- Tiempo total cadena: ~21 segundos

---

## [0.5.0] — 2026-03-31 · Fase 2 completa
## [0.3.0] — 2026-03-30 · Fase 1 completa
## [0.1.0–0.2.0] — 2026-03-30 · Prototipo + Gobernanza
