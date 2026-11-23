'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import SaleModal from './sale-modal'
import { type Row, money, errMsg } from './shared'
import ProductModal from './product-modal'

export default function Inventory() {
  const [rows, setRows] = useState<Row[]>([])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Todas')
  const [error, setError] = useState('')
  const [selling, setSelling] = useState<Row | null>(null)
  const [editing, setEditing] = useState<Row | null>(null)
  const [adding, setAdding] = useState(false)

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('products')
      .select('id,name,price,category,image,stock,active,images,sizes,badge')
      .order('category')
      .order('name')
    if (error) setError('No se pudieron cargar los productos: ' + error.message)
    else setRows((data as Row[]) ?? [])
  }, [])

  useEffect(() => { load() }, [load])

  const update = async (id: string, patch: Partial<Row>) => {
    setError('')
    const previous = rows
    setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)))
    const { error } = await supabase.from('products').update(patch).eq('id', id)
    if (error) {
      setRows(previous)
      setError('No se pudo guardar el cambio: ' + errMsg(error))
    }
  }

  const categories = useMemo(() => ['Todas', ...Array.from(new Set(rows.map((r) => r.category)))], [rows])
  const filtered = useMemo(
    () => rows.filter((r) =>
      (category === 'Todas' || r.category === category) &&
      r.name.toLocaleLowerCase('es').includes(query.trim().toLocaleLowerCase('es'))),
    [rows, category, query]
  )

  const total = rows.length
  const out = rows.filter((r) => r.stock <= 0).length
  const hidden = rows.filter((r) => !r.active).length

  return (
    <>
<button className="admin-primary add-product" onClick={() => setAdding(true)}>+ Agregar producto</button>
      <section className="admin-stats">
        <div><strong>{total}</strong><span>Productos</span></div>
        <div><strong>{total - out}</strong><span>Disponibles</span></div>
        <div><strong>{out}</strong><span>Agotados</span></div>
        <div><strong>{hidden}</strong><span>Ocultos</span></div>
      </section>

      <div className="admin-filters">
        <input className="admin-search" placeholder="Buscar producto..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <select className="admin-select" value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <ul className="admin-list">
        {filtered.map((r) => {
          const isOut = r.stock <= 0
          return (
            <li key={r.id} className={`${isOut ? 'out' : ''}${r.active ? '' : ' hidden-row'}`}>
              <img src={r.image} alt="" />
              <div className="admin-info">
                <strong>{r.name}</strong>
                <span>{r.category} · {money(r.price)}</span>
              </div>
              <div className="stepper" aria-label={`Stock de ${r.name}`}>
                <button onClick={() => update(r.id, { stock: Math.max(0, r.stock - 1) })} aria-label="Restar">−</button>
                <span>{r.stock}</span>
                <button onClick={() => update(r.id, { stock: r.stock + 1 })} aria-label="Sumar">+</button>
              </div>
              <button className="hide-btn" onClick={() => setEditing(r)}>Editar</button>
              <button className="sell-btn" disabled={isOut} onClick={() => setSelling(r)}>Vender</button>
              <button className="hide-btn" onClick={() => update(r.id, { active: !r.active })}>
                {r.active ? 'Ocultar' : 'Mostrar'}
              </button>
            </li>
          )
        })}
      </ul>

      {selling && (
        <SaleModal
          product={selling}
          onClose={() => setSelling(null)}
          onSaved={(id, newStock) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, stock: newStock } : r)))}
        />
      )}
      {(adding || editing) && (
  <ProductModal
    product={editing}
    onClose={() => { setAdding(false); setEditing(null) }}
    onSaved={load}
  />
)}
    </>
  )
}