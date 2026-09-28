import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const jenisSampah = await prisma.jenisSampah.findMany({
      where: { isActive: true },
      orderBy: { namaJenis: 'asc' }
    })
    return NextResponse.json(jenisSampah)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const { namaJenis, kategori, hargaPerKg, satuan, deskripsi } = await request.json()

    if (!namaJenis || !kategori || !hargaPerKg) {
      return NextResponse.json(
        { error: 'Nama jenis, kategori, dan harga per kg wajib diisi!' },
        { status: 400 }
      )
    }

    const jenisSampah = await prisma.jenisSampah.create({
      data: {
        namaJenis,
        kategori,
        hargaPerKg: parseInt(hargaPerKg),
        satuan: satuan || 'kg',
        deskripsi: deskripsi || '',
        isActive: true
      }
    })

    return NextResponse.json(jenisSampah, { status: 201 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}