import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateAccountSnapshot } from '@/lib/skills/account-snapshot'

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

    const snapshot = await generateAccountSnapshot(account.id)

    return NextResponse.json({ success: true, snapshot })
  } catch (err: any) {
    console.error('Error in /api/skills/account-snapshot:', err)
    return NextResponse.json({ 
      error: 'Error interno al generar snapshot',
      msg: err.message
    }, { status: 500 })
  }
}
