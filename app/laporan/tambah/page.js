'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function TambahLaporanPage() {
  const router = useRouter()
  const fileInputRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [jenisSampah, setJenisSampah] = useState([])
  const [wilayah, setWilayah] = useState([])
  const [form, setForm] = useState({
    jenisSampahId: '',
    berat: '',
    wilayahId: '',
    catatan: '',
  })
  const [fotoFile, setFotoFile] = useState(null)
  const [fotoPreview, setFotoPreview] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    fetchJenisSampah()
    fetchWilayah()
  }, [])

  async function fetchJenisSampah() {
    try {
      const res = await fetch('/api/jenis-sampah')
      const data = await res.json()
      setJenisSampah(data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  async function fetchWilayah() {
    try {
      const res = await fetch('/api/wilayah')
      const data = await res.json()
      console.log('Wilayah data:', data)
      setWilayah(data)
    } catch (error) {
      console.error('Error fetch wilayah:', error)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setFotoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadFoto = async (file) => {
    const formData = new FormData()
    formData.append('foto', file)

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Upload foto gagal')
    return data.url
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

      if (parseFloat(form.berat) <= 0) {
        throw new Error('Berat sampah harus lebih dari 0 kg!')
      }

      let fotoUrl = null
      if (fotoFile) {
        fotoUrl = await uploadFoto(fotoFile)
      }

      const payload = {
        ...form,
        fotoUrl,
      }

      const res = await fetch('/api/sampah', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyimpan laporan')
      }

      setSuccess('✅ Laporan berhasil dikirim! Tunggu verifikasi dari admin.')
      setForm({
        jenisSampahId: '',
        berat: '',
        wilayahId: '',
        catatan: '',
      })
      setFotoFile(null)
      setFotoPreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      setTimeout(() => {
        const userData = JSON.parse(localStorage.getItem('user'))
        if (userData?.role === 'admin') {
          router.push('/admin/dashboard')
        } else {
          router.push('/user/dashboard')
        }
      }, 2000)

    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white rounded-3xl p-8 shadow-2xl border border-blue-200/50">
        <button
          onClick={() => {
            const userData = JSON.parse(localStorage.getItem('user'))
            if (userData?.role === 'admin') {
              router.push('/admin/dashboard')
            } else {
              router.push('/user/dashboard')
            }
          }}
          className="inline-block text-blue-600 font-bold hover:underline mb-4 cursor-pointer"
        >
          ← Kembali ke Dashboard
        </button>

        <h2 className="text-2xl font-black text-blue-800 text-center mb-6">
          ♻️ Lapor Sampah
        </h2>

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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Jenis Sampah */}
          <div>
            <label className="block text-sm font-bold text-blue-800 mb-1">
              Jenis Sampah *
            </label>
            <select
              value={form.jenisSampahId}
              onChange={(e) => setForm({ ...form, jenisSampahId: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none"
              required
            >
              <option value="">Pilih jenis sampah...</option>
              {jenisSampah.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.namaJenis} - Rp {j.hargaPerKg.toLocaleString()}/kg
                </option>
              ))}
            </select>
          </div>

          {/* Berat */}
          <div>
            <label className="block text-sm font-bold text-blue-800 mb-1">
              Berat (kg) *
            </label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              value={form.berat}
              onChange={(e) => setForm({ ...form, berat: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none"
              placeholder="Contoh: 2.5"
              required
            />
            <p className="text-xs text-gray-500 font-medium mt-1">Minimal 0.1 kg</p>
          </div>

          {/* Wilayah */}
          <div>
            <label className="block text-sm font-bold text-blue-800 mb-1">
              Wilayah *
            </label>
            <select
              value={form.wilayahId}
              onChange={(e) => setForm({ ...form, wilayahId: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none"
              required
            >
              <option value="">Pilih wilayah...</option>
              {wilayah.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.namaWilayah}
                </option>
              ))}
            </select>
          </div>

          {/* Catatan */}
          <div>
            <label className="block text-sm font-bold text-blue-800 mb-1">
              Catatan
            </label>
            <textarea
              value={form.catatan}
              onChange={(e) => setForm({ ...form, catatan: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none"
              rows="3"
              placeholder="Deskripsi tambahan tentang sampah..."
            />
          </div>

          {/* Upload Foto */}
          <div>
            <label className="block text-sm font-bold text-blue-800 mb-1">
              Foto Sampah
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-500 font-medium mt-1">Upload foto sampah (opsional)</p>
          </div>

          {/* Preview Foto */}
          {fotoPreview && (
            <div className="mt-2">
              <p className="text-sm font-bold text-gray-600 mb-1">Preview:</p>
              <img 
                src={fotoPreview} 
                alt="Preview sampah" 
                className="max-h-48 rounded-2xl object-cover border border-gray-200"
              />
              <button
                type="button"
                onClick={() => {
                  setFotoFile(null)
                  setFotoPreview(null)
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                  }
                }}
                className="mt-2 text-red-600 font-bold text-sm hover:underline"
              >
                ❌ Hapus Foto
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-blue-600/30 disabled:opacity-50"
          >
            {loading ? '⏳ Memproses...' : '📤 Kirim Laporan'}
          </button>
        </form>

        <div className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-200/50">
          <p className="text-sm text-gray-600 font-medium">
            💡 <span className="font-bold">Info:</span> Setiap 1 kg sampah akan mendapatkan <span className="font-bold text-blue-700">10 poin</span>. 
            Poin bisa ditukarkan dengan uang atau hadiah menarik!
          </p>
        </div>
      </div>
    </div>
  )
}