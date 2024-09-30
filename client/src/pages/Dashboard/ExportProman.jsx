import React, { useEffect, useState } from "react";
import ExcelJS from "exceljs";
import axios from "axios";

const ExportProman = () => {
  // const [jadwalData, setJadwalData] = useState([]);
  // const [promanData, setPromanData] = useState([]);
  // const [pegawaiData, setPegawaiData] = useState([]);

  const [jadwalPegawai, setJadwalPegawai] = useState([]);
  const [promanData, setPromanData] = useState([]);
  const [pegawai, setPegawai] = useState([]);

  useEffect(() => {
    const fetchJadwalData = async (month, year) => {
      try {
        const jadwalResponse = await axios.get(
          `${
            import.meta.env.VITE_API_BACKEND_MONGODB
          }/getJadwalPegawai?month=${month}&year=${year}`
        );
        setJadwalPegawai(jadwalResponse.data.data);
        console.log("Jadwal Data:", jadwalResponse.data.data); // Debugging

        const promanResponse = await axios.get(
          `${import.meta.env.VITE_API_BACKEND_MONGODB}/getAllProman`
        );
        setPromanData(promanResponse.data);
        console.log("Proman Data:", promanResponse.data); // Debugging

        const pegawaiResponse = await axios.get(
          `${import.meta.env.VITE_API_BACKEND_MONGODB}/getAllPegawai`
        );
        setPegawai(pegawaiResponse.data.data);
        console.log("Pegawai Data: ", pegawaiResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchJadwalData(9, 2024);
  }, []);

  const exportPromanToExcel = async () => {
    // try {
    const selectedMonth = "09";
    const selectedYear = 2024;
    if (!jadwalPegawai.length || !promanData.length) {
      console.error("Data jadwal atau pegawai tidak ditemukan");
      return;
    }

    const getDaysInMonth = (month, year) => {
      return new Date(year, month, 0).getDate();
    };

    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const workbook = new ExcelJS.Workbook();

    console.log(
      "Tanggal " + daysInMonth + "/" + selectedMonth + "/" + selectedYear
    );

    // for (let day = 1; day <= daysInMonth; day++) {
    for (let day = 1; day <= 8; day++) {
      const worksheet = workbook.addWorksheet(
        `${day}-${selectedMonth}-${selectedYear}`
      );

      const filteredData = jadwalPegawai.filter(
        (item) => item.date === String(day)
      );
      const pagi = filteredData[0]?.schedule[0]?.pagi || [];
      const piket = filteredData[0]?.schedule[0]?.piket || [];
      const jumlahKolom = pagi.length + piket.length;
      const G = String.fromCharCode(65 + jumlahKolom);

      const mergeCellRange = `B1:${G}1`;
      console.log(`Mencoba menggabungkan sel: ${mergeCellRange}`);
      try {
        worksheet.mergeCells(mergeCellRange);
        worksheet.getCell("B1").value = "Progress Closing Harian";
      } catch (error) {
        console.warn(`Sel sudah digabung sebelumnya: ${mergeCellRange}`, error);
      }

      worksheet.mergeCells("A1:A2");
      worksheet.getCell(
        "A1"
      ).value = `Tanggal ${day}/${selectedMonth}/${selectedYear}`;

      if (pagi.length > 0) {
        const headerPagiRange = `B2:${String.fromCharCode(65 + pagi.length)}2`;
        console.log(`Mencoba menggabungkan header pagi: ${headerPagiRange}`);
        try {
          worksheet.mergeCells(headerPagiRange);
          worksheet.getCell("B2").value = "Pagi";
        } catch (error) {
          console.warn(
            `Header pagi sudah digabung sebelumnya: ${headerPagiRange}`,
            error
          );
        }
      }

      if (piket.length > 0) {
        const headerPiketRange = `${String.fromCharCode(
          65 + pagi.length + 1
        )}2:${G}2`;
        console.log(`Mencoba menggabungkan header piket: ${headerPiketRange}`);
        try {
          worksheet.mergeCells(headerPiketRange);
          worksheet.getCell(
            `${String.fromCharCode(65 + pagi.length + 1)}2`
          ).value = "Piket";
        } catch (error) {
          console.warn(
            `Header piket sudah digabung sebelumnya: ${headerPiketRange}`,
            error
          );
        }
      }

      const header = [
        "Jenis Wo",
        // ...Array.from({ length: pagi.length }, (_, i) => `${i + 1}`),
        ...pagi.map((pegawaiId) => {
          return (
            pegawai.find((p) => p._id === pegawaiId)?.name || "Tidak Ditemukan"
          );
        }),
        ...piket.map((pegawaiId) => {
          return (
            pegawai.find((p) => p._id === pegawaiId)?.name || "Tidak Ditemukan"
          );
        }),
      ];

      // console.log(pegawaiData);

      worksheet.getRow(3).values = header;

      const jumlahTiket = promanData.reduce((countTiket, item) => {
        if (
          item.date ===
          `${selectedYear}-${selectedMonth}-${String(day).padStart(2, "0")}`
        ) {
          const regularEntries = item.promanData.filter(
            (proman) => proman.promanCategory === "Regular"
          );
          const hvcEntries = item.promanData.filter(
            (proman) => proman.promanCategory === "HVC"
          );
          const sqmEntries = item.promanData.filter(
            (proman) => proman.promanCategory === "SQM"
          );
          const infracareEntries = item.promanData.filter(
            (proman) => proman.promanCategory === "Infracare"
          );
          return (
            countTiket +
            regularEntries.length +
            hvcEntries.length +
            sqmEntries.length +
            infracareEntries.length
          );
        }
        return countTiket;
      }, 1);

      const jumlahLapsung = promanData.reduce((count, item) => {
        if (
          item.date ===
          `${selectedYear}-${selectedMonth}-${String(day).padStart(2, "0")}`
        ) {
          const LapsungEntries = item.promanData.filter(
            (proman) => proman.promanCategory === "Lapsung"
          );
          const MonetEntries = item.promanData.filter(
            (proman) => proman.promanCategory === "Monet"
          );
          return count + LapsungEntries.length + MonetEntries.length;
        }
        return count;
      }, 1);

      const jumlahUnspec = promanData.reduce((count, item) => {
        if (
          item.date ===
          `${selectedYear}-${selectedMonth}-${String(day).padStart(2, "0")}`
        ) {
          const UnspecEntries = item.promanData.filter(
            (proman) => proman.promanCategory === "Unspec"
          );
          return count + UnspecEntries.length;
        }
        return count;
      }, 1);

      const jumlahTangible = promanData.reduce((count, item) => {
        if (
          item.date ===
          `${selectedYear}-${selectedMonth}-${String(day).padStart(2, "0")}`
        ) {
          const TangibleEntries = item.promanData.filter(
            (proman) => proman.promanCategory === "Tangible"
          );
          return count + TangibleEntries.length;
        }
        return count;
      }, 1);

      const jumlahValins = promanData.reduce((count, item) => {
        if (
          item.date ===
          `${selectedYear}-${selectedMonth}-${String(day).padStart(2, "0")}`
        ) {
          const ValinsEntries = item.promanData.filter(
            (proman) => proman.promanCategory === "Valins"
          );
          return count + ValinsEntries.length;
        }
        return count;
      }, 1);

      // Variabel untuk menyimpan baris awal dan akhir
      let mergeJenisWoStart = 4; // Baris awal untuk penggabungan
      let mergeJenisWoEnd;

      // Gabungkan sel untuk tiket
      mergeJenisWoEnd = mergeJenisWoStart + jumlahTiket - 1; // Akhir untuk tiket
      let barisTiket = 4;
      worksheet.mergeCells(`A${mergeJenisWoStart}:A${mergeJenisWoEnd}`);
      worksheet.getCell(`A${mergeJenisWoStart}`).value = "Tiket"; // Menetapkan nilai
      mergeJenisWoStart = mergeJenisWoEnd + 1; // Baris setelah tiket

      // Gabungkan sel untuk lapsung
      mergeJenisWoEnd = mergeJenisWoStart + jumlahLapsung - 1; // Akhir untuk lapsung
      let barisLapsung = mergeJenisWoStart;
      worksheet.mergeCells(`A${mergeJenisWoStart}:A${mergeJenisWoEnd}`);
      worksheet.getCell(`A${mergeJenisWoStart}`).value = "Lapsung"; // Menetapkan nilai
      mergeJenisWoStart = mergeJenisWoEnd + 1; // Baris setelah lapsung

      // Gabungkan sel untuk unspec
      mergeJenisWoEnd = mergeJenisWoStart + jumlahUnspec - 1; // Akhir untuk unspec
      let barisUnspec = mergeJenisWoStart;
      worksheet.mergeCells(`A${mergeJenisWoStart}:A${mergeJenisWoEnd}`);
      worksheet.getCell(`A${mergeJenisWoStart}`).value = "Unspec"; // Menetapkan nilai
      mergeJenisWoStart = mergeJenisWoEnd + 1; // Baris setelah unspec

      // Gabungkan sel untuk tangible
      mergeJenisWoEnd = mergeJenisWoStart + jumlahTangible - 1; // Akhir untuk tangible
      let barisTangible = mergeJenisWoStart;
      worksheet.mergeCells(`A${mergeJenisWoStart}:A${mergeJenisWoEnd}`);
      worksheet.getCell(`A${mergeJenisWoStart}`).value = "Tangible"; // Menetapkan nilai
      mergeJenisWoStart = mergeJenisWoEnd + 1; // Baris setelah tangible

      // Gabungkan sel untuk valins
      mergeJenisWoEnd = mergeJenisWoStart + jumlahValins - 1; // Akhir untuk valins
      let barisValins = mergeJenisWoStart;
      worksheet.mergeCells(`A${mergeJenisWoStart}:A${mergeJenisWoEnd}`);
      worksheet.getCell(`A${mergeJenisWoStart}`).value = "Valins"; // Menetapkan nilai

      // Proses data proman
      promanData.forEach((item) => {
        if (
          item.date ===
          `${selectedYear}-${selectedMonth}-${String(day).padStart(2, "0")}`
        ) {
          item.promanData.forEach((proman) => {
            const petugasIds = proman.petugas.map((p) => p._id);
            const category = proman.promanCategory;

            // Tentukan baris yang digunakan untuk kategori ini
            let targetRow;
            if (
              category === "Regular" ||
              category === "HVC" ||
              category === "SQM" ||
              category === "Infracare"
            ) {
              targetRow = barisTiket;
            } else if (category === "Lapsung" || category === "Monet") {
              targetRow = barisLapsung;
            } else if (category === "Unspec") {
              targetRow = barisUnspec;
            } else if (category === "Tangible") {
              targetRow = barisTangible;
            } else if (category === "Valins") {
              targetRow = barisValins;
            }

            // Proses setiap petugas
            petugasIds.forEach((petugasId, index) => {
              // Mencari pegawai apakah ada di jadwal pagi atau piket
              const pegawaiIndexPagi = pagi.findIndex(
                (pegawaiId) => pegawaiId === petugasId
              );
              const pegawaiIndexPiket = piket.findIndex(
                (pegawaiId) => pegawaiId === petugasId
              );

              let columnLetter;

              // Tentukan kolom berdasarkan posisi di jadwal pagi atau piket
              if (pegawaiIndexPagi !== -1) {
                columnLetter = String.fromCharCode(66 + pegawaiIndexPagi); // 66 untuk 'B'
              } else if (pegawaiIndexPiket !== -1) {
                columnLetter = String.fromCharCode(
                  66 + pagi.length + pegawaiIndexPiket
                ); // Setelah kolom pagi
              } else {
                return; // Skip jika tidak ditemukan di pagi atau piket
              }

              // Cek apakah baris target sudah diisi
              const isRowFilled = worksheet.getCell(
                `${columnLetter}${targetRow}`
              ).value;

              // Isi promanName ke dalam sel
              worksheet.getCell(`${columnLetter}${targetRow}`).value =
                proman.promanName; // Menetapkan nama proman
            });

            // Increment baris untuk kategori yang sesuai setelah semua petugas diisi
            if (
              category === "Regular" ||
              category === "HVC" ||
              category === "SQM" ||
              category === "Infracare"
            ) {
              barisTiket++;
            } else if (category === "Lapsung" || category === "Monet") {
              barisLapsung++;
            } else if (category === "Unspec") {
              barisUnspec++;
            } else if (category === "Tangible") {
              barisTangible++;
            } else if (category === "Valins") {
              barisValins++;
            }
          });
        }
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Jadwal_Pegawai.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
    // } catch {
    // alert(
    //   "Terjadi kesalahan silahkan coba periksa apakah anda sudah memasukan jadwal pegawai pada bulan ini"
    // );
    // }
  };

  return (
    <div>
      <h1>Jadwal Pegawai</h1>
      <button onClick={exportPromanToExcel}>Export Jadwal</button>
    </div>
  );
};

export default ExportProman;
