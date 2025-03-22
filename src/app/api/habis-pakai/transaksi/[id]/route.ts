import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Ambil TransaksiBarangHabisPakai berdasarkan ID
export async function GET({ params }: { params: { id: string } }) {
  const { id } = params;
  
  const transaksi = await prisma.transaksiBarangHabisPakai.findUnique({
    where: { id: Number(id) },
  });
  
  if (!transaksi) {
    return NextResponse.json({ error: "Transaksi tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json(transaksi);
}

// PUT: Update TransaksiBarangHabisPakai
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await req.json();

  try {
    // Perbarui transaksi dengan field yang sesuai, tanpa properti "jumlah" yang tidak ada
    const updatedTransaksi = await prisma.transaksiBarangHabisPakai.update({
      where: { id: Number(id) },
      data: {
        barangId: Number(body.barangId),
        jumlah_terima: Number(body.jumlah_terima),
        jumlah_keluar: Number(body.jumlah_keluar),
        jumlah_sisa: Number(body.jumlah_terima) - Number(body.jumlah_keluar),
        uraian: body.uraian.trim(),
        tanda_bukti: body.tanda_bukti.trim(),
      },
    });

    return NextResponse.json(updatedTransaksi);
  } catch (error) {
    console.error("Error saat mengupdate TransaksiBarangHabisPakai:", error);
    return NextResponse.json({ error: "Gagal mengupdate TransaksiBarangHabisPakai" }, { status: 500 });
  }
}

// DELETE: Hapus TransaksiBarangHabisPakai
export async function DELETE({ params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await prisma.transaksiBarangHabisPakai.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: "Transaksi berhasil dihapus" });
  } catch (error) {
    console.error("Error saat menghapus TransaksiBarangHabisPakai:", error);
    return NextResponse.json({ error: "Gagal menghapus TransaksiBarangHabisPakai" }, { status: 500 });
  }
}
