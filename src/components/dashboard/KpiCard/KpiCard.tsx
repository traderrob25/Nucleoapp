import styles from './KpiCard.module.css'

interface KpiCardProps {
  label:      string
  value:      string | number
  delta?:     string
  deltaType?: 'up' | 'down' | 'neutral'
  sub?:       string
}

const DELTA_CLASS: Record<string, string> = {
  up:      styles.deltaUp,
  down:    styles.deltaDown,
  neutral: styles.deltaNeutral,
}

export function KpiCard({ label, value, delta, deltaType = 'neutral', sub }: KpiCardProps) {
  return (
    <div className={styles.card}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
      {delta && (
        <span className={`${styles.delta} ${DELTA_CLASS[deltaType]}`}>
          {delta}
        </span>
      )}
      {sub && <span className={styles.sub}>{sub}</span>}
    </div>
  )
}
