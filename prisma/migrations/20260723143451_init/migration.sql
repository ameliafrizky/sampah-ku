-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "noHp" TEXT NOT NULL,
    "alamat" TEXT,
    "poin" INTEGER NOT NULL DEFAULT 0,
    "role" TEXT NOT NULL DEFAULT 'nasabah',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JenisSampah" (
    "id" TEXT NOT NULL,
    "namaJenis" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "hargaPerKg" INTEGER NOT NULL,
    "satuan" TEXT NOT NULL DEFAULT 'kg',
    "deskripsi" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JenisSampah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wilayah" (
    "id" TEXT NOT NULL,
    "namaWilayah" TEXT NOT NULL,
    "kodePos" TEXT,
    "deskripsi" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wilayah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LaporanSampah" (
    "id" TEXT NOT NULL,
    "berat" DOUBLE PRECISION NOT NULL,
    "tanggalLapor" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "catatan" TEXT,
    "userId" TEXT NOT NULL,
    "adminId" TEXT,
    "jenisSampahId" TEXT NOT NULL,
    "wilayahId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LaporanSampah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FotoSampah" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "deskripsi" TEXT,
    "ukuranFile" TEXT,
    "formatFile" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "laporanId" TEXT,

    CONSTRAINT "FotoSampah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaksi" (
    "id" TEXT NOT NULL,
    "kodeTransaksi" TEXT NOT NULL,
    "tipeTransaksi" TEXT NOT NULL,
    "laporanId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "hargaJual" INTEGER NOT NULL DEFAULT 0,
    "poinDitukar" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'selesai',
    "keterangan" TEXT,
    "tanggalTransaksi" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaksi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notifikasi" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "pesan" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "tipe" TEXT NOT NULL DEFAULT 'info',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notifikasi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_noHp_key" ON "User"("noHp");

-- CreateIndex
CREATE UNIQUE INDEX "JenisSampah_namaJenis_key" ON "JenisSampah"("namaJenis");

-- CreateIndex
CREATE UNIQUE INDEX "Wilayah_namaWilayah_key" ON "Wilayah"("namaWilayah");

-- CreateIndex
CREATE UNIQUE INDEX "FotoSampah_laporanId_key" ON "FotoSampah"("laporanId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaksi_kodeTransaksi_key" ON "Transaksi"("kodeTransaksi");

-- CreateIndex
CREATE UNIQUE INDEX "Transaksi_laporanId_key" ON "Transaksi"("laporanId");

-- AddForeignKey
ALTER TABLE "LaporanSampah" ADD CONSTRAINT "LaporanSampah_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaporanSampah" ADD CONSTRAINT "LaporanSampah_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaporanSampah" ADD CONSTRAINT "LaporanSampah_jenisSampahId_fkey" FOREIGN KEY ("jenisSampahId") REFERENCES "JenisSampah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaporanSampah" ADD CONSTRAINT "LaporanSampah_wilayahId_fkey" FOREIGN KEY ("wilayahId") REFERENCES "Wilayah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FotoSampah" ADD CONSTRAINT "FotoSampah_laporanId_fkey" FOREIGN KEY ("laporanId") REFERENCES "LaporanSampah"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaksi" ADD CONSTRAINT "Transaksi_laporanId_fkey" FOREIGN KEY ("laporanId") REFERENCES "LaporanSampah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaksi" ADD CONSTRAINT "Transaksi_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifikasi" ADD CONSTRAINT "Notifikasi_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
