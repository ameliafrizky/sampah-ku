import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

export async function GET(req) {
  try {
    const token = getTokenFromRequest(req)
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token tidak ditemukan!' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Token tidak valid!' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    const targetUserId = userId || decoded.id

    const transaksi = await prisma.transaksiPenukaran.findMany({
      where: { userId: targetUserId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(transaksi)
  } catch (error) {
    console.error('Error GET transaksi:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

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

    const body = await req.json()
    console.log('Body request:', body)  // ✅ DEBUG

    const { hadiah, poinDigunakan } = body

    if (!hadiah || !poinDigunakan) {
      return NextResponse.json(
        { error: 'Hadiah dan poin wajib diisi!' },
        { status: 400 }
      )
    }

    if (poinDigunakan <= 0) {
      return NextResponse.json(
        { error: 'Poin harus lebih dari 0!' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    })

    console.log('User ditemukan:', user?.nama, 'Poin:', user?.poin)  // ✅ DEBUG

    if (!user) {
      return NextResponse.json(
        { error: 'User tidak ditemukan!' },
        { status: 404 }
      )
    }

    if (user.poin < poinDigunakan) {
      return NextResponse.json(
        { error: `Poin tidak mencukupi! Kamu punya ${user.poin} poin, butuh ${poinDigunakan} poin` },
        { status: 400 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id: decoded.id },
      data: {
        poin: user.poin - poinDigunakan
      }
    })

    const transaksi = await prisma.transaksiPenukaran.create({
      data: {
        kodeTransaksi: `TUKAR-${Date.now()}`,
        userId: decoded.id,
        poinDigunakan: poinDigunakan,
        hadiah: hadiah,
        status: 'sukses',
        tanggalTransaksi: new Date()
      }
    })

    await prisma.notifikasi.create({
      data: {
        userId: decoded.id,
        judul: '🔄 Penukaran Poin Berhasil',
        pesan: `Kamu berhasil menukarkan ${poinDigunakan} poin untuk ${hadiah}!`,
        tipe: 'success'
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Poin berhasil ditukarkan!',
      data: {
        user: updatedUser,
        transaksi
      }
    })

  } catch (error) {
    console.error('Error POST transaksi:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}