"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, Plus, Edit, Trash2 } from "lucide-react"

export default function AdminJenisSampahPage() {
  const router = useRouter()
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    namaJenis: "",
    kategori: "",
    hargaPerKg: "",
    deskripsi: ""
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/jenis-sampah')
      const data = await res.json()
      setItems(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingId ? `/api/jenis-sampah/${editingId}` : '/api/jenis-sampah'
      const method = editingId ? 'PUT' : 'POST'
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          hargaPerKg: parseInt(formData.hargaPerKg)
        })
      })
      
      setShowForm(false)
      setEditingId(null)
      setFormData({ namaJenis: "", kategori: "", hargaPerKg: "", deskripsi: "" })
      fetchData()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Yakin hapus jenis sampah ini?')) return
    try {
      await fetch(`/api/jenis-sampah/${id}`, { method: 'DELETE' })
      fetchData()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setFormData({
      namaJenis: item.namaJenis,
      kategori: item.kategori,
      hargaPerKg: item.hargaPerKg.toString(),
      deskripsi: item.deskripsi || ""
    })
    setShowForm(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="p-2 rounded-xl hover:bg-gray-100">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Jenis Sampah</h1>
              <p className="text-sm text-gray-500">Kelola jenis sampah</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Tambah
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? 'Edit' : 'Tambah'} Jenis Sampah
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nama Jenis</label>
                <input
                  type="text"
                  value={formData.namaJenis}
                  onChange={(e) => setFormData({...formData, namaJenis: e.target.value})}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kategori</label>
                <input
                  type="text"
                  value={formData.kategori}
                  onChange={(e) => setFormData({...formData, kategori: e.target.value})}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Harga Per Kg (Rp)</label>
                <input
                  type="number"
                  value={formData.hargaPerKg}
                  onChange={(e) => setFormData({...formData, hargaPerKg: e.target.value})}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                <textarea
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  rows="2"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600"
                >
                  {editingId ? 'Update' : 'Simpan'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                    setFormData({ namaJenis: "", kategori: "", hargaPerKg: "", deskripsi: "" })
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium">Nama</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Kategori</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Harga/Kg</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="py-3 px-4 font-medium">{item.namaJenis}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{item.kategori}</td>
                    <td className="py-3 px-4">Rp {item.hargaPerKg?.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}