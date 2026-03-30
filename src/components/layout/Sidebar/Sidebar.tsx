import type { TierID } from '@/lib/tier/types'
import { TIER_CONFIG } from '@/lib/tier/config'
import { getLockedNav } from '@/lib/tier/guard'
import { NavItem } from './NavItem'
import styles from './Sidebar.module.css'

const NAV_ITEMS = [
  { href: '/dashboard/overview',  label: 'Overview',  id: 'overview' },
  { href: '/dashboard/pipeline',  label: 'Pipeline',  id: 'pipeline' },
  { href: '/dashboard/velocity',  label: 'Velocity',  id: 'velocity' },
  { href: '/dashboard/quotes',    label: 'Quotes',    id: 'quotes'   },
  { href: '/dashboard/reportes',  label: 'Reportes',  id: 'reportes' },
]

interface SidebarProps {
  tier: TierID
}

export function Sidebar({ tier }: SidebarProps) {
  const lockedNav = getLockedNav(tier)
  const tierConfig = TIER_CONFIG[tier]

  return (
    <nav className={styles.sidebar}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Dashboard</span>
        {NAV_ITEMS.map(({ href, label, id }) => (
          <NavItem
            key={href}
            href={href}
            label={label}
            locked={lockedNav.includes(id)}
          />
        ))}
      </div>

      <div className={styles.tierBadge}>
        {tierConfig.label}
      </div>
    </nav>
  )
}
