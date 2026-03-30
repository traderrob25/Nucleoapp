import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import styles from './Topbar.module.css'

interface TopbarProps {
  userEmail: string
  agencyName: string | null
}

export async function Topbar({ userEmail, agencyName }: TopbarProps) {
  async function handleSignOut() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <span className={styles.brand}>Núcleo Lab</span>
        {agencyName && (
          <>
            <span className={styles.divider} aria-hidden />
            <span className={styles.agency}>{agencyName}</span>
          </>
        )}
      </div>

      <div className={styles.right}>
        <span className={styles.email}>{userEmail}</span>
        <form action={handleSignOut}>
          <button type="submit" className={styles.logoutBtn}>
            Salir
          </button>
        </form>
      </div>
    </header>
  )
}
