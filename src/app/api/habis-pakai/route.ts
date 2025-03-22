import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Ambil semua BarangHabisPakai
export async function GET() {
  const barang = await prisma.barangHabisPakai.findMany();
  return NextResponse.json(barang);
}

// POST: Tambah BarangHabisPakai
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.nama || !body.tahun_anggaran || !body.satuan) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 });
    }

    const barang = await prisma.barangHabisPakai.create({
      data: {
        nama: body.nama.trim(),
        tahun_anggaran: Number(body.tahun_anggaran),
        satuan: body.satuan.trim(),
      },
    });

    return NextResponse.json(barang);
  } catch (error) {
    console.error("Error saat menambah BarangHabisPakai:", error);
    return NextResponse.json({ error: "Gagal menambah BarangHabisPakai" }, { status: 500 });
  }
}
