import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { generateScore } from '@/lib/api/velocity'

const WebhookSchema = z.object({
  lead_id: z.string().uuid(),
  name:    z.string(),
  service: z.string().optional(),
  budget:  z.string().optional(),
  source:  z.string().optional(),
})

function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const parsed = WebhookSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { lead_id, name, service, budget, source } = parsed.data

    const score = await generateScore({ name, service, budget, source })

    const supabase = createAdminClient()
    const { error } = await supabase
      .from('leads')
      .update({ score, updated_at: new Date().toISOString() })
      .eq('id', lead_id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, score })

  } catch (err) {
    console.error('[velocity webhook]', err)
    return NextResponse.json({ error: 'Error inesperado' }, { status: 500 })
  }
}
