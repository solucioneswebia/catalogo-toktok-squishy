'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { type Sale, money, fmtDate, uploadProof, errMsg } from './shared'

const toLocal = (iso: string) => {
  const d = new Date(iso)
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

function SaleDetail({ sale, onClose, onChange, onDelete }: {
  sale: Sale
  onClose: () => void
  onChange: (s: Sale) => void
  onDelete: (s: Sale) => void
}) {
  const [url, setUrl] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(false)
  const [amount, setAmount] = useState(String(sale.amount))
  const [method, setMethod] = useState<'Efectivo' | 'QR'>(sale.payment_method)
  const [when, setWhen] = useState(toLocal(sale.sold_at))
  const [customer, setCustomer] = useState(sale.customer ?? '')
  const [notes, setNotes] = useState(sale.notes ?? '')
  const isPdf = sale.proof_path?.toLowerCase().endsWith('.pdf')

  useEffect(() => {
    setUrl('')
    if (!sale.proof_path) return
    supabase.storage.from('comprobantes').createSignedUrl(sale.proof_path, 600)
      .then(({ data }) => setUrl(data?.signedUrl ?? ''))
  }, [sale.proof_path])

  const saveEdit = async () => {
    setError('')
    const value = Math.round(Number(amount))
    if (!Number.isFinite(value) || value < 0) return setError('Revisa el monto')
    const patch = {
      amount: value,
      payment_method: method,
      sold_at: new Date(when).toISOString(),
      customer: customer.trim() || null,
      notes: notes.trim() || null,
    }
    setBusy(true)
    const { error } = await supabase.from('sales').update(patch).eq('id', sale.id)
    setBusy(false)
    if (error) return setError('No se pudo guardar: ' + errMsg(error))
    onChange({ ...sale, ...patch })
    setEditing(false)
  }

  const attach = async (file: File | undefined) => {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) return setError('El archivo pesa más de 5 MB')
    setBusy(true)
    setError('')
    let path: string | null = null
    try {
      path = await uploadProof(file)
      const { error } = await supabase.from('sales').update({ proof_path: path }).eq('id', sale.id)
      if (error) throw error
      if (sale.proof_path) await supabase.storage.from('comprobantes').remove([sale.proof_path])
      onChange({ ...sale, proof_path: path })
    } catch (err) {
      if (path) await supabase.storage.from('comprobantes').remove([path])
      setError('No se pudo adjuntar: ' + errMsg(err))
    } finally {
      setBusy(false)
    }
  }

  const annul = async () => {
    if (!window.confirm('¿Anular esta venta? Se borra y las unidades vuelven al stock.')) return
    setBusy(true)
    setError('')
    const { error } = await supabase.from('sales').delete().eq('id', sale.id)
    if (error) {
      setBusy(false)
      return setError('No se pudo anular: ' + errMsg(error))
    }
    if (sale.proof_path) await supabase.storage.from('comprobantes').remove([sale.proof_path])
    if (sale.product_id) {
      const { data } = await supabase.from('products').select('stock').eq('id', sale.product_id).single()
      if (data) await supabase.from('products').update({ stock: data.stock + sale.quantity }).eq('id', sale.product_id)
    }
    setBusy(false)
    onDelete(sale)
  }

  return (
    <div className="ad-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <section className="ad-modal">
        <h2>Detalle de la venta</h2>

        {editing ? (
          <>
            <p className="ad-sub">{sale.product_name} × {sale.quantity}</p>
            <label>Monto ($)<input type="number" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} /></label>
            <div className="ad-field">
              <span>Método de pago</span>
              <div className="ad-methods">
                {(['Efectivo', 'QR'] as const).map((m) => (
                  <button type="button" key={m} className={method === m ? 'active' : ''} onClick={() => setMethod(m)}>{m}</button>
                ))}
              </div>
            </div>
            <label>Fecha y hora<input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} /></label>
            <label>Cliente<input value={customer} onChange={(e) => setCustomer(e.target.value)} /></label>
            <label>Notas<input value={notes} onChange={(e) => setNotes(e.target.value)} /></label>
          </>
        ) : (
          <dl className="ad-detail">
            <dt>Producto</dt><dd>{sale.product_name}</dd>
            <dt>Cantidad</dt><dd>{sale.quantity}</dd>
            <dt>Monto</dt><dd>{money(sale.amount)}</dd>
            <dt>Método</dt><dd>{sale.payment_method}</dd>
            <dt>Fecha</dt><dd>{fmtDate(sale.sold_at)}</dd>
            <dt>Cliente</dt><dd>{sale.customer || '—'}</dd>
            <dt>Notas</dt><dd>{sale.notes || '—'}</dd>
          </dl>
        )}

        <div className="ad-field">
          <span>Comprobante de pago</span>
          {sale.proof_path ? (
            url ? (isPdf
              ? <a className="ad-link" href={url} target="_blank" rel="noreferrer">Abrir PDF</a>
              : <a href={url} target="_blank" rel="noreferrer"><img className="ad-proof" src={url} alt="Comprobante" /></a>)
              : <p className="ad-sub">Cargando…</p>
          ) : <p className="ad-sub">Sin comprobante adjunto.</p>}
          <label className="ad-attach">
            {busy ? 'Espera…' : sale.proof_path ? 'Reemplazar comprobante' : 'Adjuntar comprobante'}
            <input type="file" accept="image/*,application/pdf" disabled={busy} onChange={(e) => attach(e.target.files?.[0])} hidden />
          </label>
        </div>

        {error && <p className="admin-error">{error}</p>}
        <div className="ad-buttons">
          {editing ? (
            <>
              <button className="ad-ghost" onClick={() => setEditing(false)}>Cancelar</button>
              <button className="admin-primary" disabled={busy} onClick={saveEdit}>Guardar cambios</button>
            </>
          ) : (
            <>
              <button className="ad-danger" disabled={busy} onClick={annul}>Anular venta</button>
              <button className="ad-ghost" onClick={() => setEditing(true)}>Editar</button>
              <button className="admin-primary" onClick={onClose}>Cerrar</button>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default function Accounting() {
  const [sales, setSales] = useState<Sale[]>([])
  const [range, setRange] = useState<'hoy' | 'mes' | 'todo'>('mes')
  const [method, setMethod] = useState<'Todos' | 'Efectivo' | 'QR'>('Todos')
  const [error, setError] = useState('')
  const [detail, setDetail] = useState<Sale | null>(null)

  useEffect(() => {
    supabase.from('sales').select('*').order('sold_at', { ascending: false }).then(({ data, error }) => {
      if (error) setError('No se pudieron cargar las ventas: ' + error.message)
      else setSales((data as Sale[]) ?? [])
    })
  }, [])

  const filtered = useMemo(() => {
    const now = new Date()
    const start = range === 'hoy'
      ? new Date(now.getFullYear(), now.getMonth(), now.getDate())
      : range === 'mes' ? new Date(now.getFullYear(), now.getMonth(), 1) : null
    return sales
      .filter((s) => (!start || new Date(s.sold_at) >= start) && (method === 'Todos' || s.payment_method === method))
      .sort((a, b) => new Date(b.sold_at).getTime() - new Date(a.sold_at).getTime())
  }, [sales, range, method])

  const groups = useMemo(() => {
    const map = new Map<string, Sale[]>()
    for (const s of filtered) {
      const key = new Date(s.sold_at).toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      map.set(key, [...(map.get(key) ?? []), s])
    }
    return Array.from(map.entries())
  }, [filtered])

  const sum = (list: Sale[]) => list.reduce((t, s) => t + s.amount, 0)
  const total = sum(filtered)
  const cash = sum(filtered.filter((s) => s.payment_method === 'Efectivo'))
  const qr = sum(filtered.filter((s) => s.payment_method === 'QR'))

  return (
    <>
      <section className="admin-stats">
        <div><strong>{money(total)}</strong><span>Total vendido</span></div>
        <div><strong>{money(cash)}</strong><span>Efectivo</span></div>
        <div><strong>{money(qr)}</strong><span>QR</span></div>
        <div><strong>{filtered.length}</strong><span>Ventas</span></div>
      </section>

      <div className="admin-filters">
        <select className="admin-select" value={range} onChange={(e) => setRange(e.target.value as typeof range)}>
          <option value="hoy">Hoy</option>
          <option value="mes">Este mes</option>
          <option value="todo">Todo</option>
        </select>
        <select className="admin-select" value={method} onChange={(e) => setMethod(e.target.value as typeof method)}>
          <option>Todos</option><option>Efectivo</option><option>QR</option>
        </select>
      </div>

      {error && <p className="admin-error">{error}</p>}
      {!error && filtered.length === 0 && <p className="ad-sub">No hay ventas en este periodo.</p>}

      {groups.map(([day, list]) => (
        <section key={day} className="day-group">
          <h3 className="day-head"><span>{day}</span><span>{money(sum(list))}</span></h3>
          <ul className="admin-list">
            {list.map((s) => (
              <li key={s.id}>
                <div className="admin-info">
                  <strong>{s.product_name}{s.quantity > 1 ? ` × ${s.quantity}` : ''}</strong>
                  <span>{new Date(s.sold_at).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}{s.customer ? ` · ${s.customer}` : ''}</span>
                </div>
                <span className={`pay-tag ${s.payment_method === 'QR' ? 'qr' : ''}`}>{s.payment_method}</span>
                <strong className="sale-amount">{money(s.amount)}</strong>
                <button className="hide-btn" onClick={() => setDetail(s)}>
                  Ver detalle{s.proof_path ? ' 📎' : ''}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {detail && (
        <SaleDetail
          sale={detail}
          onClose={() => setDetail(null)}
          onChange={(updated) => {
            setDetail(updated)
            setSales((list) => list.map((s) => (s.id === updated.id ? updated : s)))
          }}
          onDelete={(gone) => {
            setSales((list) => list.filter((s) => s.id !== gone.id))
            setDetail(null)
          }}
        />
      )}
    </>
  )
}