import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

// GET semua notifikasi user
export async function GET(req) {
  try {
    const token = getTokenFromRequest(req)
    const decoded = verifyToken(token)
    
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const notifikasi = await prisma.notifikasi.findMany({
      where: { userId: decoded.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(notifikasi)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}