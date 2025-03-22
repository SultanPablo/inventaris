import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// API handler untuk mendapatkan gedung (GET)
export async function GET() {
  try {
    console.log("Mencoba mengambil data gedung...");

    // Query untuk mendapatkan gedung dan ruangan yang terhubung
    const gedung = await prisma.gedung.findMany({
      include: { ruangan: true },
    });

    console.log("Data Gedung:", gedung); // Menampilkan hasil query

    if (!Array.isArray(gedung) || gedung.length === 0) {
      return NextResponse.json({ error: "Data gedung tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(gedung);
  } catch (error) {
    console.error("Error saat mengambil gedung:", error);
    // Pastikan error merupakan instance dari Error
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Gagal mengambil data gedung", message }, { status: 500 });
  }
}

// POST: Tambah gedung
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.nama) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 });
    }

    // Perbaikan nama tabel, seharusnya 'gedung' bukan 'golongan'
    const gedung = await prisma.gedung.create({
      data: {
        nama: body.nama.trim(),
      },
    });

    return NextResponse.json(gedung);
  } catch (error) {
    console.error("Error saat menambah gedung:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Gagal menambah gedung", message }, { status: 500 });
  }
}
