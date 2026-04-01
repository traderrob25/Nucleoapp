'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Quote } from '@/types/quote'

export async function createQuote(
  leadId: string,
  clientName: string,
  service: string | null,
  amount: number | null,
  markdown: string
) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return { error: 'No autenticado' }

    // Buscar account_id
    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (accountError || !account) return { error: 'Cuenta no encontrada' }

    // INSERT quote
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .insert({
        account_id: account.id,
        lead_id: leadId,
        client_name: clientName,
        service: service,
        amount: amount,
        status: 'borrador',
        view_count: 0
      })
      .select('id')
      .single()

    if (quoteError || !quote) return { error: 'Error al crear quote: ' + quoteError.message }

    // INSERT skill_output con el contenido
    const { error: skillError } = await supabase
      .from('skill_outputs')
      .insert({
        account_id: account.id,
        lead_id: leadId,
        skill_name: 'quote-content',
        payload: { markdown }
      })

    if (skillError) return { error: 'Error al guardar contenido: ' + skillError.message }

    revalidatePath('/dashboard/quotes')
    return { success: true, quote_id: quote.id }

  } catch (err) {
    return { error: 'Error inesperado al crear quote' }
  }
}

export async function updateQuoteStatus(quoteId: string, status: Quote['status']) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('quotes')
      .update({ status })
      .eq('id', quoteId)

    if (error) return { error: error.message }

    revalidatePath('/dashboard/quotes')
    return { success: true }
  } catch (err) {
    return { error: 'Error inesperado al actualizar status' }
  }
}
