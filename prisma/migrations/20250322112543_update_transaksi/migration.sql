/*
  Warnings:

  - You are about to drop the column `jumlah` on the `TransaksiBarangHabisPakai` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TransaksiBarangHabisPakai" DROP COLUMN "jumlah",
ADD COLUMN     "jumlah_keluar" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "jumlah_sisa" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "jumlah_terima" INTEGER NOT NULL DEFAULT 0;
