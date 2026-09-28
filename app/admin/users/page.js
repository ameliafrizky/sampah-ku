"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LogOut, Users, UserPlus } from "lucide-react"

export default function AdminUsersPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
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
    fetchUsers()
  }, [])

  async function fetchUsers() {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setUsers(data)
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

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-black text-gray-900">👥 Kelola User</h1>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 overflow-x-auto">
          {users.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-6xl mb-4">👤</p>
              <p className="font-medium">Belum ada user</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-3 text-sm font-bold text-gray-500">Nama</th>
                  <th className="text-left py-3 px-3 text-sm font-bold text-gray-500">Email</th>
                  <th className="text-left py-3 px-3 text-sm font-bold text-gray-500">Role</th>
                  <th className="text-left py-3 px-3 text-sm font-bold text-gray-500">Poin</th>
                  <th className="text-left py-3 px-3 text-sm font-bold text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                    <td className="py-3 px-3 font-medium">{item.nama}</td>
                    <td className="py-3 px-3">{item.email}</td>
                    <td className="py-3 px-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium">{item.poin}</td>
                    <td className="py-3 px-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.isActive ? '✅ Aktif' : '❌ Nonaktif'}
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