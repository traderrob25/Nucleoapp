import styles from './HealthRing.module.css'

interface HealthRingProps {
  nivelSalud: number
}

export function HealthRing({ nivelSalud }: HealthRingProps) {
  let colorVar = 'var(--danger, #ef4444)'
  if (nivelSalud >= 70) colorVar = 'var(--ok, #10b981)'
  else if (nivelSalud >= 40) colorVar = 'var(--warn, #f59e0b)'

  const displayValue = nivelSalud === 0 ? '--' : nivelSalud
  const strokeDashoffset = nivelSalud === 0 ? 100 : 100 - nivelSalud // 100 is max dasharray for clean svg

  return (
    <div className={styles.container}>
      <div className={styles.ringWrapper}>
        <svg viewBox="0 0 36 36" className={styles.circularChart}>
          <path
            className={styles.circleBg}
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className={styles.circle}
            strokeDasharray={`${nivelSalud === 0 ? 0 : nivelSalud}, 100`}
            style={{ stroke: colorVar }}
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <text x="18" y="20.35" className={styles.percentage} style={{ fill: nivelSalud === 0 ? 'var(--text-secondary, #a1a1aa)' : colorVar }}>
            {displayValue}
          </text>
        </svg>
      </div>
      <div className={styles.info}>
        <p className={styles.label}>Nivel de Salud</p>
        {nivelSalud === 0 && (
          <button className={styles.actionButton}>Generar diagnóstico</button>
        )}
      </div>
    </div>
  )
}
