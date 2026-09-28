"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LogOut } from "lucide-react"

export default function AdminLaporanPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [laporan, setLaporan] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }
    
    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'admin') {
      router.push('/user')
      return
    }
    
    setUser(parsedUser)
    fetchLaporan()
  }, [])

  async function fetchLaporan() {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/sampah', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setLaporan(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  function getStatusBadge(status) {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      diverifikasi: 'bg-blue-100 text-blue-800',
      dijual: 'bg-green-100 text-green-800',
      ditukar: 'bg-purple-100 text-purple-800'
    }
    return badges[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2">
              <span className="text-2xl">♻️</span>
              <span className="text-xl font-black">
                <span className="text-gray-900">Sampah</span>
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Ku</span>
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden md:block">Admin: {user?.nama}</span>
              <button onClick={handleLogout} className="p-2 rounded-xl hover:bg-red-50 text-red-500 transition-colors">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <Link href="/admin" className="text-blue-600 font-bold hover:underline flex items-center gap-2 mb-4">
          ← Kembali ke Dashboard
        </Link>

        <h1 className="text-2xl font-black text-gray-900 mb-6">📋 Semua Laporan</h1>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 overflow-x-auto">
          {laporan.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-6xl mb-4">📭</p>
              <p className="font-medium">Belum ada laporan</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-3 text-sm font-bold text-gray-500">Tanggal</th>
                  <th className="text-left py-3 px-3 text-sm font-bold text-gray-500">Nasabah</th>
                  <th className="text-left py-3 px-3 text-sm font-bold text-gray-500">Jenis</th>
                  <th className="text-left py-3 px-3 text-sm font-bold text-gray-500">Berat</th>
                  <th className="text-left py-3 px-3 text-sm font-bold text-gray-500">Wilayah</th>
                  <th className="text-left py-3 px-3 text-sm font-bold text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {laporan.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                    <td className="py-3 px-3 text-sm font-medium">
                      {new Date(item.tanggalLapor).toLocaleDateString('id-ID')}
                    </td>
                    <td className="py-3 px-3 font-medium">{item.user?.nama || '-'}</td>
                    <td className="py-3 px-3">{item.jenisSampah?.namaJenis || '-'}</td>
                    <td className="py-3 px-3 font-medium">{item.berat} kg</td>
                    <td className="py-3 px-3 font-medium">{item.wilayah?.namaWilayah || '-'}</td>
                    <td className="py-3 px-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}