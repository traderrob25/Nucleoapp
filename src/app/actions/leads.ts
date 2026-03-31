'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

const LeadSchema = z.object({
  name:    z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  phone:   z.string().optional(),
  service: z.string().optional(),
  budget:  z.string().optional(),
  source:  z.string().optional(),
})

export type CreateLeadResult = { success: true } | { error: string }

export async function createLead(
  formData: FormData
): Promise<CreateLeadResult> {
  try {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return { error: 'No autenticado' }

    // Validar con Zod
    const parsed = LeadSchema.safeParse({
      name:    formData.get('name'),
      phone:   formData.get('phone') || undefined,
      service: formData.get('service') || undefined,
      budget:  formData.get('budget') || undefined,
      source:  formData.get('source') || undefined,
    })

    if (!parsed.success) {
      return { error: parsed.error.issues[0].message }
    }

    // Buscar o crear account
    let { data: account } = await supabase
      .from('accounts')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!account) {
      const { data: newAccount, error: accountError } = await supabase
        .from('accounts')
        .insert({ user_id: user.id, tier: 'parche' })
        .select('id')
        .single()

      if (accountError || !newAccount) {
        return { error: 'Error al crear la cuenta' }
      }
      account = newAccount
    }

    // INSERT lead
    const { error: insertError } = await supabase
      .from('leads')
      .insert({
        account_id: account.id,
        name:       parsed.data.name,
        phone:      parsed.data.phone ?? null,
        service:    parsed.data.service ?? null,
        budget:     parsed.data.budget ?? null,
        source:     parsed.data.source ?? null,
        score:      0,
        status:     'nuevo',
      })

    if (insertError) return { error: insertError.message }

    revalidatePath('/dashboard/overview')
    return { success: true }

  } catch {
    return { error: 'Error inesperado. Intenta de nuevo.' }
  }
}
