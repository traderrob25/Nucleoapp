import styles from './AlertFeed.module.css'

export type QuoteVista = {
  id: string
  client_name: string
  view_count: number
  updated_at: string
}

export type LeadInactivo = {
  id: string
  name: string
  status: string
  updated_at: string
}

export type QuoteBorrador = {
  id: string
  client_name: string
  amount: number
  created_at: string
}

interface AlertFeedProps {
  quotesVistas: QuoteVista[]
  leadsSinActividad: LeadInactivo[]
  quotesBorrador: QuoteBorrador[]
}

export function AlertFeed({ quotesVistas, leadsSinActividad, quotesBorrador }: AlertFeedProps) {
  const hasAlerts = quotesVistas.length > 0 || leadsSinActividad.length > 0 || quotesBorrador.length > 0

  if (!hasAlerts) {
    return (
      <div className={styles.feed}>
        <h3 className={styles.title}>AlertFeed</h3>
        <p className={styles.ok}>Sin alertas activas ✓</p>
      </div>
    )
  }

  return (
    <div className={styles.feed}>
      <h3 className={styles.title}>AlertFeed</h3>
      <ul className={styles.list}>
        {quotesVistas.map(q => (
          <li key={q.id} className={`${styles.alert} ${styles.accent}`}>
            ⚡ {q.client_name} vio tu propuesta ×{q.view_count}
          </li>
        ))}
        {leadsSinActividad.map(l => (
          <li key={l.id} className={`${styles.alert} ${styles.warn}`}>
            ⚠ {l.name} sin actividad 48h+
          </li>
        ))}
        {quotesBorrador.map(q => (
          <li key={q.id} className={`${styles.alert} ${styles.text3}`}>
            📄 Propuesta {q.client_name} pendiente de enviar
          </li>
        ))}
      </ul>
    </div>
  )
}
