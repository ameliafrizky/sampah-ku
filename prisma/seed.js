import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Mulai seeding data...')

  // 1. Hapus semua data yang ada (biar ga error duplikat)
  await prisma.transaksi.deleteMany()
  await prisma.laporanSampah.deleteMany()
  await prisma.fotoSampah.deleteMany()
  await prisma.notifikasi.deleteMany()
  await prisma.verifikasiLaporan.deleteMany()
  await prisma.user.deleteMany()
  await prisma.jenisSampah.deleteMany()
  await prisma.wilayah.deleteMany()
  
  console.log('✅ Data lama dihapus')

  // 2. Buat Admin
  const passwordAdmin = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      nama: 'Admin SampahKu',
      email: 'admin@sampahku.com',
      password: passwordAdmin,
      noHp: '081234567890',
      role: 'admin',
      alamat: 'Jakarta Pusat'
    }
  })
  console.log(`✅ Admin created: ${admin.email}`)

  // 3. Buat Nasabah
  const passwordNasabah = await bcrypt.hash('nasabah123', 10)
  const nasabah = await prisma.user.create({
    data: {
      nama: 'Budi Nasabah',
      email: 'budi@email.com',
      password: passwordNasabah,
      noHp: '081298765432',
      role: 'nasabah',
      alamat: 'Jakarta Selatan'
    }
  })
  console.log(`✅ Nasabah created: ${nasabah.email}`)

  // 4. Jenis Sampah
  await prisma.jenisSampah.createMany({
    data: [
      { namaJenis: 'Kertas', kategori: 'Anorganik', hargaPerKg: 2000 },
      { namaJenis: 'Plastik', kategori: 'Anorganik', hargaPerKg: 3000 },
      { namaJenis: 'Kaca', kategori: 'Anorganik', hargaPerKg: 1500 },
      { namaJenis: 'Logam', kategori: 'Anorganik', hargaPerKg: 5000 },
      { namaJenis: 'Sisa Makanan', kategori: 'Organik', hargaPerKg: 1000 },
      { namaJenis: 'Daun', kategori: 'Organik', hargaPerKg: 800 },
      { namaJenis: 'Kardus', kategori: 'Anorganik', hargaPerKg: 2500 },
      { namaJenis: 'Botol Plastik', kategori: 'Anorganik', hargaPerKg: 3500 },
    ]
  })
  console.log('✅ Jenis sampah created')

  // 5. WILAYAH LENGKAP (29 KECAMATAN JAKARTA)
  const wilayahData = [
    'Gambir - Jakarta Pusat',
    'Senen - Jakarta Pusat',
    'Tanah Abang - Jakarta Pusat',
    'Menteng - Jakarta Pusat',
    'Cempaka Putih - Jakarta Pusat',
    'Tanjung Priok - Jakarta Utara',
    'Penjaringan - Jakarta Utara',
    'Kelapa Gading - Jakarta Utara',
    'Cilincing - Jakarta Utara',
    'Pademangan - Jakarta Utara',
    'Taman Sari - Jakarta Barat',
    'Grogol Petamburan - Jakarta Barat',
    'Kembangan - Jakarta Barat',
    'Kalideres - Jakarta Barat',
    'Cengkareng - Jakarta Barat',
    'Tambora - Jakarta Barat',
    'Kebayoran Baru - Jakarta Selatan',
    'Pasar Minggu - Jakarta Selatan',
    'Cilandak - Jakarta Selatan',
    'Mampang Prapatan - Jakarta Selatan',
    'Pancoran - Jakarta Selatan',
    'Tebet - Jakarta Selatan',
    'Setiabudi - Jakarta Selatan',
    'Jatinegara - Jakarta Timur',
    'Pulo Gadung - Jakarta Timur',
    'Kramat Jati - Jakarta Timur',
    'Cakung - Jakarta Timur',
    'Duren Sawit - Jakarta Timur',
    'Ciracas - Jakarta Timur',
  ]

  for (const nama of wilayahData) {
    await prisma.wilayah.create({
      data: { namaWilayah: nama }
    })
  }
  console.log(`✅ ${wilayahData.length} Wilayah created`)

  // 6. Laporan + Transaksi + FOTO
  const jenisKertas = await prisma.jenisSampah.findFirst({ where: { namaJenis: 'Kertas' } })
  const jenisBotol = await prisma.jenisSampah.findFirst({ where: { namaJenis: 'Botol Plastik' } })
  const wilayah1 = await prisma.wilayah.findFirst({ where: { namaWilayah: 'Gambir - Jakarta Pusat' } })
  const wilayah2 = await prisma.wilayah.findFirst({ where: { namaWilayah: 'Kalideres - Jakarta Barat' } })

  if (jenisKertas && wilayah1) {
    const laporan1 = await prisma.laporanSampah.create({
      data: {
        berat: 5.5,
        userId: nasabah.id,
        jenisSampahId: jenisKertas.id,
        wilayahId: wilayah1.id,
        catatan: 'Kertas bekas dari kantor',
        status: 'diverifikasi'
      }
    })
    console.log('✅ Laporan 1 created')

    await prisma.fotoSampah.create({
      data: {
        imageUrl: 'https://via.placeholder.com/300x200/98D8C8/1A5C44?text=Foto+Sampah+1',
        laporanId: laporan1.id
      }
    })
    console.log('✅ Foto 1 created')

    await prisma.transaksi.create({
      data: {
        kodeTransaksi: `TRX-${Date.now()}`,
        tipeTransaksi: 'jual',
        laporanId: laporan1.id,
        adminId: admin.id,
        hargaJual: Math.round(laporan1.berat * jenisKertas.hargaPerKg),
        poinDitukar: 0,
        status: 'selesai',
        keterangan: 'Penjualan kertas'
      }
    })
    console.log('✅ Transaksi created')
  }

  if (jenisBotol && wilayah2) {
    const laporan2 = await prisma.laporanSampah.create({
      data: {
        berat: 5,
        userId: nasabah.id,
        jenisSampahId: jenisBotol.id,
        wilayahId: wilayah2.id,
        catatan: 'Botol plastik bekas minuman',
        status: 'pending'
      }
    })
    console.log('✅ Laporan 2 created')

    await prisma.fotoSampah.create({
      data: {
        imageUrl: 'https://via.placeholder.com/300x200/98D8C8/1A5C44?text=Foto+Sampah+2',
        laporanId: laporan2.id
      }
    })
    console.log('✅ Foto 2 created')
  }

  console.log('🎉 Seeding selesai!')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })