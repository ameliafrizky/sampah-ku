"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LogOut } from "lucide-react"

export default function VerifikasiLaporanPage() {
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
      router.push('/user/dashboard')
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
      console.log('Data laporan:', data)
      setLaporan(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifikasi = async (id, status) => {
    try {
      const token = localStorage.getItem('token')
      
      const res = await fetch('/api/sampah', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id, status })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Gagal verifikasi')
      }

      alert(`✅ Laporan berhasil ${status}!`)
      fetchLaporan()
    } catch (error) {
      alert('❌ ' + error.message)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const pendingLaporan = laporan.filter(l => l.status === 'pending')

  return (
    <div className="min-h-screen bg-gray-50/50">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
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
        <Link href="/admin/dashboard" className="text-blue-600 font-bold hover:underline flex items-center gap-2 mb-4">
          ← Kembali ke Dashboard
        </Link>

        <h1 className="text-2xl font-black text-gray-900 mb-2">🛡️ Verifikasi Laporan</h1>
        <p className="text-gray-500 mb-6">Verifikasi laporan sampah yang masuk dari nasabah</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Total Laporan</p>
            <p className="text-2xl font-bold text-gray-900">{laporan.length}</p>
          </div>
          <div className="bg-amber-50 rounded-2xl p-4 shadow-sm border border-amber-100">
            <p className="text-sm text-amber-600">Menunggu Verifikasi</p>
            <p className="text-2xl font-bold text-amber-600">{pendingLaporan.length}</p>
          </div>
          <div className="bg-blue-50 rounded-2xl p-4 shadow-sm border border-blue-100">
            <p className="text-sm text-blue-600">Diverifikasi</p>
            <p className="text-2xl font-bold text-blue-600">{laporan.filter(l => l.status === 'diverifikasi').length}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">⏳ Laporan Menunggu Verifikasi</h2>
          
          {pendingLaporan.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-6xl mb-4">✅</p>
              <p className="font-medium">Tidak ada laporan yang menunggu verifikasi</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-3 text-sm font-bold text-gray-500">Tanggal</th>
                    <th className="text-left py-3 px-3 text-sm font-bold text-gray-500">Nasabah</th>
                    <th className="text-left py-3 px-3 text-sm font-bold text-gray-500">Jenis</th>
                    <th className="text-left py-3 px-3 text-sm font-bold text-gray-500">Berat</th>
                    <th className="text-left py-3 px-3 text-sm font-bold text-gray-500">Wilayah</th>
                    <th className="text-left py-3 px-3 text-sm font-bold text-gray-500">Foto</th>
                    <th className="text-left py-3 px-3 text-sm font-bold text-gray-500">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingLaporan.map((item) => {
                    console.log('Item foto:', item.foto)
                    return (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                        <td className="py-3 px-3 text-sm font-medium">
                          {new Date(item.tanggalLapor).toLocaleDateString('id-ID')}
                        </td>
                        <td className="py-3 px-3 font-medium">{item.user?.nama || '-'}</td>
                        <td className="py-3 px-3">{item.jenisSampah?.namaJenis || '-'}</td>
                        <td className="py-3 px-3 font-medium">{item.berat} kg</td>
                        <td className="py-3 px-3 font-medium">{item.wilayah?.namaWilayah || '-'}</td>
                        <td className="py-3 px-3">
                          {item.foto ? (
                            <img 
                              src={item.foto.imageUrl} 
                              alt="Foto sampah" 
                              className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/100?text=No+Image'
                              }}
                            />
                          ) : (
                            <span className="text-gray-400 text-xs">Tidak ada foto</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex gap-2 flex-wrap">
                            <button
                              onClick={() => handleVerifikasi(item.id, 'diverifikasi')}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition"
                            >
                              ✅ Verifikasi
                            </button>
                            <button
                              onClick={() => handleVerifikasi(item.id, 'dijual')}
                              className="bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition"
                            >
                              💰 Jual
                            </button>
                            <button
                              onClick={() => handleVerifikasi(item.id, 'ditukar')}
                              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition"
                            >
                              🔄 Tukar
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}