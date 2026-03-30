import type { TierConfig, TierID } from './types'

export const TIER_CONFIG: Record<TierID, TierConfig> = {
  parche: {
    id: 'parche',
    label: 'Parche',
    description: 'Intake básico + Pipeline manual',
    features: {
      intakeForm:    true,
      pipeline:      true,
      velocityAgent: false,
      quoteEngine:   false,
      whatsappBot:   false,
      reportes:      false,
      iaAvanzada:    false,
      multiUsuario:  false,
    },
    lockedNav: ['velocity', 'quotes', 'reportes', 'ai', 'multi'],
  },
  operador: {
    id: 'operador',
    label: 'Operador',
    description: 'Pipeline + Velocity Agent + Quote Engine',
    features: {
      intakeForm:    true,
      pipeline:      true,
      velocityAgent: true,
      quoteEngine:   true,
      whatsappBot:   false,
      reportes:      false,
      iaAvanzada:    false,
      multiUsuario:  false,
    },
    lockedNav: ['reportes', 'ai', 'multi'],
  },
  ceo: {
    id: 'ceo',
    label: 'CEO Mode',
    description: 'Acceso completo · IA avanzada · Multi-usuario',
    features: {
      intakeForm:    true,
      pipeline:      true,
      velocityAgent: true,
      quoteEngine:   true,
      whatsappBot:   true,
      reportes:      true,
      iaAvanzada:    true,
      multiUsuario:  true,
    },
    lockedNav: [],
  },
}
