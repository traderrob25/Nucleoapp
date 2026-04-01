export interface Quote {
  id: string
  account_id: string
  lead_id: string | null
  client_name: string
  service: string | null
  amount: number | null
  status: 'borrador' | 'enviada' | 'vista' | 'revision' | 'cerrada' | 'perdida'
  view_count: number
  created_at: string
}

export interface QuoteWithContent extends Quote {
  content: string | null
}
