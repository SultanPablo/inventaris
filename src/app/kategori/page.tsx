"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function KategoriPage() {
  const [kategori, setKategori] = useState([]);
  const [nama, setNama] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    fetch("/api/kategori")
      .then((res) => res.json())
      .then(setKategori);
  }, []);

  const handleSave = async () => {
    if (selectedId) {
      await fetch(`/api/kategori/${selectedId}`, {
        method: "PUT",
        body: JSON.stringify({ nama }),
        headers: { "Content-Type": "application/json" },
      });
    } else {
      await fetch("/api/kategori", {
        method: "POST",
        body: JSON.stringify({ nama }),
        headers: { "Content-Type": "application/json" },
      });
    }
    setOpen(false);
    location.reload();
  };

  const handleDelete = async () => {
    if (selectedId) {
      await fetch(`/api/kategori/${selectedId}`, { method: "DELETE" });
    }
    setOpenDelete(false);
    location.reload();
  };

  return (
    <Card className="card">
      <CardContent className="card-content">
        {/* Button Tambah Kategori (Pindah ke ujung kiri di atas tabel) */}
        <div className="mb-4 flex justify-start">
          <Button onClick={() => { setSelectedId(null); setNama(""); setOpen(true); }}>
            Tambah Kategori
          </Button>
        </div>

        {/* Tabel Kategori */}
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {kategori.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.nama}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    size="sm"
                    onClick={() => { setSelectedId(item.id); setNama(item.nama); setOpen(true); }}
                    className="hover:bg-blue-500"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => { setSelectedId(item.id); setOpenDelete(true); }}
                    className="hover:bg-red-500"
                  >
                    Hapus
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Dialog Tambah/Edit */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild></DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedId ? "Edit Kategori" : "Tambah Kategori"}</DialogTitle>
            </DialogHeader>
            <Input placeholder="Nama Kategori" value={nama} onChange={(e) => setNama(e.target.value)} />
            <DialogFooter>
              <Button onClick={handleSave}>{selectedId ? "Update" : "Simpan"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog Hapus */}
        <Dialog open={openDelete} onOpenChange={setOpenDelete}>
          <DialogTrigger asChild></DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Hapus Kategori</DialogTitle>
            </DialogHeader>
            <p>Apakah Anda yakin ingin menghapus kategori ini?</p>
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
