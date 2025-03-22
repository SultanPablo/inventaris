import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Ambil semua TransaksiBarangHabisPakai
// GET: Ambil Transaksi berdasarkan barangId
export async function GET(req: Request) {
    const url = new URL(req.url);
    const barangId = url.searchParams.get("barangId");  // Mengambil parameter barangId dari query string
  
    try {
      if (barangId) {
        // Filter transaksi berdasarkan barangId
        const transaksi = await prisma.transaksiBarangHabisPakai.findMany({
          where: { barangId: Number(barangId) },
          include: { barang: true },  // Include detail barang terkait
        });
  
        // Log the result of the query
        console.log("Fetched transaksi for barangId:", barangId, transaksi);
  
        return NextResponse.json(transaksi);
      }
  
      // Jika barangId tidak ada, ambil semua transaksi
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
    if (!body.barangId || !body.jumlah_terima || !body.jumlah_keluar || !body.uraian || !body.tanda_bukti) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 });
    }

    const barang = await prisma.barangHabisPakai.findUnique({
      where: { id: Number(body.barangId) },
    });

    if (!barang) {
      return NextResponse.json({ error: "Barang tidak ditemukan" }, { status: 404 });
    }

    const sisa = (barang?.stok || 0) + body.jumlah_terima - body.jumlah_keluar;

    const transaksi = await prisma.transaksiBarangHabisPakai.create({
      data: {
        barangId: Number(body.barangId),
        jumlah_terima: Number(body.jumlah_terima),
        jumlah_keluar: Number(body.jumlah_keluar),
        jumlah_sisa: sisa,
        uraian: body.uraian.trim(),
        tanda_bukti: body.tanda_bukti.trim(),
      },
    });

    // Update stok barang
    await prisma.barangHabisPakai.update({
      where: { id: Number(body.barangId) },
      data: { stok: sisa },
    });

    return NextResponse.json(transaksi);
  } catch (error) {
    console.error("Error saat menambah transaksi:", error);
    return NextResponse.json({ error: "Gagal menambah transaksi" }, { status: 500 });
  }
}
