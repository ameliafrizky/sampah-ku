import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

export async function PATCH(req, { params }) {
  try {
    const token = getTokenFromRequest(req)
    const decoded = verifyToken(token)
    
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { isActive, role } = await req.json()

    const data = {}
    if (isActive !== undefined) data.isActive = isActive
    if (role) data.role = role

    const user = await prisma.user.update({
      where: { id },
      data
    })

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}