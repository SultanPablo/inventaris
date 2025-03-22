"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

// Definisikan tipe data
interface Gedung {
  id: number;
  nama: string;
}

interface Ruangan {
  id: number;
  nama: string;
  gedungId: number;
  gedung?: Gedung; // Opsional jika data sudah di-join dengan gedung
}

export default function RuanganPage() {
  const [ruangan, setRuangan] = useState<Ruangan[]>([]);
  const [gedung, setGedung] = useState<Gedung[]>([]);
  const [nama, setNama] = useState("");
  const [gedungId, setGedungId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    fetch("/api/gedung")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setGedung(data);
        } else {
          console.error("Data gedung bukan array:", data);
          setGedung([]);
        }
      })
      .catch((err) => {
        console.error("Gagal mengambil data gedung:", err);
        setGedung([]);
      });
  
    fetch("/api/ruangan")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRuangan(data);
        } else {
          console.error("Data ruangan bukan array:", data);
          setRuangan([]);
        }
      })
      .catch((err) => {
        console.error("Gagal mengambil data ruangan:", err);
        setRuangan([]);
      });
  }, []);
  
  

  const handleGedungFilter = async (gedungId: number) => {
    setGedungId(gedungId);
    const response = await fetch(`/api/ruangan?gedungId=${gedungId}`);
    const data: Ruangan[] = await response.json();
    setRuangan(data);
  };

  const handleSave = async () => {
    const payload = JSON.stringify({ nama, gedungId });

    if (selectedId) {
      await fetch(`/api/ruangan/${selectedId}`, {
        method: "PUT",
        body: payload,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      await fetch("/api/ruangan", {
        method: "POST",
        body: payload,
        headers: { "Content-Type": "application/json" },
      });
    }
    setOpen(false);
    location.reload();
  };

  const handleDelete = async () => {
    if (selectedId) {
      await fetch(`/api/ruangan/${selectedId}`, { method: "DELETE" });
    }
    setOpenDelete(false);
    location.reload();
  };

  return (
    <Card>
      <CardContent>
        <Button onClick={() => { setSelectedId(null); setNama(""); setGedungId(null); setOpen(true); }}>Tambah Ruangan</Button>

        <div>
          <select onChange={(e) => handleGedungFilter(Number(e.target.value))} value={gedungId || ""}>
            <option value="">Semua Gedung</option>
            {gedung.map((g) => (
              <option key={g.id} value={g.id}>{g.nama}</option>
            ))}
          </select>
        </div>

        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Gedung</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ruangan.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.nama}</TableCell>
                <TableCell>{item.gedung?.nama || "Tidak Ada"}</TableCell>
                <TableCell>
                  <Button size="sm" onClick={() => { setSelectedId(item.id); setNama(item.nama); setGedungId(item.gedungId); setOpen(true); }}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => { setSelectedId(item.id); setOpenDelete(true); }}>Hapus</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedId ? "Edit Ruangan" : "Tambah Ruangan"}</DialogTitle>
            </DialogHeader>
            <Input placeholder="Nama Ruangan" value={nama} onChange={(e) => setNama(e.target.value)} />
            <select onChange={(e) => setGedungId(Number(e.target.value))} value={gedungId || ""}>
              <option value="">Pilih Gedung</option>
              {gedung.map((g) => (
                <option key={g.id} value={g.id}>{g.nama}</option>
              ))}
            </select>
            <DialogFooter>
              <Button onClick={handleSave}>{selectedId ? "Update" : "Simpan"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={openDelete} onOpenChange={setOpenDelete}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Hapus Ruangan</DialogTitle>
            </DialogHeader>
            <p>Apakah Anda yakin ingin menghapus ruangan ini?</p>
            <DialogFooter>
              <Button variant="destructive" onClick={handleDelete}>Hapus</Button>
              <Button onClick={() => setOpenDelete(false)}>Batal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
