import Anthropic from '@anthropic-ai/sdk'
import { createAdminClient } from '@/lib/supabase/admin'
import type { IntakeAnalysis } from '@/types/skill'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function stripMarkdown(text: string): string {
  return text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim()
}

function buildPrompt(lead: {
  name: string
  service: string | null
  budget: string | null
  source: string | null
}): string {
  return `Eres un experto en diagnóstico de agencias digitales LATAM.
Analiza este lead y devuelve SOLO un objeto JSON válido, sin markdown.

Lead:
- Nombre: ${lead.name}
- Servicio: ${lead.service ?? 'No especificado'}
- Presupuesto: ${lead.budget ?? 'No especificado'}
- Fuente: ${lead.source ?? 'No especificado'}

Devuelve exactamente este JSON:
{
  "tier_recomendado": "parche" | "operador" | "ceo",
  "score": número 0-100,
  "diagnostico": "string de 2-3 oraciones sobre el perfil del lead",
  "puntos_fuertes": ["string", "string"],
  "puntos_debiles": ["string", "string"],
  "siguiente_accion": "string — qué hacer primero con este lead"
}

Criterios de tier:
- parche: presupuesto < $5k o fuente fría o servicio vago
- operador: presupuesto $5k-$30k o fuente tibia
- ceo: presupuesto $30k+ o referido calificado`
}

export async function analyzeIntake(lead_id: string): Promise<IntakeAnalysis> {
  const supabase = createAdminClient()

  const { data: lead, error } = await supabase
    .from('leads')
    .select('account_id, name, service, budget, source')
    .eq('id', lead_id)
    .single()

  if (error || !lead) throw new Error(`Lead ${lead_id} no encontrado`)

  const message = await anthropic.messages.create({
    model:      'claude-sonnet-4-20250514',
    max_tokens: 500,
    messages:   [{ role: 'user', content: buildPrompt(lead) }],
  })

  const block = message.content[0]
  if (block.type !== 'text') throw new Error('Respuesta inesperada de Claude')

  const analysis: IntakeAnalysis = JSON.parse(stripMarkdown(block.text))

  await supabase.from('skill_outputs').insert({
    account_id: lead.account_id,
    lead_id,
    skill_name: 'intake-analyzer',
    version:    1,
    payload:    analysis,
  })

  return analysis
}
