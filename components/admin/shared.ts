import { supabase } from '@/lib/supabase'

export type Row = {
  id: string
  name: string
  price: number
  category: string
  image: string
  stock: number
  active: boolean
  images: string[] | null
  sizes: string[] | null
  badge: string | null
}

export type Sale = {
  id: string
  sold_at: string
  product_id: string | null
  product_name: string
  quantity: number
  amount: number
  payment_method: 'Efectivo' | 'QR'
  customer: string | null
  notes: string | null
  proof_path: string | null
}

export const money = (n: number) => `$${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })

export const localNow = () => {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

export const errMsg = (err: unknown) => (err as { message?: string })?.message ?? 'Error desconocido'

export async function uploadProof(file: File) {
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '')
  const path = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from('comprobantes').upload(path, file, { contentType: file.type || undefined })
  if (error) throw error
  return path
}