export type TierID = 'parche' | 'operador' | 'ceo'

export type FeatureKey =
  | 'intakeForm'
  | 'pipeline'
  | 'velocityAgent'
  | 'quoteEngine'
  | 'whatsappBot'
  | 'reportes'
  | 'iaAvanzada'
  | 'multiUsuario'

export interface TierConfig {
  id: TierID
  label: string
  description: string
  features: Record<FeatureKey, boolean>
  lockedNav: string[]
}

export interface Account {
  id: string
  user_id: string
  tier: TierID
  agency_name: string | null
  created_at: string
}
