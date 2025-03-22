"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import QRCode from "react-qr-code";

// Interface untuk Inventaris
interface Inventaris {
  id: number;
  namaInventaris: string;
  idRuangan: number;
  idGolongan: number;
  tahunPerolehan: number;
  hargaPerolehan: number;
  bahanMerk: string;
  masaManfaat: number;
  umurAset: number;
  nilaiResidu: number;
  persentaseGarisLurus: number;
  jumlah: number;
  kondisi: string;
  barcode: string;
  nilaiYangDapatDisusutkan: number;
  bebanPenyusutanPerTahun: number;
  nilaiBukuAkhir: number;
}

// Interface untuk Ruangan dan Golongan
interface Ruangan {
  id: number;
  nama: string;
}

interface Golongan {
  id: number;
  nama: string;
}

export default function InventarisPage() {
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // State utama
  const [inventaris, setInventaris] = useState<Inventaris[]>([]);
  const [ruangan, setRuangan] = useState<Ruangan[]>([]);
  const [golongan, setGolongan] = useState<Golongan[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedRuangan, setSelectedRuangan] = useState("");
  const [openQR, setOpenQR] = useState(false);
  const [qrData, setQrData] = useState("");
  const [open, setOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  // State form inventaris (nilai disimpan sebagai string; akan dikonversi saat pengiriman)
  const [form, setForm] = useState({
    namaInventaris: "",
    idRuangan: "",
    idGolongan: "",
    tahunPerolehan: "",
    hargaPerolehan: "",
    bahanMerk: "",
    masaManfaat: "",
    umurAset: "",
    nilaiResidu: "",
    persentaseGarisLurus: "",
    nilaiYangDapatDisusutkan: "",
    bebanPenyusutanPerTahun: "",
    nilaiBukuAkhir: "",
    jumlah: "",
    kondisi: "",
    barcode: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [resInventaris, resRuangan, resGolongan] = await Promise.all([
        fetch("/api/inventaris"),
        fetch("/api/ruangan"),
        fetch("/api/golongan"),
      ]);

      if (!resInventaris.ok || !resRuangan.ok || !resGolongan.ok) {
        throw new Error("Gagal mengambil data");
      }

      setInventaris(await resInventaris.json());
      setRuangan(await resRuangan.json());
      setGolongan(await resGolongan.json());
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const handleSave = async () => {
    try {
      // Konversi nilai numerik dari string ke number
      const updatedForm = {
        ...form,
        idRuangan: Number(form.idRuangan),
        idGolongan: Number(form.idGolongan),
        tahunPerolehan: Number(form.tahunPerolehan),
        hargaPerolehan: Number(form.hargaPerolehan),
        masaManfaat: Number(form.masaManfaat),
        umurAset: Number(form.umurAset),
        nilaiResidu: Number(form.nilaiResidu),
        persentaseGarisLurus: Number(form.persentaseGarisLurus),
        nilaiYangDapatDisusutkan: Number(form.nilaiYangDapatDisusutkan),
        bebanPenyusutanPerTahun: Number(form.bebanPenyusutanPerTahun),
        nilaiBukuAkhir: Number(form.nilaiBukuAkhir),
        jumlah: Number(form.jumlah),
        barcode: `${form.namaInventaris}, ${form.bahanMerk}, ${form.tahunPerolehan}, ${form.kondisi}`,
      };

      const url = selectedId ? `/api/inventaris/${selectedId}` : "/api/inventaris";
      const method = selectedId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: JSON.stringify(updatedForm),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Gagal menyimpan data");

      setOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  // Tipe handleDelete: menerima 1 parameter (id: number)
  const handleDelete: (id: number) => Promise<void> = async (id) => {
    try {
      const response = await fetch(`/api/inventaris/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Gagal menghapus data");

      fetchData();
      setDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  // Filter inventaris berdasarkan ruangan yang dipilih
  const filteredInventaris = selectedRuangan
    ? inventaris.filter((item) => item.idRuangan === Number(selectedRuangan))
    : inventaris;

  const handleDownloadQR = () => {
    const canvas = document.getElementById("qr-code") as HTMLCanvasElement | null;
    if (!canvas) {
      console.error("Canvas tidak ditemukan!");
      return;
    }
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = "qrcode.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="w-full">
      <CardContent className="overflow-x-auto max-w-full">
        {/* Dropdown Filter Ruangan */}
        <div className="mb-4 flex items-center gap-2">
          <label className="font-semibold">Filter Ruangan:</label>
          <select
            value={selectedRuangan}
            onChange={(e) => setSelectedRuangan(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Semua Ruangan</option>
            {ruangan.map((r) => (
              <option key={r.id} value={r.id.toString()}>
                {r.nama}
              </option>
            ))}
          </select>
        </div>
        <Button
          onClick={() => {
            setSelectedId(null);
            // Set form ke nilai default kosong
            setForm({
              namaInventaris: "",
              idRuangan: "",
              idGolongan: "",
              tahunPerolehan: "",
              hargaPerolehan: "",
              bahanMerk: "",
              masaManfaat: "",
              umurAset: "",
              nilaiResidu: "",
              persentaseGarisLurus: "",
              nilaiYangDapatDisusutkan: "",
              bebanPenyusutanPerTahun: "",
              nilaiBukuAkhir: "",
              jumlah: "",
              kondisi: "",
              barcode: "",
            });
            setOpen(true);
          }}
        >
          Tambah Inventaris
        </Button>

        <div className="overflow-x-auto">
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Ruangan</TableHead>
                <TableHead>Tahun Perolehan</TableHead>
                <TableHead>Harga Perolehan</TableHead>
                <TableHead>Kondisi</TableHead>
                <TableHead>QR Code</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventaris.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.namaInventaris}</TableCell>
                  <TableCell>
                    {ruangan.find((r) => r.id === item.idRuangan)?.nama ||
                      "Tidak Diketahui"}
                  </TableCell>
                  <TableCell>{item.tahunPerolehan}</TableCell>
                  <TableCell>{formatRupiah(item.hargaPerolehan)}</TableCell>
                  <TableCell>{item.kondisi}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => {
                        setQrData(item.barcode);
                        setOpenQR(true);
                      }}
                    >
                      Tampilkan QR
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => setSelectedId(item.id)}>
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        selectedId !== null && handleDelete(selectedId)
                      }
                    >
                      Hapus
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Dialog Tambah/Edit Inventaris */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedId ? "Edit Inventaris" : "Tambah Inventaris"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-2">
              <select
                value={form.idRuangan.toString()}
                onChange={(e) =>
                  setForm({ ...form, idRuangan: e.target.value })
                }
                className="border p-2 rounded"
              >
                <option value="">Pilih Ruangan</option>
                {ruangan.map((r) => (
                  <option key={r.id} value={r.id.toString()}>
                    {r.nama}
                  </option>
                ))}
              </select>
              <select
                value={form.idGolongan.toString()}
                onChange={(e) =>
                  setForm({ ...form, idGolongan: e.target.value })
                }
                className="border p-2 rounded"
              >
                <option value="">Pilih Golongan</option>
                {golongan.map((g) => (
                  <option key={g.id} value={g.id.toString()}>
                    {g.nama}
                  </option>
                ))}
              </select>
              <Input
                placeholder="Nama Inventaris"
                value={form.namaInventaris}
                onChange={(e) =>
                  setForm({ ...form, namaInventaris: e.target.value })
                }
              />
              <Input
                placeholder="Tahun Perolehan"
                type="number"
                value={form.tahunPerolehan}
                onChange={(e) =>
                  setForm({ ...form, tahunPerolehan: e.target.value })
                }
              />
              <Input
                placeholder="Harga Perolehan"
                type="number"
                value={form.hargaPerolehan}
                onChange={(e) =>
                  setForm({ ...form, hargaPerolehan: e.target.value })
                }
              />
              <Input
                placeholder="Bahan / Merk"
                value={form.bahanMerk}
                onChange={(e) =>
                  setForm({ ...form, bahanMerk: e.target.value })
                }
              />
              <Input
                placeholder="Masa Manfaat"
                type="number"
                value={form.masaManfaat}
                onChange={(e) =>
                  setForm({ ...form, masaManfaat: e.target.value })
                }
              />
              <Input
                placeholder="Nilai Residu"
                type="number"
                value={form.nilaiResidu}
                onChange={(e) =>
                  setForm({ ...form, nilaiResidu: e.target.value })
                }
              />
              <Input
                placeholder="Persentase Garis Lurus"
                type="number"
                step="0.01"
                value={form.persentaseGarisLurus}
                onChange={(e) =>
                  setForm({ ...form, persentaseGarisLurus: e.target.value })
                }
              />
              <Input
                placeholder="Jumlah"
                type="number"
                value={form.jumlah}
                onChange={(e) => setForm({ ...form, jumlah: e.target.value })}
              />
              <Input
                placeholder="Kondisi"
                value={form.kondisi}
                onChange={(e) =>
                  setForm({ ...form, kondisi: e.target.value })
                }
              />
            </div>
            <DialogFooter>
              <Button onClick={handleSave}>
                {selectedId ? "Update" : "Simpan"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog Konfirmasi Hapus */}
        <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Konfirmasi Hapus</DialogTitle>
            </DialogHeader>
            <p>Apakah Anda yakin ingin menghapus item ini?</p>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setDeleteDialog(false)}>
                Batal
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() =>
                  selectedId !== null && handleDelete(selectedId)
                }
              >
                Hapus
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog QR Code */}
        <Dialog open={openQR} onOpenChange={setOpenQR}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>QR Code</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center">
              {qrData ? (
                <QRCode id="qr-code" value={qrData} size={150} />
              ) : (
                <p>Tidak ada data</p>
              )}
              <Button className="mt-4" onClick={handleDownloadQR}>
                Download QR
              </Button>
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setOpenQR(false)}>
                Tutup
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
