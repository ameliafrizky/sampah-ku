import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('foto')
    
    if (!file) {
      return NextResponse.json(
        { error: 'Tidak ada file yang diupload' },
        { status: 400 }
      )
    }
    
    // Validasi tipe file
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Format file tidak didukung. Gunakan JPG, PNG, atau WEBP.' },
        { status: 400 }
      )
    }
    
    // Validasi ukuran (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Ukuran file maksimal 2MB' },
        { status: 400 }
      )
    }
    
    // Buat nama file unik
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(7)
    const extension = file.name.split('.').pop()
    const filename = `sampah-${timestamp}-${randomStr}.${extension}`
    
    // Tentukan path
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    const filePath = path.join(uploadDir, filename)
    
    // Buat folder jika belum ada
    await mkdir(uploadDir, { recursive: true })
    
    // Simpan file
    await writeFile(filePath, buffer)
    
    // Return URL
    const url = `/uploads/${filename}`
    
    return NextResponse.json({ 
      success: true, 
      url,
      message: 'Upload berhasil!' 
    })
    
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Gagal upload foto' },
      { status: 500 }
    )
  }
}