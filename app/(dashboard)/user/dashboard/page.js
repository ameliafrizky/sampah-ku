"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LogOut, Award, PlusCircle, History, Gift } from "lucide-react"

export default function UserDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [laporan, setLaporan] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    
    // ✅ PERBAIKAN: redirect ke /admin/dashboard
    if (parsedUser.role === 'admin') {
      router.push('/admin/dashboard')
      return
    }

    setUser(parsedUser)
    fetchLaporan(parsedUser.id)
    setIsLoading(false)
  }, [router])

  async function fetchLaporan(userId) {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/sampah?userId=${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setLaporan(data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const stats = {
    total: laporan.length,
    pending: laporan.filter(l => l.status === 'pending').length,
    selesai: laporan.filter(l => l.status !== 'pending').length
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">♻️</span>
              <span className="text-xl font-black">
                <span className="text-gray-900">Sampah</span>
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Ku</span>
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden md:block">{user?.nama}</span>
              <button onClick={handleLogout} className="p-2 rounded-xl hover:bg-red-50 text-red-500 transition-colors">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 text-white mb-8">
          <h1 className="text-2xl font-bold">Selamat Datang, {user?.nama}!</h1>
          <p className="text-blue-50 mt-1">Kelola sampahmu dan dapatkan keuntungan bersama SampahKu</p>
          <div className="mt-3 flex items-center gap-2">
            <Award className="h-5 w-5" />
            <span className="font-semibold">Poin Anda: {user?.poin || 0}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Total Laporan</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Poin</p>
            <p className="text-2xl font-bold text-blue-600">{user?.poin || 0}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Menunggu</p>
            <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Selesai</p>
            <p className="text-2xl font-bold text-blue-600">{stats.selesai}</p>
          </div>
        </div>

        {/* Menu */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Link href="/laporan/tambah">
            <div className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-all border border-gray-100 hover:border-blue-200 hover:-translate-y-1 cursor-pointer">
              <div className="p-3 bg-blue-50 rounded-xl inline-block mb-3">
                <PlusCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Lapor Sampah</h3>
            </div>
          </Link>

          <Link href="/riwayat">
            <div className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-all border border-gray-100 hover:border-blue-200 hover:-translate-y-1 cursor-pointer">
              <div className="p-3 bg-blue-50 rounded-xl inline-block mb-3">
                <History className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Riwayat</h3>
            </div>
          </Link>

          <Link href="/tukar-poin">
            <div className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-all border border-gray-100 hover:border-blue-200 hover:-translate-y-1 cursor-pointer">
              <div className="p-3 bg-purple-50 rounded-xl inline-block mb-3">
                <Gift className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Tukar Poin</h3>
            </div>
          </Link>
        </div>

        <div className="mt-8 text-center text-xs text-gray-400">
          © 2026 SampahKu. All rights reserved.
        </div>
      </div>
    </div>
  )
}