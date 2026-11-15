'use client'

import { useMemo, useState } from 'react'
import { Grid2X2, List, Search, ShoppingBag, Heart, Sparkles, X } from 'lucide-react'
import { useCart, type Product } from './cart-context'
import CartDrawer from './cart-drawer'

type Category = 'Squishy' | 'Sorpresas' | 'Papelería' | 'Accesorios' | 'Slime'

const products: Product[] = [
  { id: 'dumpling-squishy-pequeno', name: 'Dumpling Squishy Pequeño', price: 10000, image: '/productos/squishy-pequeno.jpg', category: 'Squishy', badge: 'Más vendido' },
  { id: 'dumpling-squishy-grande', name: 'Dumpling Squishy Grande', price: 20000, image: '/productos/squishy-grande.jpg', category: 'Squishy', badge: 'Más vendido' },
  { id: 'sorpresa-panda', name: 'Sorpresa Panda', price: 20000, image: '/productos/sorpresa-panda.jpg', category: 'Sorpresas', badge: 'Favorito' },
  { id: 'sorpresa-hello-kitty', name: 'Sorpresa Hello Kitty', price: 20000, image: '/productos/sorpresa-hello-kitty.jpg', category: 'Sorpresas', badge: 'Favorito' },
  { id: 'sorpresa-melody', name: 'Sorpresa Melody', price: 20000, image: '/productos/sorpresa-melody.jpg', category: 'Sorpresas', badge: 'Favorito' },
  { id: 'sorpresa-kuromi', name: 'Sorpresa Kuromi', price: 20000, image: '/productos/sorpresa-kuromi1.jpg', category: 'Sorpresas', badge: 'Favorito' },
  { id: 'sorpresa-pokemon', name: 'Sorpresa Pokemon', price: 20000, image: '/productos/sorpresa-pokemon.jpg', category: 'Sorpresas', badge: 'Favorito' },
  { id: 'caja-sorpresa-zootopia', name: 'Caja Sorpresa Disney Zootopia', price: 25000, image: '/productos/zootopia.jpg', category: 'Sorpresas', badge: 'Favorito' },
  { id: 'esfero-peluche-kuromi', name: 'Esfero de Peluche Kuromi', price: 12000, image: '/productos/esfero-peluche-kuromi.jpg', category: 'Papelería' },
  { id: 'esfero-peluche-capibara', name: 'Esfero de Peluche Capibara', price: 12000, image: '/productos/esfero-peluche-capibara.jpg', category: 'Papelería' },
  { id: 'esfero-peluche-fresa', name: 'Esfero de Peluche Fresa', price: 12000, image: '/productos/esfero-peluche-fresa.jpg', category: 'Papelería' },
  { id: 'kit-pizza', name: 'kit de manualidades Pizza', price: 12900, image: '/productos/pizza.jpg', category: 'Accesorios' },
  { id: 'kit-ramen', name: 'kit de manualidades Ramen Fideos', price: 12900, image: '/productos/fideos.jpg', category: 'Accesorios' },
  { id: 'kit-arroz-curry', name: 'kit de manualidades Arroz con Tortilla de Huevo y Curry', price: 12900, image: '/productos/curry.jpg', category: 'Accesorios' },
  { id: 'slime-kuromi-rosa', name: 'Slime esponjoso Kuromi Rosa', price: 27900, image: '/productos/slime-kuromi.jpg', category: 'Slime' },
  { id: 'slime-kuromi-morado', name: 'Slime esponjoso Kuromi Morado', price: 27900, image: '/productos/slime-kuromi-morado.jpg', category: 'Slime' },
  { id: 'slime-cristal-verde', name: 'Slime antiestrés Verde Cristal', price: 27900, image: '/productos/slime-cristal-verde.jpg', category: 'Slime' },
  { id: 'slime-verde-morado', name: 'Slime esponjoso verde/morado', price: 27900, image: '/productos/slime-verde-morado.jpg', category: 'Slime' },
  { id: 'slime-amarillo-rojo', name: 'Slime esponjoso amarillo/rojo', price: 27900, image: '/productos/slime-amarillo-rojo.jpg', category: 'Slime' },
  { id: 'slime-hello-kitty-amarillo', name: 'Slime Hello Kitty amarillo', price: 27900, image: '/productos/slime-amarillo.jpg', category: 'Slime' },
  { id: 'bote-slime-hk-azul', name: 'Bote Slime Hello Kitty azul/blanco', price: 27900, image: '/productos/bote-slime-hello-kitty.jpg', category: 'Slime' },
  { id: 'bote-slime-hk-rojo', name: 'Bote Slime Hello Kitty rojo/blanco', price: 27900, image: '/productos/bote-slime-hello-kitty-rojo.jpg', category: 'Slime' },
  { id: 'slime-melody-rosa', name: 'Slime Melody Rosa', price: 27900, image: '/productos/slime-melody.jpg', category: 'Slime' },
  { id: 'slime-blanco-morado', name: 'Slime esponjoso blanco/morado', price: 27900, image: '/productos/slime-esponjoso-blanco-morado.jpg', category: 'Slime' },
  { id: 'esfero-patita-rosa', name: 'Esfero Patita Gato Rosa', price: 12000, image: '/productos/esfero-rosa.jpg', category: 'Papelería' },
  { id: 'stikes-panda', name: 'Stikes Panda', price: 12000, image: '/productos/stikes-panda.jpg', category: 'Papelería' },
  { id: 'stikes-capibara', name: 'Stikes Capibara', price: 12000, image: '/productos/stikes-capibara.jpg', category: 'Papelería' },
  { id: 'stikes-kuromi', name: 'Stikes Kuromi', price: 12000, image: '/productos/stikes-kuromi.jpg', category: 'Papelería' },
  { id: 'cuaderno-stikes', name: 'Cuaderno Stikes', price: 17000, image: '/productos/cuaderno-stikes.jpg', category: 'Papelería' },
  { id: 'esfero-patita-amarillo', name: 'Esfero Patita Gato Amarillo', price: 12000, image: '/productos/esfero-amarillo.jpg', category: 'Papelería' },
  { id: 'cajita-borradores', name: 'Cajita Borradores', price: 12000, image: '/productos/borradores.jpg', category: 'Papelería' },
  { id: 'kit-borradores-capibara', name: 'Kit Borradores Capibara', price: 12000, image: '/productos/kit-borrador-capibara.jpg', category: 'Papelería' },
  { id: 'kit-resaltadores-capibara', name: 'Kit Resaltadores Capibara', price: 17000, image: '/productos/kit-resaltadores.jpg', category: 'Papelería' },
  { id: 'borrador-botella-amarillo', name: 'Borrador Botella Amarillo', price: 12000, image: '/productos/botella-amarillo.jpg', category: 'Papelería' },
  { id: 'borrador-botella-naranja', name: 'Borrador Botella Naranja', price: 12000, image: '/productos/botella-naranja.jpg', category: 'Papelería' },
  { id: 'borrador-botella-rojo', name: 'Borrador Botella Rojo', price: 12000, image: '/productos/botella-rojo.jpg', category: 'Papelería' },
  { id: 'borrador-botella-verde', name: 'Borrador Botella Verde', price: 12000, image: '/productos/botella-verde.jpg', category: 'Papelería' },
  { id: 'tajalapiz-capibara', name: 'Tajalapiz Capibara', price: 8000, image: '/productos/tajalapiz-capibara.jpg', category: 'Papelería' },
  { id: 'calculadora-capibara', name: 'Calculadora Capibara', price: 15000, image: '/productos/calculadora.jpg', category: 'Papelería' },
]

const categories: { name: Category; icon: string }[] = [
  { name: 'Squishy', icon: '☁️' },
  { name: 'Sorpresas', icon: '🎁' },
  { name: 'Papelería', icon: '✏️' },
  { name: 'Accesorios', icon: '🎀' },
  { name: 'Slime', icon: '🧽' },
]

function ProductArt({ image, name, onAdd }: { image: string; name: string; onAdd: () => void }) {
  return (
    <button type="button" className="product-art-btn" aria-label={`Agregar ${name} al carrito`} onClick={onAdd}>
      <img className="product-art" src={image} alt={name} loading="lazy" />
    </button>
  )
}

function formatPrice(amount: number) {
  return `$${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
}

function ProductCard({ product, list = false, onAdd }: { product: Product; list?: boolean; onAdd: (product: Product) => void }) {
  return (
    <article className={`product-card${list ? ' product-card-list' : ''}`}>
      <div className="product-image-wrap">
        <ProductArt image={product.image} name={product.name} onAdd={() => onAdd(product)} />
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <button className="heart-button" aria-label={`Guardar ${product.name} en favoritos`}><Heart size={17} /></button>
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3>{product.name}</h3>
        <div className="product-bottom"><strong>{formatPrice(product.price)}</strong><button className="add-button" aria-label={`Agregar ${product.name} al carrito`} onClick={() => onAdd(product)}><ShoppingBag size={16} /><span>Agregar</span></button></div>
      </div>
    </article>
  )
}

export default function ProductCatalog() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category | 'Todos'>('Todos')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState('')
  const { addToCart, getCartItemsCount } = useCart()
  const cartCount = getCartItemsCount()
  const addProduct = (product: Product) => {
    addToCart(product)
    setToast(`¡${product.name} agregado al carrito!`)
    window.setTimeout(() => setToast(''), 2200)
  }
  const visibleProducts = useMemo(() => products.filter((product) =>
    (category === 'Todos' || product.category === category) && product.name.toLocaleLowerCase('es').includes(query.trim().toLocaleLowerCase('es'))
  ), [category, query])

  return (
    <main className="store-shell">
      <header className="store-header">
        <a className="brand" href="#inicio" aria-label="Tok Tok Store, inicio"><img className="brand-logo" src="/logo-sin-fondo.png" alt="Tok Tok Store" /></a>
        <button className="header-cart" aria-label={`Abrir carrito, ${cartCount} productos`} onClick={() => setCartOpen(true)}><ShoppingBag size={19} /><span>Mi carrito</span>{cartCount > 0 && <span className="cart-count">{cartCount}</span>}</button>
      </header>

      <section className="hero" id="inicio" aria-label="Bienvenida a Tok Tok Store">
        <img className="hero-image" src="/Tok-Tok-Pet-Store-Template.png" alt="Describe aquí tu nueva imagen" />
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
        {visibleProducts.length > 0 ? <div className={`product-grid${view === 'list' ? ' list-view' : ''}`}>{visibleProducts.map((product) => <ProductCard key={product.id} product={product} list={view === 'list'} onAdd={addProduct} />)}</div> : <div className="empty-state"><span>🔎</span><h2>No encontramos ese tesorito</h2><p>Prueba con otro nombre o elige una categoría.</p><button onClick={() => { setQuery(''); setCategory('Todos') }}>Ver todos los productos</button></div>}
      </section>
      <footer className="store-footer"><span>Hecho con cariño para ti</span><span aria-hidden="true">♡</span><span>Tok Tok Store</span></footer>
      {toast && <div className="cart-toast" role="status">{toast} <span aria-hidden="true">🛒</span></div>}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </main>
  )
}