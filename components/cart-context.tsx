'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export type Product = {
  id: string
  name: string
  price: number
  image: string
  category: string
  art?: number
  badge?: string
  images?: string[]
  sizes?: string[]
  stock?: number
}

export type CartItem = Product & { quantity: number }

type CartContextValue = {
  items: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  increaseQuantity: (productId: string) => void
  decreaseQuantity: (productId: string) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartItemsCount: () => number
}

const CartContext = createContext<CartContextValue | null>(null)
const CART_STORAGE_KEY = 'tok-tok-store-cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        const parsed: unknown = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setItems(parsed.filter((item): item is CartItem =>
            item && typeof item.id === 'string' && typeof item.name === 'string' &&
            typeof item.price === 'number' && typeof item.image === 'string' &&
            typeof item.quantity === 'number' && item.quantity > 0
          ))
        }
      }
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY)
    } finally {
      setHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [hydrated, items])

  const addToCart = useCallback((product: Product) => {
    setItems((current) => {
      const found = current.find((item) => item.id === product.id)
      return found
        ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { ...product, quantity: 1 }]
    })
  }, [])

  const removeFromCart = useCallback((productId: string) => setItems((current) => current.filter((item) => item.id !== productId)), [])
  const increaseQuantity = useCallback((productId: string) => setItems((current) => current.map((item) => item.id === productId ? { ...item, quantity: item.quantity + 1 } : item)), [])
  const decreaseQuantity = useCallback((productId: string) => setItems((current) => current.flatMap((item) => item.id !== productId ? [item] : item.quantity <= 1 ? [] : [{ ...item, quantity: item.quantity - 1 }])), [])
  const clearCart = useCallback(() => setItems([]), [])
  const getCartTotal = useCallback(() => items.reduce((total, item) => total + item.price * item.quantity, 0), [items])
  const getCartItemsCount = useCallback(() => items.reduce((total, item) => total + item.quantity, 0), [items])

  const value = useMemo(() => ({ items, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, getCartTotal, getCartItemsCount }), [items, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, getCartTotal, getCartItemsCount])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart debe usarse dentro de CartProvider')
  return context
}
