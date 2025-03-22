import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Ambil TransaksiBarangHabisPakai berdasarkan ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  try {
    const transaksi = await prisma.transaksiBarangHabisPakai.findUnique({
      where: { id: Number(id) },
    });
    if (!transaksi) {
      return NextResponse.json({ error: "Transaksi tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json(transaksi);
  } catch (error: unknown) {
    console.error("Error saat mengambil TransaksiBarangHabisPakai:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Gagal mengambil TransaksiBarangHabisPakai", message }, { status: 500 });
  }
}

// PUT: Update TransaksiBarangHabisPakai
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  try {
    const body = await req.json();
    if (
      !body.barangId ||
      body.jumlah_terima === undefined ||
      body.jumlah_keluar === undefined ||
      !body.uraian ||
      !body.tanda_bukti
    ) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 });
    }
    const updatedTransaksi = await prisma.transaksiBarangHabisPakai.update({
      where: { id: Number(id) },
      data: {
        barangId: Number(body.barangId),
        jumlah_terima: Number(body.jumlah_terima),
        jumlah_keluar: Number(body.jumlah_keluar),
        // Hitung jumlah_sisa sebagai selisih jumlah_terima dan jumlah_keluar
        jumlah_sisa: Number(body.jumlah_terima) - Number(body.jumlah_keluar),
        uraian: body.uraian.trim(),
        tanda_bukti: body.tanda_bukti.trim(),
      },
    });
    return NextResponse.json(updatedTransaksi);
  } catch (error: unknown) {
    console.error("Error saat mengupdate TransaksiBarangHabisPakai:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Gagal mengupdate TransaksiBarangHabisPakai", message }, { status: 500 });
  }
}

// DELETE: Hapus TransaksiBarangHabisPakai
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  try {
    await prisma.transaksiBarangHabisPakai.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: "Transaksi berhasil dihapus" });
  } catch (error: unknown) {
    console.error("Error saat menghapus TransaksiBarangHabisPakai:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Gagal menghapus TransaksiBarangHabisPakai", message }, { status: 500 });
  }
}
