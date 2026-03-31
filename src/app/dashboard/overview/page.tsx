import { createClient } from '@/lib/supabase/server'
import { IntakeForm } from '@/components/command-center/IntakeForm/IntakeForm'
import { LeadsTable } from '@/components/dashboard/LeadsTable/LeadsTable'
import type { Lead } from '@/types/lead'
import styles from './overview.module.css'

async function getLeads(userId: string): Promise<Lead[]> {
  const supabase = await createClient()

  const { data: account } = await supabase
    .from('accounts')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (!account) return []

  const { data: leads } = await supabase
    .from('leads')
    .select('id, name, phone, service, budget, score, status, created_at')
    .eq('account_id', account.id)
    .order('created_at', { ascending: false })
    .limit(10)

  return leads ?? []
}

export default async function OverviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const leads = user ? await getLeads(user.id) : []

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Command Center</h1>
        <p className={styles.subtitle}>// intake · pipeline · alertas</p>
      </div>
      <IntakeForm />
      <LeadsTable leads={leads} />
    </div>
  )
}
