-- CreateEnum
CREATE TYPE "Kondisi" AS ENUM ('baik', 'rusak');

-- CreateTable
CREATE TABLE "BarangHabisPakai" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "tahun_anggaran" INTEGER NOT NULL,
    "satuan" TEXT NOT NULL,

    CONSTRAINT "BarangHabisPakai_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gedung" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "alamat" TEXT,

    CONSTRAINT "Gedung_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeojsonData" (
    "id" SERIAL NOT NULL,
    "nama_fitur" TEXT NOT NULL,
    "jenis" TEXT NOT NULL,
    "geometry" TEXT NOT NULL,

    CONSTRAINT "GeojsonData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Golongan" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "Golongan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventaris" (
    "id" SERIAL NOT NULL,
    "idRuangan" INTEGER NOT NULL,
    "idGolongan" INTEGER NOT NULL,
    "namaInventaris" VARCHAR(255) NOT NULL,
    "tahunPerolehan" INTEGER,
    "hargaPerolehan" INTEGER,
    "bahanMerk" VARCHAR(255),
    "masaManfaat" INTEGER,
    "umurAset" INTEGER,
    "nilaiResidu" INTEGER,
    "persentaseGarisLurus" DECIMAL(15,2) NOT NULL,
    "nilaiYangDapatDisusutkan" INTEGER,
    "bebanPenyusutanPerTahun" INTEGER,
    "nilaiBukuAkhir" INTEGER,
    "jumlah" INTEGER,
    "kondisi" "Kondisi" NOT NULL,
    "barcode" VARCHAR(255),

    CONSTRAINT "Inventaris_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kategori" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "golonganId" INTEGER NOT NULL,

    CONSTRAINT "Kategori_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ruangan" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "gedungId" INTEGER,

    CONSTRAINT "Ruangan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransaksiBarangHabisPakai" (
    "id" SERIAL NOT NULL,
    "barangId" INTEGER NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "tanggal_transaksi" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransaksiBarangHabisPakai_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Inventaris" ADD CONSTRAINT "Inventaris_idRuangan_fkey" FOREIGN KEY ("idRuangan") REFERENCES "Ruangan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventaris" ADD CONSTRAINT "Inventaris_idGolongan_fkey" FOREIGN KEY ("idGolongan") REFERENCES "Golongan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kategori" ADD CONSTRAINT "Kategori_golonganId_fkey" FOREIGN KEY ("golonganId") REFERENCES "Golongan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ruangan" ADD CONSTRAINT "Ruangan_gedungId_fkey" FOREIGN KEY ("gedungId") REFERENCES "Gedung"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransaksiBarangHabisPakai" ADD CONSTRAINT "TransaksiBarangHabisPakai_barangId_fkey" FOREIGN KEY ("barangId") REFERENCES "BarangHabisPakai"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
