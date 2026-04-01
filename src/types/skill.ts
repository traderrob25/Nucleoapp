export interface IntakeAnalysis {
  tier_recomendado: 'parche' | 'operador' | 'ceo'
  score:            number
  diagnostico:      string
  puntos_fuertes:   string[]
  puntos_debiles:   string[]
  siguiente_accion: string
}

export interface PlaybookItem {
  nombre:                 string
  prioridad:              number
  razon:                  string
  impacto_esperado:       string
  tiempo_implementacion:  string
}

export interface PlaybookMap {
  playbooks: PlaybookItem[]
  resumen:   string
}

export interface ProposalOutput {
  markdown:  string
  lead_name: string
}

export interface AccountSnapshot {
  fase: 'caos' | 'sistema' | 'ceo'
  resumen: string
  cuellos_de_botella: string[]
  quick_wins: string[]
  metrica_clave: string
  nivel_salud: number
}
