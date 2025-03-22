import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Ambil semua kategori
export async function GET() {
  const kategori = await prisma.kategori.findMany({
    include: { golongan: true },
  });
  return NextResponse.json(kategori);
}

// POST: Tambah kategori
export async function POST(req: Request) {
  const body = await req.json();
  const kategori = await prisma.kategori.create({
    data: { nama: body.nama },
  });
  return NextResponse.json(kategori);
}
