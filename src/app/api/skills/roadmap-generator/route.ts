import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateRoadmap } from '@/lib/skills/roadmap-generator'

export async function POST() {
  try {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Buscar account_id
    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (accountError || !account) {
      return NextResponse.json({ error: 'Cuenta no encontrada' }, { status: 404 })
    }

    const roadmap = await generateRoadmap(account.id)

    return NextResponse.json({ success: true, roadmap })
  } catch (err: any) {
    console.error('Error in /api/skills/roadmap-generator:', err)
    return NextResponse.json({ 
      error: 'Error interno al generar el roadmap',
      msg: err.message
    }, { status: 500 })
  }
}
