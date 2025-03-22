import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PUT: Update golongan berdasarkan ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();

    const golongan = await prisma.golongan.update({
      where: { id: Number(id) },
      data: {
        nama: body.nama,
        kode_golongan: body.kode_golongan,
        kategoriId: body.kategoriId,
      },
    });

    return NextResponse.json(golongan);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengupdate golongan" }, { status: 500 });
  }
}

// DELETE: Hapus golongan berdasarkan ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await prisma.golongan.delete({ where: { id: Number(id) } });

    return NextResponse.json({ message: "Golongan berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus golongan" }, { status: 500 });
  }
}
