import type { TierID } from '@/lib/tier/types'
import { TIER_CONFIG } from '@/lib/tier/config'
import styles from './AgentStatusBar.module.css'

interface AgentStatusBarProps {
  tier: TierID
}

export function AgentStatusBar({ tier }: AgentStatusBarProps) {
  const tierConfig = TIER_CONFIG[tier]

  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        <span className={styles.dot} aria-hidden />
        <span className={styles.label}>Velocity Agent · Fase 3</span>
      </div>
      <span className={styles.tierTag}>{tierConfig.label}</span>
    </div>
  )
}
