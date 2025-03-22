import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PUT: Update kategori berdasarkan ID
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  const body = await req.json();
  try {
    if (!body.nama) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 });
    }
    const updatedKategori = await prisma.kategori.update({
      where: { id: Number(id) },
      data: { nama: body.nama.trim() },
    });
    return NextResponse.json(updatedKategori);
  } catch (error: unknown) {
    console.error("Error saat mengupdate kategori:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Gagal mengupdate kategori", message }, { status: 500 });
  }
}

// DELETE: Hapus kategori berdasarkan ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  try {
    await prisma.kategori.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "Deleted" });
  } catch (error: unknown) {
    console.error("Error saat menghapus kategori:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Gagal menghapus kategori", message }, { status: 500 });
  }
}
