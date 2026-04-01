import Anthropic from '@anthropic-ai/sdk'
import { createAdminClient } from '@/lib/supabase/admin'
import { analyzeIntake } from '@/lib/skills/intake-analyzer'
import type { PlaybookMap, IntakeAnalysis } from '@/types/skill'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function stripMarkdown(text: string): string {
  return text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim()
}

function buildPrompt(analysis: IntakeAnalysis): string {
  return `Eres un experto en implementación de sistemas para agencias digitales.
Basándote en este diagnóstico, devuelve SOLO un objeto JSON válido.

Diagnóstico:
- Tier: ${analysis.tier_recomendado}
- Score: ${analysis.score}
- Diagnóstico: ${analysis.diagnostico}
- Puntos débiles: ${analysis.puntos_debiles.join(', ')}

Los 4 playbooks disponibles:
1. Velocity Agent — captura y calificación de leads automática
2. Quote Engine — generación de propuestas en minutos
3. Client Success — retención y expansión de clientes
4. Scale System — procesos y delegación para escalar

Devuelve exactamente este JSON:
{
  "playbooks": [
    {
      "nombre": "string",
      "prioridad": 1,
      "razon": "string — por qué este playbook primero",
      "impacto_esperado": "string — qué mejora concreta",
      "tiempo_implementacion": "string — ej: 2 semanas"
    }
  ],
  "resumen": "string — estrategia general en 1-2 oraciones"
}

Ordena por prioridad según los puntos débiles del lead.`
}

export async function mapPlaybooks(lead_id: string): Promise<PlaybookMap> {
  const supabase = createAdminClient()

  // Leer account_id del lead
  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .select('account_id')
    .eq('id', lead_id)
    .single()

  if (leadError || !lead) throw new Error(`Lead ${lead_id} no encontrado`)

  // Leer último output de intake-analyzer, o ejecutarlo si no existe
  const { data: existing } = await supabase
    .from('skill_outputs')
    .select('payload')
    .eq('lead_id', lead_id)
    .eq('skill_name', 'intake-analyzer')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const analysis: IntakeAnalysis = existing
    ? (existing.payload as IntakeAnalysis)
    : await analyzeIntake(lead_id)

  const message = await anthropic.messages.create({
    model:      'claude-sonnet-4-20250514',
    max_tokens: 600,
    messages:   [{ role: 'user', content: buildPrompt(analysis) }],
  })

  const block = message.content[0]
  if (block.type !== 'text') throw new Error('Respuesta inesperada de Claude')

  const result: PlaybookMap = JSON.parse(stripMarkdown(block.text))

  await supabase.from('skill_outputs').insert({
    account_id: lead.account_id,
    lead_id,
    skill_name: 'playbook-mapper',
    version:    1,
    payload:    result,
  })

  return result
}
