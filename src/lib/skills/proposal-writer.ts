import Anthropic from '@anthropic-ai/sdk'
import { createAdminClient } from '@/lib/supabase/admin'
import { analyzeIntake } from '@/lib/skills/intake-analyzer'
import { mapPlaybooks } from '@/lib/skills/playbook-mapper'
import type { ProposalOutput, IntakeAnalysis, PlaybookMap } from '@/types/skill'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function buildPrompt(
  name: string,
  analysis: IntakeAnalysis,
  playbookMap: PlaybookMap
): string {
  const playbookList = playbookMap.playbooks
    .map((p) => `${p.prioridad}. ${p.nombre} (${p.tiempo_implementacion}) — ${p.impacto_esperado}`)
    .join('\n')

  return `Eres un experto en ventas de servicios digitales para agencias LATAM.
Escribe una propuesta ejecutiva en español. Devuelve SOLO markdown limpio.

Datos del lead:
- Nombre: ${name}
- Diagnóstico: ${analysis.diagnostico}
- Tier recomendado: ${analysis.tier_recomendado}
- Puntos fuertes: ${analysis.puntos_fuertes.join(', ')}
- Puntos débiles: ${analysis.puntos_debiles.join(', ')}
- Playbooks priorizados:
${playbookList}

Estructura exacta (usa estos headers):
# Diagnóstico: ${name}

## El problema que estás enfrentando
[2-3 párrafos que describen SU situación específica.
 Usa los puntos débiles. Hazlos sentir comprendidos.]

## Lo que proponemos
[Describe el sistema NucleoApp en términos de resultados,
 no de features. Menciona los 2 primeros playbooks.]

## Tu plan de implementación
[Lista los playbooks en orden con tiempo y resultado esperado]

## Inversión
[Según tier:
 parche: $497/mes — Sistema base
 operador: $997/mes — Sistema + Velocity Agent
 ceo: $1,997/mes — Sistema completo]

## Próximo paso
[Call to action claro — agendar llamada de 30 min]

Tono: directo, ejecutivo, sin buzzwords. Máximo 500 palabras.`
}

export async function writeProposal(lead_id: string): Promise<ProposalOutput> {
  const supabase = createAdminClient()

  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .select('account_id, name')
    .eq('id', lead_id)
    .single()

  if (leadError || !lead) throw new Error(`Lead ${lead_id} no encontrado`)

  // Leer outputs existentes
  const { data: outputs } = await supabase
    .from('skill_outputs')
    .select('skill_name, payload')
    .eq('lead_id', lead_id)
    .in('skill_name', ['intake-analyzer', 'playbook-mapper'])
    .order('created_at', { ascending: false })

  const existingIntake    = outputs?.find((o) => o.skill_name === 'intake-analyzer')
  const existingPlaybooks = outputs?.find((o) => o.skill_name === 'playbook-mapper')

  // Ejecutar skills faltantes en cadena
  const analysis: IntakeAnalysis = existingIntake
    ? (existingIntake.payload as IntakeAnalysis)
    : await analyzeIntake(lead_id)

  const playbookMap: PlaybookMap = existingPlaybooks
    ? (existingPlaybooks.payload as PlaybookMap)
    : await mapPlaybooks(lead_id)

  const message = await anthropic.messages.create({
    model:      'claude-sonnet-4-20250514',
    max_tokens: 1200,
    messages:   [{ role: 'user', content: buildPrompt(lead.name, analysis, playbookMap) }],
  })

  const block = message.content[0]
  if (block.type !== 'text') throw new Error('Respuesta inesperada de Claude')

  const result: ProposalOutput = {
    markdown:  block.text.trim(),
    lead_name: lead.name,
  }

  await supabase.from('skill_outputs').insert({
    account_id: lead.account_id,
    lead_id,
    skill_name: 'proposal-writer',
    version:    1,
    payload:    result,
  })

  return result
}
