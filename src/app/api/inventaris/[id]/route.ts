import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Ambil satu data inventaris berdasarkan ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  try {
    const idNum = parseInt(id);
    if (isNaN(idNum)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const inventaris = await prisma.inventaris.findUnique({
      where: { id: idNum },
      include: {
        ruangan: true,
        golongan: true,
      },
    });

    if (!inventaris) {
      return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(inventaris);
  } catch (error: unknown) {
    console.error("Error GET:", error);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

// PUT: Update data inventaris berdasarkan ID
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  try {
    const idNum = parseInt(id);
    if (isNaN(idNum)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }
    const body = await req.json();
    const updatedInventaris = await prisma.inventaris.update({
      where: { id: idNum },
      data: {
        namaInventaris: body.namaInventaris,
        idRuangan: body.idRuangan ? parseInt(body.idRuangan) : undefined,
        idGolongan: body.idGolongan ? parseInt(body.idGolongan) : undefined,
        tahunPerolehan: body.tahunPerolehan ? parseInt(body.tahunPerolehan) : undefined,
        hargaPerolehan: body.hargaPerolehan ? parseFloat(body.hargaPerolehan) : undefined,
        bahanMerk: body.bahanMerk || undefined,
        masaManfaat: body.masaManfaat ? parseInt(body.masaManfaat) : undefined,
        umurAset: body.umurAset ? parseInt(body.umurAset) : undefined,
        nilaiResidu: body.nilaiResidu ? parseFloat(body.nilaiResidu) : undefined,
        persentaseGarisLurus: body.persentaseGarisLurus ? parseFloat(body.persentaseGarisLurus) : undefined,
        nilaiYangDapatDisusutkan: body.nilaiYangDapatDisusutkan
          ? parseFloat(body.nilaiYangDapatDisusutkan)
          : undefined,
        bebanPenyusutanPerTahun: body.bebanPenyusutanPerTahun
          ? parseFloat(body.bebanPenyusutanPerTahun)
          : undefined,
        nilaiBukuAkhir: body.nilaiBukuAkhir ? parseFloat(body.nilaiBukuAkhir) : undefined,
        jumlah: body.jumlah ? parseInt(body.jumlah) : undefined,
        kondisi: body.kondisi || undefined,
        barcode: `${body.namaInventaris}, ${body.bahanMerk}, ${body.tahunPerolehan}, ${body.kondisi}`,
      },
    });

    return NextResponse.json(updatedInventaris);
  } catch (error: unknown) {
    console.error("Error PUT:", error);
    return NextResponse.json({ error: "Gagal memperbarui data" }, { status: 500 });
  }
}

// DELETE: Hapus inventaris berdasarkan ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  try {
    const idNum = parseInt(id);
    if (isNaN(idNum)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }
    await prisma.inventaris.delete({ where: { id: idNum } });
    return NextResponse.json({ message: "Data berhasil dihapus" });
  } catch (error: unknown) {
    console.error("Error DELETE:", error);
    return NextResponse.json({ error: "Gagal menghapus data" }, { status: 500 });
  }
}
