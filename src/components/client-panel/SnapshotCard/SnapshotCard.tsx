import type { AccountSnapshot } from '@/types/skill';
import styles from './SnapshotCard.module.css';

interface SnapshotCardProps {
  snapshot: AccountSnapshot;
}

const PHASE_CONFIG = {
  caos: { label: 'CAOS', class: styles.phaseCaos },
  sistema: { label: 'SISTEMA', class: styles.phaseSistema },
  ceo: { label: 'CEO', class: styles.phaseCeo },
};

const SnapshotCard = ({ snapshot }: SnapshotCardProps) => {
  const phase = PHASE_CONFIG[snapshot.fase] || PHASE_CONFIG.caos;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={`${styles.badge} ${phase.class}`}>
          Fase {phase.label}
        </span>
        <div className={styles.statusInfo}>
          <span className={styles.metricLabel}>Métrica Clave:</span>
          <span className={styles.metricValue}>{snapshot.metrica_clave}</span>
        </div>
      </div>

      <p className={styles.resumen}>{snapshot.resumen}</p>

      <div className={styles.grid}>
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>⚠ Cuellos de Botella</h4>
          <ul className={styles.list}>
            {snapshot.cuellos_de_botella.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>✓ Quick Wins</h4>
          <ul className={`${styles.list} ${styles.successList}`}>
            {snapshot.quick_wins.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SnapshotCard;
