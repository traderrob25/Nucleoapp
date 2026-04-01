import styles from './HealthMeter.module.css';

interface HealthMeterProps {
  nivel_salud: number;
}

const HealthMeter = ({ nivel_salud }: HealthMeterProps) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (nivel_salud / 100) * circumference;

  const getColor = () => {
    if (nivel_salud >= 70) return 'var(--ok)';
    if (nivel_salud >= 40) return 'var(--warn)';
    return 'var(--danger)';
  };

  return (
    <div className={styles.container}>
      <div className={styles.meter}>
        <svg className={styles.svg} width="140" height="140">
          <circle
            className={styles.background}
            cx="70"
            cy="70"
            r={radius}
          />
          <circle
            className={styles.progress}
            cx="70"
            cy="70"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            stroke={getColor()}
          />
        </svg>
        <div className={styles.content}>
          <span className={styles.number} style={{ color: getColor() }}>
            {nivel_salud}
          </span>
          <span className={styles.label}>SALUD</span>
        </div>
      </div>
      <p className={styles.tagline}>Diagnóstico basado en tus métricas actuales</p>
    </div>
  );
};

export default HealthMeter;
