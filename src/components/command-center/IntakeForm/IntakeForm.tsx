'use client'

import { useTransition, useState, useRef } from 'react'
import { createLead, type CreateLeadResult } from '@/app/actions/leads'
import styles from './IntakeForm.module.css'

const SERVICES = ['SEO', 'Paid Media', 'Social Media', 'Branding', 'Web', 'Otro']
const BUDGETS  = ['< $5k', '$5k–$15k', '$15k–$30k', '$30k+']
const SOURCES  = ['Referido', 'Instagram', 'LinkedIn', 'Google', 'Otro']

type Estado = 'idle' | 'success' | 'error'

export function IntakeForm() {
  const [isPending, startTransition] = useTransition()
  const [estado, setEstado] = useState<Estado>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result: CreateLeadResult = await createLead(formData)

      if ('error' in result) {
        setEstado('error')
        setErrorMsg(result.error)
      } else {
        setEstado('success')
        setErrorMsg('')
        formRef.current?.reset()
        setTimeout(() => setEstado('idle'), 2000)
      }
    })
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <p className={styles.title}>Nuevo Lead</p>
        <p className={styles.subtitle}>intake · velocity · score</p>
      </div>

      <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
        {/* Nombre + Teléfono */}
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="name">
              Nombre<span className={styles.required}>*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className={styles.input}
              placeholder="Ej. Agencia Norte"
              disabled={isPending}
              autoComplete="off"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="phone">Teléfono</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className={styles.input}
              placeholder="+52 55 0000 0000"
              disabled={isPending}
            />
          </div>
        </div>

        {/* Servicio + Presupuesto */}
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="service">Servicio</label>
            <select id="service" name="service" className={styles.select} disabled={isPending}>
              <option value="">— Selecciona —</option>
              {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="budget">Presupuesto</label>
            <select id="budget" name="budget" className={styles.select} disabled={isPending}>
              <option value="">— Selecciona —</option>
              {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </div>

        {/* Fuente */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="source">Fuente</label>
          <select id="source" name="source" className={styles.select} disabled={isPending}>
            <option value="">— Selecciona —</option>
            {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Feedback */}
        {estado === 'success' && (
          <p className={styles.successMsg}>Lead registrado ✓</p>
        )}
        {estado === 'error' && (
          <p className={styles.errorMsg}>{errorMsg}</p>
        )}

        <button type="submit" className={styles.submit} disabled={isPending}>
          {isPending ? 'Registrando...' : '⚡ Registrar + Activar Velocity'}
        </button>
      </form>
    </div>
  )
}
