import Anthropic from '@anthropic-ai/sdk'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateAccountSnapshot } from '@/lib/skills/account-snapshot'
import type { Roadmap, AccountSnapshot } from '@/types/skill'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function generateRoadmap(account_id: string): Promise<Roadmap> {
  const supabase = createAdminClient()

  // 1. Obtener snapshot más reciente
  const { data: output } = await supabase
    .from('skill_outputs')
    .select('payload')
    .eq('account_id', account_id)
    .eq('skill_name', 'account-snapshot')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  let snapshot: AccountSnapshot
  if (!output) {
    snapshot = await generateAccountSnapshot(account_id)
  } else {
    snapshot = output.payload as AccountSnapshot
  }

  // 2. Obtener tier de la cuenta
  const { data: account } = await supabase
    .from('accounts')
    .select('tier')
    .eq('id', account_id)
    .single()

  if (!account) throw new Error('Cuenta no encontrada')

  // 3. Claude API
  const prompt = `Eres un consultor experto en implementación de sistemas para agencias digitales LATAM.
Genera un plan de 90 días adaptado al tier contratado.
Devuelve SOLO un objeto JSON válido, sin markdown ni explicaciones adicionales.

Contexto de la agencia (Diagnóstico):
- Fase actual: ${snapshot.fase}
- Tier contratado: ${account.tier}
- Cuellos de botella: ${snapshot.cuellos_de_botella.join(', ')}
- Quick wins: ${snapshot.quick_wins.join(', ')}
- Métrica clave a mejorar: ${snapshot.metrica_clave}

Guía de intensidad por Tier:
- parche: Foco en 2 sistemas clave, ritmo de implementación ligero.
- operador: 3-4 playbooks de escala, ritmo medio.
- ceo: Arquitectura completa de delegación y escala masiva, ritmo acelerado.

Devuelve exactamente este formato JSON:
{
  "titulo": "string — nombre inspirador del plan",
  "semanas": [
    {
      "periodo": "Semana 1-2",
      "enfoque": "string — tema central",
      "acciones": ["string x3 — acciones concretas"],
      "resultado_esperado": "string"
    }
  ],
  "hito_30_dias": "string — qué debe estar funcionando perfectamente",
  "hito_60_dias": "string — resultado palpable en el negocio",
  "hito_90_dias": "string — situación final de la agencia",
  "playbooks_activos": ["string"] — Nombres de playbooks que aplican a este tier
}

Genera exactamente de 4 a 6 períodos de 2 semanas cada uno.`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }]
  })

  const block = message.content[0]
  if (block.type !== 'text') throw new Error('Respuesta inesperada de Claude')

  let result: Roadmap
  try {
    const cleanText = block.text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim()
    result = JSON.parse(cleanText)
  } catch (e) {
    console.error('Error parsing Claude response:', block.text)
    throw new Error('Error al procesar el roadmap de la IA')
  }

  // 4. Guardar en skill_outputs
  await supabase.from('skill_outputs').insert({
    account_id,
    lead_id: null,
    skill_name: 'roadmap-generator',
    version: 1,
    payload: result
  })

  return result
}
