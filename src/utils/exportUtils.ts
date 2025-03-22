import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export function getCurrentPeriod() {
  const currentDate = new Date();
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
}

export function exportToExcel(inventaris, ruangan, selectedRuangan) {
  const periodeIdentifikasi = getCurrentPeriod();
  const namaRuangan = selectedRuangan ? ruangan.find(r => r.id == selectedRuangan)?.nama : "Semua Ruangan";

  const ws = XLSX.utils.aoa_to_sheet([
    ["DAFTAR INVENTARIS RUANGAN"],
    [`Ruangan: ${namaRuangan}`],
    [`Periode Identifikasi: ${periodeIdentifikasi}`],
    [],
    ["NO", "NAMA INVENTARIS/ASET", "MEREK", "JUMLAH", "TAHUN PEROLEHAN", "KONDISI ASET", "Keterangan"],
    ...inventaris.map((item, index) => [
      index + 1, item.namaInventaris, item.bahanMerk, item.jumlah, item.tahunPerolehan, item.kondisi, ""
    ]),
  ]);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Inventaris");
  XLSX.writeFile(wb, "daftar_inventaris.xlsx");
}

export function exportToPDF(inventaris, ruangan, selectedRuangan) {
  const periodeIdentifikasi = getCurrentPeriod();
  const doc = new jsPDF();

  const namaRuangan = selectedRuangan ? ruangan.find(r => r.id == selectedRuangan)?.nama : "Semua Ruangan";

  doc.setFontSize(14);
  doc.text("DAFTAR INVENTARIS RUANGAN", 14, 10);
  doc.setFontSize(12);
  doc.text(`Ruangan: ${namaRuangan}`, 14, 20);
  doc.text(`Periode Identifikasi: ${periodeIdentifikasi}`, 14, 30);
  doc.line(14, 35, 200, 35);

  const tableColumn = ["NO", "NAMA INVENTARIS/ASET", "MEREK", "JUMLAH", "TAHUN PEROLEHAN", "KONDISI ASET", "Keterangan"];
  const tableRows = inventaris.map((item, index) => [
    index + 1, item.namaInventaris, item.bahanMerk, item.jumlah, item.tahunPerolehan, item.kondisi, ""
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
