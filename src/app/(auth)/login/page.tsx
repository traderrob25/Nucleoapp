'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import styles from './login.module.css'

type Estado = 'idle' | 'loading' | 'sent' | 'error'

export default function LoginPage() {
  const [email, setEmail]   = useState('')
  const [estado, setEstado] = useState<Estado>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setEstado('loading')
    setErrorMsg('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_APP_URL + '/auth/confirm',
      },
    })

    if (error) {
      setErrorMsg(error.message)
      setEstado('error')
    } else {
      setEstado('sent')
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.brand}>Núcleo Lab</span>
        <h1 className={styles.title}>Bienvenido a NucleoApp</h1>
        <p className={styles.subtitle}>
          Ingresa tu correo y te enviamos un enlace mágico para entrar.
        </p>
      </div>

      {estado === 'sent' ? (
        <div className={styles.sentBox}>
          <p className={styles.sentTitle}>Revisa tu correo</p>
          <p className={styles.sentText}>
            Enviamos un enlace a <strong>{email}</strong>. Haz clic en él
            para acceder al dashboard.
          </p>
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div>
            <label className={styles.label} htmlFor="email">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              className={styles.input}
              placeholder="tu@agencia.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={estado === 'loading'}
              required
              autoFocus
            />
          </div>

          {estado === 'error' && (
            <p className={styles.errorBox}>{errorMsg}</p>
          )}

          <button
            type="submit"
            className={styles.button}
            disabled={estado === 'loading'}
          >
            {estado === 'loading' ? 'Enviando...' : 'Enviar Magic Link'}
          </button>
        </form>
      )}
    </div>
  )
}
