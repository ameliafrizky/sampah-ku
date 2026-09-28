-- CreateTable
CREATE TABLE "TransaksiPenukaran" (
    "id" TEXT NOT NULL,
    "kodeTransaksi" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "poinDigunakan" INTEGER NOT NULL,
    "hadiah" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'sukses',
    "tanggalTransaksi" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransaksiPenukaran_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TransaksiPenukaran_kodeTransaksi_key" ON "TransaksiPenukaran"("kodeTransaksi");

-- AddForeignKey
ALTER TABLE "TransaksiPenukaran" ADD CONSTRAINT "TransaksiPenukaran_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
