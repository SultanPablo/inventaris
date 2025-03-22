import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Ambil semua TransaksiBarangHabisPakai / filter berdasarkan barangId jika disediakan
export async function GET(req: Request) {
  const url = new URL(req.url);
  const barangId = url.searchParams.get("barangId"); // Ambil parameter barangId

  try {
    if (barangId) {
      // Jika barangId disediakan, filter transaksi berdasarkan barangId
      const transaksi = await prisma.transaksiBarangHabisPakai.findMany({
        where: { barangId: Number(barangId) },
        include: { barang: true },
      });

      console.log("Fetched transaksi for barangId:", barangId, transaksi);
      return NextResponse.json(transaksi);
    }

    // Jika tidak ada barangId, ambil semua transaksi
    const transaksi = await prisma.transaksiBarangHabisPakai.findMany({
      include: { barang: true },
    });
    return NextResponse.json(transaksi);
  } catch (error) {
    console.error("Error saat mengambil transaksi:", error);
    return NextResponse.json({ error: "Gagal mengambil transaksi" }, { status: 500 });
  }
}

// POST: Tambah TransaksiBarangHabisPakai
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validasi data yang diterima
    if (
      !body.barangId ||
      !body.jumlah_terima ||
      !body.jumlah_keluar ||
      !body.uraian ||
      !body.tanda_bukti
    ) {
      return NextResponse.json(
        { error: "Semua field harus diisi" },
        { status: 400 }
      );
    }

    // Cek apakah barang ada
    const barang = await prisma.barangHabisPakai.findUnique({
      where: { id: Number(body.barangId) },
    });

    if (!barang) {
      return NextResponse.json(
        { error: "Barang tidak ditemukan" },
        { status: 404 }
      );
    }

    // Jika schema tidak memiliki field 'stok', kita langsung hitung jumlah_sisa berdasarkan nilai yang diterima.
    // Misalnya, jika tidak ingin melakukan update stok, gunakan:
    const jumlahSisa = Number(body.jumlah_terima) - Number(body.jumlah_keluar);

    const transaksi = await prisma.transaksiBarangHabisPakai.create({
      data: {
        barangId: Number(body.barangId),
        jumlah_terima: Number(body.jumlah_terima),
        jumlah_keluar: Number(body.jumlah_keluar),
        jumlah_sisa: jumlahSisa, // Gunakan hasil perhitungan ini
        uraian: body.uraian.trim(),
        tanda_bukti: body.tanda_bukti.trim(),
      },
    });

    // Jika di masa mendatang schema diupdate untuk menyertakan stok, Anda bisa melakukan update seperti berikut:
    /*
    await prisma.barangHabisPakai.update({
      where: { id: Number(body.barangId) },
      data: { stok: jumlahSisa },
    });
    */

    return NextResponse.json(transaksi);
  } catch (error) {
    console.error("Error saat menambah transaksi:", error);
    return NextResponse.json(
      { error: "Gagal menambah transaksi" },
      { status: 500 }
    );
  }
}
