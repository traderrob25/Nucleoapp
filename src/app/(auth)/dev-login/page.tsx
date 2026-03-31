'use client'

// ⚠️ RUTA TEMPORAL SOLO PARA DESARROLLO — eliminar antes de producción real
// Propósito: bypass del rate limit de Magic Link durante testing

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import styles from '../login/login.module.css'

type Estado = 'idle' | 'loading' | 'error'

export default function DevLoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [estado, setEstado]     = useState<Estado>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return

    setEstado('loading')
    setErrorMsg('')

    const supabase = createClient()

    // Intenta login; si no existe el usuario, lo crea
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    })

    if (!signInError) {
      router.push('/dashboard/overview')
      return
    }

    // Usuario no existe → crear cuenta
    if (signInError.message.includes('Invalid login credentials')) {
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
      })

      if (!signUpError) {
        router.push('/dashboard/overview')
        return
      }

      setErrorMsg(signUpError.message)
    } else {
      setErrorMsg(signInError.message)
    }

    setEstado('error')
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.brand}>Núcleo Lab</span>
        <h1 className={styles.title}>Dev Login</h1>
        <p className={styles.subtitle}>
          Acceso temporal con contraseña · Solo para testing
        </p>
      </div>

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

        <div>
          <label className={styles.label} htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            className={styles.input}
            placeholder="mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={estado === 'loading'}
            required
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
          {estado === 'loading' ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
