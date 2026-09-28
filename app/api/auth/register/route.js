import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/db'

export async function POST(request) {
  try {
    const { name, email, password, noHp, alamat } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Nama, email, dan password wajib diisi!' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password minimal 6 karakter!' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email sudah terdaftar!' },
        { status: 400 }
      )
    }

    const hashedPassword = await hash(password, 10)

    const user = await prisma.user.create({
      data: {
        id: `user-${Date.now()}`,
        nama: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        noHp: noHp || null,
        alamat: alamat || null,
        role: 'nasabah',
        poin: 0,
        isActive: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Registrasi berhasil!',
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role,
        poin: user.poin
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { message: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}