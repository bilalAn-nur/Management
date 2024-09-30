const ExcelJS = require("exceljs");

exports.exportDataWithMultipleSheets = async (req, res) => {
  try {
    // Membuat workbook dan sheet utama
    const workbook = new ExcelJS.Workbook();

    // Buat sheet terpisah untuk setiap tanggal 1-31
    for (let day = 1; day <= 31; day++) {
      const dateSheet = workbook.addWorksheet(`Tanggal ${day}`);
      dateSheet.mergeCells("A1:M1");
      dateSheet.getCell("A1").value = "Tabel Data Bulan Januari";
      dateSheet.getCell("A1").alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      dateSheet.getCell("A1").font = { name: "Arial", bold: true, size: 10 };

      // Menambahkan header untuk sheet tanggal
      dateSheet.columns = [
        { header: "PETUGAS", key: "petugas", width: 20 },
        { header: "SPEC", key: "spec", width: 20 },
        { header: "KENDALA", key: "kendala", width: 20 },
        { header: "KETERANGAN", key: "keterangan", width: 20 },
        { header: "TANGGAL", key: "tanggal", width: 15 },
      ];

      dateSheet.addRow({
        petugas: "AINDRIAN FATAH",
        spec: "Example SPEC",
        kendala: "Example KENDALA",
        keterangan: "Example KETERANGAN",
        tanggal: `2024-01-${day}`,
      });
    }

    // Mengirim file Excel sebagai response
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=januari.xlsx");

    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (error) {
    console.error("Error exporting data:", error);
    res.status(500).send("Server error");
  }
};
// exports.exportKPI = async (req, res) => {
//   try {
//     // Membuat workbook dan sheet utama
//     const workbook = new ExcelJS.Workbook();
//     const dateSheet = workbook.addWorksheet("SEPTEMBER 2024");

//     // Menggabungkan sel untuk judul utama (di baris 1 dan 2)
//     dateSheet.mergeCells("A1:M1");
//     dateSheet.getCell("A1").value =
//       "PERFORMANSI TEKNISI CJA 1 BULAN AGUSTUS 2024";
//     dateSheet.getCell("A1").alignment = {
//       vertical: "middle",
//       horizontal: "center",
//     };
//     dateSheet.getCell("A1").font = { name: "Arial", bold: true, size: 10 };

//     // Mengatur header agar dimulai dari baris ke-3
//     dateSheet.mergeCells("A2:A3");
//     dateSheet.getCell("A2").value = "No";
//     dateSheet.getCell("A2").alignment = {
//       vertical: "middle",
//       horizontal: "center",
//     };
//     dateSheet.getCell("A2").font = { name: "Arial", bold: true, size: 10 };

//     // Mengisi warna pada seluruh header
//     const headerFillBlue = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: "00b0f0" },
//     };

//     const headerFillGreen = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: "92d050" },
//     };

//     // Mengisi warna dari A2 sampai K3 dengan warna biru
//     for (let col = 1; col <= 11; col++) {
//       dateSheet.getCell(2, col).fill = headerFillBlue;
//       dateSheet.getCell(3, col).fill = headerFillBlue;
//     }

//     // Mengisi warna dari L2 sampai M3 dengan warna hijau
//     for (let col = 12; col <= 13; col++) {
//       dateSheet.getCell(2, col).fill = headerFillGreen;
//       dateSheet.getCell(3, col).fill = headerFillGreen;
//     }

//     dateSheet.mergeCells("B2:B3");
//     dateSheet.getCell("B2").value = "Nama Teknisi";
//     dateSheet.getCell("B2").alignment = {
//       vertical: "middle",
//       horizontal: "center",
//     };
//     dateSheet.getCell("B2").font = { name: "Arial", bold: true, size: 10 };

//     // Header untuk sub-kategori
//     dateSheet.mergeCells("C2:K2");
//     dateSheet.getCell("C2").value = "";

//     dateSheet.getCell("C3").value = "Regular";
//     dateSheet.getCell("D3").value = "HVC";
//     dateSheet.getCell("E3").value = "SQM";
//     dateSheet.getCell("F3").value = "Monet";
//     dateSheet.getCell("G3").value = "Unspec";
//     dateSheet.getCell("H3").value = "Lapsung";
//     dateSheet.getCell("I3").value = "Infracare";
//     dateSheet.getCell("J3").value = "Tangible";
//     dateSheet.getCell("K3").value = "Valins";
//     dateSheet.getCell("L2").value = "Total";
//     dateSheet.getCell("L3").value = "WO";
//     dateSheet.getCell("M2").value = "Presentase";

//     // Mengatur alignment untuk setiap cell header
//     const headerCells = [
//       "C3",
//       "D3",
//       "E3",
//       "F3",
//       "G3",
//       "H3",
//       "I3",
//       "J3",
//       "K3",
//       "L2",
//       "L3",
//       "M2",
//     ];
//     headerCells.forEach((cell) => {
//       dateSheet.getCell(cell).alignment = { horizontal: "center" };
//       dateSheet.getCell(cell).font = { name: "Arial", bold: true, size: 10 };
//     });

//     // Menambahkan border hitam pada seluruh header (A2:M3)
//     const borderStyle = {
//       top: { style: "thin" },
//       left: { style: "thin" },
//       bottom: { style: "thin" },
//       right: { style: "thin" },
//     };

//     for (let col = 1; col <= 13; col++) {
//       dateSheet.getCell(2, col).border = borderStyle;
//       dateSheet.getCell(3, col).border = borderStyle;
//     }

//     // Menambahkan kolom lainnya sesuai kebutuhan
//     dateSheet.columns = [
//       { key: "no", width: 5 },
//       { key: "namaTeknisi", width: 25 },
//       { key: "regular", width: 15 },
//       { key: "hvc", width: 15 },
//       { key: "sqm", width: 15 },
//       { key: "monet", width: 15 },
//       { key: "unspec", width: 15 },
//       { key: "lapsung", width: 15 },
//       { key: "infracare", width: 15 },
//       { key: "tangible", width: 15 },
//       { key: "valins", width: 15 },
//       { key: "totalwo", width: 15 },
//       { key: "persentase", width: 15 },
//     ];

//     // Menambahkan data ke sheet mulai dari baris ke-5 dan mengatur font serta border
//     const addData = (data, rowIndex) => {
//       const row = dateSheet.addRow(data);

//       // Menambahkan font Arial ke setiap cell data
//       row.eachCell({ includeEmpty: true }, (cell) => {
//         cell.font = { name: "Arial", size: 10 };
//         cell.alignment = { horizontal: "center", vertical: "center" };

//         // Menambahkan border hitam ke setiap cell
//         cell.border = borderStyle;
//       });
//     };

//     // Menambahkan data pertama
//     addData(
//       {
//         no: 1,
//         namaTeknisi: "AINDRIAN FATAH",
//         regular: 12,
//         hvc: 8,
//         sqm: 5,
//         monet: 3,
//         unspec: 2,
//         lapsung: 1,
//         infracare: 4,
//         tangible: 0,
//         valins: 6,
//         totalwo: 41,
//         persentase: "80%",
//       },
//       5
//     );

//     // Mengirim file Excel sebagai response
//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );
//     res.setHeader(
//       "Content-Disposition",
//       "attachment; filename=september_2024_kpi.xlsx"
//     );

//     await workbook.xlsx.write(res);
//     res.status(200).end();
//   } catch (error) {
//     console.error("Error exporting data:", error);
//     res.status(500).send("Server error");
//   }
// };

exports.exportKPI = async (req, res) => {
  try {
    // Membuat workbook dan sheet utama
    const workbook = new ExcelJS.Workbook();
    const dateSheet = workbook.addWorksheet("SEPTEMBER 2024");

    // Menggabungkan sel untuk judul utama (di baris 1 dan 2)
    dateSheet.mergeCells("A1:M1");
    dateSheet.getCell("A1").value =
      "PERFORMANSI TEKNISI CJA 1 BULAN AGUSTUS 2024";
    dateSheet.getCell("A1").alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    dateSheet.getCell("A1").font = { name: "Arial", bold: true, size: 10 };

    // Mengatur header agar dimulai dari baris ke-3
    dateSheet.mergeCells("A2:A3");
    dateSheet.getCell("A2").value = "No";
    dateSheet.getCell("A2").alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    dateSheet.getCell("A2").font = { name: "Arial", bold: true, size: 10 };

    // Mengisi warna pada seluruh header
    const headerFillBlue = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "00b0f0" },
    };

    const headerFillGreen = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "92d050" },
    };

    // Mengisi warna dari A2 sampai K3 dengan warna biru
    for (let col = 1; col <= 11; col++) {
      dateSheet.getCell(2, col).fill = headerFillBlue;
      dateSheet.getCell(3, col).fill = headerFillBlue;
    }

    // Mengisi warna dari L2 sampai M3 dengan warna hijau
    for (let col = 12; col <= 13; col++) {
      dateSheet.getCell(2, col).fill = headerFillGreen;
      dateSheet.getCell(3, col).fill = headerFillGreen;
    }

    dateSheet.mergeCells("B2:B3");
    dateSheet.getCell("B2").value = "Nama Teknisi";
    dateSheet.getCell("B2").alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    dateSheet.getCell("B2").font = { name: "Arial", bold: true, size: 10 };

    // Header untuk sub-kategori
    dateSheet.mergeCells("C2:K2");
    dateSheet.getCell("C2").value = "";

    dateSheet.getCell("C3").value = "Regular";
    dateSheet.getCell("D3").value = "HVC";
    dateSheet.getCell("E3").value = "SQM";
    dateSheet.getCell("F3").value = "Monet";
    dateSheet.getCell("G3").value = "Unspec";
    dateSheet.getCell("H3").value = "Lapsung";
    dateSheet.getCell("I3").value = "Infracare";
    dateSheet.getCell("J3").value = "Tangible";
    dateSheet.getCell("K3").value = "Valins";
    dateSheet.getCell("L2").value = "Total";
    dateSheet.getCell("L3").value = "WO";
    dateSheet.getCell("M2").value = "Persentase";

    // Mengatur alignment untuk setiap cell header
    const headerCells = [
      "C3",
      "D3",
      "E3",
      "F3",
      "G3",
      "H3",
      "I3",
      "J3",
      "K3",
      "L2",
      "L3",
      "M2",
    ];
    headerCells.forEach((cell) => {
      dateSheet.getCell(cell).alignment = { horizontal: "center" };
      dateSheet.getCell(cell).font = { name: "Arial", bold: true, size: 10 };
    });

    // Menambahkan border hitam pada seluruh header (A2:M3)
    const borderStyle = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    for (let col = 1; col <= 13; col++) {
      dateSheet.getCell(2, col).border = borderStyle;
      dateSheet.getCell(3, col).border = borderStyle;
    }

    // Menambahkan kolom lainnya sesuai kebutuhan
    dateSheet.columns = [
      { key: "no", width: 5 },
      { key: "namaTeknisi", width: 25 },
      { key: "regular", width: 15 },
      { key: "hvc", width: 15 },
      { key: "sqm", width: 15 },
      { key: "monet", width: 15 },
      { key: "unspec", width: 15 },
      { key: "lapsung", width: 15 },
      { key: "infracare", width: 15 },
      { key: "tangible", width: 15 },
      { key: "valins", width: 15 },
      { key: "totalwo", width: 15 },
      { key: "persentase", width: 15 },
    ];

    // Menambahkan data ke sheet mulai dari baris ke-5 dan mengatur font serta border
    const addData = (data, rowIndex) => {
      const row = dateSheet.addRow(data);

      // Menambahkan font Arial ke setiap cell data
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.font = { name: "Arial", size: 10 };
        cell.alignment = { horizontal: "center", vertical: "center" };

        // Menambahkan border hitam ke setiap cell
        cell.border = borderStyle;
      });
    };

    // Menambahkan data pertama
    addData(
      {
        no: 1,
        namaTeknisi: "AINDRIAN FATAH",
        regular: 12,
        hvc: 8,
        sqm: 5,
        monet: 3,
        unspec: 2,
        lapsung: 1,
        infracare: 4,
        tangible: 0,
        valins: 6,
        totalwo: 41,
        persentase: "80%",
      },
      5
    );

    // Mengirim file Excel sebagai response
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=september_2024_kpi.xlsx"
    );

    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (error) {
    console.error("Error exporting data:", error);
    res.status(500).send("Server error");
  }
};

exports.exportJadwalPegawai = async (req, res) => {
  try {
    const ExcelJS = require("exceljs");
    const workbook = new ExcelJS.Workbook();
    const dateSheet = workbook.addWorksheet("JADWAL BULAN SEPTEMBER 2024");

    // Main Title
    dateSheet.mergeCells("A1:AJ1");
    dateSheet.getCell("A1").value = "JADWAL TEKNISI IOAN SEPTEMBER RKB CJA 1";
    dateSheet.getCell("A1").alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    dateSheet.getCell("A1").font = { name: "Calibri", bold: true, size: 14 };

    // Set column widths
    const columnWidths = [5, 20, 10, 10, 15, 10]; // Adjust widths as needed
    ["A", "B", "C", "D", "E", "F"].forEach((col, index) => {
      dateSheet.getColumn(col).width = columnWidths[index];
    });

    // Headers for No, Name, Sector, Technician, Phone, Partner
    const headers = ["No", "Nama", "Sektor", "Teknisi", "No HP", "Mitra"];
    headers.forEach((header, index) => {
      const cell = `${String.fromCharCode(65 + index)}3`;
      dateSheet.mergeCells(cell + ":" + cell);
      dateSheet.getCell(cell).value = header;
      dateSheet.getCell(cell).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      dateSheet.getCell(cell).font = { name: "Calibri", bold: true, size: 11 };
    });

    // Set days and dates in the header
    for (let i = 0; i < 7; i++) {
      // Adjust for days of the week
      let dayCell = dateSheet.getCell(4, 7 + i); // Starting from G4
      dayCell.value = ["M", "S", "S", "R", "K", "J", "S"][i];
      dayCell.alignment = { horizontal: "center" };
      dayCell.font = { name: "Calibri", size: 11 };

      for (let j = 0; j < 4; j++) {
        // 4 weeks
        let dateCell = dateSheet.getCell(5 + j, 7 + i);
        dateCell.value = 1 + i + 7 * j; // Adjust date calculation as needed
        dateCell.alignment = { horizontal: "center" };
        dateCell.font = { name: "Calibri", size: 11 };
        if ((j + i) % 2 === 0) {
          // Alternate background color for readability
          dateCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFFFF" }, // White
          };
        } else {
          dateCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFEEEEEE" }, // Light grey
          };
        }
      }
    }

    // Sample employee data
    const employeeData = [
      // Populate with actual data as needed
    ];

    // Add employee rows
    employeeData.forEach((emp, index) => {
      let row = 6 + index;
      ["A", "B", "C", "D", "E", "F"].forEach((col, i) => {
        let cell = dateSheet.getCell(`${col}${row}`);
        cell.value = [
          emp.no,
          emp.nama,
          emp.sektor,
          emp.teknisi,
          emp.noHp,
          emp.mitra,
        ][i];
        cell.alignment = { horizontal: "left" };
        cell.font = { name: "Calibri", size: 11 };
      });
    });

    // Send Excel file as response
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=september_2024_jadwal_pegawai.xlsx"
    );

    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (error) {
    console.error("Error exporting data:", error);
    res.status(500).send("Server error");
  }
};
