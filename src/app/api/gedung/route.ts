import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log("Fetching gedung data...");
    
    const gedung = await prisma.gedung.findMany();
    
    if (!gedung.length) {
      return NextResponse.json({ error: "Tidak ada data gedung" }, { status: 404 });
    }

    return NextResponse.json(gedung);
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching gedung:", errMessage);
    
    return NextResponse.json(
      { error: "Gagal mengambil data gedung", message: errMessage },
      { status: 500 }
    );
  }
}
