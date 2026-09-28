import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

export async function PUT(req, { params }) {
  try {
    const token = getTokenFromRequest(req)
    const decoded = verifyToken(token)
    
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const { namaJenis, kategori, hargaPerKg, deskripsi } = await req.json()

    const item = await prisma.jenisSampah.update({
      where: { id },
      data: { namaJenis, kategori, hargaPerKg: parseInt(hargaPerKg), deskripsi }
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  try {
    const token = getTokenFromRequest(req)
    const decoded = verifyToken(token)
    
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    await prisma.jenisSampah.update({
      where: { id },
      data: { isActive: false }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}