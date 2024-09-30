import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { getAllPegawai } from "../../api/PegawaiAPI";
import ModalInputProman from "../../components/Modals/ModalInputProman";
import { getAllProman } from "../../api/PromanAPI";
import ExcelJS from "exceljs";
import axios from "axios";

const CalendarProman = () => {
  const navigate = useNavigate();
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth());
  const [year, setYear] = useState(currentDate.getFullYear());
  const [promanData, setPromanData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pegawai, setPegawai] = useState([]);
  const [counts, setCounts] = useState({});
  const [totalClose, setTotalClose] = useState([]);
  const [jadwalPegawai, setJadwalPegawai] = useState([]);
  const [totals, setTotals] = useState({
    regular: 0,
    hvc: 0,
    sqm: 0,
    monet: 0,
    unspec: 0,
    lapsung: 0,
    infracare: 0,
    tangible: 0,
    valins: 0,
  });

  const [totalClosed, setTotalClosed] = useState({
    regular: 0,
    hvc: 0,
    sqm: 0,
    monet: 0,
    unspec: 0,
    lapsung: 0,
    infracare: 0,
    tangible: 0,
    valins: 0,
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = (inputValue) => {
    setPegawai([...pegawai, inputValue]);
    closeModal();
  };

  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const getDaysInMonth = (month, year) =>
    new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const changeMonth = (offset) => {
    let newMonth = month + offset;
    let newYear = year;

    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }

    setMonth(newMonth);
    setYear(newYear);
  };

  const handleDateClick = (day) => {
    const formattedMonth = (month + 1).toString().padStart(2, "0");
    const formattedDay = day.toString().padStart(2, "0");
    navigate(`/proman?date=${year}-${formattedMonth}-${formattedDay}`);
  };

  const calendarDays = [];
  const daysInMonth = getDaysInMonth(month, year);
  const firstDayOfMonth = getFirstDayOfMonth(month, year);

  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-12 "></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(
      <div
        key={day}
        onClick={() => handleDateClick(day)}
        className="h-12  rounded flex justify-center items-center text-gray-700 cursor-pointer text-black hover:bg-blue-300"
      >
        {day}
      </div>
    );
  }

  const filterPromanByMonth = (data, month, year) => {
    return data.filter((proman) => {
      const promanDate = new Date(proman.date);
      return (
        promanDate.getMonth() === month && promanDate.getFullYear() === year
      );
    });
  };

  const calculatePromanCounts = () => {
    const counts = {};
    const totals = {
      regular: 0,
      hvc: 0,
      sqm: 0,
      monet: 0,
      unspec: 0,
      lapsung: 0,
      infracare: 0,
      tangible: 0,
      valins: 0,
      closed: 0,
    };

    const filteredProman = filterPromanByMonth(promanData, month, year);

    totals.closed = filteredProman.reduce((total, proman) => {
      return proman.status === "Close" ? total + 1 : total;
    }, 0);

    filteredProman.forEach((proman) => {
      proman.promanData.forEach((entry) => {
        const category = entry.promanCategory.toLowerCase();
        if (totals[category] !== undefined) {
          totals[category] += 1; // Hitung total setiap kategori
        }

        entry.petugas.forEach((pegawai) => {
          if (!counts[pegawai.name]) {
            counts[pegawai.name] = {
              regular: 0,
              hvc: 0,
              sqm: 0,
              monet: 0,
              unspec: 0,
              lapsung: 0,
              infracare: 0,
              tangible: 0,
              valins: 0,
            };
          }
          if (counts[pegawai.name][category] !== undefined) {
            counts[pegawai.name][category] += 1;
          }
        });
      });
    });

    setTotals(totals);
    return counts;
  };

  const calculateTotalClose = () => {
    const counts = {};
    const closed = {
      regular: 0,
      hvc: 0,
      sqm: 0,
      monet: 0,
      unspec: 0,
      lapsung: 0,
      infracare: 0,
      tangible: 0,
      valins: 0,
      totalClosed: 0, // Tambahkan properti total closed
    };

    const filteredProman = filterPromanByMonth(promanData, month, year);

    filteredProman.forEach((proman) => {
      proman.promanData.forEach((entry) => {
        const category = entry.promanCategory.toLowerCase();

        // Hitung jumlah close per kategori
        if (
          entry.status.toLowerCase() === "close" &&
          closed[category] !== undefined
        ) {
          closed[category] += 1; // Tambahkan jumlah close untuk kategori
          closed.totalClosed += 1; // Tambahkan ke total closed
        }

        // Hitung total jumlah untuk setiap kategori
        if (counts[category] === undefined) {
          counts[category] = 0;
        }
        counts[category] += 1; // Hitung total setiap kategori

        // Hitung jumlah per pegawai dalam kategori
        entry.petugas.forEach((pegawai) => {
          const pegawaiName = pegawai.name.toLowerCase();
          if (!counts[pegawaiName]) {
            counts[pegawaiName] = {
              regular: 0,
              hvc: 0,
              sqm: 0,
              monet: 0,
              unspec: 0,
              lapsung: 0,
              infracare: 0,
              tangible: 0,
              valins: 0,
            };
          }
          if (counts[pegawaiName][category] !== undefined) {
            counts[pegawaiName][category] += 1; // Tambahkan jumlah pegawai per kategori
          }
        });
      });
    });

    setTotalClosed(closed); // Simpan hasil closed
    return counts; // Kembalikan counts untuk setiap pegawai
  };

  const fetchPegawai = async () => {
    try {
      const data = await getAllPegawai();
      setPegawai(data.data);
    } catch (error) {
      console.error("Error fetching pegawai:", error);
    }
  };

  const fetchPromanData = async () => {
    try {
      const data = await getAllProman(month, year);
      setPromanData(data);
    } catch (error) {
      console.error("Error fetching proman data:", error);
    }
  };

  const fetchJadwalData = async (month, year) => {
    const month1 = month + 1;
    const jadwalResponse = await axios.get(
      `${
        import.meta.env.VITE_API_BACKEND_MONGODB
      }/getJadwalPegawai?month=${month1}&year=${year}`
    );
    if (!jadwalPegawai) {
      return setJadwalPegawai(null);
    } else {
      return setJadwalPegawai(jadwalResponse.data.data);
    }
  };

  const exportExcelKPI = async () => {
    // Memproses data pegawai dan kategori
    const data = Object.keys(counts).map((pegawaiName, index) => {
      const row = {
        No: index + 1, // Menambahkan nomor urut
        Pegawai: pegawaiName,
      };

      let totalWo = 0;

      // Iterasi kategori
      Object.keys(counts[pegawaiName]).forEach((category) => {
        row[category] = counts[pegawaiName][category] || 0;
        totalWo += counts[pegawaiName][category] || 0;
      });

      // Menambahkan kolom Total WO dan Persentase
      row["Total WO"] = totalWo;
      row["Persentase"] = ((totalWo / 50) * 100).toFixed(2) + "%";

      return row;
    });

    // Membuat workbook dan worksheet baru
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // Menambahkan judul di baris pertama
    worksheet.mergeCells("A1:M1");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = `PERFORMANSI TEKNISI CJA 1 BULAN ${monthNames[month]} Tahun ${year}`;
    titleCell.font = { name: "Arial", size: 14, bold: true };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };

    // Menambahkan header kolom pada baris kedua
    const headerRow = worksheet.addRow([
      "No",
      "Pegawai",
      "Regular",
      "HVC",
      "SQM",
      "Monet",
      "Unspect",
      "Lapsung",
      "Infracare",
      "Tangible",
      "Valins",
      "Total WO",
      "Persentase",
    ]);

    // Mengatur font dan alignment untuk header
    headerRow.eachCell((cell) => {
      cell.font = { name: "Arial", size: 12, bold: true };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      // Menambahkan border
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Menambahkan data pegawai mulai dari baris ketiga
    data.forEach((rowData) => {
      const row = worksheet.addRow(Object.values(rowData));
      row.eachCell((cell) => {
        cell.font = { name: "Arial", size: 12 };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        // Menambahkan border
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // Set lebar kolom
    worksheet.columns.forEach((column) => {
      column.width = 15;
    });

    // Menyimpan file Excel
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `KPI TEKNISI TAHUN ${year}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    console.log("File Excel telah berhasil disimpan.");
  };

  const exportPromanToExcel = async () => {
    try {
      const selectedMonth = String(month + 1).padStart(2, "0");
      const selectedYear = year;
      console.log(selectedMonth, selectedYear);
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

      for (let day = 1; day <= daysInMonth; day++) {
        // for (let day = 1; day <= 8; day++) {
        const worksheet = workbook.addWorksheet(
          `${String(day).padStart(2, "0")} ${monthNames[month]} ${selectedYear}`
        );

        const filteredData = jadwalPegawai.filter(
          (item) => item.date === String(day)
        );
        const pagi = filteredData[0]?.schedule[0]?.pagi || [];
        const piket = filteredData[0]?.schedule[0]?.piket || [];
        const jumlahKolom = pagi.length + piket.length;
        const G = String.fromCharCode(65 + jumlahKolom);
        let mergeCellRange;
        if (!G) {
          mergeCellRange = `B1:G1`;
        } else {
          mergeCellRange = `B1:${G}1`;
        }

        console.log(`Mencoba menggabungkan sel: ${mergeCellRange}`);
        try {
          worksheet.mergeCells(mergeCellRange);
          worksheet.getCell("B1").value = "Progress Closing Harian";
        } catch (error) {
          console.warn(
            `Sel sudah digabung sebelumnya: ${mergeCellRange}`,
            error
          );
        }

        worksheet.mergeCells("A1:A2");
        worksheet.getCell("A1").value = `Tanggal ${String(day).padStart(
          2,
          "0"
        )}/${selectedMonth}/${selectedYear}`;

        if (pagi.length > 0) {
          const headerPagiRange = `B2:${String.fromCharCode(
            65 + pagi.length
          )}2`;
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
          console.log(
            `Mencoba menggabungkan header piket: ${headerPiketRange}`
          );
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
              pegawai.find((p) => p._id === pegawaiId)?.name ||
              "Tidak Ditemukan"
            );
          }),
          ...piket.map((pegawaiId) => {
            return (
              pegawai.find((p) => p._id === pegawaiId)?.name ||
              "Tidak Ditemukan"
            );
          }),
        ];

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
        // ========================
        worksheet.columns.forEach((column, index) => {
          column.width = 20; // Ukuran kolom
        });

        worksheet.eachRow((row) => {
          row.eachCell((cell) => {
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
            cell.alignment = { vertical: "middle", horizontal: "center" }; // Pusatkan teks
          });
        });

        // ===========================
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Laporan Proman Bulan ${monthNames[month]} Tahun ${year}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert(
        "Terjadi kesalahan silahkan coba periksa apakah anda sudah memasukan jadwal pegawai pada bulan ini"
      );
    }
  };

  useEffect(() => {
    fetchPegawai();
    fetchPromanData();
    fetchJadwalData(month, year);
  }, [month, year]);

  useEffect(() => {
    setCounts(calculatePromanCounts());
    setTotalClose(calculateTotalClose());
  }, [promanData, month, year]);

  return (
    <div>
      <Breadcrumb pageName="Calendar" />
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg text-black font-bold mb-4">
            {monthNames[month]} {year}
          </h2>
          <button
            onClick={openModal}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Tambah Proman
          </button>
        </div>
        <div className="flex justify-end mb-4">
          <button
            onClick={exportPromanToExcel}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Export Proman
          </button>
        </div>

        <ModalInputProman
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />

        <div className="w-full mb-4 max-w-full rounded-sm border border-stroke bg-white shadow-default">
          <table className="w-full">
            <thead>
              <tr className="grid grid-cols-7 rounded-t-sm bg-primary text-white">
                {[
                  "Minggu",
                  "Senin",
                  "Selasa",
                  "Rabu",
                  "Kamis",
                  "Jum'at",
                  "Sabtu",
                ].map((day, index) => (
                  <th
                    key={index}
                    className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5"
                  >
                    <span className="block">{day}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="grid grid-cols-7">{calendarDays}</tr>
            </tbody>
          </table>
        </div>
        <div className="flex justify-between mb-4">
          <button
            onClick={() => changeMonth(-1)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Bulan Sebelumnya
          </button>
          <button
            onClick={() => changeMonth(1)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Bulan Selanjutnya
          </button>
        </div>
      </div>

      <div className="mt-8 rounded-sm  border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
        <div className="flex flex-col gap-10 mb-6">
          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
            <div className="flex justify-between items-center mb-6">
              <h4 className="mb-6 text-xl font-semibold text-black ">
                Performasi Teknisi CJA Bulan : {monthNames[month]}
              </h4>
              <button
                onClick={exportExcelKPI}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Export data KPI
              </button>
            </div>

            <table className="w-full table-auto ml">
              <thead>
                <tr className="bg-gray-2 text-left">
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black xl:pl-11">
                    Nama Teknisi
                  </th>
                  <th className="py-4 px-4 font-medium text-black">Regular</th>
                  <th className="py-4 px-4 font-medium text-black">HVC</th>
                  <th className="py-4 px-4 font-medium text-black">SQM</th>
                  <th className="py-4 px-4 font-medium text-black">Monet</th>
                  <th className="py-4 px-4 font-medium text-black">Unspec</th>
                  <th className="py-4 px-4 font-medium text-black">Lapsung</th>
                  <th className="py-4 px-4 font-medium text-black">
                    Infracare
                  </th>
                  <th className="py-4 px-4 font-medium text-black">Tangible</th>
                  <th className="py-4 px-4 font-medium text-black">Valins</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(counts).map((pegawaiName) => (
                  <tr key={pegawaiName}>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 text-black">
                      {pegawaiName}
                    </td>
                    {Object.keys(counts[pegawaiName]).map((category) => (
                      <td
                        key={category}
                        className="border-b text-center  border-[#eee] py-5 px-4 text-black"
                      >
                        {counts[pegawaiName][category]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <hr className="size-full" />
              <tfoot>
                <tr className="bg-gray-100 font-bold text-black">
                  <td className="border-t border-gray-300 py-4 px-4 pl-9">
                    Total Proman
                  </td>
                  <td className="border-t border-gray-300 text-center py-4 px-4">
                    {totals.regular}
                  </td>
                  <td className="border-t border-gray-300 text-center py-4 px-4">
                    {totals.hvc}
                  </td>
                  <td className="border-t border-gray-300 text-center py-4 px-4">
                    {totals.sqm}
                  </td>
                  <td className="border-t border-gray-300 text-center py-4 px-4">
                    {totals.monet}
                  </td>
                  <td className="border-t border-gray-300 text-center py-4 px-4">
                    {totals.unspec}
                  </td>
                  <td className="border-t border-gray-300 text-center py-4 px-4">
                    {totals.lapsung}
                  </td>
                  <td className="border-t border-gray-300 text-center py-4 px-4">
                    {totals.infracare}
                  </td>
                  <td className="border-t border-gray-300 text-center py-4 px-4">
                    {totals.tangible}
                  </td>
                  <td className="border-t border-gray-300  text-center py-4 px-4">
                    {totals.valins}
                  </td>
                </tr>
                <hr className="size-full" />
                <tr className="bg-gray-100 font-bold text-black">
                  <td className="border-t border-gray-300 py-4 px-4 pl-9">
                    Total Close
                  </td>
                  <td className="border-t border-gray-300 text-center py-4 px-4">
                    {totalClosed.regular}
                  </td>
                  <td className="border-t border-gray-300 text-center py-4 px-4">
                    {totalClosed.hvc}
                  </td>
                  <td className="border-t border-gray-300 text-center py-4 px-4">
                    {totalClosed.sqm}
                  </td>
                  <td className="border-t border-gray-300 text-center py-4 px-4">
                    {totalClosed.monet}
                  </td>
                  <td className="border-t border-gray-300 text-center py-4 px-4">
                    {totalClosed.unspec}
                  </td>
                  <td className="border-t border-gray-300 text-center py-4 px-4">
                    {totalClosed.lapsung}
                  </td>
                  <td className="border-t border-gray-300 text-center py-4 px-4">
                    {totalClosed.infracare}
                  </td>
                  <td className="border-t border-gray-300 text-center py-4 px-4">
                    {totalClosed.tangible}
                  </td>
                  <td className="border-t border-gray-300  text-center py-4 px-4">
                    {totalClosed.valins}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarProman;
