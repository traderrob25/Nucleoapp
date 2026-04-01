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

export interface RoadmapPeriod {
  periodo: string
  enfoque: string
  acciones: string[]
  resultado_esperado: string
}

export interface Roadmap {
  titulo: string
  semanas: RoadmapPeriod[]
  hito_30_dias: string
  hito_60_dias: string
  hito_90_dias: string
  playbooks_activos: string[]
}
