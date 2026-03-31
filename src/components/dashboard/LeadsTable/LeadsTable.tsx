import type { Lead } from '@/types/lead'
import styles from './LeadsTable.module.css'

interface LeadsTableProps {
  leads: Lead[]
}

const STATUS_CLASS: Record<string, string> = {
  nuevo:      styles.statusNuevo,
  contactado: styles.statusContactado,
  caliente:   styles.statusCaliente,
  propuesta:  styles.statusPropuesta,
  cerrado:    styles.statusCerrado,
  perdido:    styles.statusPerdido,
}

function scoreBadgeClass(score: number): string {
  if (score >= 80) return styles.scoreHigh
  if (score >= 50) return styles.scoreMid
  return styles.scoreLow
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
  })
}

export function LeadsTable({ leads }: LeadsTableProps) {
  if (leads.length === 0) {
    return (
      <div className={styles.empty}>
        Sin leads aún — registra el primero arriba ↑
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <p className={styles.sectionLabel}>// leads recientes</p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Servicio</th>
              <th>Presupuesto</th>
              <th>Score</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td className={styles.name}>{lead.name}</td>
                <td>{lead.service ?? '—'}</td>
                <td>{lead.budget ?? '—'}</td>
                <td>
                  <span className={`${styles.scoreBadge} ${scoreBadgeClass(lead.score)}`}>
                    {lead.score}
                  </span>
                </td>
                <td>
                  <span className={`${styles.statusTag} ${STATUS_CLASS[lead.status] ?? styles.statusNuevo}`}>
                    {lead.status}
                  </span>
                </td>
                <td className={styles.date}>{formatDate(lead.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
