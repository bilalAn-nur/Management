import React, { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { getAllPegawai } from "../../api/PegawaiAPI";
import axios from "axios";

<<<<<<< HEAD
import ExcelJS from "exceljs";

const JadwalPegawai = () => {
  const getDayName = (date) => {
    const days = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    return days[new Date(date).getDay()];
  };

=======
const JadwalPegawai = () => {
>>>>>>> e8c714178cae1d0de80a4d23f7fda2e67e4efbd3
  const getSchedulesForMonth = async (month, year) => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_BACKEND_MONGODB +
          `/getJadwalPegawai?month=${month}&year=${year}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching schedules:", error);
      throw error;
    }
  };

  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
<<<<<<< HEAD

  const [jadwalData, setJadwalData] = useState([]);
  const [pegawaiData, setPegawaiData] = useState([]);

=======
>>>>>>> e8c714178cae1d0de80a4d23f7fda2e67e4efbd3
  const [employees, setEmployees] = useState([]);
  const [schedule, setSchedule] = useState({
    pagi: [],
    piket: [],
    libur: [],
  });
  const [scheduleId, setScheduleId] = useState(null);

  const [schedules, setSchedules] = useState([]);
  const [isScheduleExists, setIsScheduleExists] = useState(false);

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

  useEffect(() => {
    const fetchEmployees = async () => {
      const month1 = month + 1;
      const employeesData = await getAllPegawai();
      setEmployees(employeesData.data);
      const schedulesData = await getSchedulesForMonth(month1, year);
      setSchedules(schedulesData.data || []);
    };

<<<<<<< HEAD
    const fetchJadwalData = async (month, year) => {
      try {
        const jadwalResponse = await axios.get(
          `${
            import.meta.env.VITE_API_BACKEND_MONGODB
          }/getJadwalPegawai?month=${month}&year=${year}`
        );
        setJadwalData(jadwalResponse.data.data);
        console.log("Jadwal Data:", jadwalResponse.data.data); // Debugging

        const pegawaiResponse = await axios.get(
          `${import.meta.env.VITE_API_BACKEND_MONGODB}/getAllPegawai`
        );
        setPegawaiData(pegawaiResponse.data.data);
        console.log("Pegawai Data:", pegawaiResponse.data.data); // Debugging
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchJadwalData(month + 1, year);
    // console.log(month, year);

=======
>>>>>>> e8c714178cae1d0de80a4d23f7fda2e67e4efbd3
    fetchEmployees();
  }, [month, year]);

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const changeMonth = (direction) => {
    let newMonth = month + direction;
    let newYear = year;

    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }

    setMonth(newMonth);
    setYear(newYear);
  };

  const openModal = (day) => {
    setSelectedDate(day);

    const selectedSchedule = schedules.find(
      (schedule) =>
        schedule.date === String(day) &&
        schedule.month === String(month + 1) &&
        schedule.year === String(year)
    );

    const scheduledEmployees1 = selectedSchedule?.schedule[0] || {
      pagi: [],
      piket: [],
      libur: [],
    };

    // Simpan _id dari schedule jika ada
    if (selectedSchedule) {
      setScheduleId(selectedSchedule._id);
    }

    setSchedule(scheduledEmployees1);

    // Cek apakah jadwal sudah ada
    if (
      scheduledEmployees1.pagi.length > 0 ||
      scheduledEmployees1.piket.length > 0 ||
      scheduledEmployees1.libur.length > 0
    ) {
      setIsScheduleExists(true);
    } else {
      setIsScheduleExists(false);
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSchedule({ pagi: [], piket: [], libur: [] });
    setScheduleId(null); // Reset scheduleId ketika modal ditutup
  };

  const saveSchedule = async () => {
    try {
      const handleMonth = month + 1;
      const scheduleData = {
        date: selectedDate,
        month: handleMonth,
        year,
        schedule,
      };

      // Send data to MongoDB via API
      await axios.post(
        import.meta.env.VITE_API_BACKEND_MONGODB + "/addJadwalPegawai",
        scheduleData
      );
      alert("Jadwal berhasil disimpan");
      window.location.reload();
    } catch (error) {
      console.error("Terjadi kesalahan ", error);
    }
    closeModal();
  };

  const deleteSchedule = async () => {
    try {
      if (!scheduleId) {
        alert("Tidak ada jadwal yang dipilih untuk dihapus.");
        return;
      }

      const response = await axios.post(
        `${
          import.meta.env.VITE_API_BACKEND_MONGODB
        }/deleteJadwalPegawai?jadwalPegawaiId=${scheduleId}`
      );

      if (response.status === 200) {
        alert("Jadwal berhasil dihapus");
      } else {
        alert("Gagal menghapus jadwal, coba lagi.");
      }

      window.location.reload();
    } catch (error) {
      console.error("Terjadi kesalahan: ", error);
      alert("Terjadi kesalahan saat menghapus jadwal");
    } finally {
      closeModal(); // Tutup modal setelah jadwal dihapus
    }
  };

  const renderCalendarDays = () => {
    const totalDays = daysInMonth(month, year);
    const firstDay = firstDayOfMonth(month, year);
    const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
    const emptyCells = Array(firstDay).fill(null);

    return [...emptyCells, ...daysArray].map((day, index) => {
      const isScheduled = schedules.some((schedule) => {
        return (
          schedule.date === String(day) &&
          schedule.month === String(month + 1) &&
          schedule.year === String(year)
        );
      });

      const scheduledEmployees = schedules.find(
        (schedule) =>
          schedule.date === String(day) &&
          schedule.month === String(month + 1) &&
          schedule.year === String(year)
      )?.schedule[0] || { pagi: [], piket: [], libur: [] };

      // schedules.forEach((schedule) => {
      //   console.log("Memeriksa jadwal: ", schedule);
      //   if (
      //     schedule.date === String(day) &&
      //     schedule.month === String(month + 1) &&
      //     schedule.year === String(year)
      //   ) {
      //     console.log("ID jadwal yang cocok: ", schedule._id);
      //   }
      // });

      return (
        <div
          key={index}
          onClick={() => openModal(day)}
          className={`flex flex-col items-center justify-center h-20 p-2 border border-stroke text-black cursor-pointer ${
            isScheduled ? "bg-yellow-300" : ""
          }`}
        >
          <span>{day}</span>
          {isScheduled && scheduledEmployees && (
            <div className="text-xs  items-center">
              <span className="text-green-600">
                💼 {scheduledEmployees.pagi.length}
              </span>
              <span className="text-blue-600 ml-3">
                🌃 {scheduledEmployees.piket.length}
              </span>
              <span className="text-red-600 ml-3">
                🏖️ {scheduledEmployees.libur.length}
              </span>
            </div>
          )}
        </div>
      );
    });
  };

  const DraggableEmployee = ({ employee }) => {
    const [{ isDragging }, drag] = useDrag({
      type: "EMPLOYEE",
      item: employee,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    });

    return (
      <div
        ref={drag}
        className={`p-2 border rounded-md border-black text-black mb-4 ${
          isDragging ? "opacity-50" : ""
        }`}
      >
        {employee.name}
      </div>
    );
  };

  const DroppableArea = ({ type }) => {
    const [, drop] = useDrop({
      accept: "EMPLOYEE",
      drop: (item) => {
        setSchedule((prev) => {
          // Remove employee from previous type
          const updatedSchedule = {
            ...prev,
            [type]: [...prev[type], item],
          };

          // Remove employee from all areas
          Object.keys(updatedSchedule).forEach((key) => {
            if (key !== type) {
              updatedSchedule[key] = updatedSchedule[key].filter(
                (emp) => emp._id !== item._id
              );
            }
          });

          return updatedSchedule;
        });

        // Remove employee from list when dropped
        setEmployees((prev) => prev.filter((emp) => emp._id !== item._id));
      },
    });

    return (
      <div ref={drop} className="p-4 border rounded-lg min-h-[200px]">
        <h3 className="font-semibold rounded-md capitalize text-black">
          {type}
        </h3>
        {schedule[type].map((emp, index) => (
          <RemovableEmployee key={index} emp={emp} type={type} />
        ))}
      </div>
    );
  };

  const RemovableEmployee = ({ emp, type }) => {
    const [{ isDragging }, drag] = useDrag({
      type: "EMPLOYEE",
      item: emp,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    });

    const [, drop] = useDrop({
      accept: "EMPLOYEE",
      drop: (item) => {
        setSchedule((prev) => {
          const updatedSchedule = {
            ...prev,
            [type]: prev[type].filter((e) => e._id !== item._id), // Remove from current area
          };

          // Add the employee back to the available list
          setEmployees((prevEmployees) => [...prevEmployees, item]);
          return updatedSchedule;
        });
      },
    });

    return (
      <div
        ref={drop}
        className="p-2 rounded-md border mb-4 border-black text-black"
      >
        <div ref={drag}>{emp.name}</div>
      </div>
    );
  };

  const DroppableEmployeeList = () => {
    const [, drop] = useDrop({
      accept: "EMPLOYEE",
      drop: (item) => {
        // Add the employee back to the list
        setEmployees((prev) => [...prev, item]);
        // Remove the employee from the current schedule
        setSchedule((prev) => {
          const updatedSchedule = {
            ...prev,
            pagi: prev.pagi.filter((e) => e._id !== item._id),
            piket: prev.piket.filter((e) => e._id !== item._id),
            libur: prev.libur.filter((e) => e._id !== item._id),
          };
          return updatedSchedule;
        });
      },
    });

    return (
      <div ref={drop} className="mb-4 p-4 border rounded-lg min-h-[150px]">
        <h3 className="font-semibold text-black">Daftar Pegawai</h3>
        {employees.map((employee) => (
          <DraggableEmployee key={employee._id} employee={employee} />
        ))}
      </div>
    );
  };

  const getExcelColumnLabel = (index) => {
    let columnLabel = "";
    while (index >= 0) {
      columnLabel = String.fromCharCode((index % 26) + 65) + columnLabel;
      index = Math.floor(index / 26) - 1;
    }
    return columnLabel;
  };

  const exportJadwalToExcel = async () => {
    if (!jadwalData.length || !pegawaiData.length) {
      console.error("Data jadwal atau pegawai tidak ditemukan");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Jadwal Pegawai");

    // Judul di A1
    worksheet.mergeCells("A1:AL1");
    worksheet.mergeCells("A2:A3"); // Kolom No
    worksheet.mergeCells("B2:B3"); // Kolom NIK
    worksheet.mergeCells("C2:C3"); // Kolom Nama
    worksheet.mergeCells("D2:D3"); // Kolom Sektor
    worksheet.mergeCells("E2:E3"); // Kolom Teknisi
    worksheet.mergeCells("F2:F3"); // Kolom No HP
    worksheet.mergeCells("G2:G3"); // Kolom Mitra
    worksheet.getCell("A1").value =
      `JADWAL TEKNISI IOAN ` + monthNames[month] + ` RKB CJA 1 ` + year;
    worksheet.getCell("A1").alignment = { horizontal: "center" };

    // Mendapatkan jumlah hari dalam bulan yang sedang diproses
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Ini menghitung jumlah hari di bulan

    // Header di A2
    const headers = [
      "No",
      "NIK",
      "Nama",
      "Sektor",
      "Teknisi",
      "No HP",
      "Mitra",
      ...Array.from({ length: daysInMonth }, (_, i) =>
        getDayName(new Date(year, month, i + 1))
      ),
    ];

    const headerTanggal = [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      ...Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`), // Buat header berdasarkan jumlah hari dalam bulan
    ];

    worksheet.getRow(2).values = headers;
    worksheet.getRow(3).values = headerTanggal;

    // Menambahkan border untuk header
    const borderStyle = {
      top: { style: "thin", color: { argb: "FF000000" } },
      left: { style: "thin", color: { argb: "FF000000" } },
      bottom: { style: "thin", color: { argb: "FF000000" } },
      right: { style: "thin", color: { argb: "FF000000" } },
    };

    // Set border untuk header
    worksheet.getRow(2).eachCell((cell) => {
      cell.border = borderStyle;
    });
    worksheet.getRow(3).eachCell((cell) => {
      cell.border = borderStyle;
    });

    let rowIndex = 4;

    // Loop melalui data pegawai
    pegawaiData.forEach((pegawai, index) => {
      // Tambahkan baris pegawai baru
      const addedRow = worksheet.addRow([
        index + 1, // No
        pegawai.nik, // NIK
        pegawai.name, // Nama
        pegawai.sektor, // Sektor
        pegawai.teknisi, // Teknisi
        pegawai.nohp, // No HP
        pegawai.mitra, // Mitra
      ]);

      // Set border untuk baris pegawai
      addedRow.eachCell((cell) => {
        cell.border = borderStyle;
      });

      // Loop melalui data jadwal untuk mengisi shift di kolom tanggal
      jadwalData.forEach((scheduleItem) => {
        const tanggal = parseInt(scheduleItem.date); // Mengambil tanggal dari jadwal
        if (scheduleItem.schedule[0]) {
          const shiftData = scheduleItem.schedule[0]; // Shift pagi, piket, libur

          const column = 7 + tanggal - 1; // Kolom dimulai dari tanggal pertama
          const H = getExcelColumnLabel(column); // Menggunakan fungsi baru untuk nama kolom
          const empat = addedRow.number;
          console.log(H, empat);
          const cell = worksheet.getCell(`${H}${empat}`);

          if (shiftData.pagi && shiftData.pagi.includes(pegawai._id)) {
            cell.value = "M"; // Kolom untuk pagi
          } else if (shiftData.piket && shiftData.piket.includes(pegawai._id)) {
            cell.value = "P"; // Kolom untuk piket
            // Set warna latar belakang untuk "Piket"
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FF00FF00" }, // Hijau
            };
          } else if (shiftData.libur && shiftData.libur.includes(pegawai._id)) {
            cell.value = "L"; // Kolom untuk libur
            // Set warna latar belakang untuk "Libur"
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFFF0000" }, // Merah
            };
          }

          // Set border untuk sel tanggal
          cell.border = borderStyle;
        }
      });

      rowIndex++; // Pindah ke baris berikutnya setelah pegawai selesai
    });

    // Simpan file Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download =
      `JADWAL TEKNISI IOAN ` + monthNames[month] + ` RKB CJA 1 Tahun ` + year;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
      <div className="flex justify-between mb-4">
        <h2 className="text-lg text-black font-bold mb-4">
          {monthNames[month]} {year}
        </h2>
        <button
          onClick={exportJadwalToExcel}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Export Jadwal Pegawai
        </button>
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
            <tr className="grid grid-cols-7">{renderCalendarDays()}</tr>
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-3xl mt-12 ml-50 bg-white rounded-lg shadow-lg">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h5 className="text-lg font-semibold text-black">
                Jadwal Pegawai pada {selectedDate} {monthNames[month]} {year}
              </h5>
              <button
                className="text-black hover:text-gray-700"
                onClick={closeModal}
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            {isScheduleExists ? (
              <div className="p-6 overflow-y-auto max-h-[70vh] ">
                <h3 className="text-sm font-semibold  text-black">
<<<<<<< HEAD
                  Jadwal Masuk:{" "}
=======
                  Jadwal Pagi:{" "}
>>>>>>> e8c714178cae1d0de80a4d23f7fda2e67e4efbd3
                </h3>
                {schedule.pagi.length > 0 ? (
                  schedule.pagi.map((empId, idx) => {
                    const employee = employees.find((emp) => emp._id === empId);
                    return (
                      <li className="ml-6 text-black" key={idx}>
                        {employee ? employee.name : "Unknown Employee"}
                        {employee.name.length < 0
                          ? "Tidak ada yang pegawai"
                          : ""}
                      </li>
                    );
                  })
                ) : (
                  <p className="text-black">
<<<<<<< HEAD
                    Pegawai tidak ada pada jadwal Masuk.
=======
                    Pegawai tidak ada pada jadwal pagi.
>>>>>>> e8c714178cae1d0de80a4d23f7fda2e67e4efbd3
                  </p>
                )}

                <h3 className="text-sm font-semibold mt-4  text-black">
                  Jadwal Piket:{" "}
                </h3>
                {schedule.piket.length > 0 ? (
                  schedule.piket.map((empId, idx) => {
                    const employee = employees.find((emp) => emp._id === empId);
                    return (
                      <li className="ml-6 text-black" key={idx}>
                        {employee ? employee.name : "Unknown Employee"}
                        {employee.name.length > 0 ? "" : "Tidak ada Pegawai"}
                      </li>
                    );
                  })
                ) : (
                  <p className="text-black">
                    Tidak ada pegawai yang sedang piket
                  </p>
                )}

                <h3 className="text-sm font-semibold mt-4 text-black">
                  Jadwal Libur:{" "}
                </h3>
                {schedule.libur.length > 0 ? (
                  schedule.libur.map((empId, idx) => {
                    const employee = employees.find((emp) => emp._id === empId);
                    return (
                      <li className="ml-6  text-black" key={idx}>
                        {employee ? employee.name : "Unknown Employee"}
                      </li>
                    );
                  })
                ) : (
                  <p className="text-black">
                    Tidak ada pegawai yang sedang libur.
                  </p>
                )}
              </div>
            ) : (
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <DndProvider backend={HTML5Backend}>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <DroppableArea type="pagi" />
                    <DroppableArea type="piket" />
                    <DroppableArea type="libur" />
                  </div>
                  {/* Droppable Area for Employee List */}
                  <DroppableEmployeeList />
                </DndProvider>
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex justify-end p-4 border-t">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-black bg-gray-200 rounded hover:bg-gray-300 mr-2"
              >
                Batal
              </button>
              {!isScheduleExists ? (
                <button
                  onClick={saveSchedule}
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Simpan
                </button>
              ) : (
                <button
                  onClick={() => deleteSchedule(schedules._id)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Hapus Jadwal
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      <div>
<<<<<<< HEAD
        <li className="text-green-600 ml-3">💼 : Jadwal Masuk</li>
=======
        <li className="text-green-600 ml-3">💼 : Jadwal Pagi</li>
>>>>>>> e8c714178cae1d0de80a4d23f7fda2e67e4efbd3
        <li className="text-blue-600 ml-3">🌃 : Jadwal Piket</li>
        <li className="text-red-600 ml-3 mb-4">🏖️ : Jadwal Libur</li>
      </div>
    </div>
  );
};

export default JadwalPegawai;
