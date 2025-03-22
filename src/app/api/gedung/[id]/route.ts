import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Ambil gedung berdasarkan ID (dynamic route)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  try {
    console.log(`Mengambil data gedung dengan id: ${id}`);
    const gedung = await prisma.gedung.findUnique({
      where: { id: Number(id) },
      include: { ruangan: true },
    });
    if (!gedung) {
      return NextResponse.json({ error: "Data gedung tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json(gedung);
  } catch (error: unknown) {
    console.error("Error saat mengambil gedung:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Gagal mengambil data gedung", message }, { status: 500 });
  }
}

// PUT: Update gedung berdasarkan ID
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  try {
    const body = await req.json();

    if (!body.nama) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 });
    }

    const updatedGedung = await prisma.gedung.update({
      where: { id: Number(id) },
      data: { nama: body.nama.trim() },
    });

    return NextResponse.json(updatedGedung);
  } catch (error: unknown) {
    console.error("Error saat mengupdate gedung:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Gagal mengupdate gedung", message }, { status: 500 });
  }
}

// DELETE: Hapus gedung berdasarkan ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  try {
    const deletedGedung = await prisma.gedung.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: "Gedung berhasil dihapus", data: deletedGedung });
  } catch (error: unknown) {
    console.error("Error saat menghapus gedung:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Gagal menghapus gedung", message }, { status: 500 });
  }
}
