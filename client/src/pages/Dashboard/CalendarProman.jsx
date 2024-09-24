import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { getAllPegawai } from "../../api/PegawaiAPI";
import ModalInputProman from "../../components/Modals/ModalInputProman";
import { getAllProman } from "../../api/PromanAPI";

const CalendarProman = () => {
  const navigate = useNavigate();
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth());
  const [year, setYear] = useState(currentDate.getFullYear());
  const [promanData, setPromanData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pegawai, setPegawai] = useState([]);
  const [counts, setCounts] = useState({});
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
    };

    const filteredProman = filterPromanByMonth(promanData, month, year);

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

  useEffect(() => {
    fetchPegawai();
    fetchPromanData();
  }, [month, year]);

  useEffect(() => {
    setCounts(calculatePromanCounts());
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

        <ModalInputProman
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />

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
              <tr className="grid grid-cols-7">{calendarDays}</tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 rounded-sm  border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
        <div className="flex flex-col gap-10 mb-6">
          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
            <div className="flex justify-between items-center mb-6">
              <h4 className="mb-6 text-xl font-semibold text-black ">
                Performasi Teknisi CJA Bulan : {monthNames[month]}
              </h4>
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
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarProman;
