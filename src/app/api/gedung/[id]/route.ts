import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PUT: Memperbarui gedung berdasarkan ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();

    if (!body.nama) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 });
    }

    const gedung = await prisma.gedung.update({
      where: { id: parseInt(id) },
      data: { nama: body.nama.trim() },
    });

    return NextResponse.json(gedung);
  } catch (error) {
    console.error("Error saat memperbarui gedung:", error);
    return NextResponse.json({ error: "Gagal memperbarui gedung" }, { status: 500 });
  }
}

// DELETE: Menghapus gedung berdasarkan ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const gedung = await prisma.gedung.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Gedung berhasil dihapus", gedung });
  } catch (error) {
    console.error("Error saat menghapus gedung:", error);
    return NextResponse.json({ error: "Gagal menghapus gedung" }, { status: 500 });
  }
}
