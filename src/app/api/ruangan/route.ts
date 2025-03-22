import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Ambil semua ruangan (bisa difilter berdasarkan gedungId)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const gedungId = searchParams.get("gedungId");

    const ruangan = await prisma.ruangan.findMany({
      where: gedungId ? { gedungId: parseInt(gedungId) } : undefined,
      include: { gedung: true },
    });

    return NextResponse.json(ruangan);
  } catch (error) {
    console.error("Error saat mengambil ruangan:", error);
    return NextResponse.json({ error: "Gagal mengambil data ruangan" }, { status: 500 });
  }
}

// POST: Tambah ruangan baru
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.nama || !body.gedungId) {
      return NextResponse.json({ error: "Nama dan Gedung harus diisi" }, { status: 400 });
    }

    const ruangan = await prisma.ruangan.create({
      data: {
        nama: body.nama.trim(),
        gedungId: parseInt(body.gedungId),
      },
    });

    return NextResponse.json(ruangan);
  } catch (error) {
    console.error("Error saat menambah ruangan:", error);
    return NextResponse.json({ error: "Gagal menambah ruangan" }, { status: 500 });
  }
}
