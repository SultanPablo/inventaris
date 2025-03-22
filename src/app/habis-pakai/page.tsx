"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type Barang = {
  id: number;
  nama: string;
  tahun_anggaran: number;
  satuan: string;
};

type Transaksi = {
  id: number;
  barang: { nama: string };
  jumlah_terima: number;
  jumlah_keluar: number;
  jumlah_sisa: number;
  uraian: string;
  tanda_bukti: string;
};

export default function HabisPakaiPage() {
  const [barang, setBarang] = useState<Barang[]>([]);
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [nama, setNama] = useState("");
  const [tahunAnggaran, setTahunAnggaran] = useState<number>(0);
  const [satuan, setSatuan] = useState("");
  const [barangId, setBarangId] = useState<number | string>(""); // To track selected Barang
  const [jumlahTerima, setJumlahTerima] = useState<number>(0);
  const [jumlahKeluar, setJumlahKeluar] = useState<number>(0);
  const [jumlahSisa, setJumlahSisa] = useState<number>(0);
  const [uraian, setUraian] = useState("");
  const [tandaBukti, setTandaBukti] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchBarang();
    fetchTransaksi(); // Load all transactions initially
  }, []);

  // Fetch all Barang
  async function fetchBarang() {
    try {
      const res = await fetch("/api/habis-pakai");
      if (!res.ok) throw new Error("Gagal mengambil data barang");
      const data = await res.json();
      setBarang(data);
    } catch (error) {
      console.error("Error fetching barang:", error);
    }
  }

  // Fetch Transaksi for the selected Barang
  async function fetchTransaksi(barangId: string = "") {
    try {
      const url = barangId ? `/api/habis-pakai/transaksi?barangId=${barangId}` : "/api/habis-pakai/transaksi";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Gagal mengambil data transaksi");
      const data = await res.json();
      setTransaksi(data);
    } catch (error) {
      console.error("Error fetching transaksi:", error);
    }
  }

  // Add Barang
  async function tambahBarang() {
    try {
      await fetch("/api/habis-pakai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama,
          tahun_anggaran: tahunAnggaran,
          satuan,
        }),
      });
      setNama("");
      setTahunAnggaran(0);
      setSatuan("");
      fetchBarang();
    } catch (error) {
      console.error("Error adding barang:", error);
    }
  }

  // Add Transaksi
  async function tambahTransaksi() {
    try {
      await fetch("/api/habis-pakai/transaksi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barangId: Number(barangId),
          jumlah_terima: jumlahTerima,
          jumlah_keluar: jumlahKeluar,
          jumlah_sisa: jumlahSisa,
          uraian,
          tanda_bukti: tandaBukti,
        }),
      });
      setJumlahTerima(0);
      setJumlahKeluar(0);
      setJumlahSisa(0);
      setUraian("");
      setTandaBukti("");
      fetchTransaksi(barangId.toString()); // Re-fetch transaksi for this barang
    } catch (error) {
      console.error("Error adding transaksi:", error);
    }
  }

  // Filter Transaksi based on the selected Barang
  function filterTransaksi(barangId: string) {
    setBarangId(barangId);
    fetchTransaksi(barangId); // Fetch transaksi for the specific barang
  }

  return (
    <Card>
      <CardContent>
        <div className="mb-4 flex justify-between items-center">
          <Button onClick={() => setModalOpen(true)}>Tambah Barang</Button>
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogContent>
              <div>
                <Input
                  type="text"
                  placeholder="Nama Barang"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Tahun Anggaran"
                  value={tahunAnggaran}
                  onChange={(e) => setTahunAnggaran(Number(e.target.value))}
                />
                <Input
                  type="text"
                  placeholder="Satuan"
                  value={satuan}
                  onChange={(e) => setSatuan(e.target.value)}
                />
                <Button onClick={tambahBarang}>Simpan Barang</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Barang Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Barang</TableHead>
              <TableHead>Tahun Anggaran</TableHead>
              <TableHead>Satuan</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {barang.length > 0 ? (
              barang.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.nama}</TableCell>
                  <TableCell>{item.tahun_anggaran}</TableCell>
                  <TableCell>{item.satuan}</TableCell>
                  <TableCell>
                    <Button onClick={() => filterTransaksi(item.id.toString())}>
                      Lihat Transaksi
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>Tidak ada barang yang tersedia.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Transaksi Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Barang</TableHead>
              <TableHead>Jumlah Terima</TableHead>
              <TableHead>Jumlah Keluar</TableHead>
              <TableHead>Jumlah Sisa</TableHead>
              <TableHead>Uraian</TableHead>
              <TableHead>Tanda Bukti</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transaksi.length > 0 ? (
              transaksi.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.barang.nama}</TableCell>
                  <TableCell>{item.jumlah_terima}</TableCell>
                  <TableCell>{item.jumlah_keluar}</TableCell>
                  <TableCell>{item.jumlah_sisa}</TableCell>
                  <TableCell>{item.uraian}</TableCell>
                  <TableCell>{item.tanda_bukti}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6}>Tidak ada transaksi untuk barang ini.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Transaksi Form */}
        <div className="mb-4">
          <Input
            type="number"
            placeholder="Jumlah Terima"
            value={jumlahTerima}
            onChange={(e) => setJumlahTerima(Number(e.target.value))}
          />
          <Input
            type="number"
            placeholder="Jumlah Keluar"
            value={jumlahKeluar}
            onChange={(e) => setJumlahKeluar(Number(e.target.value))}
          />
          <Input
            type="number"
            placeholder="Jumlah Sisa"
            value={jumlahSisa}
            onChange={(e) => setJumlahSisa(Number(e.target.value))}
          />
          <Input
            type="text"
            placeholder="Uraian"
            value={uraian}
            onChange={(e) => setUraian(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Tanda Bukti"
            value={tandaBukti}
            onChange={(e) => setTandaBukti(e.target.value)}
          />
          <Button onClick={tambahTransaksi}>Simpan Transaksi</Button>
        </div>
      </CardContent>
    </Card>
  );
}
