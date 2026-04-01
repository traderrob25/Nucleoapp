'use client'

import { useState } from 'react'
import type { Lead } from '@/types/lead'
import styles from './LeadsTable.module.css'
import { ProposalViewer } from '@/components/command-center/ProposalViewer/ProposalViewer'

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
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [proposal, setProposal] = useState<{ markdown: string, leadName: string } | null>(null)

  const handleGenerateProposal = async (lead: Lead) => {
    try {
      setLoadingId(lead.id)
      const res = await fetch('/api/skills/proposal-writer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead_id: lead.id })
      })

      if (!res.ok) throw new Error('Error en API')
      const data = await res.json()
      
      setProposal({ markdown: data.proposal, leadName: lead.name })
    } catch (err) {
      alert('Error generando propuesta. Intenta de nuevo.')
    } finally {
      setLoadingId(null)
    }
  }

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
              <th>Acción</th>
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
                <td>
                  <button 
                    className={styles.proposalBtn}
                    onClick={() => handleGenerateProposal(lead)}
                    disabled={loadingId === lead.id}
                  >
                    {loadingId === lead.id ? 'Cargando...' : '⚡ Propuesta'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {proposal && (
        <ProposalViewer
          markdown={proposal.markdown}
          leadName={proposal.leadName}
          onClose={() => setProposal(null)}
        />
      )}
    </div>
  )
}
