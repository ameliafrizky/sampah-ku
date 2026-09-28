"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function TukarPoinPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [riwayat, setRiwayat] = useState([])
  const [form, setForm] = useState({
    hadiah: '',
    poinDigunakan: 0
  })

  const daftarHadiah = [
    { id: 1, nama: 'Voucher Rp 10.000', poin: 100 },
    { id: 2, nama: 'Voucher Rp 25.000', poin: 250 },
    { id: 3, nama: 'Voucher Rp 50.000', poin: 500 },
    { id: 4, nama: 'Beras 5kg', poin: 300 },
    { id: 5, nama: 'Minyak Goreng 2L', poin: 200 },
    { id: 6, nama: 'Gula 5kg', poin: 150 },
    { id: 7, nama: 'Pulsa Rp 20.000', poin: 200 },
    { id: 8, nama: 'Pulsa Rp 50.000', poin: 500 },
    { id: 9, nama: 'Uang Tunai Rp 10.000', poin: 100 },
    { id: 10, nama: 'Uang Tunai Rp 25.000', poin: 250 },
  ]

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    fetchUserData(parsedUser.id)
    fetchRiwayat(parsedUser.id)
    setLoading(false)
  }, [])

  // ✅ AMBIL DATA USER TERBARU DARI DATABASE
  async function fetchUserData(userId) {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (res.ok) {
        const users = await res.json()
        const currentUser = users.find(u => u.id === userId)
        
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            poin: currentUser.poin,
            nama: currentUser.nama,
            email: currentUser.email,
            role: currentUser.role
          }
          setUser(updatedUser)
          localStorage.setItem('user', JSON.stringify(updatedUser))
        }
      }
    } catch (error) {
      console.error('Error fetch user data:', error)
    }
  }

  async function fetchRiwayat(userId) {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        setRiwayat([])
        return
      }

      // ✅ KALO userId UNDEFINED, AMBIL DARI LOCALSTORAGE
      let targetUserId = userId
      if (!targetUserId || targetUserId === 'undefined') {
        const userData = localStorage.getItem('user')
        if (userData) {
          const parsed = JSON.parse(userData)
          targetUserId = parsed.id
        }
      }

      if (!targetUserId || targetUserId === 'undefined') {
        setRiwayat([])
        return
      }

      const res = await fetch(`/api/transaksi?userId=${targetUserId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (res.status === 401 || res.status === 404) {
        setRiwayat([])
        return
      }
      
      if (!res.ok) {
        setRiwayat([])
        return
      }
      
      const data = await res.json()
      
      if (Array.isArray(data)) {
        setRiwayat(data)
      } else {
        setRiwayat([])
      }
    } catch (error) {
      console.error('Error fetch riwayat:', error)
      setRiwayat([])
    }
  }

  const handlePilihHadiah = (hadiah) => {
    setForm({
      hadiah: hadiah.nama,
      poinDigunakan: hadiah.poin
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        throw new Error('Silakan login terlebih dahulu')
      }

      if (form.poinDigunakan > user.poin) {
        throw new Error(`Poin tidak mencukupi! Kamu punya ${user.poin} poin, butuh ${form.poinDigunakan} poin`)
      }

      if (form.poinDigunakan <= 0) {
        throw new Error('Poin harus lebih dari 0!')
      }

      const res = await fetch('/api/transaksi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          hadiah: form.hadiah,
          poinDigunakan: form.poinDigunakan
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Gagal menukarkan poin')
      }

      // ✅ UPDATE POIN DI STATE & LOCALSTORAGE
      const newPoin = user.poin - form.poinDigunakan
      const updatedUser = {
        ...user,
        poin: newPoin
      }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))

      setSuccess(`✅ Berhasil menukarkan ${form.poinDigunakan} poin untuk ${form.hadiah}!`)
      
      fetchRiwayat(user.id)
      setForm({ hadiah: '', poinDigunakan: 0 })
      
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
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

  const isAdmin = user?.role === 'admin'

  return (
    <div className="min-h-screen bg-gray-50/50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <Link href={isAdmin ? '/admin/dashboard' : '/user/dashboard'} className="text-blue-600 font-bold hover:underline flex items-center gap-2">
              ← Kembali ke Dashboard
            </Link>
            <h1 className="text-2xl font-black text-gray-900 mt-2">🔄 Tukar Poin</h1>
            <p className="text-gray-500">{isAdmin ? 'Halaman ini hanya untuk nasabah' : 'Tukarkan poinmu menjadi hadiah menarik!'}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 px-6 py-3 rounded-2xl">
              <p className="text-sm font-bold text-blue-700">⭐ Poin Kamu</p>
              <p className="text-2xl font-black text-blue-800">{user?.poin || 0}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-2xl transition"
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {isAdmin ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
            <p className="text-yellow-800 font-medium">⚠️ Halaman ini khusus untuk nasabah.</p>
            <Link href="/admin/dashboard" className="text-blue-600 font-bold hover:underline mt-2 inline-block">
              Kembali ke Dashboard Admin
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-4 mb-6">
              <p className="text-sm text-blue-800 font-medium">
                💡 <span className="font-bold">Cara Tukar Poin:</span> Pilih hadiah yang kamu inginkan, 
                lalu klik "Tukar Sekarang". Poin akan otomatis berkurang.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">🎁 Pilih Hadiah</h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl mb-4 text-sm font-medium">
                  ❌ {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-2xl mb-4 text-sm font-medium">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                  {daftarHadiah.map((hadiah) => (
                    <button
                      key={hadiah.id}
                      type="button"
                      onClick={() => handlePilihHadiah(hadiah)}
                      className={`p-4 rounded-2xl border-2 transition-all text-left ${
                        form.hadiah === hadiah.nama
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      } ${user?.poin < hadiah.poin ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={user?.poin < hadiah.poin}
                    >
                      <p className="font-bold text-gray-800 text-sm">{hadiah.nama}</p>
                      <p className="text-blue-700 font-bold text-xs mt-1">
                        ⭐ {hadiah.poin} poin
                      </p>
                      {user?.poin < hadiah.poin && (
                        <p className="text-red-500 text-xs mt-1">Poin kurang</p>
                      )}
                    </button>
                  ))}
                </div>

                {form.hadiah && (
                  <div className="bg-blue-50 rounded-2xl p-4 mb-4">
                    <p className="text-sm font-medium text-gray-600">
                      Hadiah dipilih: <span className="font-bold text-blue-800">{form.hadiah}</span>
                    </p>
                    <p className="text-sm font-medium text-gray-600">
                      Poin yang dibutuhkan: <span className="font-bold text-blue-800">{form.poinDigunakan} poin</span>
                    </p>
                    <p className="text-sm font-medium text-gray-600">
                      Sisa poin setelah tukar: <span className="font-bold text-blue-800">{user?.poin - form.poinDigunakan} poin</span>
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!form.hadiah || loading || form.poinDigunakan > user?.poin}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-blue-600/30 disabled:opacity-50"
                >
                  {loading ? '⏳ Memproses...' : '🔄 Tukar Sekarang'}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">📋 Riwayat Penukaran</h2>
              
              {riwayat.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-4xl mb-2">📭</p>
                  <p className="font-medium">Belum ada riwayat penukaran</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-bold text-gray-500">Tanggal</th>
                        <th className="text-left py-3 px-4 text-sm font-bold text-gray-500">Hadiah</th>
                        <th className="text-left py-3 px-4 text-sm font-bold text-gray-500">Poin Digunakan</th>
                        <th className="text-left py-3 px-4 text-sm font-bold text-gray-500">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {riwayat.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                          <td className="py-3 px-4 text-sm font-medium">
                            {new Date(item.createdAt).toLocaleDateString('id-ID')}
                          </td>
                          <td className="py-3 px-4 font-medium">{item.hadiah}</td>
                          <td className="py-3 px-4 font-medium">-{item.poinDigunakan} poin</td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              item.status === 'sukses' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {item.status === 'sukses' ? '✅ Sukses' : '⏳ Pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}