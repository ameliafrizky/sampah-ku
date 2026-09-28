-- AlterTable
ALTER TABLE "LaporanSampah" ADD COLUMN     "jalanId" TEXT;

-- AlterTable
ALTER TABLE "Wilayah" ADD COLUMN     "kecamatan" TEXT,
ADD COLUMN     "kota" TEXT;

-- CreateTable
CREATE TABLE "Jalan" (
    "id" TEXT NOT NULL,
    "namaJalan" TEXT NOT NULL,
    "wilayahId" TEXT NOT NULL,
    "deskripsi" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Jalan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerifikasiLaporan" (
    "id" TEXT NOT NULL,
    "laporanId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerifikasiLaporan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Jalan_namaJalan_wilayahId_key" ON "Jalan"("namaJalan", "wilayahId");

-- CreateIndex
CREATE UNIQUE INDEX "VerifikasiLaporan_laporanId_adminId_key" ON "VerifikasiLaporan"("laporanId", "adminId");

-- AddForeignKey
ALTER TABLE "Jalan" ADD CONSTRAINT "Jalan_wilayahId_fkey" FOREIGN KEY ("wilayahId") REFERENCES "Wilayah"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaporanSampah" ADD CONSTRAINT "LaporanSampah_jalanId_fkey" FOREIGN KEY ("jalanId") REFERENCES "Jalan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerifikasiLaporan" ADD CONSTRAINT "VerifikasiLaporan_laporanId_fkey" FOREIGN KEY ("laporanId") REFERENCES "LaporanSampah"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerifikasiLaporan" ADD CONSTRAINT "VerifikasiLaporan_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
