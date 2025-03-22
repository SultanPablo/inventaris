/*
  Warnings:

  - You are about to drop the column `golonganId` on the `Kategori` table. All the data in the column will be lost.
  - Added the required column `kategoriId` to the `Golongan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Kategori" DROP CONSTRAINT "Kategori_golonganId_fkey";

-- AlterTable
ALTER TABLE "Golongan" ADD COLUMN     "kategoriId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Kategori" DROP COLUMN "golonganId";

-- AddForeignKey
ALTER TABLE "Golongan" ADD CONSTRAINT "Golongan_kategoriId_fkey" FOREIGN KEY ("kategoriId") REFERENCES "Kategori"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
