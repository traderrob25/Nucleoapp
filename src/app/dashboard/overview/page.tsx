import { createClient } from '@/lib/supabase/server'
import { IntakeForm } from '@/components/command-center/IntakeForm/IntakeForm'
import { LeadsTable } from '@/components/dashboard/LeadsTable/LeadsTable'
import { PipelineStages } from '@/components/dashboard/PipelineStages/PipelineStages'
import { KpiCard } from '@/components/dashboard/KpiCard/KpiCard'
import { AlertFeed, QuoteVista, LeadInactivo, QuoteBorrador } from '@/components/command-center/AlertFeed/AlertFeed'
import { HealthRing } from '@/components/dashboard/HealthRing/HealthRing'
import type { Lead } from '@/types/lead'
import styles from './overview.module.css'

const STAGE_KEYS = ['nuevo', 'contactado', 'propuesta', 'cerrado', 'perdido']

const EMPTY_DATA = {
  leads:       [] as Lead[],
  stages:      Object.fromEntries(STAGE_KEYS.map((k) => [k, 0])),
  leadsWeek:   0,
  openQuotes:  0,
  closedLeads: 0,
  closureRate: 0,
  quotesVistas: [] as QuoteVista[],
  leadsSinActividad: [] as LeadInactivo[],
  quotesBorrador: [] as QuoteBorrador[],
  nivelSalud: 0,
}

async function getPageData(userId: string) {
  const supabase = await createClient()

  const { data: account } = await supabase
    .from('accounts')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (!account) return EMPTY_DATA

  const accountId = account.id
  const weekAgo   = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const hace48h = new Date(Date.now() - 48*60*60*1000).toISOString()

  const [
    { data: leads },
    { data: allStatuses },
    { count: leadsWeekCount },
    { count: openQuotesCount },
    { count: closedLeadsCount },
    { count: totalLeadsCount },
    { data: quotesVistasData },
    { data: leadsSinActividadData },
    { data: quotesBorradorData },
    { data: snapshotData },
  ] = await Promise.all([
    supabase
      .from('leads')
      .select('id, name, phone, service, budget, score, status, created_at')
      .eq('account_id', accountId)
      .order('created_at', { ascending: false })
      .limit(10),

    supabase
      .from('leads')
      .select('status')
      .eq('account_id', accountId),

    supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('account_id', accountId)
      .gte('created_at', weekAgo),

    supabase
      .from('quotes')
      .select('id', { count: 'exact', head: true })
      .eq('account_id', accountId)
      .not('status', 'in', '(cerrada,perdida)'),

    supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('account_id', accountId)
      .eq('status', 'cerrado'),

    supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('account_id', accountId),

    supabase
      .from('quotes')
      .select('id, client_name, view_count, updated_at')
      .eq('account_id', accountId)
      .eq('status', 'vista')
      .order('updated_at', { ascending: false })
      .limit(3),

    supabase
      .from('leads')
      .select('id, name, status, updated_at')
      .eq('account_id', accountId)
      .eq('status', 'nuevo')
      .lt('updated_at', hace48h)
      .limit(3),

    supabase
      .from('quotes')
      .select('id, client_name, amount, created_at')
      .eq('account_id', accountId)
      .eq('status', 'borrador')
      .order('created_at', { ascending: false })
      .limit(2),

    supabase
      .from('skill_outputs')
      .select('output_data')
      .eq('account_id', accountId)
      .eq('skill_name', 'account-snapshot')
      .order('created_at', { ascending: false })
      .limit(1)
  ])

  const stages = Object.fromEntries(STAGE_KEYS.map((k) => [k, 0]))
  for (const row of allStatuses ?? []) {
    if (row.status in stages) stages[row.status]++
  }

  const total       = totalLeadsCount ?? 0
  const closed      = closedLeadsCount ?? 0
  const closureRate = total > 0 ? Math.round((closed / total) * 100) : 0

  return {
    leads:       leads ?? [],
    stages,
    leadsWeek:   leadsWeekCount ?? 0,
    openQuotes:  openQuotesCount ?? 0,
    closedLeads: closed,
    closureRate,
    quotesVistas: quotesVistasData ?? [],
    leadsSinActividad: leadsSinActividadData ?? [],
    quotesBorrador: quotesBorradorData ?? [],
    nivelSalud: snapshotData?.[0]?.output_data?.nivel_salud ?? 0,
  }
}

export default async function OverviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { leads, stages, leadsWeek, openQuotes, closedLeads, closureRate, quotesVistas, leadsSinActividad, quotesBorrador, nivelSalud } =
    user ? await getPageData(user.id) : EMPTY_DATA

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Command Center</h1>
        <p className={styles.subtitle}>// intake · pipeline · alertas</p>
      </div>

      <div className={styles.kpiGrid}>
        <KpiCard
          label="Leads esta semana"
          value={leadsWeek}
          delta="últimos 7 días"
          deltaType="neutral"
        />
        <KpiCard
          label="Propuestas abiertas"
          value={openQuotes}
          delta="activas"
          deltaType="neutral"
        />
        <KpiCard
          label="Tasa de cierre"
          value={`${closureRate}%`}
          delta={closureRate >= 30 ? '↑ sobre benchmark' : '↓ bajo benchmark'}
          deltaType={closureRate >= 30 ? 'up' : 'down'}
        />
        <KpiCard
          label="Leads cerrados"
          value={closedLeads}
          delta="total histórico"
          deltaType="neutral"
        />
      </div>

      <HealthRing nivelSalud={nivelSalud} />
      <AlertFeed 
        quotesVistas={quotesVistas} 
        leadsSinActividad={leadsSinActividad} 
        quotesBorrador={quotesBorrador} 
      />
      <PipelineStages stages={stages} />
      <IntakeForm />
      <LeadsTable leads={leads} />
    </div>
  )
}
