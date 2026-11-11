'use client'

import { useMemo, useState } from 'react'
import { Grid2X2, List, Search, ShoppingBag, Heart, Sparkles, X } from 'lucide-react'

type Category = 'Squishy' | 'Sorpresas' | 'Papelería' | 'Accesorios'
type Product = { name: string; price: string; category: Category; badge?: string; art: number }

const products: Product[] = [
  { name: 'Dumpling Squishy', price: '$29.900', category: 'Squishy', badge: 'Más vendido', art: 0 },
  { name: 'Osito Sorpresa', price: '$24.900', category: 'Sorpresas', badge: 'Favorito', art: 1 },
  { name: 'Set de Stickers Kawaii', price: '$14.900', category: 'Papelería', badge: 'Nuevo', art: 2 },
  { name: 'Lapicero Cute', price: '$9.900', category: 'Papelería', art: 3 },
  { name: 'Llavero Corazón', price: '$12.900', category: 'Accesorios', art: 4 },
  { name: 'Mini Libreta Kawaii', price: '$18.900', category: 'Papelería', badge: 'Nuevo', art: 5 },
  { name: 'Squishy Panda', price: '$27.900', category: 'Squishy', art: 6 },
  { name: 'Pulsera Cute', price: '$15.900', category: 'Accesorios', art: 7 },
]

const categories: { name: Category; icon: string }[] = [
  { name: 'Squishy', icon: '☁️' },
  { name: 'Sorpresas', icon: '🎁' },
  { name: 'Papelería', icon: '✏️' },
  { name: 'Accesorios', icon: '🎀' },
]

function ProductArt({ index, name }: { index: number; name: string }) {
  const col = index % 4
  const row = Math.floor(index / 4)
  return (
    <div
      className="product-art"
      role="img"
      aria-label={`Ilustración de ${name}`}
      style={{ backgroundPosition: `${(col / 3) * 100}% ${row * 100}%` }}
    />
  )
}

function ProductCard({ product, list = false }: { product: Product; list?: boolean }) {
  return (
    <article className={`product-card${list ? ' product-card-list' : ''}`}>
      <div className="product-image-wrap">
        <ProductArt index={product.art} name={product.name} />
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <button className="heart-button" aria-label={`Guardar ${product.name} en favoritos`}><Heart size={17} /></button>
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3>{product.name}</h3>
        <div className="product-bottom"><strong>{product.price}</strong><button className="add-button" aria-label={`Agregar ${product.name} al carrito`}><ShoppingBag size={16} /></button></div>
      </div>
    </article>
  )
}

export default function ProductCatalog() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category | 'Todos'>('Todos')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const visibleProducts = useMemo(() => products.filter((product) =>
    (category === 'Todos' || product.category === category) && product.name.toLocaleLowerCase('es').includes(query.trim().toLocaleLowerCase('es'))
  ), [category, query])

  return (
    <main className="store-shell">
      <header className="store-header">
        <a className="brand" href="#inicio" aria-label="Tok Tok Store, inicio"><span className="brand-door">t</span><span className="brand-name">TOK TOK<span>store</span></span><span className="brand-sparkle" aria-hidden="true">✦</span></a>
        <p className="header-note">Pequeños hallazgos, mucha alegría <span aria-hidden="true">♡</span></p>
      </header>

      <section className="hero" id="inicio" aria-label="Bienvenida a Tok Tok Store">
        <img className="hero-image" src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ilustraci%C3%B3n%20kawaii%20de%20Tok%20Tok%20Store-FXFzsfxLHooCnIgUIsD0PBjuyubgVK.png" alt="Perrito kawaii de Tok Tok Store rodeado de regalitos, con el mensaje pequeñas cosas que hacen la vida más grande" />
        <div className="hero-caption"><span className="caption-icon">✦</span><span>Un mundo cute te espera</span><span className="caption-heart">♡</span></div>
      </section>

      <section className="catalog" aria-label="Catálogo de productos">
        <div className="discovery-row"><div><span className="eyebrow"><Sparkles size={14} /> TU PRÓXIMO FAVORITO</span><h1>Descubre tus favoritos</h1><p>Pequeñas cosas que hacen la vida más grande.</p></div><span className="count-pill">{visibleProducts.length} tesoros</span></div>
        <div className="search-row">
          <label className="search-box"><Search size={19} aria-hidden="true" /><span className="sr-only">Buscar producto</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar producto..." />{query && <button className="clear-search" aria-label="Limpiar búsqueda" onClick={() => setQuery('')}><X size={16} /></button>}</label>
          <div className="view-toggle" role="group" aria-label="Vista del catálogo">
            <button className={view === 'grid' ? 'active' : ''} aria-label="Vista en cuadros" aria-pressed={view === 'grid'} onClick={() => setView('grid')}><Grid2X2 size={18} /></button>
            <button className={view === 'list' ? 'active' : ''} aria-label="Vista en filas" aria-pressed={view === 'list'} onClick={() => setView('list')}><List size={19} /></button>
          </div>
        </div>
        <nav className="category-scroll" aria-label="Filtrar por categoría">
          <button className={`category-chip all-chip${category === 'Todos' ? ' selected' : ''}`} onClick={() => setCategory('Todos')}>✨ Todos</button>
          {categories.map((item) => <button key={item.name} className={`category-chip${category === item.name ? ' selected' : ''}`} aria-pressed={category === item.name} onClick={() => setCategory(item.name)}><span aria-hidden="true">{item.icon}</span>{item.name}</button>)}
        </nav>
        {visibleProducts.length > 0 ? <div className={`product-grid${view === 'list' ? ' list-view' : ''}`}>{visibleProducts.map((product) => <ProductCard key={product.name} product={product} list={view === 'list'} />)}</div> : <div className="empty-state"><span>🔎</span><h2>No encontramos ese tesorito</h2><p>Prueba con otro nombre o elige una categoría.</p><button onClick={() => { setQuery(''); setCategory('Todos') }}>Ver todos los productos</button></div>}
      </section>
      <footer className="store-footer"><span>Hecho con cariño para ti</span><span aria-hidden="true">♡</span><span>Tok Tok Store</span></footer>
    </main>
  )
}
