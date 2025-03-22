import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PUT: Update kategori
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const kategori = await prisma.kategori.update({
    where: { id: Number(params.id) },
    data: { nama: body.nama },
  });
  return NextResponse.json(kategori);
}

// DELETE: Hapus kategori
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await prisma.kategori.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ message: "Deleted" });
}
