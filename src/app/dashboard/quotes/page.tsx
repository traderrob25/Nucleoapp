import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { QuotePanel } from '@/components/dashboard/QuotePanel/QuotePanel'
import type { QuoteWithContent } from '@/types/quote'

export default async function QuotesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Buscar account_id
  const { data: account } = await supabase
    .from('accounts')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!account) return <div>Error: Cuenta no encontrada</div>

  // Query: SELECT q.*, s.payload->>'markdown' as content ...
  // Nota: Usamos LEFT JOIN con skill_outputs para traer el contenido guardado.
  // En Supabase JS, esto se hace con una query relacional si las FK están bien, 
  // o podemos usar fetch manual de dos tablas.
  
  const { data: quotesData, error } = await supabase
    .from('quotes')
    .select(`
      *,
      skill_outputs!lead_id (
        payload
      )
    `)
    .eq('account_id', account.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching quotes:', error)
    return <div>Error cargando propuestas</div>
  }

  // Mapear para ajustarse a QuoteWithContent
  const quotes: QuoteWithContent[] = (quotesData || []).map((q: any) => {
    // Buscar el payload que tenga skill_name 'quote-content'
    const contentObj = q.skill_outputs?.find((s: any) => s.payload?.markdown)
    return {
      ...q,
      content: contentObj?.payload?.markdown || null
    }
  })

  return (
    <div style={{ padding: '24px' }}>
      <QuotePanel quotes={quotes} />
    </div>
  )
}
