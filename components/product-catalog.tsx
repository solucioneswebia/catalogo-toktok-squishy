'use client'

import { useEffect, useMemo, useState } from 'react'
import { Grid2X2, List, Search, ShoppingBag, Heart, Sparkles, X } from 'lucide-react'
import { useCart, type Product } from './cart-context'
import CartDrawer from './cart-drawer'

type Category = 'Squishy' | 'Sorpresas' | 'Papelería' | 'Manualidades' | 'Slime' | 'Ropa'

const products: Product[] = [
  { id: 'dumpling-squishy-pequeno', name: 'Dumpling Squishy Pequeño', price: 10000, image: '/productos/squishy-pequeno.jpg', category: 'Squishy', badge: 'Más vendido' },
  { id: 'dumpling-squishy-grande', name: 'Dumpling Squishy Grande', price: 20000, image: '/productos/squishy-grande.jpg', category: 'Squishy', badge: 'Más vendido' },
  { id: 'squishy-comida', name: 'Squishy Galletas Estrella', price: 20000, image: '/productos/squishy.jpg', category: 'Squishy'},
  { id: 'sorpresa-panda', name: 'Sorpresa Panda', price: 20000, image: '/productos/sorpresa-panda.jpg', category: 'Sorpresas', badge: 'Favorito' },
  { id: 'sorpresa-hello-kitty', name: 'Sorpresa Hello Kitty', price: 20000, image: '/productos/sorpresa-hello-kitty.jpg', category: 'Sorpresas', badge: 'Favorito' },
  { id: 'sorpresa-melody', name: 'Sorpresa Melody', price: 20000, image: '/productos/sorpresa-melody.jpg', category: 'Sorpresas', badge: 'Favorito' },
  { id: 'sorpresa-kuromi', name: 'Sorpresa Kuromi', price: 20000, image: '/productos/sorpresa-kuromi1.jpg', category: 'Sorpresas', badge: 'Favorito' },
  { id: 'sorpresa-pokemon', name: 'Sorpresa Pokemon', price: 20000, image: '/productos/sorpresa-pokemon.jpg', category: 'Sorpresas', badge: 'Favorito' },
  { id: 'sorpresa-pokemon2', name: 'Sorpresa Pokemon Pikachu', price: 20000, image: '/productos/sorpresa-pokemon2.jpg', category: 'Sorpresas', badge: 'Favorito' },
  { id: 'caja-sorpresa-zootopia', name: 'Caja Sorpresa Disney Zootopia', price: 25000, image: '/productos/zootopia.jpg', category: 'Sorpresas', badge: 'Favorito' },
  { id: 'esfero-peluche-kuromi', name: 'Esfero de Peluche Kuromi', price: 12000, image: '/productos/esfero-peluche-kuromi.jpg', category: 'Papelería' },
  { id: 'esfero-peluche-capibara', name: 'Esfero de Peluche Capibara', price: 12000, image: '/productos/esfero-peluche-capibara.jpg', category: 'Papelería' },
  { id: 'esfero-peluche-fresa', name: 'Esfero de Peluche Fresa', price: 12000, image: '/productos/esfero-peluche-fresa.jpg', category: 'Papelería' },
  { id: 'kit-esfero', name: 'Kit de Esferos Bet Friends', price: 12000, image: '/productos/kit-esferos.jpg', category: 'Papelería' },
  { id: 'kit-pizza', name: 'kit de manualidades Pizza', price: 20000, image: '/productos/pizza.jpg', category: 'Manualidades' },
  { id: 'kit-ramen', name: 'kit de manualidades Ramen Fideos', price: 20000, image: '/productos/fideos.jpg', category: 'Manualidades' },
  { id: 'kit-arroz-curry', name: 'kit de manualidades Arroz con Tortilla de Huevo y Curry', price: 20000, image: '/productos/curry.jpg', category: 'Manualidades' },
  { id: 'slime-kuromi-rosa', name: 'Slime esponjoso Kuromi Rosa', price: 20000, image: '/productos/slime-kuromi.jpg', category: 'Slime' },
  { id: 'slime-kuromi-morado', name: 'Slime esponjoso Kuromi Morado', price: 20000, image: '/productos/slime-kuromi-morado.jpg', category: 'Slime' },
  { id: 'slime-cristal-verde', name: 'Slime antiestrés Verde Cristal', price: 20000, image: '/productos/slime-cristal-verde.jpg', category: 'Slime' },
  { id: 'slime-cristal-azul', name: 'Slime antiestrés Azul Cristal', price: 20000, image: '/productos/slime-cristal-azul.jpg', category: 'Slime' },
  { id: 'slime-cristal-morado', name: 'Slime antiestrés Galaxia', price: 20000, image: '/productos/slime-cristal-morado.jpg', category: 'Slime' },
  { id: 'slime-cristal-rosado', name: 'Slime antiestrés Rosa Cristal', price: 20000, image: '/productos/slime-cristal-rosa.jpg', category: 'Slime' },
  { id: 'slime-cristal-verde-azul', name: 'Slime Esponjoso Verde/Azul', price: 20000, image: '/productos/slime-cristal-verde-azul.jpg', category: 'Slime' },
  { id: 'slime-verde-morado', name: 'Slime esponjoso verde/morado', price: 20000, image: '/productos/slime-verde-morado.jpg', category: 'Slime' },
  { id: 'slime-verde-rosa', name: 'Slime esponjoso verde/rosa', price: 20000, image: '/productos/slime-verde-rosa.jpg', category: 'Slime' },
  { id: 'slime-amarillo-rojo', name: 'Slime esponjoso amarillo/rojo', price: 20000, image: '/productos/slime-amarillo-rojo.jpg', category: 'Slime' },
  { id: 'slime-hello-kitty-amarillo', name: 'Slime Hello Kitty amarillo', price: 20000, image: '/productos/slime-amarillo.jpg', category: 'Slime' },
  { id: 'bote-slime-hk-azul', name: 'Bote Slime Hello Kitty azul/blanco', price: 22000, image: '/productos/bote-slime-hello-kitty.jpg', category: 'Slime' },
  { id: 'bote-slime-hk-rojo', name: 'Bote Slime Hello Kitty rojo/blanco', price: 22000, image: '/productos/bote-slime-hello-kitty-rojo.jpg', category: 'Slime' },
  { id: 'slime-capibara', name: 'Slime Capibara', price: 20000, image: '/productos/slime-capibara.jpg', category: 'Slime' },
  { id: 'slime-dinosaurio-amarillo', name: 'Slime Dinosaurio Amarillo', price: 20000, image: '/productos/slime-dinosaurio-amarillo.jpg', category: 'Slime' },
  { id: 'slime-dinosaurio-rojo', name: 'Slime Dinosaurio Rojo', price: 20000, image: '/productos/slime-dinosaurio-rojo.jpg', category: 'Slime' },
  { id: 'slime-melody-rosa', name: 'Slime Melody Rosa', price: 20000, image: '/productos/slime-melody.jpg', category: 'Slime' },
  { id: 'slime-cinnamoroll', name: 'Slime Cinnamoroll', price: 20000, image: '/productos/slime-cinnamoroll.jpg', category: 'Slime' },
  { id: 'slime-hada-rosa', name: 'Slime Hada Rosa', price: 20000, image: '/productos/slime-hada-rosa.jpg', category: 'Slime' },
  { id: 'slime-hada-morada', name: 'Slime Hada Morada', price: 20000, image: '/productos/slime-hada-morada.jpg', category: 'Slime' },
  { id: 'slime-botella-roja', name: 'Slime Botella Roja', price: 20000, image: '/productos/slime-botella-roja.jpg', category: 'Slime' },
  { id: 'slime-botella-verde', name: 'Slime Botella Verde', price: 20000, image: '/productos/slime-botella-verde.jpg', category: 'Slime' },
  { id: 'slime-botella-azul', name: 'Slime Botella Azul', price: 20000, image: '/productos/slime-botella-azul.jpg', category: 'Slime' },
  { id: 'slime-blanco-morado', name: 'Slime esponjoso blanco/morado', price: 20000, image: '/productos/slime-morado-blanco.jpg', category: 'Slime' },
  { id: 'esfero-patita-rosa', name: 'Esfero Patita Gato Rosa', price: 6000, image: '/productos/esfero-rosa.jpg', category: 'Papelería' },
  { id: 'stikes-panda', name: 'Stikers Panda', price: 12000, image: '/productos/stiker-panda.jpg', category: 'Papelería' },
  { id: 'stikes-capibara', name: 'Stikers Capibara', price: 12000, image: '/productos/stiker-capibara.jpg', category: 'Papelería' },
  { id: 'stikes-kuromi', name: 'Stikers Ponny', price: 12000, image: '/productos/stiker-ponny.jpg', category: 'Papelería' },
  { id: 'stiker-flor-rosa', name: 'Stikers Flor Rosa', price: 12000, image: '/productos/stiker-flor-rosa.jpg', category: 'Papelería' },
  { id: 'stiker-flor-azul', name: 'Stikers Flor Azul', price: 12000, image: '/productos/stiker-flor-azul.jpg', category: 'Papelería' },
  { id: 'cuaderno-stikes', name: 'Cuaderno Stikers', price: 17000, image: '/productos/cuaderno.jpg', category: 'Papelería' },
  { id: 'esfero-patita-amarillo', name: 'Esfero Patita Gato Amarillo', price: 6000, image: '/productos/esfero-amarillo.jpg', category: 'Papelería' },
  { id: 'cajita-borradores', name: 'Cajita Borradores Sirenita', price: 12000, image: '/productos/borradores.jpg', category: 'Papelería' },
  { id: 'cajita-borradores2', name: 'Cajita Borradores Alien', price: 12000, image: '/productos/borradores2.jpg', category: 'Papelería' },
  { id: 'kit-borradores-capibara-naranja', name: 'Kit Borradores Capibara Naranja', price: 12000, image: '/productos/kit-borrador-capibara.jpg', category: 'Papelería' },
  { id: 'kit-borradores-capibara-amarillo', name: 'Kit Borradores Capibara Amarillo', price: 12000, image: '/productos/kit-borrador-capibara-amarillo.jpg', category: 'Papelería' },
  { id: 'kit-borradores-capibara-verde', name: 'Kit Borradores Capibara Verde', price: 12000, image: '/productos/kit-borrador-capibara-verde.jpg', category: 'Papelería' },
  { id: 'resaltadores-gato', name: 'Kit Resaltadores Gato', price: 17000, image: '/productos/resaltadores-azul.jpg', category: 'Papelería' },
  { id: 'resaltadores-pulpo', name: 'Resaltadores Pulpo', price: 17000, image: '/productos/resaltador-pulpo.jpg', category: 'Papelería' },
  { id: 'kit-resaltadores-capibara', name: 'Kit Resaltadores Capibara', price: 17000, image: '/productos/kit-resaltadores.jpg', category: 'Papelería' },
  { id: 'borrador-botella-amarillo', name: 'Borrador Botella Amarillo', price: 12000, image: '/productos/botella-amarilla.jpg', category: 'Papelería' },
  { id: 'borrador-botella-naranja', name: 'Borrador Botella Naranja', price: 12000, image: '/productos/botella-naraja.jpg', category: 'Papelería' },
  { id: 'borrador-botella-rojo', name: 'Borrador Botella Rojo', price: 12000, image: '/productos/botella-roja.jpg', category: 'Papelería' },
  { id: 'borrador-botella-verde', name: 'Borrador Botella Verde', price: 12000, image: '/productos/botella-verde.jpg', category: 'Papelería' },
  { id: 'borrador-botella-leche', name: 'Borrador Caja de Leche', price: 12000, image: '/productos/borrador-leche.jpg', category: 'Papelería' },
  { id: 'borrador-botella-naranja2', name: 'Borrador Botella Naranja', price: 12000, image: '/productos/botella-naranja2.jpg', category: 'Papelería' },
  { id: 'borrador-botella-morado', name: 'Borrador Botella Morada', price: 12000, image: '/productos/botella-morada.jpg', category: 'Papelería' },
  { id: 'borrador-botella-sandia', name: 'Borrador Botella Sandía', price: 12000, image: '/productos/botella-rosa.jpg', category: 'Papelería' },
  { id: 'borrador-arcoiris', name: 'Borradores Arcoíris', price: 12000, image: '/productos/borradores-arcoiris.jpg', category: 'Papelería' },
  { id: 'borrador-luna', name: 'Borradores Luna', price: 12000, image: '/productos/borradores-luna.jpg', category: 'Papelería' },
  { id: 'borrador-captus', name: 'Borradores Captus', price: 12000, image: '/productos/borradores-captus.png', category: 'Papelería' },
  { id: 'borrador-nube', name: 'Borradores Nube', price: 12000, image: '/productos/borradores-nube.jpg', category: 'Papelería' },
  { id: 'borrador-ponny', name: 'Borradores Ponny', price: 12000, image: '/productos/borradores-ponny.jpg', category: 'Papelería' },
  { id: 'tajalapiz-capibara', name: 'Tajalapiz Capibara', price: 8000, image: '/productos/tajalapiz-capibara.jpg', category: 'Papelería' },
  { id: 'calculadora-capibara', name: 'Calculadora Capibara', price: 15000, image: '/productos/calculadora.jpg', category: 'Papelería' },
  { id: 'bermuda-mocho', name: 'Bermuda Jean Mocho', price: 110000, image: '/productos/ropa/bermuda-modelo.jpeg', images: ['/productos/ropa/bermuda-jean.jpeg', '/productos/ropa/bermuda-modelo2.jpg','/productos/ropa/bermuda-modelo.jpeg'], sizes: ['S', 'M', 'L'], category: 'Ropa' },
  { id: 'camisa-negra-rosa', name: 'Camiseta Negra Black Lettering Editorial Crewneck', price: 70000, image: '/productos/ropa/camisa-negra-rosa.jpeg', images: ['/productos/ropa/camisa-negra-rosa.jpg','/productos/ropa/camisa-negra-rosa.jpeg','/productos/ropa/detalles-negra-rosa.jpg'], sizes: ['S', 'M', 'L'], category: 'Ropa' },
  { id: 'camisa-blanca-rosa', name: 'Camisa Blanca White Lettering Editorial Crewneck', price: 70000, image: '/productos/ropa/camisa-blanca-rosa-modelo.jpeg', images: ['/productos/ropa/camisa-blanca-rosa.jpg'], sizes: ['S', 'M', 'L'], category: 'Ropa' },
  { id: 'camisa-negra-prada', name: 'Camisa Negra Blue Prada', price: 70000, image: '/productos/ropa/camisa-negra-prada.jpg', sizes: ['S', 'M', 'L'], category: 'Ropa' },
  { id: 'camisa-blanca-prada', name: 'Camisa Blanca Blue Prada', price: 70000, image: '/productos/ropa/camisa-blanca-prada.jpg', sizes: ['S', 'M', 'L'], category: 'Ropa' },
  { id: 'camiseta-negra-moncler', name: 'Camiseta Negra Moncler', price: 70000, image: '/productos/ropa/camiseta-negra-moncler.jpg', images: ['/productos/ropa/camisa-negra-moncler-modelo.jpg','/productos/ropa/camiseta-negra-moncler.jpg'], sizes: ['S', 'M', 'L'], category: 'Ropa' },
  { id: 'cortavientos-marron', name: 'Chaqueta Corta Vientos Marrón Adidas', price: 110000, image: '/productos/ropa/cortaviento-marron-modelo.jpg', images: ['/productos/ropa/cortaviento-marron.jpg','/productos/ropa/cortaviento-marron-modelo.jpg'], sizes: ['S', 'M', 'L'], category: 'Ropa' },
  { id: 'cortavientos-verde', name: 'Chaqueta Corta Vientos Verde Adidas', price: 110000, image: '/productos/ropa/cortaviento-verde-modelo.jpg', images: ['/productos/ropa/cortaviento-verde.jpg','/productos/ropa/cortaviento-verde-modelo.jpg'], sizes: ['S', 'M', 'L'], category: 'Ropa' },
]

const categories: { name: Category; icon: string }[] = [
  { name: 'Squishy', icon: '☁️' },
  { name: 'Sorpresas', icon: '🎁' },
  { name: 'Papelería', icon: '✏️' },
  { name: 'Manualidades', icon: '🎀' },
  { name: 'Slime', icon: '🧽' },
  { name: 'Ropa', icon: '👕' },
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

function ProductModal({ product, onClose, onAdd }: { product: Product; onClose: () => void; onAdd: (product: Product, size?: string) => void }) {
  const gallery = product.images?.length ? product.images : [product.image]
  const [current, setCurrent] = useState(0)
  const [size, setSize] = useState<string | null>(null)
  const [error, setError] = useState(false)
  const hasSizes = !!product.sizes?.length

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', onKey) }
  }, [onClose])

  const add = () => {
    if (hasSizes && !size) { setError(true); return }
    onAdd(product, size ?? undefined)
    onClose()
  }

  return (
    <div className="pm-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="pm-dialog" role="dialog" aria-modal="true" aria-label={product.name}>
        <button className="pm-close" aria-label="Cerrar" onClick={onClose}><X size={20} /></button>
        <div className="pm-gallery">
          <img className="pm-main" src={gallery[current]} alt={`${product.name}, foto ${current + 1}`} />
          {gallery.length > 1 && (
            <div className="pm-thumbs">
              {gallery.map((src, i) => (
                <button key={src} className={i === current ? 'active' : ''} aria-label={`Ver foto ${i + 1}`} onClick={() => setCurrent(i)}><img src={src} alt="" /></button>
              ))}
            </div>
          )}
        </div>
        <div className="pm-info">
          <span className="product-category">{product.category}</span>
          <h2>{product.name}</h2>
          <strong className="pm-price">{formatPrice(product.price)}</strong>
          {hasSizes && (
            <>
              <p className="pm-label">Tallas disponibles</p>
              <div className="pm-sizes">
                {product.sizes!.map((s) => (
                  <button key={s} className={size === s ? 'active' : ''} aria-pressed={size === s} onClick={() => { setSize(s); setError(false) }}>{s}</button>
                ))}
              </div>
              {error && <p className="pm-error">Elige una talla para continuar</p>}
            </>
          )}
          <button className="pm-add" onClick={add}><ShoppingBag size={17} /> Agregar al carrito</button>
        </div>
      </section>
    </div>
  )
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
        <div className="product-bottom"><strong>{formatPrice(product.price)}
          </strong><button className="add-button" aria-label={`Agregar ${product.name} al carrito`} onClick={() => onAdd(product)}>
            <ShoppingBag size={16} /><span>{product.sizes?.length ? 'Elegir talla' : 'Agregar'}</span>
            </button></div>
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
  const [selected, setSelected] = useState<Product | null>(null)
  const { addToCart, getCartItemsCount } = useCart()
  const cartCount = getCartItemsCount()
  const addProduct = (product: Product, size?: string) => {
  const item = size ? { ...product, id: `${product.id}__${size}`, name: `${product.name} - Talla ${size}` } : product
  addToCart(item)
  setToast(`¡${item.name} agregado al carrito!`)
  window.setTimeout(() => setToast(''), 2200)
  }
  const handleAction = (product: Product) => {
  if (product.sizes?.length || (product.images?.length ?? 0) > 1) setSelected(product)
  else addProduct(product)
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
        <img className="hero-image" src="/Tok-Tok-Pet-Store-Template.jpg" alt="Describe aquí tu nueva imagen" />
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
        {visibleProducts.length > 0 ? <div className={`product-grid${view === 'list' ? ' list-view' : ''}`}>{visibleProducts.map((product) => <ProductCard key={product.id} product={product} list={view === 'list'} onAdd={handleAction} />)}</div> : <div className="empty-state"><span>🔎</span><h2>No encontramos ese tesorito</h2><p>Prueba con otro nombre o elige una categoría.</p><button onClick={() => { setQuery(''); setCategory('Todos') }}>Ver todos los productos</button></div>}
      </section>
      <footer className="store-footer"><span>Hecho con cariño para ti</span><span aria-hidden="true">♡</span><span>Tok Tok Store</span></footer>
      {toast && <div className="cart-toast" role="status">{toast} <span aria-hidden="true">🛒</span></div>}
      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} onAdd={addProduct} />}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </main>
  )
}