import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Ambil semua data inventaris
export async function GET() {
  try {
    const data = await prisma.inventaris.findMany({
      include: {
        ruangan: true,
        golongan: true,
      },
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

// POST - Tambah inventaris baru dengan perhitungan otomatis
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Dapatkan tahun saat ini
    const tahunSaatIni = new Date().getFullYear();
    const tahunPerolehan = body.tahunPerolehan ? parseInt(body.tahunPerolehan) : tahunSaatIni;

    // Hitung umur inventaris secara otomatis
    const umurAset = tahunSaatIni - tahunPerolehan;

    // Konversi ke angka
    const hargaPerolehan = parseFloat(body.hargaPerolehan) || 0;
    const nilaiResidu = parseFloat(body.nilaiResidu) || 0;
    const persentaseGarisLurus = parseFloat(body.persentaseGarisLurus) || 0;

    // Perhitungan penyusutan
    const nilaiYangDapatDisusutkan = hargaPerolehan - nilaiResidu;
    const bebanPenyusutanPerTahun = nilaiYangDapatDisusutkan * (persentaseGarisLurus / 100);
    let nilaiBukuAkhir = hargaPerolehan - (bebanPenyusutanPerTahun * umurAset);

    // Pastikan nilai buku akhir tidak lebih kecil dari nilai residu
    if (nilaiBukuAkhir < nilaiResidu) {
        nilaiBukuAkhir = nilaiResidu;
    }

    // Simpan ke database
    const newInventaris = await prisma.inventaris.create({
      data: {
        namaInventaris: body.namaInventaris,
        idRuangan: parseInt(body.idRuangan),
        idGolongan: parseInt(body.idGolongan),
        tahunPerolehan,
        hargaPerolehan,
        bahanMerk: body.bahanMerk || null,
        masaManfaat: body.masaManfaat ? parseInt(body.masaManfaat) : null,
        umurAset, // Umur aset otomatis
        nilaiResidu,
        persentaseGarisLurus,
        nilaiYangDapatDisusutkan,
        bebanPenyusutanPerTahun,
        nilaiBukuAkhir,
        jumlah: body.jumlah ? parseInt(body.jumlah) : null,
        kondisi: body.kondisi,
        barcode: `${body.namaInventaris}, ${body.bahanMerk}, ${body.tahunPerolehan}, ${body.kondisi}`,
      },
    });

    return NextResponse.json(newInventaris, { status: 201 });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Gagal menyimpan data" }, { status: 500 });
  }
}
