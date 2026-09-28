"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    noHp: "",
    alamat: "",
    password: "",
    confirmPassword: ""
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Semua field wajib diisi!")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak sama!")
      return
    }

    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter!")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          noHp: formData.noHp || '',
          alamat: formData.alamat || ''
        })
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        setError(data.message || "Registrasi gagal. Silakan coba lagi.")
      }
    } catch (err) {
      setError("Terjadi kesalahan koneksi. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50/30 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✅</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pendaftaran Berhasil!</h2>
          <p className="text-gray-500">Akun Anda telah berhasil dibuat. Silakan login.</p>
          <div className="mt-6 text-blue-600 animate-pulse">Mengalihkan ke login...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50/30 py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
            <span className="text-3xl">♻️</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900">Daftar Akun</h1>
          <p className="text-sm text-gray-500 mt-1">Buat akun SampahKu Anda sekarang</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              ⚠️ {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              name="name"
              placeholder="Budi Santoso"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Email</label>
            <input
              type="email"
              name="email"
              placeholder="budi@email.com"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
            <input
              type="tel"
              name="noHp"
              placeholder="0812-3456-7890"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              value={formData.noHp}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
            <input
              type="text"
              name="alamat"
              placeholder="Jl. Contoh No. 123, Bandung"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              value={formData.alamat}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Minimal 6 karakter"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Masukkan ulang password"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-start gap-2 text-sm">
            <input type="checkbox" className="mt-0.5" required />
            <span className="text-gray-600">
              Saya menyetujui <Link href="/terms" className="text-blue-600 hover:underline">Syarat & Ketentuan</Link>
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin inline mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
              </>
            ) : (
              "Daftar Sekarang"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-blue-600 font-semibold hover:underline">
            Masuk sekarang
          </Link>
        </div>
      </div>
    </div>
  )
}