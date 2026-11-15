'use client'

import { useMemo, useState } from 'react'
import { Grid2X2, List, Search, ShoppingBag, Heart, Sparkles, X } from 'lucide-react'

type Category = 'Squishy' | 'Sorpresas' | 'Papelería' | 'Accesorios' | 'Slime'
type Product = { name: string; price: string; category: Category; badge?: string; image: string }

const products: Product[] = [
  { name: 'Dumpling Squishy Pequeño', price: '$10.000', category: 'Squishy', badge: 'Más vendido', image: '/productos/squishy-pequeno.jpg' },
  { name: 'Dumpling Squishy Grande', price: '$20.000', category: 'Squishy', badge: 'Más vendido', image: '/productos/squishy-grande.jpg' },
  { name: 'Sorpresa Panda', price: '$20.000', category: 'Sorpresas', badge: 'Favorito', image: '/productos/sorpresa-panda.jpg' },
  { name: 'Sorpresa Hello Kitty', price: '$20.000', category: 'Sorpresas', badge: 'Favorito', image: '/productos/sorpresa-hello-kitty.jpg' },
  { name: 'Sorpresa Melody', price: '$20.000', category: 'Sorpresas', badge: 'Favorito', image: '/productos/sorpresa-melody.jpg' },
  { name: 'Sorpresa Kuromi', price: '$20.000', category: 'Sorpresas', badge: 'Favorito', image: '/productos/sorpresa-kuromi1.jpg' },
  { name: 'Sorpresa Pokemon', price: '$20.000', category: 'Sorpresas', badge: 'Favorito', image: '/productos/sorpresa-pokemon.jpg' },
  { name: 'Caja Sorpresa Disney Zootopia', price: '$25.000', category: 'Sorpresas', badge: 'Favorito', image: '/productos/zootopia.jpg' },
  { name: 'Esfero de Peluche Kuromi', price: '$12.000', category: 'Papelería', image: '/productos/esfero-peluche-kuromi.jpg' },
  { name: 'Esfero de Peluche Capibara', price: '$12.000', category: 'Papelería', image: '/productos/esfero-peluche-capibara.jpg' },
  { name: 'Esfero de Peluche Fresa', price: '$12.000', category: 'Papelería', image: '/productos/esfero-peluche-fresa.jpg' },
  { name: 'kit de manualidades Pizza', price: '$12.900', category: 'Accesorios', image: '/productos/pizza.jpg' },
  { name: 'kit de manualidades Ramen Fideos', price: '$12.900', category: 'Accesorios', image: '/productos/fideos.jpg' },
  { name: 'kit de manualidades Arroz con Tortilla de Huevo y Curry', price: '$12.900', category: 'Accesorios', image: '/productos/curry.jpg' },
  { name: 'Slime esponjoso Kuromi Rosa', price: '$27.900', category: 'Slime', image: '/productos/slime-kuromi.jpg' },
  { name: 'Slime esponjoso Kuromi Morado', price: '$27.900', category: 'Slime', image: '/productos/slime-kuromi-morado.jpg' },
  { name: 'Slime antiestrés Verde Cristal', price: '$27.900', category: 'Slime', image: '/productos/slime-cristal-verde.jpg' },
  { name: 'Slime esponjoso verde/morado', price: '$27.900', category: 'Slime', image: '/productos/slime-verde-morado.jpg' },
  { name: 'Slime esponjoso amarillo/rojo', price: '$27.900', category: 'Slime', image: '/productos/slime-amarillo-rojo.jpg' },
  { name: 'Slime Hello Kitty amarillo', price: '$27.900', category: 'Slime', image: '/productos/slime-amarillo.jpg' },
  { name: 'Bote Slime Hello Kitty azul/blanco', price: '$27.900', category: 'Slime', image: '/productos/bote-slime-hello-kitty.jpg' },
  { name: 'Bote Slime Hello Kitty rojo/blanco', price: '$27.900', category: 'Slime', image: '/productos/bote-slime-hello-kitty-rojo.jpg' },
  { name: 'Slime Melody Rosa', price: '$27.900', category: 'Slime', image: '/productos/slime-melody.jpg' },
  { name: 'Slime esponjoso blanco/morado', price: '$27.900', category: 'Slime', image: '/productos/slime-esponjoso-blanco-morado.jpg' },
  { name: 'Esfero Patita Gato Rosa', price: '$12.000', category: 'Papelería', image: '/productos/esfero-rosa.jpg' },
  { name: 'Stikes Panda', price: '$12.000', category: 'Papelería', image: '/productos/stikes-panda.jpg' },
  { name: 'Stikes Capibara', price: '$12.000', category: 'Papelería', image: '/productos/stikes-capibara.jpg' },
  { name: 'Stikes Kuromi', price: '$12.000', category: 'Papelería', image: '/productos/stikes-kuromi.jpg' },
  { name: 'Cuaderno Stikes', price: '$17.000', category: 'Papelería', image: '/productos/cuaderno-stikes.jpg' },
  { name: 'Esfero Patita Gato Amarillo', price: '$12.000', category: 'Papelería', image: '/productos/esfero-amarillo.jpg' },
  { name: 'Cajita Borradores', price: '$12.000', category: 'Papelería', image: '/productos/borradores.jpg' },
  { name: 'Kit Borradores Capibara', price: '$12.000', category: 'Papelería', image: '/productos/kit-borrador-capibara.jpg' },
  { name: 'Kit Resaltadores Capibara', price: '$17.000', category: 'Papelería', image: '/productos/kit-resaltadores.jpg' },
  { name: 'Borrador Botella Amarillo', price: '$12.000', category: 'Papelería', image: '/productos/botella-amarillo.jpg' },
  { name: 'Borrador Botella Naranja', price: '$12.000', category: 'Papelería', image: '/productos/botella-naranja.jpg' },
  { name: 'Borrador Botella Rojo', price: '$12.000', category: 'Papelería', image: '/productos/botella-rojo.jpg' },
  { name: 'Borrador Botella Verde', price: '$12.000', category: 'Papelería', image: '/productos/botella-verde.jpg' },
  { name: 'Tajalapiz Capibara', price: '$8.000', category: 'Papelería', image: '/productos/tajalapiz-capibara.jpg' },
  { name: 'Calculadora Capibara', price: '$15.000', category: 'Papelería', image: '/productos/calculadora.jpg' },
]

const categories: { name: Category; icon: string }[] = [
  { name: 'Squishy', icon: '☁️' },
  { name: 'Sorpresas', icon: '🎁' },
  { name: 'Papelería', icon: '✏️' },
  { name: 'Accesorios', icon: '🎀' },
  { name: 'Slime', icon: '🧽' },
]

function ProductArt({ image, name }: { image: string; name: string }) {
  return <img className="product-art" src={image} alt={name} loading="lazy" />
}

function ProductCard({ product, list = false }: { product: Product; list?: boolean }) {
  return (
    <article className={`product-card${list ? ' product-card-list' : ''}`}>
      <div className="product-image-wrap">
        <ProductArt image={product.image} name={product.name} />
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <button className="heart-button" aria-label={`Guardar ${product.name} en favoritos`}><Heart size={17} /></button>
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3>{product.name}</h3>
        <div className="product-bottom"><strong>{product.price}</strong><button className="add-button" aria-label={`Agregar ${product.name} al carrito`}><ShoppingBag size={16} /><span>Agregar</span></button></div>
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
