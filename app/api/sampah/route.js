import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

// ============================================
// GET: Ambil semua laporan
// ============================================
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    
    const where = {}
    if (userId) where.userId = userId
    if (status) where.status = status
    
    const laporan = await prisma.laporanSampah.findMany({
      where,
      include: {
        user: { select: { id: true, nama: true, email: true } },
        admin: { select: { id: true, nama: true } },
        jenisSampah: true,
        wilayah: true,
        foto: true,
        transaksi: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(laporan)
  } catch (error) {
    console.error('Error GET:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

// ============================================
// POST: Tambah laporan baru
// ============================================
export async function POST(req) {
  try {
    const token = getTokenFromRequest(req)
    const decoded = verifyToken(token)
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Silakan login dulu!' },
        { status: 401 }
      )
    }
    
    const { berat, jenisSampahId, wilayahId, catatan, fotoUrl } = await req.json()
    
    if (!berat || !jenisSampahId || !wilayahId) {
      return NextResponse.json(
        { error: 'Berat, jenis sampah, dan wilayah wajib diisi!' },
        { status: 400 }
      )
    }
    
    if (parseFloat(berat) <= 0) {
      return NextResponse.json(
        { error: 'Berat harus lebih dari 0 kg!' },
        { status: 400 }
      )
    }
    
    // CEK WILAYAH ADA
    const wilayahExists = await prisma.wilayah.findUnique({
      where: { id: wilayahId }
    })
    
    if (!wilayahExists) {
      return NextResponse.json(
        { error: 'Wilayah tidak ditemukan!' },
        { status: 400 }
      )
    }
    
    // Buat laporan
    const laporan = await prisma.laporanSampah.create({
      data: {
        berat: parseFloat(berat),
        userId: decoded.id,
        jenisSampahId,
        wilayahId,
        catatan: catatan || null,
        status: 'pending'
      },
      include: {
        user: { select: { id: true, nama: true } },
        jenisSampah: true,
        wilayah: true
      }
    })
    
    if (fotoUrl) {
      await prisma.fotoSampah.create({
        data: {
          imageUrl: fotoUrl,
          laporanId: laporan.id
        }
      })
    }
    
    return NextResponse.json({ 
      success: true, 
      data: laporan,
      message: 'Laporan berhasil dikirim!' 
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error POST:', error)
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

// ============================================
// PUT: Update status laporan (Admin)
// ============================================
export async function PUT(req) {
  try {
    const token = getTokenFromRequest(req)
    const decoded = verifyToken(token)
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Silakan login dulu!' },
        { status: 401 }
      )
    }
    
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Hanya admin yang bisa memproses!' },
        { status: 403 }
      )
    }
    
    const { id, status, hargaJual, poinDitukar } = await req.json()
    
    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID dan status wajib diisi!' },
        { status: 400 }
      )
    }
    
    const allowedStatus = ['pending', 'diverifikasi', 'dijual', 'ditukar']
    if (!allowedStatus.includes(status)) {
      return NextResponse.json(
        { error: 'Status tidak valid!' },
        { status: 400 }
      )
    }
    
    // Update status laporan
    const laporan = await prisma.laporanSampah.update({
      where: { id },
      data: {
        status: status,
        adminId: decoded.id
      },
      include: {
        user: true,
        jenisSampah: true,
        wilayah: true
      }
    })
    
    // Jika status dijual atau ditukar, buat transaksi
    if (status === 'dijual' || status === 'ditukar') {
      const transaksi = await prisma.transaksi.create({
        data: {
          kodeTransaksi: `TRX-${Date.now()}`,
          tipeTransaksi: status === 'dijual' ? 'jual' : 'tukar',
          laporanId: laporan.id,
          adminId: decoded.id,
          hargaJual: status === 'dijual' ? (hargaJual || Math.round(laporan.berat * laporan.jenisSampah.hargaPerKg)) : 0,
          poinDitukar: status === 'ditukar' ? (poinDitukar || Math.round(laporan.berat * 10)) : 0,
          status: 'selesai',
          keterangan: `Transaksi ${status === 'dijual' ? 'penjualan' : 'penukaran'} sampah`
        }
      })
      
      // Tambah poin ke user jika ditukar
      if (status === 'ditukar') {
        await prisma.user.update({
          where: { id: laporan.userId },
          data: { poin: { increment: Math.round(laporan.berat * 10) } }
        })
      }
      
      return NextResponse.json({ 
        success: true, 
        data: { laporan, transaksi } 
      })
    }
    
    return NextResponse.json({ 
      success: true, 
      data: laporan 
    })
    
  } catch (error) {
    console.error('Error PUT:', error)
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

// ============================================
// DELETE: Hapus laporan (Admin)
// ============================================
export async function DELETE(req) {
  try {
    const token = getTokenFromRequest(req)
    const decoded = verifyToken(token)
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Silakan login dulu!' },
        { status: 401 }
      )
    }
    
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Hanya admin yang bisa menghapus!' },
        { status: 403 }
      )
    }
    
    const { id } = await req.json()
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID wajib diisi!' },
        { status: 400 }
      )
    }
    
    await prisma.laporanSampah.delete({ where: { id } })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Laporan dihapus!' 
    })
    
  } catch (error) {
    console.error('Error DELETE:', error)
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}