import { IntakeForm } from '@/components/command-center/IntakeForm/IntakeForm'
import styles from './overview.module.css'

export default function OverviewPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Command Center</h1>
        <p className={styles.subtitle}>// intake · pipeline · alertas</p>
      </div>
      <IntakeForm />
    </div>
  )
}
