import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'
import { createClient } from '@/lib/supabase/server'
import type { TierID } from '@/lib/tier/types'
import { Topbar } from '@/components/layout/Topbar/Topbar'
import { Sidebar } from '@/components/layout/Sidebar/Sidebar'
import { RightPanel } from '@/components/layout/RightPanel/RightPanel'
import { AgentStatusBar } from '@/components/layout/AgentStatusBar/AgentStatusBar'
import styles from './dashboard.module.css'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Leer tier — SOLO desde Supabase, nunca hardcodeado
  let { data: account } = await supabase
    .from('accounts')
    .select('tier, agency_name')
    .eq('user_id', user.id)
    .single()

  // Auto-provision: primer acceso crea account con tier 'parche'
  if (!account) {
    const { data: newAccount } = await supabase
      .from('accounts')
      .insert({ user_id: user.id, tier: 'parche' })
      .select('tier, agency_name')
      .single()
    account = newAccount
  }

  const tier = (account?.tier ?? 'parche') as TierID
  const agencyName = account?.agency_name ?? null

  if (!agencyName) {
    redirect('/onboarding')
  }

  return (
    <div className={styles.shell}>
      <Topbar userEmail={user.email ?? ''} agencyName={agencyName} />
      <div className={styles.body}>
        <Sidebar tier={tier} />
        <main className={styles.main}>{children}</main>
        <RightPanel />
      </div>
      <AgentStatusBar tier={tier} />
    </div>
  )
}
