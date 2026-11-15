'use client'

import { useEffect, useMemo, useState } from 'react'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useCart } from './cart-context'
import { WHATSAPP_NUMBER } from '@/lib/store-config'

function formatPrice(amount: number) {
  return `$${amount.toLocaleString('es-CO')}`
}

function CartItemArt({ art, image, name }: { art: number; image: string; name: string }) {
  const column = art % 4
  const row = Math.floor(art / 4)
  return <div className="cart-item-art" role="img" aria-label={`Imagen de ${name}`} style={{ backgroundImage: `url(${image})`, backgroundPosition: `${(column / 3) * 100}% ${row * 100}%` }} />
}

type OrderDetails = { name: string; phone: string; address: string; delivery: string; city: string; notes: string }

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, increaseQuantity, decreaseQuantity, removeFromCart, clearCart, getCartTotal } = useCart()
  const [details, setDetails] = useState<OrderDetails>({ name: '', phone: '', address: '', delivery: 'Delivery', city: '', notes: '' })
  const total = getCartTotal()
  const waLink = useMemo(() => {
    const productLines = items.map((item) => `• ${item.name} × ${item.quantity} — ${formatPrice(item.price * item.quantity)}`)
    const fields = [
      details.name && `👤 Nombre: ${details.name.trim()}`,
      details.phone && `📱 WhatsApp: ${details.phone.trim()}`,
      details.delivery && `🚚 Entrega: ${details.delivery}`,
      details.city && `📍 Ciudad: ${details.city.trim()}`,
      details.address && `🏠 Dirección: ${details.address.trim()}`,
      details.notes && `📝 Observaciones: ${details.notes.trim()}`,
    ].filter(Boolean)
    const message = [
      'Hola 👋, quiero hacer el siguiente pedido en Tok Tok Store:',
      '',
      '🛍️ *PRODUCTOS*',
      ...productLines,
      '',
      `💰 *Total: ${formatPrice(total)}*`,
      ...(fields.length ? ['', ...fields] : []),
      '',
      'Quedo atento/a para confirmar mi pedido. 💛',
    ].join('\n')
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
  }, [details, items, total])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!open) return null
  const numberConfigured = /^\d{8,15}$/.test(WHATSAPP_NUMBER)

  return (
    <div className="cart-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="cart-dialog" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <header className="cart-header">
          <div className="cart-heading-icon"><ShoppingBag size={19} /></div>
          <div><h2 id="cart-title">Tu pedido</h2><p>{items.length ? `${items.length} producto${items.length === 1 ? '' : 's'} en tu bolsita` : 'Tu rincón de hallazgos cute'}</p></div>
          <button className="cart-close" aria-label="Cerrar carrito" onClick={onClose}><X size={20} /></button>
        </header>

        {items.length ? <>
          <div className="cart-items">
            {items.map((item) => <article className="cart-item" key={item.id}>
              <CartItemArt art={item.art} image={item.image} name={item.name} />
              <div className="cart-item-content">
                <div className="cart-item-title"><div><h3>{item.name}</h3><p>{formatPrice(item.price)} c/u</p></div><button className="remove-item" aria-label={`Eliminar ${item.name}`} onClick={() => removeFromCart(item.id)}><Trash2 size={16} /></button></div>
                <div className="cart-item-bottom"><div className="quantity-control" aria-label={`Cantidad de ${item.name}`}><button aria-label={`Disminuir ${item.name}`} onClick={() => decreaseQuantity(item.id)}><Minus size={15} /></button><span aria-live="polite">{item.quantity}</span><button aria-label={`Aumentar ${item.name}`} onClick={() => increaseQuantity(item.id)}><Plus size={15} /></button></div><strong>Subtotal: {formatPrice(item.price * item.quantity)}</strong></div>
              </div>
            </article>)}
          </div>
          <div className="order-fields">
            <label>Nombre<input value={details.name} onChange={(event) => setDetails({ ...details, name: event.target.value })} placeholder="¿Cómo te llamas?" /></label>
            <label>WhatsApp<input type="tel" value={details.phone} onChange={(event) => setDetails({ ...details, phone: event.target.value })} placeholder="Tu número de contacto" /></label>
            <div className="order-field-row"><label>Tipo de entrega<select value={details.delivery} onChange={(event) => setDetails({ ...details, delivery: event.target.value })}><option>Delivery</option><option>Recoger en tienda</option></select></label><label>Ciudad<input value={details.city} onChange={(event) => setDetails({ ...details, city: event.target.value })} placeholder="Ciudad" /></label></div>
            <label>Dirección<input value={details.address} onChange={(event) => setDetails({ ...details, address: event.target.value })} placeholder="Dirección de entrega" /></label>
            <label>Observaciones<textarea value={details.notes} onChange={(event) => setDetails({ ...details, notes: event.target.value })} placeholder="¿Algún detalle que debamos saber?" rows={2} /></label>
          </div>
          <div className="cart-summary"><span>Total de tu pedido</span><strong>{formatPrice(total)}</strong></div>
          {numberConfigured ? <a className="whatsapp-cta" href={waLink} target="_blank" rel="noreferrer" onClick={clearCart}>Hacer pedido por WhatsApp <span aria-hidden="true">↗</span></a> : <button className="whatsapp-cta" disabled>Configura el WhatsApp de la tienda</button>}
          {!numberConfigured && <p className="whatsapp-hint">Añade el número internacional de la tienda en <code>lib/store-config.ts</code> para activar el pedido.</p>}
        </> : <div className="cart-empty"><span className="empty-puppy" aria-hidden="true">🐶</span><h3>Tu carrito está vacío</h3><p>Hay un montón de hallazgos esperando por ti.</p><button onClick={onClose}>Seguir comprando</button></div>}
      </section>
    </div>
  )
}
