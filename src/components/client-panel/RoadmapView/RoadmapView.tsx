import type { Roadmap } from '@/types/skill';
import styles from './RoadmapView.module.css';

interface RoadmapViewProps {
  roadmap: Roadmap;
}

const RoadmapView = ({ roadmap }: RoadmapViewProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.label}>// plan de 90 días</span>
        <h2 className={styles.title}>{roadmap.titulo}</h2>
      </div>

      <div className={styles.periods}>
        {roadmap.semanas.map((p, i) => (
          <div key={i} className={styles.periodRow}>
            <div className={styles.periodLabel}>
              <span className={styles.periodBadge}>{p.periodo}</span>
              <div className={styles.line} />
            </div>
            
            <div className={styles.periodContent}>
              <h4 className={styles.enfoque}>{p.enfoque}</h4>
              <ul className={styles.acciones}>
                {p.acciones.map((a, j) => (
                  <li key={j}>{a}</li>
                ))}
              </ul>
              <p className={styles.resultado}>
                <span className={styles.marker}>↳ Resultado:</span> {p.resultado_esperado}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.milestones}>
        <div className={styles.milestone}>
          <span className={styles.mBadge}>Día 30</span>
          <p>{roadmap.hito_30_dias}</p>
        </div>
        <div className={styles.milestone}>
          <span className={styles.mBadge}>Día 60</span>
          <p>{roadmap.hito_60_dias}</p>
        </div>
        <div className={styles.milestone}>
          <span className={styles.mBadge}>Día 90</span>
          <p>{roadmap.hito_90_dias}</p>
        </div>
      </div>

      <div className={styles.playbooks}>
        <span className={styles.label}>Playbooks activos:</span>
        <div className={styles.tagGrp}>
          {roadmap.playbooks_activos.map((p, i) => (
            <span key={i} className={styles.tag}>{p}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoadmapView;
