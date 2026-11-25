'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { type Row, errMsg } from './shared'

const CATEGORIES = ['Squishy', 'Sorpresas', 'Papelería', 'Manualidades', 'Slime', 'Ropa', 'Tarjetas regalo']

type Full = Row & { images: string[] | null; sizes: string[] | null; badge: string | null }

const slug = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50)

async function uploadPhoto(file: File) {
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '')
  const path = `${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from('productos').upload(path, file, { contentType: file.type || undefined })
  if (error) throw error
  return supabase.storage.from('productos').getPublicUrl(path).data.publicUrl
}

export default function ProductModal({ product, onClose, onSaved }: {
  product: Full | null
  onClose: () => void
  onSaved: () => void
}) {
  const editing = !!product
  const [name, setName] = useState(product?.name ?? '')
  const [price, setPrice] = useState(String(product?.price ?? ''))
  const [category, setCategory] = useState(product?.category ?? CATEGORIES[0])
  const [stock, setStock] = useState(String(product?.stock ?? 1))
  const [badge, setBadge] = useState(product?.badge ?? '')
  const [sizes, setSizes] = useState((product?.sizes ?? []).join(', '))
  const [image, setImage] = useState(product?.image ?? '')
  const [gallery, setGallery] = useState<string[]>(product?.images ?? [])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const onMain = async (file?: File) => {
    if (!file) return
    setBusy(true); setError('')
    try { setImage(await uploadPhoto(file)) }
    catch (e) { setError('No se pudo subir la foto: ' + errMsg(e)) }
    finally { setBusy(false) }
  }

  const onGallery = async (files: FileList | null) => {
    if (!files?.length) return
    setBusy(true); setError('')
    try {
      const urls: string[] = []
      for (const f of Array.from(files)) urls.push(await uploadPhoto(f))
      setGallery((g) => [...g, ...urls])
    } catch (e) { setError('No se pudo subir la foto: ' + errMsg(e)) }
    finally { setBusy(false) }
  }

  const save = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    const p = Math.round(Number(price))
    const st = Math.max(0, Math.round(Number(stock)))
    if (!name.trim()) return setError('Escribe el nombre')
    if (!Number.isFinite(p) || p < 0) return setError('Revisa el precio')
    if (!image) return setError('Sube la foto principal')

    const data = {
      name: name.trim(),
      price: p,
      category,
      stock: Number.isFinite(st) ? st : 0,
      badge: badge.trim() || null,
      sizes: sizes.split(',').map((s) => s.trim()).filter(Boolean),
      image,
      images: gallery,
    }

    setBusy(true)
    const result = editing
      ? await supabase.from('products').update(data).eq('id', product!.id)
      : await supabase.from('products').insert({ id: `${slug(name)}-${Date.now().toString(36)}`, active: true, ...data })
    setBusy(false)
    if (result.error) return setError('No se pudo guardar: ' + errMsg(result.error))
    onSaved()
    onClose()
  }

  return (
    <div className="ad-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <form className="ad-modal" onSubmit={save}>
        <h2>{editing ? 'Editar producto' : 'Agregar producto'}</h2>

        <label>Nombre<input value={name} onChange={(e) => setName(e.target.value)} /></label>
        <div className="ad-grid">
          <label>Precio ($)<input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} /></label>
          <label>Cantidad en stock<input type="number" min={0} value={stock} onChange={(e) => setStock(e.target.value)} /></label>
        </div>
        <label>Categoría
          <select className="admin-select" style={{ width: '100%' }} value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label>Etiqueta (opcional: Nuevo, Favorito...)<input value={badge} onChange={(e) => setBadge(e.target.value)} /></label>
        <label>Tallas (opcional, separadas por coma)<input value={sizes} onChange={(e) => setSizes(e.target.value)} placeholder="S, M, L" /></label>

        <div className="ad-field">
          <span>Foto principal</span>
          {image && <img className="ad-proof" src={image} alt="" />}
          <label className="ad-attach">
            {busy ? 'Subiendo…' : image ? 'Cambiar foto' : 'Subir foto'}
            <input type="file" accept="image/*" hidden disabled={busy} onChange={(e) => onMain(e.target.files?.[0])} />
          </label>
        </div>

        <div className="ad-field">
          <span>Fotos adicionales (galería)</span>
          {gallery.length > 0 && (
            <div className="ad-thumbs">
              {gallery.map((u) => (
                <div key={u}><img src={u} alt="" /><button type="button" aria-label="Quitar foto" onClick={() => setGallery(gallery.filter((x) => x !== u))}>×</button></div>
              ))}
            </div>
          )}
          <label className="ad-attach">
            Agregar fotos
            <input type="file" accept="image/*" multiple hidden disabled={busy} onChange={(e) => onGallery(e.target.files)} />
          </label>
        </div>

        {error && <p className="admin-error">{error}</p>}
        <div className="ad-buttons">
          <button type="button" className="ad-ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" className="admin-primary" disabled={busy}>{busy ? 'Espera…' : 'Guardar'}</button>
        </div>
      </form>
    </div>
  )
}