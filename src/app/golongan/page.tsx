"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function GolonganPage() {
  const [golongan, setGolongan] = useState([]);
  const [filteredGolongan, setFilteredGolongan] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [nama, setNama] = useState("");
  const [kodeGolongan, setKodeGolongan] = useState("");
  const [kategoriId, setKategoriId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    fetch("/api/golongan")
      .then((res) => res.json())
      .then((data) => {
        setGolongan(data);
        setFilteredGolongan(data); // Initialize filteredGolongan with all data
      });

    fetch("/api/kategori")
      .then((res) => res.json())
      .then(setKategori);
  }, []);

  // Filter golongan berdasarkan kategori
  const handleFilterKategori = (id: number | null) => {
    setKategoriId(id);
    if (id === 0 || id === null) {
      setFilteredGolongan(golongan); // Tampilkan semua golongan jika kategori adalah 0 (Semua Kategori)
    } else {
      setFilteredGolongan(golongan.filter((item: any) => item.kategoriId === id));
    }
  };
  

  const handleSave = async () => {
    if (!nama.trim() || !kodeGolongan.trim() || !kategoriId) {
      alert("Semua field harus diisi!");
      return;
    }

    const data = {
      nama: nama.trim(),
      kode_golongan: kodeGolongan.trim(),
      kategoriId: Number(kategoriId),
    };

    const response = await fetch("/api/golongan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (response.ok) {
      setOpen(false);
      location.reload();
    } else {
      alert(`Terjadi kesalahan: ${result.error}`);
    }
  };

  return (
    <Card>
      <CardContent>
        {/* Filter Kategori */}
        <div className="mb-4 flex justify-between items-center">
          <Button onClick={() => { setSelectedId(null); setNama(""); setKodeGolongan(""); setKategoriId(null); setOpen(true); }}>Tambah Golongan</Button>
          
          {/* Filter Dropdown */}
          <Select value={kategoriId?.toString()} onValueChange={(value) => handleFilterKategori(Number(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Filter berdasarkan Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Semua Kategori</SelectItem>
              {kategori.map((kat: any) => (
                <SelectItem key={kat.id} value={kat.id.toString()}>{kat.nama}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tabel Golongan */}
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Kode Golongan</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGolongan.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.nama}</TableCell>
                <TableCell>{item.kode_golongan}</TableCell>
                <TableCell>{item.kategori?.nama}</TableCell>
                <TableCell>
                  <Button size="sm" onClick={() => { setSelectedId(item.id); setNama(item.nama); setKodeGolongan(item.kode_golongan); setKategoriId(item.kategoriId); setOpen(true); }}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => { setSelectedId(item.id); setOpenDelete(true); }}>Hapus</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Dialog Tambah/Edit */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedId ? "Edit Golongan" : "Tambah Golongan"}</DialogTitle>
            </DialogHeader>
            <Input placeholder="Nama Golongan" value={nama} onChange={(e) => setNama(e.target.value)} />
            <Input placeholder="Kode Golongan" value={kodeGolongan} onChange={(e) => setKodeGolongan(e.target.value)} />
            <Select value={kategoriId?.toString()} onValueChange={(value) => setKategoriId(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Kategori" />
              </SelectTrigger>
              <SelectContent>
                {kategori.map((kat: any) => (
                  <SelectItem key={kat.id} value={kat.id.toString()}>{kat.nama}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DialogFooter>
              <Button onClick={handleSave}>{selectedId ? "Update" : "Simpan"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
