'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function updateAgencyName(formData: FormData) {
  const name = formData.get('agencyName') as string
  if (!name || name.trim() === '') return

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  await supabase
    .from('accounts')
    .update({ agency_name: name })
    .eq('user_id', user.id)

  redirect('/dashboard/overview')
}
