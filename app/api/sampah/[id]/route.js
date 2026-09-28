import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

export async function PUT(req, { params }) {
  try {
    // ✅ WAJIB pake await untuk params
    const { id } = await params
    
    const token = getTokenFromRequest(req)
    const decoded = verifyToken(token)
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized!' },
        { status: 401 }
      )
    }
    
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Hanya admin yang bisa memproses!' },
        { status: 403 }
      )
    }
    
    const { status, hargaJual, poinDitukar } = await req.json()
    
    const allowedStatus = ['pending', 'diverifikasi', 'dijual', 'ditukar']
    if (!allowedStatus.includes(status)) {
      return NextResponse.json(
        { error: 'Status tidak valid!' },
        { status: 400 }
      )
    }
    
    // Update laporan
    const laporan = await prisma.laporanSampah.update({
      where: { id },
      data: {
        status,
        adminId: decoded.id
      },
      include: {
        user: true,
        jenisSampah: true,
        wilayah: true
      }
    })
    
    // Kalo status dijual atau ditukar, buat transaksi
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
      
      // Tambah poin ke user (kalo ditukar)
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
    
    return NextResponse.json({ success: true, data: laporan })
    
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}