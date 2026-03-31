import styles from './PipelineStages.module.css'

const STAGES = ['nuevo', 'contactado', 'propuesta', 'cerrado', 'perdido'] as const

interface PipelineStagesProps {
  stages: Record<string, number>
}

export function PipelineStages({ stages }: PipelineStagesProps) {
  const max = Math.max(...STAGES.map((s) => stages[s] ?? 0), 1)

  return (
    <div className={styles.wrapper}>
      <p className={styles.sectionLabel}>// pipeline</p>
      <div className={styles.track}>
        {STAGES.map((stage) => {
          const count = stages[stage] ?? 0
          const pct   = Math.round((count / max) * 100)
          const isMax    = count === max && count > 0
          const isClosed = stage === 'cerrado'

          return (
            <div key={stage} className={styles.stage}>
              <span className={styles.stageName}>{stage.toUpperCase()}</span>
              <span
                className={`${styles.count} ${isClosed ? styles.countClosed : isMax ? styles.countMax : ''}`}
              >
                {count}
              </span>
              <div className={styles.barBg}>
                <div
                  className={`${styles.bar} ${isClosed ? styles.barClosed : isMax ? styles.barMax : ''}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
