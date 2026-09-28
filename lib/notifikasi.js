import { prisma } from '@/lib/db'

export async function buatNotifikasi(userId, judul, pesan, tipe = 'info') {
  try {
    const notif = await prisma.notifikasi.create({
      data: {
        userId,
        judul,
        pesan,
        tipe
      }
    })
    return notif
  } catch (error) {
    console.error('Error buat notifikasi:', error)
    return null
  }
}