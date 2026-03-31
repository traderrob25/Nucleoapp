# ARCHITECTURE.md — De CAOS a CEO / NucleoApp
> v1.2 · 2026-03-30 · ✅ Todas las decisiones confirmadas · Fase 1 completa

---

## ✅ Decisiones Confirmadas

| # | Decisión | Elección |
|---|---|---|
| 1 | Estado global frontend | Context + RSC props (escalar si se necesita) |
| 2 | Estilos | CSS Modules puro — menos es más, diseño ya hecho |
| 3 | Supabase Realtime | Fase 2 — MVP primero |
| 4 | Billing pilotos | Manual / transferencia — cero fricción |
| 5 | Dominio | nucleoapp.vercel.app |
| + | Automatizaciones | Make.com en Fase 2–3, n8n en Fase 4 |

---

## Stack por Fase

| Tecnología | Propósito | Fase |
|---|---|---|
| Next.js 16 App Router | Framework principal | 1 ✅ |
| Supabase Postgres + Auth | DB + Auth (Magic Link) | 1 ✅ |
| Vercel → nucleoapp.vercel.app | Hosting | 1 ✅ |
| CSS Modules + variables globales | Estilos | 1 ✅ |
| React Context + RSC props | Estado global | 1 ✅ |
| Zod | Validación cliente/servidor | 1 ✅ |
| Resend | SMTP custom (sin rate limit) | 1 ✅ |
| Make.com | Velocity Agent, follow-ups, alertas | 2–3 |
| Claude API (claude-sonnet-4-20250514) | Skills IA | 3 |
| MCP Servers (Node/TS) | Integraciones avanzadas | 3–4 |
| n8n (self-hosted) | Orquestación compleja | 4 |

---

## Notas Técnicas Importantes

```
- Next.js 16 (no 14 — versión actual al scaffold)
- proxy.ts en lugar de middleware.ts (deprecation Next.js 16)
- Supabase proyecto reutilizado: ScalingUp (límite 2 proyectos free)
- src/ directory activo (--src-dir flag en create-next-app)
- Todos los estilos bajo src/styles/
```

---

## Estructura de Carpetas

```
decaos-ceo/
├── CLAUDE.md
├── ARCHITECTURE.md
├── plan.md
├── tasks.md
├── CHANGELOG.md
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                     ← Root layout (fonts, Context providers)
│   │   ├── page.tsx                       ← redirect('/dashboard/overview')
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx                 ← Shell: Topbar + Sidebar + RightPanel
│   │   │   │                                Lee tier de Supabase aquí (RSC)
│   │   │   ├── overview/page.tsx          ← Command Center: KPIs + Intake + Pipeline
│   │   │   ├── velocity/page.tsx          ← Velocity Agent [Operador+]
│   │   │   ├── quotes/page.tsx            ← Quote Engine [Operador+]
│   │   │   ├── pipeline/page.tsx
│   │   │   └── clientes/page.tsx
│   │   ├── actions/
│   │   │   └── leads.ts                   ← Server Actions (Fase 2)
│   │   └── api/
│   │       ├── leads/
│   │       │   └── webhook/route.ts       ← Fase 2: recibe Make.com
│   │       ├── account/
│   │       │   └── tier/route.ts          ← GET tier usuario activo
│   │       └── skills/                    ← Fase 3
│   │           ├── intake-analyzer/route.ts
│   │           └── proposal-writer/route.ts
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Topbar/
│   │   │   │   ├── Topbar.tsx
│   │   │   │   └── Topbar.module.css
│   │   │   ├── Sidebar/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── NavItem.tsx
│   │   │   │   └── Sidebar.module.css
│   │   │   ├── RightPanel/
│   │   │   │   ├── RightPanel.tsx
│   │   │   │   └── RightPanel.module.css
│   │   │   └── AgentStatusBar/
│   │   │       ├── AgentStatusBar.tsx
│   │   │       └── AgentStatusBar.module.css
│   │   │
│   │   ├── dashboard/
│   │   │   ├── KpiCard/
│   │   │   │   ├── KpiCard.tsx
│   │   │   │   └── KpiCard.module.css
│   │   │   ├── PipelineStages/
│   │   │   │   ├── PipelineStages.tsx
│   │   │   │   └── PipelineStages.module.css
│   │   │   ├── LeadsTable/
│   │   │   │   ├── LeadsTable.tsx
│   │   │   │   └── LeadsTable.module.css
│   │   │   ├── VelocityPanel/
│   │   │   │   ├── VelocityPanel.tsx
│   │   │   │   └── VelocityPanel.module.css
│   │   │   ├── QuotePanel/
│   │   │   │   ├── QuotePanel.tsx
│   │   │   │   └── QuotePanel.module.css
│   │   │   ├── HealthRing/
│   │   │   │   ├── HealthRing.tsx
│   │   │   │   └── HealthRing.module.css
│   │   │   └── TaskList/
│   │   │       ├── TaskList.tsx
│   │   │       └── TaskList.module.css
│   │   │
│   │   ├── command-center/
│   │   │   ├── IntakeForm/
│   │   │   │   ├── IntakeForm.tsx         ← 'use client' + Server Action submit
│   │   │   │   └── IntakeForm.module.css
│   │   │   └── AlertFeed/
│   │   │       ├── AlertFeed.tsx
│   │   │       └── AlertFeed.module.css
│   │   │
│   │   └── ui/                            ← Átomos reutilizables
│   │       ├── Badge/
│   │       ├── Button/
│   │       ├── Panel/
│   │       ├── Tag/
│   │       └── Spinner/
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts                  ← createBrowserClient()
│   │   │   └── server.ts                  ← createServerClient() con cookies
│   │   ├── tier/
│   │   │   ├── config.ts                  ← TIER_CONFIG — source of truth
│   │   │   ├── guard.ts                   ← hasFeature(tier, key)
│   │   │   └── types.ts                   ← TierID, FeatureKey
│   │   ├── skills/                        ← Fase 3
│   │   │   ├── intake-analyzer.ts
│   │   │   ├── playbook-mapper.ts
│   │   │   ├── proposal-writer.ts
│   │   │   └── account-snapshot.ts
│   │   └── api/
│   │       ├── leads.ts
│   │       ├── quotes.ts
│   │       └── velocity.ts                ← Fase 2: trigger Make.com webhooks
│   │
│   ├── styles/
│   │   ├── globals.css                    ← Reset base + @import variables + tiers
│   │   ├── variables.css                  ← Design tokens
│   │   └── tiers.css                      ← .tier-parche / .tier-operador / .tier-ceo
│   │
│   └── types/
│       ├── lead.ts
│       ├── quote.ts
│       ├── account.ts
│       └── skill.ts                       ← Fase 3
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
│
├── proxy.ts                               ← Auth guard (NO middleware.ts — Next.js 16)
└── .env.local.example
```

---

## Supabase — Schema v1 (ejecutado en proyecto ScalingUp)

```sql
CREATE TABLE IF NOT EXISTS accounts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users NOT NULL UNIQUE,
  tier        text NOT NULL DEFAULT 'parche'
                CHECK (tier IN ('parche','operador','ceo')),
  agency_name text,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS leads (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id  uuid REFERENCES accounts NOT NULL,
  name        text NOT NULL,
  phone       text,
  email       text,
  service     text,
  budget      text,
  source      text,
  score       int DEFAULT 0,
  status      text DEFAULT 'nuevo'
                CHECK (status IN
                  ('nuevo','contactado','caliente','propuesta','cerrado','perdido')),
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quotes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id  uuid REFERENCES accounts NOT NULL,
  lead_id     uuid REFERENCES leads,
  client_name text NOT NULL,
  service     text,
  amount      numeric,
  status      text DEFAULT 'borrador'
                CHECK (status IN
                  ('borrador','enviada','vista','revision','cerrada','perdida')),
  view_count  int DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS skill_outputs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id  uuid REFERENCES accounts NOT NULL,
  lead_id     uuid REFERENCES leads,
  skill_name  text NOT NULL,
  version     int DEFAULT 1,
  payload     jsonb NOT NULL,
  created_at  timestamptz DEFAULT now()
);
```

---

## Tier System — Regla Fundamental

```
El tier SOLO se lee desde Supabase (tabla accounts).
El frontend NUNCA define qué features están activos.
proxy.ts inyecta el tier en headers de cada request.
Los componentes reciben tier como prop desde Server Components.
```

---

## Skills IA — Prioridad y Fase

### Fase 3 — Internos (Command Center)

| Skill | Qué hace | Prioridad |
|---|---|---|
| `intake-analyzer` | Lee intake → score + tier recomendado | 🔴 Alta |
| `playbook-mapper` | Prioriza playbooks según análisis | 🔴 Alta |
| `proposal-writer` | Diagnóstico narrativo + propuesta 1 pág | 🔴 Alta |

### Fase 4 — Externos (Panel cliente)

| Skill | Qué ve el cliente | Prioridad |
|---|---|---|
| `account-snapshot` | Diagnóstico: 3 cuellos + 3 quick wins | 🔴 Alta |
| `roadmap-generator` | Plan 90 días por tier | 🔴 Alta |
| `playbook-explainer` | Ficha de cada playbook asignado | 🟡 Media |
| `client-qa` | Preguntas acotadas a su cuenta | 🟢 Baja |

### Pospuestos

| Skill | Razón |
|---|---|
| `n8n-orchestrator` | Requiere n8n self-hosted → Fase 4+ |
| `security-advisor` | Meta-skill, no urgente |
| `progress-commentary` | Requiere métricas de campañas reales |

---

## Make.com — Fase 2

| Scenario | Trigger | Acción |
|---|---|---|
| Intake registrado | POST /api/leads/webhook | Score Claude API → UPDATE leads |
| Follow-up Velocity | Schedule diario | WhatsApp vía Twilio → update status |
| Propuesta vista | view_count +1 | Alerta en dashboard |

---

## Variables de Entorno

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Resend (SMTP custom — configurado en Fase 1)
RESEND_API_KEY=

# Claude API — Fase 3
ANTHROPIC_API_KEY=

# Make.com — Fase 2
MAKE_WEBHOOK_INTAKE=
MAKE_WEBHOOK_FOLLOWUP=

# App
NEXT_PUBLIC_APP_URL=https://nucleoapp.vercel.app
```
