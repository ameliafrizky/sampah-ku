"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, Bell, User, LogOut, Home, PlusCircle, Sparkles, Search, ChevronDown, Gift } from "lucide-react"
import { useState, useEffect, useRef } from "react"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [notifikasi, setNotifikasi] = useState([])
  const [notifBelumDibaca, setNotifBelumDibaca] = useState(0)
  
  const pathname = usePathname()
  const router = useRouter()
  const profileRef = useRef(null)
  const notifRef = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    setIsLoggedIn(!!token)
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  useEffect(() => {
    if (isLoggedIn) {
      fetchNotifikasi()
    }
  }, [isLoggedIn])

  const fetchNotifikasi = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/notifikasi', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (Array.isArray(data)) {
        setNotifikasi(data)
        setNotifBelumDibaca(data.filter(n => !n.isRead).length)
      }
    } catch (error) {
      console.error('Error fetch notifikasi:', error)
    }
  }

  const bacaNotifikasi = async (id) => {
    try {
      const token = localStorage.getItem('token')
      await fetch(`/api/notifikasi/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isRead: true })
      })
      fetchNotifikasi()
    } catch (error) {
      console.error('Error baca notifikasi:', error)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setUser(null)
    router.push('/login')
  }

  const dashboardLink = user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'
  const isNasabah = user?.role === 'nasabah'

  const navLinks = [
    { href: "/", label: "Beranda", icon: Home },
    { href: dashboardLink, label: "Dashboard", icon: Home },
  ]

  if (isNasabah) {
    navLinks.push({ href: "/laporan/tambah", label: "Lapor Sampah", icon: PlusCircle })
    navLinks.push({ href: "/tukar-poin", label: "Tukar Poin", icon: Gift })
  }

  // ✅ CEK APAKAH DI HALAMAN TUKAR POIN
  const isTukarPoinPage = pathname === '/tukar-poin'

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100/50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl blur-md opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/25">
                <span className="text-lg">♻️</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-black tracking-tight">
                <span className="text-gray-900">Sampah</span>
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Ku</span>
              </span>
              <p className="text-[10px] font-medium text-gray-400 -mt-0.5 tracking-wider">Pasar Sumur Batu</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center relative">
              <Search className="absolute left-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari..."
                className="w-48 h-9 pl-9 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {isLoggedIn ? (
              <>
                {/* NOTIFIKASI */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className="relative p-2 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <Bell className="h-5 w-5 text-gray-600" />
                    {notifBelumDibaca > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {notifBelumDibaca}
                      </span>
                    )}
                  </button>

                  {isNotifOpen && (
                    <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <span className="font-semibold text-gray-900">Notifikasi</span>
                      </div>
                      {notifikasi.length === 0 ? (
                        <div className="px-4 py-8 text-center text-gray-400 text-sm">
                          Belum ada notifikasi
                        </div>
                      ) : (
                        notifikasi.map((item) => (
                          <div
                            key={item.id}
                            className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                              !item.isRead ? 'bg-blue-50/50 border-l-4 border-blue-500' : ''
                            }`}
                            onClick={() => bacaNotifikasi(item.id)}
                          >
                            <p className="text-sm font-medium text-gray-900">{item.judul}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{item.pesan}</p>
                            <p className="text-[10px] text-gray-400 mt-1">
                              {new Date(item.createdAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                  <Sparkles className="h-3.5 w-3.5" />
                  {user?.poin || 0} Poin
                </span>

                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                      {user?.nama?.charAt(0) || 'U'}
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user?.nama}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-800 mt-1.5">
                          {user?.role === 'admin' ? 'Admin' : 'Nasabah'}
                        </span>
                      </div>
                      <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <User className="h-4 w-4" />
                        Profil
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                      >
                        <LogOut className="h-4 w-4" />
                        Keluar
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex gap-2">
                <Link href="/login">
                  <button className="px-4 py-2 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">Masuk</button>
                </Link>
                <Link href="/register">
                  <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all">Daftar</button>
                </Link>
              </div>
            )}

            <button
              className="p-2 rounded-xl hover:bg-gray-50 transition-colors md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-1">
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari..."
                  className="w-full h-10 pl-9 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {navLinks.map((link) => {
                const isActive = pathname === link.href
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                )
              })}
              
              {isLoggedIn ? (
                <>
                  <div className="h-px bg-gray-100 my-2" />
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
                  >
                    <LogOut className="h-4 w-4" />
                    Keluar
                  </button>
                </>
              ) : (
                <div className="flex gap-2 mt-2">
                  <Link href="/login" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">Masuk</button>
                  </Link>
                  <Link href="/register" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all">Daftar</button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}