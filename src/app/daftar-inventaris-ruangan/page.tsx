"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { exportToExcel, exportToPDF } from "@/utils/exportUtils";

export default function InventarisPage() {
  const [inventaris, setInventaris] = useState([]);
  const [ruangan, setRuangan] = useState([]);
  const [selectedRuangan, setSelectedRuangan] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [resInventaris, resRuangan] = await Promise.all([
        fetch("/api/inventaris"),
        fetch("/api/ruangan"),
      ]);

      if (!resInventaris.ok || !resRuangan.ok) {
        throw new Error("Gagal mengambil data");
      }

      setInventaris(await resInventaris.json());
      setRuangan(await resRuangan.json());
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const filteredInventaris = selectedRuangan
    ? inventaris.filter((item) => parseInt(item.idRuangan) === parseInt(selectedRuangan))
    : inventaris;

  return (
    <Card>
      <CardContent>
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
              <option key={r.id} value={r.id}>
                {r.nama}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4 flex gap-2">
          <Button onClick={() => exportToExcel(filteredInventaris, ruangan, selectedRuangan)}>Ekspor ke Excel</Button>
          <Button onClick={() => exportToPDF(filteredInventaris, ruangan, selectedRuangan)}>Ekspor ke PDF</Button>
        </div>

        <div className="overflow-x-auto">
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>Nama Inventaris</TableHead>
                <TableHead>Merek</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Tahun Perolehan</TableHead>
                <TableHead>Kondisi Aset</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventaris.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.namaInventaris}</TableCell>
                  <TableCell>{item.bahanMerk}</TableCell>
                  <TableCell>{item.jumlah}</TableCell>
                  <TableCell>{item.tahunPerolehan}</TableCell>
                  <TableCell>{item.kondisi}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
