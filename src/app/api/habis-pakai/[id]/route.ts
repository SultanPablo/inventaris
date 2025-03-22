import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Ambil BarangHabisPakai berdasarkan ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  try {
    const barang = await prisma.barangHabisPakai.findUnique({
      where: { id: Number(id) },
    });
    if (!barang) {
      return NextResponse.json({ error: "Barang tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json(barang);
  } catch (error: unknown) {
    console.error("Error saat mengambil BarangHabisPakai:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Gagal mengambil BarangHabisPakai", message }, { status: 500 });
  }
}

// PUT: Update BarangHabisPakai
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  try {
    const body = await req.json();
    if (!body.nama || !body.tahun_anggaran || !body.satuan) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 });
    }
    const updatedBarang = await prisma.barangHabisPakai.update({
      where: { id: Number(id) },
      data: {
        nama: body.nama.trim(),
        tahun_anggaran: Number(body.tahun_anggaran),
        satuan: body.satuan.trim(),
      },
    });
    return NextResponse.json(updatedBarang);
  } catch (error: unknown) {
    console.error("Error saat mengupdate BarangHabisPakai:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Gagal mengupdate BarangHabisPakai", message }, { status: 500 });
  }
}

// DELETE: Hapus BarangHabisPakai
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  try {
    await prisma.barangHabisPakai.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: "BarangHabisPakai berhasil dihapus" });
  } catch (error: unknown) {
    console.error("Error saat menghapus BarangHabisPakai:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Gagal menghapus BarangHabisPakai", message }, { status: 500 });
  }
}
