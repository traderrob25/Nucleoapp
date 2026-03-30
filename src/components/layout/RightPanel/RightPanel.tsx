import styles from './RightPanel.module.css'

export function RightPanel() {
  return (
    <aside className={styles.panel}>
      <p className={styles.header}>Actividad</p>
      <div className={styles.placeholder}>
        <div className={styles.placeholderDot} />
        <p className={styles.placeholderText}>
          AlertFeed disponible en Fase 2
        </p>
      </div>
    </aside>
  )
}
