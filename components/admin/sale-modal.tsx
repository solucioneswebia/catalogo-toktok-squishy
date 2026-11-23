'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { type Row, uploadProof, localNow, errMsg } from './shared'

export default function SaleModal({ product, onClose, onSaved }: {
  product: Row
  onClose: () => void
  onSaved: (id: string, newStock: number) => void
}) {
  const [qty, setQty] = useState(1)
  const [amount, setAmount] = useState(String(product.price))
  const [method, setMethod] = useState<'Efectivo' | 'QR'>('Efectivo')
  const [customer, setCustomer] = useState('')
  const [notes, setNotes] = useState('')
  const [when, setWhen] = useState(localNow())
  const [file, setFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const changeQty = (n: number) => {
    const q = Math.min(Math.max(1, n || 1), Math.max(1, product.stock))
    setQty(q)
    setAmount(String(product.price * q))
  }

  const save = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    const value = Math.round(Number(amount))
    if (!Number.isFinite(value) || value < 0) return setError('Revisa el monto')
    if (file && file.size > 5 * 1024 * 1024) return setError('El comprobante pesa más de 5 MB')

    setSaving(true)
    let proof: string | null = null
    let inserted = false
    try {
      if (file) proof = await uploadProof(file)
      const { error: e1 } = await supabase.from('sales').insert({
        sold_at: new Date(when).toISOString(),
        product_id: product.id,
        product_name: product.name,
        quantity: qty,
        amount: value,
        payment_method: method,
        customer: customer.trim() || null,
        notes: notes.trim() || null,
        proof_path: proof,
      })
      if (e1) throw e1
      inserted = true
      const newStock = product.stock - qty
      const { error: e2 } = await supabase.from('products').update({ stock: newStock }).eq('id', product.id)
      if (e2) {
        window.alert('La venta se guardó, pero no se pudo descontar el stock. Ajústalo a mano en el inventario.')
        onClose()
        return
      }
      onSaved(product.id, newStock)
      onClose()
    } catch (err) {
      if (proof && !inserted) await supabase.storage.from('comprobantes').remove([proof])
      setError('No se pudo guardar: ' + errMsg(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="ad-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <form className="ad-modal" onSubmit={save}>
        <h2>Registrar venta</h2>
        <p className="ad-sub">{product.name} · stock actual: {product.stock}</p>

        <div className="ad-grid">
          <label>Cantidad
            <input type="number" min={1} max={product.stock} value={qty} onChange={(e) => changeQty(Number(e.target.value))} />
          </label>
          <label>Monto cobrado ($)
            <input type="number" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} />
          </label>
        </div>

        <div className="ad-field">
          <span>Método de pago</span>
          <div className="ad-methods">
            {(['Efectivo', 'QR'] as const).map((m) => (
              <button type="button" key={m} className={method === m ? 'active' : ''} onClick={() => setMethod(m)}>{m}</button>
            ))}
          </div>
        </div>

        <label>Cliente (opcional)
          <input value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="Nombre del cliente" />
        </label>
        <label>Fecha y hora
          <input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} required />
        </label>
        <label>Comprobante de pago (opcional)
          <input type="file" accept="image/*,application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </label>
        <label>Notas (opcional)
          <input value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>

        {error && <p className="admin-error">{error}</p>}
        <div className="ad-buttons">
          <button type="button" className="ad-ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" className="admin-primary" disabled={saving}>{saving ? 'Guardando…' : 'Guardar venta'}</button>
        </div>
      </form>
    </div>
  )
}