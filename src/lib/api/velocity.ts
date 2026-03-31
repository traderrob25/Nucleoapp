import Anthropic from '@anthropic-ai/sdk'

export interface LeadInput {
  name:    string
  service?: string | null
  budget?:  string | null
  source?:  string | null
}

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

function buildPrompt(lead: LeadInput): string {
  return `Eres un sistema de scoring de leads para agencias digitales.
Analiza este lead y devuelve SOLO un número entero entre 0 y 100.
Sin explicación, sin texto adicional, solo el número.

Lead:
- Nombre: ${lead.name}
- Servicio: ${lead.service ?? 'No especificado'}
- Presupuesto: ${lead.budget ?? 'No especificado'}
- Fuente: ${lead.source ?? 'No especificado'}

Criterios:
- Presupuesto $30k+: +30 puntos
- Presupuesto $15k-$30k: +20 puntos
- Presupuesto $5k-$15k: +10 puntos
- Fuente Referido: +25 puntos
- Fuente LinkedIn: +15 puntos
- Servicio específico (no Otro): +10 puntos`
}

export async function generateScore(lead: LeadInput): Promise<number> {
  const message = await client.messages.create({
    model:      'claude-sonnet-4-20250514',
    max_tokens: 10,
    messages:   [{ role: 'user', content: buildPrompt(lead) }],
  })

  const block = message.content[0]
  if (block.type !== 'text') return 50

  const score = parseInt(block.text.trim(), 10)
  if (isNaN(score)) return 50
  return Math.min(100, Math.max(0, score))
}
