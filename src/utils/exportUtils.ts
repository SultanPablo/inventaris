import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Definisikan tipe data untuk inventaris dan ruangan
export interface Inventaris {
  id: number;
  namaInventaris: string;
  bahanMerk: string;
  jumlah: number;
  tahunPerolehan: number;
  kondisi: string;
  // Field lain dapat ditambahkan jika diperlukan
}

export interface Ruangan {
  id: number;
  nama: string;
}

export function getCurrentPeriod(): string {
  const currentDate = new Date();
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
}

export function exportToExcel(
  inventaris: Inventaris[],
  ruangan: Ruangan[],
  selectedRuangan: number | string | null
): void {
  const periodeIdentifikasi = getCurrentPeriod();

  // Cari nama ruangan berdasarkan id, jika dipilih
  const namaRuangan =
    selectedRuangan !== null && selectedRuangan !== ""
      ? ruangan.find((r: Ruangan) => r.id === Number(selectedRuangan))?.nama || "Semua Ruangan"
      : "Semua Ruangan";

  // Buat data sheet dalam format array of arrays (AOA)
  const wsData: (string | number)[][] = [
    ["DAFTAR INVENTARIS RUANGAN"],
    [`Ruangan: ${namaRuangan}`],
    [`Periode Identifikasi: ${periodeIdentifikasi}`],
    [],
    ["NO", "NAMA INVENTARIS/ASET", "MEREK", "JUMLAH", "TAHUN PEROLEHAN", "KONDISI ASET", "Keterangan"],
    ...inventaris.map((item: Inventaris, index: number) => [
      index + 1,
      item.namaInventaris,
      item.bahanMerk,
      item.jumlah,
      item.tahunPerolehan,
      item.kondisi,
      ""
    ]),
  ];

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Inventaris");
  XLSX.writeFile(wb, "daftar_inventaris.xlsx");
}

export function exportToPDF(
  inventaris: Inventaris[],
  ruangan: Ruangan[],
  selectedRuangan: number | string | null
): void {
  const periodeIdentifikasi = getCurrentPeriod();
  const doc = new jsPDF();

  const namaRuangan =
    selectedRuangan !== null && selectedRuangan !== ""
      ? ruangan.find((r: Ruangan) => r.id === Number(selectedRuangan))?.nama || "Semua Ruangan"
      : "Semua Ruangan";

  doc.setFontSize(14);
  doc.text("DAFTAR INVENTARIS RUANGAN", 14, 10);
  doc.setFontSize(12);
  doc.text(`Ruangan: ${namaRuangan}`, 14, 20);
  doc.text(`Periode Identifikasi: ${periodeIdentifikasi}`, 14, 30);
  doc.line(14, 35, 200, 35);

  const tableColumn = ["NO", "NAMA INVENTARIS/ASET", "MEREK", "JUMLAH", "TAHUN PEROLEHAN", "KONDISI ASET", "Keterangan"];
  const tableRows = inventaris.map((item: Inventaris, index: number) => [
    index + 1,
    item.namaInventaris,
    item.bahanMerk,
    item.jumlah,
    item.tahunPerolehan,
    item.kondisi,
    ""
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [0, 102, 204] },
  });

  doc.save("daftar_inventaris.pdf");
}
