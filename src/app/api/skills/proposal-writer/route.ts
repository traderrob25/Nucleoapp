import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { writeProposal } from '@/lib/skills/proposal-writer'

const Schema = z.object({
  lead_id: z.string().uuid(),
})

export async function POST(request: NextRequest) {
  try {
    const body   = await request.json()
    const parsed = Schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const proposal = await writeProposal(parsed.data.lead_id)
    return NextResponse.json({ success: true, proposal })

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error inesperado'
    const status  = message.includes('no encontrado') ? 404 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
