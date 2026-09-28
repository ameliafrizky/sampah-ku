'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Login gagal')

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      if (data.user.role === 'admin') {
        router.push('/admin/dashboard')
      } else {
        router.push('/user/dashboard')
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-blue-100/50">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 max-w-md w-full shadow-2xl border border-blue-200/50">
        <Link href="/" className="inline-block text-blue-600 font-bold hover:underline mb-4">
          ← Kembali
        </Link>

        <div className="text-center mb-8">
          <div className="text-5xl mb-3">♻️</div>
          <h2 className="text-3xl font-black text-blue-800">Login</h2>
          <p className="text-gray-500 font-medium mt-1">Masuk ke akun SampahKu</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl mb-4 text-sm font-medium">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-blue-800 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none"
              placeholder="Masukkan email Anda"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-blue-800 mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none"
              placeholder="Masukkan password Anda"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-blue-600/30 disabled:opacity-50"
          >
            {loading ? '⏳ Loading...' : '🚀 Login'}
          </button>
        </form>

        <p className="text-center text-gray-500 font-medium mt-6">
          Belum punya akun?{' '}
          <Link href="/register" className="text-blue-600 font-bold hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  )
}