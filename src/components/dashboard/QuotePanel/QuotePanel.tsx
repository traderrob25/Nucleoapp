'use client'

import { useState } from 'react'
import { updateQuoteStatus } from '@/app/actions/quotes'
import type { QuoteWithContent } from '@/types/quote'
import { ProposalViewer } from '@/components/command-center/ProposalViewer/ProposalViewer'
import styles from './QuotePanel.module.css'

interface QuotePanelProps {
  quotes: QuoteWithContent[]
}

const STATUS_CONFIG: Record<string, { label: string, badgeClass: string }> = {
  borrador: { label: 'Borrador', badgeClass: styles.statusBorrador },
  enviada:  { label: 'Enviada',  badgeClass: styles.statusEnviada },
  vista:    { label: 'Vista',    badgeClass: styles.statusVista },
  revision: { label: 'Revisión', badgeClass: styles.statusRevision },
  cerrada:  { label: 'Cerrada',  badgeClass: styles.statusCerrada },
  perdida:  { label: 'Perdida',  badgeClass: styles.statusPerdida },
}

export function QuotePanel({ quotes }: QuotePanelProps) {
  const [selectedQuote, setSelectedQuote] = useState<QuoteWithContent | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleStatusChange = async (quoteId: string, newStatus: string) => {
    // LLamada a server action (cast a Any por comodidad en enum por ahora)
    await updateQuoteStatus(quoteId, newStatus as any)
  }

  const handleCopyLink = (quoteId: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://nucleoapp.vercel.app'
    const link = `${origin}/api/quotes/view?id=${quoteId}`
    navigator.clipboard.writeText(link)
    setCopiedId(quoteId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
    })
  }

  return (
    <div className={styles.wrapper}>
      <p className={styles.sectionLabel}>// gestión de propuestas formales</p>
      
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Servicio</th>
              <th>Monto</th>
              <th>Estado</th>
              <th>Vistas</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((quote) => (
              <tr key={quote.id}>
                <td className={styles.clientName}>{quote.client_name}</td>
                <td>{quote.service || '—'}</td>
                <td className={styles.amount}>
                  {quote.amount ? `$${quote.amount.toLocaleString()}` : '—'}
                </td>
                <td>
                  <span className={`${styles.badge} ${STATUS_CONFIG[quote.status]?.badgeClass}`}>
                    {STATUS_CONFIG[quote.status]?.label}
                    {quote.status === 'vista' && quote.view_count > 0 && (
                      <span className={styles.pulse} />
                    )}
                  </span>
                </td>
                <td>
                  <span className={styles.viewCount}>
                    {quote.view_count}
                  </span>
                </td>
                <td className={styles.date}>{formatDate(quote.created_at)}</td>
                <td>
                  <div className={styles.actions}>
                    <select 
                      className={styles.statusSelect}
                      value={quote.status}
                      onChange={(e) => handleStatusChange(quote.id, e.target.value)}
                    >
                      {Object.entries(STATUS_CONFIG).map(([val, conf]) => (
                        <option key={val} value={val}>{conf.label}</option>
                      ))}
                    </select>

                    <button 
                      className={styles.viewBtn}
                      onClick={() => setSelectedQuote(quote)}
                      disabled={!quote.content}
                    >
                      Ver propuesta
                    </button>

                    <button 
                      className={styles.copyBtn}
                      onClick={() => handleCopyLink(quote.id)}
                    >
                      {copiedId === quote.id ? '✓ Copiado' : '🔗 Link'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedQuote && (
        <ProposalViewer
          markdown={selectedQuote.content || ''}
          leadName={selectedQuote.client_name}
          onClose={() => setSelectedQuote(null)}
        />
      )}
    </div>
  )
}
