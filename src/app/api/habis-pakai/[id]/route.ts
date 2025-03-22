import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Ambil BarangHabisPakai berdasarkan ID
export async function GET({ params }: { params: { id: string } }) {
  const { id } = params;
  
  const barang = await prisma.barangHabisPakai.findUnique({
    where: { id: Number(id) },
  });
  
  if (!barang) {
    return NextResponse.json({ error: "Barang tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json(barang);
}

// PUT: Update BarangHabisPakai
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await req.json();

  try {
    const updatedBarang = await prisma.barangHabisPakai.update({
      where: { id: Number(id) },
      data: {
        nama: body.nama.trim(),
        tahun_anggaran: Number(body.tahun_anggaran),
        satuan: body.satuan.trim(),
      },
    });

    return NextResponse.json(updatedBarang);
  } catch (error) {
    console.error("Error saat mengupdate BarangHabisPakai:", error);
    return NextResponse.json({ error: "Gagal mengupdate BarangHabisPakai" }, { status: 500 });
  }
}

// DELETE: Hapus BarangHabisPakai
export async function DELETE({ params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await prisma.barangHabisPakai.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: "BarangHabisPakai berhasil dihapus" });
  } catch (error) {
    console.error("Error saat menghapus BarangHabisPakai:", error);
    return NextResponse.json({ error: "Gagal menghapus BarangHabisPakai" }, { status: 500 });
  }
}
