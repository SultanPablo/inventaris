import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Ambil semua golongan
export async function GET() {
  const golongan = await prisma.golongan.findMany({
    include: { kategori: true },
  });
  return NextResponse.json(golongan);
}

// POST: Tambah golongan
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.nama || !body.kode_golongan || !body.kategoriId) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 });
    }

    const golongan = await prisma.golongan.create({
      data: {
        nama: body.nama.trim(), // Trim spasi di awal/akhir
        kode_golongan: body.kode_golongan.trim(), // Trim kode juga
        kategoriId: Number(body.kategoriId),
      },
    });

    return NextResponse.json(golongan);
  } catch (error) {
    console.error("Error saat menambah golongan:", error);
    return NextResponse.json({ error: "Gagal menambah golongan" }, { status: 500 });
  }
}