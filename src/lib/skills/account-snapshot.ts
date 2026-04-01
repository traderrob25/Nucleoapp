import Anthropic from '@anthropic-ai/sdk'
import { createAdminClient } from '@/lib/supabase/admin'
import type { AccountSnapshot } from '@/types/skill'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function generateAccountSnapshot(account_id: string): Promise<AccountSnapshot> {
  const supabase = createAdminClient()

  // 1. Fetch data
  const [
    { data: account },
    { data: leads },
    { data: quotes },
    { data: outputs }
  ] = await Promise.all([
    supabase.from('accounts').select('tier, agency_name').eq('id', account_id).single(),
    supabase.from('leads').select('status, score, service, budget').eq('account_id', account_id),
    supabase.from('quotes').select('status, amount, view_count').eq('account_id', account_id),
    supabase.from('skill_outputs').select('payload').eq('account_id', account_id).eq('skill_name', 'intake-analyzer').order('created_at', { ascending: false }).limit(1)
  ])

  if (!account) throw new Error('Cuenta no encontrada')

  // 2. Aggregate context
  const total_leads = leads?.length || 0
  const leads_calientes = leads?.filter(l => (l.score || 0) >= 70).length || 0
  const closed_leads = leads?.filter(l => l.status === 'cerrado').length || 0
  const tasa_cierre = total_leads > 0 ? (closed_leads / total_leads) * 100 : 0
  
  const revenue_pipeline = (quotes || [])
    .filter(q => ['borrador', 'enviada', 'vista', 'revision'].includes(q.status))
    .reduce((acc, q) => acc + (Number(q.amount) || 0), 0)

  const servicios = Array.from(new Set((leads || []).map(l => l.service).filter(Boolean))) as string[]
  
  // 3. Phase logic
  let fase: 'caos' | 'sistema' | 'ceo' = 'caos'
  if (tasa_cierre > 50 && revenue_pipeline >= 30000) {
    fase = 'ceo'
  } else if ((tasa_cierre >= 20 && tasa_cierre <= 50) || revenue_pipeline >= 10000) {
    fase = 'sistema'
  }

  // 4. Claude API
  const prompt = `Eres un consultor experto en agencias digitales LATAM.
Genera un snapshot ejecutivo para este dueño de agencia.
Devuelve SOLO un objeto JSON válido, sin markdown ni explicaciones.

Datos de la agencia (${account.agency_name || 'Sin nombre'}):
- Tier: ${account.tier}
- Total leads: ${total_leads}
- Leads calientes (score >= 70): ${leads_calientes}
- Tasa de cierre: ${tasa_cierre.toFixed(1)}%
- Pipeline de revenue: $${revenue_pipeline.toLocaleString()}
- Servicios más solicitados: ${servicios.join(', ') || 'N/A'}
- Fase calculada: ${fase}

Devuelve exactamente este formato JSON:
{
  "fase": "${fase}",
  "resumen": "string — 2 oraciones sobre el estado actual",
  "cuellos_de_botella": ["string x3 — problemas específicos"],
  "quick_wins": ["string x3 — acciones concretas esta semana"],
  "metrica_clave": "string — la 1 métrica más importante a mejorar",
  "nivel_salud": número 0-100
}

Criterios de fase:
- caos: tasa_cierre < 20% o leads_calientes < 2
- sistema: tasa_cierre 20-50% o pipeline > $10k
- ceo: tasa_cierre > 50% y pipeline > $30k`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }]
  })

  const block = message.content[0]
  if (block.type !== 'text') throw new Error('Respuesta inesperada de Claude')

  let result: AccountSnapshot
  try {
    // Usar la función de limpieza de markdown si existe, pero aquí la incluyo inline
    const cleanText = block.text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim()
    result = JSON.parse(cleanText)
  } catch (e) {
    console.error('Error parsing Claude response:', block.text)
    throw new Error('Error al procesar el diagnóstico de la IA')
  }

  // 5. Save to skill_outputs
  await supabase.from('skill_outputs').insert({
    account_id,
    lead_id: null,
    skill_name: 'account-snapshot',
    version: 1,
    payload: result
  })

  return result
}
