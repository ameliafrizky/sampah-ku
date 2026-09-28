import { NextResponse } from 'next/server'

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
    
    // ✅ KONVERSI KE BASE64 (BIAR GA PERLU SERVER STORAGE)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`
    
    return NextResponse.json({ 
      success: true, 
      url: dataUrl,
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