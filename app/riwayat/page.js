"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RiwayatPage() {
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
    
    // ✅ KALO user.id GA ADA, AMBIL ULANG DARI API
    if (!parsedUser.id) {
      fetchUserFromAPI(token)
      return
    }
    
    setUser(parsedUser)
    fetchLaporan(parsedUser.id)
  }, [])

  // ✅ FUNGSI BARU: Ambil user dari API
  async function fetchUserFromAPI(token) {
    try {
      const res = await fetch('/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (res.ok) {
        const users = await res.json()
        // Cari user yang emailnya sama
        const userData = JSON.parse(localStorage.getItem('user'))
        const currentUser = users.find(u => u.email === userData.email)
        
        if (currentUser) {
          setUser(currentUser)
          localStorage.setItem('user', JSON.stringify(currentUser))
          fetchLaporan(currentUser.id)
          return
        }
      }
      
      // Kalo gagal, redirect login
      router.push('/login')
    } catch (error) {
      console.error('Error fetch user:', error)
      router.push('/login')
    }
  }

  async function fetchLaporan(userId) {
    try {
      // ✅ KALO userId UNDEFINED, JANGAN FETCH
      if (!userId || userId === 'undefined') {
        console.log('User ID tidak valid')
        setLaporan([])
        setLoading(false)
        return
      }
      
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/sampah?userId=${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      
      if (Array.isArray(data)) {
        setLaporan(data)
      } else {
        setLaporan([])
      }
    } catch (error) {
      console.error('Error:', error)
      setLaporan([])
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

  const isAdmin = user?.role === 'admin'

  return (
    <div className="min-h-screen bg-gray-50/50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <Link href={isAdmin ? '/admin/dashboard' : '/user/dashboard'} className="text-blue-600 font-bold hover:underline flex items-center gap-2">
              ← Kembali ke Dashboard
            </Link>
            <h1 className="text-2xl font-black text-gray-900 mt-2">📋 Riwayat Laporan</h1>
            <p className="text-gray-500">Semua laporan sampah kamu</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-2xl transition"
          >
            🚪 Logout
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Total Laporan</p>
            <p className="text-2xl font-bold text-gray-900">{laporan.length}</p>
          </div>
          <div className="bg-amber-50 rounded-2xl p-4 shadow-sm border border-amber-100">
            <p className="text-sm text-amber-600">Pending</p>
            <p className="text-2xl font-bold text-amber-600">
              {laporan.filter(l => l.status === 'pending').length}
            </p>
          </div>
          <div className="bg-green-50 rounded-2xl p-4 shadow-sm border border-green-100">
            <p className="text-sm text-green-600">Dijual</p>
            <p className="text-2xl font-bold text-green-600">
              {laporan.filter(l => l.status === 'dijual').length}
            </p>
          </div>
          <div className="bg-purple-50 rounded-2xl p-4 shadow-sm border border-purple-100">
            <p className="text-sm text-purple-600">Ditukar</p>
            <p className="text-2xl font-bold text-purple-600">
              {laporan.filter(l => l.status === 'ditukar').length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">📋 Daftar Laporan</h2>
          
          {laporan.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-6xl mb-4">📭</p>
              <p className="font-medium">Belum ada laporan sampah</p>
              <Link href="/laporan/tambah" className="text-blue-600 font-bold hover:underline mt-2 inline-block">
                Mulai lapor sekarang!
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-500">Tanggal</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-500">Jenis</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-500">Berat</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-500">Wilayah</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {laporan.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                      <td className="py-3 px-4 text-sm font-medium">
                        {new Date(item.tanggalLapor).toLocaleDateString('id-ID')}
                      </td>
                      <td className="py-3 px-4 font-medium">{item.jenisSampah?.namaJenis || '-'}</td>
                      <td className="py-3 px-4 font-medium">{item.berat} kg</td>
                      <td className="py-3 px-4 font-medium">{item.wilayah?.namaWilayah || '-'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-xs text-gray-400">
          © 2026 SampahKu. All rights reserved.
        </div>
      </div>
    </div>
  )
}