-- ============================================================
-- 001_initial_schema.sql — NucleoApp / De CAOS a CEO
-- v1.0 · 2026-03-30
-- Ejecutar en: supabase.com → SQL Editor → New query → Run
-- Usa IF NOT EXISTS en todo para no romper tablas existentes
-- ============================================================

-- ── Accounts ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS accounts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users NOT NULL UNIQUE,
  tier        text NOT NULL DEFAULT 'parche'
                CHECK (tier IN ('parche','operador','ceo')),
  agency_name text,
  created_at  timestamptz DEFAULT now()
);

-- ── Leads ─────────────────────────────────────────────────────
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

-- ── Quotes ────────────────────────────────────────────────────
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

-- ── Skill outputs — Fase 3, creada ahora para no migrar después
CREATE TABLE IF NOT EXISTS skill_outputs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id  uuid REFERENCES accounts NOT NULL,
  lead_id     uuid REFERENCES leads,
  skill_name  text NOT NULL,
  version     int DEFAULT 1,
  payload     jsonb NOT NULL,
  created_at  timestamptz DEFAULT now()
);

-- ── Row Level Security ────────────────────────────────────────
ALTER TABLE accounts      ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads         ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes        ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_outputs ENABLE ROW LEVEL SECURITY;

-- ── Policies (DROP IF EXISTS para evitar conflictos en re-run)
DROP POLICY IF EXISTS "accounts_own" ON accounts;
DROP POLICY IF EXISTS "leads_own"    ON leads;
DROP POLICY IF EXISTS "quotes_own"   ON quotes;
DROP POLICY IF EXISTS "skills_own"   ON skill_outputs;

CREATE POLICY "accounts_own" ON accounts
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "leads_own" ON leads
  FOR ALL USING (account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()));

CREATE POLICY "quotes_own" ON quotes
  FOR ALL USING (account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()));

CREATE POLICY "skills_own" ON skill_outputs
  FOR ALL USING (account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()));
