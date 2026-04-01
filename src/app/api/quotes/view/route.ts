import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return new Response('No ID provided', { status: 400 })
  }

  const supabase = createAdminClient()

  // Incrementar view_count
  const { error } = await supabase.rpc('increment_view_count', { quote_id: id })

  // Si no hay rpc, lo hacemos manual (aunque con concurrencia no es ideal, pero por ahora...)
  if (error) {
    // Intentar manual if RPC fails (maybe RPC is not set yet)
    const { data: quote } = await supabase
      .from('quotes')
      .select('view_count')
      .eq('id', id)
      .single()

    if (quote) {
      await supabase
        .from('quotes')
        .update({ view_count: (quote.view_count || 0) + 1 })
        .eq('id', id)
    }
  }

  // TODO: En TASK-019 crearemos la página pública de visualización.
  // Por ahora, redirigimos a una página genérica de éxito o informamos.
  return new Response('Link visitado — Propuesta visualizada. En TASK-019 crearemos la vista pública completa.', {
    headers: { 'Content-Type': 'text/plain; charset=UTF-8' }
  })
}
