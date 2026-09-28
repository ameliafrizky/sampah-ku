import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

// PATCH tandai notifikasi sudah dibaca
export async function PATCH(req, { params }) {
  try {
    const token = getTokenFromRequest(req)
    const decoded = verifyToken(token)
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const { isRead } = await req.json()

    const notif = await prisma.notifikasi.update({
      where: { id },
      data: { isRead }
    })

    return NextResponse.json(notif)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}