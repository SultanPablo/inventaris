import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Ambil ruangan berdasarkan ID
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params; // Await context.params
    const ruangan = await prisma.ruangan.findUnique({
      where: { id: Number(id) },
      include: { gedung: true },
    });

    if (!ruangan) {
      return NextResponse.json({ error: "Ruangan tidak ditemukan" }, { status: 404 });
    }
    
    return NextResponse.json(ruangan);
  } catch (error) {
    console.error("Error saat mengambil ruangan:", error);
    return NextResponse.json({ error: "Gagal mengambil ruangan" }, { status: 500 });
  }
}

// PUT: Update ruangan berdasarkan ID
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    if (!body.nama || !body.gedungId) {
      return NextResponse.json({ error: "Nama dan Gedung harus diisi" }, { status: 400 });
    }

    const updatedRuangan = await prisma.ruangan.update({
      where: { id: Number(id) },
      data: {
        nama: body.nama.trim(),
        gedungId: Number(body.gedungId),
      },
    });

    return NextResponse.json(updatedRuangan);
  } catch (error) {
    console.error("Error saat update ruangan:", error);
    return NextResponse.json({ error: "Gagal update ruangan" }, { status: 500 });
  }
}

// DELETE: Hapus ruangan berdasarkan ID
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    await prisma.ruangan.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Ruangan berhasil dihapus" });
  } catch (error) {
    console.error("Error saat hapus ruangan:", error);
    return NextResponse.json({ error: "Gagal hapus ruangan" }, { status: 500 });
  }
}
