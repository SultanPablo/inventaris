/*
  Warnings:

  - You are about to alter the column `nama` on the `BarangHabisPakai` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `satuan` on the `BarangHabisPakai` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to drop the column `alamat` on the `Gedung` table. All the data in the column will be lost.
  - You are about to alter the column `nama` on the `Gedung` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `nama_fitur` on the `GeojsonData` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `jenis` on the `GeojsonData` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `geometry` on the `GeojsonData` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `nama` on the `Golongan` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `kode_golongan` on the `Golongan` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `nama` on the `Kategori` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `nama` on the `Ruangan` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "BarangHabisPakai" ALTER COLUMN "nama" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "satuan" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "Gedung" DROP COLUMN "alamat",
ALTER COLUMN "nama" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "GeojsonData" ALTER COLUMN "nama_fitur" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "jenis" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "geometry" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "Golongan" ALTER COLUMN "nama" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "kode_golongan" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "Kategori" ALTER COLUMN "nama" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "Ruangan" ALTER COLUMN "nama" SET DATA TYPE VARCHAR(255);
