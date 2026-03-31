# CLAUDE.md — De CAOS a CEO / NucleoApp
> Session context para Claude Code / Gemini en Google IDX
> v1.2 · 2026-03-30 · ✅ Decisiones confirmadas · Fase 1 completa

---

## 🧠 Contexto del Proyecto

**Producto:** De CAOS a CEO → marca comercial NucleoApp
**Brand:** Núcleo Lab
**Dominio:** nucleoapp.vercel.app
**Stack:** Next.js 16 App Router · Supabase · Vercel · Make.com (Fase 2) · Claude API (Fase 3)
**Idioma de UI:** Español (México)
**Entorno:** Google IDX (antigravity)

---

## 🎨 Design System

- **Fuentes:** DM Sans (UI) + DM Mono (datos/código)
- **Colores:** Teal Ocean `#0891B2` (Operador) / Gris `#7A8C9E` (Parche) / Dorado `#D4961A` (CEO)
- **Estilos:** CSS Modules por componente + variables globales en `src/styles/variables.css`
- **NO Tailwind. NO Shadcn. CSS Modules puro.**

---

## ⚙️ Decisiones Técnicas (NO cambiar sin actualizar este archivo)

| Decisión | Elección |
|---|---|
| Estado global | React Context + RSC props |
| Estilos | CSS Modules puro |
| Realtime | Fase 2 (no en Fase 1) |
| Billing | Manual para primeros 3 pilotos |
| Automatizaciones | Make.com Fase 2, n8n Fase 4 |
| IA Skills | Claude API Fase 3 |

---

## 📐 Reglas de Operación (NO negociables)

1. **Plan → Confirm → Code** — Cero código sin confirmación de arquitectura.
2. **Un archivo = una responsabilidad** — Máximo ~300 líneas por archivo. Si crece: refactorizar.
3. **CSS Module por componente** — `Componente.module.css` junto a `Componente.tsx`.
4. **Tier en backend** — El tier se lee SOLO desde Supabase. Nunca hardcodeado en frontend.
5. **Conventional Commits** — `feat:`, `fix:`, `chore:`, `refactor:` siempre.
6. **Make.com en Fase 2** — Ninguna automatización en Fase 1 o anterior.
7. **Skills en Fase 3** — Ninguna llamada a Claude API en Fase 1 o 2.

---

## 🗂️ Modos de Operación

| Prefijo | Modo | Descripción |
|---|---|---|
| `[ARQUITECTO]` | Diseño | Estructura, decisiones técnicas |
| `[DEV]` | Implementación | Código según plan confirmado |
| `[REVIEWER]` | Revisión | Auditar código existente |
| `[PLANIFICADOR]` | Tareas | Actualizar tasks.md |

---

## ⚡ Ritual de Inicio de Sesión

```
1. Leer CLAUDE.md (este archivo)
2. Leer plan.md → fase actual
3. Leer tasks.md → tarea activa
4. Confirmar: "Entendido. Fase X · TASK-XXX · Modo [DEV]. ¿Arrancamos?"
```

---

## 🧩 Skills Architecture (Referencia rápida)

**Fase 3 — Internos (Command Center):**
- `intake-analyzer` → score + tier recomendado
- `playbook-mapper` → playbooks priorizados
- `proposal-writer` → diagnóstico + propuesta 1 pág

**Fase 4 — Externos (Panel cliente NucleoApp):**
- `account-snapshot` → diagnóstico inicial
- `roadmap-generator` → plan 90 días
- `playbook-explainer` → fichas de playbooks

**Ver ARCHITECTURE.md sección "Skills IA" para detalle completo.**

---

## 🚫 Prohibido

- Instalar deps no listadas en ARCHITECTURE.md sin aprobación
- Lógica de negocio en componentes de UI
- Tier/feature flags hardcodeados en el frontend
- Commits sin mensaje descriptivo
- Llamar Claude API antes de Fase 3
- Make.com antes de Fase 2
- Usar `middleware.ts` — el proyecto usa `proxy.ts` (Next.js 16)
