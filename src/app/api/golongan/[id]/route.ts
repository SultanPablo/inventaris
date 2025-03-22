import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Ambil golongan berdasarkan ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  try {
    const golongan = await prisma.golongan.findUnique({
      where: { id: Number(id) },
      include: { kategori: true },
    });
    if (!golongan) {
      return NextResponse.json({ error: "Golongan tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json(golongan);
  } catch (error: unknown) {
    console.error("Error saat mengambil golongan:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Gagal mengambil golongan", message }, { status: 500 });
  }
}

// PUT: Update golongan berdasarkan ID
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  try {
    const body = await req.json();

    if (!body.nama || !body.kode_golongan || !body.kategoriId) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 });
    }

    const updatedGolongan = await prisma.golongan.update({
      where: { id: Number(id) },
      data: {
        nama: body.nama.trim(),
        kode_golongan: body.kode_golongan.trim(),
        kategoriId: Number(body.kategoriId),
      },
    });

    return NextResponse.json(updatedGolongan);
  } catch (error: unknown) {
    console.error("Error saat mengupdate golongan:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Gagal mengupdate golongan", message }, { status: 500 });
  }
}

// DELETE: Hapus golongan berdasarkan ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  try {
    const deletedGolongan = await prisma.golongan.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: "Golongan berhasil dihapus", data: deletedGolongan });
  } catch (error: unknown) {
    console.error("Error saat menghapus golongan:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Gagal menghapus golongan", message }, { status: 500 });
  }
}
