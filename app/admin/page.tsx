'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import Inventory from '@/components/admin/inventory'
import Accounting from '@/components/admin/accounting'

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [checking, setChecking] = useState(true)
  const [tab, setTab] = useState<'inventario' | 'contabilidad'>('inventario')
  const [error, setError] = useState('')
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setChecking(false)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  const login = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword(form)
    setLoading(false)
    if (error) setError('Correo o contraseña incorrectos')
    else setForm({ email: '', password: '' })
  }

  if (checking) return <main className="admin-shell"><p>Cargando…</p></main>

  if (!session) {
    return (
      <main className="admin-shell">
        <form className="admin-card" onSubmit={login}>
          <h1>Panel Tok Tok</h1>
          <label>Correo<input type="email" value={form.email} autoComplete="username" onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
          <label>Contraseña<input type="password" value={form.password} autoComplete="current-password" onChange={(e) => setForm({ ...form, password: e.target.value })} required /></label>
          {error && <p className="admin-error">{error}</p>}
          <button className="admin-primary" type="submit" disabled={loading}>{loading ? 'Entrando…' : 'Entrar'}</button>
        </form>
      </main>
    )
  }

  return (
    <main className="admin-shell admin-wide">
      <header className="admin-top">
        <div>
          <h1>{tab === 'inventario' ? 'Inventario' : 'Contabilidad'}</h1>
          <p>{session.user.email}</p>
        </div>
        <div className="admin-actions">
          <Link href="/">Ver tienda</Link>
          <button onClick={() => supabase.auth.signOut()}>Salir</button>
        </div>
      </header>

      <nav className="admin-tabs" aria-label="Módulos">
        <button className={tab === 'inventario' ? 'active' : ''} onClick={() => setTab('inventario')}>📦 Inventario</button>
        <button className={tab === 'contabilidad' ? 'active' : ''} onClick={() => setTab('contabilidad')}>💰 Contabilidad</button>
      </nav>

      {tab === 'inventario' ? <Inventory /> : <Accounting />}
    </main>
  )
}