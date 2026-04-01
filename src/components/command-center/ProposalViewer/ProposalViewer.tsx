'use client'

import { useState, useEffect } from 'react'
import { marked } from 'marked'
import styles from './ProposalViewer.module.css'
import { createQuote } from '@/app/actions/quotes'

interface ProposalViewerProps {
  markdown: string
  leadName: string
  leadId?: string
  onClose: () => void
}

export function ProposalViewer({ markdown, leadName, leadId, onClose }: ProposalViewerProps) {
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [html, setHtml] = useState('')

  useEffect(() => {
    setHtml(marked.parse(markdown) as string)
  }, [markdown])

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSaveAsQuote = async () => {
    if (!leadId) return

    const amountStr = prompt(`Ingrese el monto para la propuesta de ${leadName}:`, '0')
    if (amountStr === null) return // Cancelado

    const amount = parseFloat(amountStr.replace(/[^0-9.]/g, ''))
    
    // Asumimos un servicio genérico o lo intentamos extraer del h1 si quisiéramos, 
    // pero por ahora lo dejamos como null o el leadName
    const res = await createQuote(leadId, leadName, null, amount, markdown)

    if (res.success) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } else {
      alert('Error guardando quote: ' + res.error)
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <h2 className={styles.title}>Propuesta — {leadName}</h2>
          <button className={styles.closeHeaderBtn} onClick={onClose}>✕</button>
        </div>
        
        <div 
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        
        <div className={styles.footer}>
          <button className={styles.closeBtn} onClick={onClose}>Cerrar</button>
          
          <div className={styles.actionsGrp}>
            {leadId && (
              <button className={styles.saveBtn} onClick={handleSaveAsQuote}>
                {saved ? '✓ Quote guardado' : '💾 Guardar como Quote'}
              </button>
            )}
            
            <button className={styles.copyBtn} onClick={handleCopy}>
              {copied ? '✓ Copiado' : 'Copiar propuesta'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
