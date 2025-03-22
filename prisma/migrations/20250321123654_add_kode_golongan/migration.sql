/*
  Warnings:

  - Added the required column `kode_golongan` to the `Golongan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Golongan" ADD COLUMN     "kode_golongan" TEXT NOT NULL;
