import { updateAgencyName } from '@/app/actions/account'
import styles from './onboarding.module.css'

export default function OnboardingPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Bienvenido a NucleoApp</h1>
        <p className={styles.subtitle}>Cuéntanos sobre tu agencia para personalizar tu experiencia</p>
        
        <form action={updateAgencyName} className={styles.form}>
          <label htmlFor="agencyName" className={styles.label}>¿Cómo se llama tu agencia?</label>
          <input 
            type="text" 
            id="agencyName" 
            name="agencyName" 
            required 
            placeholder="Ej. Agencia Norte Digital"
            className={styles.input}
          />
          <button type="submit" className={styles.button}>Comenzar →</button>
        </form>
      </div>
    </div>
  )
}
