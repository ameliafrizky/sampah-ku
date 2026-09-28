"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowRight, Recycle, TrendingUp, Award, Users } from "lucide-react"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  const dashboardLink = '/user/dashboard'

  return (
    <>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50/50 via-white to-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800 mb-6">
              Pasar Sumur Batu - Kemayoran Jakarta Pusat
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.1] mb-6">
              <span className="text-gray-900">Sampah</span>
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Ku</span>
            </h1>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
              Kelola sampah di Pasar Sumur Batu. Setor, tukar, dan dapatkan keuntungan.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              {isLoggedIn ? (
                <Link href={dashboardLink}>
                  <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all flex items-center gap-2">
                    Dashboard
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </Link>
              ) : (
                <>
                  <Link href="/register">
                    <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all">
                      Daftar
                    </button>
                  </Link>
                  <Link href="/login">
                    <button className="px-8 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all">
                      Masuk
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Sederhana */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
                <Recycle className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-700">Setor Sampah</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-700">Dapat Uang</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-700">Kumpulkan Poin</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-700">Komunitas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-6">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>© 2026 SampahKu - Jakarta Pusat, Kemayoran</p>
        </div>
      </footer>
    </>
  )
}