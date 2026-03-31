import { createClient } from '@/lib/supabase/server'
import { IntakeForm } from '@/components/command-center/IntakeForm/IntakeForm'
import { LeadsTable } from '@/components/dashboard/LeadsTable/LeadsTable'
import { PipelineStages } from '@/components/dashboard/PipelineStages/PipelineStages'
import type { Lead } from '@/types/lead'
import styles from './overview.module.css'

const STAGE_KEYS = ['nuevo', 'contactado', 'propuesta', 'cerrado', 'perdido']

async function getPageData(userId: string): Promise<{
  leads:  Lead[]
  stages: Record<string, number>
}> {
  const supabase = await createClient()

  const { data: account } = await supabase
    .from('accounts')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (!account) return { leads: [], stages: Object.fromEntries(STAGE_KEYS.map((k) => [k, 0])) }

  const [{ data: leads }, { data: stageCounts }] = await Promise.all([
    supabase
      .from('leads')
      .select('id, name, phone, service, budget, score, status, created_at')
      .eq('account_id', account.id)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('leads')
      .select('status')
      .eq('account_id', account.id),
  ])

  // Count per status client-side to avoid rpc dependency
  const stages = Object.fromEntries(STAGE_KEYS.map((k) => [k, 0]))
  for (const row of stageCounts ?? []) {
    if (row.status in stages) stages[row.status]++
  }

  return { leads: leads ?? [], stages }
}

export default async function OverviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { leads, stages } = user
    ? await getPageData(user.id)
    : { leads: [], stages: Object.fromEntries(STAGE_KEYS.map((k) => [k, 0])) }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Command Center</h1>
        <p className={styles.subtitle}>// intake · pipeline · alertas</p>
      </div>
      <PipelineStages stages={stages} />
      <IntakeForm />
      <LeadsTable leads={leads} />
    </div>
  )
}
