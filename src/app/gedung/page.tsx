"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function GedungPage() {
  const [gedung, setGedung] = useState<{ id: number, nama: string }[]>([]); // Menambahkan tipe data
  const [nama, setNama] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    fetch("/api/gedung")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Gagal mengambil data gedung"); // Menangani error jika tidak berhasil
        }
        return res.json();
      })
      .then(setGedung)
      .catch((error) => {
        console.error("Error saat mengambil data gedung:", error);
      });
  }, []);

  // Simpan atau update gedung
  const handleSave = async () => {
    if (selectedId) {
      // Update gedung
      await fetch(`/api/gedung/${selectedId}`, {
        method: "PUT",
        body: JSON.stringify({ nama }),
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // Tambah gedung baru
      await fetch("/api/gedung", {
        method: "POST",
        body: JSON.stringify({ nama }),
        headers: { "Content-Type": "application/json" },
      });
    }
    setOpen(false);
    location.reload();
  };

  // Hapus gedung
  const handleDelete = async () => {
    if (selectedId) {
      await fetch(`/api/gedung/${selectedId}`, { method: "DELETE" });
    }
    setOpenDelete(false);
    location.reload();
  };

  return (
    <Card>
      <CardContent>
        <Button onClick={() => { setSelectedId(null); setNama(""); setOpen(true); }}>Tambah Gedung</Button>
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gedung.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.nama}</TableCell>
                <TableCell>
                  <Button size="sm" onClick={() => { setSelectedId(item.id); setNama(item.nama); setOpen(true); }}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => { setSelectedId(item.id); setOpenDelete(true); }}>Hapus</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Dialog Tambah/Edit Gedung */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedId ? "Edit Gedung" : "Tambah Gedung"}</DialogTitle>
            </DialogHeader>
            <Input placeholder="Nama Gedung" value={nama} onChange={(e) => setNama(e.target.value)} />
            <DialogFooter>
              <Button onClick={handleSave}>{selectedId ? "Update" : "Simpan"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog Hapus Gedung */}
        <Dialog open={openDelete} onOpenChange={setOpenDelete}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Hapus Gedung</DialogTitle>
            </DialogHeader>
            <p>Apakah Anda yakin ingin menghapus gedung ini?</p>
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
