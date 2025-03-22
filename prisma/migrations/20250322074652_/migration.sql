/*
  Warnings:

  - Added the required column `tanda_bukti` to the `TransaksiBarangHabisPakai` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uraian` to the `TransaksiBarangHabisPakai` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BarangHabisPakai" ADD COLUMN     "kode_barang" VARCHAR(255);

-- AlterTable
ALTER TABLE "TransaksiBarangHabisPakai" ADD COLUMN     "tanda_bukti" VARCHAR(255) NOT NULL,
ADD COLUMN     "uraian" TEXT NOT NULL;
