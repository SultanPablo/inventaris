"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function RuanganPage() {
  const [ruangan, setRuangan] = useState<any[]>([]);
  const [gedung, setGedung] = useState<any[]>([]);
  const [nama, setNama] = useState("");
  const [gedungId, setGedungId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    fetch("/api/gedung")
      .then((res) => res.json())
      .then(setGedung);

    fetch("/api/ruangan")
      .then((res) => res.json())
      .then(setRuangan);
  }, []);

  const handleGedungFilter = async (gedungId: number) => {
    setGedungId(gedungId);
    const response = await fetch(`/api/ruangan?gedungId=${gedungId}`);
    const data = await response.json();
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
            {ruangan.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.nama}</TableCell>
                <TableCell>{item.gedung?.nama}</TableCell>
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
