import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";

const initialEmployees = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Michael Brown" },
  { id: 4, name: "Emily White" },
];

const JadwalPegawai = () => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employees, setEmployees] = useState(initialEmployees);
  const [schedule, setSchedule] = useState({
    pagi: [],
    piket: [],
    libur: [],
  });

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
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSchedule({ pagi: [], piket: [], libur: [] });
    setEmployees(initialEmployees); // Reset employees when modal is closed
  };

  const saveSchedule = async () => {
    const scheduleData = {
      date: selectedDate,
      month,
      year,
      schedule,
    };

    console.log(scheduleData);

    // Send data to MongoDB via API
    // await axios.post("http://localhost:5000/schedule", scheduleData);
    // closeModal();
  };

  const renderCalendarDays = () => {
    const totalDays = daysInMonth(month, year);
    const firstDay = firstDayOfMonth(month, year);
    const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
    const emptyCells = Array(firstDay).fill(null);

    return [...emptyCells, ...daysArray].map((day, index) => (
      <div
        key={index}
        onClick={() => openModal(day)}
        className="flex items-center justify-center h-20 p-2 border border-stroke text-black cursor-pointer"
      >
        {day}
      </div>
    ));
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
        className={`p-2 border border-black text-black mb-4 ${
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
                (emp) => emp.id !== item.id
              );
            }
          });

          return updatedSchedule;
        });

        // Remove employee from list when dropped
        setEmployees((prev) => prev.filter((emp) => emp.id !== item.id));
      },
    });

    return (
      <div ref={drop} className="p-4 border rounded-lg min-h-[200px]">
        <h3 className="font-semibold capitalize text-black">{type}</h3>
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
            [type]: prev[type].filter((e) => e.id !== item.id), // Remove from current area
          };

          // Add the employee back to the available list
          setEmployees((prevEmployees) => [...prevEmployees, item]);
          return updatedSchedule;
        });
      },
    });

    return (
      <div ref={drop} className="p-2 border mb-4 border-black text-black">
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
            pagi: prev.pagi.filter((e) => e.id !== item.id),
            piket: prev.piket.filter((e) => e.id !== item.id),
            libur: prev.libur.filter((e) => e.id !== item.id),
          };
          return updatedSchedule;
        });
      },
    });

    return (
      <div ref={drop} className="mb-4 p-4 border rounded-lg min-h-[150px]">
        <h3 className="font-semibold text-black">Daftar Pegawai</h3>
        {employees.map((employee) => (
          <DraggableEmployee key={employee.id} employee={employee} />
        ))}
      </div>
    );
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
      <div className="flex justify-between mb-4">
        <h2 className="text-lg text-black font-bold mb-4">
          {monthNames[month]} {year}
        </h2>
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
          <div className="relative w-full max-w-lg bg-white rounded-lg shadow-lg">
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

            {/* Modal Footer */}
            <div className="flex justify-end p-4 border-t">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-black bg-gray-200 rounded hover:bg-gray-300 mr-2"
              >
                Batal
              </button>
              <button
                onClick={saveSchedule}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JadwalPegawai;
