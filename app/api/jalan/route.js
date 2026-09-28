import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const wilayahId = searchParams.get('wilayahId')

    const where = {}
    if (wilayahId) where.wilayahId = wilayahId

    const jalan = await prisma.jalan.findMany({
      where,
      include: {
        wilayah: true
      },
      orderBy: { namaJalan: 'asc' }
    })

    return NextResponse.json(jalan)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}