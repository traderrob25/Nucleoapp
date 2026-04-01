'use client'

import { useState, useEffect } from 'react'
import { marked } from 'marked'
import styles from './ProposalViewer.module.css'

interface ProposalViewerProps {
  markdown: string
  leadName: string
  onClose: () => void
}

export function ProposalViewer({ markdown, leadName, onClose }: ProposalViewerProps) {
  const [copied, setCopied] = useState(false)
  const [html, setHtml] = useState('')

  useEffect(() => {
    setHtml(marked.parse(markdown) as string)
  }, [markdown])

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
          <button className={styles.copyBtn} onClick={handleCopy}>
            {copied ? '✓ Copiado' : 'Copiar propuesta'}
          </button>
        </div>
      </div>
    </div>
  )
}
